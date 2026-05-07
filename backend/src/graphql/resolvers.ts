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

const prisma = new PrismaClient();
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
      console.log(query);
      const searchTerm = query.toLowerCase();
      const matchingBooks = books.filter(
        book =>
          book.title.toLowerCase().includes(searchTerm) ||
          book.author.toLowerCase().includes(searchTerm)
      );
      if (matchingBooks.length < 1) {
        throw new Error('No matching books found');
      }
      return matchingBooks;
    },
    users: async () => {
      try {
        const dbUsers = await prisma.users.findMany();
        console.log(dbUsers);
        return dbUsers
      } catch (e) {
        console.log(`Error getting users ${e}`);
        return [];
      }
    },
    user: async (_: any, { id }) => {
      try {
        const user = await prisma.users.findUnique({
          where: {
            id
          }
        });
        console.log(user);
        return user;
      } catch (e) {
        console.log(`Error getting users ${e}`);
        return null;
      }
    },

    userByEmail: async (_: any, { email }) => {
      try {
        console.log(email);
        const user = await prisma.users.findUnique({
          where: {
            email
          }
        });
        console.log(user);
        return user
      } catch (e) {
        console.log(`Unable to find user with email [${email}]: ${e}`);
        return undefined;
      }
    },
    quotes: async (_: any, { type }) => {
      try {
        const quotes = await prisma.quotes.findMany({
          where: {
            insurance_type: getInsuranceType(type)
          }
        });
        return quotes
      } catch (e) {
        return []
      }
    },
    quote: async (_: any, { id }) => {
      try {
        console.log(`Fetching quote [${id}]`);
        const quotes = await prisma.quotes.findUnique({
          where: {
            id
          }
        });
        return quotes;
      } catch (e) {
        return [];
      }
    },
    quotesByUser: async (_: any, { ownerid } ) => {
      try {
        console.log(`Fetching quotes for user [${JSON.stringify(ownerid)}]`);
        const quotes = await prisma.quotes.findMany({
          where: {
            ownerid
          }
        });
        return quotes;
      } catch (e) {
        return [];
      }
    },
    incompleteQuotesForUser: async (_: any, { ownerid }) => {
      try {
        console.log(`Fetching incomplete quotes for user [${ownerid}]`);
        const quotes = await prisma.incompletequotes.findMany({
          where: {
            ownerid
          }
        });
        return quotes;
      } catch (e) { return [] }
    },
    incompleteQuote: async (_: any, { id }) => {
      try {
        console.log(`Fetching incomplete quote [${id}]`);
        const quotes = await prisma.quotes.findUnique({
          where: {
            id
          }
        });
        return quotes;
      } catch (e) { return [] }
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
      try {
        console.log(quote);
        const createdQuote = await prisma.quotes.create({ data: { ...quote, date_submitted: new Date().toISOString() }});
        return createdQuote;
      } catch (e) {
        console.error(`Failed to add quote: ${e}`);
        return undefined;
      }
    },
    updateQuote: async (_: any, id: string, input: quotesUpdateInput): Promise<Quote | undefined> => {
      try {
        const updatedQuote = await prisma.quotes.update({
          where: { id },
          data: {
            ...input
          }
        });
        return updatedQuote;
      } catch (e) {
        return undefined;
      }
    },
    deleteQuote: async (_: any, id: string): Promise<boolean> => {
      try {
        const ret = await prisma.quotes.delete({ where: { id } });
        return !!ret;
      } catch (e) {
        console.error(`Failed to delete qoute: ${e}`);
        return false;
      }
    },
    addIncompleteQuote: async (_: any, { quote }): Promise<incompletequotes | undefined> => {
      try {
        console.debug(quote);
        const createdQuote = await prisma.incompletequotes.create({ data: { ...quote, ownerid: quote.ownerid }});
        return createdQuote;
      } catch (e) {
        console.error(e);
        return undefined;
      }
    },
    updateIncompleteQuote: async (id: string, { quote }): Promise<Quote | undefined> => {
      try {
        const updatedQuote = await prisma.incompletequotes.update({
          where: { id },
          data: {
            ...quote
          }
        });
        const q = JSON.parse(updatedQuote.fields.toString());
        return { ...q, id } as Quote;
      } catch (e) {
        return undefined;
      }
    },
    deleteIncompleteQuote: async (_: any, { id }): Promise<boolean> => {
      try {
        const ret = await prisma.incompletequotes.delete({ where: { id } });
        return !!ret;
      } catch (e) {
        console.error(`Failed to delete unfinished qoute: ${e}`);
        return false;
      }
    },
    addUser: async (_: any, { user }): Promise<User | undefined> => {
      try {
        console.log(user);
        const newUser = await prisma.users.create({ data: { ...user }});
        return newUser;
      } catch (e) {
        console.error(`Error adding the new user`);
        console.error(e);
        return undefined;
      }
    },
    updateUser: async (id: string, { user }): Promise<User | undefined> => {
      try {
        const updatedUsers = await prisma.users.update({
          where: { id },
          data: {
            ...user
          }
        });
        return updatedUsers;
      } catch (e) {
        return undefined;
      }
    },
    deleteUser: async (_: any, { id }): Promise<boolean> => {
      try {
        const ret = await prisma.users.delete({ where: { id } });
        return !!ret;
      } catch (e) {
        console.error(`Failed to delete user [${id}]: ${e}`);
        return false;
      }
    },
  }
}
