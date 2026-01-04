import styles from './CommonHeader.module.scss'; // 스타일: CSS Module을 활용한 컴포넌트 단위 스타일링

function CommonHeader() {
    return (
        // [공부] BEM 패턴: header__logoBox와 같은 명명 규칙을 통한 클래스 구조화
        <div className={styles.header}>
            {/* 로고 영역: 이미지와 서비스 타이틀로 구성 */}
            <div className={styles.header__logoBox}>
                <img src="src/assets/images/image-logo.png" alt="" className={styles.header__logoBox__logo} />
                <span className={styles.header__logoBox__title}>React</span>
            </div>

            {/* 프로필 영역: 액션 버튼 및 사용자 정보 출력 */}
            <div className={styles.header__profileBox}>
                <button className={styles.header__profileBox__button}>submit</button>
                <button className={styles.header__profileBox__button}>bookmark</button>
                
                {/* [공부] 외부 링크/정보: 동적 데이터 바인딩이 필요한 텍스트 영역 */}
                <button className={styles.header__profileBox__userName}>
                    I'm Screening | https://github.com/screening25
                </button>
            </div>
        </div>
    );
}

export default CommonHeader; // 내보내기: 타 컴포넌트에서 Header를 조립하여 사용 가능하도록 설정