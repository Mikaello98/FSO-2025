import personService from '../services/persons'

const Persons = ({ persons, setPersons, showNotification }) => {
  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
      .remove(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id))
        showNotification(`Deleted ${name}`, 'success')
      })
      .catch (() => {
        showNotification(
          `Information of ${name}' has already been removed from server`,
          'error'
        )
        setPersons(persons.filter(p => p.id !== id))
      })
    }
  }

  return (
    <div>
      {persons.map((person) => (
        <div key={person.id}> 
          {person.name} {person.number} 
          <button onClick={() => handleDelete(person.id, person.name)}>delete</button>
        </div>
      ))}
    </div>
  )
}

export default Persons