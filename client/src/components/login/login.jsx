// React
import React, {useState, useRef} from "react";

// Store
import {useStore} from "components/store";
import {LoginUser} from "components/store/actions";

// Model
import User from "@/model/User.js";

// Components
import InputGroup from "components/input-group";

// Libs
import {errorMessage} from "js/assets/utils.js";

// CSS
import "./login.scss";

const Login = () => {
    const message = useRef();
    const { dispatch } = useStore();
    const [isLoading, setLoading] = useState(false);

    const [data, setData] = useState({
        email: "", password: ""
    });
    const [pageErrors, setPageErrors] = useState([]);

    const onChangeHandler = e => {
        setData({ ...data, [e.target.id]: e.target.value });
    }

    const onLoginHandler = async () => {
        try {
            setLoading(true);
            message.current.classList.remove("input-group__message_error");
            const user = new User(data);
            const response = await user.login();
            setLoading(false);
            dispatch(LoginUser(response));
        } catch (e) {
            setLoading(false);
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
            setLoading(true)
            message.current.classList.remove("input-group__message_error");
            const user = new User(data);
            const response = await user.register();
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
        } finally {
            setLoading(false);
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
            />
            <InputGroup
                onChange={onChangeHandler}
                id="password"
                label="Пароль"
                maxLength={50}
                pageErrors={pageErrors.filter(e => e.param === "password")}
                required={false}
                type="password"
                onKeyDown={ e => { if (e.code === "Enter") onLoginHandler() } }
            />
            <div className="input-group">
                <button className="waves-effect waves-light btn input-group__button" disabled={isLoading} onClick={onLoginHandler}>Войти</button>
                <button className="waves-effect waves-light btn input-group__button" style={{marginLeft: 10}} disabled={isLoading} onClick={onRegisterHandler}>Регистрация</button>
                <div className="input-group__message" ref={message} />
            </div>
        </div>
    );
};

export default Login;
