import React, { Component } from 'react';
import * as BooksAPI from './BooksAPI';
import BookDisplayPage from './components/BookDisplayPage';
import BookSearchPage from './components/BookSearchPage';
import './App.css';

/**

shelf:"currentlyReading"
shelf:"wantToRead"
shelf:"read"

*/
const NOT_FOUND = -1;
const ZERO = 0;
const ONE = 1;
const NO_SHELF_APPLIED = 'none';
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
        this.updateQuery = this.updateQuery.bind(this);
        this.searchBooksByCriteria = this.searchBooksByCriteria.bind(this);
        this.initBooksOnShelf = this.initBooksOnShelf.bind(this);
        this.clearQuery = this.clearQuery.bind(this);
    }

    componentDidMount() {
        this.initBooksOnShelf();
    }
    /**
    *@description this method will be called to load books on the shelf when the app starts.
    */
    initBooksOnShelf() {
        const response = BooksAPI.getAll();
          response && response.then(data => {
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
                  currentReadingBooks: books.filter((item) => item.shelf === bookShelves.currentReading),
                  wantToReadBooks: books.filter((item) => item.shelf === bookShelves.wantToRead),
                  planToReadBooks: books.filter((item) => item.shelf === bookShelves.read)
              });
        });
    }

    /**
    *@description search books by given criteria, search 'React' by default and return max 20
    @param {string} query - search string
    @param {number} maxResults  max books in return
    */
    searchBooksByCriteria(criteria, maxResults = 20) {
      if (criteria) {
        let allBooksOnShelf = this.state.currentReadingBooks.concat(this.state.wantToReadBooks, this.state.planToReadBooks);
        let bookHashTable = {};
        allBooksOnShelf.forEach(book => bookHashTable[book.id] = book.shelf);
        const searchResult = BooksAPI.search(criteria, maxResults);

        searchResult && searchResult.then(data => {
            let books = [];
            data && Array.isArray(data) && data.forEach(book => {
                books.push({
                    id: book.id,
                    author: book.authors && book.authors[ZERO],
                    title: book.title,
                    image: book.imageLinks && book.imageLinks.thumbnail,
                    shelf: bookHashTable[book.id] || NO_SHELF_APPLIED
                });
            });
            this.setState({
                booksFromSearch: books
            });
        });
      }
    }

    /**
    *@param {event} e - source event
    */
    updateQuery(value) {
        this.setState({query: value, booksFromSearch: []});
        this.searchBooksByCriteria(value);
    }

    clearQuery() {
        this.setState({
            query: '',
            booksFromSearch: []
        });
    }

    /**
    *@description move current selecting book to another book shelf
    *@param {object} bookSelected - the book currently selected to move to new book shelf
    *@param {string} moveToBookShelf - the book shelf that the selected book will be moved to
    */
    handleMoveBook(bookSelected, moveToBookShelf)  {
        //make shallow copy , avoid mutate state
        let {currentReadingBooks, wantToReadBooks, planToReadBooks, booksFromSearch} = this.getShallowCopyOfBooks();
        let isMovedFromSearch = this.findBookIndex(booksFromSearch, bookSelected);

        if (isMovedFromSearch !== NOT_FOUND) {
            booksFromSearch.splice(isMovedFromSearch, ONE)
        }
        if (moveToBookShelf === bookShelves.currentReading) {
            this.updateBookshelf(bookSelected, currentReadingBooks, wantToReadBooks, planToReadBooks);
        }
        if (moveToBookShelf === bookShelves.wantToRead) {
            this.updateBookshelf(bookSelected, wantToReadBooks, currentReadingBooks, planToReadBooks);
        }
        if (moveToBookShelf === bookShelves.read) {
            this.updateBookshelf(bookSelected, planToReadBooks, currentReadingBooks, wantToReadBooks);
        }

        bookSelected.shelf = moveToBookShelf;
        BooksAPI.update(bookSelected, bookSelected.shelf);

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
        let {currentReadingBooks, wantToReadBooks, planToReadBooks, booksFromSearch} = this.getShallowCopyOfBooks();

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
    /**
    *@description get a shallow copy of books from state
    */
    getShallowCopyOfBooks() {
        return {
            currentReadingBooks: this.state.currentReadingBooks.slice(),
            wantToReadBooks: this.state.wantToReadBooks.slice(),
            planToReadBooks: this.state.planToReadBooks.slice(),
            booksFromSearch: this.state.booksFromSearch.slice()
        }
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

    render() {
      let {currentReadingBooks, wantToReadBooks, planToReadBooks, booksFromSearch} = this.getShallowCopyOfBooks();

      return (
            <div className="app">
                <BookSearchPage
                    booksFromSearch={this.state.booksFromSearch}
                    updateQuery={this.updateQuery}
                    moveBook={this.handleMoveBook}
                    deleteBook={this.handleDeleteBook}
                />

                <BookDisplayPage
                    currentReading={bookShelves.currentReading}
                    wantToRead={bookShelves.wantToRead}
                    read={bookShelves.read}
                    currentReadingBooks={currentReadingBooks}
                    wantToReadBooks={wantToReadBooks}
                    planToReadBooks={planToReadBooks}
                    moveBook={this.handleMoveBook}
                    deleteBook={this.handleDeleteBook}
                    clearQuery={this.clearQuery}
                />
          </div>
      );
    }
}

export default App;
