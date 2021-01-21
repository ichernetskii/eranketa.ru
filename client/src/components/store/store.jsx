import React, {useContext, useReducer} from "react";

import initialState from "components/store/reducer/initialState";
import reducer from "components/store/reducer";

const StoreContext = React.createContext(initialState);
const useStore = () => useContext(StoreContext);

const Store = ({children}) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <StoreContext.Provider value={{ state, dispatch }}>
            {children}
        </StoreContext.Provider>
    );
}

const withStore = Children => {
    return () => (
        <Store>
            {<Children />}
        </Store>
    )
}
export default Store;
export {useStore, withStore};
