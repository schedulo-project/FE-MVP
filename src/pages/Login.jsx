import { useForm } from "react-hook-form";
import logoimage from "../assets/logo/logoimage.svg";
import loginIcon from "../assets/login/loginIcon.svg";
import loginApi from "../api/Auth/loginApi";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    loginApi(data.email, data.password);
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-8 p-8 max-w-md mx-auto">
      {/* 로고 및 서비스명 */}
      <div className="flex items-center gap-2">
        <img src={logoimage} alt="로고 이미지" className="w-10 h-10" />
        <p className="text-[#2D3748] text-2xl font-semibold">Schedulo</p>
      </div>

      <div className="flex items-center gap-2">
        <img src={loginIcon} alt="로그인 아이콘" className="w-6 h-6" />
        <span className="text-xl">로그인</span>
      </div>

      {/* 로그인 입력창 */}
      <form
        className="w-full flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
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
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
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

        {/* 로그인 버튼 */}
        <button
          type="submit"
          className="w-full p-3 bg-[#2D3748] text-white rounded-md mt-6 text-center"
        >
          로그인
        </button>
      </form>

      {/* pw 찾기 및 회원가입 */}
      <div className="mt-6 flex flex-col items-center gap-3">
        <a href="#" className="text-sm text-gray-500 hover:underline">
          비밀번호를 잊으셨나요?
        </a>
        <a href="/signup" className="text-sm text-gray-500 hover:underline">
          회원가입
        </a>
      </div>
    </div>
  );
};

export default Login;
