import React, {Component} from 'react';
import PropTypes from 'prop-types';
import  {Loading} from 'react-simple-chatbot';

class Diagnosis extends Component {
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
        const query = encodeURI(`
      select * where {
      ?x rdfs:label "Near-sightedness"@en .
      ?x rdfs:comment ?comment .
      FILTER (lang(?comment) = 'en')
      } LIMIT 100
    `);
        const queryUrl = `http://localhost:3004/diagnosis/prescription`;

        const xhr = new XMLHttpRequest();

        xhr.addEventListener('readystatechange', readyStateChange);

        function readyStateChange() {
            if (this.readyState === 4) {
                const data = this.responseText;
                self.setState({loading: false, result: "Your diagnosis is " + data});
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
            <div className="diagnosis">
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

Diagnosis.propTypes = {
    steps: PropTypes.object,
    triggerNextStep: PropTypes.func,
};

Diagnosis.defaultProps = {
    steps: undefined,
    triggerNextStep: undefined,
};


export default Diagnosis;