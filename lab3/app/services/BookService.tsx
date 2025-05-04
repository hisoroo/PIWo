import { addDoc, collection, query, serverTimestamp, getDocs} from "firebase/firestore";
import { db, auth } from "./firebase";
import { Book } from "../interfaces/Book";

export const createBook = async (newBook: Omit<Book, 'id'>) => {
  if (!auth?.currentUser) {
    console.error("User not logged in");
    return;
  }

  const tempBook = {
    ...newBook,
    userId: auth.currentUser.uid,
    created: serverTimestamp()
  }
  const bookCollection = collection(db, "books");
  try {
    const docRef = await addDoc(bookCollection, tempBook);
    console.log("Book added:", docRef.id);
    return { id: docRef.id, ...tempBook };
  } catch (error) {
    console.error("Error adding book: ", error);
  }
}

export const readBooks = async (): Promise<Book[]> => {
  const books: Book[] = [];

  const bookCollection = collection(db, "books");
  const q = query(bookCollection);

  try {
    const results = await getDocs(q);
    results.forEach(doc => {
      const data = doc.data();
      const bookData: Book = {
        id: doc.id,
        img_path: data.img_path,
        title: data.title,
        author: data.author,
        genre: data.genre,
        price: data.price,
        num_pages: data.num_pages,
        cover: data.cover,
        description: data.description,
        userId: data.userId,
      };
      books.push(bookData);
    });
  } catch (error) {
    console.error("Error reading books: ", error);
  }

  return books;
}