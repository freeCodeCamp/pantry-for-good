import React from 'react'
import { connect } from 'react-redux'
import {stateGo} from 'redux-ui-router'

import { signIn } from 'store/auth'

import FoodbankLogo from '../../../common/components/FoodbankLogo'

class SignIn extends React.Component {
    constructor(props) {
        super(props)
        this.redirectIfAlreadySignedIn(this.props)
        this.state = {
            username: "",
            password: ""
        }
    }

    redirectIfAlreadySignedIn(props) {
        if (props.auth && props.auth.user && props.auth.user._id) {
            props.push('root')
        }
    }

    onFieldChange = e => {
        const {name, value} = e.target
        this.setState({ [name]: value })
    }

    onSubmit = (e) => {
        e.preventDefault()
        this.props.signIn(this.state.username, this.state.password)
        this.setState({password: ""})
    }

    componentWillReceiveProps = (nextProps) => {
        this.redirectIfAlreadySignedIn(nextProps)
    }

    render = () =>
        <section className="content">
            <div className="login-box">
                <div className="login-logo">
                    <FoodbankLogo />
                </div>
                <div className="login-box-body">
                    <p className="login-box-msg">Sign in to start your session</p>
                    <form name="loginForm" autoComplete="off">
                        <div className="form-group has-feedback">
                            <input type="text" className="form-control"
                                name="username"
                                placeholder="Username" value={this.state.username}
                                onChange={this.onFieldChange} />
                            <span className="glyphicon glyphicon-user form-control-feedback"></span>
                        </div>
                        <div className="form-group has-feedback">
                            <input type="password" className="form-control"
                                name="password"
                                placeholder="Password" value={this.state.password}
                                onChange={this.onFieldChange} />
                            <span className="glyphicon glyphicon-lock form-control-feedback"></span>
                        </div>
                        <div className="pull-right form-group">
                            <button className="btn btn-primary btn-flat" onClick={this.onSubmit}>Sign in</button>&nbsp; or&nbsp;
                <a href="/#!/signup">Sign up</a>
                        </div>
                        <div className="form-group">
                            <a href="/#!/password/forgot">Forgot your password?</a>
                        </div>
                        <br />
                        <div className="text-center text-danger">
                            <strong>{this.props.auth.signinError}</strong>
                        </div>
                    </form>
                </div>
            </div>
            {this.props.auth.fetching &&
                <div className="overlay">
                    <i className="fa fa-refresh fa-spin"></i>
                </div>
            }
        </section>
}

const mapStateToProps = (state) => ({
    auth: state.auth,
})

const mapDispatchToProps = (dispatch) => ({
    signIn: (username, password) => {
        dispatch(signIn({ username, password }))
    },
    push: route => dispatch(stateGo(route))
})

export default connect(mapStateToProps, mapDispatchToProps)(SignIn)
