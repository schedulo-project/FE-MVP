import axios from "axios";

const signup = async (email, password, studentId, studentPassword) => {
  try {
    const response = await axios.post("https://schedulo.store/users/signup/", {
      email,
      password,
      studentId,
      studentPassword,
    });
    return response.data;
  } catch (error) {
    console.error("회원가입 실패:", error);
  }
};

export default signup;
