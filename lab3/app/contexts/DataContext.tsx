import React, { createContext, useState } from "react";
import { Book, Cover } from "../interfaces/Book.tsx";

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
  const [bookList, setBookList] = useState<Book[]>([
    {
      id: 1,
      img_path: "https://picsum.photos/200/300",
      title: "Obcy",
      author: "Albert Camus",
      genre: "Filozoficzna",
      price: 19.99,
      num_pages: 123,
      cover: Cover.Paperback,
      description: "Egzystencjalna powieść o absurdzie życia i alienacji.",
    },
    {
      id: 2,
      img_path: "https://picsum.photos/200/300",
      title: "Rok 1984",
      author: "George Orwell",
      genre: "Dystopia",
      price: 24.99,
      num_pages: 328,
      cover: Cover.Hardcover,
      description: "Dystopijna wizja totalitarnego społeczeństwa.",
    },
    {
      id: 3,
      img_path: "https://picsum.photos/200/300",
      title: "Duma i uprzedzenie",
      author: "Jane Austen",
      genre: "Romans",
      price: 14.99,
      num_pages: 279,
      cover: Cover.Paperback,
      description: "Klasyczna powieść romantyczna o miłości i społeczeństwie.",
    },
    {
      id: 4,
      img_path: "https://picsum.photos/200/300",
      title: "Zbrodnia i kara",
      author: "Fiodor Dostojewski",
      genre: "Psychologiczna",
      price: 29.99,
      num_pages: 671,
      cover: Cover.Hardcover,
      description: "Psychologiczna powieść o winie, karze i moralności.",
    },
  ]);

  return (
    <BookContext.Provider value={{ bookList, setBookList }}>
      {children}
    </BookContext.Provider>
  );
};
