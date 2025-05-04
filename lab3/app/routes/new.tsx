import React, { useContext, useReducer } from "react";
import { useNavigate } from "react-router";
import Form from "../components/Form";
import { BookContext, BookContextType } from "../contexts/DataContext";
import { Book, Cover } from "../interfaces/Book";
import { createBook } from "../services/BookService"; // Import createBook

type BookFormData = Omit<Book, 'id' | 'price' | 'num_pages'> & {
    price: string;
    num_pages: string;
};

const initialState: BookFormData = {
    title: "",
    author: "",
    genre: "",
    price: "",
    num_pages: "",
    cover: Cover.Paperback,
    description: "",
    img_path: "https://picsum.photos/200/300",
};

type FormAction =
    | { type: 'SET_FIELD'; field: keyof BookFormData; payload: string }
    | { type: 'SET_COVER'; payload: Cover };

function formReducer(state: BookFormData, action: FormAction): BookFormData {
    switch (action.type) {
        case 'SET_FIELD':
            if (action.field in state) {
                return { ...state, [action.field]: action.payload };
            }
            return state;
        case 'SET_COVER':
            return { ...state, cover: action.payload };
        default:
            return state;
    }
}

export default function NewBook() {
    const context = useContext(BookContext);
    const navigate = useNavigate();

    const [state, dispatch] = useReducer(formReducer, initialState);

    if (!context) {
        throw new Error("NewBook must be used within a BookProvider");
    }

    const { setBookList } = context as BookContextType;

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        if (id in initialState) {
            dispatch({ type: 'SET_FIELD', field: id as keyof BookFormData, payload: value });
        }
    };

    const handleSelectChange = (e) => {
        dispatch({ type: 'SET_COVER', payload: e.target.value as Cover });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!state.title || !state.author || !state.genre || state.price === "" || state.num_pages === "") {
            alert("Please fill in all required fields.");
            return;
        }

        const bookData: Omit<Book, 'id'> = {
            title: state.title,
            author: state.author,
            genre: state.genre,
            price: Number(state.price),
            num_pages: Number(state.num_pages),
            cover: state.cover,
            description: state.description,
            img_path: state.img_path || "https://picsum.photos/200/300",
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

    const coverOptions = Object.values(Cover).map((c) => ({
        value: c,
        label: c.charAt(0).toUpperCase() + c.slice(1),
    }));

    return (
        <div className="flex items-center justify-center">
            <Form className="w-full max-w-lg" onSubmit={handleSubmit}>
                    <Form.Body>
                        <Form.Input
                            id="title"
                            label="Title"
                            placeholder="Enter book title"
                            value={state.title}
                            onChange={handleInputChange}
                            containerClasses="mb-4"
                            required
                        />
                        <Form.Input
                            id="author"
                            label="Author"
                            placeholder="Enter author's name"
                            value={state.author}
                            onChange={handleInputChange}
                            containerClasses="mb-4"
                            required
                        />
                        <Form.Input
                            id="genre"
                            label="Genre"
                            placeholder="Enter book genre"
                            value={state.genre}
                            onChange={handleInputChange}
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
                                value={state.price}
                                onChange={handleInputChange}
                                containerClasses="flex-1"
                                required
                            />
                            <Form.Input
                                id="num_pages"
                                label="Number of Pages"
                                placeholder="e.g., 300"
                                type="number"
                                value={state.num_pages}
                                onChange={handleInputChange}
                                containerClasses="flex-1"
                                required
                            />
                        </div>
                        <Form.Select
                            id="cover"
                            label="Cover Type"
                            options={coverOptions}
                            value={state.cover}
                            onChange={handleSelectChange}
                            containerClasses="mb-4"
                            required
                        />
                        <Form.TextArea
                            id="description"
                            label="Description"
                            placeholder="Enter book description"
                            value={state.description}
                            onChange={handleInputChange}
                            containerClasses="mb-4"
                        />
                        <Form.Input
                            id="img_path"
                            label="Image URL (optional)"
                            placeholder="https://picsum.photos/200/300"
                            value={state.img_path}
                            onChange={handleInputChange}
                            containerClasses="mb-4"
                        />
                        <Form.Submit className="mt-6" text="Add Book" />
                    </Form.Body>
            </Form>
        </div>
    );
}
