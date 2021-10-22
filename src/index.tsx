import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { RefreshIcon } from "@heroicons/react/outline";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { FDButton } from "./lib/components/Button";
import { createToast } from "./lib/createToast";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { defaultAppState } from "./states/appState";
import { defaultConfigState } from "./states/configState";
import "./tailwind.css";

const main = async () => {
  if (process.env.NODE_ENV !== "development")
    window.onbeforeunload = function () {
      return "Data will be lost if you leave the page, are you sure?";
    };

  const awaitedDefaultConfigState = await defaultConfigState();
  const awaitedDefaultAppState = await defaultAppState();
  if (process.env.REACT_APP_ENABLE_API === "true") {
    const client = new ApolloClient({
      cache: new InMemoryCache(),
      uri: process.env.REACT_APP_API_URL + "/graphql",
      credentials: "include",
    });
    console.log("API ENABLED :)");
    // todo remove duplicate code
    ReactDOM.render(
      <ApolloProvider client={client}>
        <App
          defaultConfigState={awaitedDefaultConfigState}
          defaultAppState={awaitedDefaultAppState}
        />
      </ApolloProvider>,
      document.getElementById("root")
    );
  } else {
    ReactDOM.render(
      <App
        defaultConfigState={awaitedDefaultConfigState}
        defaultAppState={awaitedDefaultAppState}
      />,
      document.getElementById("root")
    );
  }
};
main();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    createToast({
      primary: (t) => (
        <FDButton
          prefix={<RefreshIcon className="h-4 w-4" />}
          type="primary"
          size={2}
          onClick={async () => {
            setTimeout(() => {
              registration.waiting?.postMessage({ type: "SKIP_WAITING" });
              window.location.reload();
            });
          }}
        >
          Refresh
        </FDButton>
      ),
      text: "Refresh to load the newest version!",
      title: "Update available!",
    });
  },
});
reportWebVitals();
