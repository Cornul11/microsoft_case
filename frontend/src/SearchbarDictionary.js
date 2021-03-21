import React from 'react';
import {Collapse} from "antd";
import Search from "antd/es/input/Search";

const {Panel} = Collapse;

class SearchbarDictionary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            definition: 'Look for a word first.',
            loadingState: false,
            searchField: ''
        }

        this.onPressEnter = this.onPressEnter.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.onChange = this.onChange.bind(this);
        this.submitRequest = this.submitRequest.bind(this);
    }

    onSearch = (value, e) => {
        this.setState({loadingState: true});
        this.submitRequest();
    }

    onPressEnter() {
        this.setState({loadingState: true});
        this.onSearch();
    }

    onChange = e => {
        this.setState({searchField: e.target.value});
    }


    submitRequest() {
        console.log(this.state.searchField);
        fetch("https://www.dictionaryapi.com/api/v3/references/medical/json/" + this.state.searchField + "?key=7635550d-59ba-4461-b911-7cda738f84a2", {
            method: "GET",
        })
            .then(r => r.json())
            .then(result => {
                if (result.hasOwnProperty(0) && result[0].hasOwnProperty('meta')) {
                    let definition = result[0].def[0].sseq[0][0][1].dt[0][1];
                    let dxLocalizer = definition.indexOf("{dx}") - 1;
                    let definitionCleaned = dxLocalizer > 0 ? definition.substring(0, dxLocalizer) : definition;
                    definitionCleaned = definitionCleaned.replace(/{[^()]*}/g, '');
                    this.setState({
                        definition: definitionCleaned,
                        loadingState: false
                    })
                } else {
                    this.setState({
                        loadingState: false,
                        definition: "No definitions found"
                    })
                }
            }).catch((error) => {
            console.log(error);
        });
    }

    render() {
        return (
            // <form onSubmit={this.submitSearch}>
            //     <label htmlFor="searchTerm">
            //         <input type="text" name="searchTerm" value={this.state.searchTerm}
            //                onChange={this.doingASearch}/>
            //         <input type="submit" value="Search"/>
            //     </label>
            // </form>
            <div>
                <Search placeholder="Look for the definition of a word" enterButton
                        size="medium"
                        style={{width: '250px', paddingBottom: '5px'}}
                        onSearch={this.onSearch}
                        onChange={this.onChange}
                        loading={this.state.loadingState}/>
                <Collapse defaultActiveKey={[]}>
                    <Panel header="Dictionary definition" key="1">
                        <p>{this.state.definition}</p>
                    </Panel>
                </Collapse>
            </div>
        )
    }
}

export default SearchbarDictionary;
