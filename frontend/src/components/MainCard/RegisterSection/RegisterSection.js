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

  const [currentStep, setCurrentStep] = useState(0);
  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 2));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

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
      <div className={styles.formContainer}>
        {currentStep === 0 && (
          <>
            <h5>Фирма</h5>
            <div className={styles.inputGroup}>
              <input
                type="text"
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
                name="companyName"
                placeholder="Име на фирмата"
                value={formData.companyName}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}

        {currentStep === 1 && (
          <>
            <h5>Собственик</h5>
            <div className={styles.inputGroup}>
              <input
                type="text"
                name="ownerFirstName"
                placeholder="Име на собственик"
                value={formData.ownerFirstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type="text"
                name="ownerLastName"
                placeholder="Фамилия"
                value={formData.ownerLastName}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type="tel"
                name="phone"
                placeholder="Телефон"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type="text"
                name="username"
                placeholder="Потребителско име"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}

        {currentStep === 2 && (
          <>
            <h5>Обекти</h5>
            {formData.objects.map((obj, index) => (
              <div key={index} className={styles.objectGroup}>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Име"
                    value={obj.name || ""}
                    onChange={(e) => handleObjectChange(index, e)}
                    required
                  />
                </div>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    name="address"
                    placeholder="Адрес"
                    value={obj.address || ""}
                    onChange={(e) => handleObjectChange(index, e)}
                    required
                  />
                </div>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    name="workingHours"
                    placeholder="Работно време"
                    value={obj.workingHours || ""}
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
                    <option value="restaurant">Заведение за обществено хранене</option>
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
            <button type="button" onClick={addObject} className={styles.addButton}>
              + Нов обект
            </button>
          </>
        )}
        <div className={styles.nextButton}>
          {currentStep > 0 && (
            <button type="button" onClick={prevStep} className={styles.removeButton}>
              Назад
            </button>
          )}
          {currentStep < 2 && (
            <button type="button" onClick={nextStep} className={styles.addButton}>
              Напред
            </button>
          )}
          {currentStep === 2 && (
            <button onClick={handleSubmit} type="submit" className={styles.submitButton}>
              Изпрати формуляра
            </button>
          )}
        </div>
      </div>
    </div>
  )
}