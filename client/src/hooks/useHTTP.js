import React, {useState} from "react";

export const useHTTP = () => {
    const errorMessage = "Произошла ошибка. Попробуйте позже.";

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function request(url, method = "GET", body = null, headers = {}) {
        try {
            setLoading(true);

            if (body) {
                body = JSON.stringify(body);
                headers["Content-Type"] = "application/json;charset=utf-8";
            }

            const response = await fetch(url, {method, headers, body});
            const data = await response.json();

            if (!response.ok) {
                const e = new Error();
                e.message = data.message || errorMessage;
                if (Array.isArray(data.errors) && data.errors.length !== 0) e.errors = data.errors;
                throw e;
            }

            setLoading(false);
            return data;
        } catch (e) {
            setLoading(false);
            setError(e.message || errorMessage);
            throw e;
        }
    }

    return { request, errorMessage, loading, error };
}
