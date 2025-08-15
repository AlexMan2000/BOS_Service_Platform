

export const classNames = (classNames: (string|undefined)[]): string => {

    if (!classNames || classNames.length == 0) {
        return "";
    }


    const isValidClassName = (className) => {
        const regex = /^[a-zA-Z_][a-zA-Z0-9_-]*$/;
        return regex.test(className);
    }

    // Check the validity of class names
    const validClassNames = classNames.filter((className, _) => {
        return className && isValidClassName(className);
    })

    
    return validClassNames.join(" ");
}


export const classNamesArgs = (...classNames: (string|undefined)[]): string => {

    if (!classNames || classNames.length == 0) {
        return "";
    }


    const isValidClassName = (className) => {
        const regex = /^[a-zA-Z_][a-zA-Z0-9_-]*$/;
        return regex.test(className);
    }

    // Check the validity of class names
    const validClassNames = classNames.filter((className, _) => {
        return className && isValidClassName(className);
    })

    
    return validClassNames.join(" ");
}