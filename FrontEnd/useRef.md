# useRef

`useRef`는 React에서 **참조(Reference)** 객체를 생성하는 Hook입니다. 이 Hook은 두 가지 주요 목적으로 사용됩니다.

1.  **리렌더링을 유발하지 않는 변수 관리**: 컴포넌트 내부에서 특정 값을 유지해야 하지만, 그 값이 변경될 때마다 화면을 다시 렌더링하고 싶지 않을 때 사용합니다.
2.  **DOM 요소에 직접 접근**: 특정 DOM 요소에 접근하여 포커스를 맞추거나, 크기를 가져오는 등의 조작이 필요할 때 사용합니다.

---

## 1. 변수 관리

`useState`로 관리되는 상태(State)는 값이 변경될 때마다 컴포넌트를 리렌더링시킵니다. 하지만 `useRef`로 생성된 참조 객체는 `.current` 프로퍼티에 값을 저장하며, 이 값은 변경되어도 리렌더링을 유발하지 않습니다.

따라서 `useRef`는 렌더링과 무관하게 컴포넌트의 생명주기 동안 값을 유지해야 하는 경우에 유용합니다.

### `useRef`와 일반 변수의 차이

-   **일반 변수**: 컴포넌트가 리렌더링될 때마다 초기화됩니다.
-   **useRef**: 컴포넌트가 리렌더링되어도 `.current`에 저장된 값이 유지됩니다.

### 예시 코드

```jsx
import { useRef, useState } from 'react';

const Register = () => {
    const [input, setInput] = useState({ name: "" });

    // 1. 변수 관리용 useRef: 리렌더링 시에도 값이 유지되며, 값이 변해도 리렌더링을 유발하지 않음
    const countRef = useRef(0);
    
    // 일반 지역 변수: 리렌더링 시마다 0으로 초기화됨
    let count = 0;

    const onChange = (e) => {
        // ref 값은 .current로 접근하여 수정
        countRef.current++;
        count++; 
        
        console.log("일반 변수 count (리렌더링 시 초기화):", count); // 항상 1
        console.log("useRef count (리렌더링 시 유지):", countRef.current); // 누적됨

        setInput({
            ...input,
            [e.target.name]: e.target.value 
        });
    };

    // ... (생략)
}
```

---

## 2. DOM 요소 접근

`useRef`를 사용하면 실제 DOM 요소에 직접 접근할 수 있습니다. 예를 들어, 특정 조건에서 입력창에 자동으로 포커스를 맞추고 싶을 때 유용하게 사용할 수 있습니다.

### 사용 방법

1.  `useRef`를 호출하여 ref 객체를 생성합니다.
2.  접근하고 싶은 DOM 요소의 `ref` 속성에 해당 객체를 전달합니다.
3.  이제 `ref객체.current`를 통해 해당 DOM 요소에 접근할 수 있습니다.

### 예시 코드

```jsx
import { useRef, useState } from 'react';

const Register = () => {
    const [input, setInput] = useState({ name: "" });
    
    // DOM 접근용 useRef: 실제 HTML 요소에 직접 접근하기 위해 사용
    const nameInputRef = useRef();

    const onChange = (e) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value 
        });
    };

    const onSubmit = () => {
        if (input.name === "") {
            // 이름 입력란이 비어있으면 해당 input 요소에 포커스를 줍니다.
            nameInputRef.current.focus();
        }
    };

    return (
        <div>
            <input 
                ref={nameInputRef} // useRef 객체를 DOM 요소의 ref 속성에 연결
                name="name" 
                value={input.name} 
                onChange={onChange} 
                placeholder="이름" 
            />
            <button onClick={onSubmit}>제출</button>
        </div>
    );
};

export default Register;
```

이처럼 `useRef`는 상태와 렌더링 흐름에서 벗어나 특정 값이나 DOM 요소를 직접 다룰 수 있는 강력한 도구입니다.
