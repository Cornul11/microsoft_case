import React from 'react';

export default class Searchbar extends React.Component {
    state = {
        searchTerm: ""
    }

    doingASearch = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    filterBySearchTerm = (search) => {
        this.setState({
            theLocationFilter: search,
        })

        fetch("https://www.dictionaryapi.com/api/v3/references/medical/json/" + search + "?key=7635550d-59ba-4461-b911-7cda738f84a2", {
            method: "GET",
            // body: JSON.stringify({
            //     query: search
            // })
        })
            .then(r => r.json())
            .then(result => {
                console.log(result[0].def[0].sseq[1][1][1].dt[0][1])
                if (result[0].def[0].sseq[1][1][1].dt[0][1] > 0) {
                    this.setState({
                        searchTerm: search,
                        filterAll: false,
                        searchPark: result.def[0].sseq[0][0].sense.sdsense.dt[0][0][1],
                        isLoading: false
                    })
                } else {
                    this.setState({
                        theLocationFilter: search,
                        filterAll: false,
                        isLoading: false,
                        searchError: "No definitions found"
                    })
                }
            })
    }

    submitSearch = (event) => {
        event.preventDefault();
        this.filterBySearchTerm(this.state.searchTerm)
        this.setState({
            searchTerm: ""
        })
    }

    render() {
        return (
            <form onSubmit={this.submitSearch}>
                <label htmlFor="searchTerm">
                    <input type="text" name="searchTerm" value={this.state.searchTerm} onChange={this.doingASearch}/>
                    <input type="submit" value="Search"/>
                </label>
            </form>
        )
    }
}
