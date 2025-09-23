import React from 'react'
import { render, screen } from '@testing-library/react'
import Blog from '../components/Blog'
import { describe, test, expect } from 'vitest'
import userEvent from '@testing-library/user-event'

describe('Blog component', () => {
  test('shows url, likes and user when view button is clicked', async () => {
    const blog = {
      title: 'Testing full view',
      author: 'Tester',
      url: 'http://test.com',
      likes: 42,
      user: { username: 'root' }
    }

    const mockLike = vi.fn()
    const mockDelete = vi.fn()
    const mockUser = { username: 'root' }

    render(
      <Blog blog={blog} onLike={mockLike} onDelete={mockDelete} user={mockUser} />
    )

    expect(screen.queryByText('http://test.com')).toBeNull()
    expect(screen.queryByText(/Likes:/)).toBeNull()
    expect(screen.queryByText(/Added by:/)).toBeNull()

    const userClick = userEvent.setup()
    const viewButton = screen.getByText('view')
    await userClick.click(viewButton)

    expect(screen.getByText(/http:\/\/test\.com/i)).toBeDefined()
    expect(screen.getByText('Likes: 42')).toBeDefined()
    expect(screen.getByText('Added by: root')).toBeDefined()
  })
})