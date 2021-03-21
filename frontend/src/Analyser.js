import {Alert, Input, Skeleton, notification} from 'antd';
import React from "react";
import ImmersiveReader from "./ImmersiveReader";

const {Search} = Input;

const openNotification = () => {
    notification.open({
        message: 'Summarization finished!',
        duration: 10,
        description:
            'Here\'s the summarization of the material on the page that you\'ve given.',
        onClick: () => {
            console.log('Notification Clicked!');
        },
    });
};


class Analyser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loadingState: false,
            value: '',
            disabledState: true
        };

        this.onPressEnter = this.onPressEnter.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onSearch = (value, e) => {
        this.setState({loadingState: true});
        this.submitRequest();
    }

    submitRequest() {
        fetch("http://127.0.0.1:5000/analysis?url=" + this.state.value)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        loadingState: false,
                        text: result.string,
                        title: result.title,
                        disabledState: false
                    });
                    openNotification();
                },
                (error) => {
                    this.setState({
                        loadingState: false
                    });
                    console.log(error);
                }
            )
    }

    onPressEnter() {
        this.setState({loadingState: true});
        this.onSearch();
    }

    onChange = e => {
        this.setState({value: e.target.value});
    }

    render() {
        return (<div>
                <Alert description="Browsing the internet to find relevant information about your symptoms
        or illness could take hours. Therefore we provide you with a summarizer that is able to extract
         the most important information for you. Just go ahead and input the url of a resource that you would like to have summarized."
                       type="info"
                       style={{marginBottom: "8px"}}
                />

                <Search placeholder="input url" enterButton="Analyse"
                        onPressEnter={this.onPressEnter} size="large"
                        style={{width: "75%"}}
                        onSearch={this.onSearch}
                        onChange={this.onChange}
                        loading={this.state.loadingState}/>
                <ImmersiveReader
                    style={{height: '40px'}}
                    title={this.state.title}
                    text={this.state.text}
                    locale={"en"}
                    tokenURL="http://127.0.0.1:5000/GetTokenAndSubdomain"
                    disabled={this.state.disabledState}
                />
                <div className="article">
                    <Skeleton active loading={this.state.loadingState}>
                        <p style={{
                            whiteSpace: "pre-wrap",
                            fontSize: 'medium'
                        }}>{this.state.text}</p>
                    </Skeleton>
                </div>
            </div>
        );
    }
}

export default Analyser;
