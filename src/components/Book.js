
import React from 'react';
import PropTypes from 'prop-types';

const DELETE_ACTION = 'delete';
const NO_SHELF = 'none';
const handleBookShelfUpdate = (e, currentBook, props) => {
    if (e.target.value === DELETE_ACTION) {
        props.deleteBook(currentBook);
    } else {
        props.moveBook(currentBook, e.target.value);
    }
}

const Book = (props) => (
      <div className="book">
        <div className="book-top">
          <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${props.image})` }}></div>
          <div className="book-shelf-changer">
            <select onChange={(e) => {handleBookShelfUpdate(e, {id: props.bookId,author: props.author, title: props.title, image: props.image}, props)}} value={props.shelf}>
              <option value="none" disabled>Move to...</option>
              <option value="currentlyReading">Currently Reading</option>
              <option value="wantToRead">Want to Read</option>
              <option value="read">Read</option>
              <option value="delete">Delete</option>
            </select>
          </div>
        </div>
        <div className="book-title">{props.title}</div>
        <div className="book-authors">{props.author}</div>
    </div>
);

Book.propTypes = {
  shelf:  PropTypes.string,
  author: PropTypes.string,
  title:  PropTypes.string.isRequired,
  image:  PropTypes.string.isRequired
};

Book.defaultProps = {
  shelf: NO_SHELF,
  author: '',
  title: '',
  image: ''
};

export default Book;
