import React, { useContext, useRef, useMemo } from "react";
import { useNavigate } from "react-router";
import Form from "../components/Form";
import { BookContext, BookContextType } from "../contexts/DataContext";
import { Book, Cover } from "../interfaces/Book";
import { createBook } from "../services/BookService";

export default function NewBook() {
    console.log('NewBook component rendered');
    const context = useContext(BookContext);
    const navigate = useNavigate();

    const titleRef = useRef<HTMLInputElement>(null);
    const authorRef = useRef<HTMLInputElement>(null);
    const genreRef = useRef<HTMLInputElement>(null);
    const priceRef = useRef<HTMLInputElement>(null);
    const numPagesRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLTextAreaElement>(null);
    const imgPathRef = useRef<HTMLInputElement>(null);
    const coverRef = useRef<HTMLSelectElement>(null);


    if (!context) {
        throw new Error("NewBook must be used within a BookProvider");
    }

    const { setBookList } = context as BookContextType;


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const title = titleRef.current?.value || "";
        const author = authorRef.current?.value || "";
        const genre = genreRef.current?.value || "";
        const priceStr = priceRef.current?.value || "";
        const numPagesStr = numPagesRef.current?.value || "";
        const description = descriptionRef.current?.value || "";
        const img_path = imgPathRef.current?.value || "https://picsum.photos/200/300";
        const cover = coverRef.current?.value as Cover || Cover.Paperback;

        if (!title || !author || !genre || priceStr === "" || numPagesStr === "") {
            alert("Please fill in all required fields.");
            return;
        }

        const bookData: Omit<Book, 'id'> = {
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
            const createdBook = await createBook(bookData);
            if (createdBook) {
                setBookList((prevList) => [...prevList, createdBook]);
                navigate("/");
            } else {
                 alert("Could not add book. Please ensure you are logged in.");
            }
        } catch (error) {
            console.error("Error adding book:", error);
            alert("An error occurred while adding the book.");
        }
    };

    const coverOptions = useMemo(() => Object.values(Cover).map((c) => ({
        value: c,
        label: c.charAt(0).toUpperCase() + c.slice(1),
    })), []);

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
                            defaultValue={Cover.Paperback}
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
                            defaultValue="https://picsum.photos/200/300"
                            ref={imgPathRef}
                            containerClasses="mb-4"
                        />
                        <Form.Submit className="mt-6" text="Add Book" />
                    </Form.Body>
            </Form>
        </div>
    );
}
