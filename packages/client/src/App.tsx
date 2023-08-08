import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import './App.css'

function App() {
  useEffect(() => {
    const fetchServerData = async () => {
      const url = `http://localhost:${__SERVER_PORT__}`
      const response = await fetch(url)
      const data = await response.json()
      console.log(data)
    }

    fetchServerData()
  }, [])
  const { text } = useSelector(state => state)
  return <><div className="App">Вот тут будет жить ваше приложение :)</div><p>{text}</p></>
}

export default App
