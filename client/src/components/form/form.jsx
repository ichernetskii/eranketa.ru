// React
import React, {useState, useCallback, useMemo} from "react";
import { mapData } from "js/config.js";

import {useHTTP} from "@/hooks/useHTTP.js";

// Components
import InputGroup from "components/input-group";
import Header from "components/header";

// CSS
import "./form.scss";

const Form = () => {
    const [message, setMessage] = useState({
        className: "input-group__message",
        text: ""

    });
    const [data, setData] = useState({
        email: "", name: "", phone: "", birthDate: "", additionalInfo: ""
    });
    const [pageErrors, setPageErrors] = useState([]);

    const {request, loading, errorMessage} = useHTTP();

    const onChangeHandler = useCallback(e => {
        setData(d => ({ ...d, [e.target.id]: e.target.value }));
    }, []);

    const onClickHandler = async () => {
        try {
            const response = await request("/api/form/create", "POST", data);
            setPageErrors([]);
            setMessage({ className: "input-group__message", text: response.message });
        } catch (e) {
            if (Array.isArray(e.errors) && e.errors.length !== 0) {
                setPageErrors([...e.errors]);
                setMessage(m => ({...m, text: ""}))
            } else {
                setMessage({
                    className: "input-group__message input-group__message_error",
                    text: e.message || errorMessage
                });
            }
        }
    }

    return (
        <div className="page form-page">
            <Header />
            <div className="form">
                {
                    Object.entries(mapData).map(([key, value]) => (
                        <InputGroup
                            key={key}
                            onChange={onChangeHandler}
                            id={key}
                            label={value.label}
                            pageErrors={
                                useMemo(
                                    () => pageErrors.filter(err => err.param === key),
                                    [pageErrors, key]
                                )
                            }
                            labelClasses="form-label"
                            type={value.type}
                            required={value.required}
                        />
                    ))
                }
                <div className="input-group">
                    <button disabled={loading} className="waves-effect waves-light btn input-group__button" onClick={onClickHandler}>Отправить</button>
                    <div className={message.className}>{message.text}</div>
                </div>
            </div>
        </div>
    );
};

export default Form;
