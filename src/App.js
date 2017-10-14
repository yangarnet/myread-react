
import React, { Component } from 'react';
import BookShelf from './components/BookShelf';
import Books from './components/Books'
import initBooks from './initBooks';
import * as BooksAPI from './BooksAPI';
import './App.css';
import escapeRegExp from 'escape-string-regexp';
import sortBy from 'sort-by';
import { Route, Link } from 'react-router-dom';

const bookList = initBooks();

const bookShelves = ['currentlyReading', 'wantToRead', 'read'];

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showSearchPage: false,
            currentReadingBook: bookList.currentReadingBooks,
            willReadBook: bookList.booksToRead,
            inStockBook: bookList.booksInStock,
            booksFromSearch: [],
            query: ''
        };
        this.moveBook = this.moveBook.bind(this);
        this.updateQuery = this.updateQuery.bind(this);
        this.searchForBooks = this.searchForBooks.bind(this);
    }

    componentDidMount() {
        console.log('componentDidMount');
        this.searchForBooks();
    }

    searchForBooks() {
        const response = BooksAPI.getAll();
        response.then(data => {
            let books = [];
            data.forEach(book => {
              books.push({
                publicationId: book.id,
                author: book.authors[0],
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
    moveBook(bookSelected, moveToBookShelf)  {
        let { currentReadingBook, willReadBook, inStockBook , booksFromSearch} = this.state;

        if (moveToBookShelf === bookShelves[0] ) {
            currentReadingBook.push(bookSelected);
            if (this.findBook(willReadBook, bookSelected)) {
                willReadBook = this.filterBook(willReadBook, bookSelected);
            }
            if (this.findBook(inStockBook, bookSelected)) {
                inStockBook = this.filterBook(inStockBook, bookSelected);
            }
        }
        if (moveToBookShelf === bookShelves[1]) {
            willReadBook.push(bookSelected);
            if (this.findBook(currentReadingBook, bookSelected)) {
                currentReadingBook = this.filterBook(currentReadingBook, bookSelected);
            }
            if (this.findBook(inStockBook, bookSelected)) {
                inStockBook = this.filterBook(inStockBook, bookSelected);
            }
        }
        if (moveToBookShelf === bookShelves[2]) {
            inStockBook.push(bookSelected);
            if (this.findBook(currentReadingBook, bookSelected)) {
                currentReadingBook = this.filterBook(currentReadingBook, bookSelected);
            }
            if (this.findBook(willReadBook, bookSelected)) {
                willReadBook = this.filterBook(willReadBook, bookSelected);
            }
        }

        booksFromSearch = this.filterBook(booksFromSearch, bookSelected);

        this.setState({
            currentReadingBook: currentReadingBook,
            willReadBook: willReadBook,
            inStockBook: inStockBook,
            booksFromSearch: booksFromSearch
        });
    }

    updateQuery(e) {
      this.setState({
        query: e.target.value
      })
    }


    render() {
      let showSearchBooks = [];
      let {booksFromSearch, query} = this.state;
      if (this.state.query) {
        const match = new RegExp(escapeRegExp(query, 'i'));
        showSearchBooks = booksFromSearch.filter(book => match.test(book.title));
      } else {
        showSearchBooks = booksFromSearch;
      }
      showSearchBooks.sort(sortBy('name'));

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
                  <input type="text" placeholder="Search by title or author" value={this.state.query} onChange={(event)=>this.updateQuery(event)}/>
                </div>
              </div>

              <div className="search-books-results">
                <ol className="books-grid">
                    {
                        showSearchBooks && showSearchBooks.map(book =>
                            <li key={book.title}>
                              <Books
                                  bookId={book.publicationId}
                                  author={book.author} title={book.title}
                                  image={book.image} status={book.status}
                                  moveBook={this.moveBook}
                                  />
                            </li>
                        )
                    }
                </ol>
              </div>
            </div>
          ) : (
            <Route path="/" render={()=>(
              <div className="list-books">
                <div className="list-books-title">
                  <h1>MyReads</h1>
                </div>
                <div className="list-books-content">
                  <div>
                    <BookShelf status={bookShelves[0]} books={this.state.currentReadingBook} moveBookToShelf={this.moveBook} />
                    <BookShelf status={bookShelves[1]} books={this.state.willReadBook} moveBookToShelf={this.moveBook}/>
                    <BookShelf status={bookShelves[2]} books={this.state.inStockBook} moveBookToShelf={this.moveBook}/>
                  </div>
                </div>
                <div className="open-search">
                  <Link onClick={ () => {this.setState({ showSearchPage: true })}} to="/search">
                      Add a book
                  </Link>
                </div>
              </div>
            )}/>
          )}
        </div>
      )
    }
}

export default App;
