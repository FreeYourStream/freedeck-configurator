import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import { register } from "./serviceWorker";

if (process.env.NODE_ENV !== "development")
  window.onbeforeunload = function () {
    return "Data will be lost if you leave the page, are you sure?";
  };

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
register();
