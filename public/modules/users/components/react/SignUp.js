import React from 'react'
import { connect } from 'react-redux'
import {stateGo} from 'redux-ui-router'

import { signUp } from 'store/auth'

import FoodbankLogo from '../../../common/components/FoodbankLogo'

class SignUp extends React.Component {
    constructor(props) {
        super(props)
        this.redirectIfAlreadySignedIn(this.props)
        this.state = {
            accountType: undefined,
            firstName: "",
            lastName: "",
            email: "",
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
        this.props.signUp({
            "accountType": this.state.accountType,
            "firstName": this.state.firstName,
            "lastName": this.state.lastName,
            "email": this.state.email,
            "username": this.state.username,
            "password": this.state.password
        })
    }

    componentWillReceiveProps = (nextProps) => {
        this.redirectIfAlreadySignedIn(nextProps)
    }

    render = () =>
    <section className="content">
        <div className="register-box">
            <div className="register-logo">
                <FoodbankLogo />
            </div>
            <div className="register-box-body">
                <h4 className="login-box-msg">Register a new membership</h4>
                <div className="box">
                    <form name="userForm" autoComplete="off">
                        <div className="form-group">
                            <label>Please select an account to create</label>
                            <div>
                                <label className="radio-inline">
                                    <input name="accountType" type="radio" value="customer" checked={this.state.accountType === 'customer'} onChange={this.onFieldChange} required="required" />Client
                                </label>
                                <label className="radio-inline">
                                    <input name="accountType" type="radio" value="volunteer" checked={this.state.accountType === 'volunteer'} onChange={this.onFieldChange} required="required" />Volunteer
                                </label>
                                <label className="radio-inline">
                                    <input name="accountType" type="radio" value="donor" checked={this.state.accountType === 'donor'} onChange={this.onFieldChange} required="required" />Donor
                                    </label>
                            </div>
                        </div>
                        <div className="form-group">
                            <input type="text" name="firstName" onChange={this.onFieldChange} value={this.state.firstName} className="form-control" placeholder="First Name" required="" style={{ backgroundImage: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABHklEQVQ4EaVTO26DQBD1ohQWaS2lg9JybZ+AK7hNwx2oIoVf4UPQ0Lj1FdKktevIpel8AKNUkDcWMxpgSaIEaTVv3sx7uztiTdu2s/98DywOw3Dued4Who/M2aIx5lZV1aEsy0+qiwHELyi+Ytl0PQ69SxAxkWIA4RMRTdNsKE59juMcuZd6xIAFeZ6fGCdJ8kY4y7KAuTRNGd7jyEBXsdOPE3a0QGPsniOnnYMO67LgSQN9T41F2QGrQRRFCwyzoIF2qyBuKKbcOgPXdVeY9rMWgNsjf9ccYesJhk3f5dYT1HX9gR0LLQR30TnjkUEcx2uIuS4RnI+aj6sJR0AM8AaumPaM/rRehyWhXqbFAA9kh3/8/NvHxAYGAsZ/il8IalkCLBfNVAAAAABJRU5ErkJggg==)', backgroundRepeat: 'no-repeat', backgroundAttachment: 'scroll', backgroundSize: '16px 18px', backgroundPosition: '98% 50%' }} />
                        </div>
                        <div className="form-group">
                            <input type="text" name="lastName" onChange={this.onFieldChange} value={this.state.LastName} className="form-control" placeholder="Last Name" required="" />
                        </div>
                        <div className="form-group">
                            <input type="email" name="email" onChange={this.onFieldChange} value={this.state.email} className="form-control" placeholder="Email" required="" />
                        </div>
                        <div className="form-group">
                            <input type="text" name="username" onChange={this.onFieldChange} value={this.state.username} className="form-control" placeholder="Username" required="" />
                        </div>
                        <div className="form-group">
                            <input type="password" name="password" onChange={this.onFieldChange} value={this.state.password} className="form-control" placeholder="Password" required="" style={{ backgroundImage: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACIUlEQVQ4EX2TOYhTURSG87IMihDsjGghBhFBmHFDHLWwSqcikk4RRKJgk0KL7C8bMpWpZtIqNkEUl1ZCgs0wOo0SxiLMDApWlgOPrH7/5b2QkYwX7jvn/uc//zl3edZ4PPbNGvF4fC4ajR5VrNvt/mo0Gr1ZPOtfgWw2e9Lv9+chX7cs64CS4Oxg3o9GI7tUKv0Q5o1dAiTfCgQCLwnOkfQOu+oSLyJ2A783HA7vIPLGxX0TgVwud4HKn0nc7Pf7N6vV6oZHkkX8FPG3uMfgXC0Wi2vCg/poUKGGcagQI3k7k8mcp5slcGswGDwpl8tfwGJg3xB6Dvey8vz6oH4C3iXcFYjbwiDeo1KafafkC3NjK7iL5ESFGQEUF7Sg+ifZdDp9GnMF/KGmfBdT2HCwZ7TwtrBPC7rQaav6Iv48rqZwg+F+p8hOMBj0IbxfMdMBrW5pAVGV/ztINByENkU0t5BIJEKRSOQ3Aj+Z57iFs1R5NK3EQS6HQqF1zmQdzpFWq3W42WwOTAf1er1PF2USFlC+qxMvFAr3HcexWX+QX6lUvsKpkTyPSEXJkw6MQ4S38Ljdbi8rmM/nY+CvgNcQqdH6U/xrYK9t244jZv6ByUOSiDdIfgBZ12U6dHEHu9TpdIr8F0OP692CtzaW/a6y3y0Wx5kbFHvGuXzkgf0xhKnPzA4UTyaTB8Ph8AvcHi3fnsrZ7Wore02YViqVOrRXXPhfqP8j6MYlawoAAAAASUVORK5CYII=)', backgroundRepeat: 'no-repeat', backgroundAttachment: 'scroll', backgroundSize: '16px 18px', backgroundPosition: '98% 50%' }} />
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
        </section>
}

const mapStateToProps = (state) => ({
    auth: state.auth,
})

const mapDispatchToProps = (dispatch) => ({
    signUp: (user) => {
        dispatch(signUp(user))
    },
    push: route => dispatch(stateGo(route))
})

export default connect(mapStateToProps, mapDispatchToProps)(SignUp)
