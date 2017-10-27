import React, { Component } from 'react';
import BookShelf from './BookShelf';
import { Route, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class BookDisplayPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Route exact path="/" render={()=> (
                <div className="list-books">
                  <div className="list-books-title">
                    <h1>MyReads</h1>
                  </div>
                  <div className="list-books-content">
                    <div>
                      <BookShelf shelf={this.props.currentReading} books={this.props.currentReadingBooks} moveBook={this.props.moveBook} deleteBook={this.props.deleteBook}/>
                      <BookShelf shelf={this.props.wantToRead} books={this.props.wantToReadBooks} moveBook={this.props.moveBook} deleteBook={this.props.deleteBook}/>
                      <BookShelf shelf={this.props.read} books={this.props.planToReadBooks} moveBook={this.props.moveBook} deleteBook={this.props.deleteBook}/>
                    </div>
                  </div>
                  <div className="open-search">
                    <Link to="/search" onClick={()=> this.props.clearQuery()}> Add a book </Link>
                  </div>
                </div>
            )}/>
        );
    }
}

BookDisplayPage.propTypes = {
  currentReadingBooks: PropTypes.array,
  wantToReadBooks: PropTypes.array,
  planToReadBooks:  PropTypes.array,
  booksFromSearch: PropTypes.array,
  moveBook:  PropTypes.func,
  deleteBook: PropTypes.func,
  updateQuery: PropTypes.func
};

export default BookDisplayPage;
