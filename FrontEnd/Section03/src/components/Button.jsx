// 기본값(default parameter) 설정 및 구조 분해 할당
const Button = ({ children, text, color = "black" }) => {
  const onClickButton = (e) => {
    // 이벤트 객체 
    console.log(e)
  //   console.log(text)
  }

  return (
    // <button = {onClickButton}> // 다른 이벤트도 이렇게 사용 가능  
    <button
      onClick={()=>{  // Event가 발생했을 때 실질적으로 처리하는 함수 : EventHandler
      
        console.log(text)
      }}

    style={{ color: color }}>
      {text}
      {children}
    </button>
  );
};

export default Button;