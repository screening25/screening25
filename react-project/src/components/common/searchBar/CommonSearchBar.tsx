import styles from './CommonSearchBar.module.scss'

function CommonSearchBar() {
  return (
    <div className={styles.searchBar}>
        <div className={styles.searchBar__search}>
            <input type="text" placeholder='찾으실 내용을 검색하세요' className={styles.searchBar__search__input}/>
            <img src="src/assets/icons/icon-search.svg" alt="" />
        </div>
    </div>
  )
}

export default CommonSearchBar
