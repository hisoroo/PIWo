import React, { FC } from 'react';
import { Book } from '../interfaces/Book';

interface BookTileProps {
    book: Book;
}

const BookTile: FC<BookTileProps> = ({ book }) => {
    const { img_path, title, author, price } = book;

    const formattedPrice = price.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' });

    return (
        <div className="flex flex-col items-center border rounded-lg p-4 max-w-xs shadow-md">
            <img src={img_path} alt={title} className="w-full h-48 object-cover rounded-md mb-3" />
            <div className="text-center">
                <h3 className="text-lg font-bold mb-2">{title}</h3>
                <p className="text-sm mb-1">by {author}</p>
                <p className="text-sm font-semibold">{formattedPrice}</p>
            </div>
        </div>
    );
};

export default BookTile;