import React, {useMemo} from 'react';

import {useDropzone} from "react-dropzone";

const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
};

const activeStyle = {
    borderColor: '#2196f3'
};

const acceptStyle = {
    borderColor: '#00e676'
};

const rejectStyle = {
    borderColor: '#ff1744'
};

function Dropzone(props) {
    const {
        acceptedFiles,
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject
    } = useDropzone({
        maxFiles: 1
    });

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isDragActive,
        isDragReject,
        isDragAccept
    ]);

    const files = acceptedFiles.map(file => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));

    let uploaded = [];

    function uploadFiles() {
        for (let i = 0; i < acceptedFiles.length; i++) {
            if (uploaded.includes(acceptedFiles[i].name)) {
                console.log('includes ', acceptedFiles[i].name)
                return;
            } else {
                console.log('pushing ', acceptedFiles[i].name);
                uploaded.push(acceptedFiles[i].name);
            }
            let formData = new FormData();
            formData.append('file', acceptedFiles[i]);
            fetch('http://127.0.0.1:5000', {
                method: 'POST',
                body: formData
            }).then(
                success => console.log(success)
            ).catch(
                error => console.log(error)
            );
        }
        // acceptedFiles.map(file => (
        //     fetch('http://127.0.0.1:5000', {
        //         method: 'POST',
        //         body: (new FormData()).append('file', file)
        //     }).then(
        //         response => response.json()
        //     ).then(
        //         success => console.log(success)
        //     ).catch(
        //         error => console.log(error)
        //     )
        // ));
    }

    return (
        <section className="container">
            <div {...getRootProps({style, onDrop: uploadFiles()})}>
                <input {...getInputProps()} />
                {
                    isDragActive ?
                        <p>Drop the files here ...</p> :
                        <p>Drag 'n' drop some files here, or click to select files</p>
                }
            </div>
            <aside>
                <h4>Files</h4>
                <ul>{files}</ul>
            </aside>
        </section>
    )
}

export default Dropzone;
