import React, { Component } from "react";
import "../App.css";
import {
  Container,
  Row,
  Col,
  Jumbotron,
  Modal,
  Button,
  Toast,
  Spinner,
  InputGroup,
  FormControl,
  DropdownButton,
  Dropdown,
  Form,
} from "react-bootstrap";
import { withRouter, Redirect } from "react-router-dom";
import Navigation from "./Navigation";

class Home extends Component {
  ref = React.createRef(); // creating the ref for the Observer API element

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      items: [],
      last_page: "",
      last: false,
      has_next: "",
      search: "",
      currentPage: 1,
      selectedManga: "",
      selectedMangaSynopsis: "",
      selectedAuthor: "",
      searchID: false,
      showModalManga: false,
      error: false,
      added: false,
      msg: "",
      dropdown: "Title",
    };
    this.onChange = this.onChange.bind(this);
    this.onClickDropdown = this.onClickDropdown.bind(this);
    this.onMangaClick = this.onMangaClick.bind(this);
    this.addMangaToCollection = this.addMangaToCollection.bind(this);
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onClickDropdown = (e) => {
    this.setState({
      dropdown: e.target.innerHTML,
    });
  };

  searchIDCheck = (e) => {
    this.setState({
      [e.target.name]: e.target.checked,
    });
  };

  // Search in the API
  onSubmit = (e) => {
    if (!this.state.search) {
      this.setState({
        error: true,
        msg: "Type the title of the manga that you would like to search",
      });
    } else {
      fetch(
        "https://api.jikan.moe/v4/manga?q=" +
          this.state.search +
          "&type=manga&page=1&genres_exclude=12,26,28"
      )
        .then((response) => response.json())
        .then((data) =>
          this.setState({
            items: data.data,
            pagination: data.pagination,
            loading: false,
            has_next: false,
          })
        );
    }
  };

  // Search by ID (when the manga has not been scrapped, it will allow the user to add it easily)
  searchById = (e) => {
    if (!this.state.search) {
      this.setState({
        error: true,
        msg: "Please add an ID from MAL, we provide further information under our Help page to identify the ID",
      });
    } else {
      fetch("https://api.jikan.moe/v4/manga/" + this.state.search)
        .then((response) => response.json())
        .then((data) =>
          this.setState({
            items: [data.data],
          })
        );
    }
  };

  onHide = (e) => {
    this.setState({
      showModalManga: false,
    });
  };

  onCloseError = (e) => {
    this.setState({ error: false });
  };

  onCloseAdded = (e) => {
    this.setState({ added: false });
  };

  // this will set the manga to the state in order to be passed to the function "addMangaToCollection"
  onMangaClick = (manga) => {
    const obj = manga.authors[0];
    const name = obj.name.replace(",", " ");

    this.setState({
      selectedManga: manga,
      showModalManga: true,
      selectedMangaSynopsis: manga.synopsis,
      selectedAuthor: name,
    });
  };

  // function to add the selected manga to the collection of the user and if the manga is already in their collection, will prompt an error
  addMangaToCollection() {
    const currentUser = JSON.parse(sessionStorage.getItem("User")).id;
    const { selectedManga, selectedMangaSynopsis, selectedAuthor, error, msg } =
      this.state;
    if (selectedManga === "") {
      alert("Please select a manga");
    } else {
      fetch("https://onodera-backend.herokuapp.com/api/v1/newmanga", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("Token"),
          Accept: "application/json",
        },
        body: JSON.stringify({
          title: selectedManga.title,
          description: selectedMangaSynopsis,
          numtomos: Array.from([]),
          completado: false,
          publicando: selectedManga.publishing,
          imagen: selectedManga.images.webp.image_url,
          numtomostotales: selectedManga.volumes,
          user_id: currentUser,
          malid: selectedManga.mal_id,
          author: selectedAuthor,
        }),
      })
        .then((response) => {
          if (!response.ok) throw new Error(response.status);
          else response.json();
        })
        .then((data) => {
          this.setState({
            showModalManga: false,
            added: true,
            msg: "The manga was added to your collection!",
          });
        })
        .catch((error) => {
          if (error.name !== "AbortError") {
            this.setState({
              error: true,
              msg: "This manga is already in your collection",
              showModalManga: false,
            });
          }
        });
    }
  }

  // Retrieve mangas when the observer API kicks
  getMangas = (pageNumber) => {
    fetch(`https://api.jikan.moe/v4/manga?type=manga&page=${pageNumber}`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          items: [...this.state.items, ...data.data],
          currentPage: pageNumber,
          last_page: data.pagination.last_visible_page,
          loading: false,
        });
      });
  };

  componentDidMount() {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio == 1) {
          if (this.state.currentPage != this.state.last_visible_page) {
            this.getMangas(this.state.currentPage + 1);
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
                      ID
                    </Dropdown.Item>
                  </DropdownButton>
                  <input type="text" name="search" onChange={this.onChange} />
                  <Button
                    variant="onodera"
                    onClick={
                      this.state.dropdown == "ID"
                        ? this.searchById
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
              <h3 className="font-weight-light mt-2">List of Mangas</h3>
              <hr />
              <div>
                {this.state.loading || !this.state.items ? (
                  <div>Loading...</div>
                ) : (
                  <div className="mangas mb-2">
                    {this.state.items.map((item, i) => (
                      <div
                        className="manga"
                        key={i}
                        onClick={() => this.onMangaClick(item)}
                      >
                        <img
                          src={item.images.webp.image_url}
                          alt={item.title}
                        />
                        <div className="over">{item.title}</div>
                      </div>
                    ))}
                  </div>
                )}
                {this.state.has_next === false ? (
                  ""
                ) : (
                  <div ref={this.ref}>
                    <Spinner animation="border" className="mx-auto d-block" />
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </Container>

        <Modal
          size="lg"
          centered
          show={this.state.showModalManga}
          onHide={this.onHide}
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              {this.state.selectedManga.title}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <span>
              <b>Author:</b> {this.state.selectedAuthor}
            </span>{" "}
            |{" "}
            <span>
              <b>Volumes:</b>{" "}
              {this.state.selectedManga.volumes === null
                ? "Unknown"
                : this.state.selectedManga.volumes}
            </span>{" "}
            |{" "}
            <span>
              <b>Status:</b> {this.state.selectedManga.status}
            </span>
            <hr />
            <h5>Description</h5>
            <p>{this.state.selectedMangaSynopsis}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.addMangaToCollection} variant="onodera">
              Add
            </Button>
          </Modal.Footer>
        </Modal>

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
          width: 70px;
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

export default withRouter(Home);
