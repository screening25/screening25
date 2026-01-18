import { use } from "react"
import './Main.css'

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