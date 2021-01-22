// React
import React from "react";

// CSS
import "./logged-in.scss";

// Store
import {useStore} from "components/store";
import {LogoutUser} from "components/store/actions";

// import {useHTTP} from "@/hooks/useHTTP.js";

const LoggedIn = () => {
    const { dispatch } = useStore();

    const onLogoutHandler = () => {
        dispatch(LogoutUser());
    }

    return (
        <div className="logged-in">
            <div className="logged-in__block">
                Table
            </div>
            <div className="logged-in__block">
                <button className="logged-in__button" onClick={onLogoutHandler}>Выйти</button>
            </div>
        </div>
    );
};

export default LoggedIn;
