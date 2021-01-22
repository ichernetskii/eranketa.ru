// React
import React, {useEffect} from "react";
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";

// CSS
import "./app.scss";

// Components
import Form from "components/form";
import Login from "components/login";
import LoggedIn from "components/logged-in";

// Store
import {useStore, withStore} from "components/store";
import {LoginUser} from "components/store/actions";

const App = () => {
    const { state, dispatch } = useStore();
    const { userData } = state;

    // check localStorage
    useEffect(() => {
        const userDataLS = JSON.parse(localStorage.getItem("userData"));
        if (!userData.token && userDataLS && userDataLS.token && userDataLS.userId) {
            dispatch(LoginUser(userDataLS));
        }
    }, []);

    const isAuthenticated = !!userData?.token;

    return (
        <Router>
                <Switch>
                    <Route path="/" exact>
                        <Form />
                    </Route>
                    <Route path="/admin" exact>
                        {isAuthenticated && <div><LoggedIn /></div>}
                        {!isAuthenticated && <div><Login /></div>}
                    </Route>
                    <Redirect to="/" />
                </Switch>
        </Router>
    );
};

export default withStore(App);
