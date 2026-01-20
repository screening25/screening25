# React에서 여러 State 관리하기 (폼 예제)

React에서 폼(Form)을 만들 때는 여러 개의 입력(input) 필드를 다뤄야 하는 경우가 많다. 각 입력 필드에 대한 상태를 개별적으로 관리할 수도 있고, 하나의 객체로 묶어 관리할 수도 있다.

## 1. 개별 State로 폼 관리하기

가장 직관적인 방법은 각 입력 필드마다 `useState`를 사용하여 개별적으로 상태를 관리하는 것이다.

### 1.1. 코드 예시

```jsx
import { useState } from "react";

// 회원가입 폼
// 1. 이름
// 2. 생년월일
// 3. 국적
// 4. 자기소개
const Register = () => {
  const [name, setName] = useState("이름");
  const [birth, setBirth] = useState("");
  const [country, setCountry] = useState("");
  const [bio, setBio] = useState("");

  const onChangeName = (e) => {
    setName(e.target.value); // 입력된 값으로 name 상태 업데이트
  };
  const onChangeBirth = (e) => {
    setBirth(e.target.value);
  };
  const onChangeCountry = (e) => {
    setCountry(e.target.value);
  };
  const onChangeBio = (e) => {
    setBio(e.target.value);
  };

  return (
    <div>
      <div>
        {/* value와 onChange를 연결하여 사용자 입력과 상태를 동기화한다 */}
        <input value={name} onChange={onChangeName} placeholder={"이름"} />
        <span>{name}</span>
      </div>

      <div>
        <input value={birth} onChange={onChangeBirth} type="date" />
        <span>{birth}</span>
      </div>

      <div>
        <select value={country} onChange={onChangeCountry}>
          <option value=""></option>
          <option value="kr">한국</option>
          <option value="us">미국</option>
          <option value="uk">영국</option>
        </select>
        <span>{country}</span>
      </div>

      <div>
        <textarea value={bio} onChange={onChangeBio} />
        <span>{bio}</span>
      </div>
    </div>
  );
};

export default Register;
```

### 1.2. 문제점

이 방식은 코드가 직관적이지만, 관리할 상태가 많아질수록 `useState` 선언과 `onChange` 핸들러 함수가 늘어나 코드가 길고 반복적으로 변한다.

---

## 2. 여러 State를 하나의 객체로 통합하기 (Refactoring)

더 효율적인 방법은 여러 State를 하나의 객체로 묶고, 이벤트 핸들러를 하나로 통합하는 것이다.

-   **하나의 State 객체**: `useState`를 한 번만 사용하여 모든 폼 데이터를 객체 형태로 저장한다.
-   **하나의 이벤트 핸들러**: `e.target.name` 속성을 이용해 어떤 입력 필드에서 이벤트가 발생했는지 동적으로 파악하여 상태를 업데이트한다.

### 2.1. 리팩토링된 코드 예시

```jsx
import { useState } from "react";

const Register = () => {
  // 1. 여러 state를 하나의 객체로 통합
  const [input, setInput] = useState({
    name: "이름",
    birth: "",
    country: "",
    bio: "",
  });

  // 2. 이벤트 핸들러 통합
  const onChange = (e) => {
    setInput({
      ...input, // 3. Spread 연산자로 기존 input 객체를 복사
      [e.target.name]: e.target.value, // 4. name 속성을 키로 사용하여 동적으로 상태 업데이트
    });
  };

  return (
    <div>
      <div>
        {/* 각 input에 name 속성을 부여하여 핸들러가 참조할 수 있도록 한다 */}
        <input
          name="name"
          value={input.name}
          onChange={onChange}
          placeholder={"이름"}
        />
        <span>{input.name}</span>
      </div>

      <div>
        <input
          name="birth"
          value={input.birth}
          onChange={onChange}
          type="date"
        />
        <span>{input.birth}</span>
      </div>

      <div>
        <select name="country" value={input.country} onChange={onChange}>
          <option value=""></option>
          <option value="kr">한국</option>
          <option value="us">미국</option>
          <option value="uk">영국</option>
        </select>
        <span>{input.country}</span>
      </div>

      <div>
        <textarea name="bio" value={input.bio} onChange={onChange} />
        <span>{input.bio}</span>
      </div>
    </div>
  );
};

export default Register;
```

### 2.2. 핵심 포인트

1.  `useState`에 초기값으로 객체를 전달하여 `name`, `birth`, `country`, `bio`를 모두 관리한다.
2.  `onChange`라는 단일 함수가 모든 입력의 `onChange` 이벤트를 처리한다.
3.  상태를 업데이트할 때는 반드시 **Spread 연산자 (`...input`)** 를 사용해 기존 상태 객체를 복사해야 한다. React에서 상태의 불변성을 지키는 것은 매우 중요하기 때문이다.
4.  HTML 태그의 **`name` 속성값**과 **state 객체의 `key`값**을 일치시키는 것이 중요하다. `[e.target.name]` 구문은 이벤트가 발생한 요소의 `name` 속성을 찾아 해당 `key`의 값을 `e.target.value`로 업데이트한다.
