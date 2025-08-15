import { useState, useRef } from 'react'

const Names = ({ person }) => {
  return (
    <div>
      {person.name} {person.number}
    </div>
  )
}

const App = (props) => {
  const [persons, setPersons] = useState(props.persons)
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const nameInputRef = useRef(null)
  const numberInputRef = useRef(null)

  const addName= (event) => {
    event.preventDefault()

    const trimmedName = newName.trim()
    const trimmedNumber = newNumber.trim()

    if (!trimmedName || !trimmedNumber) {
      alert('Please enter both  a name and a number')
      return
    }

    if (persons.some(
        person => person.name.toLowerCase() === newName.toLowerCase()
    )) {
        alert(`${trimmedName} is already in the phonebook`)
        return
    }

    const nameObject = {
      id: Math.max(0, ...persons.map(p => p.id || 0)) + 1,
      name: trimmedName,
      number: trimmedNumber,
    }
    setPersons(persons.concat(nameObject))
    setNewName('')
    setNewNumber('')
    nameInputRef.current.focus()
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter shown with:{""}
        <input value={searchTerm} onChange={handleSearchChange} />
      </div>
      <h3>add a new</h3>
      <form onSubmit={addName}>
        <div>
          name: <input ref={nameInputRef} value={newName} onChange={handleNameChange} onKeyDown={(e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      numberInputRef.current.focus()
     }}} />
        </div>
        <div>
          number: <input ref={numberInputRef} value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type='submit'>add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {filteredPersons.map((person) => {
        return <Names key={person.id} person={person} />
      })}
    </div>
  )
}

export default App 