import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import React from "react";
import ReactDOM from "react-dom";
import { toast } from "react-toastify";

import App from "./App";
import { register } from "./serviceWorker";

if (process.env.NODE_ENV !== "development")
  window.onbeforeunload = function () {
    return "Data will be lost if you leave the page, are you sure?";
  };

if (process.env.REACT_APP_ENABLE_API === "true") {
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: process.env.REACT_APP_API_URL + "/graphql",
    credentials: "include",
  });
  console.log("API ENABLED :)");
  ReactDOM.render(
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>,
    document.getElementById("root")
  );
} else {
  ReactDOM.render(<App />, document.getElementById("root"));
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
register({
  onUpdate: (registration) => {
    toast("There is an Update! Click here to update.", {
      autoClose: false,
      position: "bottom-right",
      onClick: () => {
        if (registration && registration.waiting) {
          registration.waiting.postMessage({ type: "SKIP_WAITING" });
        }
        window.location.reload();
      },
    });
  },
});
