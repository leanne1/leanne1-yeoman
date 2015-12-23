import React, { Component } from 'react';

export default class App extends Component { 
	static propTypes = {
		children: React.PropTypes.node
	}
	render() {
		const { children } = this.props;
		return (
			<div>
				{ children }
			</div>
		);
	}
}