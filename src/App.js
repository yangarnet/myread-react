
import React, { Component } from 'react';
import BookShelf from './components/BookShelf';
import Books from './components/Books'
import initBooks from './initBooks';
import * as BooksAPI from './BooksAPI';
import escapeRegExp from 'escape-string-regexp';
import { Route, Link } from 'react-router-dom';
import './App.css';

const NOT_FOUND = -1;
const ZERO = 0;
const ONE = 1;
const bookShelves = {
    currentReading: 'currentlyReading',
    wantToRead: 'wantToRead',
    read: 'read'
};
const bookList = initBooks();

class App extends Component {
    /**
    *@constructor init the state properties for the App
    */
    constructor(props) {
        super(props);
        this.state = {
            currentReadingBook: bookList.currentReadingBooks,
            willReadBook: bookList.booksToRead,
            inStockBook: bookList.booksInStock,
            booksFromSearch: [],
            query: ''
        };
        this.onMoveBook = this.onMoveBook.bind(this);
        this.updateQuery = this.updateQuery.bind(this);
    }

    componentDidMount() {
        this.searchAllBooks();
    }
    /**
    *@param {event} e - source event
    */
    updateQuery(e) {
      this.setState({
        query: e.value
      })
    }

    searchAllBooks() {
        const response = BooksAPI.getAll();
        response.then(data => {
            let books = [];
            data.forEach(book => {
              books.push({
                publicationId: book.id,
                author: book.authors[ZERO],
                title: book.title,
                image: book.imageLinks.thumbnail,
                status: book.shelf
              });
            });

            this.setState({
                booksFromSearch: books
            });
        });
    }
    /**
    *@description filter given book out of a book array and return a new one
    *@param {array} books -  an array of books to filter
    *@param {object} currentBook - a book to exclude from array of books
    *@return {array} returns a new array of books after filter
    */
    filterBook(books, currentBook) {
        return books.filter(item => item.publicationId !== currentBook.publicationId);
    }
    /**
    *@description find the given book index from a book array object
    *@param {array} books - an array of books
    @param {object} bookToFind -  a book to locate from the array of books
    @return {number} index of the book object found in the array of books
    */
    findBookIndex(books, bookToFind) {
        return books.findIndex(book => book.publicationId === bookToFind.publicationId);
    }
    /**
    *@description  handle moving selected books to target book shelf and update source book shelf
    *@param {object} currentBook - the book selected to move to another book shelf
    *@param {array} bookShelf1 - the book shelf where the selected book will be moved to
    *@param {array} bookShelf2 - the book shelf where selected booked original might sit
    *@param {array} bookShelf3 - the book shelf where selected booked original might sit
    */
    handleMoveBooks(currentBook, bookShelf1, bookShelf2, bookShelf3) {
        bookShelf1.push(currentBook);
        let index = this.findBookIndex(bookShelf2, currentBook);
        if (index !== NOT_FOUND) {
            bookShelf2.splice(index, ONE);
            //found the book in this shelf, no need to further search
            return;
        }
        index = this.findBookIndex(bookShelf3, currentBook);
        if (index !== NOT_FOUND) {
            bookShelf3.splice(index, ONE);
        }
    }
    /**
    *@description move current selecting book to another book shelf
    *@param {object} bookSelected - the book currently selected to move to new book shelf
    *@param {string} moveToBookShelf - the book shelf that the selected book will be moved to
    */
    onMoveBook(bookSelected, moveToBookShelf)  {
        let { currentReadingBook, willReadBook, inStockBook , booksFromSearch} = this.state;

        if (moveToBookShelf === bookShelves.currentReading ) {
            this.handleMoveBooks(bookSelected, currentReadingBook, willReadBook, inStockBook);
        }
        if (moveToBookShelf === bookShelves.wantToRead) {
            this.handleMoveBooks(bookSelected, willReadBook, currentReadingBook, inStockBook);
        }
        if (moveToBookShelf === bookShelves.read) {
            this.handleMoveBooks(bookSelected, inStockBook, currentReadingBook, willReadBook);
        }

        booksFromSearch = this.filterBook(booksFromSearch, bookSelected);

        this.setState({
            currentReadingBook: currentReadingBook,
            willReadBook: willReadBook,
            inStockBook: inStockBook,
            booksFromSearch: booksFromSearch
        });
    }

    render() {
      let showSearchBooks = [];
      let {currentReadingBook, willReadBook, inStockBook, booksFromSearch, query} = this.state;
      if (query) {
        const match = new RegExp(escapeRegExp(query, 'i'));
        showSearchBooks = booksFromSearch.filter(book => match.test(book.title) || match.test(book.author));
      } else {
        showSearchBooks = booksFromSearch;
      }

      return (
        <div className="app">
          <Route path="/search" render={()=>(
              <div className="search-books">
                <div className="search-books-bar">
                  <Link className="close-search" to="/">Close</Link>
                  <div className="search-books-input-wrapper">
                    <input type="text" placeholder="Search by title or author" value={this.state.query} onChange={(event)=>this.updateQuery(event.target)}/>
                  </div>
                </div>
                <Route exact path="/search" render={() =>(
                    <div className="search-books-results">
                      <ol className="books-grid">
                          {
                              showSearchBooks && showSearchBooks.map(book =>
                                  <li key={book.title}>
                                    <Books
                                        bookId={book.publicationId}
                                        author={book.author} title={book.title}
                                        image={book.image} status={book.status}
                                        moveBook={this.onMoveBook}
                                        />
                                  </li>
                              )
                          }
                      </ol>
                    </div>
                )}/>
              </div>
          )}/>

          <Route exact path="/" render={()=> (
              <div className="list-books">
                <div className="list-books-title">
                  <h1>MyReads</h1>
                </div>
                <div className="list-books-content">
                  <div>
                    <BookShelf status={bookShelves.currentReading} books={currentReadingBook} moveBookToShelf={this.onMoveBook} />
                    <BookShelf status={bookShelves.wantToRead} books={willReadBook} moveBookToShelf={this.onMoveBook}/>
                    <BookShelf status={bookShelves.read} books={inStockBook} moveBookToShelf={this.onMoveBook}/>
                  </div>
                </div>
                <div className="open-search">
                  <Link to="/search"> Add a book </Link>
                </div>
              </div>
          )}/>
        </div>
    );
    }
}

export default App;
