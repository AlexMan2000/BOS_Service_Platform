import dayjs from "dayjs"

export const formatDateTime = (date: string) => {
    return dayjs(date).format("YYYY-MM-DDTHH:mm:ss");
}

export const formatDate = (date: string) => {
    return dayjs(date).format("YYYY-MM-DD");
}
