import axios from "axios";
import GetCookie from "./GetCookie";

const addTags = async (name) => {
  const Logindata = await GetCookie();
  const token = Logindata.access;

  try {
    const response = await axios.post(
      `http://13.124.140.60/schedules/tags/`,
      {
        name: name,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("response", response);
    return response;
  } catch (error) {
    if (error.response) {
      // 서버 응답이 있는 경우
      console.error("Server Error:", error.response.data);
    } else {
      // 서버 응답이 없는 경우
      console.error("Network Error:", error.message);
    }
    throw error; // 에러를 호출한 쪽에서 처리할 수 있도록 던짐
  }
};

export default addTags;
