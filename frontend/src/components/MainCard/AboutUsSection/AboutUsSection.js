import styles from './AboutUs.module.css'

export default function AboutUsSection(){
  return(
    // ne e gotovo oshte
    <div className={styles.aboutUsSection}>
      <div className={styles.infoContainer}>
        <p className={styles.description}>
          Фирма ..... е специализирана в областта на изготвяне,
          внедряване и управление на цялостни системи за безопасност на
          храните в хранителните обекти - HACCP.
        </p>
        <p> Десислава Томова – технолог………..</p>
        <p> Email: example@gmail.com</p>
        <p> Тел: 123456789</p>
      </div>
    </div>
  )
}