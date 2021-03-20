import DragAndDrop from "./DragAndDrop";
import React from "react";
import FileList from "./FileList";
import {ThemeProvider} from "styled-components";

const theme = {
    background: '#f5f8fb',
    fontFamily: 'Helvetica Neue',
    headerBgColor: '#91bbb3',
    headerFontColor: '#fff',
    headerFontSize: '17px',
    botBubbleColor: '#91bbb3',
    botFontColor: '#fff',
    userBubbleColor: '#fff',
    userFontColor: '#4a4a4a',
};

function Home() {
    return (<div>
        <div id="drag" style={{
            border: 'dashed grey 4px',
            backgroundColor: 'rgba(212,209,209,0.8)',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            width: "100%",
            float: "left",
            display: "flex",
            align: "center"
        }}>
            <ThemeProvider theme={theme}>
                <FileList>
                    <div style={{height: 300, width: 250}}>
                    </div>
                </FileList>
            </ThemeProvider>
        </div>
            Here are this
        </div>
    );
}

export default Home;
