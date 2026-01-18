// 기본값(default parameter) 설정 및 구조 분해 할당
const Button = ({ children, text, color = "black" }) => {
  return (
    <button style={{ color: color }}>
      {text}
      {children}
    </button>
  );
};

export default Button;