export const wait = async (timeout: number) => {


    return new Promise((resolve, _) => {

        setTimeout(() => {
            resolve("done");
        }, timeout * 1000)
    })
}