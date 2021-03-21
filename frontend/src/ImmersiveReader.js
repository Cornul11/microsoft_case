import {renderButtons, launchAsync} from "@microsoft/immersive-reader-sdk";
import React, {Component} from 'react';


class ImmersiveReader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: props.title,
            text: props.text,
            locale: props.locale,
            tokenURL: props.tokenURL,
            disabledState: props.disabled,
            backgroundColor: '#1890ff'
        }
        this.revertColor = this.revertColor.bind(this);
        this.changeColor = this.changeColor.bind(this);
    }

    componentDidMount() {
        renderButtons();
    }

    LaunchReader(tokenURL) {
        fetch(tokenURL)
            .then(res => res.json())
            .then(body => {
                console.log(body);
                const options = {"uiZIndex": 2000};
                const data = {
                    title: this.props.title,
                    chunks: [{
                        content: this.props.text,
                        mimeType: "text/html"
                    }]
                };
                launchAsync(body.token, body.subdomain, data, options)
                    .catch(function (error) {
                        console.log(error);
                    })
            });
    }

    changeColor(e) {
        this.setState({backgroundColor: '#40a9ff'});
    }

    revertColor(e) {
        this.setState({backgroundColor: '#1890ff'});
    }

    render() {
        console.log(this.props.style);
        return (
            <button style={{...this.props.style, backgroundColor: this.state.backgroundColor}}
                    onMouseOver={this.changeColor}
                    onMouseLeave={this.revertColor}
                    onMouseOut={this.revertColor}
                    disabled={this.props.disabled}
                    className="immersive-reader-button ant-btn ant-btn-primary ant-btn-lg ant-input-search-button"
                    data-button-style="iconAndText"
                    data-locale={this.props.locale}
                    onClick={() => this.LaunchReader(this.props.tokenURL)}/>
        )
    }
}

export default ImmersiveReader;
