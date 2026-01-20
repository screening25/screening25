import {useState} from 'react'

/**
 * 숫자 카운트를 관리하는 컴포넌트
 * Bulb 컴포넌트와 형제 관계이며, 서로의 상태 변경에 영향을 받지 않음
 */
const Counter = () => {
  // count: 현재 카운트 값
  // setCount: 카운트 값을 변경하는 함수
  const [count, setCount] = useState(0);

  return (
    <div style={{ border: "1px solid #ddd", padding: "20px", margin: "10px" }}>
      <h1>{count}</h1>
      {/* 클릭 시 기존 count 값에 1을 더해 상태 업데이트 */}
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        +
      </button>
    </div>
  );
};

export default Counter 