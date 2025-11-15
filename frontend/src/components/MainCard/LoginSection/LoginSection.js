import styles from "./LoginSection.module.css"
import {useState} from "react";

export default function LoginSection(){
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value, // ako ne e checkbox, setni stoinosta na inputa, ako e checkbox, setni checked property-to
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data:", formData);

    // tuka shte bude fetcha kogato backenda e gotov
  };

  return(
    <div className={styles.loginContainer}>
      <h4>ВХОД</h4>
      <form className={styles.form}>
        <div className={styles.formContainer}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              id="username"
              name="username"
              placeholder=""
              value={formData.username}
              onChange={handleChange}
              required
            />
            <label htmlFor="username">Потребителско Име</label>
          </div>

          <div className={styles.inputGroup}>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder=" "
              required/>
            <label htmlFor="password">Парола</label>
          </div>

          <label className={styles.checkBox}>
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
            />
            <span>Remember Me</span>
          </label>

          <button type="submit" onClick={handleSubmit}>Вход</button>
        </div>
      </form>
    </div>
  )
}