export enum Cover {
    Hardcover = "hardcover",
    Paperback = "paperback",
}

export interface Book {
    id: string;
    img_path: string;
    title: string;
    author: string;
    genre: string;
    price: number;
    num_pages: number;
    cover: Cover;
    description: string;
    userId?: string;
}