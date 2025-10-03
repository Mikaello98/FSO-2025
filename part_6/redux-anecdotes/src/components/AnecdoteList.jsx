import { useSelector, useDispatch } from "react-redux";
import { voteAnecdote } from "../reducers/anecdoteReducer";
import { showNotification } from "../reducers/notificationReducer";

const AnecdoteList = () => {
  const dispatch = useDispatch();
  const anecdotes = useSelector(({ anecdotes, filter }) => 
     anecdotes
      .filter(a => a.content.toLowerCase().includes(filter.toLowerCase()))
      .sort((a, b) => b.votes - a.votes)
  );

  const vote = (anecdote) => {
    dispatch(voteAnecdote(anecdote));
    dispatch(showNotification(`you voted '${anecdote.content}'`, 5));
  };

  return (
    <div>
      {anecdotes.map(anecdote => 
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnecdoteList;