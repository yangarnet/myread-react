import React, { Component } from 'react'
import Books from './Books'
import PropTypes from 'prop-types';

class BookShelf extends Component {

  constructor(props) {
    super(props);
    this.getBookShelfTitle = this.getBookShelfTitle.bind(this);
  }

  getBookShelfTitle(status) {
    switch (status) {
      case 'currentlyReading': return 'Currently Reading';
      case 'wantToRead': return 'Want to Read';
      case 'read': return 'Read';
      default: return 'Read';
    }
  }

  render() {

    return (
        <div className="bookshelf">
          <h2 className="bookshelf-title">{this.getBookShelfTitle(this.props.status)}</h2>
          <div className="bookshelf-books">
            <ol className="books-grid">
            {this.props.books.map(book =>
              <li key={book.publicationId}>
                <Books
                    bookId={book.publicationId}
                    author={book.author} title={book.title}
                    image={book.image} status={this.props.status}
                    moveBook={this.props.moveBookToShelf}
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
  status: PropTypes.string.isRequired,
  books: PropTypes.array.isRequired,
  moveBookToShelf: PropTypes.func.isRequired
};

export default BookShelf;
