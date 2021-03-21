import React from "react";
import FileList from "./FileList";
import SearchbarDictionary from "./SearchbarDictionary";
import {Alert} from "antd";

function Home() {
    return (<div>
        <Alert description="How often talking to the doctor leaves you with more open questions than
         answers? Sometimes even for experienced people, it is hard to understand medical prescriptions
          or analyzes. We offer an opportunity to make it easier for everyone - just upload a PDF file
           or image that the doctor gave you and you shall receive an elementary explanation of it."
               type="info"
               showIcon
               style={{marginBottom: "8px"}}
        />
        <Alert description="Still a bit confused? If there are any words that you don't know left,
        we've created a dictionary for you, which provides all the necessary definitions of scientific
         terms. Our chatbot is always here to help you as well."
               type="info"
               style={{marginBottom: "8px"}}
        />
        <SearchbarDictionary/>
        <FileList/>
    </div>);
}

export default Home;
