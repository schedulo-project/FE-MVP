import TagItem from "../components/TagItem";
import { useAtom } from "jotai";
import { eventsAtoms, tagIdListAtom } from "../atoms/HomeAtoms";
import { useEffect } from "react";
import fetchSchedules from "../api/checkScheduleApi";
import getTagList from "../api/getTagsListApi";
import TagAddModal from "../components/TagAddModal";

import plusBtn from "../assets/tag/plusBtn.svg";

//모달
import ScheduleModal from "../components/ScheduleModal";
import { tagModalAtom } from "../atoms/TagAtoms";
import { tagListAtom } from "../atoms/HomeAtoms";

const Tag = () => {
  // 일정 데이터 불러오기(api)
  const [allEvents, setEvents] = useAtom(eventsAtoms);

  //태그 리스트 불러오기(api)
  const [allTags, setAllTags] = useAtom(tagIdListAtom);

  const [, setTagModalOpen] = useAtom(tagModalAtom);
  const [, setTagList] = useAtom(tagListAtom);

  //페이지가 처음 로드 될 때 태그 목록을 가져온다.
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tags = await getTagList(); // 실제 API 호출
        setAllTags(tags); // 응답 결과 저장
        const newTags = tags
          .map((tag) => tag.name)
          .map((name) => ({
            value: name,
            label: name,
          }));
        setTagList(newTags);
      } catch (error) {
        console.error("태그 불러오기 실패:", error);
      }
    };
    fetchTags();
    console.log(
      "태그 목록이 성공적으로 불러와졌습니다:",
      allTags
    );
  }, []);

  // 페이지가 처음 로드될 때만 데이터를 불러오도록 useEffect 사용 이미 있으면 통신 안 함
  useEffect(() => {
    if (allEvents.length > 0) {
      // 이미 데이터가 있으면 통신 안 함
      return;
    }

    const loadSchedules = async () => {
      try {
        const transformedEvents = await fetchSchedules(
          "2025-02-28",
          "2025-12-30"
        );
        setEvents(transformedEvents);
      } catch (error) {
        console.error("Error loading schedules", error);
      }
    };
    loadSchedules();
  }, [allEvents, setEvents]);

  // 이벤트를 태그별로 그룹화하는 함수
  // 단순히 태그 이름을 기준으로 그룹화하고, 태그가 없는 작업은 별도로 모아둠, 완료된 작업과 되지 않은 작업은 구분하지 않음

  //이건 태그 일정 하나만 들어가게 하는 코드
  // const groupBy = (list, tagList) => {
  //   // 태그맵 (태그명 -> 태그 객체)
  //   const tagMap = new Map(
  //     tagList.map((tag) => [tag.name, tag])
  //   );

  //   // 모든 태그를 빈 배열 task와 함께 초기화
  //   const tagGroups = new Map();
  //   tagList.forEach((tag) => {
  //     tagGroups.set(tag.id, {
  //       tagId: tag.id,
  //       tag: tag.name,
  //       task: [],
  //     });
  //   });

  //   const noTagGroup = [];

  //   list.forEach((task) => {
  //     // 태그가 없는 작업은 별도로 모음
  //     if (!task.tagName) {
  //       noTagGroup.push(task);
  //       return;
  //     }

  //     // 첫 번째 태그만 사용
  //     const firstTagName = task.tagName.split(",")[0].trim();
  //     const tag = tagMap.get(firstTagName);

  //     if (tag) {
  //       tagGroups.get(tag.id).task.push(task);
  //     } else {
  //       noTagGroup.push(task);
  //     }
  //   });

  //   const result = [...tagGroups.values()];

  //   if (noTagGroup.length > 0) {
  //     result.push({
  //       tagId: null,
  //       tag: "태그 없음",
  //       task: noTagGroup,
  //     });
  //   }

  //   return result;
  // };

  const groupBy = (list, tagList) => {
    const tagMap = new Map(
      tagList.map((tag) => [tag.name, tag])
    );

    // 태그별 그룹 미리 빈 배열로 초기화
    const tagGroups = new Map();
    tagList.forEach((tag) => {
      tagGroups.set(tag.id, {
        tagId: tag.id,
        tag: tag.name,
        color: tag.color,
        task: [],
      });
    });

    const noTagGroup = [];

    list.forEach((task) => {
      if (!task.tagName) {
        noTagGroup.push(task);
        return;
      }

      // 콤마로 구분된 모든 태그 이름 배열
      const tagsInTask = task.tagName
        .split(",")
        .map((t) => t.trim());

      // 이 일정이 속한 태그를 하나도 못 찾으면 noTagGroup에 넣기 위한 플래그
      let matched = false;

      tagsInTask.forEach((tagName) => {
        const tag = tagMap.get(tagName);
        if (tag) {
          matched = true;
          tagGroups.get(tag.id).task.push(task);
        }
      });

      if (!matched) {
        noTagGroup.push(task);
      }
    });

    const result = [...tagGroups.values()];
    if (noTagGroup.length > 0) {
      result.push({
        tagId: null,
        tag: "태그 없음",
        color: "#9CA3AF",
        //기본 색상
        task: noTagGroup,
      });
    }

    return result;
  };

  // 데이터 없으면 로딩 표시
  if (
    !allTags ||
    allTags.length === 0 ||
    !allEvents ||
    allEvents.length === 0
  ) {
    return (
      <div className="text-center mt-10">데이터 로딩 중...</div>
    );
  }

  return (
    <div className="flex justify-center">
      <TagAddModal />
      <ScheduleModal />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {groupBy(allEvents, allTags).map((group) => (
          <TagItem
            key={group.tagId ?? "no-tag"}
            eventsList={group}
          />
        ))}
        <div
          className="flex justify-center items-center w-[16rem] h-[24rem] bg-[#F0F0F0] shadow-[0px_3.759999990463257px_3.759999990463257px_0px_rgba(0,0,0,0.25)] border-[0.47px] border-stone-500 rounded-2xl p-8"
          onClick={() => {
            setTagModalOpen(true);
          }}
        >
          <img src={plusBtn} />
        </div>
      </div>
    </div>
  );
};

export default Tag;
