import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Loading} from 'react-simple-chatbot';

class Analysis extends Component {
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
                self.setState({loading: false, result: "According to your analyzes, the visual acuity of the right eye is -2, and the left one is -1. Vision with acuity of 0 is considered normal, therefore it is below normal and is a sign of myopia."});
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

Analysis.propTypes = {
    steps: PropTypes.object,
    triggerNextStep: PropTypes.func,
};

Analysis.defaultProps = {
    steps: undefined,
    triggerNextStep: undefined,
};

export default Analysis