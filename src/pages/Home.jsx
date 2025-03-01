import React, { useState } from "react";
import Calendar from "../components/Calendar";
import EventForm from "../components/EventForm";
import CheckSchedule from "../components/CheckSchedule";

const Home = () => {
  // 임시 데이터
  const [events, setEvents] = useState([
    {
      id: 1,
      tagName: "공부",
      date: "2025-02-20",
      checklist: [
        { name: "알고리즘 문제 풀기", completed: false },
        { name: "React 공부하기", completed: false },
        { name: "SQL 복습하기", completed: false },
      ],
    },
    {
      id: 2,
      tagName: "CS 시험",
      date: "2025-02-22",
      checklist: [
        { name: "시험 범위 정리", completed: false },
        { name: "모의고사 풀기", completed: false },
      ],
    },
    {
      id: 3,
      tagName: "캡스톤",
      date: "2025-02-24",
      checklist: [
        { name: "프로젝트 계획서 작성", completed: false },
        { name: "팀 미팅 준비", completed: false },
      ],
    },
    {
      id: 4,
      tagName: "운영체제",
      date: "2025-02-24",
      checklist: [
        { name: "과제하기", completed: false },
        { name: "영상 시청", completed: false },
      ],
    },
  ]);

  const [selectedEvents, setSelectedEvents] = useState([]);

  // 날짜 클릭 시 해당 날짜의 일정 띄우기
  const handleDateClick = (date) => {
    const eventsOnDate = events.filter(
      (event) => event.date === date
    );
    setSelectedEvents(eventsOnDate);
  };

  // 새로운 이벤트 추가
  const addEvent = (newEvent) => {
    setEvents([...events, { ...newEvent, id: events.length + 1 }]);
  };

  // FullCalendar에 맞게 이벤트 형식 변환
  const calendarEvents = events.map((event) => ({
    id: event.id,
    title: event.tagName,
    date: event.date,
    extendedProps: {
      checklist: event.checklist,
    },
  }));

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📅 내 일정</h2>
      <EventForm addEvent={addEvent} />
      <div className="flex gap-5">
        <div className="w-3/4">
          <Calendar
            events={calendarEvents}
            onDateClick={handleDateClick}
          />
        </div>
        {selectedEvents.length > 0 && (
          <div className="w-1/4 mr-5">
            <CheckSchedule selectedEvents={selectedEvents} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
