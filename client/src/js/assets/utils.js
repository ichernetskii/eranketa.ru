// Token
import jwt_decode from "jwt-decode";

// Returns a function, that, when invoked, will only be triggered at most once
// during a given window of time. Normally, the throttled function will run
// as much as it can, without ever going more than once per `wait` duration;
// but if you'd like to disable the execution on the leading edge, pass
// `{leading: false}`. To disable execution on the trailing edge, ditto.
export function throttle(func, wait, options) {
    let context, args, result;
    let timeout = null;
    let previous = 0;
    if (!options) options = {};
    let later = function() {
        previous = options.leading === false ? 0 : Date.now();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
    };
    return function() {
        let now = Date.now();
        if (!previous && options.leading === false) previous = now;
        let remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
        return result;
    };
}

export function isTokenExpired(token) {
    const expired = jwt_decode(token).exp;
    const now = new Date().valueOf()/1000;
    return now > expired;
}

export function getUserData(token) {
    const {iat, exp, ...data} = jwt_decode(token);
    return data;
}

export function dateToString(date) {
    if (!date) return "";
    if (typeof date === "string") return date;
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth()+1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
}

export function stringToDate(str) {
    if (!str) return null;
    if (str instanceof Date) return str;
    if (str.search(/^\d{2}\.\d{2}\.\d{4}$/) !== -1) {
        const [day, month, year] = str.split(".");
        return new Date(+year, month - 1, +day);
    } else return new Date(str);
}
