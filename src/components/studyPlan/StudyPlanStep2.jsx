import React, { useState } from "react";

export default function StudyPlanStep2({
  formData,
  updateFormData,
  nextStep,
  prevStep,
}) {
  // 과목 리스트 예시 (실제 데이터는 formData.subjects 등에서 받아올 수 있음)
  const subjects = [
    { id: 1, name: "공학설계입문" },
    { id: 2, name: "시스템소프트웨어" },
    { id: 3, name: "사고와표현" },
    { id: 4, name: "알고리즘" },
  ];

  // 선택된 과목 상태
  const [selectedSubjects, setSelectedSubjects] = useState(
    formData.subjects || [1, 2, 4]
  );
  // 직접 추가 과목
  const [customSubjects, setCustomSubjects] = useState(
    formData.customSubjects || []
  );
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customInput, setCustomInput] = useState("");

  // 하루 평균 과목 수
  const [avgCount, setAvgCount] = useState(
    formData.avgCount || 1
  );

  // 저장 시 결과값
  const [result, setResult] = useState("");

  // 과목 체크박스 토글
  const handleSubjectToggle = (id) => {
    setSelectedSubjects((prev) =>
      prev.includes(id)
        ? prev.filter((sid) => sid !== id)
        : [...prev, id]
    );
  };

  // 직접 추가
  const handleAddCustomSubject = () => {
    if (
      customInput.trim() &&
      !customSubjects.includes(customInput.trim())
    ) {
      setCustomSubjects([...customSubjects, customInput.trim()]);
      setCustomInput("");
      setShowCustomInput(false);
    }
  };

  // 저장 버튼 클릭
  const handleSave = () => {
    // 예시: 셤.공.계 6 (과목 4개 + 직접추가 2개, 평균 1)
    const total =
      selectedSubjects.length + customSubjects.length;
    setResult(`셤.공.계 ${total + avgCount + 1}`); // 실제 로직에 맞게 수정
    updateFormData({
      subjects: selectedSubjects,
      customSubjects,
      avgCount,
    });
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex justify-between items-start w-full">
        {/* 과목 선택 */}
        <div className="flex-1 flex flex-col items-center">
          <div className="text-2xl font-semibold mb-6 mt-8">
            2. 과목 선택
          </div>
          <div className="flex flex-col gap-3 w-[260px]">
            {subjects.map((subject) => (
              <button
                key={subject.id}
                className={`flex items-center px-4 py-2 border rounded-md text-left ${
                  selectedSubjects.includes(subject.id)
                    ? "bg-[#F5F7FA] border-[#B0B8C1]"
                    : "bg-white border-[#B0B8C1]"
                }`}
                onClick={() => handleSubjectToggle(subject.id)}
                style={{ justifyContent: "flex-start" }}
              >
                <input
                  type="checkbox"
                  checked={selectedSubjects.includes(subject.id)}
                  readOnly
                  className="mr-2 accent-[#3B4A5B]"
                />
                <span
                  className={`${
                    selectedSubjects.includes(subject.id)
                      ? "text-[#3B4A5B] font-semibold"
                      : "text-[#3B4A5B]"
                  }`}
                >
                  {subject.name}
                </span>
              </button>
            ))}
            {/* 직접 추가 */}
            {customSubjects.map((subj, idx) => (
              <div
                key={subj + idx}
                className="flex items-center px-4 py-2 border border-[#B0B8C1] rounded-md bg-[#F5F7FA]"
              >
                <input
                  type="checkbox"
                  checked
                  readOnly
                  className="mr-2 accent-[#3B4A5B]"
                />
                <span className="text-[#3B4A5B] font-semibold">
                  {subj}
                </span>
              </div>
            ))}
            {showCustomInput ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) =>
                    setCustomInput(e.target.value)
                  }
                  className="border rounded px-2 py-1 flex-1"
                  placeholder="과목명 입력"
                  onKeyDown={(e) => {
                    if (e.key === "Enter")
                      handleAddCustomSubject();
                  }}
                />
                <button
                  onClick={handleAddCustomSubject}
                  className="px-2 py-1 bg-[#3B4A5B] text-white rounded"
                >
                  추가
                </button>
              </div>
            ) : (
              <button
                className="flex items-center justify-center px-4 py-2 border border-[#B0B8C1] rounded-md bg-white text-[#3B4A5B] font-semibold"
                onClick={() => setShowCustomInput(true)}
              >
                + 직접추가
              </button>
            )}
          </div>
          <button
            className="mt-8 text-2xl text-[#3B4A5B]"
            onClick={prevStep}
          >
            &#60;
          </button>
        </div>
        {/* 상세 설정 */}
        <div className="flex-1 flex flex-col items-center">
          <div className="text-2xl font-semibold mb-6 mt-8">
            3. 상세 설정
          </div>
          <div className="text-lg mb-6">
            <span className="font-semibold">Q.</span> 3주동안
            하루 평균 몇 과목 공부할 계획인가요?
          </div>
          <div className="flex items-center gap-4 mb-8">
            <button
              className="w-10 h-10 border rounded flex items-center justify-center text-2xl"
              onClick={() =>
                setAvgCount((c) => Math.max(1, c - 1))
              }
            >
              -
            </button>
            <span className="text-2xl font-bold w-8 text-center">
              {avgCount}
            </span>
            <button
              className="w-10 h-10 border rounded flex items-center justify-center text-2xl"
              onClick={() => setAvgCount((c) => c + 1)}
            >
              +
            </button>
          </div>
          <button
            className="mt-8 text-2xl text-[#3B4A5B]"
            onClick={nextStep}
          >
            &#62;
          </button>
        </div>
      </div>
      <div className="flex justify-center mt-10">
        <button
          className="bg-[#3B4A5B] text-white px-10 py-2 rounded-full text-lg"
          onClick={handleSave}
        >
          저장
        </button>
      </div>
      {result && (
        <div className="flex justify-center mt-4 text-2xl font-bold text-[#3B4A5B]">
          {result}
        </div>
      )}
    </div>
  );
}
