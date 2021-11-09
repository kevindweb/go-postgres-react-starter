import React, { useState, useEffect, Component } from "react"
import { Endpoints } from "../api"
import PropTypes from 'prop-types';
import { deleteCookie } from "../utils"
import Errors from "../components/Errors"
import ChatBot, { Loading } from 'react-simple-chatbot';

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

  getQuestion = async (firstQuestion) => {
    try {
      setIsFetching(true)
      var queryString = "";
      if (firstQuestion) {
        queryString = "?first=true"
      }

      const res = await fetch(Endpoints.question + queryString, {
        method: "GET",
        credentials: "include",
        headers,
      })

      if (!res.ok) console.log("Bad")
      // function readyStateChange() {
      // if (this.readyState === 4) {
      //   const data = JSON.parse(this.responseText);
      //   const bindings = data.results.bindings;
      if (bindings && bindings.length > 0) {
        self.setState({ loading: false, result: bindings[0].comment.value });
      } else {
        self.setState({ loading: false, result: 'Not found.' });
      }
      // }
      // }

      //   const { success, errors = [], question } = await res.json()
      //   setErrors(errors)
      //   if (!success) history.push("/login")
      //   setQuestion(question)
      // } catch (e) {
      //   setErrors([e.toString()])
      // } finally {
      //   setIsFetching(false)
      // }
    }

  componentWillMount() {
      const self = this;
      const { steps } = this.props;
      const search = steps.search.value;
      console.log(steps, this.props);
      // const endpoint = encodeURI('https://dbpedia.org');
      // const query = encodeURI(`
      //   select * where {
      //   ?x rdfs:label "${search}"@en .
      //   ?x rdfs:comment ?comment .
      //   FILTER (lang(?comment) = 'en')
      //   } LIMIT 100
      // `);

      // const queryUrl = `https://dbpedia.org/sparql/?default-graph-uri=${endpoint}&query=${query}&format=json`;

      // const xhr = new XMLHttpRequest();

      // xhr.addEventListener('readystatechange', readyStateChange);


      // xhr.open('GET', queryUrl);
      // xhr.send();

      var queryString = "";
      if (firstQuestion) {
        queryString = "?first=true"
      }

      const res = await fetch(Endpoints.question + queryString, {
        method: "GET",
        credentials: "include",
        headers,
      })

      if (!res.ok) logout()
    }

    triggetNext() {
      this.setState({ trigger: true }, () => {
        this.props.triggerNextStep();
      });
    }

    render() {
      const { trigger, loading, result } = this.state;

      return (
        <div className="dbpedia">
          {loading ? <Loading /> : result}
          {
            !loading &&
            <div
              style={{
                textAlign: 'center',
                marginTop: 20,
              }}
            >
              {
                !trigger &&
                <button
                  onClick={() => this.triggetNext()}
                >
                  Search Again
                </button>
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

  // const Zeevis = (props) => {
  //   console.log(props);
  // }

  const Question = ({ history }) => {
    const [question, setQuestion] = useState("Loading...")
    const [answer, setAnswer] = useState("")
    const [q_a, setQA] = useState([])
    const [isFetching, setIsFetching] = useState(false)
    const [errors, setErrors] = useState([])
    // const [steps, setSteps] = useState([])

    const headers = {
      Accept: "application/json",
      Authorization: document.cookie.split("token=")[1],
    }

    const getQuestion = async (firstQuestion) => {
      try {
        setIsFetching(true)
        var queryString = "";
        if (firstQuestion) {
          queryString = "?first=true"
        }

        const res = await fetch(Endpoints.question + queryString, {
          method: "GET",
          credentials: "include",
          headers,
        })

        if (!res.ok) logout()

        const { success, errors = [], question } = await res.json()
        setErrors(errors)
        if (!success) history.push("/login")
        setQuestion(question)
      } catch (e) {
        setErrors([e.toString()])
      } finally {
        setIsFetching(false)
      }
    }

    const logout = async () => {
      const res = await fetch(Endpoints.logout, {
        method: "GET",
        credentials: "include",
        headers,
      })

      if (res.ok) {
        deleteCookie("token")
        history.push("/login")
      }
    }

    // useEffect(() => {
    //   getQuestion(true)
    // }, []);

    // useEffect(() => {
    // }, [q_a]);

    // const handleClick = function () {
    //   console.log(question);
    //   console.log("\t", answer);
    //   setQA([...q_a, [question, answer]]);
    //   getQuestion(false);
    //   setAnswer("");
    // }

    // const handleChange = function (e) {
    //   if (e.keyCode === 13) {
    //     handleClick();
    //   }
    // }

    // {
    //   id: '0',
    //   // message: 'Welcome to react chatbot!',
    //   component: <Zeevis />,
    //   waitAction: true,
    //   trigger: '1',
    // },
    // {
    //   id: '1',
    //   user: true,
    //   placeholder: "Ideas...",
    //   trigger: '0',
    // },
    const steps = [
      {
        id: '1',
        message: 'Type something to search on Wikipédia. (Ex.: Brazil)',
        trigger: 'search',
      },
      {
        id: 'search',
        user: true,
        trigger: '3',
      },
      {
        id: '3',
        component: <DBPedia />,
        waitAction: true,
        trigger: '1',
      },
      // {
      //   id: '3',
      //   message: 'Hi {previousValue}, nice to meet you!',
      //   end: true,
      // },
    ];

    return (
      <div className="wrapper">
        <div>
          <ChatBot
            headerTitle="Zeevis"
            recognitionEnable={true}
            steps={steps} />
          {/* <App /> */}
          {/* {isFetching && (
          <div style={{
            display: 'flex',
            alignitems: 'center',
            flexwrap: 'wrap',
          }}>
            <CircularProgress size="25px" />
            <br />
          </div>
        )}

        <TextField id="answer" label={question}
          variant="outlined" value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyUp={handleChange}
          fullWidth
          autoComplete="off"
          inputProps={{
            autoComplete: 'no-auto',
            form: {
              autoComplete: 'off'
            }
          }}
        /> */}

          {/* {q_a.length > 0 &&
          <List
            sx={{
              width: '100%',
              maxWidth: 360,
              bgcolor: 'background.paper',
              position: 'relative',
              overflow: 'auto',
              maxHeight: 300,
              '& ul': { padding: 0 },
            }}
            subheader={<li />}
          >
            <li key={`section-test`}>
              <ul>
                {
                  q_a.map((question_answer, inx) => (
                    <div key={`item-qa-${inx}`}>
                      <ListItem key={`item-${inx}-question`}>
                        <ListItemText key={`item-textq-${inx}`} primary={`${question_answer[0]}`} />
                      </ListItem>
                      <ListItem key={`item-${inx}-answer`}>
                        <ListItemText key={`item-texta-${inx}`} inset primary={`${question_answer[1]}`} />
                      </ListItem>
                    </div>
                  ))
                }
              </ul>
            </li>
          </List>
        } */}

          {/* <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
          <List component="nav" aria-label="main mailbox folders">
            <ListItemIcon>
              <IconButton />
            </ListItemIcon>
            <ListItemText primary="Inbox" />
            <ListItemIcon>
              <IconButton />
            </ListItemIcon>
            <ListItemText primary="Drafts" />
          </List>
          <Divider />
          <List component="nav" aria-label="secondary mailbox folder">
            <ListItemText primary="Trash" />
            <ListItemText primary="Spam" />
          </List>
        </Box> */}

          <Errors errors={errors} />
        </div >
      </div>
    )
  }

export default Question
