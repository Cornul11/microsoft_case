import DragAndDrop from "./DragAndDrop";
import React from "react";
import FileList from "./FileList";
import {ThemeProvider} from "styled-components";
import {Input, Collapse} from "antd";
import Searchbar from "./SearchBar";

const {Search} = Input;
const {Panel} = Collapse;

function callback(key) {
    console.log(key);
}

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: 'Search for a word first.'
        }
    }
    render() {
        return (<div>
            <Searchbar />
            <FileList/>
        </div>);
    }
}

export default Home;
