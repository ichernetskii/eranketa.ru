import actionTypes from "components/store/actions/actionTypes";

const reducer = (state, action) => {
    switch (action.type) {
        case actionTypes.DEFAULT_ACTION_TYPE: return { ...state, defaultProperty: action.payload }
        default: new Error("Wrong action dispatched")
    }
}

export default reducer;
