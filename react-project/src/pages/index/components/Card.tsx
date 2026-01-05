import styles from './Card.module.scss'
import type { CardDTO } from '../types/Cards'

interface Props {
    data: CardDTO                                                           // [공부] Props: 부모(Index)에게서 전달받은 읽기 전용 데이터
}

function Card({ data }: Props) {
    // [공부] 옵셔널 체이닝(?): 데이터 경로가 깊을 때 발생할 수 있는 참조 에러 방지
    const concept = data.tags[0]?.source
    const imageUrl = data.urls.raw

    // [공부] Event Handler: 카드 클릭 시 외부 링크 열기 기능 정의
    const openLink = () => {
        window.open(data.urls.full, '_blank')
    }

    return (
        <div className={styles.card} onClick={openLink}>
            <div className={styles.card__imageBox}>
                {/* [공부] 데이터 바인딩: src에 가공된 이미지 경로를 연결 */}
                <img src={imageUrl} alt={concept?.title} className={styles.card__image} />
            </div>
            <div className={styles.card__textBox}>
                {/* [공부] 중첩 접근: data -> tags[0] -> source 내부 값을 출력 */}
                <h3 className={styles.card__textBox__title}>{concept?.title}</h3>
                <span className={styles.card__textBox__sub}>{concept?.subtitle}</span>
                <p className={styles.card__textBox__desc}>{concept?.description}</p>
                <div className={styles.card__textBox__footer}>
                    {/* [공부] toLocaleString(): 숫자를 천 단위 콤마 형식 문자열로 변환 */}
                    <span>Stats: {data.width?.toLocaleString()}</span>
                </div>
            </div>
        </div>
    )
}

export default Card