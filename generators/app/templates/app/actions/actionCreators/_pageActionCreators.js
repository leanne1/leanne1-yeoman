import makeActionCreator from '../../utils/makeActionCreator';
import { pageActionTypes } from '../actionTypes';

// PAGE ACTION CREATORS

/**
 * Create an action creator that sets the name of the previous active page
 * @constant 
 * @type {function} updatePreviousPage action creator
 */
export const updatePreviousPage = makeActionCreator(pageActionTypes.UPDATE_PREVIOUS_PAGE, 'previousPage');

/**
 * Create an action creator that sets the name of the currently active page
 * @constant 
 * @type {function} updateCurrentPage action creator
 */
export const updateCurrentPage = makeActionCreator(pageActionTypes.UPDATE_CURRENT_PAGE, 'currentPage');

/**
 * Create an action creator that sets the name of the next page to transition to
 * @constant 
 * @type {function} updateNextPage action creator
 */
export const updateNextPage = makeActionCreator(pageActionTypes.UPDATE_NEXT_PAGE, 'nextPage');
