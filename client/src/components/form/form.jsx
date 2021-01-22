// React
import React, {useState, useRef} from "react";

// CSS
import "./form.scss";
import {useHTTP} from "@/hooks/useHTTP.js";

const Form = () => {
    const message = useRef();
    const {request, loading, errorMessage} = useHTTP();

    const [data, setData] = useState({
        email: "", name: "", phone: "", additionalInfo: ""
    });

    const onInputHandler = e => {
        setData({ ...data, [e.target.id]: e.target.value });
    }

    const onClickHandler = async () => {
        try {
            const response = await request("/api/form/create", "POST", data);
            message.current.textContent = response.message;
            message.current.classList.remove("error");
        } catch (e) {
            if (Array.isArray(e.errors) && e.errors.length !== 0) {
                message.current.innerHTML = e.errors.map(e => e.msg).join("<br/>");
            } else {
                message.current.textContent = e.message || errorMessage;
            }
            message.current.classList.add("error");
        }
    }

    return (
        <div className="form">
            <div className="form__block">
                <label className="form__label required" htmlFor="email">Email</label>
                <input onChange={onInputHandler} className="form__input" id="email" />
            </div>
            <div className="form__block">
                <label className="form__label required" htmlFor="name">Фамилия Имя Отчество</label>
                <input onChange={onInputHandler} className="form__input" id="name" />
            </div>
            <div className="form__block">
                <label className="form__label required" htmlFor="phone">Телефон</label>
                <input onChange={onInputHandler} className="form__input" id="phone" />
            </div>
            <div className="form__block">
                <label className="form__label" htmlFor="additionalInfo">Дополнительная информация</label>
                <input onChange={onInputHandler} className="form__input" id="additionalInfo" />
            </div>
            <div className="form__block">
                <button disabled={loading} className="form__button" onClick={onClickHandler}>Отправить</button>
                <div className="form__message" ref={message} />
            </div>
        </div>
    );
};

export default Form;
