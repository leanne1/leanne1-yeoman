import keymirror from 'keymirror';

<% if (hasRouter === true) { %>
/**
 * Page action types
 * 
 */
export const pageActionTypes = keymirror({
    'UPDATE_PREVIOUS_PAGE': null,
    'UPDATE_CURRENT_PAGE': null,
    'UPDATE_NEXT_PAGE': null
});
<% } %>

/**
 * foo action types
 * 
 */
export const fooActionTypes = keymirror({
    'UPDATE_FOO': null,
});