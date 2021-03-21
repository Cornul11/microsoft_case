import React, {Component} from 'react'
import DragAndDrop from './DragAndDrop'
import {ThemeProvider} from "styled-components";
import {Skeleton, Radio} from "antd";


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

const options = [
    {label: 'Analysis', value: 'Analysis'},
    {label: 'Prescription', value: 'Prescription'},
];

class FileList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            files: [],
            uploaded: [],
            loading: false,
            text: '',
            debugMode: false,
            radioValue: 'Analysis'
        }
    }

    onChange4 = e => {
        console.log('radio4 checked', e.target.value);
        this.setState({
            radioValue: e.target.value,
        });
    };

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
                let urlToUse = this.state.radioValue === 'Analysis' ? 'http://127.0.0.1:5000/analyzeDiagnosis' : 'http://127.0.0.1:5000/analyzeLabResults';
                fetch(urlToUse, {
                    method: 'POST',
                    body: formData
                }).then(result => result.json()
                ).then((success) => {
                    this.setState({loading: false, text: success.string});
                    console.log(success);
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
        const {radioValue} = this.state;
        return (<div>
                <Radio.Group
                    style={{paddingTop: '15px', paddingBottom: '8px'}}
                    options={options}
                    onChange={this.onChange4}
                    value={radioValue}
                    optionType="button"
                    buttonStyle="solid"
                />
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
