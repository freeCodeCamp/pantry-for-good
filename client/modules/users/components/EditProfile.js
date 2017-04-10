import React from 'react'
import { connect } from 'react-redux'
import { setProfile } from 'store/auth'

class EditProfile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            firstName: this.props.auth.user.firstName,
            lastName: this.props.auth.user.lastName,
            email: this.props.auth.user.email,
            username: this.props.auth.user.username,
        }
    }

    onFieldChange = e => {
        const { name, value } = e.target
        this.setState({ [name]: value })
    }

    onSubmit = (e) => {
        e.preventDefault()
        this.props.setProfile({...this.props.auth.user,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
            username: this.state.username,
        })
    }

    render = () =>
        <section className="row">
            <h3 className="col-md-12 text-center">Edit your profile</h3>
            <div className="col-xs-offset-2 col-xs-8 col-md-offset-5 col-md-2">
                <form name="userForm" className="signin form-horizontal" autoComplete="off">
                    <fieldset>
                        <div className="form-group">
                            <label htmlFor="firstName">First Name</label>
                            <input type="text" id="firstName" name="firstName" value={this.state.firstName} onChange={this.onFieldChange} className="form-control" placeholder="First Name" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName">Last Name</label>
                            <input type="text" id="lastName" name="lastName" value={this.state.lastName} onChange={this.onFieldChange} className="form-control" data-ng-model="$ctrl.user.lastName" placeholder="Last Name" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" name="email" value={this.state.email} onChange={this.onFieldChange} className="form-control" placeholder="Email" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input type="text" id="username" name="username" value={this.state.username} onChange={this.onFieldChange} className="form-control" placeholder="Username" />
                        </div>
                        <div className="text-center form-group">
                            <button onClick={this.onSubmit} type="submit" className="btn btn-large btn-primary">Save Profile</button>
                        </div>
                        { this.props.auth.success &&
                            <div className="text-center text-success">
                                <strong>Profile Saved Successfully</strong>
                            </div>
                        }
                        { this.props.auth.error &&
                            <div className="text-center text-danger">
                                <strong>{this.props.auth.error}</strong>
                            </div>
                        }
                    </fieldset>
                </form>
            </div>
        </section>

}

const mapStateToProps = (state) => ({
    auth: state.auth,
})

const mapDispatchToProps = (dispatch) => ({
    setProfile: user => dispatch(setProfile(user))
})

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile)
