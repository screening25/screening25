import styles from './styles/index.module.scss';                     
import CommonHeader from '@/components/common/header/CommonHeader';           // 컴포넌트: 상단 헤더 영역 조립
import CommonSearchBar from '@/components/common/searchBar/CommonSearchBar';  // 컴포넌트: 중앙 검색바 영역 조립
import CommonNav from '@/components/common/navigation/CommonNav';             // 컴포넌트: 카테고리 네비게이션 조립
import CommonFooter from '@/components/common/footer/CommonFooter';
import Card from './components/Card';

function index() {
    return (
        // [공부] Layout Wrapper: 전체 페이지의 규격과 배경 등을 결정하는 최상위 컨테이너
        <div className={styles.page}> 
            <CommonHeader />  {/* common header UI */}
            <CommonNav />     {/* common navigation UI */}
            
            <div className={styles.page__contents}>
                {/* 소개 영역: 타이틀, 설명, 검색바를 포함하는 섹션 */}
                <div className={styles.page__contents__introBox}>
                    <div className={styles.wrapper}>
                         <span className={styles.wrapper__title}>React</span><br />
                         <span className={styles.wrapper__desc}>
                            React Start <br />
                            try to do your best!
                         </span>
                         
                         {/* common search bar UI */}
                         <CommonSearchBar />
                    </div>
                </div>
                
                {/* 이미지 영역: 인트로 박스 우측에 배치될 시각적 요소 공간 */}
                <div className={styles.page__contents__imageBox}>
                    <Card />
                    <Card />
                    <Card />
                    <Card />
                </div>
            </div>
        {/* common footer UI */}
        <CommonFooter />
        </div>
    );
}

export default index; // 내보내기: 해당 페이지를 라우터(Router)에 등록하여 사용 가능하게 함