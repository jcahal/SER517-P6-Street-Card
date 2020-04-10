import React from 'react';
import 'antd/dist/antd.css';
import './index.css';
import {Button, Form, Icon, Input, Layout, Row, Col, Table} from "antd";
import Header from './Header'
import StreetCardFooter from './StreetCardFooter'
import SiderComponentServiceProvider from './component/SiderComponentServiceProvider'
import { Chart } from "react-google-charts";

const {Content} = Layout;

class ServiceProviderView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoaded: false,
            columns: [
                {
                    title: 'DateTime',
                    dataIndex: 'datetime',
                },
                {
                    title: 'Personal ID',
                    dataIndex: 'personalId',
                },

                {
                    title: 'Client Name',
                    dataIndex: 'clientName',
                },

                {
                    title: 'Service Provider',
                    dataIndex: 'serviceProvider',
                },

            ],
            dataSource: [
                {
                    id: '',
                    datetime: '',
                    clientName: '',
                    serviceProvider: '',
                    personalId: '',

                }
            ]

        }

        this.handleSuccessfulLogoutAction = this.handleSuccessfulLogoutAction.bind(this);
        this.setPagecomponent = this.setPagecomponent.bind(this);
    }

    state = {
        pageComponent: this.props.pageComponent,
        productUnitData: [],
        productCostData:[],
        productData:[]
    };
    componentDidMount() {
        fetch('http://127.0.0.1:8000/product/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
        })
            .then(res => res.json())
            .then(json => {
                 var productUnitDataLocal = new Array(json.length + 1);
                 productUnitDataLocal[0] = new Array(2);
                 productUnitDataLocal[0][0] = 'Product';
                 productUnitDataLocal[0][1] = 'Available Units';
                 for (var i = 1; i < productUnitDataLocal.length; i++) {
                    productUnitDataLocal[i] = new Array(2);
                    productUnitDataLocal[i][0] = json[i - 1].productName
                    productUnitDataLocal[i][1] = json[i - 1].unitsAvailable
                 }

                 var productCostDataLocal = new Array(json.length + 1);
                 productCostDataLocal[0] = new Array(2);
                 productCostDataLocal[0][0] = 'Product';
                 productCostDataLocal[0][1] = 'Item Cost';
                 for (var i = 1; i < productCostDataLocal.length; i++) {
                    productCostDataLocal[i] = new Array(2);
                    productCostDataLocal[i][0] = json[i - 1].productName
                    productCostDataLocal[i][1] = json[i - 1].costPerItem
                 }


                 var productDataLocal = new Array(json.length + 1);
                 productDataLocal[0] = new Array(4);
                 productDataLocal[0][0] = 'Product';
                 productDataLocal[0][1] = 'Available Units';
                 productDataLocal[0][2] = 'Item Cost';
                 productDataLocal[0][3] = 'total cost'
                 for (var i = 1; i < productDataLocal.length; i++) {
                    productDataLocal[i] = new Array(4);
                    productDataLocal[i][0] = json[i - 1].productName
                    productDataLocal[i][1] = json[i - 1].unitsAvailable
                    productDataLocal[i][2] = json[i - 1].costPerItem
                    productDataLocal[i][3] = json[i - 1].unitsAvailable*json[i - 1].costPerItem
                 }
                 console.log(productDataLocal)
                this.setState({
                        productUnitData: productUnitDataLocal,
                        productCostData:productCostDataLocal,
                        productData:productDataLocal
                    }
                )

                console.log(this.state.productData)

            })
    }


    handleSuccessfulLogoutAction() {
        this.props.handleLogout();
        this.props.history.push('/login');
    }

    setPagecomponent(pageComponentValue) {
        console.log(pageComponentValue)
        this.setState({
            pageComponent: pageComponentValue
        });
    };

    handleHomelessIdSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {

            if (!err) {
                fetch('http://localhost:8000/homeless/' + values.personId + '/transaction/', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                    .then(res => res.json())
                    .then(json => {
                        this.props.handleHomelessPersonInventoryJson(json);
                        this.props.history.push('/inventoryLog');
                    });

            }
        });

    };

    render() {
        const {getFieldDecorator} = this.props.form;

        if (this.state.pageComponent == 'inventoryLog') {
            return (
            <Layout className="layout">
                        <Header
                            handleSuccessfulLogoutAction={this.handleSuccessfulLogoutAction}
                            loggedInStatus={this.state.loggedInStatus}
                        />
                        <Layout>

                            <SiderComponentServiceProvider
                                setPagecomponent={this.setPagecomponent}
                            />
                            <Content className="content-login">
                                <div className="site-layout-content-login">
                                    <Form onSubmit={this.handleHomelessIdSubmit.bind(this)}>
                                        <Form.Item>
                                            {getFieldDecorator('personId', {
                                                rules: [{
                                                    required: true,
                                                    message: " Please input Client's Personal Identification !"
                                                }],
                                            })(
                                                <Input
                                                    prefix={<Icon type="user" style={{
                                                        color: 'rgba(0,0,0,.25)',
                                                        fontSize: "12px"
                                                    }}/>}
                                                    placeholder="Client's Personal Identification"
                                                />,
                                            )}
                                        </Form.Item>
                                        <Form.Item>
                                            <Button type="primary" htmlType="submit" className="login-form-button">
                                                Continue
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </div>
                            </Content>
                        </Layout>
                        <StreetCardFooter/>
                    </Layout>
            ); 
        }else if(this.state.pageComponent == 'pieChart'){
            return(
                <div>
                <Layout className="layout">
            <Header handleSuccessfulLogoutAction={this.handleSuccessfulLogoutAction}
                    loggedInStatus={this.state.loggedInStatus}
            />
            <Layout>
                <SiderComponentServiceProvider
                    setPagecomponent={this.setPagecomponent}
                />
                <Content className="content-login">
                        <Chart
                          className = "site-layout-content-graphs"
                          chartType="PieChart"
                          loader={<div>Loading Chart</div>}
                          data={this.state.productUnitData}
                          options={{
                            title: 'Product Available Units',
                            is3D: true,
                          }}
                          rootProps={{ 'data-testid': '2' }}
                        />
                </Content>
            </Layout>
            <StreetCardFooter/>
            </Layout>
                </div>
            );
        }else if(this.state.pageComponent == 'donutChart'){
            return(
                <div>
                <Layout className="layout">
            <Header handleSuccessfulLogoutAction={this.handleSuccessfulLogoutAction}
                    loggedInStatus={this.state.loggedInStatus}
            />
            <Layout>
                <SiderComponentServiceProvider
                    setPagecomponent={this.setPagecomponent}
                />
                <Content className="content-login">
                        <Chart
                          className = "site-layout-content-graphs"
                          chartType="PieChart"
                          loader={<div>Loading Chart</div>}
                          data={this.state.productCostData}
                          options={{
                            title: 'Product per Unit Cost',
                            pieHole: 0.4,
                          }}
                          rootProps={{ 'data-testid': '3' }}
                        />
                </Content>
            </Layout>
            <StreetCardFooter/>
            </Layout>
                </div>
            );
        }else if(this.state.pageComponent == 'barChart'){
            return(
                <div>
                <Layout className="layout">
            <Header handleSuccessfulLogoutAction={this.handleSuccessfulLogoutAction}
                    loggedInStatus={this.state.loggedInStatus}
            />
            <Layout>
                <SiderComponentServiceProvider
                    setPagecomponent={this.setPagecomponent}
                />
                <Content className="content-login">
                        <Chart
                          className = "site-layout-content-graphs"
                          chartType="Bar"
                          loader={<div>Loading Chart</div>}
                          data={this.state.productData}
                          options={{
                            chart: {
                              title: 'Product Data'
                            },
                          }}
                          // For tests
                          rootProps={{ 'data-testid': '2' }}
                        />
                </Content>
            </Layout>
            <StreetCardFooter/>
            </Layout>
                </div>
            );
        }else if(this.state.pageComponent == 'lineChart'){
            return(
                <div>
                <Layout className="layout">
            <Header handleSuccessfulLogoutAction={this.handleSuccessfulLogoutAction}
                    loggedInStatus={this.state.loggedInStatus}
            />
            <Layout>
                <SiderComponentServiceProvider
                    setPagecomponent={this.setPagecomponent}
                />
                <Content className="content-login">
                    <Chart
                      className = "site-layout-content-graphs"
                      chartType="Line"
                      loader={<div>Loading Chart</div>}
                      data={[
                        [
                          'Day',
                          'Guardians of the Galaxy',
                          'The Avengers',
                          'Transformers: Age of Extinction',
                        ],
                        [1, 37.8, 80.8, 41.8],
                        [2, 30.9, 69.5, 32.4],
                        [3, 25.4, 57, 25.7],
                        [4, 11.7, 18.8, 10.5],
                        [5, 11.9, 17.6, 10.4],
                        [6, 8.8, 13.6, 7.7],
                        [7, 7.6, 12.3, 9.6],
                        [8, 12.3, 29.2, 10.6],
                        [9, 16.9, 42.9, 14.8],
                        [10, 12.8, 30.9, 11.6],
                        [11, 5.3, 7.9, 4.7],
                        [12, 6.6, 8.4, 5.2],
                        [13, 4.8, 6.3, 3.6],
                        [14, 4.2, 6.2, 3.4],
                      ]}
                      options={{
                        chart: {
                          title: 'Box Office Earnings in First Two Weeks of Opening',
                          subtitle: 'in millions of dollars (USD)',
                        },
                      }}
                      rootProps={{ 'data-testid': '3' }}
                    />
                </Content>
            </Layout>
            <StreetCardFooter/>
            </Layout>
                </div>
            );
        }else {
            return(
            <Layout className="layout">
                        <Header
                            handleSuccessfulLogoutAction={this.handleSuccessfulLogoutAction}
                            loggedInStatus={this.state.loggedInStatus}
                        />
                        <Layout>

                            <SiderComponentServiceProvider
                                setPagecomponent={this.setPagecomponent}
                            />
                            <Content className="content-login">
                                <div className="site-layout-content-login">
                                    <Form onSubmit={this.handleHomelessIdSubmit.bind(this)}>
                                        <Form.Item>
                                            {getFieldDecorator('personId', {
                                                rules: [{
                                                    required: true,
                                                    message: " Please input Client's Personal Identification !"
                                                }],
                                            })(
                                                <Input
                                                    prefix={<Icon type="user" style={{
                                                        color: 'rgba(0,0,0,.25)',
                                                        fontSize: "12px"
                                                    }}/>}
                                                    placeholder="Client's Personal Identification"
                                                />,
                                            )}
                                        </Form.Item>
                                        <Form.Item>
                                            <Button type="primary" htmlType="submit" className="login-form-button">
                                                Continue
                                            </Button>
                                        </Form.Item>
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


//ReactDOM.render(<Greeter/>, document.getElementById('greeter'));

const WrappedServiceProvider = Form.create({name: "serviceProvider"})(
    ServiceProviderView
);

export default WrappedServiceProvider;