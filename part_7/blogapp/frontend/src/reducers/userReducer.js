import storage from "../services/storage";
import loginService from "../services/login";

const userReducer = (state = null, action) => {
  switch (action.type) {
    case "user/login":
      return action.payload;
    case "user/logout":
      return null;
    case "user/set":
      return action.payload;
    default:
      return state;
  }
};

export const loginUser = (credentials) => {
  return async (dispatch) => {
    try {
      const user = await loginService.login(credentials);
      storage.saveUser(user);
      dispatch({ type: "user/login", payload: user });
    } catch (error) {
      throw error;
    }
  };
};

export const logoutUser = () => {
  return (dispatch) => {
    storage.clearUser();
    dispatch({ type: "user/logout" });
  };
};

export const setUserFromStorage = () => {
  return (dispatch) => {
    const user = storage.loadUser();
    if (user) {
      dispatch({ type: "user/set", payload: user });
    }
  };
};

export default userReducer;