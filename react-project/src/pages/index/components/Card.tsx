import styles from './Card.module.scss';

function Card() {
    // [공부] Event Handler: 카드 클릭 시 실행될 함수 정의
    const openDialog = () => {
        console.log('Card clicked');
    };

    return (
        // [공부] className: CSS Module을 사용하여 고유한 클래스명을 적용
        <div className={styles.card} onClick={openDialog}>
            {/*src에 빈 문자열("") 대신 null을 전달하여 브라우저 경고와 재다운로드 문제를 해결 */}
            <img src={null} alt="card image" className={styles.card__image} />
        </div>
    )
}

export default Card;