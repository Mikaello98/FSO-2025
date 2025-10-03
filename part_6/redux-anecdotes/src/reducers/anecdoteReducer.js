import { createSlice } from "@reduxjs/toolkit"
import * as anecdoteService from "../services/anecdotes"
import { showNotification } from "./notificationReducer"

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    setAnecdotes(state, action) {
      return action.payload
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    updateAnecdote(state, action) {
      const updated = action.payload
      return state.map(a => a.id !== updated.id ? a : updated)
    }
  }
})

export const { setAnecdotes, appendAnecdote, updateAnecdote } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAllAnecdotes()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = (content) => {
  return async dispatch => {
    try {
      if (content.length < 5) {
        throw new Error('Anecdote must be at least 5 characters long')
      }
      const newAnecdote = await anecdoteService.createNew(content)
      dispatch(appendAnecdote(newAnecdote))
      dispatch(showNotification(`You created '${newAnecdote.content}'`, 5))
    } catch (error) {
      dispatch(showNotification(error.message, 5))
    }
  }
}

export const voteAnecdote = (anecdote) => {
  return async dispatch => {
    const updated = await anecdoteService.updateVotes(anecdote)
    dispatch(updateAnecdote(updated))
    dispatch(showNotification(`You voted '${updated.content}'`, 5))
  }
}

export default anecdoteSlice.reducer