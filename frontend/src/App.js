import './App.css';
import {Layout, Menu, Breadcrumb} from "antd";
import {UserOutlined, LaptopOutlined, NotificationOutlined} from '@ant-design/icons';

import 'antd/dist/antd.css';
import Requester from "./Requester";


const {SubMenu} = Menu;
const {Header, Sider, Content} = Layout;

const leftstyle = {
    width: "50%",
    float: "left"
};


function App() {
    return (
        <Layout>
            <Header className="header">
                <div className="logo"/>
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                    <Menu.Item key="1">nav 1</Menu.Item>
                    <Menu.Item key="2">nav 2</Menu.Item>
                    <Menu.Item key="3">nav 3</Menu.Item>
                </Menu>
            </Header>
            <Layout>
                <Sider width={200} className="site-layout-background">
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        style={{height: '100%', borderRight: 0}}
                    >
                        <SubMenu key="sub1" icon={<UserOutlined/>} title="subnav 1">
                            <Menu.Item key="1">option1</Menu.Item>
                            <Menu.Item key="2">option2</Menu.Item>
                            <Menu.Item key="3">option3</Menu.Item>
                            <Menu.Item key="4">option4</Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub2" icon={<LaptopOutlined/>} title="subnav 2">
                            <Menu.Item key="5">option5</Menu.Item>
                            <Menu.Item key="6">option6</Menu.Item>
                            <Menu.Item key="7">option7</Menu.Item>
                            <Menu.Item key="8">option8</Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub3" icon={<NotificationOutlined/>} title="subnav 3">
                            <Menu.Item key="9" id="drag"/>
                        </SubMenu>
                    </Menu>
                </Sider>
                <Layout style={{padding: '0 24px 24px'}}>
                    <Breadcrumb style={{margin: '16px 0'}}>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item>List</Breadcrumb.Item>
                        <Breadcrumb.Item>App</Breadcrumb.Item>

                    </Breadcrumb>
                    <Content
                        className="site-layout-background"
                        style={{
                            padding: 24,
                            margin: 0,
                            minHeight: 280,
                        }}
                    >

                        <div id="bot" style={{leftstyle}}/>
                        <div id="drag" style={{
                            border: 'dashed grey 4px',
                            backgroundColor: 'rgba(212,209,209,0.8)',
                            // position: 'absolute',
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            zIndex: 9999,
                            width: "50%",
                            float: "right",
                            color: "green",
                            font: "bold large serif",
                            display: "flex",
                            align: "center"
                        }}>
                            <p>Hello</p>

                        </div>

                        <Requester/>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
}


export default App;
