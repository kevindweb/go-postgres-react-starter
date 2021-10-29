import React, { useState, useEffect } from "react"
import { Endpoints } from "../api"
import { deleteCookie } from "../utils"
import Errors from "../components/Errors"

const Question = ({ history }) => {
  const [question, setQuestion] = useState(null)
  const [answer, setAnswer] = useState(null)
  const [isFetching, setIsFetching] = useState(false)
  const [errors, setErrors] = useState([])

  const headers = {
    Accept: "application/json",
    Authorization: document.cookie.split("token=")[1],
  }

  const getQuestion = async () => {
    try {
      setIsFetching(true)
      const res = await fetch(Endpoints.question, {
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
    getQuestion()
  }, [])

  const handleChange = function (e) {
    // this.setState({ input: e.target.value });
    setAnswer(e.target.value);
  }

  const handleClick = function () {
    console.log(answer);
  }

  return (
    <div className="wrapper">
      <div>
        {isFetching ? (
          <div>fetching details...</div>
        ) : (
          <div>
            {question && (
              <div>
                <h1>{question}</h1>
                <input type="text" onChange={handleChange} />
                <input
                  type="button"
                  value="Alert the text input"
                  onClick={handleClick}
                />
                <br />
                {/* <button onClick={logout}>logout</button> */}
              </div>
            )}
          </div>
        )}

        <Errors errors={errors} />
      </div>
    </div>
  )
}

export default Question
