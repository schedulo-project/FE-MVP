//isModalOpen : 모달이 열렸는지 아닌지 판단하는 boolean 값
// data : 모달에 보여줄 데이터
// setIsModalOpen : 모달을 열고 닫는 함수 useState로 관리
// onChange : 모달에서 일정 수정 시 사용될 함수 - home에 있는 handleChange와 연결
// onChange는 추후에 수정기능이 만들어지면 사용할 예정
import React, { useEffect, useRef, useState } from "react";
import TagBox from "./TagBox";
import getTodayString from "../utils/getTodayString";
import addSchedules from "../api/addScheduleApi";
import getTags from "../api/getTagsApi";

//jotai
import { useAtom } from "jotai";
import {
  handleChangeAtom,
  isModalOpenAtom,
  modalDataAtom,
  tagListAtom,
} from "../atoms/HomeAtoms";
// % 모달 사용 요령 %
// 1. 모달을 열고 닫는 함수는 useAtom으로 관리 : isModalOpenAtom
// 2. 모달에 보여줄 데이터는 useAtom으로 관리 : modalDataAtom

//이미지
import xImg from "../assets/schedulemodal/x_sign.svg";
import trashImg from "../assets/schedulemodal/trash.svg";
import calendarImg from "../assets/schedulemodal/calendar_search.svg";
import deleteSchedules from "../api/deleteScheduleApi";

import Select from "react-select/creatable";
import addTags from "../api/addTagsApi";
import updateSchedules from "../api/updateScheduleApi";

const ScheduleModal = () => {
  //jotai
  const [, sethandleChange] = useAtom(handleChangeAtom);
  const [isModalOpen, setIsModalOpen] = useAtom(isModalOpenAtom);
  const [modalData] = useAtom(modalDataAtom); // 모달에 보여줄 데이터
  //모달이 열렸는지 판단하는 boolean 값

  const data = modalData;
  //data는 모달에 보여줄 데이터

  // 오늘 날짜
  const today = getTodayString();
  const [date, setDate] = useState(today);

  const dateInputRef = useRef(null);

  // 선택된 태그들 상태로 관리
  const [selectedTags, setSelectedTags] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [completed, setCompleted] = useState(false);

  // 일정 수정 상태 관리
  const [isEditMode, setIsEditMode] = useState(false);

  // 태그 호출 api
  // Home 페이지 렌더링 시 태그 조회 호출
  // -> atom에 호출된 태그 리스트 넣어두기
  // atom에서 taglist 불러오기
  const [tagList] = useAtom(tagListAtom);
  const [, setTagList] = useAtom(tagListAtom);

  // 일정 추가 시 초기화
  useEffect(() => {
    if (isModalOpen) {
      setTitle(""); // 제목 초기화
      setContent(""); // 내용 초기화
      setDate(today); // 모달 창 꺼질 때 오늘 일정으로 초기화
      setSelectedTags([]); // 태그 초기화
      setCompleted(false);
    }

    // 일정 수정 모드 진입 시 값 세팅
    if (isModalOpen && data.id !== null) {
      setTitle(data.title || "");
      setContent(data.content || "");
      setDate(data.date || today);
      setSelectedTags(data.tagName || []);
      setCompleted(data.is_completed || false);
      setIsEditMode(false);
    }
  }, [isModalOpen]);

  if (!isModalOpen) return null;

  // 모달 닫기
  const handleClose = () => {
    setIsModalOpen(false);
  };

  // 일정 삭제
  const handleTrashClick = async (id) => {
    // 삭제할 일정의 id를 받아 일정 삭제 api에 전달
    try {
      await deleteSchedules(id);
      alert("삭제가 성공적으로 완료되었습니다.");
      sethandleChange({ data: null, id });
      // 삭제된 일정의 id 전달, 부모 컴포넌트에서 events 상태 업데이트
      setIsModalOpen(false);
    } catch (error) {
      console.error("삭제 중 오류 발생", error);
      alert("삭제에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 입력값 변경 핸들러
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === "title") setTitle(value);
    if (id === "content") setContent(value);
    if (id === "date") setDate(value);
  };

  // 태그 변경 핸들러
  const handleTagChange = (selectedOptions) => {
    setSelectedTags(selectedOptions);
  };

  // 태그 추가
  const handleCreate = (inputValue) => {
    const newTags = { value: inputValue, label: inputValue };
    setTagList((prev) => [...prev, newTags]);
    addTags(inputValue);
  };

  // 일정 추가
  const handleAdd = async () => {
    const newData = {
      title,
      selectedTags,
      content,
      date,
      completed,
    };
    await addSchedules(newData);
    setIsModalOpen(false);
  };

  const handleUpdate = async () => {
    const updateData = {
      id: data.id,
      title,
      content,
      date,
      tag: selectedTags,
      completed,
    };
    await updateSchedules(updateData);
    alert("일정 수정 완료되었습니다.");
    sethandleChange({ data: updateData, id: data.id });
    setIsModalOpen(false);
    setIsEditMode(false);
  };

  const size =
    "min-w-[4.8125rem] text-[0.90238rem] pr-[1.80469rem] pl-[1.80469rem] pt-[0.15038rem] pb-[0.15038rem]";

  if (data.id === null) {
    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
        onClick={handleClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex flex-col justify-between items-center w-[27.375rem] h-[36.8125rem] bg-white rounded-[1rem]"
        >
          {/* 모달 헤더 */}
          <section className="bg-[#010669] flex w-full h-[5rem] p-[1.5625rem] justify-between items-center rounded-t-[1rem]">
            <span className="text-white text-[1.25rem] font-normal font-[Noto Sans KR]">
              일정 추가하기
            </span>
            <button onClick={handleClose}>
              <img
                className="w-[0.625rem] h-[0.62494rem]"
                src={xImg}
              />
            </button>
          </section>

          {/* 일정 제목 + 태그 */}
          <section className="flex flex-col items-center justify-center w-full">
            {/* 일정 제목 */}
            <section className="flex w-[80%] justify-between items-center">
              <span className="text-[#1A1A1A] text-[1.5625rem] font-semibold font-[Inter] text-center">
                <input
                  type="text"
                  id="title"
                  placeholder="일정 제목을 입력하세요"
                  className="placeholder:text-xl focus:outline-none"
                  value={title}
                  onChange={handleInputChange}
                />
              </span>
            </section>

            {/* 일정 태그 선택 */}
            <section className="w-[80%] flex justify-start items-center mt-[0.85rem]">
              <Select
                isMulti
                name="tags"
                options={tagList}
                className="basic-multi-select w-auto focus:outline-none focus:border-none"
                classNamePrefix="select"
                value={selectedTags}
                onChange={handleTagChange}
                onCreateOption={handleCreate}
                placeholder="태그 선택"
              />
            </section>
          </section>

          {/* 일정 날짜 + 일정 내용 */}
          <section className="w-[98%] h-[21.125rem] bg-[#F0F0F0] rounded-[1rem] mb-[1%] p-[2rem] flex flex-col">
            {/* 일정 날짜 */}
            <section className="flex items-center mb-1 gap-2">
              <span className="text-[#1A1A1A] text-[1.25rem] font-semibold font-[Inter] pt-[0.25rem]">
                {date}
              </span>
              <button className="w-[1.3125rem] h-[1.3125rem] relative">
                <img src={calendarImg} />
                <input
                  ref={dateInputRef}
                  type="date"
                  id="date"
                  value={date}
                  onChange={handleInputChange}
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    opacity: 0,
                    width: "100%",
                    height: "100%",
                  }}
                />
              </button>
            </section>

            {/* 일정 내용 */}
            <section className="border-t-[0.0625rem] border-[#ABABAB] mt-[0.0625rem] mb-[1rem]">
              <span className="text-[#656565]">
                <textarea
                  type="text"
                  id="content"
                  placeholder="일정 내용을 입력하시오"
                  className="bg-transparent resize-none w-[100%] h-[190px] focus:outline-none overflow-y-scroll"
                  value={content}
                  onChange={handleInputChange}
                />
              </span>
            </section>
            {/* 추가 버튼 */}
            <section className="flex justify-center">
              <button
                className="w-[50%] h-[40px] border-[1px] border-gray-300 rounded-[15px] shadow transition-shadow duration-200 hover:shadow-md hover:border-blue-500 hover:border-[2px] cursor-pointer"
                onClick={handleAdd}
              >
                추가하기
              </button>
            </section>
          </section>
        </div>
      </div>
    );
  }
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col justify-between items-center w-[27.375rem] h-[36.8125rem] bg-white rounded-[1rem]"
      >
        <section className="bg-[#010669] flex w-full h-[5rem] p-[1.5625rem] justify-between items-center rounded-t-[1rem]">
          <span className="text-white text-[1.25rem]">
            {isEditMode ? "일정 수정하기" : "일정 상세표"}
          </span>
          <button onClick={handleClose}>
            <img src={xImg} />
          </button>
        </section>

        <section className="flex flex-col items-center w-full">
          <section className="flex w-[80%] justify-between items-center">
            {isEditMode ? (
              <input
                id="title"
                value={title}
                onChange={handleInputChange}
                className="text-xl w-full focus:outline-none"
              />
            ) : (
              <span className="text-[1.5625rem] font-semibold">
                {data.title}
              </span>
            )}
            {!isEditMode && (
              <div className="flex gap-2">
                <button onClick={() => setIsEditMode(true)}>
                  ✏️
                </button>
                <button
                  onClick={() => handleTrashClick(data.id)}
                >
                  <img src={trashImg} />
                </button>
              </div>
            )}
          </section>

          <section className="w-[80%] mt-2">
            {isEditMode ? (
              <Select
                isMulti
                options={tagList}
                value={selectedTags}
                onChange={handleTagChange}
              />
            ) : (
              <TagBox tagNames={data.tagName} size={size} />
            )}
          </section>
        </section>

        <section className="w-[98%] h-[21.125rem] bg-[#F0F0F0] rounded-[1rem] p-[2rem] flex flex-col">
          <section className="flex gap-2 items-center">
            <span className="text-[1.25rem] font-semibold">
              {date}
            </span>
            {isEditMode && (
              <button className="relative w-[1.3125rem] h-[1.3125rem]">
                <img src={calendarImg} />
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={handleInputChange}
                  className="absolute inset-0 opacity-0 w-full h-full"
                />
              </button>
            )}
          </section>
          <section className="border-t mt-2 mb-4">
            {isEditMode ? (
              <textarea
                id="content"
                value={content}
                onChange={handleInputChange}
                className="bg-transparent w-full h-[190px] resize-none focus:outline-none"
              />
            ) : (
              <span className="text-[#656565]">
                {data.content}
              </span>
            )}
          </section>

          {isEditMode && (
            <section className="flex justify-center">
              <button
                onClick={handleUpdate}
                className="w-[50%] h-[40px] border border-gray-300 rounded-[15px]"
              >
                저장하기
              </button>
            </section>
          )}
        </section>
      </div>
    </div>
  );
};

export default ScheduleModal;
