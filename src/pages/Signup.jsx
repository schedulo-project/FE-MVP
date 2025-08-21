import { useForm } from "react-hook-form";
import { useState } from "react";
import logoimage from "../assets/logo/logoimage.svg";
import signupApi from "../api/Auth/signupApi";

const Signup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [signupData, setSignupData] = useState({
    email: "",
    password: "",
    studentId: "",
    studentPassword: "",
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const password = watch("password");

  // 첫 번째 단계: 서비스 회원가입
  const onSignupSubmit = (data) => {
    setSignupData(data);
    setCurrentStep(2);
  };

  // 두 번째 단계: 샘물 연동
  const onStudentAuthSubmit = (data) => {
    const finalData = { ...signupData, ...data };
    signupApi(
      finalData.email,
      finalData.password,
      finalData.studentId,
      finalData.studentPassword
    );
  };

  // 이전 단계로 돌아가기
  const goBack = () => {
    setCurrentStep(1);
    reset();
  };

  // 진행률 표시
  const progressSteps = [
    { step: 1, title: "서비스 회원가입", description: "기본 정보 입력" },
    { step: 2, title: "샘물 연동", description: "학사정보 연동" },
  ];

  return (
    <div className="w-full h-screen flex justify-center items-center bg-white p-4">
      <div className="flex flex-col items-center max-w-md w-full">
        {/* 로고 + 서비스명 */}
        <div className="flex items-center gap-2 mb-8">
          <img src={logoimage} alt="로고 이미지" className="w-10 h-10" />
          <p className="text-[#2D3748] text-2xl font-semibold">Schedulo</p>
        </div>
        {/* 진행률 표시 */}
        <div className="w-full mb-8">
          <div className="flex items-center justify-between mb-4">
            {progressSteps.map((step, index) => (
              <div key={step.step} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step.step
                      ? "bg-[#2D3748] text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step.step}
                </div>
                <p
                  className={`text-xs mt-1 text-center ${
                    currentStep >= step.step
                      ? "text-[#2D3748]"
                      : "text-gray-500"
                  }`}
                >
                  {step.title}
                </p>
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div
              className="bg-[#2D3748] h-1 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 2) * 100}%` }}
            ></div>
          </div>
        </div>
        {/* 단계별 제목 */}
        <div className="flex items-center gap-2 mb-8">
          <span className="text-xl">
            {currentStep === 1 ? "회원가입" : "샘물 연동"}
          </span>
        </div>
        {/* 첫 번째 단계: 서비스 회원가입 */}
        {currentStep === 1 && (
          <form
            className="w-full flex flex-col gap-4"
            onSubmit={handleSubmit(onSignupSubmit)}
          >
            <div className="w-full">
              <input
                className={`w-full p-3 rounded-md bg-gray-100 text-sm ${
                  errors.email ? "border border-red-500" : ""
                }`}
                placeholder="이메일"
                {...register("email", {
                  required: "이메일을 입력해주세요",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "올바른 이메일 형식이 아닙니다",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="w-full">
              <input
                className={`w-full p-3 rounded-md bg-gray-100 text-sm ${
                  errors.password ? "border border-red-500" : ""
                }`}
                type="password"
                placeholder="비밀번호"
                {...register("password", {
                  required: "비밀번호를 입력해주세요",
                  minLength: {
                    value: 4,
                    message: "비밀번호는 최소 4자 이상이어야 합니다",
                  },
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="w-full">
              <input
                className={`w-full p-3 rounded-md bg-gray-100 text-sm ${
                  errors.confirmPassword ? "border border-red-500" : ""
                }`}
                type="password"
                placeholder="비밀번호 확인"
                {...register("confirmPassword", {
                  required: "비밀번호 확인을 입력해주세요",
                  validate: (value) =>
                    value === password || "비밀번호가 일치하지 않습니다",
                })}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* 약관 동의 */}
            <div className="flex flex-col gap-2 mt-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="serviceAgree"
                  className="h-4 w-4 text-blue-600"
                  {...register("serviceAgree", {
                    required: "서비스 이용약관에 동의해주세요",
                  })}
                />
                <label htmlFor="serviceAgree" className="text-sm text-gray-700">
                  [필수] 서비스 이용약관 동의
                </label>
              </div>
              {errors.serviceAgree && (
                <p className="text-red-500 text-xs">
                  {errors.serviceAgree.message}
                </p>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="marketingAgree"
                  className="h-4 w-4 text-blue-600"
                  {...register("marketingAgree")}
                />
                <label
                  htmlFor="marketingAgree"
                  className="text-sm text-gray-700"
                >
                  [선택] 광고성 정보 수신 동의
                </label>
              </div>
            </div>

            {/* 다음 단계 버튼 */}
            <button
              type="submit"
              className="w-full p-3 bg-[#2D3748] text-white rounded-md mt-6 text-center"
            >
              다음 단계
            </button>
          </form>
        )}

        {/* 두 번째 단계: 샘물 연동 */}
        {currentStep === 2 && (
          <form
            className="w-full flex flex-col gap-4"
            onSubmit={handleSubmit(onStudentAuthSubmit)}
          >
            {/* 샘물 연동 선택 */}
            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                id="enableStudentAuth"
                className="h-4 w-4 text-blue-600"
                {...register("enableStudentAuth")}
              />
              <label
                htmlFor="enableStudentAuth"
                className="text-sm text-gray-700 font-medium"
              >
                샘물(학사정보시스템) 연동하기
              </label>
            </div>

            {/* 샘물 연동 안내 */}
            <div className="bg-blue-50 p-3 rounded-md mb-4">
              <p className="text-sm text-blue-800">
                샘물 연동을 통해 수강신청 정보와 학사일정을 자동으로 가져올 수
                있습니다.
                <br />
                <span className="text-xs text-blue-600 mt-1 block">
                  * 선택사항이며, 나중에 설정에서도 연동할 수 있습니다.
                </span>
              </p>
            </div>

            {/* 샘물 연동 입력 필드들 (조건부 렌더링) */}
            {watch("enableStudentAuth") && (
              <>
                <div className="w-full">
                  <input
                    className={`w-full p-3 rounded-md bg-gray-100 text-sm ${
                      errors.studentId ? "border border-red-500" : ""
                    }`}
                    placeholder="학번"
                    {...register("studentId", {
                      required: watch("enableStudentAuth")
                        ? "학번을 입력해주세요"
                        : false,
                      pattern: {
                        value: /^\d{8,10}$/,
                        message: "올바른 학번 형식이 아닙니다",
                      },
                    })}
                  />
                  {errors.studentId && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.studentId.message}
                    </p>
                  )}
                </div>

                <div className="w-full">
                  <input
                    className={`w-full p-3 rounded-md bg-gray-100 text-sm ${
                      errors.studentPassword ? "border border-red-500" : ""
                    }`}
                    type="password"
                    placeholder="샘물 비밀번호"
                    {...register("studentPassword", {
                      required: watch("enableStudentAuth")
                        ? "샘물 비밀번호를 입력해주세요"
                        : false,
                    })}
                  />
                  {errors.studentPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.studentPassword.message}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* 버튼 그룹 */}
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={goBack}
                className="flex-1 p-3 border border-gray-300 text-gray-700 rounded-md text-center"
              >
                이전
              </button>
              <button
                type="submit"
                className="flex-1 p-3 bg-[#2D3748] text-white rounded-md text-center"
              >
                회원가입 완료
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Signup;
