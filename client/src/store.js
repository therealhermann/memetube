import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducer';

const configureStore = () => {
  return createStore(
    reducer,
    applyMiddleware(thunk)
  );
}

const store = configureStore();

export default store;
