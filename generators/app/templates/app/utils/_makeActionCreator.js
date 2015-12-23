/**
 * Generates an action creator function to reduce boilerplate in actionCreators
 * @param {const} action type the action creator passes to the reducer
 * @param {spread} Any other arguments the action creator passes to the reducer
 * @returns {function} the action creator
 * @exports makeActionCreator
 */
export default function makeActionCreator(type, ...argNames) {
	return function(...args) {
		let action = { type };
		argNames.forEach((arg, index) => {
			action[argNames[index]] = args[index];
		});
		return action;
	};
}