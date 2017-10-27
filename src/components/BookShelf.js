import React from 'react';
import Book from './Book';
import PropTypes from 'prop-types';

const NO_SHELF = 'none';
const getBookShelfName = (shelf) => {
  switch (shelf) {
    case 'currentlyReading': return 'Currently Reading';
    case 'wantToRead': return 'Want to Read';
    case 'read': return 'Read';
    default: return 'Read';
  }
}

const BookShelf = (props) => (
        <div className="bookshelf">
          <h2 className="bookshelf-title">{getBookShelfName(props.shelf)}</h2>
          <div className="bookshelf-books">
            <ol className="books-grid">
            {props.books.map(book =>
              <li key={book.id}>
                <Book
                    bookId={book.id}
                    author={book.author} title={book.title}
                    image={book.image} shelf={props.shelf}
                    moveBook={props.moveBook}
                    deleteBook={props.deleteBook}
                />
              </li>
            )}
            </ol>
          </div>
        </div>
    );


BookShelf.propTypes = {
  shelf: PropTypes.string.isRequired,
  books: PropTypes.array.isRequired,
  deleteBook: PropTypes.func.isRequired,
  moveBook: PropTypes.func.isRequired
};

BookShelf.defaultProps = {
  shelf: NO_SHELF,
  books: []
};

export default BookShelf;
