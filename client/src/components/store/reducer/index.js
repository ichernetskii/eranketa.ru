import actionTypes from "components/store/actions/actionTypes";
import {getUserData} from "js/assets/utils.js";

const storageName = "userData";

const reducer = (state, action) => {
    switch (action.type) {
        case actionTypes.DEFAULT_ACTION_TYPE: return { ...state, defaultProperty: action.payload }
        case actionTypes.LOGIN_USER:
            const token = action.payload.token;
            const userData = { ...getUserData(token), token};
            localStorage.setItem(storageName, JSON.stringify(userData));
            return { ...state, userData };
        case actionTypes.LOGOUT_USER:
            localStorage.removeItem(storageName);
            return { ...state, userData: null }
        default: new Error("Wrong action dispatched")
    }
}

export default reducer;
