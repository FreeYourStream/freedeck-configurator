import { useContext } from "react";

import { ICollection, IPage } from "../interfaces";

export const getPageName = (pageId: string, page?: IPage) => {
  return page?.name ? page.name : pageId.slice(-4);
};

export const getCollectionName = (
  collectionId: string,
  collection?: ICollection
) => {
  return collection?.name ? collection.name : collectionId.slice(-4);
};
