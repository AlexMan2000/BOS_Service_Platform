
export const extractNumberAndUnit = (value: string): ({number: number, unit: string} | null) => {

    if (!value) {
        return null;
    }


    // Regular expression to match a number (integer or floating point) followed by a unit
    const regex = /^(-?\d+(\.\d+)?)([a-zA-Z%]+)$/;
    
    // Apply the regex to the input string
    const result = value.match(regex);
    
    // Return an object with number and unit, or null if no match
    if (result) {
        return {
            number: parseFloat(result[1]),
            unit: result[3]
        };
    } else {
        return null;
    }
}