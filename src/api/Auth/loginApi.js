import axios from "axios";
const login = async (email, password) => {
  try {
    const response = await axios.post("https://schedulo.store/users/login/", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("로그인 실패:", error);
  }
};

export default login;
