export const encodeToBase64 = (input: any): string => {
    if (input === null || input === undefined) {
        throw new Error("Cannot encode empty object");
    }
    
    const utf8String = new TextEncoder().encode(input.toString());  // Convert to UTF-8
    return btoa(String.fromCharCode(...utf8String));  // Encode to Base64
};

// Decode from Base64 with UTF-8 support
export const decodeFromBase64 = (input: any): string => {
    if (input === null || input === undefined) {
        throw new Error("Cannot decode empty object");
    }
    
    const decodedString = atob(input.toString());  // Decode from Base64
    const utf8Array = new Uint8Array([...decodedString].map(char => char.charCodeAt(0)));  // Convert back to UTF-8 array
    return new TextDecoder().decode(utf8Array);  // Decode UTF-8 to string
};