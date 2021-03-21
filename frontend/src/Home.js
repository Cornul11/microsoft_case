import React from "react";
import FileList from "./FileList";
import SearchbarDictionary from "./SearchbarDictionary";

function Home() {
    return (<div>
        <SearchbarDictionary/>
        <FileList/>
    </div>);
}

export default Home;
