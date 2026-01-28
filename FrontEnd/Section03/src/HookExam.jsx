import useInput from "./useInput"

const HookExam = () => {
    /**
     * [Hook 규칙 2. 조건부로 호출될 수는 없다]
     * - 리액트의 Hook 호출 순서는 렌더링 간에 일정해야 합니다.
     * - 따라서 if문, for문 내부가 아닌 컴포넌트 최상위에서 호출합니다.
     */
    const [name, onNameChange] = useInput("")
    const [bio, onBioChange] = useInput("")

    return (
        <div>
            <section>
                <label>이름: </label>
                <input value={name} onChange={onNameChange} />
            </section>
            
            <section>
                <label>자기소개: </label>
                <textarea value={bio} onChange={onBioChange} />
            </section>

            <div style={{ marginTop: "10px" }}>
                <strong>입력 데이터 확인:</strong>
                <p>이름: {name}</p>
                <p>소개: {bio}</p>
            </div>
        </div>
    )
}

export default HookExam