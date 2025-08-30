const ToggleForSettings = ({
  name,
  checked,
  onChange,
  disabled,
  size = "md",
}) => {
  // 크기별 클래스 정의
  const sizeClass = {
    sm: "w-8 h-4 after:h-3 after:w-3 after:left-[2px] peer-checked:after:translate-x-4",
    md: "w-11 h-6 after:h-5 after:w-5 after:left-[2px] peer-checked:after:translate-x-5",
    lg: "w-16 h-8 after:h-7 after:w-7 after:left-[2px] peer-checked:after:translate-x-8",
  }[size];

  return (
    <label className="inline-flex items-center cursor-pointer justify-between">
      <input
        type="checkbox"
        value=""
        className="sr-only peer"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
        {name}
      </span>
      <div
        className={`${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        } ${sizeClass} relative bg-[#D1D1D1] rounded-full peer-checked:bg-[#9DB2BF] after:content-[''] after:absolute after:top-[2px] after:bg-[#27374D] after:rounded-full after:transition-all`}
      ></div>
    </label>
  );
};

export default ToggleForSettings;
