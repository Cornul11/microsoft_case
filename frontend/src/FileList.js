import React, { Component } from 'react'
import DragAndDrop from './DragAndDrop'
class FileList extends Component {
state = {
    files: [
    ]
  }
 handleDrop = (files) => {
    let fileList = this.state.files
    for (var i = 0; i < files.length; i++) {
      if (!files[i].name) return
      fileList.push(files[i].name)
    }
    this.setState({files: fileList})
  }
render() {
    return (
      <DragAndDrop handleDrop={this.handleDrop}>
        <div style={{height: 300, width: 250}}>
            <p style={{
                            float: "right",
                            color: "green",
                            font: "bold 15pt serif",
                            display: "flex",
                transform: "translate(0, 500%)",
                            align: "center"}}>Drag and drop files here</p>
          {this.state.files.map((file) =>
            <div>{file}</div>
          )}
        </div>
      </DragAndDrop>
    )
  }
}
export default FileList