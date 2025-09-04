import { useRef } from 'react'

const PersonForm = ({ 
    newName,
    newNumber,
    handleNameChange,
    handleNumberChange,
    addName
 }) => {
    const numberInputRef = useRef(null)

    return (
        <form onSubmit={addName}>
         <div>
           name:{''} 
            <input
             value={newName}
             onChange={handleNameChange}
             onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                numberInputRef.current.focus()
               }
              }} 
            />
         </div>
         <div>
           number:{''} 
            <input 
             ref={numberInputRef} 
             value={newNumber} 
             onChange={handleNumberChange} 
            />
         </div>
         <div>
          <button type='submit'>add</button>  
         </div>
        </form>
    )
}

export default PersonForm
