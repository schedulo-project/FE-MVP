import axios from "axios";
import GetCookie from "./GetCookie";

const getTags = async () => {
  const Logindata = await GetCookie();
  const token = Logindata.access;

  try {
    const response = await axios.get(
      `https://schedulo.store/schedules/tags/`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const tagNames = response.data
      .map((tag) => tag.name)
      .map((name) => ({
        value: name,
        label: name,
      }));

    return tagNames;
  } catch (error) {
    console.error("error", error);
  }
};

export default getTags;
