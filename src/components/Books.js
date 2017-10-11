
import React from 'react'

class Books extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: this.props.status};
        this.handleSelect = this.handleSelect.bind(this);
    }

    handleSelect(e) {
        e.preventDefault();
        this.setState({state: e.target.value});
        const currentBook = {
            publicationId: this.props.bookId,
            author: this.props.author,
            title: this.props.title,
            image: this.props.image
        };
        console.log(currentBook);
        this.props.moveBook(currentBook, e.target.value);
    }

    render() {
        return (
          <div className="book">
            <div className="book-top">                                                 {/* this is showing how to render image url */}
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

export default Books;
