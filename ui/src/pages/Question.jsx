import React, { useState, useEffect } from "react"
import { TextField, List, ListItem, ListItemText } from "@material-ui/core";
import { CircularProgress } from "@material-ui/core";
import { Endpoints } from "../api"
import { deleteCookie } from "../utils"
import Errors from "../components/Errors"


const Question = ({ history }) => {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [q_a, setQA] = useState([])
  const [isFetching, setIsFetching] = useState(false)
  const [errors, setErrors] = useState([])

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

  useEffect(() => {
    getQuestion(true)
  }, []);

  useEffect(() => {
    console.log(q_a);
  }, [q_a]);

  const handleClick = function () {
    setQA([...q_a, [question, answer]]);
    getQuestion(false);
    setAnswer("");
  }

  const handleChange = function (e) {
    if (e.keyCode === 13) {
      handleClick();
    }
  }

  return (
    <div className="wrapper">
      <div>
        {isFetching ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}>
            {question && <h1>{question}</h1>}
            <CircularProgress size="25px" />
            <br />
          </div>
        ) : (
          <div>
            {question ? (
              <h1>{question}</h1>
            ) : (
              <h1>Question could not load</h1>
            )}
          </div>
        )}

        <TextField id="answer" label="Your answer"
          variant="outlined" value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyUp={handleChange}
          inputProps={{
            autoComplete: 'no-auto',
            form: {
              autoComplete: 'off'
            }
          }}
        />
        {q_a.length > 0 &&
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
        }

        <Errors errors={errors} />
      </div >
    </div>
  )
}

export default Question
