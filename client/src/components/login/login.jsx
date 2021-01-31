// React
import React, {useState, useRef} from "react";

// Store
import {useStore} from "components/store";
import {LoginUser} from "components/store/actions";

// Hooks
import {useHTTP} from "@/hooks/useHTTP.js";

// CSS
import "./login.scss";
import InputGroup from "components/input-group";

const Login = () => {
    const message = useRef();
    const { dispatch } = useStore();
    const {request, loading, errorMessage} = useHTTP();
    const [data, setData] = useState({
        email: "", password: ""
    });
    const [pageErrors, setPageErrors] = useState([]);

    const onChangeHandler = e => {
        setData({ ...data, [e.target.id]: e.target.value });
    }

    const onLoginHandler = async () => {
        try {
            message.current.classList.remove("input-group__message_error");
            const response = await request("/api/auth/login", "POST", data);
            dispatch(LoginUser(response));
        } catch (e) {
            if (Array.isArray(e.errors) && e.errors.length !== 0) {
                setPageErrors([...e.errors]);
                message.current.textContent = "";
            } else {
                message.current.classList.add("input-group__message_error");
                message.current.textContent = e.message || errorMessage;
            }
        }
    }

    const onRegisterHandler = async () => {
        try {
            message.current.classList.remove("input-group__message_error");
            const response = await request("/api/auth/register", "POST", data);
            message.current.textContent = response.message;
            setPageErrors([]);
            setData({ email: "", password: "" });
        } catch (e) {
            if (Array.isArray(e.errors) && e.errors.length !== 0) {
                setPageErrors([...e.errors]);
                message.current.textContent = "";
            } else {
                message.current.classList.add("input-group__message_error");
                message.current.textContent = e.message || errorMessage;
            }
        }
    }

    return (
        <div className="page login">
            <InputGroup
                onChange={onChangeHandler}
                id="email"
                label="Email"
                maxLength={80}
                pageErrors={pageErrors.filter(e => e.param === "email")}
                required={false}
                //value={data?.email}
            />
            <InputGroup
                onChange={onChangeHandler}
                id="password"
                label="Пароль"
                maxLength={50}
                pageErrors={pageErrors.filter(e => e.param === "password")}
                required={false}
                //value={data?.password}
                type="password"
                onKeyDown={ e => { if (e.code === "Enter") onLoginHandler() } }
            />
            <div className="input-group">
                <button className="waves-effect waves-light btn input-group__button" disabled={loading} onClick={onLoginHandler}>Войти</button>
                <button className="waves-effect waves-light btn input-group__button" style={{marginLeft: 10}} disabled={loading} onClick={onRegisterHandler}>Регистрация</button>
                <div className="input-group__message" ref={message} />
            </div>
        </div>
    );
};

export default Login;
