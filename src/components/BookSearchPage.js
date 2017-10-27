import React from 'react';
import { Debounce } from 'react-throttle';
import { Route, Link } from 'react-router-dom';
import Book from './Book';
import PropTypes from 'prop-types';

const BookSearchPage = (props) => (
        <Route path="/search" render={()=>(
            <div className="search-books">
              <div className="search-books-bar">
                <Link className="close-search" to="/">Close</Link>
                <div className="search-books-input-wrapper">
                  <Debounce time="250" handler="onChange">
                     <input type="text" placeholder="Search by title or author" onChange={(e)=>props.updateQuery(e.target.value)}/>
                  </Debounce>
                </div>
              </div>
              <Route exact path="/search" render={() =>(
                  <div className="search-books-results">
                   <lable>Total Books: {props.booksFromSearch.length}</lable>
                    <ol className="books-grid">
                      {
                          props.booksFromSearch && props.booksFromSearch.map(book =>
                              <li key={book.id}>
                                <Book
                                    bookId={book.id}
                                    author={book.author} title={book.title}
                                    image={book.image} shelf={book.shelf}
                                    moveBook={props.moveBook}
                                    deleteBook={props.deleteBook}
                                />
                              </li>
                          )
                      }
                    </ol>
                  </div>
              )}/>
            </div>
        )}/>
);

BookSearchPage.propTypes = {
    moveBook: PropTypes.func.isRequired,
    deleteBook: PropTypes.func.isRequired,
    updateQuery: PropTypes.func.isRequired,
    booksFromSearch: PropTypes.array
};

BookSearchPage.defaultProps = {
  booksFromSearch: []
};

export default BookSearchPage;
