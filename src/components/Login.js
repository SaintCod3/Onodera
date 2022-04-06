import React, { Component } from "react";
import "../App.css";
import Logo from "../img/logoSmall.png";
import { Container, Row, Col, Button, Form, Image } from "react-bootstrap";
import { withRouter, Redirect, Link } from "react-router-dom";
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
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
    const { email, password } = this.state;
    fetch("https://onodera-backend.herokuapp.com/api/v1/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((response) => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then(function (data) {
        if (data) {
          sessionStorage.setItem("User", JSON.stringify(data.user));
          sessionStorage.setItem("Token", data.token);
          history.push("/home");
        }
      })
      .catch((error) => {
        alert(error);
      });
  };

  render() {
    if (sessionStorage.getItem("Token") || sessionStorage.getItem("User")) {
      return <Redirect to="/home" />;
    }
    return (
      <>
        <style type="text/css">{this.custom()}</style>
        <Container fluid>
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
                <Button variant="onodera" type="submit" className="mt-4">
                  Sign in
                </Button>
                <Link to="/register" className="bRight mt-4">
                  Sign up
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
export default withRouter(Login);
