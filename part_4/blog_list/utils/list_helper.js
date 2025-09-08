const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null
  return blogs.reduce((favorite, blog) => {
    return blog.likes > favorite.likes ? blog : favorite
  }) 
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const blogCount = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + 1
    return acc
  }, {})

  let topAuthor = null
  let maxBlogs = 0

  for (const author in blogCount) {
    if (blogCount[author] > maxBlogs) {
      topAuthor = author
      maxBlogs = blogCount[author]
    }
  }

  return {
    author: topAuthor,
    blogs: maxBlogs
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const likesCount = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + (blog.likes || 0)
    return acc
  }, {})

  let topAuthor = null
  let maxLikes = 0

  for (const author in likesCount) {
    if (likesCount[author] > maxLikes) {
      topAuthor = author
      maxLikes = likesCount[author]
    }
  }

  return {
    author: topAuthor,
    likes: maxLikes
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}