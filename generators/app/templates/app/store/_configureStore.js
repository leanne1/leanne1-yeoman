import { createStore, applyMiddleware, compose } from 'redux';
<% if (hasRouter === true) { %>
import { reduxReactRouter } from 'redux-router';
import createHistory from 'history/lib/createHashHistory';
import routes from '../router/routes';
<% } %> 
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import rootReducer from '../reducers/';

/**
 * Configure the store with middleware:
 * thunk - thunk actions (actions that return a function)
<% if (hasRouter === true) { %> 
 * redux-router - store route information on the state tree
<% } %>  
 * createLogger - log action dispatch in browser console
 */
const finalCreateStore = compose(
    applyMiddleware(thunk),
    <% if (hasRouter === true) { %>
    reduxReactRouter({ routes, createHistory }),
    <% } %> 
    applyMiddleware(createLogger())
)(createStore);

export default function configureStore(initialState) {
    return finalCreateStore(rootReducer, initialState);
}