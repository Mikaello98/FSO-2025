import { test, expect, beforeEach, describe } from '@playwright/test';

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')

    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await request.post('/api/users', {
      data: {
        name: 'Other User',
        username: 'otheruser',
        password: 'password'
      }
    })

    await page.goto('http://localhost:5173')
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('textbox').first().fill('mluukkai')
      await page.getByRole('textbox').nth(1).fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()

      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByPlaceholder('title').fill('Protected Blog')
      await page.getByPlaceholder('author').fill('Test author')
      await page.getByPlaceholder('url').fill('http://protected.com')
      await page.getByRole('button', { name: 'create' }).click()

      await page.getByRole('button', { name: 'logout' }).click()
    })

    test('only creator sees the remove button', async ({ page }) => {
      await page.getByRole('textbox').first().fill('otheruser')
      await page.getByRole('textbox').nth(1).fill('password')
      await page.getByRole('button', { name: 'login' }).click()

      const blog = page.locator('.blog', { hasText: 'Protected Blog' }).first()
      await expect(blog).toBeVisible()

      await blog.getByRole('button', { name: 'view' }).click()

      await expect(blog.getByRole('button', { name: 'remove' })).toHaveCount(0)
    })

    test.only('blogs are ordered by number of likes, most liked first', async ({ page }) => {
      const blogs = [
        { title: 'Least liked blog', author: 'Author1', url: 'http://1.com'},
        { title: 'Medium liked blog', author: 'Author2', url: 'http://2.com'},
        { title: 'Most liked blog', author: 'Author3', url: 'http://3.com'}
      ]

      for (const blog of blogs) {
        await page.getByRole('button', { name: 'create new blog' }).click()
        await page.getByPlaceholder('title').fill(blog.title)
        await page.getByPlaceholder('author').fill(blog.author)
        await page.getByPlaceholder('url').fill(blog.url)
        await page.getByRole('button', { name: 'create' }).click()
      }

      const allBlogs = page.locator('.blog')
      const count = await allBlogs.count()
      for (let i = 0; i < count; i++) {
        await allBlogs.nth(i).getByRole('button', { name: 'view' }).click()
      }

      const likeBlog = async (title, times) => {
        const blog = page.locator('.blog', { hasText: title }).first()
        const likeButton = blog.getByRole('button', { name: 'like' })
        for (let i = 0; i < times; i++) {
          await likeButton.click()
          await page.waitForTimeout(200)
        }
      }

      await likeBlog('Medium liked blog', 2)
      await likeBlog('Most liked blog', 5)

      const blogTexts = await allBlogs.allTextContents()

      expect(blogTexts[0]).toContain('Most liked blog')
      expect(blogTexts[1]).toContain('Medium liked blog')
      expect(blogTexts[2]).toContain('Least liked blog')
    })
  })
})
