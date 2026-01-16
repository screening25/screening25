# React.js

## React란?
Meta(구 Facebook)에서 개발한 **오픈소스 자바스크립트 라이브러리**이다.
대규모 웹 서비스의 UI를 더 편하게 개발하기 위해 만들어진 기술로, 넷플릭스, 페이스북, 인스타그램, 노션 등을 만들 때 사용되었다.

## 기술적 특징

### 1. 컴포넌트 기반 (Component-Based)
컴포넌트(Component)란 화면을 구성하는 UI 요소를 의미한다.
*   웹 페이지의 Header, Main, Footer를 각각 `header.js`, `main.js`, `footer.js`처럼 모듈화하여 조립하듯이 개발한다.
*   **장점**:
    *   여러 페이지에서 공통적으로 사용할 수 있어 재사용성이 높다.
    *   수정이 필요할 때 해당 컴포넌트만 수정하면 되므로 유지보수가 용이하다.
    *   중복 코드를 줄이고, 프로젝트 규모가 커져도 관리가 수월하다.

### 2. 선언형 프로그래밍 (Declarative Programming)
React는 화면 업데이트 구현이 쉽다.
*   **업데이트**: 사용자의 행동(클릭, 드래그 등)에 따라 웹 페이지가 상호작용하며 모습을 바꾸는 것이다.
*   **선언형 프로그래밍**: 과정은 생략하고 **목적**만 간결히 명시하는 방법이다.
    *   예: "토마토 파스타 하나 주세요" (목적만 명시한다.)
    *   반대 개념인 **명령형 프로그래밍**은 목적을 이루기 위한 모든 절차를 하나하나 설명해야 하므로 코드가 길고 복잡하다.
*   **React의 방식**:
    *   컴포넌트에는 `State`(상태)라는 변수가 저장된다.
    *   이 `State` 값이 바뀌면, React가 변경된 값에 따라 UI를 자동으로 업데이트하고 렌더링한다.
    *   복잡한 DOM 조작 과정을 직접 정의할 필요 없이, 변수의 값을 바꾸는 것만으로 화면을 업데이트할 수 있다.

### 3. Virtual DOM (가상 돔)
React는 화면 업데이트를 빠르게 처리하기 위해 **Virtual DOM** 기술을 사용한다.

#### [배경 지식] 브라우저의 동작 원리 (Critical Rendering Path)
브라우저는 HTML과 CSS를 화면에 그리기 위해 다음 과정을 거친다.
1.  **DOM Tree 생성**: HTML을 파싱하여 DOM(Document Object Model) 객체로 변환한다 (요소의 위치, 배치, 모양 정보).
2.  **CSSOM Tree 생성**: CSS를 파싱하여 CSSOM(CSS Object Model)을 생성한다 (스타일 정보).
3.  **Render Tree 생성**: DOM과 CSSOM을 결합하여 웹 페이지의 청사진을 생성한다.
4.  **Layout (Reflow)**: 요소들의 배치를 잡는 작업이다.
5.  **Painting (Repaint)**: 실제로 화면에 그려내는 작업이다.

#### 화면 업데이트의 문제점
자바스크립트로 DOM을 직접 수정하면 업데이트가 발생한다.
*   DOM 수정이 잦으면 `Layout`과 `Painting` 과정(Reflow, Repaint)이 반복적으로 실행된다.
*   이 과정은 연산 비용이 비싸기 때문에, 수정이 빈번하면 성능이 급격히 악화된다.

#### React의 해결책
React는 **Virtual DOM**을 사용하여 이 문제를 해결한다.
*   **Virtual DOM이란?**: 실제 DOM을 자바스크립트 객체로 흉내 낸 일종의 복제판이다.
*   **동작 방식**:
    1.  업데이트가 발생하면 실제 DOM을 수정하기 전에 **Virtual DOM**에 먼저 반영한다. (연습 스윙과 유사)
    2.  다양한 업데이트들을 모아서(Batch) 한 번에 처리한다.
    3.  변경된 내용만 실제 DOM에 한 번만 반영하여 비효율적인 연산을 최소화한다.

---
# React Application
React로 만든 웹 서비스들은 React Application이라고 부른다. 단순한 웹 페이지의 기능을 넘어 사실상 어플리케이션에 가까울 정도로 매우 다양한 기능을 제공하며, 웹 브라우저 위에서 움직이는 앱과 같다.

## React 프로젝트 생성
굉장히 다양한 방식으로 개발할 수 있다.

1. Node.js 패키지 생성
2. React 라이브러리 설치
3. 기타 도구 설치 및 설정 (입문자에게 권장하기 어렵다.)

### Vite 사용
Vite는 차세대 프론트엔드 개발 툴이며, React 공식 문서에서도 권장하고 있다.

명령어: `npm create vite@latest`

프레임워크 선택: `React`

### package.json 설정
*   **devDependencies**: 오직 개발할 때에만 사용되는 라이브러리를 저장하는 곳이다.
*   **dependencies**: 실제 실행에 필요한 라이브러리들이 명시되어 있다. 하지만 실제 파일인 `node_modules`나 `package-lock.json`은 별도로 설치해 주어야 한다.
*   `npm install`: `package.json`을 기반으로 라이브러리를 다운로드한다.

Vite를 통해서 리액트 앱을 생성한다.

## 프로젝트 구조

### public 폴더
이미지, 폰트 등을 저장하는 공간이다.

### src 폴더
Source의 약자이다. React나 JS 코드들을 보관하는 폴더이다.
*   **assets**: `public` 폴더와 동일하게 이미지나 폰트 등 정적 파일을 저장 가능하다. (빌드 시 처리 방식에 조금의 차이는 있다.)
*   **App.css**: 스타일 파일이다.
*   **App.jsx**: 리액트에서 사용되는 특수한 확장자이다.

### 기타 설정 파일
*   **.eslintrc.cjs**: (몰라도 됨) 개발자들 사이에 코드 스타일을 통일하는 것이다.
*   **.gitignore**: Git에 올리면 안 되는 파일들을 명시하는 곳이다.
*   **index.html**: React App의 기본 틀이다.
*   **vite.config.js**: Vite 도구의 옵션을 설정하는 공간이다.

## React 실행
`package.json`에 React를 실행시킬 수 있는 명령어가 있다. (dev, build, lint, preview)

명령어: `npm run dev`

### 단축키 (Shortcuts)
*   `h + enter`: 단축키 목록을 보여준다.
*   `r + enter`: 서버를 재시작한다.
*   `o + enter`: 브라우저를 연다.
*   `c + enter`: 콘솔을 지운다.
*   `q + enter`: 서버를 종료한다.

--- 
# React App 구동 원리

## 1. 웹 서버 실행
React 애플리케이션은 웹 서버 위에서 동작한다.
*   `npm run dev` 명령어를 입력하면 Vite가 개발용 웹 서버를 실행한다.
*   이 서버는 프로젝트 폴더에 저장된 파일들을 브라우저가 이해할 수 있는 형태로 가공하여 제공한다.

## 2. 접속 주소 (Localhost & Port)
터미널에 표시되는 `http://localhost:5173` 주소를 통해 접속할 수 있다.
*   **Localhost**: 내 컴퓨터(현재 사용 중인 컴퓨터)의 주소를 의미한다. 외부에서는 접속할 수 없다.
*   **Port (5173)**: 컴퓨터 내에서 실행 중인 여러 프로그램 중, React 서버가 사용하는 통로 번호이다.
    *   하나의 컴퓨터에서 여러 서버(PHP, React 등)가 동시에 실행될 수 있으므로, 포트 번호로 구분한다.

## 3. 브라우저 렌더링 과정
1.  브라우저가 주소로 접속 요청을 보낸다.
2.  서버는 기본 틀인 `index.html` 파일을 브라우저로 전송한다.
3.  `index.html`은 비어 있는 껍데기 파일이지만, 내부에 `<script>` 태그를 통해 자바스크립트 파일(`main.jsx`)을 불러온다.
4.  React가 자바스크립트를 실행하여 동적으로 HTML 요소를 생성하고 화면에 채워 넣는다.

---
# React의 진입점 (Entry Point)

React 앱이 시작되는 곳은 주로 `main.jsx` 파일이다.

*   **createRoot**: `index.html`에 있는 `id="root"`인 `div` 요소를 찾아 React의 루트(Root)로 설정한다.
*   **render**: 해당 루트 안에 React 컴포넌트를 렌더링(화면에 그리기)하겠다는 의미이다.
*   **<App />**: `App` 컴포넌트를 화면에 표시하라는 JSX 문법이다.

---
# 컴포넌트 (Component)

`App.jsx`와 같은 파일은 **컴포넌트**를 정의하는 파일이다.

*   **함수형 컴포넌트**: 자바스크립트 함수 형태로 UI를 정의한다.
*   이 함수는 화면에 그려질 UI 요소를 반환(return)한다.
*   `main.jsx`에서 이 컴포넌트를 불러와(`import`) 렌더링함으로써 화면이 구성된다.

## App 컴포넌트 예시
`src/App.jsx` 파일 내부의 `App` 함수가 바로 **컴포넌트**이다. 실제 코드는 보통 다음과 같은 형태를 띤다.

```jsx
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>Edit src/App.jsx and save to test HMR</p>
      </div>
    </>
  )
}

export default App
```

*   **import**: 필요한 이미지나 CSS, React 기능(`useState`)을 불러온다.
*   **function App()**: 컴포넌트 함수를 정의한다. 이름은 대문자로 시작해야 한다.
*   **useState**: 컴포넌트 내부에서 변경 가능한 데이터(상태)를 관리하는 React Hook이다.
*   **return**: HTML과 유사한 **JSX** 문법을 사용하여 화면에 렌더링할 구조를 반환한다.
*   **export default App**: 정의한 컴포넌트를 다른 파일에서 사용할 수 있도록 내보낸다.
