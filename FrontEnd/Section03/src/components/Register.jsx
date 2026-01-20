import {useState} from 'react'
// 회원가입 폼 
// 1. 이름 
// 2. 생년월일 
// 3. 국적 
// 4. 자기소개 
const Register=()=>{
    const [name, setName] = useState("이름")
    const [birth, setBirth] = useState("")
    const [country, setCountry] = useState("")
    const [bio, setBio] = useState("")
    
    const onChangeName = (e) => {
        setName(e.target.value) // 현재 input에 사용자가 입력한 값 저장 가능 
    }
    const onChangeBirth = (e) => {
        setBirth(e.target.value) // 현재 input에 사용자가 입력한 값 저장 가능 
    }
    const onChangeCounrty = (e) => {
        setCountry(e.target.value) // 현재 input에 사용자가 입력한 값 저장 가능 
    }
    const onChangeBio = (e) => {
        setBio(e.target.value) // 현재 input에 사용자가 입력한 값 저장 가능 
    }

    return (
        <div>
            <div>
                {/* value={name}으로 초기값 설정 */}
                <input value={name} onChange={onChangeName} placeholder={"이름"} />
                {name} 
            </div>

            <div>
                <input value={birth} onChange={onChangeBirth} type="date" />
                {birth}
            </div>

            <div>
                <select value={country} onChange={onChangeCounrty}>
                    <option value=" "></option> 
                    <option value="kr">한국</option>
                    <option value="us">미국</option>
                    <option value="uk">영국</option>
                </select>
                {country}
            </div>


            <div>
                <textarea value={bio} onChange={onChangeBio}/>
                {bio}
            </div>
        </div>
)
}

export default Register 