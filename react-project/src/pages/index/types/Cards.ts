// [공부] DTO: 서버 데이터를 화면 구조에 맞게 정의한 객체 설계도
export interface CardDTO {
    promoted_at: string
    slug: string
    sponsorship?: string
    tags: Tag[]                        // [공부] 중첩 구조 탐색을 위한 배열 타입
    topic_submissions: any
    updated_at: string
    urls: Url                          // [공부] 이미지 및 링크 정보를 포함하는 객체
    user: any
    width: number                      
}

interface Tag {
    source: {                           // [공부] 자동 추출된 텍스트가 저장될 최종 경로
        ancestry: any
        cover_photo: any
        description: string
        meta_description: string
        meta_title: string
        subtitle: string
        title: string
    }
    title: string
    type: string
}

interface Url {
    full: string
    raw: string
}