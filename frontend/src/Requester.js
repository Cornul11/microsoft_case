import React, { Component } from "react";

class Requester extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            text: ""
        }
    }

    componentDidMount() {
        fetch("http://127.0.0.1:5000")
            .then(res => res.text())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        text: result
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    render() {
        const { error, isLoaded, text } = this.state;
        if (error) {
            return <p>Error: {error.message}</p>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return <p>{text}</p>;
        }
    }
}

export default Requester;
