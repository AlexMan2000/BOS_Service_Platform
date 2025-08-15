function buildUrl(baseUrl: string, params:{[key:string]: string}) {
    const queryString = Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join("&");
    return `${baseUrl}?${queryString}`;
}


export default buildUrl