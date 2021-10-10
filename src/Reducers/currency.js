const currencyReducer = (state = {id: 0, name: 'USD'}, action) => {
    switch(action.type) {
        case "SET_CURRENCY":
            return action.payload;
        default: 
            return state;
    }

}
export default currencyReducer;