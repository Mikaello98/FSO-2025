import React from 'react'
import { render, screen } from '@testing-library/react'
import Blog from '../components/Blog'
import { vi, describe, it, expect } from 'vitest'
import userEvent from '@testing-library/user-event'

describe('Blog component', () => {
  it('calls event handler twice when like button is clicked twice', async () => {
    const blog = {
      title: 'Testing like button',
      author: 'Tester',
      url: 'http://test.com',
      likes: 0,
      user: { username: 'root' }
    }

    const mockHandler = vi.fn()
    const user = userEvent.setup()

    render(
      <Blog blog={blog} onLike={mockHandler} user={{ username: 'root' }} />
    )

    const viewButton = screen.getByRole('button', { name: /view/i })
    await user.click(viewButton)

    const likeButton = screen.getByRole('button', { name: /like/i })
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler).toHaveBeenCalledTimes(2)
  })
})