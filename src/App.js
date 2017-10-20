
import React, { Component } from 'react';
import BookShelf from './components/BookShelf';
import Books from './components/Books'
import * as BooksAPI from './BooksAPI';
import escapeRegExp from 'escape-string-regexp';
import { Route, Link } from 'react-router-dom';
import './App.css';

/**

shelf:"currentlyReading"
shelf:"wantToRead"
shelf:"read"

*/
const NOT_FOUND = -1;
const ZERO = 0;
const ONE = 1;
const bookShelves = {
    currentReading: 'currentlyReading',
    wantToRead: 'wantToRead',
    read: 'read',
    none: 'none'
};

class App extends Component {
    /**
    *@constructor init the state properties for the App
    */
    constructor(props) {
        super(props);
        this.state = {
            currentReadingBooks: [],
            wantToReadBooks: [],
            planToReadBooks: [],
            booksFromSearch: [],
            query: ''
        };
        this.handleMoveBook = this.handleMoveBook.bind(this);
        this.handleDeleteBook = this.handleDeleteBook.bind(this);
        this.searchBooksByCriteria = this.searchBooksByCriteria.bind(this);
    }

    componentWillMount() {
        this.initBooksOnShelf();
        this.searchBooksByCriteria();
    }

    initBooksOnShelf() {
        const response = BooksAPI.getAll();
        response.then(data => {
            let books = [];
            data.forEach(book => {
              books.push({
                id: book.id,
                author: book.authors && book.authors[ZERO],
                title: book.title,
                image: book.imageLinks && book.imageLinks.thumbnail,
                shelf: book.shelf
              });
            });
            this.setState({
                currentReadingBooks: books.filter((item) => {if(item.shelf === bookShelves.currentReading) return item;}),
                wantToReadBooks: books.filter((item) => {if(item.shelf === bookShelves.wantToRead) return item;}),
                planToReadBooks: books.filter((item) => {if(item.shelf === bookShelves.read) return item;})
            });
        });
    }

    /**
    *@description search books by given criteria, search 'React' by default and return max 20
    @param {string} query - search string
    @param {number} maxResults  max books in return
    */
    searchBooksByCriteria(criteria = 'React', maxResults = 20) {
        const resp = BooksAPI.search(criteria, maxResults);
        resp.then(data => {
            let books = [];
            data && Array.isArray(data) && data.forEach(book => {
                books.push({
                    id: book.id,
                    author: book.authors && book.authors[ZERO],
                    title: book.title,
                    image: book.imageLinks && book.imageLinks.thumbnail,
                    shelf: 'none'
                });
            });
            this.setState({
                booksFromSearch: books
            });
        });
    }

    /**
    *@param {event} e - source event
    */
    updateQuery(e) {
      this.setState({ query: e.value });
      this.searchBooksByCriteria(this.state.query);
    }

    /**
    *@description filter given book out of a book array and return a new one
    *@param {array} books -  an array of books to filter
    *@param {object} currentBook - a book to exclude from array of books
    *@return {array} returns a new array of books after filter
    */
    filterBook(books, currentBook) {
        return books.filter(item => item.id !== currentBook.id);
    }
    /**
    *@description find the given book index from a book array object
    *@param {array} books - an array of books
    @param {object} bookToFind -  a book to locate from the array of books
    @return {number} index of the book object found in the array of books
    */
    findBookIndex(books, bookToFind) {
        return books.findIndex(book => book.id === bookToFind.id);
    }
    /**
    *@description  update books on shelf
    *@param {object} currentBook - the book selected to move to another book shelf
    *@param {array} bookShelf1 - the book shelf where the selected book will be moved to
    *@param {array} bookShelf2 - the book shelf where selected booked original might sit
    *@param {array} bookShelf3 - the book shelf where selected booked original might sit
    */
    updateBookshelf(currentBook, bookShelf1, bookShelf2, bookShelf3) {
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
    handleMoveBook(bookSelected, moveToBookShelf)  {
        let { currentReadingBooks, wantToReadBooks, planToReadBooks , booksFromSearch } = this.state;

        let isMovedFromSearch = this.findBookIndex(booksFromSearch, bookSelected);

        if (isMovedFromSearch !== NOT_FOUND) {
            booksFromSearch.splice(isMovedFromSearch, ONE)
        }

        if (moveToBookShelf === bookShelves.currentReading) {
            if (isMovedFromSearch !== NOT_FOUND) {
                bookSelected.shelf = bookShelves.currentReading;
            }
            this.updateBookshelf(bookSelected, currentReadingBooks, wantToReadBooks, planToReadBooks);
            BooksAPI.update(bookSelected, bookShelves.currentReading);
        }
        if (moveToBookShelf === bookShelves.wantToRead) {
            if (isMovedFromSearch !== NOT_FOUND) {
                bookSelected.shelf = bookShelves.wantToRead;
            }
            this.updateBookshelf(bookSelected, wantToReadBooks, currentReadingBooks, planToReadBooks);
            BooksAPI.update(bookSelected, bookShelves.wantToRead);
        }
        if (moveToBookShelf === bookShelves.read) {
            if (isMovedFromSearch !== NOT_FOUND) {
                bookSelected.shelf = bookShelves.read;
            }
            this.updateBookshelf(bookSelected, planToReadBooks, currentReadingBooks, wantToReadBooks);
            BooksAPI.update(bookSelected, bookShelves.read);
        }

        this.setState({
            currentReadingBooks: currentReadingBooks,
            wantToReadBooks: wantToReadBooks,
            planToReadBooks: planToReadBooks,
            booksFromSearch: booksFromSearch
        });
    }

    /**
    *@description delete selected book from book shelf
    *@param {object} the book selected to delete from current book shelf
    @return {void}
    */
    handleDeleteBook(bookSelected) {
        let { currentReadingBooks, wantToReadBooks, planToReadBooks , booksFromSearch } = this.state;
        let index = this.findBookIndex(currentReadingBooks, bookSelected);
        if (index !== NOT_FOUND) {
            currentReadingBooks.splice(index, ONE);
        }

        index = this.findBookIndex(wantToReadBooks, bookSelected);
        if (index !== NOT_FOUND) {
            wantToReadBooks.splice(index, ONE);
        }

        index = this.findBookIndex(planToReadBooks, bookSelected);
        if (index !== NOT_FOUND) {
            planToReadBooks.splice(index, ONE);
        }

        index = this.findBookIndex(booksFromSearch, bookSelected);
        if (index !== NOT_FOUND) {
            booksFromSearch.splice(index, ONE);
        }

        this.setState({
            currentReadingBooks: currentReadingBooks,
            wantToReadBooks: wantToReadBooks,
            planToReadBooks: planToReadBooks,
            booksFromSearch: booksFromSearch
        });

        BooksAPI.update(bookSelected, bookShelves.none);
    }

    render() {
      const {currentReadingBooks, wantToReadBooks, planToReadBooks ,booksFromSearch} = this.state;
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
                     <lable>Total Books: {booksFromSearch.length}</lable>
                      <ol className="books-grid">
                          {
                              booksFromSearch && booksFromSearch.map(book =>
                                  <li key={book.id}>
                                    <Books
                                        bookId={book.id}
                                        author={book.author} title={book.title}
                                        image={book.image} shelf={book.shelf}
                                        moveBook={this.handleMoveBook}
                                        deleteBook={this.handleDeleteBook}
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
                    <BookShelf shelf={bookShelves.currentReading} books={currentReadingBooks} moveBook={this.handleMoveBook} deleteBook={this.handleDeleteBook}/>
                    <BookShelf shelf={bookShelves.wantToRead} books={wantToReadBooks} moveBook={this.handleMoveBook} deleteBook={this.handleDeleteBook}/>
                    <BookShelf shelf={bookShelves.read} books={planToReadBooks} moveBook={this.handleMoveBook} deleteBook={this.handleDeleteBook}/>
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
