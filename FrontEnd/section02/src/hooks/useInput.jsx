import { useState } from "react"

/**
 * [Hook 규칙 3. 커스텀 훅을 직접 만들 수 있다]
 * 로직을 분리하여 재사용 가능한 형태로 정의합니다.
 */
const useInput = (initialValue = "") => {
    // [Hook 규칙 1. 커스텀 훅 내부에서만 호출 가능]
    // useState는 오직 리액트 함수 컴포넌트나 다른 커스텀 훅 내에서만 호출되어야 합니다.
    const [value, setValue] = useState(initialValue)

    const onChange = (e) => {
        setValue(e.target.value)
    }

    // 상태와 핸들러를 배열 형태로 반환하여 구조 분해 할당을 지원합니다.
    return [value, onChange]
}

export default useInput