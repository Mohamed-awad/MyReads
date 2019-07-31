import React from 'react'
import { Link } from 'react-router-dom';
import './App.css'
import {getAll, update, search} from './BooksAPI';


class BooksApp extends React.Component {
  state = {
    allBooks: [],
    currentlyReading: [],
    wantToRead: [],
    read: [],
    fetchedBooks: [],
    bookTitleOrAuthor: '',
    showSearchPage: false
  }

  componentDidMount() {
    getAll().then((books) => {
      this.setState({
        allBooks: books,
        currentlyReading: books.filter((book) => {
          return book.shelf === "currentlyReading";
        }),
        wantToRead: books.filter((book) => {
          return book.shelf === "wantToRead";
        }),
        read: books.filter((book) => {
          return book.shelf === "read";
        }),
      });
    })
  }

  updateShelf = async (book, shelf) => {
    update(book, shelf).then((data) => {
      console.log(data);
    }).then(()=>{
      getAll().then((books) => {
        this.setState({
          allBooks: books,
          currentlyReading: books.filter((book) => {
            return book.shelf === "currentlyReading";
          }),
          wantToRead: books.filter((book) => {
            return book.shelf === "wantToRead";
          }),
          read: books.filter((book) => {
            return book.shelf === "read";
          }),
        });
      })
    });
    book.shelf = shelf;
    await this.setState({
      allBooks: this.state.allBooks.map((currentbook) => {
        if (currentbook.id === book.id) {
          return book;
        } else {
          return currentbook;
        }
      }),
    });
    this.setState({
      currentlyReading: this.state.allBooks.filter((book) => {
        return book.shelf === "currentlyReading";
      }),
      wantToRead: this.state.allBooks.filter((book) => {
        return book.shelf === "wantToRead";
      }),
      read: this.state.allBooks.filter((book) => {
        return book.shelf === "read";
      }),
    })
  };

  searchBook = async (bookTitleOrAuthor) => {
    if(bookTitleOrAuthor) {
      this.setState({
        bookTitleOrAuthor,
      });
      await search(bookTitleOrAuthor).then((books) => {
        console.log(books);
        if (books.error) {
          this.setState({
            fetchedBooks: [],
          });
        } else {
          this.setState({
            fetchedBooks: books,
          });
        }
      })
    } else {
      this.setState({
        bookTitleOrAuthor,
        fetchedBooks: [],
      });
    }
  };

  renderBook = (book) => {
    this.state.allBooks.map((currentBook)=> {
      if(currentBook.id === book.id) {
        book.shelf = currentBook.shelf;
      }
    });
    return (
        <div className="book">
          <div className="book-top">
            <div className="book-cover"
                 style={ book.imageLinks ? {
                   width: 128, height: 193,
                   backgroundImage: `url(${book.imageLinks.smallThumbnail})`
                 }:{}}></div>
            <div className="book-shelf-changer">
              <select value={book.shelf}
                      onChange={(event) => this.updateShelf(book, event.target.value)}>
                <option value="move" disabled>Move to...</option>
                <option value="none">None</option>
                <option value="currentlyReading">Currently Reading</option>
                <option value="wantToRead">Want to Read</option>
                <option value="read">Read</option>
              </select>
            </div>
          </div>
          <div className="book-title">{book.title}</div>
          <div className="book-authors">
            {book.authors ?
              book.authors.map((author, index) =>
                <p key={index} style={{marginTop:0, marginBottom:0}}>{author}</p>
            ):<p></p>}
          </div>
        </div>
    );
  }

  render() {
    return (
        <div className="app">
          {this.state.showSearchPage ? (
              <div className="search-books">
                <div className="search-books-bar">
                  <Link to="/" >
                    <button className="close-search"
                            onClick={() => this.setState({showSearchPage: false})}>
                      Close
                    </button>
                  </Link>
                  <div className="search-books-input-wrapper">
                    <input type="text" placeholder="Search by title or author"
                           value={this.state.bookTitleOrAuthor}
                           onChange={(event) => this.searchBook(event.target.value)}/>
                  </div>
                </div>
                <div className="search-books-results">
                  <ol className="books-grid">
                    {this.state.fetchedBooks.map((book) =>
                        <li key={book.id}>
                          {this.renderBook(book)}
                        </li>
                    )}
                  </ol>
                </div>
              </div>
          ) : (
              <div className="list-books">
                <div className="list-books-title">
                  <h1>MyReads</h1>
                </div>
                <div className="list-books-content">
                  <div>
                    <div className="bookshelf">
                      <h2 className="bookshelf-title">Currently Reading</h2>
                      <div className="bookshelf-books">
                        <ol className="books-grid">
                          {this.state.currentlyReading.map((book) =>
                              <li key={book.id}>
                                {this.renderBook(book)}
                              </li>
                          )}
                        </ol>
                      </div>
                    </div>
                    <div className="bookshelf">
                      <h2 className="bookshelf-title">Want to Read</h2>
                      <div className="bookshelf-books">
                        <ol className="books-grid">
                          {this.state.wantToRead.map((book) =>
                              <li key={book.id}>
                                {this.renderBook(book)}
                              </li>
                          )}
                        </ol>
                      </div>
                    </div>
                    <div className="bookshelf">
                      <h2 className="bookshelf-title">Read</h2>
                      <div className="bookshelf-books">
                        <ol className="books-grid">
                          {this.state.read.map((book) =>
                              <li key={book.id}>
                                {this.renderBook(book)}
                              </li>
                          )}
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="open-search">
                  <Link to="/search" >
                    <button onClick={() => this.setState({showSearchPage: true})}>
                      Add a book
                    </button>
                  </Link>
                </div>
              </div>
          )}
        </div>
    )
  }
}

export default BooksApp
