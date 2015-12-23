'use strict';

import { combineReducers } from 'redux';
<% if (hasRouter === true) { %>
import { routerStateReducer as router } from 'redux-router';
import * as pageReducers from './reducers/reducers/pageReducers';
<% } %> 
import * as fooReducers from './reducers/reducers/fooReducers';

const reducers = Object.assign({}, 
	fooReducers
	<% if (hasRouter === true) { %>
	,pageReducers,	
	{ router }
	<% } %> 
	);
/**
 * Root reducder
 * @description
 * Combines every reducer and returns a full state tree whenever
 * any reducer is called by an action. The rootReducer creates properties 
 * on the state tree whose keynames match the reducer names on the object passed
 * into combineReducers
 */
const rootReducer = combineReducers(reducers);	

export default rootReducer;