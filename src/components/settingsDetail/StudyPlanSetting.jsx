import StudyPlanStep1 from "../studyPlan/StudyPlanStep1";
import StudyPlanStep2 from "../studyPlan/StudyPlanStep2";
import StudyPlanStep3 from "../studyPlan/StudyPlanStep3";
import StudyPlanStep4 from "../studyPlan/StudyPlanStep4";
import StudyPlanStep5 from "../studyPlan/StudyPlanStep5";
import { useState } from "react";
import SpInput from "./SpInput";
import SpSelect from "./SpSelect";

const StudyPlanSetting = () => {
  const [week, setWeek] = useState(1);
  const [review, setReview] = useState("매일"); // select 값
  const [studyRatio, setStudyRatio] = useState("5:5"); // 공부 비율
  const [point, setPoint] = useState("시간"); // 기준점
  const [preference, setPreference] = useState("바로 시작"); // 과제 시작/마감 선호

  const reviewMockData = [
    "매일",
    "시험 1주 전",
    "시험 2주 전",
    "시험 3주 전",
    "직접 입력",
  ];

  const studyRatioMockData = [
    "5:5",
    "6:4",
    "7:3",
    "8:2",
    "9:1",
    "직접 입력",
  ];

  const pointMockData = [
    "페이지 수",
    "시간",
    "완료한 챕터 수",
    "과목별 분량 나누기",
    "학습 목표수",
    "직접 입력",
  ];

  const preferenceMockData = [
    "바로 시작",
    "마감 하루 전",
    "마감 3일 전",
    "마감 1주 전",
    "직접 입력",
  ];

  const inputStyle =
    "border-2 border-gray-300 rounded-lg px-6 py-4 w-80 text-center text-lg focus:outline-none focus:border-[#9DB2BF] transition-colors";

  return (
    <div className="pt-5">
      <h2 className="mb-6 text-xl font-bold">
        공부계획 설정이 올자리
      </h2>
      <hr className="w-[40%] bg-black mt-2 mb-2" />
      <div className="flex flex-col gap-8">
        <h2 className="text-xl font-bold">
          1. 시험 공부는 몇 주 전부터 시작할까요?
        </h2>
        <input
          type="number"
          className={inputStyle}
          min={1}
          value={week}
          onChange={(e) => setWeek(e.target.value)}
          placeholder=""
        />
        <h2 className="text-xl font-bold">
          2. 복습은 언제 할까요?
        </h2>
        <SpSelect
          inputStyle={inputStyle}
          datas={reviewMockData}
          // select는 "직접 입력" 선택 시 값은 비워주고, 나머지는 그대로 set
          value={
            reviewMockData.includes(review)
              ? review
              : "직접 입력"
          }
          action={(e) => {
            const value = e.target.value;
            if (value === "직접 입력") {
              setReview(""); // 직접 입력 선택 시 입력칸 열고 값은 초기화
            } else {
              setReview(value); // 선택값 반영
            }
          }}
        />
        {/* 직접 입력 input */}
        {(!reviewMockData.includes(review) || review === "") && (
          <SpInput
            data={review}
            action={(e) => setReview(e.target.value)}
            plholder="복습 시기를 직접 입력하세요"
            inputStyle={inputStyle}
          />
        )}
        <h2 className="text-xl font-bold">
          3. 공부와 휴식의 비율은 어떻게 되시나요?
        </h2>
        <SpSelect
          inputStyle={inputStyle}
          datas={studyRatioMockData}
          // select는 "직접 입력" 선택 시 값은 비워주고, 나머지는 그대로 set
          value={
            studyRatioMockData.includes(studyRatio)
              ? studyRatio
              : "직접 입력"
          }
          action={(e) => {
            const value = e.target.value;
            if (value === "직접 입력") {
              setStudyRatio(""); // 직접 입력 선택 시 입력칸 열고 값은 초기화
            } else {
              setStudyRatio(value); // 선택값 반영
            }
          }}
        />
        {/* 직접 입력 input */}
        {(!studyRatioMockData.includes(studyRatio) ||
          studyRatio === "") && (
          <SpInput
            data={studyRatio}
            action={(e) => setStudyRatio(e.target.value)}
            plholder="복습 시기를 직접 입력하세요"
            inputStyle={inputStyle}
          />
        )}
        <h2 className="text-xl font-bold">
          4. 시험 공부의 할당량을 정하는 기준이 무엇인가요?
        </h2>
        <SpSelect
          inputStyle={inputStyle}
          datas={pointMockData}
          // select는 "직접 입력" 선택 시 값은 비워주고, 나머지는 그대로 set
          value={
            pointMockData.includes(point) ? point : "직접 입력"
          }
          action={(e) => {
            const value = e.target.value;
            if (value === "직접 입력") {
              setPoint(""); // 직접 입력 선택 시 입력칸 열고 값은 초기화
            } else {
              setPoint(value); // 선택값 반영
            }
          }}
        />
        {/* 직접 입력 input */}
        {(!pointMockData.includes(point) || point === "") && (
          <SpInput
            data={point}
            action={(e) => setPoint(e.target.value)}
            plholder="시험 공부의 할당량을 직접 입력하세요"
            inputStyle={inputStyle}
          />
        )}
        <h2 className="text-xl font-bold">
          5. 과제는 언제 시작/마감하는 것을 선호하시나요?
        </h2>
        <SpSelect
          inputStyle={inputStyle}
          datas={preferenceMockData}
          // select는 "직접 입력" 선택 시 값은 비워주고, 나머지는 그대로 set
          value={
            preferenceMockData.includes(preference)
              ? preference
              : "직접 입력"
          }
          action={(e) => {
            const value = e.target.value;
            if (value === "직접 입력") {
              setPreference(""); // 직접 입력 선택 시 입력칸 열고 값은 초기화
            } else {
              setPreference(value); // 선택값 반영
            }
          }}
        />
        {/* 직접 입력 input */}
        {(!preferenceMockData.includes(preference) ||
          preference === "") && (
          <SpInput
            data={preference}
            action={(e) => setPreference(e.target.value)}
            plholder="과제 시작/마감 선호를 직접 입력하세요"
            inputStyle={inputStyle}
          />
        )}
      </div>
    </div>
  );
};

export default StudyPlanSetting;
