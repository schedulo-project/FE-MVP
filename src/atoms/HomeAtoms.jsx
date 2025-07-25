import { atom } from "jotai";
import GetCookie from "../api/GetCookie";

//모달에 대한 ataom
export const isModalOpenAtom = atom(false);
export const modalDataAtom = atom({});

export const eventsAtoms = atom([]);

export const homeSidebarAtoms = atom(false);

export const WitchGroupAtom = atom("기본 정렬");

//토글 열린지 아닌지 관리하는 atom
export const openGroupsAtom = atom({});

export const handelCheckAtom = atom(
  null,
  async (get, set, id) => {
    const todoList = get(eventsAtoms);
    const task = todoList.find((t) => t.id === id);
    if (!task) return;

    const updatedTask = {
      ...task,
      is_completed: !task.is_completed,
    };

    const newList = todoList.map((t) =>
      t.id === id ? updatedTask : t
    );
    set(eventsAtoms, newList);

    await ScheduleCompleteOrNot({ data: updatedTask });
  }
);

// handleChange 역할을 하는 atom
export const handleChangeAtom = atom(
  null,
  (get, set, { data, id }) => {
    const prevEvents = get(eventsAtoms);

    if (data === null) {
      set(
        eventsAtoms,
        prevEvents.filter((event) => event.id !== id)
      );
    } else {
      set(
        eventsAtoms,
        prevEvents.map((event) =>
          event.id === id ? { ...event, ...data } : event
        )
      );
    }
  }
);

// 태그에 대한 atom
export const tagListAtom = atom([]);

// 태그에 대한 atom -> id 포함 버전
export const tagIdListAtom = atom([]);

const ScheduleCompleteOrNot = async ({ data }) => {
  const Logindata = await GetCookie();
  const token = Logindata.access;
  const tagNames = data.tagName;

  const tags = tagNames
    ? tagNames.split(",").map((tag) => tag.trim())
    : [];
  const id = `${data.id}/`;

  try {
    const response = await fetch(
      `https://schedulo.store/schedules/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: data.title,
          content: data.content,
          scheduled_date: data.date,
          tag: tags,
          deadline: data.deadline,
          is_completed: data.is_completed,
        }),
      }
    );

    const result = await response.json();
    console.log("업데이트 완료:", result);
    return result;
  } catch (error) {
    console.error("백엔드 오류:", error);
    return null;
  }
};
