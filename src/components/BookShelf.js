import React from 'react'
import Books from './Books'


class BookShelf extends React.Component {

  render() {

    return (
        <div className="bookshelf">
          <h2 className="bookshelf-title">{this.props.status}</h2>
          <div className="bookshelf-books">
            <ol className="books-grid">
            {this.props.books.map(book =>
              <li key={book.title}>
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


export default BookShelf;
