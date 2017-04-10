import React from 'react'
import { connect } from 'react-redux'
import { setPassword } from 'store/auth'

class ChangePassword extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentPassword: "",
            newPassword: "",
            verifyPassword: ""
        }
    }

    onFieldChange = e => {
        const { name, value } = e.target
        this.setState({ [name]: value })
    }

    onSubmit = e => {
        e.preventDefault()
        this.props.changePassword(this.state.currentPassword, this.state.newPassword, this.state.verifyPassword)
    }

    render = () =>
        <section className="row">
            <h3 className="col-md-12 text-center">Change your password</h3>
            <div className="col-xs-offset-2 col-xs-8 col-md-offset-5 col-md-2">
                <form className="signin form-horizontal" autoComplete="off">
                    <fieldset>
                        <div className="form-group">
                            <label htmlFor="currentPassword">Current Password</label>
                            <input type="password" onChange={this.onFieldChange} value={this.state.currentPassword} id="currentPassword" name="currentPassword" className="form-control" placeholder="Current Password" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="newPassword">New Password</label>
                            <input type="password" onChange={this.onFieldChange} value={this.state.newPassword} id="newPassword" name="newPassword" className="form-control" placeholder="New Password" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="verifyPassword">Verify Password</label>
                            <input type="password" onChange={this.onFieldChange} value={this.state.verifyPassword} id="verifyPassword" name="verifyPassword" className="form-control" placeholder="Verify Password" />
                        </div>
                        <div className="text-center form-group">
                            <button onClick={this.onSubmit} className="btn btn-large btn-primary">Save Password</button>
                        </div>
                        <div className="text-center text-success">
                            <strong>{this.props.auth && this.props.auth.success && this.props.auth.success.message}</strong>
                        </div>
                        <div className="text-center text-danger">
                            <strong>{this.props.auth && this.props.auth.error}</strong>
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
    changePassword: (currentPassword, newPassword, verifyPassword) => {
        dispatch(setPassword({ currentPassword, newPassword, verifyPassword }))
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword)
