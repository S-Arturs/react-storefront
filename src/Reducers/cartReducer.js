const cartReducer = (state = [], action) => {
  switch (action.type) {
    case "ADD_TO_CART": {
      let stateClone = JSON.parse(JSON.stringify(state));
      let actionClone = JSON.parse(JSON.stringify(action.payload));
      for (let i = 0; i < stateClone.length; i++) {
        if (
         stateClone[i].id === actionClone.id &&
          JSON.stringify(stateClone[i].attributes) ===
            JSON.stringify(actionClone.attributes)
        ) {
          stateClone[i].quantity += actionClone.quantity;
          return stateClone;
        }
      }
      return [...stateClone, actionClone];
    }
    case "REMOVE_FROM_CART": {
      state.splice(action.payload, 1);
      return state;
    }
    case "INCREMENT_QUANTITY": {
      state[action.payload].quantity = state[action.payload].quantity + 1;
      return state;
    }
    case "DECREMENT_QUANTITY": {
      state[action.payload].quantity = state[action.payload].quantity - 1;
      return state;
    }
    default:
      return state;
  }
};
export default cartReducer;
