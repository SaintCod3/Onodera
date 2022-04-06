import React, { Component } from "react";
import { Navbar, Nav, Image } from "react-bootstrap";
import { withRouter, useHistory } from "react-router-dom";
import { LinkContainer, IndexLinkContainer } from "react-router-bootstrap";
import LogoSmall from "../img/logoSmall.png";
import "../App.css";
class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  logout = (e) => {
    sessionStorage.removeItem("Token");
    sessionStorage.removeItem("User");
    this.props.history.push("/");
  };

  render() {
    const currentUser = JSON.parse(sessionStorage.getItem("User"));
    return (
      <>
        <Navbar collapseOnSelect expand="lg" className="customBar" sticky="top">
          <Navbar.Brand href="/home">
            <Image src={LogoSmall} className="logo" />
          </Navbar.Brand>

          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Nav className="mr-auto">
              <Nav.Link href="/collection">My Collection</Nav.Link>
              <Nav.Link href="#help">Help</Nav.Link>
            </Nav>
            <Navbar.Text className="user mr-2">
              {currentUser.username}
            </Navbar.Text>
            <Navbar.Text className="logOut " onClick={this.logout}>
              [ Log out ]
            </Navbar.Text>
          </Navbar.Collapse>
        </Navbar>
      </>
    );
  }
}
export default withRouter(Navigation);
