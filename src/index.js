import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createStore} from 'redux';
import allReducer from './Reducers';
import {Provider} from 'react-redux';
import { loadState, saveState} from './Api/LocalStorage.js'
import throttle from 'lodash/throttle'

const persistedState = loadState();
const store = createStore(
  allReducer, 
  persistedState
);

// limiting writing to local storage to once per second
store.subscribe(throttle(() => {
  saveState(store.getState())
}, 1000));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

reportWebVitals();
