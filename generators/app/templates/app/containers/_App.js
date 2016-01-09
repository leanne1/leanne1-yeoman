import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fooActions } from '../actions/';

/**
 * Props that the container receives from redux state.
 */
const mapStateToProps = state => {
    return {

    };
};

/**
 * Action props that the container receives bound to redux dispatch
 */
const mapDispatchToProps = dispatch => {
    return {
        fooActions: bindActionCreators(fooActions, dispatch),
    };
};

@connect(mapStateToProps, mapDispatchToProps)
export default class App extends Component { 
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
