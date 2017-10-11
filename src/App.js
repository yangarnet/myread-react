import React, { Component } from 'react';
import BookShelf from './components/BookShelf';
import Books from './components/Books'
import fetchBooksByCategory from './FetchBooks';
import * as BooksAPI from './BooksAPI'
import './App.css';


const bookList = fetchBooksByCategory();

const bookShelves = [
  {
    status: 'currentlyReading'
  },
  {
    status: 'wantToRead'
  },
  {
    status: 'read'
  }
];

class BooksApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showSearchPage: false,
            currentReadingBook: bookList.currentReadingBooks,
            willReadBook: bookList.booksToRead,
            inStockBook: bookList.booksInStock,
            allBooks: []
        };
        this.handleMovingBookAround = this.handleMovingBookAround.bind(this);
    }
    componentWillMount() {
        console.log(`hey, get all books now`);
        this.getAllBooks();
    }
    componentDidMount() {

    }
    componentWillUnmount() {
    }

    getAllBooks() {
        const response = BooksAPI.getAll();
        response.then(data => {
            this.setState({
                allBooks: data
            });
            this.state.allBooks.forEach(book=>{
                console.log(`book Shelf?: ${book.shelf}`);
            });
        });
    }

    filterBook(books, currentBook) {
        return books.filter((item) => {
            if (item.publicationId !== currentBook.publicationId) {
                return item;
            }
        });
    }

    findBook(books, bookToFind) {
        return books.find(book => {
            if (book.publicationId === bookToFind.publicationId) {
                return book;
            }
        });
    }

    //handler going before render method
    handleMovingBookAround(bookSelected, moveToBookShelf)  {
        let { currentReadingBook, willReadBook, inStockBook } = this.state;
        if (moveToBookShelf === bookShelves[0].status ) {

            //this.updateBooksOnShelf(bookSelected, currentReadingBook, willReadBook, inStockBook);
            currentReadingBook.push(bookSelected);

            if (this.findBook(willReadBook, bookSelected)) {
                willReadBook = this.filterBook(willReadBook, bookSelected);
            }

            if (this.findBook(inStockBook, bookSelected)) {
                inStockBook = this.filterBook(inStockBook, bookSelected);
            }
        }
        if (moveToBookShelf === bookShelves[1].status && !this.findBook(willReadBook, bookSelected)) {
            //this.updateBooksOnShelf(bookSelected, willReadBook, currentReadingBook, inStockBook);
            willReadBook.push(bookSelected);

            if (this.findBook(currentReadingBook, bookSelected)) {
                currentReadingBook = this.filterBook(currentReadingBook, bookSelected);
            }

            if (this.findBook(inStockBook, bookSelected)) {
                inStockBook = this.filterBook(inStockBook, bookSelected);
            }

        }
        if (moveToBookShelf === bookShelves[2].status && !this.findBook(inStockBook, bookSelected)) {
            //this.updateBooksOnShelf(bookSelected, inStockBook, willReadBook, currentReadingBook);
            inStockBook.push(bookSelected);

            if (this.findBook(currentReadingBook, bookSelected)) {
                currentReadingBook = this.filterBook(currentReadingBook, bookSelected);
            }

            if (this.findBook(willReadBook, bookSelected)) {
                willReadBook = this.filterBook(willReadBook, bookSelected);
            }
        }

        this.setState({
            currentReadingBook: currentReadingBook,
            willReadBook: willReadBook,
            inStockBook: inStockBook
        });
    }
    doit() {
        console.log('let us do it now');
    }
    render() {

        return (
          <div className="app">
            {this.state.showSearchPage ? (
              <div className="search-books">
                <div className="search-books-bar">
                  <a className="close-search" onClick={() => this.setState({ showSearchPage: false })}>Close</a>
                  <div className="search-books-input-wrapper">
                    {/*
                      NOTES: The search from BooksAPI is limited to a particular set of search terms.
                      You can find these search terms here:
                      https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                      However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                      you don't find a specific author or title. Every search is limited by search terms.
                    */}
                    <input type="text" placeholder="Search by title or author"/>
                  </div>
                </div>
                <div className="search-books-results">
                  <ol className="books-grid">
                      {
                          this.state.allBooks && this.state.allBooks.map(book =>
                              <li key={book.title}>
                                <Books
                                    bookId={book.id}
                                    author={book.authors[0]} title={book.title}
                                    image={book.imageLinks.thumbnail} status={book.shelf}
                                    moveBook={this.handleMovingBookAround}
                                    />
                              </li>
                          )
                      }
                  </ol>
                </div>
              </div>
            ) : (
              <div className="list-books">
                <div className="list-books-title">
                  <h1>MyReads</h1>
                </div>
                <div className="list-books-content">
                  <div>
                    <BookShelf status={bookShelves[0].status} books={this.state.currentReadingBook} moveBookToShelf={this.handleMovingBookAround} />
                    <BookShelf status={bookShelves[1].status} books={this.state.willReadBook} moveBookToShelf={this.handleMovingBookAround}/>
                    <BookShelf status={bookShelves[2].status} books={this.state.inStockBook} moveBookToShelf={this.handleMovingBookAround}/>
                  </div>
                </div>
                <div className="open-search">
                  <a onClick={ () => {
                          this.setState({ showSearchPage: true });
                      }}>
                      Add a book
                  </a>
                </div>
              </div>
            )}
          </div>
        )
    }
}

export default BooksApp
