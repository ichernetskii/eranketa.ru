import actionTypes from "./actionTypes";

const setDefault = payload => ({
    type: actionTypes.DEFAULT_ACTION_TYPE,
    payload
});

const LoginUser = payload => ({
    type: actionTypes.LOGIN_USER,
    payload
});

const LogoutUser = () => ({
    type: actionTypes.LOGOUT_USER
});

export { setDefault, LoginUser, LogoutUser };
