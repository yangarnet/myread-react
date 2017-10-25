import React, { Component } from 'react';
import Book from './Book';
import PropTypes from 'prop-types';

class BookShelf extends Component {

  constructor(props) {
    super(props);
    this.getBookShelfTitle = this.getBookShelfTitle.bind(this);
  }
  /**
  *@description parsing the book shelf shelf and return book shelf title
  *@param {string} shelf -  the book shelf(which shelf the book is placed)
  *@return {string} book shelf name
  */
  getBookShelfTitle(shelf) {
    switch (shelf) {
      case 'currentlyReading': return 'Currently Reading';
      case 'wantToRead': return 'Want to Read';
      case 'read': return 'Read';
      default: return 'Read';
    }
  }

  render() {

    return (
        <div className="bookshelf">
          <h2 className="bookshelf-title">{this.getBookShelfTitle(this.props.shelf)}</h2>
          <div className="bookshelf-books">
            <ol className="books-grid">
            {this.props.books.map(book =>
              <li key={book.id}>
                <Book
                    bookId={book.id}
                    author={book.author} title={book.title}
                    image={book.image} shelf={this.props.shelf}
                    moveBook={this.props.moveBook}
                    deleteBook={this.props.deleteBook}
                />
              </li>
            )}
            </ol>
          </div>
        </div>
    );
  }

}

BookShelf.propTypes = {
  shelf: PropTypes.string.isRequired,
  books: PropTypes.array.isRequired,
  deleteBook: PropTypes.func.isRequired,
  moveBook: PropTypes.func.isRequired
};

export default BookShelf;
