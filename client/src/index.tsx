import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import { Redirect } from "react-router-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { Layout, Spin, Affix } from "antd";
import {
  AppHeader,
  Login,
  CreateTopic,
  UpdateTopic,
  Topic,
  Topics,
  NotFound,
  User,
  Register
} from "./sections";
import { AppHeaderSkeleton } from "./lib/components/AppHeaderSkeleton";
import { Viewer } from "./lib/types";
import * as serviceWorker from "./serviceWorker";
import "./styles/index.css";

const apolloClient = new ApolloClient({
  uri: `${process.env.REACT_APP_API_SERVICE_URL}:5001/graphql`
});

const initialViewer: Viewer = {
  token: localStorage.getItem("token"),
  id: localStorage.getItem("id"),
  avatar: localStorage.getItem("avatar")
};

const App = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [viewer, setViewer] = useState<Viewer>(initialViewer);
  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <Layout className="app-skeleton">
        <AppHeaderSkeleton />
        <div className="app-skeleton__spin-section">
          <Spin size="large" tip="Launching GS News" />
        </div>
      </Layout>
    );
  }
  return (
    <Router>
      <Layout id="app">
        <Affix>
          <AppHeader viewer={viewer} setViewer={setViewer} />
        </Affix>
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/topics" />} />
          <Route
            exact
            path="/create"
            render={() => <CreateTopic setViewer={setViewer} viewer={viewer} />}
          />
          <Route
            exact
            path="/topic/:id/edit"
            render={() => (
              <UpdateTopic
                setViewer={setViewer}
                viewer={viewer}
              />
            )}
          />
          <Route
            exact
            path="/topic/:id"
            render={() => (
              <Topic
                setViewer={setViewer}
                viewer={viewer}
              />
            )}
          />
          <Route
            exact
            path="/topics"
            render={() => <Topics setViewer={setViewer} viewer={viewer} />}
          />
          <Route
            exact
            path="/login"
            render={(props) => (
              <Login {...props} viewer={viewer} setViewer={setViewer} />
            )}
          />
          <Route
            exact
            path="/register"
            render={() => <Register viewer={viewer} />}
          />
          <Route
            exact
            path="/user/:id"
            render={() => <User setViewer={setViewer} viewer={viewer} />}
          />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </Router>
  );
};

render(
  <ApolloProvider client={apolloClient}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
serviceWorker.unregister();
