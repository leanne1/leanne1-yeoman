import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fooActions } from '../actions/';

export class App extends Component { 
    static propTypes = {
        fooActions: React.PropTypes.object.isRequired
    }
    constructor(props) {
        super(props);
    }
    render() {
        const {} = this.props;
        return (
            <main role="main">
                <h1></h1>
            </main>
        );
    }
}

/**
 * Props that the container receives from redux state.
 */
function mapStateToProps() {
    return {};
}

/**
 * Action props that the container receives bound to redux dispatch
 */
function mapDispatchToProps(dispatch) {
    return {
        fooActions: bindActionCreators(fooActions, dispatch),
    };
}

// Make redux-react binding
export default connect(mapStateToProps, mapDispatchToProps)(App);
