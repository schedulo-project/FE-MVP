import React, {
  useEffect,
  useState,
  useMemo,
  useNavigate,
} from "react";
import Calendar from "../components/Calendar";
import CheckSchedule from "../components/CheckSchedule";
import ScheduleModal from "../components/ScheduleModal";
import fetchSchedules from "../api/checkScheduleApi";
import fetchECampusSchedule from "../api/ECampusScheduleFetcher";
import StudyPlanModal from "../components/studyplan/StudyPlanModal";

//jotai
import { useAtom } from "jotai";
import {
  eventsAtoms,
  homeSidebarAtoms,
  isModalOpenAtom,
  modalDataAtom,
  tagListAtom,
  openGroupsAtom,
} from "../atoms/HomeAtoms";
import getTags from "../api/getTagsApi";

const Home = () => {
  // 임시 데이터
  const [events, setEvents] = useAtom(eventsAtoms); // 일정조회 api로 불러온 일정 데이터들
  const [selectedDateEvents, setSelectedDateEvents] = useState(
    []
  ); // 선택된 날짜의 데이터
  const [selectedDate, setSelectedDate] = useState(null); // 선택된 날짜 상태 추가

  // TodoList에서 체크된 일정의 상태를 관리하는 useState와는 별개로 사용됨
  const [, setIsModalOpen] = useAtom(isModalOpenAtom);

  const [modalData, setModalData] = useAtom(modalDataAtom); // 모달에 보여줄 데이터
  const today = new Date().toISOString().split("T")[0]; // 오늘 날짜 불러오기

  const [isPlanCompleted, setIsPlanCompleted] = useState(false); // 공부계획 완료 여부 상태

  useEffect(() => {
    const completed = localStorage.getItem("planSetupCompleted");
    setIsPlanCompleted(completed === "true");
  }, []);

  // 화면 크기 감지하는 코드
  const [windowWidth, setWindowWidth] = useState(
    window.innerWidth
  );
  // windowWidth가 1023보다 작으면 모바일로 간주하기 위한 조건
  const isHalf = windowWidth < 1023;
  //일정 조회가 사이드바처럼 나오게 하기 위한 상태 관리, 클릭했을 때 CheckSchedule의 내부에서 버튼으로 화면을 닫을 수 있도록 하기 위해서 jotai로 관리함
  const [isSidebarOpen, setSidebarOpen] =
    useAtom(homeSidebarAtoms);

  // 태그 리스트 불러오기
  const [, setTagList] = useAtom(tagListAtom); // jotai 전역 태그 리스트 setter

  useEffect(() => {
    const fetchTags = async () => {
      const response = await getTags();

      setTagList(response);
    };
    fetchTags();
  }, []);
  //일정 토글을 다른 날짜를 누르면 초기화 되게 하는 Atom
  const [, setOpenGroups] = useAtom(openGroupsAtom);

  // 화면 크기 감지하는 훅
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () =>
      window.removeEventListener("resize", handleResize);
  }, []);

  //화면이 커질 때 사이드 바 열린 상태 초기화
  useEffect(() => {
    if (windowWidth >= 1023) {
      setSidebarOpen(false);
    }
    // if (windowWidth < 1023) {
    //   // 작아지는 순간 모달 닫기
    //   setIsModalOpen(false);
    // }
  }, [windowWidth, isSidebarOpen]);

  // 일정 데이터 불러오기(api)
  useEffect(() => {
    const loadSchedules = async () => {
      try {
        const transformedEvents = await fetchSchedules(
          "2025-02-28",
          "2025-12-30"
        );
        console.log("가공한 서버데이터", transformedEvents);
        setEvents(transformedEvents);
      } catch (error) {
        console.error("Error loading schedules", error);
      }
    };
    loadSchedules();
  }, []);

  // 선택된 날짜의 일정 업데이트
  useEffect(() => {
    const dateFilter = selectedDate || today; // 클릭된 날짜가 없으면 오늘 날짜 사용
    const eventsOnDate = events.filter(
      // 오늘(today) or 클릭된 날짜에 해당하는 이벤트 필터링 후 반환
      (event) => event.date === dateFilter
    );
    setSelectedDateEvents(eventsOnDate);
  }, [events, selectedDate, today]);

  console.log("events", events);
  // 날짜 클릭 시 선택된 날짜 업데이트
  const handleDateClick = (date) => {
    setOpenGroups({});
    setSelectedDate(date);
    //화면 크기가 1023보다 작으면 사이드바 열리게 하기 클릭도 하고 작은것도 확인해야하는 2중 코드
    if (isHalf) {
      setSidebarOpen(true);
    }
  };

  // 캘린더 일정 클릭 시 모달 켜기
  const handleEventClick = (clickInfo) => {
    const clickedEvent = clickInfo.event; // clickedEvent : 클릭된 일정의 정보

    // clickedEventData : 클린된 일정의 정보 가공한 데이터
    const clickedEventData = {
      id: Number(clickedEvent.id), // 고친 부분 기존에는 string으로 들어옴 event.id는 number여서 문제가 생겼음

      title: clickedEvent.title,
      date: clickedEvent.startStr,
      content: clickedEvent.extendedProps.content || "",
      tagName: clickedEvent.extendedProps.tagName || "",
      tagColor: clickedEvent.extendedProps.tagColor || "", // 태그 색상 추가
      is_completed: clickedEvent.extendedProps.is_completed,
      deadline: clickedEvent.extendedProps.deadline || null,
    };
    console.log("clickedEvent", clickedEvent);
    console.log("clickInfo", clickInfo);

    setModalData(clickedEventData);
    setIsModalOpen(true);
  };

  // FullCalendar에 맞게 이벤트 형식 변환 (3개까지만 표시, 초과 시 "..." 추가)
  const calendarEvents = events
    .filter((event) => !event.is_completed) // 완료되지 않은 일정만 포함
    .reduce((acc, event) => {
      const existingDate = acc.find(
        (item) => item.date === event.date
      );
      if (existingDate) {
        // 이미 해당 날짜가 있는 경우
        if (existingDate.events.length < 3) {
          existingDate.events.push(event);
        } else if (!existingDate.hasMore) {
          existingDate.hasMore = true; // 초과 일정 표시
        }
      } else {
        // 새로운 날짜 추가
        acc.push({
          date: event.date,
          events: [event],
          hasMore: false,
        });
      }
      return acc;
    }, [])
    // FullCalendar에 맞는 이벤트 배열로 변환
    .flatMap((item) => {
      // 날짜별로 일정과 "..." 추가
      const limitedEvents = item.events.map((event) => ({
        id: event.id,
        title: event.title,
        date: event.date,
        tagName: event.tagName,
        tagColor: event.tagColor || "", // 태그 색상 추가
        is_completed: event.is_completed,
        content: event.content,
        deadline: event.deadline,
      }));

      // "..."을 가장 위에 추가
      if (item.hasMore) {
        limitedEvents.push({
          id: `${item.date}`,
          title: "etc..",
          date: item.date,
          tagName: "",
          is_completed: false,
          content: "",
          deadline: null,
          classname: "event-item-dots",
        });
      }

      return limitedEvents;
    });

  // 이캠퍼스 크롤링 데이터 가져오기
  const handleFetchECampus = async () => {
    try {
      const response = await fetchECampusSchedule();

      if (!response || !response.courses) {
        alert("샘물 데이터를 불러오지 못했습니다.");
        return;
      }

      const { courses } = response;

      // 모든 과목의 일정이 비어 있는지 확인
      const isAllEmpty = Object.values(courses).every(
        (arr) => Array.isArray(arr) && arr.length === 0
      );

      if (isAllEmpty) {
        alert("샘물에서 가져올 일정이 없습니다.");
        return;
      }

      // 일정 데이터 가공
      const newEvents = Object.entries(courses).flatMap(
        ([courseName, items]) =>
          items.map((item, index) => ({
            id: Date.now() + Math.random() + index,
            title: `${courseName} - ${item.title}`,
            date: item.scheduled_date,
            content: item.content || "",
            tagName: item.tagName || "",
            is_completed: item.is_completed ?? false,
            deadline: item.deadline ?? null,
          }))
      );

      // 기존 이벤트와 병합
      setEvents((prev) => [...prev, ...newEvents]);
      alert("샘물 일정을 성공적으로 불러왔습니다.");
    } catch (error) {
      console.error("샘물 일정 불러오기 실패:", error);
      alert("샘물 일정을 불러오는 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      {!isPlanCompleted && <StudyPlanModal />}
      <div className="flex flex-row gap-8 ml-10 mr-10 ">
        <div className="grow-[3]">
          <Calendar
            events={calendarEvents}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
          />
        </div>
        {/* 모달 */}
        {!modalData.is_completed && <ScheduleModal />}

        {/* 사이드바 */}
        <div className="lg:flex lg:flex-col items-center gap-2 grow-[1] hidden mt-5">
          <button
            onClick={handleFetchECampus}
            className="w-full px-14 py-2 text-[12px] bg-[#DDE6ED] text-[#27374D] rounded-[3.18px] transition-colors hover:bg-[#526D82] hover:text-[#DDE6ED]"
          >
            샘물 정보 불러오기
          </button>
          <CheckSchedule
            selectedDateEvents={selectedDateEvents}
          />
        </div>
        {/* 1023px 아래 일때 사이드바 디자인*/}
        {/* 사이드바에 대한 코드  */}
        {isHalf && (
          <div
            className={`lg:hidden fixed top-1 right-0 h-full w-4/5 max-w-xs bg-none z-40 transform transition-transform duration-400 ${
              isSidebarOpen
                ? "translate-x-0"
                : "translate-x-full"
            } `}
          >
            <div className="flex flex-col h-full items-center justify-center">
              <CheckSchedule
                selectedDateEvents={selectedDateEvents}
              />
            </div>
          </div>
        )}
        {/* 사이드바 열릴 때 배경 어둡게 하기 위한 코드이다. */}
        {/* inset: 0이라고 쓰면 top: 0, right: 0, bottom: 0, left: 0 과 동일하다. */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-30 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </>
  );
};

export default Home;
