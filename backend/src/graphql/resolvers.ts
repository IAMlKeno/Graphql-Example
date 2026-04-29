import { PrismaClient } from "../../generated/prisma/client";

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
    searchBooks: (_root: any, { query } ) => {
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

    deleteBook: (id: string) => {
      const bookIndex = books.findIndex(book => book.id === id);
      if (bookIndex === -1) return false;

      books.splice(bookIndex, 1);
      return true;
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
    }
  },
}
