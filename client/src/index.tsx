import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import { Redirect } from "react-router-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"; 
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { Layout, Spin, Affix } from "antd";
import {
  AppHeader,
  Login,
  CreateTopic,
  Home,
  Topic,
  Topics,
  NotFound,
} from "./sections";
import { AppHeaderSkeleton } from "./lib/components/AppHeaderSkeleton";
import { Viewer } from "./lib/types"
import * as serviceWorker from "./serviceWorker";
import "./styles/index.css"


const apolloClient = new ApolloClient({
  uri: `${process.env.REACT_APP_API_SERVICE_URL}:5001/graphql`,
});

const initialViewer: Viewer = {
  token: localStorage.getItem("token") || "",
  id: localStorage.getItem("id"),
  avatar: localStorage.getItem("avatar")
}


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
          <Spin size="large" tip="Launching GS News"/>
        </div>
      </Layout>
    );
  };
  return (
    <Router>
      <Layout id="app">
        <Affix>
          <AppHeader viewer={viewer} setViewer={setViewer}/>
        </Affix>
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/topics"/>}/>
          <Route exact path="/create" component={CreateTopic}/>
          <Route exact path="/topic/:id" render={() => <Topic viewer={viewer} />}/>
          <Route exact path="/topics" render={() => <Topics viewer={viewer} page={2} />}/>
          <Route
            exact
            path="/login"
            render={
              props => (
                <Login {...props} 
                  setViewer={setViewer}
                />
              )
            }
          />
          <Route component={NotFound}/>
        </Switch>
      </Layout>
    </Router>
  )
}

render(
  <ApolloProvider client={apolloClient}>
    <App/>
  </ApolloProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
serviceWorker.unregister();
