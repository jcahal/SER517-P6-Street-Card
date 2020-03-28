import React from 'react';
import 'antd/dist/antd.css';
import './index.css';
import {Button, Cascader, Checkbox, Col, Collapse, DatePicker, Form, Input, Layout, Row, TimePicker} from 'antd';
import Header from "./Header";
import StreetCardFooter from './StreetCardFooter'
import SiderComponent from './component/SiderComponent'


const serviceProvider = [
    {
        value: "FP",
        label: "Food Pantry"
    },
    {
        value: "DIC",
        label: "Drop in Centre"
    },
    {
        value: "SH",
        label: "Shelter Home"
    },
    {
        value: "SK",
        label: "Soup Kitchen"
    }
];

const {Content, Sider} = Layout;
const {Panel} = Collapse;
const gridStyle = {
    width: '25%',
    textAlign: 'center',
};


class SetAppointments extends React.Component {


    constructor(props) {
        super(props);
        console.log(this.props.homelessPersonId);
        this.state = {
            items: {},
            checked: false,
            email: null,
            isLoaded: false,
        }
        this.handleSuccessfulLogoutAction = this.handleSuccessfulLogoutAction.bind(this);
        this.setPagecomponent = this.setPagecomponent.bind(this);
    }


    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                var appointmentRequestObject = {};
                appointmentRequestObject.office = values.office;
                appointmentRequestObject.streetAddress1 = values.streetAddress1;
                appointmentRequestObject.streetAddress2 = values.streetAddress2;
                appointmentRequestObject.city = values.city;
                appointmentRequestObject.zipCode = values.zipCode;
                appointmentRequestObject.state = values.state;
                appointmentRequestObject.Date = values['DatePicker'].format('YYYY-MM-DD');
                appointmentRequestObject.Time = values['TimePicker'].format('hh:mm[:ss[.uuuuuu]]');
                appointmentRequestObject.serviceProvider = values.serviceProvider[0];
                appointmentRequestObject.personalId = this.props.homelessPersonId;
                appointmentRequestObject.alert = this.state.checked;
                appointmentRequestObject.Email = this.state.email;
                if (this.state.email == null) {
                    appointmentRequestObject.Email = ""
                }
                fetch('http://localhost:8000/homeless/' + this.props.homelessPersonId + '/appointment/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(appointmentRequestObject)
                })
                    .then(res => res.json())
                    .then(json => {
                        this.props.history.push('/socialWorkerRegister');
                    });
            }

        });
    }

    componentDidMount() {
        fetch('http://127.0.0.1:8000/homeless/' + this.props.homelessPersonId + '/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
        })
            .then(res => res.json())
            .then(json => {
                console.log(json)
                this.setState({
                        isLoaded: true,
                        alert: false,
                        items: json
                    }
                )
            })
        console.log(this.items);

    }

    handleSuccessfulLogoutAction() {
        this.props.handleLogout();
        this.props.history.push('/login');
    }


    setPagecomponent(pageComponentValue) {
        this.props.updatePageComponent(pageComponentValue)
        this.props.history.push('/socialWorkerRegister');
    };


    onChange = e => {
        console.log('checked = ', e.target.checked);
        this.setState({
            checked: e.target.checked,
        });
    };

    render() {
        const {items} = this.state;
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        };

        const config = {
            rules: [{type: 'object', required: true, message: 'Please select time!'}],
        };
        if (items.Email != null) {
            this.state.email = items.Email;
            return (
                <Layout className="layout">
                    <Header
                        handleSuccessfulLogoutAction={this.handleSuccessfulLogoutAction}
                        loggedInStatus={this.props.loggedInStatus}
                    />
                    <Layout>
                        <SiderComponent
                            setPagecomponent={this.setPagecomponent}
                        />
                        <Content className="content-enroll">
                            <div className="site-layout-content-homeless">
                                <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                                    <Collapse accordion style={{backgroundColor: "#f0f9ff"}}>
                                        <Panel header="Client Details" key="1">
                                            <Row gutter={8}>
                                                <Col span={8}>

                                                    <Form.Item label="Personal Id">

                                                        <Input defaultValue={items.PersonalId} disabled={true}/>

                                                    </Form.Item>
                                                </Col>
                                                <Col span={8}>
                                                    <Form.Item label="First Name">
                                                        <Input defaultValue={items.FirstName} disabled={true}/>
                                                    </Form.Item>
                                                </Col>
                                                <Col span={8}>
                                                    <Form.Item label="Last Name">
                                                        <Input defaultValue={items.LastName} disabled={true}/>
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </Panel>
                                        <Panel header="Appointment Details" key="2">
                                            <Row gutter={8}>
                                                <Col span={8} push={1}>
                                                    <Form.Item>
                                                        {getFieldDecorator("serviceProvider", {
                                                            rules: [
                                                                {
                                                                    type: "array",
                                                                    required: true,
                                                                    message: "Please select your role!"
                                                                }
                                                            ]
                                                        })(<Cascader options={serviceProvider}
                                                                     placeholder="Service Provider"/>)}
                                                    </Form.Item>
                                                </Col>
                                                <Col span={8} push={1}>
                                                    <Form.Item>
                                                        {getFieldDecorator("office", {
                                                            rules: [
                                                                {
                                                                    message: "Please input the office!",
                                                                    whitespace: true
                                                                }
                                                            ]
                                                        })(<Input placeholder="Office Name"/>)}
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                            <Row gutter={8}>
                                                <Col span={8} push={1}>
                                                    <Form.Item className="register-ant-form-item">
                                                        {getFieldDecorator("streetAddress1", {
                                                            rules: [
                                                                {
                                                                    message: "Please input the streetAddress1!",
                                                                    whitespace: true
                                                                }
                                                            ]
                                                        })(<Input placeholder="Street Address 1"/>)}
                                                    </Form.Item>
                                                </Col>
                                                <Col span={8} push={1}>
                                                    <Form.Item className="register-ant-form-item">
                                                        {getFieldDecorator("streetAddress2", {
                                                            rules: [
                                                                {
                                                                    message: "Please input the streetAddress2!",
                                                                    whitespace: true
                                                                }
                                                            ]
                                                        })(<Input placeholder="Street Address 2"/>)}
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                            <Row gutter={8}>
                                                <Col span={8} push={1}>
                                                    <Form.Item className="register-ant-form-item">
                                                        {getFieldDecorator("city", {
                                                            rules: [
                                                                {
                                                                    message: "Please input the city!",
                                                                    whitespace: true
                                                                }
                                                            ]
                                                        })(<Input placeholder="City"/>)}
                                                    </Form.Item>
                                                </Col>
                                                <Col span={8} push={1}>
                                                    <Form.Item className="register-ant-form-item">
                                                        {getFieldDecorator("zipCode", {
                                                            rules: [
                                                                {
                                                                    message: "Please input the zipcode!",
                                                                    whitespace: true
                                                                }
                                                            ]
                                                        })(<Input placeholder="Zip Code"/>)}
                                                    </Form.Item>
                                                </Col>
                                                <Col span={8} push={1}>
                                                    <Form.Item className="register-ant-form-item">
                                                        {getFieldDecorator("state", {
                                                            rules: [
                                                                {
                                                                    message: "Please input the state!",
                                                                    whitespace: true
                                                                }
                                                            ]
                                                        })(<Input placeholder="State"/>)}
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col span={8} push={1}>
                                                    <Form.Item className="register-ant-form-item">
                                                        {getFieldDecorator('DatePicker', {
                                                            //  initialValue: this.state.homelessData.DOB ? moment(this.state.homelessData.DOB, 'YYYY/MM/DD') : moment("1993-06-28", 'YYYY/MM/DD'),
                                                            rules: [
                                                                {
                                                                    type: "object",
                                                                    required: true,
                                                                    message: "Please input your Date!"
                                                                }
                                                            ]
                                                        })(<DatePicker placeholder="Appointment Date"/>)}
                                                    </Form.Item>
                                                </Col>
                                                <Col span={8} push={1}>
                                                    <Form.Item className="register-ant-form-item">
                                                        {getFieldDecorator('TimePicker', {
                                                            //  initialValue: this.state.homelessData.DOB ? moment(this.state.homelessData.DOB, 'YYYY/MM/DD') : moment("1993-06-28", 'YYYY/MM/DD'),
                                                            rules: [
                                                                {
                                                                    type: "object",
                                                                    required: true,
                                                                    message: "Please input your Time!"
                                                                }
                                                            ]
                                                        })(<TimePicker placeholder="Time Date"/>)}
                                                    </Form.Item>
                                                </Col>
                                                <Col span={8} push={1}>
                                                    <Form.Item className="register-ant-form-item">
                                                        <Checkbox checked={this.state.checked} onChange={this.onChange}>Set
                                                            Alert</Checkbox>
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </Panel>
                                        <Panel style={{backgroundColor: "lightseagreen"}} header="Submit Form Here"
                                               key="3">
                                            <Row>
                                                <Col span={12}>
                                                    <p style={{padding: "2%"}}>


                                                        <Checkbox>
                                                            I acknowledge, the form is completed as per the inputs
                                                            provided
                                                            by the
                                                            client.
                                                        </Checkbox>

                                                    </p>
                                                </Col>
                                                <Col span={12}>
                                                    <Form.Item>
                                                        <Button type="primary" block htmlType="submit"
                                                                className="registration-submit-button">
                                                            Submit
                                                        </Button>
                                                    </Form.Item>
                                                </Col>
                                            </Row>

                                        </Panel>
                                    </Collapse>
                                </Form>
                            </div>
                        </Content>
                    </Layout>
                    <StreetCardFooter/>
                </Layout>
            );
        } else {
            return (
                <Layout className="layout">
                    <Header
                        handleSuccessfulLogoutAction={this.handleSuccessfulLogoutAction}
                        loggedInStatus={this.props.loggedInStatus}
                    />
                    <Layout>
                        <SiderComponent
                            setPagecomponent={this.setPagecomponent}
                        />
                        <Content className="content-enroll">
                            <div className="site-layout-content-homeless">
                                <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                                    <Collapse accordion style={{backgroundColor: "#f0f9ff"}}>
                                        <Panel header="Client Details" key="1">
                                            <Row gutter={8}>
                                                <Col span={8}>
                                                    <Form.Item label="Personal Id">
                                                        <Input defaultValue={items.PersonalId} disabled={true}/>
                                                    </Form.Item>
                                                </Col>
                                                <Col span={8}>
                                                    <Form.Item label="First Name">
                                                        <Input defaultValue={items.FirstName} disabled={true}/>
                                                    </Form.Item>
                                                </Col>
                                                <Col span={8}>
                                                    <Form.Item label="Last Name">
                                                        <Input defaultValue={items.LastName} disabled={true}/>
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </Panel>
                                        <Panel header="Appointment Details" key="2">
                                            <Row gutter={8}>
                                                <Col span={8} push={1}>
                                                    <Form.Item>
                                                        {getFieldDecorator("serviceProvider", {
                                                            rules: [
                                                                {
                                                                    type: "array",
                                                                    required: true,
                                                                    message: "Please select your role!"
                                                                }
                                                            ]
                                                        })(<Cascader options={serviceProvider}
                                                                     placeholder="Service Provider"/>)}
                                                    </Form.Item>
                                                </Col>
                                                <Col span={8} push={1}>
                                                    <Form.Item>
                                                        {getFieldDecorator("office", {
                                                            rules: [
                                                                {
                                                                    message: "Please input the office!",
                                                                    whitespace: true
                                                                }
                                                            ]
                                                        })(<Input placeholder="Office Name"/>)}
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                            <Row gutter={8}>
                                                <Col span={8} push={1}>
                                                    <Form.Item className="register-ant-form-item">
                                                        {getFieldDecorator("streetAddress1", {
                                                            rules: [
                                                                {
                                                                    message: "Please input the streetAddress1!",
                                                                    whitespace: true
                                                                }
                                                            ]
                                                        })(<Input placeholder="Street Address 1"/>)}
                                                    </Form.Item>
                                                </Col>
                                                <Col span={8} push={1}>
                                                    <Form.Item className="register-ant-form-item">
                                                        {getFieldDecorator("streetAddress2", {
                                                            rules: [
                                                                {
                                                                    message: "Please input the streetAddress2!",
                                                                    whitespace: true
                                                                }
                                                            ]
                                                        })(<Input placeholder="Street Address 2"/>)}
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                            <Row gutter={8}>
                                                <Col span={8} push={1}>
                                                    <Form.Item className="register-ant-form-item">
                                                        {getFieldDecorator("city", {
                                                            rules: [
                                                                {
                                                                    message: "Please input the city!",
                                                                    whitespace: true
                                                                }
                                                            ]
                                                        })(<Input placeholder="City"/>)}
                                                    </Form.Item>
                                                </Col>
                                                <Col span={8} push={1}>
                                                    <Form.Item className="register-ant-form-item">
                                                        {getFieldDecorator("zipCode", {
                                                            rules: [
                                                                {
                                                                    message: "Please input the zipcode!",
                                                                    whitespace: true
                                                                }
                                                            ]
                                                        })(<Input placeholder="Zip Code"/>)}
                                                    </Form.Item>
                                                </Col>
                                                <Col span={8} push={1}>
                                                    <Form.Item className="register-ant-form-item">
                                                        {getFieldDecorator("state", {
                                                            rules: [
                                                                {
                                                                    message: "Please input the state!",
                                                                    whitespace: true
                                                                }
                                                            ]
                                                        })(<Input placeholder="State"/>)}
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col span={8} push={1}>
                                                    <Form.Item className="register-ant-form-item">
                                                        {getFieldDecorator('DatePicker', {
                                                            //  initialValue: this.state.homelessData.DOB ? moment(this.state.homelessData.DOB, 'YYYY/MM/DD') : moment("1993-06-28", 'YYYY/MM/DD'),
                                                            rules: [
                                                                {
                                                                    type: "object",
                                                                    required: true,
                                                                    message: "Please input your Date!"
                                                                }
                                                            ]
                                                        })(<DatePicker placeholder="Appointment Date"/>)}
                                                    </Form.Item>
                                                </Col>
                                                <Col span={8} push={1}>
                                                    <Form.Item className="register-ant-form-item">
                                                        {getFieldDecorator('TimePicker', {
                                                            //  initialValue: this.state.homelessData.DOB ? moment(this.state.homelessData.DOB, 'YYYY/MM/DD') : moment("1993-06-28", 'YYYY/MM/DD'),
                                                            rules: [
                                                                {
                                                                    type: "object",
                                                                    required: true,
                                                                    message: "Please input your Time!"
                                                                }
                                                            ]
                                                        })(<TimePicker placeholder="Time Date"/>)}
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </Panel>
                                        <Panel style={{backgroundColor: "lightseagreen"}} header="Submit Form Here"
                                               key="3">
                                            <Row>
                                                <Col span={12}>
                                                    <p style={{padding: "2%"}}>


                                                        <Checkbox>
                                                            I acknowledge, the form is completed as per the inputs
                                                            provided
                                                            by the
                                                            client.
                                                        </Checkbox>

                                                    </p>
                                                </Col>
                                                <Col span={12}>
                                                    <Form.Item>
                                                        <Button type="primary" block htmlType="submit"
                                                                className="registration-submit-button">
                                                            Submit
                                                        </Button>
                                                    </Form.Item>
                                                </Col>
                                            </Row>

                                        </Panel>
                                    </Collapse>
                                </Form>
                            </div>
                        </Content>
                    </Layout>
                    <StreetCardFooter/>
                </Layout>
            );
        }

    }
}


const WrappedSetAppointments = Form.create({name: 'time_related_controls'})(SetAppointments);


export default WrappedSetAppointments;
