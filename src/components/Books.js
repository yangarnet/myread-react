
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Books extends Component {
    /**
    *@constructor init book state
    */
    constructor(props) {
        super(props);
        this.state = {value: this.props.status};
        this.handleSelect = this.handleSelect.bind(this);
    }

    handleSelect(e) {
        const currentBook = {
            publicationId: this.props.bookId,
            author: this.props.author,
            title: this.props.title,
            image: this.props.image
        };

        this.props.moveBook(currentBook, e.target.value);
    }

    render() {
        return (
          <div className="book">
            <div className="book-top">
              <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${this.props.image})` }}></div>
              <div className="book-shelf-changer">
                <select onChange={this.handleSelect} value={this.state.value}>
                  <option value="none" disabled>Move to...</option>
                  <option value="currentlyReading">Currently Reading</option>
                  <option value="wantToRead">Want to Read</option>
                  <option value="read">Read</option>
                  <option value="none">None</option>
                </select>
              </div>
            </div>
            <div className="book-title">{this.props.title}</div>
            <div className="book-authors">{this.props.author}</div>
          </div>
        );
    }
}

Books.propTypes = {
  status: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  title:  PropTypes.string.isRequired,
  image:  PropTypes.string.isRequired
};

export default Books;
