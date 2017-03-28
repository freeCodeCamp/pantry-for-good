import React from 'react'
import { connect } from 'react-redux'
import { signUp } from 'store/auth'

class SignUp extends React.Component {
    constructor(props) {
        super(props)
        this.redirectIfAlreadySignedIn(this.props)
        this.state = {
            accountTypeInputValue: undefined,
            firstNameInputValue: "",
            lastNameInputValue: "",
            emailInputValue: "",
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

    onFirstNameChange = (e) => {
        this.setState({ firstNameInputValue: e.target.value })
    }

    onLastNameChange = (e) => {
        this.setState({ lastNameInputValue: e.target.value })
    }

    onEmailChange = (e) => {
        this.setState({ emailInputValue: e.target.value })
    }

    onUsernameChange = (e) => {
        this.setState({ usernameInputValue: e.target.value })
    }

    onPasswordChange = (e) => {
        this.setState({ passwordInputValue: e.target.value })
    }

    radioButtonChange = (e) => {
        this.setState({ accountTypeInputValue: e.target.value })
    }

    onSubmit = (e) => {
        e.preventDefault()
        this.props.signUp({
            "accountType": this.state.accountTypeInputValue,
            "firstName": this.state.firstNameInputValue,
            "lastName": this.state.lastNameInputValue,
            "email": this.state.emailInputValue,
            "username": this.state.usernameInputValue,
            "password": this.state.passwordInputValue
        })
    }

    componentWillReceiveProps = (nextProps) => {
        this.redirectIfAlreadySignedIn(nextProps)
    }

    render = () =>
        <div className="register-box">
            <div className="register-logo">
                <foodbank-logo><img alt="Foodbank Templated" src="media/logo.png" /></foodbank-logo>
            </div>
            <div className="register-box-body">
                <h4 className="login-box-msg">Register a new membership</h4>
                <div className="box">
                    <form name="userForm" autoComplete="off">
                        <div className="form-group">
                            <label>Please select an account to create</label>
                            <div>
                                <label className="radio-inline">
                                    <input name="account-type" type="radio" value="customer" checked={this.state.accountTypeInputValue === 'customer'} onChange={this.radioButtonChange} required="required" />Client
                                </label>
                                <label className="radio-inline">
                                    <input name="account-type" type="radio" value="volunteer" checked={this.state.accountTypeInputValue === 'volunteer'} onChange={this.radioButtonChange} required="required" />Volunteer
                                </label>
                                <label className="radio-inline">
                                    <input name="account-type" type="radio" value="donor" checked={this.state.accountTypeInputValue === 'donor'} onChange={this.radioButtonChange} required="required" />Donor
                                    </label>
                            </div>
                        </div>
                        <div className="form-group">
                            <input type="text" onChange={this.onFirstNameChange} value={this.state.firstNameInputValue} className="form-control" placeholder="First Name" required="" style={{ backgroundImage: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABHklEQVQ4EaVTO26DQBD1ohQWaS2lg9JybZ+AK7hNwx2oIoVf4UPQ0Lj1FdKktevIpel8AKNUkDcWMxpgSaIEaTVv3sx7uztiTdu2s/98DywOw3Dued4Who/M2aIx5lZV1aEsy0+qiwHELyi+Ytl0PQ69SxAxkWIA4RMRTdNsKE59juMcuZd6xIAFeZ6fGCdJ8kY4y7KAuTRNGd7jyEBXsdOPE3a0QGPsniOnnYMO67LgSQN9T41F2QGrQRRFCwyzoIF2qyBuKKbcOgPXdVeY9rMWgNsjf9ccYesJhk3f5dYT1HX9gR0LLQR30TnjkUEcx2uIuS4RnI+aj6sJR0AM8AaumPaM/rRehyWhXqbFAA9kh3/8/NvHxAYGAsZ/il8IalkCLBfNVAAAAABJRU5ErkJggg==)', backgroundRepeat: 'no-repeat', backgroundAttachment: 'scroll', backgroundSize: '16px 18px', backgroundPosition: '98% 50%' }} />
                        </div>
                        <div className="form-group">
                            <input type="text" onChange={this.onLastNameChange} value={this.state.LastNameInputValue} className="form-control" placeholder="Last Name" required="" />
                        </div>
                        <div className="form-group">
                            <input type="email" onChange={this.onEmailChange} value={this.state.emailInputValue} className="form-control" placeholder="Email" required="" />
                        </div>
                        <div className="form-group">
                            <input type="text" onChange={this.onUsernameChange} value={this.state.usernameInputValue} className="form-control" placeholder="Username" required="" />
                        </div>
                        <div className="form-group">
                            <input type="password" onChange={this.onPasswordChange} value={this.state.passwordInputValue} className="form-control" placeholder="Password" required="" style={{ backgroundImage: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACIUlEQVQ4EX2TOYhTURSG87IMihDsjGghBhFBmHFDHLWwSqcikk4RRKJgk0KL7C8bMpWpZtIqNkEUl1ZCgs0wOo0SxiLMDApWlgOPrH7/5b2QkYwX7jvn/uc//zl3edZ4PPbNGvF4fC4ajR5VrNvt/mo0Gr1ZPOtfgWw2e9Lv9+chX7cs64CS4Oxg3o9GI7tUKv0Q5o1dAiTfCgQCLwnOkfQOu+oSLyJ2A783HA7vIPLGxX0TgVwud4HKn0nc7Pf7N6vV6oZHkkX8FPG3uMfgXC0Wi2vCg/poUKGGcagQI3k7k8mcp5slcGswGDwpl8tfwGJg3xB6Dvey8vz6oH4C3iXcFYjbwiDeo1KafafkC3NjK7iL5ESFGQEUF7Sg+ifZdDp9GnMF/KGmfBdT2HCwZ7TwtrBPC7rQaav6Iv48rqZwg+F+p8hOMBj0IbxfMdMBrW5pAVGV/ztINByENkU0t5BIJEKRSOQ3Aj+Z57iFs1R5NK3EQS6HQqF1zmQdzpFWq3W42WwOTAf1er1PF2USFlC+qxMvFAr3HcexWX+QX6lUvsKpkTyPSEXJkw6MQ4S38Ljdbi8rmM/nY+CvgNcQqdH6U/xrYK9t244jZv6ByUOSiDdIfgBZ12U6dHEHu9TpdIr8F0OP692CtzaW/a6y3y0Wx5kbFHvGuXzkgf0xhKnPzA4UTyaTB8Ph8AvcHi3fnsrZ7Wore02YViqVOrRXXPhfqP8j6MYlawoAAAAASUVORK5CYII=)', backgroundRepeat: 'no-repeat', backgroundAttachment: 'scroll', backgroundSize: '16px 18px', backgroundPosition: '98% 50%' }} />
                        </div>
                        <div className="text-center form-group">
                            <button type="submit" className="btn btn-flat btn-primary" onClick={this.onSubmit}>Sign up</button>&nbsp; or&nbsp;
                            <a href="/#!/signin">Sign  in</a>
                        </div>
                        <div className="text-center text-danger">
                            <strong>{this.props.auth.signupError}</strong>
                        </div>
                    </form>
                    {this.props.auth.fetching &&
                        <div className="overlay">
                            <i className="fa fa-refresh fa-spin"></i>
                        </div>
                    }
                </div>
            </div>
        </div>
}

const mapStateToProps = (state) => ({
    auth: state.auth,
})

const mapDispatchToProps = (dispatch) => ({
    signUp: (user) => {
        dispatch(signUp(user))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(SignUp)
