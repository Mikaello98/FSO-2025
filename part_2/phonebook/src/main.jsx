import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

const persons = [
  { id: 1, name: 'Arto Hellas', number: '040-123456' },
  { id: 2, name: 'Ada Lovelace', number: '39-44-5323523' },
]

ReactDOM.createRoot(document.getElementById('root')).render(
    <App persons = {persons} />
)