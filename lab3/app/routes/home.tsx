import { BookContext } from "../contexts/DataContext";
import React, { useContext, useState, useEffect, useCallback } from "react";
import { Book, Cover } from "../interfaces/Book";
import BookTile from "../components/BookTile";
import Filters from "../components/Filters";
import AddButton from "../components/AddButton";
import { auth } from "../services/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

export const meta = () => {
  return [
    { title: "Księgarnia" },
    { name: "description", content: "Księgarnia" },
  ];
};

interface FilterState {
  priceMin: string;
  priceMax: string;
  pagesMin: string;
  pagesMax: string;
  coverType: Cover | "";
  filterScope: string;
}

const initialFilterState: FilterState = {
  priceMin: "",
  priceMax: "",
  pagesMin: "",
  pagesMax: "",
  coverType: "",
  filterScope: "",
};

export default function Home() {
  const context = useContext(BookContext);
  const [query, setQuery] = useState("");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [activeFilters, setActiveFilters] =
    useState<FilterState>(initialFilterState);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setActiveFilters((prevFilters) => ({
          ...prevFilters,
          filterScope: "",
        }));
      }
    });
    return () => unsubscribe();
  }, []);

  if (!context) {
    throw new Error("Home must be used within a BookProvider");
  }

  const { bookList, setBookList } = context;

  const applyFilters = useCallback((newFilters: FilterState) => {
    setActiveFilters(newFilters);
    setIsFiltersOpen(false);
  }, []);

  const booksToDisplay: Book[] = Array.isArray(bookList) ? bookList : [];

  const filteredBooks = booksToDisplay
    .filter((it: Book) => {
      const searchMatch = (
        it.title.toLowerCase() + it.author.toLowerCase()
      ).includes(query.toLowerCase());

      const priceMin = parseFloat(activeFilters.priceMin);
      const priceMax = parseFloat(activeFilters.priceMax);
      const pagesMin = parseInt(activeFilters.pagesMin, 10);
      const pagesMax = parseInt(activeFilters.pagesMax, 10);

      const priceMatch =
        (isNaN(priceMin) || it.price >= priceMin) &&
        (isNaN(priceMax) || it.price <= priceMax);

      const pagesMatch =
        (isNaN(pagesMin) || it.num_pages >= pagesMin) &&
        (isNaN(pagesMax) || it.num_pages <= pagesMax);

      const coverMatch =
        !activeFilters.coverType || it.cover === activeFilters.coverType;

      const scopeMatch =
        !activeFilters.filterScope ||
        (activeFilters.filterScope === "my" && user && it.userId === user.uid);

      return searchMatch && scopeMatch && priceMatch && pagesMatch && coverMatch;
    })
    .sort((a: Book, b: Book) => a.title.localeCompare(b.title));

  const handleBookDeleted = (bookId: string) => {
    if (setBookList) {
      setBookList(prevBookList => prevBookList.filter(book => book.id !== bookId));
    }
  };

  const bookListHTML = filteredBooks.map((it: Book) => (
    <BookTile key={it.id} book={it} currentUserId={user?.uid} onBookDeleted={handleBookDeleted} />
  ));

  const isUserLoggedIn = !!user;

  return (
    <main className="container mx-auto p-4 flex flex-col items-center">
      <div className="relative w-full max-w-2xl my-12">
        <div className="relative z-10 flex items-center border rounded-md overflow-hidden bg-white">
          <input
            className="p-2 flex-grow focus:outline-none bg-transparent text-gray-950"
            placeholder="Szukaj książek..."
            onChange={(e) => setQuery(e.target.value)}
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
          <Filters
            isOpen={isFiltersOpen}
            filters={activeFilters}
            onApplyFilters={applyFilters}
            isUserLoggedIn={isUserLoggedIn}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
        {bookListHTML}
      </div>

      <AddButton />
    </main>
  );
}
