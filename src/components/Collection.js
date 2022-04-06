import React, { Component } from "react";
import "../App.css";
import {
  Container,
  Row,
  Col,
  Jumbotron,
  Button,
  Toast,
  Spinner,
  Tabs,
  Tab,
  InputGroup,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import { withRouter, Redirect } from "react-router-dom";
import Navigation from "./Navigation";

class Collection extends Component {
  ref = React.createRef(); // creating the ref for the Observer API element
  refComplete = React.createRef(); // creating the ref for the Observer API element for the section "complete"

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      items: [],
      results: [],
      mangasCompleted: [],
      last_page: 4,
      last: false,
      has_next: "",
      search: "",
      currentPage: -1,
      last_page_complete: 4,
      last_complete: false,
      has_next_complete: "",
      currentPage_complete: -1,
      selectedManga: "",
      selectedMangaSynopsis: "",
      selectedAuthor: "",
      currentTab: "All",
      noResults: "",
      dropdown: "Title",
      error: false,
      added: false,
    };
    this.onChange = this.onChange.bind(this);
    this.onMangaClick = this.onMangaClick.bind(this);
    this.onClickDropdown = this.onClickDropdown.bind(this);
  }

  onClickDropdown = (e) => {
    this.setState({
      dropdown: e.target.innerHTML,
    });
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  // Search by title in the collection of the user
  onSubmit = (e) => {
    const currentUser = JSON.parse(sessionStorage.getItem("User")).id;
    if (!this.state.search) {
      this.setState({
        error: true,
        msg: "Please type the title.",
      });
    } else {
      fetch(
        `https://onodera-backend.herokuapp.com/api/v1/searchtitle?title=${this.state.search}&user_id=${currentUser}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
            Accept: "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          this.setState({
            results: data.manga,
            currentTab: "searchResults",
          });
        });
    }
  };

  // Search by Author
  searchAuthor = (e) => {
    const currentUser = JSON.parse(sessionStorage.getItem("User")).id;
    if (!this.state.search) {
      this.setState({
        error: true,
        msg: "Please type the author name.",
      });
    } else {
      fetch(
        `https://onodera-backend.herokuapp.com/api/v1/searchauthor?author=${this.state.search}&user_id=${currentUser}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
            Accept: "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          this.setState({
            results: data.manga,
            currentTab: "searchResults",
          });
        });
    }
  };

  onCloseError = (e) => {
    this.setState({ error: false });
  };

  onCloseAdded = (e) => {
    this.setState({ added: false });
  };

  setCurrentTab = (eventKey) => {
    this.setState({
      currentTab: eventKey,
    });
  };

  // this will set the manga to the state in order to be passed to the function "addMangaToCollection"
  onMangaClick(manga) {
    const currentUser = JSON.parse(sessionStorage.getItem("User")).id;
    const { history } = this.props;
    history.push(`/manga/${manga}?user_id=${currentUser}`);
  }

  // Retrieve mangas when the observer API kicks
  getMangas = (pageNumber) => {
    const currentUser = JSON.parse(sessionStorage.getItem("User")).id;
    fetch(
      `https://onodera-backend.herokuapp.com/api/v1/mangas?user_id=${currentUser}&page=${pageNumber}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("Token"),
          Accept: "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          items: [...this.state.items, ...data.manga],
          currentPage: pageNumber,
          last_page: data.last_visible_page,
          loading: false,
          has_next: data.has_next,
        });
      });
  };

  // get list of completed mangas
  getMangasComplete = (pageNumber) => {
    const currentUser = JSON.parse(sessionStorage.getItem("User")).id;
    fetch(
      `https://onodera-backend.herokuapp.com/api/v1/filtercompleted?user_id=${currentUser}&page=${pageNumber}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("Token"),
          Accept: "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          mangasCompleted: [...this.state.mangasCompleted, ...data.manga],
          currentPage_complete: pageNumber,
          last_page_complete: data.last_visible_page,
          loading: false,
          has_next_complete: data.has_next,
        });
      });
  };

  componentDidMount() {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio == 1) {
          if (this.state.currentPage != this.state.last_page) {
            this.getMangas((this.state.currentPage += 1));
          } else {
            observer.unobserve(this.ref.current);
            this.setState({ last: true });
          }
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 1.0,
      }
    );
    if (this.ref.current) {
      observer.observe(this.ref.current);
    }

    const observerComplete = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio == 1) {
          if (
            this.state.currentPage_complete != this.state.last_page_complete
          ) {
            this.getMangasComplete((this.state.currentPage_complete += 1));
          } else {
            observerComplete.unobserve(this.refComplete.current);
            this.setState({ last_complete: true });
          }
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 1.0,
      }
    );
    if (this.refComplete.current) {
      observerComplete.observe(this.refComplete.current);
    }
  }

  render() {
    if (!sessionStorage.getItem("Token") || !sessionStorage.getItem("User")) {
      return <Redirect to="/" />;
    }
    return (
      <>
        <style type="text/css">{this.custom()}</style>
        <Navigation />
        <Jumbotron className="searchContainer">
          <Container>
            <Row>
              <Col>
                <InputGroup className="justify-content-center">
                  <DropdownButton
                    variant="onodera"
                    title={this.state.dropdown}
                    name="dropdown"
                    id="searchType"
                  >
                    <Dropdown.Item onClick={this.onClickDropdown}>
                      Title
                    </Dropdown.Item>
                    <Dropdown.Item onClick={this.onClickDropdown}>
                      Author
                    </Dropdown.Item>
                  </DropdownButton>
                  <input type="text" name="search" onChange={this.onChange} />
                  <Button
                    variant="onodera"
                    onClick={
                      this.state.dropdown == "Author"
                        ? this.searchAuthor
                        : this.onSubmit
                    }
                  >
                    Search
                  </Button>
                </InputGroup>
              </Col>
            </Row>
          </Container>
        </Jumbotron>
        <Container>
          <Row>
            <Col lg={12}>
              <h3 className="font-weight-light mt-2">My Collection</h3>
              <hr />
              <Tabs
                defaultActiveKey="All"
                activeKey={this.state.currentTab}
                onSelect={(key) => this.setCurrentTab(key)}
                className="mb-3"
              >
                <Tab
                  eventKey="All"
                  title={"All " + "(" + this.state.items.length + ")"}
                >
                  <div>
                    {this.state.loading || !this.state.items ? (
                      <div>Loading...</div>
                    ) : (
                      <div className="mangas mb-2">
                        {this.state.items.map((item, i) => (
                          <div
                            className="manga"
                            key={i}
                            onClick={() => this.onMangaClick(item.id)}
                          >
                            {item.completado == true ? (
                              <div className="completed">Completed!</div>
                            ) : (
                              ""
                            )}
                            <img src={item.imagen} alt={item.title} />
                            <div className="over">{item.title}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    {this.state.has_next === false ? (
                      ""
                    ) : (
                      <div ref={this.ref}>
                        <Spinner
                          animation="border"
                          className="mx-auto d-block"
                        />
                      </div>
                    )}
                  </div>
                </Tab>
                <Tab eventKey="completed" title="Completed">
                  <div>
                    {this.state.loading || !this.state.mangasCompleted ? (
                      <div>Loading...</div>
                    ) : (
                      <div className="mangas mb-2">
                        {this.state.mangasCompleted.map((manga, i) => (
                          <div
                            className="manga"
                            key={i}
                            onClick={() => this.onMangaClick(manga.id)}
                          >
                            {manga.completado == true ? (
                              <div className="completed">Completed!</div>
                            ) : (
                              ""
                            )}
                            <img src={manga.imagen} alt={manga.title} />
                            <div className="over">{manga.title}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    {this.state.has_next_complete === false ? (
                      ""
                    ) : (
                      <div ref={this.refComplete}>
                        <Spinner
                          animation="border"
                          className="mx-auto d-block"
                        />
                      </div>
                    )}
                  </div>
                </Tab>
                {this.state.results.length === 0 ? (
                  ""
                ) : (
                  <Tab eventKey="searchResults" title="Search Results">
                    <div>
                      <div className="mangas mb-2">
                        {this.state.results.map((item, i) => (
                          <div
                            className="manga"
                            key={i}
                            onClick={() => this.onMangaClick(item.id)}
                          >
                            {item.completado == true ? (
                              <div className="completed">Completed!</div>
                            ) : (
                              ""
                            )}
                            <img src={item.imagen} alt={item.title} />
                            <div className="over">{item.title}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Tab>
                )}
              </Tabs>
            </Col>
          </Row>
        </Container>

        <Toast
          onClose={this.onCloseAdded}
          show={this.state.added}
          delay={2000}
          autohide
          className="alertStyledGreen"
        >
          <Toast.Header>
            <strong className="mr-auto">Success</strong>
          </Toast.Header>
          <Toast.Body>{this.state.msg}</Toast.Body>
        </Toast>

        <Toast
          onClose={this.onCloseError}
          show={this.state.error}
          delay={2000}
          autohide
          className="alertStyled"
        >
          <Toast.Header>
            <strong className="mr-auto">Error</strong>
          </Toast.Header>
          <Toast.Body>{this.state.msg}</Toast.Body>
        </Toast>
      </>
    );
  }
  custom() {
    return `
        .btn-onodera {
          background-color: transparent;
          padding: .375rem .75rem;
          border: 1px solid rgba(52, 85, 138, 1);
          vertical-align: middle;
          line-height: 1.5;
          font-size: 1rem;
          transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
          text-decoration: none;
          color: rgba(52, 85, 138, 1);
          border-radius: .25rem;
        }
        .btn-onodera:hover {
          padding: .375rem .75rem;
          border: 1px solid transparent;
          vertical-align: middle;
          line-height: 1.5;
          font-size: 1rem;
          transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
          text-decoration: none;
          border-radius: .25rem;
          background-color: rgba(52, 85, 138, 1);
          color: white;
        }
        `;
  }
}

export default withRouter(Collection);
