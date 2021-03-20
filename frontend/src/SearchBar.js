
var res = ""
const updateInput = async (input) => {

    const xhr = new XMLHttpRequest();

    xhr.addEventListener('readystatechange', readyStateChange);
    const queryUrl = "https://www.dictionaryapi.com/api/v3/references/collegiate/json/" + input + "?key=7635550d-59ba-4461-b911-7cda738f84a2"

    function readyStateChange() {
        if (this.readyState === 4) {
            const data = JSON.parse(this.responseText);
            const result = data[0].def[0].sseq[0][0].sense.sdsense.dt[0][0][1]
            console.log(data)
            res = result
        }
    }

    xhr.open('GET', queryUrl);
    xhr.send();
}

const SearchBar = () => (
    <form>
        <input
            type="text"
            placeholder="Search in medical dictionary"
            name="s"
        />
        <button onClick={updateInput}>Search</button>
        <div>Result: ${res}</div>

    </form>
);

export default SearchBar;