// React
import React, {useEffect} from "react";
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";

// CSS
import "./app.scss";

// Components
import FormItem from "components/form-item";
import Login from "components/login";
import LoggedIn from "components/logged-in";

// Store
import {useStore, withStore} from "components/store";
import {LoginUser, LogoutUser} from "components/store/actions";

import {isTokenExpired} from "js/assets/utils.js";

const App = () => {
    const { state, dispatch } = useStore();
    const { userData } = state;

    // check localStorage at first launch
    useEffect(() => {
        const userDataLS = JSON.parse(localStorage.getItem("userData"));
        if (!userData?.token && userDataLS && userDataLS?.token && userDataLS?.userId) {
            dispatch(LoginUser(userDataLS));
        }
    }, [userData?.token, dispatch, LoginUser]);

    const isAuthenticated = !!userData?.token;

    if (isAuthenticated && isTokenExpired(userData.token)) {
        dispatch(LogoutUser());
    }

    return (
        <div className="app">
            <Router>
                    <Switch>
                        <Route path="/" exact>
                            <FormItem />
                        </Route>
                        <Route path="/admin" exact>
                            { isAuthenticated && <LoggedIn /> }
                            { !isAuthenticated && <Login /> }
                        </Route>
                        <Redirect to="/" />
                    </Switch>
            </Router>
        </div>
    );
};

export default withStore(App);
