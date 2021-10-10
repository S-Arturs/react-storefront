export const setCategory = id => {
    return {
        type: 'SET_CATEGORY',
        payload: id
    };
};

export const setCurrency = data => {
    return {
        type: 'SET_CURRENCY',
        payload: data
    };
};

export const addToCart = data => {
    return {
        type: 'ADD_TO_CART',
        payload: data
    };
};

export const removeFromCart = data => {
    return {
        type: 'REMOVE_FROM_CART',
        payload: data
    };
};

export const incrementQuantity = data => {
    return {
        type: 'INCREMENT_QUANTITY',
        payload: data
    };
};

export const decrementQuantity = data => {
    return {
        type: 'DECREMENT_QUANTITY',
        payload: data
    };
};