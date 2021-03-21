import DBPedia from "./bot/DBPedia";
import {ThemeProvider} from "styled-components";
import React from "react";

const leftstyle = {
    width: "50%",
    float: "left"
};

const theme = {
    background: '#f5f8fb',
    headerBgColor: '#91bbb3',
    headerFontColor: '#fff',
    headerFontSize: '17px',
    botBubbleColor: '#91bbb3',
    botFontColor: '#fff',
    userBubbleColor: '#fff',
    userFontColor: '#4a4a4a',
};


function Bot() {
    return (<div id="bot" style={{leftstyle}}>
        <ThemeProvider theme={theme}>
            <DBPedia />
        </ThemeProvider>
    </div>);
}

export default Bot;
