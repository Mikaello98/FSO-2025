import React from 'react'
import { render, screen } from '@testing-library/react'
import BlogForm from '../components/BlogForm'
import { vi, describe, it, expect } from 'vitest'
import userEvent from '@testing-library/user-event'

describe('Blogform component', () => {
  it('calls onCreate with correct details when a new blog is created', async () => {
    const mockHandler = vi.fn()
    const user = userEvent.setup()

    render(<BlogForm onCreate={mockHandler} />)

    const titleInput = screen.getByPlaceholderText('Title')
    const authorInput = screen.getByPlaceholderText('Author')
    const urlInput = screen.getByPlaceholderText('Url')

    await user.type(titleInput, 'Test Blog')
    await user.type(authorInput, 'Test Author')
    await user.type(urlInput, 'http://test.com')

    const createButton = screen.getByRole('button', { name: /create/i })
    await user.click(createButton)

    expect(mockHandler).toHaveBeenCalledTimes(1)

    expect(mockHandler).toHaveBeenCalledWith({
      title: 'Test Blog',
      author: 'Test Author',
      url: 'http://test.com'
    })
  })
})