import {useState} from "react";
import styles from './RegisterSection.module.css'

export default function RegisterSection(){
  const [formData, setFormData] = useState({
    bulstat: "",
    companyName: "",
    ownerFirstName: "",
    ownerLastName: "",
    phone: "",
    email: "",
    username: "",
    objects: [
      {
        name: "",
        address: "",
        workingHours: "",
        type: "",
      },
    ],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleObjectChange = (index, e) => {
    const { name, value } = e.target;
    const updatedObjects = [...formData.objects];
    updatedObjects[index][name] = value;
    setFormData({ ...formData, objects: updatedObjects });
  };

  const addObject = () => {
    setFormData({
      ...formData,
      objects: [
        ...formData.objects,
        { name: "", address: "", workingHours: "", type: "" },
      ],
    });
  };

  const removeObject = (index) => {
    const updatedObjects = formData.objects.filter((_, i) => i !== index);
    setFormData({ ...formData, objects: updatedObjects });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted form data:", formData);
  };

  return(
    <div className={styles.registerContainer}>
      <h4>ФОРМУЛЯР ЗА РЕГИСТРАЦИЯ</h4>
      <p className={styles.notice}>
        <strong>Важно!</strong> Попълването на този формуляр <u>не създава</u>{" "}
        автоматично профил в сайта. След получаване и обработка, ние ще се
        свържем с вас за подписване на договор.
      </p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formContainer}>
          {/* Company info */}
          <div className={styles.inputGroup}>
            <input
              type="text"
              id="bulstat"
              name="bulstat"
              placeholder="Булстат"
              value={formData.bulstat}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              type="text"
              id="companyName"
              name="companyName"
              placeholder="Име на фирмата"
              value={formData.companyName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Owner info */}
          <div className={styles.inputGroup}>
            <input
              type="text"
              id="ownerFirstName"
              name="ownerFirstName"
              placeholder='Име на собственик'
              value={formData.ownerFirstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              type="text"
              id="ownerLastName"
              name="ownerLastName"
              placeholder='Фамилия'
              value={formData.ownerLastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder='Телефон'
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              type="email"
              id="email"
              name="email"
              placeholder='Email'
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Username */}
          <div className={styles.inputGroup}>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Потребителско име"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          {/* Objects section */}
          <h5>Информация за обекти</h5>
          {formData.objects.map((obj, index) => (
            <div key={index} className={styles.objectGroup}>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  name="name"
                  placeholder="Име"
                  value={obj.name}
                  onChange={(e) => handleObjectChange(index, e)}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <input
                  type="text"
                  name="adress"
                  placeholder="Адрес"
                  value={obj.adress}
                  onChange={(e) => handleObjectChange(index, e)}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <input
                  type="text"
                  name="workingHours"
                  placeholder='Работно време'
                  value={obj.workingHours}
                  onChange={(e) => handleObjectChange(index, e)}
                />
              </div>

              <div className={styles.inputGroup}>
                <select
                  name="type"
                  value={obj.type}
                  onChange={(e) => handleObjectChange(index, e)}
                  required
                >
                  <option value="">Избери тип на обекта</option>
                  <option value="retail">Търговия на дребно</option>
                  <option value="wholesale">Търговия на едро</option>
                  <option value="restaurant">
                    Заведение за обществено хранене
                  </option>
                  <option value="catering">Кетъринг</option>
                </select>
              </div>

              {formData.objects.length > 1 && (
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => removeObject(index)}
                >
                  Премахни обект
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addObject}
            className={styles.addButton}
          >
            + Добави обект
          </button>

          <button type="submit" className={styles.submitButton}>
            Изпрати формуляра
          </button>
        </div>
      </form>
    </div>
  )
}