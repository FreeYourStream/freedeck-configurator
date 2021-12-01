import { PlusCircleIcon } from "@heroicons/react/outline";
import React, { useContext } from "react";
import { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router";

import { Collections } from "./containers/Collection/Collections";
import { ContentBody } from "./containers/ContentBody";
import { FirstPage } from "./containers/FirstTime";
import { Header } from "./containers/Header";
import { Pages } from "./containers/Page/Pages";
import { FDButton } from "./lib/components/Button";
import { usePageSwitcher } from "./lib/hooks/pageSwitcherHook";
import { AppStateContext } from "./states/appState";
import {
  ConfigDispatchContext,
  ConfigStateContext,
} from "./states/configState";

export const Body = () => {
  const configState = useContext(ConfigStateContext);
  const appState = useContext(AppStateContext);
  const configDispatch = useContext(ConfigDispatchContext);
  usePageSwitcher({ appState, configState });
  return (
    <div className="flex flex-col h-full w-full">
      <Header />
      <ContentBody>
        {!!Object.values(configState.pages.byId).filter(
          (p) => !p.isInCollection
        ).length && <Pages />}
        {!Object.values(configState.pages.sorted).length && <FirstPage />}
        {!!Object.keys(configState.collections.sorted).length && (
          <Collections />
        )}
      </ContentBody>
      <Toaster />
      {!!Object.keys(configState.pages.sorted).length && (
        <div className="fixed bottom-5 right-6 ">
          <FDButton
            prefix={<PlusCircleIcon className="w-6 h-6" />}
            className="mr-4"
            size={3}
            type="primary"
            onClick={() => configDispatch.createCollection({})}
          >
            Add Collection
          </FDButton>
          <FDButton
            prefix={<PlusCircleIcon className="w-6 h-6" />}
            size={3}
            type="primary"
            onClick={() => configDispatch.addPage({})}
          >
            Add Page
          </FDButton>
        </div>
      )}
    </div>
  );
};
