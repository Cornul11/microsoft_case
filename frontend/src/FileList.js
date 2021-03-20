import React, {Component} from 'react'
import DragAndDrop from './DragAndDrop'

class FileList extends Component {
    state = {
        files: [],
        uploaded: [],
    }
    handleDrop = (files) => {
        let fileList = this.state.files
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
                }).then(
                    success => console.log(success)
                ).catch(
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
        return (
            <div>
                <DragAndDrop handleDrop={this.handleDrop}>
                    <div style={{height: 200, width: 250}}>
                        <p style={{
                            float: "right",
                            display: "flex",
                            transform: "translate(0, 500%)",
                            align: "center"
                        }}>Drag and drop files here</p>
                    </div>
                </DragAndDrop>
                <aside>
                    <h4>Files</h4>
                    <ul>
                        {this.files()}
                    </ul>
                </aside>
            </div>
        )
    }
}

export default FileList;
