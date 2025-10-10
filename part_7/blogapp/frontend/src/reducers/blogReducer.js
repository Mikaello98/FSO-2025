import blogService from "../services/blogs";

const blogReducer = (state = [], action) => {
  switch (action.type) {
    case "blogs/set":
      return action.payload;
    case "blogs/add":
      return [...state, action.payload];
    case "blogs/update":
      return state.map((blog) =>
        blog.id === action.payload.id ? action.payload : blog
      );
    case "blogs/remove":
      return state.filter((blog) => blog.id !== action.payload.id);
    default:
      return state;
  }
};

export const setBlogs = (blogs) => ({
  type: "blogs/set",
  payload: blogs,
});

export const addBlog = (blog) => ({
  type: "blogs/add",
  payload: blog,
});

export const updateBlog = (blog) => ({
  type: "blogs/update",
  payload: blog,
});

export const removeBlog = (id) => ({
  type: "blogs/remove",
  payload: id,
});

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs));
  };
};

export const createBlog = (newBlog) => {
  return async (dispatch) => {
    const created = await blogService.create(newBlog);
    dispatch(addBlog(created));
  };
};

export const likeBlog = (blog) => {
  return async (dispatch) => {
    const updated = await blogService.update(blog.id, {
      ...blog,
      likes: blog.likes + 1,
    });
    dispatch(updateBlog(updated));
  }
};

export const deleteBlog = (blog) => {
  return async (dispatch) => {
    await blogService.remove(blog.id);
    dispatch(removeBlog(blog.id));
  };
};

export default blogReducer;