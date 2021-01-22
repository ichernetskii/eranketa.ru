// React
import React, {useState, useRef} from "react";

// Store
import {useStore} from "components/store";
import {LoginUser} from "components/store/actions";

// Hooks
import {useHTTP} from "@/hooks/useHTTP.js";

// CSS
import "./login.scss";

const Login = () => {
    const message = useRef();
    const { dispatch } = useStore();
    const {request, loading, errorMessage} = useHTTP();
    const [data, setData] = useState({
        email: "", password: ""
    });

    const onInputHandler = e => {
        setData({ ...data, [e.target.id]: e.target.value });
    }

    const onClickHandler = async () => {
        try {
            const response = await request("/api/auth/login", "POST", data);
            dispatch(LoginUser(response));
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
        <div className="login">
            <div className="login__block">
                <label className="login__label" htmlFor="email">Email</label>
                <input className="login__input" onChange={onInputHandler} id="email" />
            </div>
            <div className="login__block">
                <label className="login__label" htmlFor="password">Пароль</label>
                <input className="login__input" onChange={onInputHandler} id="password" type="password" />
            </div>
            <div className="login__block">
                <button className="login__button" disabled={loading} onClick={onClickHandler}>Отправить</button>
                <div className="login__message" ref={message} />
            </div>
        </div>
    );
};

export default Login;
