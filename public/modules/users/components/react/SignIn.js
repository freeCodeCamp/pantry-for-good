import React from 'react'
import { Provider, connect } from 'react-redux'
import { signIn } from 'store/auth'

class SignIn extends React.Component {
    constructor(props) {
        super(props)
        this.redirectIfAlreadySignedIn(this.props)
        this.state = {
            usernameInputValue: "",
            passwordInputValue: ""
        }
    }

    redirectIfAlreadySignedIn(props) {
        if (props.auth && props.auth.user && props.auth.user._id) {
            //TODO use a better redirection after a routing solution for react is implemented
            window.location.assign('/#!/')
        }
    }

    onUsernameChange = (e) => {
        this.setState({ usernameInputValue: e.target.value })
    }

    onPasswordChange = (e) => {
        this.setState({ passwordInputValue: e.target.value })
    }

    onSubmit = (e) => {
        e.preventDefault()
        this.props.signIn(this.state.usernameInputValue, this.state.passwordInputValue)
        this.setState({passwordInputValue: ""})
    }

    componentWillReceiveProps = (nextProps) => {
        this.redirectIfAlreadySignedIn(nextProps)
    }

    render = () =>
        <Provider store={this.props.store}>
            <div className="box">
                <div className="login-box">
                    <div className="login-logo">
                        <foodbank-logo><img alt="Foodbank Logo" src="media/logo.png" /></foodbank-logo>
                    </div>
                    <div className="login-box-body">
                        <p className="login-box-msg">Sign in to start your session</p>
                        <form name="loginForm" autoComplete="off">
                            <div className="form-group has-feedback">
                                <input type="text" className="form-control" placeholder="Username" value={this.state.usernameInputValue}
                                    onChange={this.onUsernameChange} />
                                <span className="glyphicon glyphicon-user form-control-feedback"></span>
                            </div>
                            <div className="form-group has-feedback">
                                <input type="password" className="form-control" placeholder="Password" value={this.state.passwordInputValue}
                                    onChange={this.onPasswordChange} />
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
            </div>
        </Provider>

}

const mapStateToProps = (state) => ({
    auth: state.auth,
})

const mapDispatchToProps = (dispatch) => ({
    signIn: (username, password) => {
        dispatch(signIn({ username, password }))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(SignIn)
