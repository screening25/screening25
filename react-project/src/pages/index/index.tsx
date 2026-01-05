import { useState, useEffect } from 'react'                                // [공부] useState: 데이터 저장 및 렌더링 유도 / useEffect: 컴포넌트 등장 시점 제어
import axios from 'axios'                                                  // [공부] axios: Promise 기반의 HTTP 비동기 통신 라이브러리
import styles from './styles/index.module.scss'                          
import CommonHeader from '@/components/common/header/CommonHeader'           // 레이아웃: 공통 상단 헤더 컴포넌트
import CommonSearchBar from '@/components/common/searchBar/CommonSearchBar'  // 레이아웃: 데이터 검색을 위한 공통 검색바
import CommonNav from '@/components/common/navigation/CommonNav'             // 레이아웃: 카테고리 이동을 위한 네비게이션
import CommonFooter from '@/components/common/footer/CommonFooter'          
import Card from './components/Card'                                        
// [공부] import type: 컴파일 시점에만 사용되는 형식 정보를 명시하여 빌드 효율 최적화 및 ts(1484) 에러 방지
import type { CardDTO } from './types/Cards'                                

function Index() {                                                           // 리액트 규칙: 함수형 컴포넌트 명칭은 반드시 대문자로 시작
    // [공부] Generics: useState<CardDTO[]> 처럼 타입을 지정하여 데이터List의 내부 구조를 강제함
    const [dataList, setDataList] = useState<CardDTO[]>([])                 

    const getData = async () => {                                            // [공부] async/await: 비동기 작업의 순서를 보장하고 가독성을 높이는 문법
        // [공부] API 자동화: 단일 객체가 아닌 배열(Array) 데이터를 반환하는 엔드포인트를 호출하여 '자동 생성' 기반 마련
        const API_URL = 'https://api.github.com/repos/facebook/react/issues?per_page=4' 
        const TOKEN = import.meta.env.VITE_GITHUB_TOKEN                     // [공부] 환경 변수: 보안 토큰 등 민감 정보를 .env 파일로 격리하여 관리

        try {
            // [공부] axios.get: 서버에 GET 요청을 보내며, headers에 인증 정보를 담아 권한 및 호출 한도 확인
            const res = await axios.get(API_URL, {
                headers: { Authorization: `token ${TOKEN}` }
            })

            // [공부] 데이터 매핑(Mapping): 서버의 날것(Raw) 데이터를 우리가 정의한 DTO 규격으로 자동 변환하는 과정
            const mappedData: CardDTO[] = res.data.map((item: any) => ({
                slug:               item.number.toString(),                  // 리액트 이슈 번호를 문자열로 변환
                updated_at:         item.updated_at,                         // 이슈가 마지막으로 수정된 날짜
                width:              item.comments,                           // 댓글 수 수치를 width 필드에 할당
                urls: { 
                    raw:            item.user.avatar_url,                    // 이슈 작성자의 프로필 이미지 주소
                    full:           item.html_url                            // 클릭 시 이동할 상세 페이지 주소
                },
                tags: [{
                    title:          "React Issue",
                    type:           "Automatic",
                    source: {
                        title:      item.title,                              // 이슈 제목을 카드 타이틀로 자동 바인딩
                        subtitle:   `State: ${item.state}`,                  // 이슈 상태(Open/Closed) 정보
                        description: item.body ? item.body.slice(0, 100) : "No description", // 본문 100자 자동 추출
                        meta_title: "", meta_description: "", cover_photo: null, ancestry: null
                    }
                }],
                promoted_at: "", topic_submissions: null, user: null
            }))

            setDataList(mappedData)                                         // [공부] 상태 업데이트: 변경된 배열 데이터가 담기면 리액트가 화면을 자동으로 다시 그림
        } catch (error) {
            console.log("데이터 자동 연동 실패")                             // 통신 장애 또는 토큰 만료 시 예외 처리
        }
    }

    useEffect(() => {                                                        // [공부] 의존성 배열([])이 비어있는 경우, 컴포넌트가 화면에 나타난 직후 '최초 1회'만 실행
        getData()                                                            
    }, [])

    return (
        <div className={styles.page}> 
            <CommonHeader />
            <CommonNav />
            <div className={styles.page__contents}>
                <div className={styles.page__contents__introBox}>
                    <div className={styles.wrapper}>
                         <span className={styles.wrapper__title}>React Auto Concepts</span><br />
                         <span className={styles.wrapper__desc}>
                            GitHub API 기반 리액트 이슈 및 코드 데이터 자동 추출 시스템
                         </span>
                         <CommonSearchBar />
                    </div>
                </div>
                <div className={styles.page__contents__imageBox}>
                    {/* [공부] 리스트 렌더링: 배열의 개수만큼 .map()이 반복 호출되며 고유한 key값을 통해 DOM 변경 효율을 극대화 */}
                    {dataList.length > 0 ? (
                        dataList.map((item, idx) => <Card key={item.slug} data={item} />)
                    ) : (
                        <p>데이터 분석 및 수집 중</p>                             // 데이터 로드 전 사용자에게 보여줄 안내 문구
                    )}
                </div>
            </div>
            <CommonFooter />
        </div>
    )
}

export default Index