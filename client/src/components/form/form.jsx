// React
import React, {useState} from "react";

// CSS
import "./form.scss";
import {useHTTP} from "@/hooks/useHTTP.js";
import InputGroup from "components/input-group";

const Form = () => {
    const [message, setMessage] = useState({
        className: "input-group__message",
        text: ""

    });
    const {request, loading, errorMessage} = useHTTP();

    const [data, setData] = useState({
        email: "", name: "", phone: "", additionalInfo: ""
    });

    const [pageErrors, setPageErrors] = useState([]);

    const onInputHandler = e => {
        console.log(e);
        setData(d => ({ ...d, [e.target.id]: e.target.value }));
    }

    const onClickHandler = async () => {
        try {
            const response = await request("/api/form/create", "POST", data);
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
        <div className="page">
            <InputGroup
                onInput={onInputHandler}
                id="email"
                label="Email"
                maxLength={80}
                pageErrors={pageErrors.filter(e => e.param === "email")}
                labelClasses="form-label"
                value={data?.email}
            />
            <InputGroup
                onInput={onInputHandler}
                id="name"
                label="Фамилия Имя Отчество"
                maxLength={100}
                pageErrors={pageErrors.filter(e => e.param === "name")}
                labelClasses="form-label"
                value={data?.name}
            />
            <InputGroup
                onInput={onInputHandler}
                id="phone"
                label="Телефон"
                maxLength={20}
                pageErrors={pageErrors.filter(e => e.param === "phone")}
                labelClasses="form-label"
                value={data?.phone}
            />
            <InputGroup
                onInput={onInputHandler}
                id="additionalInfo"
                label="Дополнительная информация"
                maxLength={500}
                pageErrors={pageErrors.filter(e => e.param === "additionalInfo")}
                labelClasses="form-label"
                required={false}
                value={data?.additionalInfo}
            />
            <div className="input-group">
                <button disabled={loading} className="input-group__button" onClick={onClickHandler}>Отправить</button>
                <div className={message.className}>{message.text}</div>
            </div>
        </div>
    );
};

export default Form;
