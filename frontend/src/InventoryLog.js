import React from 'react';
import 'antd/dist/antd.css';
import './index.css';
import {Form, Layout, Table} from 'antd';
import Header from './Header.js'
import StreetCardFooter from './StreetCardFooter'
import SiderComponentServiceProvider from './SiderComponentServiceProvider'

/**
 * Creating a table for rendering the timestamp logo.
 * Table should display info based on what is known about the user
 */

const {Content} = Layout;

class InventoryLog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            columns: [
                {
                    title: 'product ID',
                    dataIndex: 'productId',
                },
                {
                    title: 'product',
                    dataIndex: 'productName',
                },
                {
                    title: 'product cost',
                    dataIndex: 'costPerItem',
                },

                {
                    title: 'Unit Available',
                    dataIndex: 'unitsAvailable',
                },

                {
                    title: 'Service Provider',
                    dataIndex: 'serviceProvider',
                },
                {
                    title: 'Category',
                    dataIndex: 'category',
                }

            ],
            dataSource: [
                {
                    productId: '',
                    productName: '',
                    costPerItem: '',
                    unitsAvailable: '',
                    serviceProvider: '',
                    category: ''

                }
            ]

        }

        this.handleSuccessfulLogoutAction = this.handleSuccessfulLogoutAction.bind(this);
        this.setPagecomponent = this.setPagecomponent.bind(this);
    }

    componentDidMount() {
        fetch(process.env.REACT_APP_IP + 'product/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
        })
            .then(res => res.json())
            .then(json => {
                this.setState({
                        dataSource: json,
                    }
                )
            })
    }


    handleSuccessfulLogoutAction() {
        this.props.handleLogout();
        this.props.history.push('/login');
    }


    setPagecomponent(pageComponentValue) {
        this.props.updatePageComponent(pageComponentValue)
        this.props.history.push('/serviceProvider');
    };

    render() {
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8}
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16}
            }
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0
                },
                sm: {
                    span: 16,
                    offset: 4
                }

            }

        };


        return (
            <Layout className="layout">
                <Header
                    handleSuccessfulLogoutAction={this.handleSuccessfulLogoutAction}
                    loggedInStatus={this.props.loggedInStatus}
                />

                <Layout>
                    <SiderComponentServiceProvider
                        setPagecomponent={this.setPagecomponent}
                    />
                    <Content className="content-enroll">
                        <div>
                            <Table className="site-layout-content-viewappointment" dataSource={this.state.dataSource}
                                   columns={this.state.columns} scroll={{x: 1500, y: 500}}/>
                        </div>
                    </Content>
                </Layout>
                <StreetCardFooter/>
            </Layout>
        );

    }
}

const WrappedLogTable = Form.create({name: "log"})(
    InventoryLog
);

export default WrappedLogTable;