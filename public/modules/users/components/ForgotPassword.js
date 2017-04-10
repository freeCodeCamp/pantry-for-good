import React from 'react'
import { connect } from 'react-redux'
import { stateGo } from 'redux-ui-router'

import { forgotPassword } from 'store/auth'

class ForgotPassword extends React.Component {
    constructor(props) {
        super(props)
        this.redirectIfAlreadySignedIn(this.props)
        this.state = {
            username: ""
        }
    }

    redirectIfAlreadySignedIn(props) {
        if (props.auth && props.auth.user && props.auth.user._id) {
            props.push('root')
        }
    }

    onFieldChange = e => {
        const { name, value } = e.target
        this.setState({ [name]: value })
    }

    onSubmit = e => {
        e.preventDefault()
        this.props.resetPassword(this.state.username)
    }

    componentWillReceiveProps = nextProps => {
        this.redirectIfAlreadySignedIn(nextProps)
    }

    render = () =>
        <section className="row">
            <h3 className="col-md-12 text-center">Restore your password</h3>
            <p className="small text-center">Enter your account username.</p>
            <div className="col-xs-offset-2 col-xs-8 col-md-offset-5 col-md-2">
                <form className="signin form-horizontal" autoComplete="off">
                    <fieldset>
                        <div className="form-group">
                            <input type="text" onChange={this.onFieldChange} id="username" name="username" className="form-control" placeholder="Username" />
                        </div>
                        <div className="text-center form-group">
                            <button type="submit" onClick={this.onSubmit} disabled={this.state.username.trim() === ""} className="btn btn-primary">Submit</button>
                        </div>
                        <div className="text-center text-danger">
                            <strong>{this.props.auth.error}</strong>
                        </div>
                        <div className="text-center text-success">
                            <strong>{this.props.auth.success && this.props.auth.success.message}</strong>
                        </div>
                    </fieldset>
                </form>
            </div>
        </section>
}

const mapStateToProps = state => ({
    auth: state.auth,
})

const mapDispatchToProps = dispatch => ({
    resetPassword: username => dispatch(forgotPassword({ username })),
    push: route => dispatch(stateGo(route))
})

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword)
