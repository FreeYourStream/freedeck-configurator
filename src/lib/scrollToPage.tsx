export const scrollToPage = (page: number) => {
    const pagesRef = document.getElementById("pages")
    const pageRef = document.getElementById(`page_${page}`)
    const headerRef = document.getElementById("header")
    if(pageRef && pagesRef) {
        pagesRef.scrollTo(0, pageRef.offsetTop - (headerRef?.clientHeight ?? 150))
    }
} 