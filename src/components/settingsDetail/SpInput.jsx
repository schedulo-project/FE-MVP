const SpInput = ({ data, action, plholder, inputStyle }) => {
  return (
    <input
      type="text"
      className={inputStyle}
      value={data}
      onChange={action}
      placeholder={plholder}
    />
  );
};

export default SpInput;
