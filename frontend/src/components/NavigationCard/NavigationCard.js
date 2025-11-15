import styles from './NavigationCard.module.css'

import logoImg from '../../images/logo.jpg'
import cardStyles from "../../styles/cardStyles.module.css";

import {Link} from 'react-router-dom';

export default function NavigationCard() {
  return(
    <div className={`${cardStyles.card} ${styles.navigationCard}`}>
      <img className={styles.logo} src={logoImg} alt="logo" />
      <nav>
        <ul className={styles.navigation}>
          <Link to={'/about'}>ЗА НАС</Link>
          <Link to={'/login'}>ВХОД</Link>
          <Link to={'/register'}>РЕГИСТРАЦИЯ</Link>
        </ul>
      </nav>
    </div>
  )
}