import { useState, useEffect } from "react";
import BookCard from "./BookCard";

// const response = await fetch('https://example.com/image.jpg');
// const blob = await response.blob();

// // ШАГ 2: Превращаем BLOB в ссылку (временную)
// const imageUrl = URL.createObjectURL(blob);

// // ШАГ 3: Используем в теге img
// <img src={imageUrl} alt="обложка" />

// // ШАГ 4: Когда картинка не нужна — удаляем (чтобы не засорять память)
// URL.revokeObjectURL(imageUrl);
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function App() {
  const [book, setBook] = useState([]);
  useEffect(() => {
    async function loadBooks() {
      const response = await fetch("https://fakeapi.extendsclass.com/books");
      const booksData = await response.json(); 

      for (let i = 0; i < booksData.length; i++) {
        const book = booksData[i];
        
        if (book.isbn) { 
          const googleResponse = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${book.isbn}`);
          const googleData = await googleResponse.json(); 
          
          const thumbnailUrl = googleData.items?.[0]?.volumeInfo?.imageLinks?.thumbnail;
          
          if (thumbnailUrl) {
              const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
              const imgResponse = await fetch(proxyUrl + thumbnailUrl);
              const blob = await imgResponse.blob();
              booksData[i].imageBlob = blob;
          }
          await delay(400);
        }
      }

      setBook(booksData); 
    }

    loadBooks();
  }, []);
  return(
  <div className="card_books">
    {book.map(bookItem => (
      <BookCard key={bookItem.id} picture={bookItem.imageBlob} name = {bookItem.title} author={bookItem.authors?.join(', ')} />
    ))}
  </div>  
  );
}

export default App;