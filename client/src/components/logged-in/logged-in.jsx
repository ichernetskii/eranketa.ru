// React
import React from "react";

// CSS
import "./logged-in.scss";

// Store
import {useStore} from "components/store";
import {LogoutUser} from "components/store/actions";

// Components
import FormList from "components/form-list";

// import {useHTTP} from "@/hooks/useHTTP.js";

const LoggedIn = () => {
    const { state, dispatch } = useStore();
    const { userData } = state;
    const { rights } = userData;
    rights.forEach(item => rights[item] = true);

    const onLogoutHandler = () => {
        dispatch(LogoutUser());
    }

    return (
        <div className="page logged-in">
            <div className="input-group">
                <button className="waves-effect waves-light btn input-group__button" onClick={onLogoutHandler}>Выйти</button>
            </div>
            <div className="input-group">
                <FormList />
            </div>
        </div>
    );
}

export default LoggedIn;
