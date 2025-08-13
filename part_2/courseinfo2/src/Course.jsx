const Course = ({course}) => (
  <div>
    <Header course={course.name} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />
  </div>
)

const Header = ({course}) => <h2>{course}</h2>

const Content = ({parts}) => (
  <div>
    {parts.map((part) => (
      <Part key={part.id} part={part} />
    ))}
  </div>
)

const Total = ({parts}) => (
  <p><strong>
    Total of {parts.reduce((sum, part) => sum + part.exercises, 0)} exercises
  </strong></p>
) 

const Part = ({part}) => (
  <p>
    {part.name} {part.exercises}
  </p>
)

export default Course