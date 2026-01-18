cd Section03 

npm install 

npm run dev 

App.jsx 
사용하지 않는 파일 제거 
사용하지 않는 import 제거 
div 태그내 제거 

App.css 
전체 삭제

index.css
전체 삭제 

main.jsx 
<StrictMode> 제거 / 잠재적 오류 확인 도구 

Extension 
- ESlint설치 
- 코드를 정적으로 검사하여, 오류 위험이 있는 코드 알림 
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': 'off',   // 추가 - 추가된 내용 설명 
      "react/prop-types": "off", // 추가 - 추가된 내용 설명 
    },
  },
])

---
React Component 

App.jsx 
html 반환하는 App이라는 함수 -> Component 
부를 때는 함수 이름을 따서 부름 
function Header () {
  return (
    <header>
      <h1>header Component</h1>
    </header>
  )
} // Header Component 

// 화살표 함수도 가능, 클래스도 가능 
// 클래스를 이용하면 코드가 어마어마하게 길어짐
// 보통 함수로 많이 사용 
주의 함수 컴포넌트는 반드시 대문자를 사용 
-> 리액트에서 내부적으로 컴포넌트로 인정해주지 않음 

// import { useState } from 'react'
import './App.css'

// Header Component
function Header () {
  return (
    <header>
      <h1>Header Component</h1>
    </header>
  )
}

// 최상위 컴포넌트 
function App() { // 부모 컴포넌트 
  // const [count, setCount] = useState(0)  // 현재는 사용되지 않는 상태 변수

  return (
    <>
      <Header /> // 자식 컴포넌트 
      <h1>Hi React!</h1>
    </>
  )
}

export default App
// 리액트의 모든 컴포넌트는 화면에 보이기 위해서 App Component에 자식 컴포넌트로 존재해야 함 

main.jsx 
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const Hello = () => {
  return <h1>Hello, React!</h1>
}

createRoot(document.getElementById('root')).render(
    <Hello />
)

이것도 가능이지만 관례상 root Component느 App으로 하는 것이 일반적 

Component 모듈화를 위해 컴포넌트 별로 각각 파일로 분리하는 것이 일반적 

src/components(새로 생성)/Header.jsx
App.jsx
// import { useState } from 'react'
import './App.css'
import Header from './components/Header.jsx' // Header 컴포넌트 불러오기 

// 최상위 조상 Component(Root Component)
function App() {
  // const [count, setCount] = useState(0)  // 현재는 사용되지 않는 상태 변수

  return (
    <>
      <Header />
      <h1>Hi React!</h1>
    </>
  )
}

export default App

Header.jsx 
// Header Component
function Header () {
  return (
    <header>
      <h1>Header Component</h1>
    </header>
  )
}
export default Header

App Component(root Component)
- Header 
- Main 
- Footer 

--- 
jsx로 UI 표현하기 
JSX?
- > JS에서는 HTML을 리턴할 수 없음, 문법적인 오류라고 판단 
React에서는 JSX 문법을 사용하므로 적법하다고 판단, JSX(JavaScriptsExtension): 확장된 자바스크립트 문법 
동적으로 특정 변수의 값을 HTML 렌더링 할 수 있게 함 

//J
const Main = () => {

    const number = 10 // 
  return (
    <main>
        <h1>Main Component</h1>
        <h2>{number}</h2>
        <h2>{number + 10}</h2>
        <h2>{number % 2 === 0 ? "Even" : "Odd"}</h2>
        </main>
  )
}

export default Main


주의사항 
1. 중괄호 내부에는 자바스크립트 표현식만 넣을 수있다. 
- if문, for문 등은 안됨, 값이 나와야 하는 것만 사용! 

2. 숫자, 문자열, 배열 값만 렌더링 
- boolean, undefined, null 등 오류를 일으키지 않지만 화면에 나오지 않는다. 
- 객체를 그대로 렌더링하려고 하면, 오류가 발생하낟.  const onj = { a: 1}, {obj}
    - {obj.a}처럼 해야함 

3. 모든 태그는 닫혀있어야 함 
4. 최상위 태그는 반드시 하나여야 함 
- <main>, <footer> 등 
- 최상위 태그가 두 개면 안됨 
- 마땅한 태그명이 없으면 <>빈태그로 묶어도 됨, 하지만 흩뿌려지게 된다.

practice 
import { use } from "react"
import './Main.css' // 추가 css 불러오기, Components내에 있다면 .만 사용 가능 
const Main = () => {

  // 사용자 로그인 정보 객체 
  const user = {
    name: "Screening",
    isLogin: true ,
  }

  if (user.isLogin) {
    return <div className="logout"> LogOut</div>
  } else {
    return <div>LogIn</div>
  }

//   return (
//     <>
//     {user.isLogin? <div> LogOut </div> : <div>LogIn</div>}
//     </>
//   )
}

export default Main

style 
요소에 직접 하는 방법 
- css처럼 사용하면 안됨, '-'넣는 것이 아닌 카멜케이스로 해야함 
- 이것을 사용하면 가독성이 안좋아짐 

별도에 css 파일 
components/main.css

--- 
props 
똑같은 기능이지만 구조가 조금씩 다른 컴포넌트를 사용하기 위해서는, 마치 함수를 호출했을 때 인수를 전달하는 것과 유사하다. 
function App() {
  return (
    <>
      <Button text={"메일"} img={"mail.png"} />
      <Button text={"카페"} img={"cafe.png"} />
      <Button text={"블로그"} img={"blog.png"} />
      ...
    </>
  );
}
부모 컴포넌트가 자식 컴포넌트에 원하는 값을 전달하는 것이 가능 - Props 
const Button = (props) => {
    console.log(props)
    return (
        <button>Click</button>
    )
}

export default Button

// import { useState } from 'react'
import './App.css'
import Button from './components/Button.jsx'
import Footer from './components/Footer.jsx'
import Header from './components/Header.jsx'
import Main from './components/Main.jsx'

// 최상위 조상 Component(Root Component)
function App() {
  // const [count, setCount] = useState(0)  // 현재는 사용되지 않는 상태 변수

  return (
    <>
      {/* <Header />
      <Main />
      <Footer /> */}
      <Button text={"Mail"} color="red"/>
      <Button text={"Cafe"}/>
      <Button text={"Blog"}/>
    </>
  )
}

export default App


const Button = (props) => {
    console.log(props)
    return (
        <button style={{color: props.color}}>{props.text}</button>
    )
}

export default Button

props로 어떠한 값이 반드시 전달될 거라 생각하고 작성하는 것은 꽤 위험하다. color라는 표기값이 전달이 안될 수도 있음 
const Button = ({ text, color="black" }) => {
    return (
        <button style={{ color: color}}>{text}</button>
    )
}

export default Button

props를 기본값으로 설정해야함, 구조분해할당 문법, 구조분해할당에서 기본값 설정 

여러가지 값을 props로 전달해야 한다면 객체 형태로 저장해서 스프레드 연산자를 사용하는 것이 유리 
// import { useState } from 'react'
import './App.css'
import Button from './components/Button.jsx'
import Footer from './components/Footer.jsx'
import Header from './components/Header.jsx'
import Main from './components/Main.jsx'

// 최상위 조상 Component(Root Component)
function App() {
  // const [count, setCount] = useState(0)  // 현재는 사용되지 않는 상태 변수
  const buttonProps = 
    { text: "Mail",
      color: "red",
      a: 1,
      b: 2,
      c: 3, 
      }

  
  return (
    <>
      {/* <Header />
      <Main />
      <Footer /> */}
      {/* <Button text={"Mail"} color={"red"}/> */}
      <Buttion {...buttonProps} />
      <Button text={"Cafe"}/>
      <Button text={"Blog"}/>
      <div>Children</div>
    </>
  )
}

export default App

import './App.css'
import Button from './components/Button.jsx'
import Header from './components/Header.jsx'

function App() {
  const buttonProps = {
    text: "Mail",
    color: "red",
    a: 1,
    b: 2,
    c: 3,
  };

  return (
    <>
      {/* 1. Spread Operator를 이용한 전달 */}
      <Button {...buttonProps} />
      
      {/* 2. 일반적인 Props 전달 */}
      <Button text={"Cafe"} />
      
      {/* 3. Children을 이용한 컴포넌트 합성 */}
      <Button text={"Blog"}>
        <Header />
      </Button> 
    </>
  );
}

export default App;

export default App
마지막에 닫으면 자동으로 컴포넌트에 children이라는 이름의 props로 자동 전달 
컴포넌트도 자식 props로 전달 가능 