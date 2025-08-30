import axios from "axios";
import GetCookie from "./GetCookie";

const alarmToggle = async ({ today, deadline }) => {
  const Logindata = await GetCookie();
  const token = Logindata.access;

  try {
    const response = await axios.patch(
      `https://schedulo.store/notifications/noti-setting/`,
      {
        notify_today_schedule: today,
        notify_deadline_schedule: deadline,
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

export default alarmToggle;
