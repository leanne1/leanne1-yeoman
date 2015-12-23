import { Route } from 'react-router';
import history from './history'
import { App } from '../components';

export default (
	<Route path='/' history={history} component={App}>
	</Route>
);