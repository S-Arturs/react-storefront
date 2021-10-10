import {combineReducers} from 'redux';
import categoryReducer from "./categorizer";
import currencyReducer from "./currency";
import cartReducer from "./cartReducer";

const allReducers = combineReducers({
    categorizer : categoryReducer,
    currency: currencyReducer,
    cart: cartReducer,
})

export default allReducers;