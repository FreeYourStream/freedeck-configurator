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

export function sleep(ms: number) {
  return new Promise<void>((resolve) =>
    setTimeout(() => {
      try {
        resolve();
      } catch (e) {
        console.log(e);
      }
    }, ms)
  );
}

export function compareVersions(a: string, b: string) {
  const aParts = a.split(".");
  const bParts = b.split(".");
  for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
    const aPart = parseInt(aParts[i] || "0");
    const bPart = parseInt(bParts[i] || "0");
    if (aPart < bPart) return -1;
    if (aPart > bPart) return 1;
  }
  return 0;
}
