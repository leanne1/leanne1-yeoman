import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { pushState } from 'redux-router';
import { pageActions } from '../../actions/';

export class FooPage extends Component { 
    static propTypes = {
        pageActions: React.PropTypes.object.isRequired,
        pushState: React.PropTypes.func.isRequired,
    }
    constructor(props) {
        super(props);
        this.pageName = 'FooPage';
    }
    componentWillMount() {
        this.props.pageActions.updateCurrentPage(this.pageName);
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
        pageActions: bindActionCreators(pageActions, dispatch),
        pushState: bindActionCreators(pushState, dispatch),
    };
}

// Make redux-react binding
export default connect(mapStateToProps, mapDispatchToProps)(FooPage);
