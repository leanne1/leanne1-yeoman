import * as actionTypes from '../../actions/actionTypes';
import { Map } from 'immutable';

const pageActionTypes = actionTypes.pageActionTypes; 

/**
 * Page reducer: update application page status
 * @param {Immutable.Map} current state
 * @param {object} action
 * @return {Immutable.Map} next state
 */
export function page(state=Map(), action) {
	switch (action.type) {
  		case pageActionTypes.UPDATE_CURRENT_PAGE:
    		return state.setIn(['currentPage'], action.currentPage);
    	case pageActionTypes.UPDATE_PREVIOUS_PAGE:
    		return state.setIn(['previousPage'], action.previousPage);	
  		case pageActionTypes.UPDATE_NEXT_PAGE:
    		return state.setIn(['nextPage'], action.nextPage);
  		default:
    		return state;
  	}
}