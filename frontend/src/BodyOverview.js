import React from "react";


export default class BodyOverview extends React.Component {

    state = {
        text: ""
    }

    getInfo() {

        fetch("http://localhost:5000/visual-summary/covid", {
            method: "GET"
        })
            .then(r => r.text())
            .then(result => {
                console.log(result)
                this.setState({text: result})
            })
            .catch(error =>
                console.log(error));
    }

    componentDidMount() {
        this.getInfo();
    }

    render() {
        return (<div style={{align: "center"}}>
            <div id="view" style={{display: "inline-block"}}>
                <iframe
                    title="Body visualisation"
                    src="https://human.biodigital.com/viewer?id=production/maleAdult/covid_19_mild_severe_critical_symptom_tour_labeled&lang=en&dk=76851f8df6e5631f068af1038976b4015b521daa"
                    width="500" height="500">
                </iframe>
            </div>
            <div id="text" style={{display: "inline-block", whiteSpace: "pre-wrap"}}>
                <p>{this.state.text}</p>
            </div>
        </div>);
    }

}

