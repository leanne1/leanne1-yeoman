import makeActionCreator from '../../utils/makeActionCreator';
import { fooActionTypes } from '../actionTypes';

/**
 * Create an action creator that updates foo
 * @constant 
 * @type {function} updateFoo action creator
 */
export const updateFoo = makeActionCreator(fooActionTypes.UPDATE_FOO, 'foo');