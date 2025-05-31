import { addDoc, collection, query, serverTimestamp, getDocs, doc, updateDoc, getDoc, deleteDoc } from "firebase/firestore";
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

export const getBookById = async (bookId: string): Promise<Book | null> => {
  const bookDocRef = doc(db, "books", bookId);
  try {
    const docSnap = await getDoc(bookDocRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log("Document data:", data);
      return {
        id: docSnap.id,
        img_path: data.img_path,
        title: data.title,
        author: data.author,
        genre: data.genre,
        price: data.price,
        num_pages: data.num_pages,
        cover: data.cover,
        description: data.description,
        userId: data.userId,
      } as Book;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting book by ID: ", error);
    return null;
  }
};

export const updateBook = async (bookId: string, updatedBookData: Partial<Omit<Book, 'id' | 'userId'>>) => {
  if (!auth?.currentUser) {
    console.error("User not logged in");
    return;
  }

  const bookDocRef = doc(db, "books", bookId);
  try {
    const bookSnap = await getDoc(bookDocRef);
    if (bookSnap.exists()) {
      const bookData = bookSnap.data();
      if (bookData.userId !== auth.currentUser.uid) {
        console.error("User is not authorized to edit this book.");
        return;
      }
    } else {
      return;
    }

    await updateDoc(bookDocRef, {
      ...updatedBookData,
    });
    console.log("Book updated:", bookId);
    const updatedDocSnap = await getDoc(bookDocRef);
    if (updatedDocSnap.exists()) {
        const data = updatedDocSnap.data();
        return {
            id: updatedDocSnap.id,
            img_path: data.img_path,
            title: data.title,
            author: data.author,
            genre: data.genre,
            price: data.price,
            num_pages: data.num_pages,
            cover: data.cover,
            description: data.description,
            userId: data.userId,
        } as Book;
    }
    return null;
  } catch (error) {
    console.error("Error updating book: ", error);
  }
};

export const deleteBook = async (bookId: string) => {
  if (!auth?.currentUser) {
    console.error("User not logged in");
    return false;
  }

  const bookDocRef = doc(db, "books", bookId);
  try {
    const bookSnap = await getDoc(bookDocRef);
    if (bookSnap.exists()) {
      const bookData = bookSnap.data();
      if (bookData.userId !== auth.currentUser.uid) {
        console.error("User is not authorized to delete this book.");
        return false;
      }
    } else {
      console.log("No such document to delete!");
      return false;
    }

    await deleteDoc(bookDocRef);
    console.log("Book deleted:", bookId);
    return true;
  } catch (error) {
    console.error("Error deleting book: ", error);
    return false;
  }
};