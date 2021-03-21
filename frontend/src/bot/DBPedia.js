import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ChatBot, {Loading} from 'react-simple-chatbot';
import Diagnosis from './Diagnosis'
import Cure from "./Cure";
import Analysis from "./Analysis";

class DBPedia extends Component {
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
        const queryUrl = `https://dbpedia.org/sparql/?query=${query}&format=json`;

        const xhr = new XMLHttpRequest();

        xhr.addEventListener('readystatechange', readyStateChange);

        function readyStateChange() {
            if (this.readyState === 4) {
                const data = JSON.parse(this.responseText);
                const bindings = data.results.bindings;
                if (bindings && bindings.length > 0) {
                    self.setState({loading: false, result: bindings[0].comment.value});
                } else {
                    self.setState({loading: false, result: 'Not found.'});
                }
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
            <div className="dbpedia">
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

DBPedia.propTypes = {
    steps: PropTypes.object,
    triggerNextStep: PropTypes.func,
};

DBPedia.defaultProps = {
    steps: undefined,
    triggerNextStep: undefined,
};

const ExampleDBPedia = () => (
    <ChatBot
        steps={[
            {
                id: '0',
                message: 'How can I help you?',
                trigger: 'advise',
            },
            {
                id: 'advise',
                user: true,
                trigger: '2',
            },
            {
                id: '2',
                component: <Diagnosis/>,
                waitAction: false,
                trigger: '1',
            },
            {
                id: '1',
                message: 'Do you want to know the details?',
                trigger: 'search',
            },
            {
                id: 'search',
                user: true,
                trigger: '3',
            },
            {
                id: '3',
                component: <DBPedia/>,
                waitAction: false,
                trigger: '9',
            },
            {
                id: '9',
                message: 'How can I help you?',
                trigger: 'cure',
            },
            {
                id: 'cure',
                user: true,
                trigger: '6',
            },
            {
                id: '6',
                component: <Cure/>,
                waitAction: false,
                trigger: '10',
            },
            {
                id: '10',
                message: 'How can I help you?',
                trigger: 'analysis',
            },
            {
                id: 'analysis',
                user: true,
                trigger: '8',
            },
            {
                id: '8',
                component: <Analysis/>,
                waitAction: false,
                trigger: '0',
            },
        ]}
    />
);

export default ExampleDBPedia;