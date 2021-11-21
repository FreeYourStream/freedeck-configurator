export const scrollToPage = (page: number) => {
  const contentBodyRef = document.getElementById("contentBody");
  const pageRef = document.getElementById(`page_${page}`);
  const headerRef = document.getElementById("header");
  if (pageRef && contentBodyRef) {
    contentBodyRef.scrollTo({
      top: pageRef.offsetTop - (headerRef?.clientHeight ?? 150) + 24,
    });
  }
};
