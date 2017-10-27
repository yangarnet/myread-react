import React from 'react';
import BookShelf from './BookShelf';
import { Route, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const BookDisplayPage = (props) => (
      <Route exact path="/" render={()=> (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                <BookShelf
                  shelf={props.currentReading}
                  books={props.currentReadingBooks}
                  moveBook={props.moveBook}
                  deleteBook={props.deleteBook}
                />
                <BookShelf
                  shelf={props.wantToRead}
                  books={props.wantToReadBooks}
                  moveBook={props.moveBook}
                  deleteBook={props.deleteBook}
                />
                <BookShelf
                  shelf={props.read}
                  books={props.planToReadBooks}
                  moveBook={props.moveBook}
                  deleteBook={props.deleteBook}
                />
              </div>
            </div>
            <div className="open-search">
              <Link to="/search" onClick={()=> props.clearQuery()}> Add a book </Link>
            </div>
          </div>
      )}/>
);

BookDisplayPage.propTypes = {
  currentReadingBooks: PropTypes.array,
  wantToReadBooks: PropTypes.array,
  planToReadBooks:  PropTypes.array,
  booksFromSearch: PropTypes.array,
  moveBook:  PropTypes.func.isRequired,
  deleteBook: PropTypes.func.isRequired
};

BookDisplayPage.defaultProps = {
  currentReadingBooks: [],
  wantToReadBooks: [],
  planToReadBooks:  [],
  booksFromSearch: [],
};

export default BookDisplayPage;
