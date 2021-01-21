import actionTypes from "./actionTypes";

const setDefault = payload => ({
    type: actionTypes.DEFAULT_ACTION_TYPE,
    payload
})

export { setDefault };
