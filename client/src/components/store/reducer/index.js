import actionTypes from "components/store/actions/actionTypes";

const storageName = "userData";

const reducer = (state, action) => {
    switch (action.type) {
        case actionTypes.DEFAULT_ACTION_TYPE: return { ...state, defaultProperty: action.payload }
        case actionTypes.LOGIN_USER:
            localStorage.setItem(storageName, JSON.stringify(action.payload));
            return { ...state, userData: {...action.payload} }
        case actionTypes.LOGOUT_USER:
            localStorage.removeItem(storageName);
            return { ...state, userData: null }
        default: new Error("Wrong action dispatched")
    }
}

export default reducer;
