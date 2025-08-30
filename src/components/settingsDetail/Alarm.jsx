import { useState } from "react";
import ToggleForSettings from "./ToggleForSettings";
import alarmToggle from "../../api/alarmToggleApi";

const Alarm = () => {
  // 메인 토글 상태
  const [mainOn, setMainOn] = useState(false);
  // 세부 토글 상태
  const [sub1, setSub1] = useState(false);
  const [sub2, setSub2] = useState(false);

  const handleMainToggle = async (checked) => {
    setMainOn(checked);
    if (!checked) {
      await alarmToggle({ today: 0, deadline: 0 });
      setSub1(false);
      setSub2(false);
    } else {
      await alarmToggle({ today: 1, deadline: 1 });
      setSub1(true);
      setSub2(true);
    }
  };

  const handleTodayToggle = async (checked) => {
    setSub1(checked);
    await alarmToggle({
      today: checked ? 1 : 0,
      deadline: sub2 ? 1 : 0,
    });
  };

  const handleDeadlineToggle = async (checked) => {
    setSub2(checked);
    await alarmToggle({
      today: sub1 ? 1 : 0,
      deadline: checked ? 1 : 0,
    });
  };

  return (
    <div className="pt-5 ">
      <h1 className="font-semibold font-['Inter'] text-s ">
        알람 설정
      </h1>
      <hr className="w-[40%] bg-black mt-2 mb-2" />
      <div className="flex flex-col justify-between w-full gap-4">
        <ToggleForSettings
          name="전체 알림"
          checked={mainOn}
          onChange={(e) => handleMainToggle(e.target.checked)}
          disabled={false}
          size="lg"
        />
        <ToggleForSettings
          name="오늘 할일 알림"
          checked={sub1}
          onChange={(e) => handleTodayToggle(e.target.checked)}
          disabled={!mainOn}
          size="md"
        />
        <ToggleForSettings
          name="마감 기한 알림"
          checked={sub2}
          onChange={(e) =>
            handleDeadlineToggle(e.target.checked)
          }
          disabled={!mainOn}
          size="md"
        />
      </div>
    </div>
  );
};

export default Alarm;
