import "./tailwind.css";

import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import ReactDOM from "react-dom";

import App from "./App";
import { FDButton } from "./lib/components/Button";
import { createToast } from "./lib/misc/createToast";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { defaultAppState } from "./states/appState";
import { defaultConfig } from "./states/configState";

export let client: ApolloClient<NormalizedCacheObject> | undefined;
const main = async () => {
  // if (process.env.NODE_ENV !== "development" && !isElectron())
  //   window.onbeforeunload = function () {
  //     return "Data will be lost if you leave the page, are you sure?";
  //   };
  const awaitedDefaultConfigState = await defaultConfig();
  const awaitedDefaultAppState = await defaultAppState();
  client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: process.env.REACT_APP_API_URL + "/graphql",
    credentials: "include",
  });

  ReactDOM.render(
    <ApolloProvider client={client}>
      <App
        defaultConfigState={awaitedDefaultConfigState}
        defaultAppState={awaitedDefaultAppState}
      />
    </ApolloProvider>,
    document.getElementById("root")
  );
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
          prefix={<ArrowPathIcon className="h-4 w-4" />}
          type="primary"
          size={2}
          onClick={async () => {
            registration.waiting?.postMessage({ type: "SKIP_WAITING" });
            window.onbeforeunload = () => undefined;
            window.location.reload();
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
