import styles from './NavigationCard.module.css'

import logoImg from '../../images/logo.jpg'
import cardStyles from "../../styles/cardStyles.module.css";


export default function NavigationCard() {
  return(
    <div className={`${cardStyles.card} ${styles.navigationCard}`}>
      <img className={styles.logo} src={logoImg} alt="logo" />
      <nav>
        <ul className={styles.navigation}>
          <li>ЗА НАС</li>
          <li>ВХОД</li>
          <li>РЕГИСТРАЦИЯ</li>
        </ul>
      </nav>
    </div>
  )
}