import React, { Component } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Collection from "./components/Collection";
import Manga from "./components/Manga";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <Router>
        <React.Fragment>
          <Switch>
            <Route path="/" exact component={Login} />
            <Route path="/register" exact component={Register} />
            <Route path="/home" exact component={Home} />
            <Route path="/collection" exact component={Collection} />
            <Route path="/manga/:id" exact component={Manga} />
          </Switch>
        </React.Fragment>
      </Router>
    );
  }
}

export default App;
