export interface DateInfo {
    year: string
    month: string
    day: string
    hour: string
    minute: string
    second: string
    millisecond: string
}


function _formatNormalize(formatter: string| Function):Function {

    // 如果传入的是函数，表示是自由度最高的一种参数形式，直接返回即可
    if (typeof formatter === "function") {
        return formatter;
    }

    // 不是函数，就必须是字符串，如果不是字符串就报错
    if (typeof formatter !== "string") {
        throw new Error("The formatter has to be either string or function!");
    }

    // 字符串类型有两种取值: date和datetime
    if (formatter === "date") {
        formatter = "yyyy-MM-dd"
    } else if (formatter === "datetime") {
        formatter = "yyyy-MM-dd HH:mm:ss"
    }
    // else, the formatter is a self-defined string e.g. yyyy年MM月dd日 HH:mm:ss.ms


    return (dateInfo: DateInfo) => {
        const {year, month, day, hour, minute, second, millisecond} = dateInfo;

        const result = formatter.replace('yyyy', year)
            .replace('MM', month)
            .replace('dd', day)
            .replace('HH', hour)
            .replace('mm', minute)
            .replace('ss', second)
            .replace('ms', millisecond)
        

        return result;
    }
}



export function formate(date: Date, formatter: string| Function, isPad=false):string {

    if (!date) {
        return ""
    }

    const normalizedFormate = _formatNormalize(formatter);

    let dateInfo:DateInfo = {
        year: date.getFullYear().toString(),
        month: (date.getMonth() + 1).toString(),
        day: date.getDay().toString(),
        hour: date.getHours().toString(),
        minute: date.getMinutes().toString(),
        second: date.getSeconds().toString(),
        millisecond: date.getMilliseconds().toString()
    }

    // Consider padding
    dateInfo.year = isPad ? dateInfo.year.padStart(4, '0'): dateInfo.year;
    dateInfo.month = isPad ? dateInfo.month.padStart(2, '0'): dateInfo.month;
    dateInfo.day = isPad ? dateInfo.day.padStart(2, '0'): dateInfo.day;
    dateInfo.hour = isPad ? dateInfo.hour.padStart(2, '0'): dateInfo.hour;
    dateInfo.minute = isPad ? dateInfo.minute.padStart(2, '0'): dateInfo.minute;
    dateInfo.second = isPad ? dateInfo.second.padStart(2, '0'): dateInfo.second;

    return normalizedFormate(dateInfo);
}
