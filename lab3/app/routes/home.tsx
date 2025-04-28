import { BookContext } from "../contexts/DataContext";
import React, { useContext, useState } from "react";
import { Book } from "../interfaces/Book";
import BookTile from "../components/BookTile";

export const meta = () => {
  return [
    { title: "Księgarnia" },
    { name: "description", content: "Księgarnia" },
  ];
};

export default function Home() {
  const context = useContext(BookContext);
  const [query, setQuery] = useState<string>("");

  if (!context) {
    throw new Error("Home must be used within a BookProvider");
  }

  const { bookList } = context;

  const bookListHTML = bookList
    .filter((it: Book) =>
      (it.title.toLowerCase() + it.author.toLowerCase())
        .includes(query.toLowerCase())
    )
    .sort((a: Book, b: Book) => a.title.localeCompare(b.title))
    .map((it: Book) => <BookTile key={it.id} book={it} />);

  return (
    <main className="container mx-auto p-4 flex flex-col items-center">
      <input
        className="mb-4 p-2 border rounded-md w-full max-w-md focus:outline-none focus:ring-2"
        placeholder="Szukaj książek..."
        onChange={(e) =>
          setQuery(e.target.value)
        }
        value={query}
        autoFocus
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
        {bookListHTML}
      </div>
    </main>
  );
}
