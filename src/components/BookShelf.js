import React from 'react'
import Books from './Books'


class BookShelf extends React.Component {

  render() {
    console.log(this.props.books);
    return (
        <div className="bookshelf">
          <h2 className="bookshelf-title">{this.props.status}</h2>
          <div className="bookshelf-books">
            <ol className="books-grid">
            {this.props.books.map(book =>
              <li key={book.title}>
                <Books author={book.author} title={book.title} image={book.image} />
              </li>
            )}
            </ol>
          </div>
        </div>
    );
  }

}


export default BookShelf;
