import { useEffect } from "react";

import { AppState } from "../../states/appState";
import { ConfigState } from "../../states/configState";

const findPage = (configState: ConfigState, name: string) => {
  return configState.pages.sorted.findIndex((id) => {
    const page = configState.pages.byId[id];
    if (page.isInCollection) return false;
    if (page.usePageNameAsWindowName) {
      if (!page.name) return false;
      return name.toLowerCase().indexOf(page.name.toLowerCase()) !== -1;
    } else {
      if (!page.windowName) return false;
      return name.toLowerCase().indexOf(page.windowName.toLowerCase()) !== -1;
    }
  });
};
const findCollectionPage = (configState: ConfigState, name: string) => {
  return Object.values(configState.collections.byId).find((col) => {
    if (col.usePageNameAsWindowName) {
      if (!col.name) return false;
      return name.toLowerCase().indexOf(col.name.toLowerCase()) !== -1;
    } else {
      if (!col.windowName) return false;
      return name.toLowerCase().indexOf(col.windowName.toLowerCase()) !== -1;
    }
  });
};

const run = async (configState: ConfigState, appState: AppState) => {
  try {
    const res = await fetch("http://localhost:8080/window");
    if (!res.ok) return false;
    let name = await res.text();
    let page = findPage(configState, name);
    // if no, look if we have a collection
    const collection =
      page !== -1 ? findCollectionPage(configState, name) : undefined;
    if (page + 1 || collection) {
      console.time("page")
      const currentPageString = await appState.serialApi?.getCurrentPage();
      console.timeEnd("page")
      if (currentPageString === undefined) return;
      const currentPageIndex = parseInt(currentPageString);
      if (page + 1) {
        if (currentPageIndex !== page) appState.serialApi?.setCurrentPage(page);
      } else if (collection) {
        const currentId = configState.pages.sorted[currentPageIndex];
        if (!collection.pages.includes(currentId)) {
          const firstCollectionPage = configState.pages.sorted.findIndex(
            (pid) => pid === collection.pages[0]
          );
          appState.serialApi?.setCurrentPage(firstCollectionPage);
        }
      }
    }
  } catch {
    console.log("error, companion probably not running")
  }
}

export const usePageSwitcher = (props: {
  configState: ConfigState;
  appState: AppState;
}) => {
  const { configState, appState } = props;
  useEffect(() => {
    if (!(navigator as any).serial) return () => {};
    let running = false;
    const interval = setInterval(async () => {
      console.log(interval);
      if(!running){
        console.time("a");
        running = true;
        await run(configState, appState);
        running = false;
        console.timeEnd("a");
      }
    }, 300);
    return () => {console.log("clearing interval", interval); clearInterval(interval)};
  }, [configState, appState.serialApi])
};
