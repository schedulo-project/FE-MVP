const SpSelect = ({ inputStyle, datas, value, action }) => {
  return (
    <select
      className={inputStyle}
      value={value}
      onChange={action}
    >
      <option value="" disabled>
        선택하세요
      </option>
      {datas.map((item, index) => (
        <option key={index} value={item}>
          {item}
        </option>
      ))}
    </select>
  );
};

export default SpSelect;
