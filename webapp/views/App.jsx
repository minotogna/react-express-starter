import React, { useEffect, useState } from 'react'

import style from './App.scss'

const App = () => {
  const [message, setMessage] = useState('')

  useEffect(() => {
    // simple api fetch
    fetch('/api/welcome')
      .then((response) => response.json())
      .then((jsonResponse) => setMessage(jsonResponse))
  }, [])

  return (
    <div className={style.app}>
      <h1>{message}</h1>
    </div>
  )
}

export default App
