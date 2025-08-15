// In ReportSideBar component
export const scrollToSection = (whichToScrollId: string, sectionId: string) => {
    /**
     * whichToScrollId: id of the div that contains the content, component should be fixed position
     * sectionId: id of the sub section of the component to scroll to
     */
    const contentDiv = document.getElementById(whichToScrollId);
    const targetElement = document.getElementById(sectionId);

    console.log("contentDiv", contentDiv)
    console.log("targetElement", targetElement)
    
    if (contentDiv && targetElement) {
        const topOffset = targetElement.offsetTop;
        console.log("topOffset", topOffset)
        contentDiv.scrollTo({
            top: topOffset,
            behavior: 'smooth'
        });
    }
};


export const scrollToPosition = (whichToScrollId: string, position: number) => {
    const contentDiv = document.getElementById(whichToScrollId);

    console.log("contentDiv", contentDiv)
    
    if (contentDiv) {
        contentDiv.scrollTo({
            top: position,
            behavior: 'smooth'
        });
    }
};