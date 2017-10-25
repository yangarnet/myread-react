
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Book extends Component {
    /**
    *@constructor
    */
    constructor(props) {
        super(props);
        this.handleSelect = this.handleSelect.bind(this);
    }

    handleSelect(e) {
        const currentBook = {
            id: this.props.bookId,
            author: this.props.author,
            title: this.props.title,
            image: this.props.image
        };
        if (e.target.value === 'delete') {
            console.log(this.props);
            this.props.deleteBook(currentBook);
        } else {
            console.log(this.props);
            this.props.moveBook(currentBook, e.target.value);
        }
    }

    render() {
        return (
          <div className="book">
            <div className="book-top">
              <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${this.props.image})` }}></div>
              <div className="book-shelf-changer">
                <select onChange={this.handleSelect} value={this.props.shelf}>
                  <option value="none" disabled>Move to...</option>
                  <option value="currentlyReading">Currently Reading</option>
                  <option value="wantToRead">Want to Read</option>
                  <option value="read">Read</option>
                  <option value="delete">Delete</option>
                </select>
              </div>
            </div>
            <div className="book-title">{this.props.title}</div>
            <div className="book-authors">{this.props.author}</div>
          </div>
        );
    }
}

Book.propTypes = {
  shelf: PropTypes.string,
  author: PropTypes.string,
  title:  PropTypes.string.isRequired,
  image:  PropTypes.string.isRequired
};

export default Book;
