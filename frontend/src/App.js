import './App.css';
import {Layout, Menu} from "antd";

import 'antd/dist/antd.css';

import Home from "./Home.js";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from 'react-router-dom';
import Bot from "./Bot";
import Analyser from "./Analyser";
import SearchbarDictionary from "./SearchbarDictionary";
import Landing from "./Landing";


const {Header, Footer, Content} = Layout;

function App() {
    return (
        <Router>
            <Layout className="layout">
                <Header>
                    <div className="logo"/>
                    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
                        <Menu.Item key="1"><Link to="/">Home aka Landing </Link></Menu.Item>
                        <Menu.Item key="3"><Link to="/webanalyser">Extract info</Link></Menu.Item>
                        <Menu.Item key="5"><Link to="/analyse">Analyse aka Дофига
                            всего</Link></Menu.Item>
                    </Menu>
                </Header>
                <Content style={{padding: '0 50px', height: '92.5vh'}}>
                    <div className="site-layout-content" style={{height: '85vh', overflow: 'auto'}}>
                        <Switch>
                            <Route path="/webanalyser">
                                <Analyser/>
                                {/*<BodyOverview/> TODO: move this somewhere else */}
                            </Route>
                            <Route path="/analyse">
                                <Home/>
                            </Route>
                            <Route path="/">
                                <Landing/>
                            </Route>
                        </Switch>
                        <Bot/>
                    </div>
                    <Footer style={{textAlign: 'center'}}>fooBar &copy; 2021</Footer>
                </Content>
            </Layout>
        </Router>
    );
}

export default App;
