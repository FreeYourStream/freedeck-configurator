import {
  PlusCircleIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { useContext } from "react";
import { useDrop } from "react-dnd";
import { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { Collections } from "./containers/Collection/Collections";
import { ContentBody } from "./containers/ContentBody";
import { FirstPage } from "./containers/FirstTime";
import { Header } from "./containers/Header";
import { Pages } from "./containers/Page/Pages";
import { FDButton } from "./lib/components/Button";
import {
  ConfigDispatchContext,
  ConfigStateContext,
} from "./states/configState";

export const Body = () => {
  const nav = useNavigate();
  const configState = useContext(ConfigStateContext);
  const { createCollection, addPage, setPageCollection } = useContext(
    ConfigDispatchContext
  );
  const [, drop] = useDrop<{ pageId: string; collectionId: string }>({
    accept: "page",
    drop: (item, monitor) => {
      if (!!monitor.getItem().collectionId && monitor.isOver()) {
        setPageCollection({
          pageId: monitor.getItem().pageId,
          collectionId: monitor.getItem().collectionId,
        });
      }
    },
  });
  return (
    <div ref={drop} className="flex flex-col h-full w-full">
      <Header />
      <ContentBody>
        {!!Object.values(configState.pages.byId).filter(
          (p) => !p.isInCollection
        ).length && <Pages />}
        {!Object.values(configState.pages.sorted).length && <FirstPage />}
        {!!Object.keys(configState.collections.sorted).length &&
          !!configState.pages.sorted.length && <Collections />}
      </ContentBody>
      <Toaster />
      <div className="fixed bottom-5 left-6 z-30">
        <FDButton
          prefix={<QuestionMarkCircleIcon className="w-6 h-6" />}
          className="mr-4"
          size={3}
          type="primary"
          onClick={() => nav("/help")}
        >
          Help
        </FDButton>
      </div>
      {!!Object.keys(configState.pages.sorted).length && (
        <div className="fixed bottom-5 right-6 z-30">
          <FDButton
            prefix={<PlusCircleIcon className="w-6 h-6" />}
            className="mr-4"
            size={3}
            type="primary"
            onClick={() => createCollection({})}
          >
            Add Collection
          </FDButton>
          <FDButton
            prefix={<PlusCircleIcon className="w-6 h-6" />}
            size={3}
            type="primary"
            onClick={() => addPage({})}
          >
            Add Page
          </FDButton>
        </div>
      )}
    </div>
  );
};
