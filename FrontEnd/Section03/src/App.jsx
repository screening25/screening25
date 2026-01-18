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