
import React, { Component } from 'react';
import BookShelf from './components/BookShelf';
import Books from './components/Books'
import initBooks from './initBooks';
import * as BooksAPI from './BooksAPI';
import escapeRegExp from 'escape-string-regexp';
import { Route, Link } from 'react-router-dom';
import './App.css';

const bookList = initBooks();

const bookShelves = ['currentlyReading', 'wantToRead', 'read'];

class App extends Component {
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
        return books.filter(item => item.publicationId !== currentBook.publicationId);
    }

    findBookIndex(books, bookToFind) {
        return books.findIndex(book => book.publicationId === bookToFind.publicationId);
    }

    handleMoveBooks(currentBook, bookShelf1, bookShelf2, bookShelf3) {
        bookShelf1.push(currentBook);
        let index = this.findBookIndex(bookShelf2, currentBook);
        if (index !== -1) {
            bookShelf2.splice(index, 1);
            return;
        }
        index = this.findBookIndex(bookShelf3, currentBook);
        if (index !== -1) {
            bookShelf3.splice(index, 1);
        }
    }

    onMoveBook(bookSelected, moveToBookShelf)  {
        let { currentReadingBook, willReadBook, inStockBook , booksFromSearch} = this.state;

        if (moveToBookShelf === bookShelves[0] ) {
            this.handleMoveBooks(bookSelected, currentReadingBook, willReadBook, inStockBook);
        }
        if (moveToBookShelf === bookShelves[1]) {
            this.handleMoveBooks(bookSelected, willReadBook, currentReadingBook, inStockBook);
        }
        if (moveToBookShelf === bookShelves[2]) {
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
      let {booksFromSearch, query} = this.state;
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
                    <BookShelf status={bookShelves[0]} books={this.state.currentReadingBook} moveBookToShelf={this.onMoveBook} />
                    <BookShelf status={bookShelves[1]} books={this.state.willReadBook} moveBookToShelf={this.onMoveBook}/>
                    <BookShelf status={bookShelves[2]} books={this.state.inStockBook} moveBookToShelf={this.onMoveBook}/>
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
