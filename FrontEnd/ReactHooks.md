# React Hooks

React Hook은 클래스 컴포넌트에서 사용하던 다양한 기능들을 함수 컴포넌트에서도 사용할 수 있도록 해주는 기능입니다.

과거에는 클래스 컴포넌트만이 상태 관리(State)나 생명주기(Lifecycle)와 같은 고급 기능을 사용할 수 있었지만, 문법이 복잡하고 재사용성이 떨어지는 단점이 있었습니다. 반면, 함수 컴포넌트는 UI 렌더링에만 집중하여 구조가 간단했지만 기능적 한계가 있었습니다.

React Hook은 이러한 함수 컴포넌트에 **"기능을 낚아채 온다"**는 의미처럼, `useState`, `useEffect` 등의 함수를 통해 필요한 기능을 선택적으로 추가할 수 있게 해줍니다.

---

## Hooks의 규칙

React Hook을 올바르게 사용하기 위해 반드시 지켜야 할 몇 가지 규칙이 있습니다.

### 1. 최상위에서만 호출해야 합니다.
Hook은 컴포넌트의 최상위 레벨에서만 호출되어야 합니다. 반복문(`for`), 조건문(`if`), 또는 중첩된 함수 내에서 Hook을 호출하면 안 됩니다. 이 규칙을 통해 React는 여러 Hook이 호출되는 순서를 매 렌더링마다 동일하게 유지하여, 컴포넌트의 상태를 안정적으로 관리할 수 있습니다.

### 2. 오직 React 함수 내에서만 사용해야 합니다.
Hook은 오직 **React 함수 컴포넌트** 또는 **커스텀 Hook** 내에서만 호출해야 합니다. 일반적인 자바스크립트 함수에서는 Hook을 사용할 수 없습니다.

---

## 커스텀 Hook (Custom Hook)

커스텀 Hook은 이름이 `use`로 시작하는 자바스크립트 함수로, 컴포넌트 로직을 재사용 가능한 형태로 분리할 수 있게 해줍니다. 예를 들어, 여러 입력 폼에서 공통적으로 사용되는 로직이 있다면 이를 커스텀 Hook으로 만들 수 있습니다.

### 커스텀 Hook 예시 (`useInput`)

다음은 입력 값과 `onChange` 핸들러를 하나로 묶어주는 `useInput` 커스텀 Hook의 예시입니다.

**`src/hooks/useInput.jsx`**
```jsx
import { useState } from "react";

/**
 * [Hook 규칙 3. 커스텀 훅을 직접 만들 수 있다]
 * 로직을 분리하여 재사용 가능한 형태로 정의합니다.
 */
const useInput = (initialValue = "") => {
    // [Hook 규칙 2. 오직 React 함수 내에서만 사용]
    // useState는 오직 리액트 함수 컴포넌트나 다른 커스텀 훅 내에서만 호출되어야 합니다.
    const [value, setValue] = useState(initialValue);

    const onChange = (e) => {
        setValue(e.target.value);
    };

    // 상태와 핸들러를 배열 형태로 반환하여 구조 분해 할당을 지원합니다.
    return [value, onChange];
};

export default useInput;
```

### 커스텀 Hook 사용법

위에서 만든 `useInput` Hook을 실제 컴포넌트에서 사용하는 방법은 다음과 같습니다.

```jsx
import useInput from "./hooks/useInput";

const HookExam = () => {
    /**
     * [Hook 규칙 1. 최상위에서만 호출]
     * - 리액트의 Hook 호출 순서는 렌더링 간에 일정해야 합니다.
     * - 따라서 if문, for문 내부가 아닌 컴포넌트 최상위에서 호출합니다.
     */
    const [name, onNameChange] = useInput("");
    const [bio, onBioChange] = useInput("");

    return (
        <div>
            <section>
                <label>이름: </label>
                <input value={name} onChange={onNameChange} />
            </section>
            
            <section>
                <label>자기소개: </label>
                <textarea value={bio} onChange={onBioChange} />
            </section>

            <div style={{ marginTop: "10px" }}>
                <strong>입력 데이터 확인:</strong>
                <p>이름: {name}</p>
                <p>소개: {bio}</p>
            </div>
        </div>
    );
};

export default HookExam;
```

이처럼 커스텀 Hook을 사용하면 반복되는 로직을 효과적으로 추상화하고, 컴포넌트 코드를 더 간결하고 명확하게 유지할 수 있습니다.
