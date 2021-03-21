import React, {Component} from 'react'
import DragAndDrop from './DragAndDrop'
import {ThemeProvider} from "styled-components";
import {Skeleton} from "antd";

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

class FileList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            files: [],
            uploaded: [],
            loading: false,
            text: '',
            debugMode: false
        }
        this.fetchSuccess = this.fetchSuccess.bind(this);
    }

    fetchSuccess() {

    }

    handleDrop = (files) => {
        let fileList = this.state.files
        if (files.length > 0) {
            console.log('TRUE! ', files.length);
            this.setState({loading: true});
        }
        for (let i = 0; i < files.length; i++) {
            if (!files[i].name) return
            fileList.push(files[i])
        }
        this.uploadFiles(files);
        this.setState({files: fileList})
    }

    uploadFiles = (files) => {
        let uploadedList = this.state.uploaded;
        for (let i = 0; i < files.length; i++) {
            // check whether the file was already uploaded
            if (uploadedList.includes(files[i].name)) {
                console.log('includes ', files[i].name)
                return;
            } else {
                console.log('pushing ', files[i].name);
                uploadedList.push(files[i].name);
                this.setState({uploaded: uploadedList});
                let formData = new FormData();
                formData.append('file', files[i]);
                fetch('http://127.0.0.1:5000', {
                    method: 'POST',
                    body: formData
                }).then(result => result.json()
                ).then((success) => {
                    this.setState({loading: false, text: success.string});
                    console.log(success);
                    // this.fetchSuccess();
                    return success;
                }).catch(
                    error => console.log(error)
                );
            }
        }
    }

    files() {
        return this.state.files.map(file =>
            <li key={file.name}>{file.name}</li>)
    }

    render() {
        return (<div>
                <div id="drag" style={{
                    // border: 'dashed grey 4px',
                    borderWidth: '2px',
                    borderRadius: '2px',
                    borderColor: '#eeeeee',
                    borderStyle: 'dashed',
                    outline: "none",
                    backgroundColor: '#fafafa',
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
                        <DragAndDrop handleDrop={this.handleDrop}>
                            <div style={{height: 200, width: '100%'}}>
                                <p style={{
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    display: "flex",
                                    transform: "translate(0, 150%)",
                                    align: "center",
                                    color: "#bdbdbd",
                                    fontSize: "xx-large"
                                }}>Drag and drop files here</p>
                            </div>
                        </DragAndDrop>
                        {!this.state.debugMode ? <></> :
                            <aside>
                                <h4>Files</h4>
                                <ul>
                                    {this.files()}
                                </ul>
                            </aside>}
                    </ThemeProvider>
                </div>
                <div className="article">
                    <Skeleton loading={this.state.loading}>
                        <p>{this.state.text}</p>
                    </Skeleton>
                </div>
            </div>
        )
    }
}

export default FileList;
