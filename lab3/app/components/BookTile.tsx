import React, { FC } from 'react';
import { Book } from '../interfaces/Book';
import { useNavigate } from 'react-router';
import { deleteBook } from '../services/BookService';

interface BookTileProps {
    book: Book;
    currentUserId?: string | null;
    onBookDeleted: (bookId: string) => void;
}

const BookTile: FC<BookTileProps> = ({ book, currentUserId, onBookDeleted }) => {
    const { id, img_path, title, author, price, userId } = book;
    const navigate = useNavigate();

    const formattedPrice = price.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' });

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/edit/${id}`);
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const success = await deleteBook(id);
        if (success) {
            onBookDeleted(id);
        }
    };

    const canModify = currentUserId && userId === currentUserId;

    return (
        <div className="relative flex flex-col items-center border rounded-lg p-4 max-w-xs shadow-md">
            {canModify && (
                <>
                    <button
                        onClick={handleEdit}
                        className="absolute top-1.5 left-0 text-gray-600 hover:text-gray-900 py-1 px-2 rounded z-10"
                        aria-label="Edytuj"
                    >
                        <img src="/edit.svg" alt="Edit" className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleDelete}
                        className="absolute top-1 right-0 text-gray-600 hover:text-gray-900 py-1 px-2 rounded z-10"
                        aria-label="Usuń"
                    >
                        <img src="/delete.svg" alt="Delete" className="w-6 h-6" />
                    </button>
                </>
            )}

            <img src={img_path} alt={title} className="w-full h-48 object-cover rounded-md mb-3 mt-6" />
            <div className="text-center">
                <h3 className="text-lg font-bold mb-2">{title}</h3>
                <p className="text-sm mb-1">by {author}</p>
                <p className="text-sm font-semibold mb-3">{formattedPrice}</p>
            </div>
        </div>
    );
};

export default BookTile;