import { sendToOpenObserve } from "telemetry/openobserve";
import { logger } from "telemetry/logger";
import { incompletequotes, insurance_type, PrismaClient, quotes as Quote, users as User } from "../../generated/prisma/client";
import { quotesUpdateInput } from "../../generated/prisma/models";

const books: Array<Book> = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    year: 1925,
    genre: 'Novel'
  },
  {
    id: '3',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    year: 1925,
    genre: 'Novel'
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    year: 1960,
    genre: 'Southern Gothic'
  }
];

const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: "query"},
    { emit: 'stdout', level: "error"},
    { emit: 'stdout', level: "warn"},
  ],
});
prisma.$on("query", async (e) => {
  sendToOpenObserve({
    level: 'info',
    type: "db_query",
    query: e.query,
    duration: e.duration,
    timestamp: new Date().toISOString(),
  });
});

export interface BookInput {
  title: string;
  author: string;
  year: number;
  genre: string;
}
export interface Book {
  id: string;
  title: string;
  author: string;
  year: number;
  genre: string;
}
const getInsuranceType = (type: string): insurance_type => {
  switch (type) {
    case insurance_type.automotive.toString():
      insurance_type.automotive;
      break;
    case insurance_type.home.toString():
      insurance_type.home;
      break;
    case insurance_type.life.toString():
      return insurance_type.life
      break;
  }
}

export const resolvers = {
  Query: {
    greeting: () => 'Hello World',
    books: () => books,
    book: (_: any, { id }) => {
      const book = books.find(book => book.id === id);
      if (!book) {
        throw new Error('Book not found');
      }
      return book;
    },
    searchBooks: (_root: any, { query }) => {
      const log = logger.child({ resolver: 'searchBooks' });
      log.debug({ query }, 'Searching books');
      const searchTerm = query.toLowerCase();
      const matchingBooks = books.filter(
        book =>
          book.title.toLowerCase().includes(searchTerm) ||
          book.author.toLowerCase().includes(searchTerm)
      );
      if (matchingBooks.length < 1) {
        log.warn({ query }, 'No matching books found');
        throw new Error('No matching books found');
      }
      log.info({ count: matchingBooks.length }, 'Books found');
      return matchingBooks;
    },
    users: async () => {
      const log = logger.child({ resolver: 'users' });
      try {
        log.info('Fetching all users');
        const dbUsers = await prisma.users.findMany();
        log.info({ count: dbUsers.length }, 'Users fetched');
        return dbUsers;
      } catch (e) {
        log.error({ err: e }, 'Error fetching users');
        return [];
      }
    },
    user: async (_: any, { id }) => {
      const log = logger.child({ resolver: 'user', userId: id });
      try {
        log.info('Fetching user by id');
        const user = await prisma.users.findUnique({ where: { id } });
        if (user) log.info('User found');
        else log.warn('No user found for id');
        return user;
      } catch (e) {
        log.error({ err: e }, 'Error fetching user');
        return null;
      }
    },

    userByEmail: async (_: any, { email }) => {
      const log = logger.child({ resolver: 'userByEmail', email });
      try {
        log.info('Looking up user by email');
        const user = await prisma.users.findUnique({ where: { email } });
        if (user) log.info({ userId: user.id }, 'User found');
        else log.warn('No user found for email');
        return user;
      } catch (e) {
        log.error({ err: e }, 'Failed to look up user by email');
        return undefined;
      }
    },
    quotes: async (_: any, { type }) => {
      const log = logger.child({ resolver: 'quotes', insuranceType: type });
      try {
        log.info('Fetching quotes by type');
        const quotes = await prisma.quotes.findMany({
          where: { insurance_type: getInsuranceType(type) }
        });
        log.info({ count: quotes.length }, 'Quotes fetched');
        return quotes;
      } catch (e) {
        log.error({ err: e }, 'Error fetching quotes');
        return [];
      }
    },
    quote: async (_: any, { id }) => {
      const log = logger.child({ resolver: 'quote', quoteId: id });
      try {
        log.info('Fetching quote by id');
        const quote = await prisma.quotes.findUnique({ where: { id } });
        if (quote) log.info('Quote found');
        else log.warn('No quote found for id');
        return quote;
      } catch (e) {
        log.error({ err: e }, 'Error fetching quote');
        return [];
      }
    },
    quotesByUser: async (_: any, { ownerid }) => {
      const log = logger.child({ resolver: 'quotesByUser', ownerid });
      try {
        log.info('Fetching quotes for user');
        const quotes = await prisma.quotes.findMany({ where: { ownerid } });
        log.info({ count: quotes.length }, 'Quotes fetched');
        return quotes;
      } catch (e) {
        log.error({ err: e }, 'Error fetching quotes for user');
        return [];
      }
    },
    incompleteQuotesForUser: async (_: any, { ownerid }) => {
      const log = logger.child({ resolver: 'incompleteQuotesForUser', ownerid });
      try {
        log.info('Fetching incomplete quotes for user');
        const quotes = await prisma.incompletequotes.findMany({ where: { ownerid } });
        log.info({ count: quotes.length }, 'Incomplete quotes fetched');
        return quotes;
      } catch (e) {
        log.error({ err: e }, 'Error fetching incomplete quotes');
        return [];
      }
    },
    incompleteQuote: async (_: any, { id }) => {
      const log = logger.child({ resolver: 'incompleteQuote', quoteId: id });
      try {
        log.info('Fetching incomplete quote by id');
        const quote = await prisma.quotes.findUnique({ where: { id } });
        if (quote) log.info('Incomplete quote found');
        else log.warn('No incomplete quote found for id');
        return quote;
      } catch (e) {
        log.error({ err: e }, 'Error fetching incomplete quote');
        return [];
      }
    },
  },
  User: {
    dob: (user: User) => new Date(user.dob).toISOString().slice(0, 10),
  },
  Quote: {
    estimate: (quote: Quote) => quote.estimate ?? 0,
    date_submitted: (quote: Quote) => new Date(quote.date_submitted).toISOString().slice(0, 10),
  },

  Mutation: {
    addBook: (_: any, input: BookInput) => {
      const newBook = {
        id: String(books.length + 1),
        ...input
      }
      books.push(newBook);
      return newBook;
    },
    updateBook: (id: string, input: BookInput) => {
      const bookIndex = books.findIndex(book => book.id === id);
      if (bookIndex === -1) return null;

      const updatedBook: Book = {
        ...books[bookIndex],
        ...input
      } as Book;
      books[bookIndex] = updatedBook;
      return updatedBook;
    },

    deleteBook: (id: string): boolean => {
      const bookIndex = books.findIndex(book => book.id === id);
      if (bookIndex === -1) return false;

      books.splice(bookIndex, 1);
      return true;
    },

    addQuote: async (_: any, { quote }): Promise<Quote | undefined> => {
      const log = logger.child({ resolver: 'addQuote', ownerid: quote.ownerid });
      try {
        log.info({ insuranceType: quote.insurance_type }, 'Creating quote');
        const createdQuote = await prisma.quotes.create({ data: { ...quote, date_submitted: new Date().toISOString() }});
        log.info({ quoteId: createdQuote.id }, 'Quote created');
        return createdQuote;
      } catch (e) {
        log.error({ err: e }, 'Failed to create quote');
        return undefined;
      }
    },
    updateQuote: async (_: any, id: string, input: quotesUpdateInput): Promise<Quote | undefined> => {
      const log = logger.child({ resolver: 'updateQuote', quoteId: id });
      try {
        log.info('Updating quote');
        const updatedQuote = await prisma.quotes.update({ where: { id }, data: { ...input } });
        log.info('Quote updated');
        return updatedQuote;
      } catch (e) {
        log.error({ err: e }, 'Failed to update quote');
        return undefined;
      }
    },
    deleteQuote: async (_: any, id: string): Promise<boolean> => {
      const log = logger.child({ resolver: 'deleteQuote', quoteId: id });
      try {
        log.info('Deleting quote');
        const ret = await prisma.quotes.delete({ where: { id } });
        log.info('Quote deleted');
        return !!ret;
      } catch (e) {
        log.error({ err: e }, 'Failed to delete quote');
        return false;
      }
    },
    addIncompleteQuote: async (_: any, { quote }): Promise<incompletequotes | undefined> => {
      const log = logger.child({ resolver: 'addIncompleteQuote', ownerid: quote.ownerid });
      try {
        log.debug({ insuranceType: quote.insurance_type }, 'Creating incomplete quote');
        const createdQuote = await prisma.incompletequotes.create({ data: { ...quote, ownerid: quote.ownerid }});
        log.info({ quoteId: createdQuote.id }, 'Incomplete quote created');
        return createdQuote;
      } catch (e) {
        log.error({ err: e }, 'Failed to create incomplete quote');
        return undefined;
      }
    },
    updateIncompleteQuote: async (id: string, { quote }): Promise<Quote | undefined> => {
      const log = logger.child({ resolver: 'updateIncompleteQuote', quoteId: id });
      try {
        log.info('Updating incomplete quote');
        const updatedQuote = await prisma.incompletequotes.update({ where: { id }, data: { ...quote } });
        const q = JSON.parse(updatedQuote.fields.toString());
        log.info('Incomplete quote updated');
        return { ...q, id } as Quote;
      } catch (e) {
        log.error({ err: e }, 'Failed to update incomplete quote');
        return undefined;
      }
    },
    deleteIncompleteQuote: async (_: any, { id }): Promise<boolean> => {
      const log = logger.child({ resolver: 'deleteIncompleteQuote', quoteId: id });
      try {
        log.info('Deleting incomplete quote');
        const ret = await prisma.incompletequotes.delete({ where: { id } });
        log.info('Incomplete quote deleted');
        return !!ret;
      } catch (e) {
        log.error({ err: e }, 'Failed to delete incomplete quote');
        return false;
      }
    },
    addUser: async (_: any, { user }): Promise<User | undefined> => {
      const log = logger.child({ resolver: 'addUser', email: user.email });
      try {
        log.info('Creating new user');
        const newUser = await prisma.users.create({ data: { ...user }});
        log.info({ userId: newUser.id }, 'User created');
        return newUser;
      } catch (e) {
        log.error({ err: e }, 'Failed to create user');
        return undefined;
      }
    },
    updateUser: async (id: string, { user }): Promise<User | undefined> => {
      const log = logger.child({ resolver: 'updateUser', userId: id });
      try {
        log.info('Updating user');
        const updatedUsers = await prisma.users.update({ where: { id }, data: { ...user } });
        log.info('User updated');
        return updatedUsers;
      } catch (e) {
        log.error({ err: e }, 'Failed to update user');
        return undefined;
      }
    },
    deleteUser: async (_: any, { id }): Promise<boolean> => {
      const log = logger.child({ resolver: 'deleteUser', userId: id });
      try {
        log.info('Deleting user');
        const ret = await prisma.users.delete({ where: { id } });
        log.info('User deleted');
        return !!ret;
      } catch (e) {
        log.error({ err: e }, 'Failed to delete user');
        return false;
      }
    },
  }
}
