import React, { Component } from "react";
import "../App.css";
import Logo from "../img/logoSmall.png";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Image,
  Toast,
} from "react-bootstrap";
import { withRouter, Redirect, Link } from "react-router-dom";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      error: "",
      msg: "",
      alert: "",
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }
  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  onSubmit = (e) => {
    e.preventDefault();
    e.target.reset();
    const { history } = this.props;
    const {
      alert,
      error,
      msg,
      username,
      email,
      password,
      passwordConfirmation,
    } = this.state;

    if (password !== passwordConfirmation && password.length < 8) {
      this.setState({
        alert: true,
        error: 1,
      });
    } else {
      fetch("https://onodera-backend.herokuapp.com/api/v1/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          this.setState({
            alert: true,
            msg: "Account created!",
          });
          history.push("/");
        });
    }
  };

  render() {
    if (sessionStorage.getItem("Token") || sessionStorage.getItem("User")) {
      return <Redirect to="/" />;
    }
    const {
      alert,
      error,
      msg,
      username,
      email,
      password,
      passwordConfirmation,
    } = this.state;
    return (
      <>
        <style type="text/css">{this.custom()}</style>
        <Container fluid>
          <Toast
            onClose={this.onClose}
            show={alert}
            delay={3000}
            autohide
            className="alertStyled"
          >
            <Toast.Header>
              <strong className="mr-auto">
                {error === 0 ? "Success!" : "Error"}
              </strong>
            </Toast.Header>
            <Toast.Body>
              {error === 0
                ? msg
                : "Missing Parameter(s), please make sure that you have added all the information and uploaded an avatar and your GovID"}
            </Toast.Body>
          </Toast>
          <Row>
            <Col
              xs={12}
              sm={12}
              md={6}
              lg={6}
              className="leftSide d-none text-center d-md-block d-lg-block"
            ></Col>
            <Col xs={12} sm={12} md={6} lg={6} className="rightSide centered">
              <Image src={Logo} className="mb-4" />
              <Form onSubmit={this.onSubmit} className="mt-4">
                <Form.Group>
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    onChange={this.onChange}
                    style={{
                      border: "none",
                      borderBottom: "1px solid white",
                      background: "transparent",
                      outline: "none",
                      color: "white",
                      height: "35px",
                    }}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    onChange={this.onChange}
                    style={{
                      border: "none",
                      borderBottom: "1px solid white",
                      background: "transparent",
                      outline: "none",
                      color: "white",
                      height: "35px",
                    }}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    onChange={this.onChange}
                    style={{
                      border: "none",
                      borderBottom: "1px solid white",
                      background: "transparent",
                      outline: "none",
                      color: "white",
                      height: "35px",
                    }}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Password Confirmation</Form.Label>
                  <Form.Control
                    type="password"
                    name="passwordConfirmation"
                    onChange={this.onChange}
                    style={{
                      border: "none",
                      borderBottom: "1px solid white",
                      background: "transparent",
                      outline: "none",
                      color: "white",
                      height: "35px",
                    }}
                  />
                </Form.Group>
                <Button variant="onodera" type="submit" className="mt-4">
                  Sign Up
                </Button>
                <Link to="/" className="bRight mt-4">
                  Back
                </Link>
              </Form>
            </Col>
          </Row>
        </Container>
      </>
    );
  }

  custom() {
    return `
        .btn-onodera {
          background-color: transparent;
          padding: .375rem .75rem;
          border: 1px solid white;
          vertical-align: middle;
          line-height: 1.5;
          font-size: 1rem;
          transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
          text-decoration: none;
          color: white;
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
          background-color: white;
          color: black;
        }
        `;
  }
}
export default withRouter(Register);
