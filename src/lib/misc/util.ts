import { Collection, Page } from "../../generated";
export const getPageName = (pageId: string, page?: Page) => {
  return page?.name ? page.name : pageId.slice(-4);
};

export const getCollectionName = (
  collectionId: string,
  collection?: Collection
) => {
  return collection?.name ? collection.name : collectionId.slice(-4);
};

export const isMacOS = navigator.userAgent.indexOf("Mac OS X") !== -1;

export function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
