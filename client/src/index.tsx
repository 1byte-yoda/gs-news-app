import React, { useState } from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"; 
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { Layout, Affix } from "antd";
import {
  AppHeader,
  Login,
  CreateTopic,
  Home,
  Topic,
  Topics,
  NotFound,
  User
} from "./sections";
import { Viewer } from "./lib/types"
import * as serviceWorker from "./serviceWorker";
import "./styles/index.css"


const apolloClient = new ApolloClient({
  uri: `${process.env.REACT_APP_API_SERVICE_URL}:5001/graphql`,
});

const initialViewer: Viewer = {
  user_login: null
}

const App = () => {
  const [viewer, setViewer] = useState<Viewer>(initialViewer)
  return (
    <Router>
      <Layout id="app">
        <Affix>
          <AppHeader viewer={viewer} setViewer={setViewer}/>
        </Affix>
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route exact path="/create" component={CreateTopic}/>
          <Route exact path="/topic/:id" component={Topic}/>
          <Route exact path="/topics" component={Topics}/>
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
          <Route exact path="/user/:id" component={User}/>
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
