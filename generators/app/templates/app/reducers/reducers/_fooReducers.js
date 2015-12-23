import * as actionTypes from '../../actions/actionTypes';
const fooActionTypes = actionTypes.fooActionTypes; 

/**
 * Page reducer: update application foo
 * @param {String} current state
 * @param {object} action
 * @return {String} next state
 */
export function page(state='', action) {
	switch (action.type) {
  		case fooActionTypes.UPDATE_FOO:
    		return state.set('foo', action.foo);
    	default:
    		return state;
  	}
}