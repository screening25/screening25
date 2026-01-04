import styles from './CommonNav.module.scss';
import { useState } from 'react';            // 상태 관리: 컴포넌트 내부의 동적 데이터 처리
import { Link } from 'react-router-dom';     // 라우팅: 페이지 새로고침 없는 경로 이동 구현
import navJson from './nav.json';            // 데이터: 네비게이션 구성을 위한 외부 JSON 로드

// [공부] Interface: 데이터 구조의 규격을 정의하여 타입 안정성 및 자동 완성 지원
interface Navigation {
    index: number;
    path: string;
    label: string;
    searchValue: string;
    isActive: boolean;
}

function CommonNav() {
    // [공부] Generics: useState<Navigation[]>를 통해 상태에 저장될 배열 요소의 타입 강제
    // [공부] Immutability: [...navJson] 스프레드 연산자로 원본 주소값을 복사하여 새로운 배열 생성
    const [navigation, setNavigation] = useState<Navigation[]>([...navJson]);

    // [공부] .map(): 배열 데이터를 순회하며 리액트 엘리먼트(JSX)로 변환하는 핵심 메서드
    const navLinks = navigation.map((item: Navigation) => {
        return (
            // [공부] Key Prop: 리액트가 변경된 리스트 항목을 추적하기 위한 고유 식별자 할당
            <Link to={item.path} className={styles.navigation__menu} key={item.path}>
                <span className={styles.navigation__menu__label}>{item.label}</span>
            </Link>
        );
    });

    return (
        // [공부] CSS Modules: 스타일 충돌 방지를 위해 클래스명을 고유값으로 변환하여 적용
        <nav className={styles.navigation}>
            {navLinks}
        </nav>
    );
}

export default CommonNav;