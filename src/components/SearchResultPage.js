import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import Book from './Book';

class SearchResultPage extends Component {

    constructor(props) {
        super(props);
        this.handleInputUpdate = this.handleInputUpdate.bind(this);
    }

    handleInputUpdate(e) {
        this.props.updateQuery(e.target.value);
        console.log(this.props);
    }
    
    render() {
        return (
            <Route path="/search" render={()=>(
                <div className="search-books">
                  <div className="search-books-bar">
                    <Link className="close-search" to="/">Close</Link>
                    <div className="search-books-input-wrapper">
                      <input type="text" placeholder="Search by title or author" onChange={this.handleInputUpdate}/>
                    </div>
                  </div>
                  <Route exact path="/search" render={() =>(
                      <div className="search-books-results">
                       <lable>Total Books: {this.props.booksFromSearch.length}</lable>
                        <ol className="books-grid">
                            {
                                this.props.booksFromSearch && this.props.booksFromSearch.map(book =>
                                    <li key={book.id}>
                                      <Book
                                          bookId={book.id}
                                          author={book.author} title={book.title}
                                          image={book.image} shelf={book.shelf}
                                          moveBook={this.props.moveBook}
                                          deleteBook={this.props.deleteBook}
                                          />
                                    </li>
                                )
                            }
                        </ol>
                      </div>
                  )}/>
                </div>
            )}/>
        );
    }
}

export default SearchResultPage;
