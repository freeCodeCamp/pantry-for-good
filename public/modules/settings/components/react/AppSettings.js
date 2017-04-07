import React from 'react'
import { connect } from 'react-redux'
import { saveSettings } from 'store/settings'

class AppSettings extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            clientIntakeNumber: this.props.data ? this.props.data.clientIntakeNumber : "",
            foodBankCity: this.props.data ? this.props.data.foodBankCity : "",
            instructions: this.props.data ? this.props.data.instructions : "",
            mission: this.props.data ? this.props.data.mission : "",
            organization: this.props.data ? this.props.data.organization : "",
            supportNumber: this.props.data ? this.props.data.supportNumber : "",
            thanks: this.props.data ? this.props.data.thanks : "",
            url: this.props.data ? this.props.data.url : ""
        }
    }

    onFieldChange = e => {
        const { name, value } = e.target
        this.setState({ [name]: value }, () => console.dir(this.state))
    }

    onSubmit = e => {
        e.preventDefault()
        this.props.saveSettings({
            clientIntakeNumber: this.state.clientIntakeNumber,
            foodBankCity: this.state.foodBankCity,
            instructions: this.state.instructions,
            mission: this.state.mission,
            organization: this.state.organization,
            supportNumber: this.state.supportNumber,
            thanks: this.state.thanks,
            url: this.state.url,
            _id: this.props.data._id
        })
    }

    componentWillReceiveProps = nextProps => {
        this.setState({
            clientIntakeNumber: nextProps.data ? nextProps.data.clientIntakeNumber : "",
            foodBankCity: nextProps.data ? nextProps.data.foodBankCity : "",
            instructions: nextProps.data ? nextProps.data.instructions : "",
            mission: nextProps.data ? nextProps.data.mission : "",
            organization: nextProps.data ? nextProps.data.organization : "",
            supportNumber: nextProps.data ? nextProps.data.supportNumber : "",
            thanks: nextProps.data ? nextProps.data.thanks : "",
            url: nextProps.data ? nextProps.data.url : ""
        })
    }

    render = () =>
        <section className="change-settings content">
            <div className="box box-solid box-primary">
                <div className="box-header">
                    <h3 className="box-title">CHANGE SETTINGS</h3>
                </div>

                <div className="box-body">
                    <div className="row">
                        <div className="col-lg-3">
                            <div className="form-group">
                                <label>Organization</label>
                                <input name="organization"
                                    type="text"
                                    id="organization"
                                    onChange={this.onFieldChange}
                                    value={this.state.organization}
                                    className="form-control"
                                    required />
                            </div>
                        </div>
                        <div className="clearfix visible-sm-block visible-md-block"></div>
                        <div className="col-lg-2">
                            <div className="form-group">
                                <label>URL</label>
                                <input name="url"
                                    type="text"
                                    id="url"
                                    onChange={this.onFieldChange}
                                    value={this.state.url}
                                    className="form-control"
                                    required />
                            </div>
                        </div>
                        <div className="clearfix visible-sm-block visible-md-block"></div>
                        <div className="col-lg-2">
                            <div className="form-group">
                                <label>City</label>
                                <input name="foodBankCity"
                                    type="text"
                                    id="foodBankCity"
                                    onChange={this.onFieldChange}
                                    value={this.state.foodBankCity}
                                    className="form-control"
                                    required />
                            </div>
                        </div>
                        <div className="col-lg-2">
                            <div className="form-group">
                                <label>Client intake number</label>
                                <input name="clientIntakeNumber"
                                    type="text"
                                    id="clientIntakeNumber"
                                    onChange={this.onFieldChange}
                                    value={this.state.clientIntakeNumber}
                                    className="form-control"
                                    required />
                            </div>
                        </div>
                        <div className="clearfix visible-sm-block visible-md-block"></div>
                        <div className="col-lg-3">
                            <div className="form-group">
                                <label>Support number</label>
                                <input name="supportNumber"
                                    type="text"
                                    id="supportNumber"
                                    onChange={this.onFieldChange}
                                    value={this.state.supportNumber}
                                    className="form-control"
                                    required />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-6">
                            <div className="form-group">
                                <label>Mission</label>
                                <textarea name="mission"
                                    id="mission"
                                    onChange={this.onFieldChange}
                                    value={this.state.mission}
                                    className="form-control"
                                    rows="5" />
                            </div>
                        </div>
                        <div className="clearfix visible-sm-block visible-md-block"></div>
                        <div className="col-lg-6">
                            <div className="form-group">
                                <label>Instructions to clients</label>
                                <textarea name="instructions"
                                    id="instructions"
                                    onChange={this.onFieldChange}
                                    value={this.state.instructions}
                                    className="form-control"
                                    rows="5" />
                            </div>
                        </div>
                        <div className="clearfix"></div>
                        <div className="col-lg-6">
                            <div className="form-group">
                                <label>Thank you to donors</label>
                                <textarea name="thanks"
                                    id="thanks"
                                    onChange={this.onFieldChange}
                                    value={this.state.thanks}
                                    className="form-control"
                                    rows="5" />
                            </div>
                        </div>
                        <div className="clearfix visible-sm-block visible-md-block"></div>
                        <div className="col-lg-6">
                            <div className="form-group">
                                <label>Other</label>
                                <textarea name="other"
                                    id="other"
                                    className="form-control"
                                    rows="5"
                                    placeholder="For later use" />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-6 col-md-4 col-lg-2">
                            <button onClick={this.onSubmit} className="btn btn-success btn-block top-buffer">Save Changes</button>
                        </div>
                        <div className="col-sm-6 col-md-4 col-lg-2">
                            <a href="/#!" className="btn btn-primary btn-block top-buffer">Cancel</a>
                        </div>
                        <div className="col-sm-6 col-md-4 col-lg-2">
                            <div>&nbsp;</div>
                            <div className="text-danger"><strong>{this.props.error}</strong></div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
}

const mapStateToProps = state => ({
    data: state.settings.data,
    error: state.settings.error
})

const mapDispatchToProps = dispatch => ({
    saveSettings: settings => dispatch(saveSettings(settings))
})

export default connect(mapStateToProps, mapDispatchToProps)(AppSettings)
