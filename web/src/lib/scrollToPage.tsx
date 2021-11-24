export const scrollToPage = (pageId: string) => {
  const contentBodyRef = document.getElementById("contentBody");
  const pageRef = document.getElementById(`page_${pageId}`);
  const headerRef = document.getElementById("header");
  if (pageRef && contentBodyRef) {
    contentBodyRef.scrollTo({
      top: pageRef.offsetTop - (headerRef?.clientHeight ?? 150) + 24,
    });
  }
};
