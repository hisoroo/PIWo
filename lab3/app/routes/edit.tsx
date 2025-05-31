import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import Form from "../components/Form";
import { BookContext, BookContextType } from "../contexts/DataContext";
import { Book, Cover } from "../interfaces/Book";
import { getBookById, updateBook } from "../services/BookService";
import { auth } from "../services/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

export default function EditBook() {
  const context = useContext(BookContext);
  const navigate = useNavigate();
  const { bookId } = useParams<{ bookId: string }>();
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [bookToEdit, setBookToEdit] = useState<Book | null>(null);

  const titleRef = useRef<HTMLInputElement>(null);
  const authorRef = useRef<HTMLInputElement>(null);
  const genreRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const numPagesRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLSelectElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const imgPathRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!bookId) {
      navigate("/");
      setLoading(false);
      return;
    }
    if (currentUser !== undefined) {
      const fetchBook = async () => {
        setLoading(true);
        const bookData = await getBookById(bookId);
        if (bookData) {
          if (currentUser && bookData.userId !== currentUser.uid) {
            alert("You are not authorized to edit this book.");
            navigate("/");
            setLoading(false);
            return;
          }
          setBookToEdit(bookData);
        } else {
          alert("Book not found.");
          navigate("/");
        }
        setLoading(false);
      };
      fetchBook();
    }
  }, [bookId, navigate, currentUser]);

  useEffect(() => {
    if (bookToEdit && !loading) {
      if (titleRef.current) titleRef.current.value = bookToEdit.title;
      if (authorRef.current) authorRef.current.value = bookToEdit.author;
      if (genreRef.current) genreRef.current.value = bookToEdit.genre;
      if (priceRef.current) priceRef.current.value = String(bookToEdit.price);
      if (numPagesRef.current)
        numPagesRef.current.value = String(bookToEdit.num_pages);
      if (coverRef.current) coverRef.current.value = bookToEdit.cover;
      if (descriptionRef.current)
        descriptionRef.current.value = bookToEdit.description || "";
      if (imgPathRef.current)
        imgPathRef.current.value =
          bookToEdit.img_path || "https://picsum.photos/200/300";
    }
  }, [bookToEdit, loading]);

  if (!context) {
    throw new Error("EditBook must be used within a BookProvider");
  }

  const { setBookList } = context as BookContextType;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const title = titleRef.current?.value || "";
    const author = authorRef.current?.value || "";
    const genre = genreRef.current?.value || "";
    const priceStr = priceRef.current?.value || "";
    const numPagesStr = numPagesRef.current?.value || "";
    const cover = (coverRef.current?.value as Cover) || Cover.Paperback;
    const description = descriptionRef.current?.value || "";
    const img_path =
      imgPathRef.current?.value || "https://picsum.photos/200/300";

    if (!title || !author || !genre || priceStr === "" || numPagesStr === "") {
      alert("Please fill in all required fields.");
      return;
    }

    if (!bookId || !currentUser) {
      alert("Cannot update book. Missing book ID or user information.");
      return;
    }

    const bookDataToUpdate: Partial<Omit<Book, "id" | "userId">> = {
      title,
      author,
      genre,
      price: Number(priceStr),
      num_pages: Number(numPagesStr),
      cover,
      description,
      img_path,
    };

    try {
      const updatedBook = await updateBook(bookId, bookDataToUpdate);
      if (updatedBook) {
        setBookList((prevList) =>
          prevList.map((book) => (book.id === bookId ? updatedBook : book))
        );
        navigate("/");
      } else {
        alert(
          "Failed to update book. Please ensure you are logged in and have permissions."
        );
      }
    } catch (error) {
      console.error("Error updating book:", error);
      alert("An error occurred while updating the book.");
    }
  };

  const coverOptions = Object.values(Cover).map((c) => ({
    value: c,
    label: c.charAt(0).toUpperCase() + c.slice(1),
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Ładowanie danych książki...
      </div>
    );
  }

  if (!bookToEdit && !loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Nie można załadować danych książki do edycji.
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <Form className="w-full max-w-lg" onSubmit={handleSubmit}>
        <Form.Body>
          <Form.Input
            id="title"
            label="Title"
            placeholder="Enter book title"
            ref={titleRef}
            containerClasses="mb-4"
            required
          />
          <Form.Input
            id="author"
            label="Author"
            placeholder="Enter author's name"
            ref={authorRef}
            containerClasses="mb-4"
            required
          />
          <Form.Input
            id="genre"
            label="Genre"
            placeholder="Enter book genre"
            ref={genreRef}
            containerClasses="mb-4"
            required
          />
          <div className="flex space-x-4 mb-4">
            <Form.Input
              id="price"
              label="Price (PLN)"
              placeholder="e.g., 29.99"
              type="number"
              step="0.01"
              ref={priceRef}
              containerClasses="flex-1"
              required
            />
            <Form.Input
              id="num_pages"
              label="Number of Pages"
              placeholder="e.g., 300"
              type="number"
              ref={numPagesRef}
              containerClasses="flex-1"
              required
            />
          </div>
          <Form.Select
            id="cover"
            label="Cover Type"
            options={coverOptions}
            ref={coverRef}
            containerClasses="mb-4"
            required
          />
          <Form.TextArea
            id="description"
            label="Description"
            placeholder="Enter book description"
            ref={descriptionRef}
            containerClasses="mb-4"
          />
          <Form.Input
            id="img_path"
            label="Image URL (optional)"
            placeholder="https://picsum.photos/200/300"
            ref={imgPathRef}
            containerClasses="mb-4"
          />
          <Form.Submit className="mt-6" text="Update Book" />
        </Form.Body>
      </Form>
    </div>
  );
}
