import {useState} from 'react'

/**
 * 전구의 상태(ON/OFF)를 관리하고 표시하는 컴포넌트
 * 부모인 App의 상태와 분리되어 있어 독립적인 리렌더링 성능을 가짐
 */
const Bulb = () => {
  // light: 현재 전구의 상태 ("ON" 또는 "OFF")
  // setLight: 전구 상태를 변경하는 함수
  const [light, setLight] = useState("OFF");

  return (
    <div style={{ border: "1px solid #ddd", padding: "20px", margin: "10px" }}>
      {/* 1. 조건부 렌더링: light 상태에 따라 배경색과 텍스트 변경 */}
      {light === "ON" ? (
        <h1 style={{ backgroundColor: "orange" }}>ON</h1>
      ) : (
        <h1 style={{ backgroundColor: "gray" }}>OFF</h1>
      )}

      {/* 2. 이벤트 핸들러: 클릭 시 ON <-> OFF 토글 로직 수행 */}
      <button
        onClick={() => {
          setLight(light === "ON" ? "OFF" : "ON");
        }}
      >
        {light === "ON" ? "끄기" : "켜기"}
      </button>
    </div>
  );
};

export default Bulb