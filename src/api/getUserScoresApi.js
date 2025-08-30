import axios from "axios";
import GetCookie from "./GetCookie";

const getScores = async () => {
  const Logindata = await GetCookie();
  const token = Logindata.access;

  try {
    const response = await axios.get(
      `https://schedulo.store/users/scores/`,

      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("error", error);
  }
};

export default getScores;
