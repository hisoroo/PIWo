import React, { createContext, useState, useEffect } from "react";
import { Book } from "../interfaces/Book.tsx";
import { readBooks } from "../services/BookService";

export interface BookContextType {
  bookList: Book[];
  setBookList: React.Dispatch<React.SetStateAction<Book[]>>;
}

const defaultContextValue: BookContextType = {
  bookList: [],
  setBookList: () => {},
};
export const BookContext = createContext<BookContextType>(defaultContextValue);

export const BookProvider = ({ children }) => {
  const [bookList, setBookList] = useState<Book[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const booksFromDb = await readBooks();
      setBookList(booksFromDb);
    };

    fetchBooks();
  }, []);

  return (
    <BookContext.Provider value={{ bookList, setBookList }}>
      {children}
    </BookContext.Provider>
  );
};
