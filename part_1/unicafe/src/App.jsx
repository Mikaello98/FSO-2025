import { useState } from 'react'

const Header = () => {
  return <h1>Give feedback</h1>
}

const Content = () => {
  return <h2>Statistics</h2>
}

const Button = (props) => {
  return  <button onClick={props.handleClick}>{props.text}</button>
}

const StatisticLine = (props) => {
  return (
    <tr>
      <td>{props.text}</td>: <td>{props.value}</td> 
      {/* Code breaks here, sadness */}
    </tr>
  )
}

const Statistics = (props) => {

  if (!(props.good || props.neutral || props.bad)) {
    return <p>No feedback given</p>
  }

  return (
    <table>
      <tbody>
        <StatisticLine text='Good' value={props.good} />
        <StatisticLine text='Neutral' value={props.neutral} />
        <StatisticLine text='Bad' value={props.bad} />
        <StatisticLine text='Total' value={props.good + props.neutral + props.bad} />
        <StatisticLine text='Average' value={(props.good - props.bad) / (props.good + props.neutral +props.bad)} />
        <StatisticLine text='Positive' value={(props.good * 100) / (props.good +props.neutral + props.bad) + ' %'} />
      </tbody>
    </table>
    
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

const goodClick = () => {
    setGood(good +1)
}

const neutralClick = () => {
    setNeutral(neutral +1)
}

const badClick = () => {
    setBad(bad +1)
}


  return (
    <div>
      <Header />
      <Button handleClick={goodClick} text='Good' />
      <Button handleClick={neutralClick} text='Neutral' />
      <Button handleClick={badClick} text='Bad' />
      <Content />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App
