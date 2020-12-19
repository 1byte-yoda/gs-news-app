import React from 'react';
import { render } from 'react-dom';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { Topics } from "./sections";
import * as serviceWorker from "./serviceWorker";

const apolloClient = new ApolloClient({
  uri: `${process.env.REACT_APP_API_SERVICE_URL}:5001/graphql`,
});

render(
  <ApolloProvider client={apolloClient}>
    <Topics title="GS News Topics"/>
  </ApolloProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
serviceWorker.unregister();
