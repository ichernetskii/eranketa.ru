// React
import React, {useState, useMemo} from "react";

// Config
import { mapData } from "js/config.js";

// Libs
import Form from "@/model/Form.js";
import {errorMessage} from "js/assets/utils.js";

// Components
import InputGroup from "components/input-group";
import Header from "components/header";

// CSS
import "./form-item.scss";

const FormItem = () => {
    const [message, setMessage] = useState({
        className: "input-group__message",
        text: ""
    });
    const [data, setData] = useState({
        email: "", name: "", phone: "", birthDate: "", additionalInfo: ""
    });
    const [pageErrors, setPageErrors] = useState([]);
    const [isLoading, setLoading] = useState(false);

    const onChangeHandler = e => {
        setData(d => ({ ...d, [e.target.id]: e.target.value }));
    };

    const onClickHandler = async () => {
        try {
            setLoading(true);
            const form = new Form(data);
            const response = await form.create();
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
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="page form-page">
            <Header />
            <h1 className="header-1 page__header">Анкета для сторонников партии</h1>
            <div className="form-item">
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
                            type={value.type}
                            required={value.required}
                        />
                    ))
                }
                <div className="input-group">
                    <button disabled={isLoading} className="waves-effect waves-light btn input-group__button" onClick={onClickHandler}>Отправить</button>
                    <div className={message.className}>{message.text}</div>
                </div>
            </div>
        </div>
    );
};

export default FormItem;
