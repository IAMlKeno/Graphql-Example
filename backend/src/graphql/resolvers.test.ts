import { beforeEach, describe, expect, it, vi } from 'vitest';

// --- Prisma mock (must come before resolvers import) ---
const mockPrisma = {
  users: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  quotes: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  incompletequotes: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  $on: vi.fn(),
};

vi.mock('telemetry/openobserve', () => ({
  sendToOpenObserve: vi.fn(),
}));

vi.mock('telemetry/logger', () => ({
  logger: {
    child: vi.fn().mockReturnValue({
      info: vi.fn(),
      debug: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    }),
    info: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('../../generated/prisma/client', () => ({
  PrismaClient: vi.fn(function () { return mockPrisma; }),
  insurance_type: {
    automotive: 'automotive',
    home: 'home',
    life: 'life',
  },
}));

vi.mock('../../generated/prisma/models', () => ({}));

const { resolvers } = await import('./resolvers');

// -------------------------------------------------------

beforeEach(() => {
  vi.clearAllMocks();
});

// -------------------------------------------------------
// Query: simple / in-memory resolvers
// -------------------------------------------------------
describe('Query.greeting', () => {
  it('returns Hello World', () => {
    expect(resolvers.Query.greeting()).toBe('Hello World');
  });
});

describe('Query.books', () => {
  it('returns the full book list', () => {
    const result = resolvers.Query.books();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty('id');
    expect(result[0]).toHaveProperty('title');
    expect(result[0]).toHaveProperty('author');
  });
});

describe('Query.book', () => {
  it('returns the matching book by id', () => {
    const book = resolvers.Query.book(null, { id: '1' });
    expect(book).toMatchObject({ id: '1', title: 'The Great Gatsby' });
  });

  it('throws when the book is not found', () => {
    expect(() => resolvers.Query.book(null, { id: 'nonexistent' })).toThrow('Book not found');
  });
});

describe('Query.searchBooks', () => {
  it('returns books matching by title', () => {
    const results = resolvers.Query.searchBooks(null, { query: 'Great Gatsby' });
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title).toContain('Great Gatsby');
  });

  it('returns books matching by author', () => {
    const results = resolvers.Query.searchBooks(null, { query: 'Harper Lee' });
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].author).toBe('Harper Lee');
  });

  it('is case-insensitive', () => {
    const results = resolvers.Query.searchBooks(null, { query: 'HARPER LEE' });
    expect(results.length).toBeGreaterThan(0);
  });

  it('throws when no books match', () => {
    expect(() =>
      resolvers.Query.searchBooks(null, { query: 'xyzzy-no-match' })
    ).toThrow('No matching books found');
  });
});

// -------------------------------------------------------
// Query: Prisma-backed resolvers
// -------------------------------------------------------
describe('Query.users', () => {
  it('returns users from the database', async () => {
    const fakeUsers = [{ id: 'u1', fname: 'Alice', lname: 'Smith', email: 'alice@test.com', dob: '1990-01-01' }];
    mockPrisma.users.findMany.mockResolvedValue(fakeUsers);
    const result = await resolvers.Query.users();
    expect(result).toEqual(fakeUsers);
    expect(mockPrisma.users.findMany).toHaveBeenCalledOnce();
  });

  it('returns empty array on database error', async () => {
    mockPrisma.users.findMany.mockRejectedValue(new Error('db error'));
    const result = await resolvers.Query.users();
    expect(result).toEqual([]);
  });
});

describe('Query.user', () => {
  it('returns the user for a given id', async () => {
    const fakeUser = { id: 'u1', fname: 'Alice' };
    mockPrisma.users.findUnique.mockResolvedValue(fakeUser);
    const result = await resolvers.Query.user(null, { id: 'u1' });
    expect(result).toEqual(fakeUser);
    expect(mockPrisma.users.findUnique).toHaveBeenCalledWith({ where: { id: 'u1' } });
  });

  it('returns null on database error', async () => {
    mockPrisma.users.findUnique.mockRejectedValue(new Error('db error'));
    const result = await resolvers.Query.user(null, { id: 'u1' });
    expect(result).toBeNull();
  });
});

describe('Query.userByEmail', () => {
  it('returns user matching the email', async () => {
    const fakeUser = { id: 'u1', email: 'alice@test.com' };
    mockPrisma.users.findUnique.mockResolvedValue(fakeUser);
    const result = await resolvers.Query.userByEmail(null, { email: 'alice@test.com' });
    expect(result).toEqual(fakeUser);
    expect(mockPrisma.users.findUnique).toHaveBeenCalledWith({ where: { email: 'alice@test.com' } });
  });

  it('returns undefined on database error', async () => {
    mockPrisma.users.findUnique.mockRejectedValue(new Error('db error'));
    const result = await resolvers.Query.userByEmail(null, { email: 'bad@test.com' });
    expect(result).toBeUndefined();
  });
});

describe('Query.quotesByUser', () => {
  it('returns quotes for a given owner', async () => {
    const fakeQuotes = [{ id: 'q1', ownerid: 'u1' }];
    mockPrisma.quotes.findMany.mockResolvedValue(fakeQuotes);
    const result = await resolvers.Query.quotesByUser(null, { ownerid: 'u1' });
    expect(result).toEqual(fakeQuotes);
  });

  it('returns empty array on database error', async () => {
    mockPrisma.quotes.findMany.mockRejectedValue(new Error('db error'));
    const result = await resolvers.Query.quotesByUser(null, { ownerid: 'u1' });
    expect(result).toEqual([]);
  });
});

describe('Query.incompleteQuotesForUser', () => {
  it('returns incomplete quotes for a user', async () => {
    const fakeQuotes = [{ id: 'iq1', ownerid: 'u1' }];
    mockPrisma.incompletequotes.findMany.mockResolvedValue(fakeQuotes);
    const result = await resolvers.Query.incompleteQuotesForUser(null, { ownerid: 'u1' });
    expect(result).toEqual(fakeQuotes);
  });

  it('returns empty array on database error', async () => {
    mockPrisma.incompletequotes.findMany.mockRejectedValue(new Error('db error'));
    const result = await resolvers.Query.incompleteQuotesForUser(null, { ownerid: 'u1' });
    expect(result).toEqual([]);
  });
});

// -------------------------------------------------------
// Field resolver
// -------------------------------------------------------
describe('User.dob', () => {
  it('formats a Date object to YYYY-MM-DD', () => {
    const user = { dob: new Date('1990-06-15') };
    const result = resolvers.User.dob(user as any);
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(result).toBe('1990-06-15');
  });
});

// -------------------------------------------------------
// Mutation: in-memory book mutations
// -------------------------------------------------------
describe('Mutation.addBook', () => {
  it('adds a new book and returns it with an id', () => {
    const input = { title: 'New Book', author: 'New Author', year: 2024, genre: 'Fiction' };
    const result = resolvers.Mutation.addBook(null, input);
    expect(result).toMatchObject(input);
    expect(result).toHaveProperty('id');
    // The new book should appear in the books list
    const books = resolvers.Query.books();
    expect(books.some((b) => b.title === 'New Book')).toBe(true);
  });
});

// -------------------------------------------------------
// Mutation: Prisma-backed mutations
// -------------------------------------------------------
describe('Mutation.addUser', () => {
  it('creates and returns the new user', async () => {
    const newUser = { id: 'u2', fname: 'Bob', lname: 'Jones', email: 'bob@test.com', dob: '1985-03-20' };
    mockPrisma.users.create.mockResolvedValue(newUser);
    const result = await resolvers.Mutation.addUser(null, { user: { fname: 'Bob', lname: 'Jones', email: 'bob@test.com', dob: '1985-03-20' } });
    expect(result).toEqual(newUser);
  });

  it('returns undefined on database error', async () => {
    mockPrisma.users.create.mockRejectedValue(new Error('db error'));
    const result = await resolvers.Mutation.addUser(null, { user: { fname: 'Bob' } });
    expect(result).toBeUndefined();
  });
});

describe('Mutation.addQuote', () => {
  it('creates and returns a new quote', async () => {
    const fakeQuote = { id: 'q1', insurance_type: 'home', estimate: 500 };
    mockPrisma.quotes.create.mockResolvedValue(fakeQuote);
    const result = await resolvers.Mutation.addQuote(null, { quote: { insurance_type: 'home', estimate: 500, ownerid: 'u1' } });
    expect(result).toEqual(fakeQuote);
  });

  it('returns undefined on database error', async () => {
    mockPrisma.quotes.create.mockRejectedValue(new Error('db error'));
    const result = await resolvers.Mutation.addQuote(null, { quote: {} });
    expect(result).toBeUndefined();
  });
});

describe('Mutation.deleteUser', () => {
  it('returns true when user is deleted', async () => {
    mockPrisma.users.delete.mockResolvedValue({ id: 'u1' });
    const result = await resolvers.Mutation.deleteUser(null, { id: 'u1' });
    expect(result).toBe(true);
  });

  it('returns false on database error', async () => {
    mockPrisma.users.delete.mockRejectedValue(new Error('db error'));
    const result = await resolvers.Mutation.deleteUser(null, { id: 'u1' });
    expect(result).toBe(false);
  });
});

describe('Mutation.deleteIncompleteQuote', () => {
  it('returns true when the incomplete quote is deleted', async () => {
    mockPrisma.incompletequotes.delete.mockResolvedValue({ id: 'iq1' });
    const result = await resolvers.Mutation.deleteIncompleteQuote(null, { id: 'iq1' });
    expect(result).toBe(true);
  });

  it('returns false on database error', async () => {
    mockPrisma.incompletequotes.delete.mockRejectedValue(new Error('db error'));
    const result = await resolvers.Mutation.deleteIncompleteQuote(null, { id: 'iq1' });
    expect(result).toBe(false);
  });
});
