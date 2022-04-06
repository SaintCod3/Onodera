import React, { Component } from "react";
import "../App.css";
import {
  Container,
  Row,
  Col,
  Form,
  Jumbotron,
  Modal,
  Button,
  Toast,
  ProgressBar,
  ListGroup,
} from "react-bootstrap";
import { withRouter, Redirect } from "react-router-dom";
import Navigation from "./Navigation";

class Manga extends Component {
  ref = React.createRef(); // creating the ref for the Observer API element

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      items: [],
      last_page: 4,
      last: false,
      has_next: "",
      search: "",
      currentPage: -1,
      error: false,
      msg: "",
      added: false,
      volumenesOwned: [],
      volumenes: [],
      selected: [],
      total: 0,
      completado: "",
      title: "",
      mangaId: "",
      active: false,
      deleteModal: false,
      addVolumenes: false,
      volumenesToAdd: "",
    };
    this.onClickVolumen = this.onClickVolumen.bind(this);
    this.onChange = this.onChange.bind(this);
    this.addVolumenesModal = this.addVolumenesModal.bind(this);
    this.addMoreVolumenes = this.addMoreVolumenes.bind(this);
    this.createVolumenes = this.createVolumenes.bind(this);
    this.submitVolumes = this.submitVolumes.bind(this);
    this.deleteManga = this.deleteManga.bind(this);
    this.completeClick = this.completeClick.bind(this);
  }

  onCloseError = (e) => {
    this.setState({ error: false });
  };

  onChange = (e) => {
    if (isNaN(e.target.value) || e.target.value == 0) {
      this.setState({
        error: true,
        msg: "Please enter a number greater than 0!",
        addVolumenes: true,
      });
    } else {
      this.setState({ [e.target.name]: e.target.value });
    }
  };

  clearSelection = (e) => {
    this.setState({
      selected: [],
    });
  };

  onCloseAdded = (e) => {
    this.setState({ added: false });
  };

  onHide = (e) => {
    this.setState({
      addVolumenes: false,
    });
  };

  onCloseDelete = (e) => {
    this.setState({
      deleteModal: false,
    });
  };

  createVolumenes = (n) => {
    if (this.state.volumenes.length === 0) {
      for (let i = 0; i < n; i++) {
        this.state.volumenes.push(i + 1);
      }
    }
  };

  activeClass = (value) => {
    this.setState({
      active: true,
    });
  };

  submitVolumes = (e) => {
    const { history } = this.props;
    const user_id = JSON.parse(sessionStorage.getItem("User")).id;
    const { id } = this.props.match.params;
    const toAdd = this.state.volumenesOwned.concat(this.state.selected);

    fetch(
      `https://onodera-backend.herokuapp.com/api/v1/editmanga/${id}?user_id=${user_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("Token"),
          Accept: "application/json",
        },
        body: JSON.stringify({
          numtomos: toAdd,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          added: true,
          msg: "Volume(s) added!",
        });
        setTimeout(() => {
          window.location.reload(false);
        }, 1500);
      });
  };

  addMoreVolumenes = (e) => {
    const { history } = this.props;
    const user_id = JSON.parse(sessionStorage.getItem("User")).id;
    const { id } = this.props.match.params;

    fetch(
      `https://onodera-backend.herokuapp.com/api/v1/editmanga/${id}?user_id=${user_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("Token"),
          Accept: "application/json",
        },
        body: JSON.stringify({
          numtomostotales: this.state.volumenesToAdd,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          added: true,
          msg: "Volume(s) added!",
        });
        setTimeout(() => {
          window.location.reload(false);
        }, 1500);
      });
  };

  deleteManga = (e) => {
    const { history } = this.props;
    const user_id = JSON.parse(sessionStorage.getItem("User")).id;
    const { id } = this.props.match.params;
    fetch(
      `https://onodera-backend.herokuapp.com/api/v1/deletemanga/${id}?user_id=${user_id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("Token"),
          Accept: "application/json",
        },
        body: JSON.stringify({
          id: id,
          user_id: user_id,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        history.push("/collection");
      });
  };

  addVolumenesModal = (e) => {
    this.setState({
      addVolumenes: true,
    });
  };

  deleteModal = (e) => {
    this.setState({
      deleteModal: true,
    });
  };

  completeClick = (e) => {
    const user_id = JSON.parse(sessionStorage.getItem("User")).id;
    const { id } = this.props.match.params;

    fetch(
      `https://onodera-backend.herokuapp.com/api/v1/editmanga/${id}?user_id=${user_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("Token"),
          Accept: "application/json",
        },
        body: JSON.stringify({
          completado: true,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          added: true,
          msg: "Great! You have completed " + this.state.title + "!",
        });
        setTimeout(() => {
          window.location.reload(false);
        }, 1500);
      });
  };

  onClickVolumen = (volumen) => {
    if (
      !this.state.selected.includes(volumen) &&
      !this.state.volumenesOwned.includes(volumen)
    ) {
      this.state.selected.push(volumen);
      this.activeClass(true);
    } else {
      this.setState({
        error: true,
        msg: "This volume is already selected",
      });
    }
  };

  componentDidMount() {
    const { history } = this.props;
    const user_id = JSON.parse(sessionStorage.getItem("User")).id;
    const { id } = this.props.match.params;
    fetch(
      `https://onodera-backend.herokuapp.com/api/v1/view/${id}?user_id=${user_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        const vol = data.manga[0].numtomos;
        const volClear = vol.replace(/\[(.*?)\]/g, "$1");
        const arrVol = volClear.split(",");
        const ownedArray = arrVol.map(Number);
        this.setState({
          items: data.manga,
          mangaId: data.manga[0].id,
          loading: false,
          volumenesOwned: ownedArray,
          total: data.manga[0].numtomostotales,
          title: data.manga[0].title,
          completado: data.manga[0].completado,
        });
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          history.push("/collection");
        }
      });
  }

  render() {
    if (!sessionStorage.getItem("Token") || !sessionStorage.getItem("User")) {
      return <Redirect to="/" />;
    }
    this.createVolumenes(this.state.total);
    return (
      <>
        <style type="text/css">{this.custom()}</style>
        <Navigation />
        <Jumbotron className="header">
          <Container>
            <Row>
              {this.state.loading || !this.state.items ? (
                <div>Loading...</div>
              ) : (
                <>
                  {this.state.items.map((item, i) => (
                    <>
                      <Col key={i} lg={4} className="text-center mb-2">
                        <img src={item.imagen} alt={item.title} />
                      </Col>

                      <Col lg={8} className="text-left">
                        <h4>
                          {item.title} -{" "}
                          <span className="font-weight-light">
                            {item.author}
                          </span>
                        </h4>
                        <hr />
                        <p>
                          <b>Volumes: </b>
                          {item.numtomostotales === null
                            ? "??"
                            : item.numtomostotales}{" "}
                          | <b>Status: </b>
                          {item.publicando === false
                            ? "Finished"
                            : "Publishing"}
                        </p>
                        <p>
                          {item.description.replace(
                            "[Written by MAL Rewrite]",
                            " "
                          )}
                        </p>
                        <p className="mb-2">
                          <b>
                            My progress {this.state.volumenesOwned.length - 1}/
                            {item.numtomostotales === null
                              ? "??"
                              : item.numtomostotales}
                          </b>
                        </p>
                        <ProgressBar
                          variant={
                            this.state.volumenesOwned.length - 1 ===
                            item.numtomostotales
                              ? "success"
                              : ""
                          }
                          now={
                            this.state.volumenesOwned <= 1
                              ? ""
                              : (
                                  (this.state.volumenesOwned.length * 100) /
                                  item.numtomostotales
                                ).toFixed(1)
                          }
                        />
                        <hr />

                        <Row className="text-left">
                          <Col>
                            {item.publicando === true ? (
                              <Button
                                variant="onodera"
                                onClick={() => this.addVolumenesModal()}
                                className="mr-4"
                              >
                                Add volumes
                              </Button>
                            ) : (
                              ""
                            )}
                            <Button
                              variant="outline-danger"
                              className="right"
                              onClick={() => this.deleteModal()}
                            >
                              Delete
                            </Button>
                            {this.state.volumenesOwned.length - 1 ===
                              item.numtomostotales &&
                            this.state.completado === false ? (
                              <Button
                                variant="outline-success"
                                onClick={() => this.completeClick()}
                              >
                                Complete
                              </Button>
                            ) : this.state.volumenesOwned.length - 1 ===
                                item.numtomostotales &&
                              this.state.completado === true ? (
                              <Button variant="outline-success" disabled>
                                Completed
                              </Button>
                            ) : (
                              ""
                            )}
                          </Col>
                        </Row>
                      </Col>
                    </>
                  ))}
                </>
              )}
            </Row>
          </Container>
        </Jumbotron>
        <Container>
          <Row>
            <Col lg={12}>
              <h3 className="font-weight-light mt-2">Volumes</h3>
              <hr />
              <ListGroup className="mb-4">
                {this.state.volumenes.map((volumen, i) => (
                  <>
                    <ListGroup.Item
                      key={i}
                      variant={
                        this.state.volumenesOwned.includes(volumen)
                          ? "success"
                          : ""
                      }
                      action
                      onClick={() => this.onClickVolumen(volumen)}
                      className={
                        this.state.active &&
                        this.state.selected.includes(volumen) &&
                        !this.state.volumenesOwned.includes(volumen)
                          ? "active"
                          : ""
                      }
                    >
                      Volumen {volumen}
                    </ListGroup.Item>
                  </>
                ))}
              </ListGroup>
              {this.state.selected.length > 0 ? (
                <div className="mb-4">
                  <Button
                    variant="onodera"
                    onClick={() => this.submitVolumes()}
                  >
                    Add volumes
                  </Button>
                  <Button
                    variant="outline-danger"
                    className="right"
                    onClick={() => this.clearSelection()}
                  >
                    Clear selection
                  </Button>
                </div>
              ) : (
                ""
              )}
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

        <Modal
          size="md"
          centered
          show={this.state.deleteModal}
          onHide={this.onCloseDelete}
        >
          <Modal.Header closeButton>
            <Modal.Title>Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>You are about to delete {this.state.title}, are you sure? </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="onodera" onClick={() => this.onCloseDelete()}>
              No
            </Button>
            <Button variant="outline-danger" onClick={() => this.deleteManga()}>
              Yes
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          size="sm"
          centered
          show={this.state.addVolumenes}
          onHide={this.onHide}
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Add volumes
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={this.addMoreVolumenes}>
              <Form.Group className="mb-3">
                <Form.Label>No. of volumes: </Form.Label>
                <Form.Control
                  size="sm"
                  style={{
                    width: "80%",
                  }}
                  type="number"
                  name="volumenesToAdd"
                  placeholder={
                    this.state.total == null || 0 ? "" : this.state.total
                  }
                  onChange={this.onChange}
                />
              </Form.Group>
              {isNaN(this.state.volumenesToAdd) ||
              !this.state.volumenesToAdd ? (
                <div>
                  <Button variant="onodera" type="submit" disabled>
                    Add
                  </Button>
                </div>
              ) : (
                <div>
                  <Button variant="onodera" type="submit">
                    Add
                  </Button>
                </div>
              )}
            </Form>
          </Modal.Body>
        </Modal>
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

export default withRouter(Manga);
