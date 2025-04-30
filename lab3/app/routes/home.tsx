import { BookContext } from "../contexts/DataContext";
import React, { useContext, useState } from "react";
import { Book } from "../interfaces/Book";
import BookTile from "../components/BookTile";
import Filters from "../components/Filters";

export const meta = () => {
  return [
    { title: "Księgarnia" },
    { name: "description", content: "Księgarnia" },
  ];
};

export default function Home() {
  const context = useContext(BookContext);
  const [query, setQuery] = useState("");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  if (!context) {
    throw new Error("Home must be used within a BookProvider");
  }

  const { bookList } = context;

  const booksToDisplay: Book[] = Array.isArray(bookList) ? bookList : [];

  const bookListHTML = booksToDisplay
    .filter((it: Book) =>
      (it.title.toLowerCase() + it.author.toLowerCase())
        .includes(query.toLowerCase())
    )
    .sort((a: Book, b: Book) => a.title.localeCompare(b.title))
    .map((it: Book) => <BookTile key={it.id} book={it} />);

  return (
    <main className="container mx-auto p-4 flex flex-col items-center">
      <div className="relative w-full max-w-2xl my-12">
        <div className="relative z-10 flex items-center border rounded-md overflow-hidden bg-white">
          <input
            className="p-2 flex-grow focus:outline-none bg-transparent text-gray-950"
            placeholder="Szukaj książek..."
            onChange={(e) =>
              setQuery(e.target.value)
            }
            value={query}
            autoFocus
          />
          <button
            className="p-2 bg-white text-gray-950 hover:bg-gray-100 focus:outline-none ring-1 ring-gray-950"
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          >
            Filtruj
          </button>
        </div>
        <div className="relative -mt-1">
           <Filters isOpen={isFiltersOpen} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
        {bookListHTML}
      </div>
    </main>
  );
}
