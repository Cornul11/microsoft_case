import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Loading} from 'react-simple-chatbot';

class Cure extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            result: '',
            trigger: false,
        };

        this.triggetNext = this.triggetNext.bind(this);
    }

    componentWillMount() {
        const self = this;
        const {steps} = this.props;
        const search = steps.advise.value;
        const query = encodeURI(`
      select * where {
      ?x rdfs:label "${search}"@en .
      ?x rdfs:comment ?comment .
      FILTER (lang(?comment) = 'en')
      } LIMIT 100
    `);

        const queryUrl = `https://dbpedia.org/sparql/?query=${query}&format=json`;

        const xhr = new XMLHttpRequest();

        xhr.addEventListener('readystatechange', readyStateChange);

        function readyStateChange() {
            if (this.readyState === 4) {
                self.setState({loading: false, result: "You must drip drops twice a day and order lenses with parameters -1 for the left eye and -2 for the right eye"});
            }
        }

        xhr.open('GET', queryUrl);
        xhr.send();
    }

    triggetNext() {
        this.setState({trigger: true}, () => {
            this.props.triggerNextStep();
        });
    }

    render() {
        const {trigger, loading, result} = this.state;

        return (
            <div className="advise">
                {loading ? <Loading/> : result}
                {
                    !loading &&
                    <div
                        style={{
                            textAlign: 'center',
                            marginTop: 20,
                        }}
                    >
                        {
                            !trigger
                        }
                    </div>
                }
            </div>
        );
    }
}

Cure.propTypes = {
    steps: PropTypes.object,
    triggerNextStep: PropTypes.func,
};

Cure.defaultProps = {
    steps: undefined,
    triggerNextStep: undefined,
};

export default Cure