import styles from "./LoginSection.module.css"

export default function LoginSection(){
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return(
    <div className={styles.loginContainer}>
      <h4>ВХОД</h4>
      <form className={styles.form}>
        <div className={styles.formContainer}>
          <div className={styles.inputGroup}>
            <input type="text" id="username" name="username" required placeholder=" " />
            <label htmlFor="username">Потребителско Име</label>
          </div>

          <div className={styles.inputGroup}>
            <input type="password" id="password" name="password" required placeholder=" " />
            <label htmlFor="password">Парола</label>
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.9rem", color: "#555" }}>
            <input type="checkbox" />
            <span>Remember Me</span>
          </label>

          <button type="submit" onClick={handleSubmit}>Вход</button>
        </div>
      </form>
    </div>
  )
}