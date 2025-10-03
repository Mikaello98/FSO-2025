import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

export const getAllAnecdotes = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

export const createNew = async (content) => {
  const anecdote = { content, votes: 0 }
  const response = await axios.post(baseUrl, anecdote)
  return response.data
}

export const updateVotes = async (anecdote) => {
  const updated = { ...anecdote, votes: anecdote.votes + 1 }
  const response = await axios.put(`${baseUrl}/${anecdote.id}`, updated)
  return response.data
}