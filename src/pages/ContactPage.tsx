// src/pages/ContactPage.tsx
import React, { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react';

// Premium contact info card component
const ContactInfoCard = ({ icon: Icon, title, children, delay = 0 }) => {
  return (
    <motion.div
      className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all hover:shadow-lg hover:shadow-blue-900/5 hover:-translate-y-1"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      <div className="flex items-start">
        <div className="p-3 bg-blue-500/10 rounded-lg mr-4">
          <Icon size={20} className="text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
          <div className="text-gray-400">{children}</div>
        </div>
      </div>
    </motion.div>
  );
};

// Premium form input component
const FormInput = ({
  label,
  type = 'text',
  name,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  textarea = false,
  delay = 0,
}) => {
  const inputRef = useRef(null);
  const isInView = useInView(inputRef, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={inputRef}
      className="mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
    >
      <label
        htmlFor={name}
        className="block text-white/80 text-sm font-medium mb-2 flex items-center"
      >
        {label} {required && <span className="text-blue-400 ml-1">*</span>}
      </label>
      {textarea ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={5}
          className={`w-full px-4 py-3 bg-white/5 border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-white placeholder-gray-500 transition-all backdrop-blur-sm`}
        />
      ) : (
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-4 py-3 bg-white/5 border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-white placeholder-gray-500 transition-all backdrop-blur-sm`}
        />
      )}
      {error && (
        <motion.p
          className="mt-1 text-sm text-red-400 flex items-center"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <AlertCircle size={14} className="mr-1" /> {error}
        </motion.p>
      )}
    </motion.div>
  );
};

// Main Contact Page Component
const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });
  const [formStatus, setFormStatus] = useState(null); // null, 'sending', 'success', 'error'

  const sectionRef = useRef(null);
  const formRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const isFormInView = useInView(formRef, { once: true, amount: 0.2 });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      phone: '',
      service: '',
      message: '',
    };

    if (!formData.name.trim()) {
      newErrors.name = 'Имя обязательно для заполнения';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен для заполнения';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Пожалуйста, введите корректный email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Телефон обязателен для заполнения';
    } else if (!/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(formData.phone)) {
      newErrors.phone = 'Пожалуйста, введите корректный номер телефона';
    }

    if (!formData.service) {
      newErrors.service = 'Пожалуйста, выберите услугу';
    }

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Set form status to sending
    setFormStatus('sending');

    // Simulate form submission
    setTimeout(() => {
      // In a real application, you would send the form data to your backend here
      console.log('Form submitted:', formData);
      setFormStatus('success');

      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          service: '',
          message: '',
        });
        setFormStatus(null);
      }, 3000);
    }, 1500);
  };

  // Service options
  const serviceOptions = [
    { value: '', label: 'Выберите услугу' },
    { value: 'hygiene', label: 'Гигиена и профилактика' },
    { value: 'treatment', label: 'Лечение зубов' },
    { value: 'surgery', label: 'Хирургия' },
    { value: 'orthodontics', label: 'Ортодонтия' },
    { value: 'consultation', label: 'Консультация' },
  ];

  // Working hours
  const workingHours = [
    { day: 'Понедельник', hours: '9:00 – 18:30' },
    { day: 'Вторник', hours: '9:00 – 18:30' },
    { day: 'Среда', hours: '9:00 – 18:30' },
    { day: 'Четверг', hours: '9:00 – 18:30' },
    { day: 'Пятница', hours: '9:00 – 18:30' },
    { day: 'Суббота', hours: '10:00 – 17:00' },
    { day: 'Воскресенье', hours: 'Выходной' },
  ];

  return (
    <div className="min-h-screen bg-[#171b21] text-white pt-24">
      {/* Hero section with premium styling */}
      <div className="relative overflow-hidden bg-primary-900 pb-16">
        {/* Background elements */}
        <div className="absolute inset-0 bg-[url('/images/pattern-dot.svg')] bg-repeat opacity-5 pointer-events-none" />

        {/* Premium page title with animation */}
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 py-16 relative z-10">
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Свяжитесь с нами
          </motion.h1>

          <motion.div
            className="h-1 w-24 bg-gradient-to-r from-blue-500 to-blue-400 mb-8"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />

          <motion.p
            className="text-xl text-gray-300 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Мы готовы ответить на все ваши вопросы и предоставить индивидуальную консультацию.
            Свяжитесь с нами любым удобным для вас способом или запишитесь на прием онлайн.
          </motion.p>
        </div>
      </div>

      {/* Contact info section with premium cards */}
      <div
        ref={sectionRef}
        className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 py-16 relative"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ContactInfoCard icon={Phone} title="Телефон" delay={0.2}>
            <a href="tel:+99895122-88-55" className="hover:text-white transition-colors">
              (+998) 95-122-88-55
            </a>
          </ContactInfoCard>

          <ContactInfoCard icon={Mail} title="Email" delay={0.3}>
            <a href="mailto:info@abclinic.uz" className="hover:text-white transition-colors">
              info@abclinic.uz
            </a>
          </ContactInfoCard>

          <ContactInfoCard icon={MapPin} title="Адрес" delay={0.4}>
            <p className="mb-1">Ташкент, ул. Нукусс, 88/55</p>
            <a
              href="https://goo.gl/maps/xxxxxxxxxx"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center"
            >
              <span>Открыть на карте</span>
              <svg
                className="ml-1 w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                ></path>
              </svg>
            </a>
          </ContactInfoCard>

          <ContactInfoCard icon={Clock} title="Режим работы" delay={0.5}>
            <p className="mb-2">Пн-Пт: 9:00 – 18:30</p>
            <p>Сб: 10:00 – 17:00</p>
          </ContactInfoCard>
        </div>
      </div>

      {/* Main content with map and form */}
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Map column */}
          <motion.div
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-6">Наше расположение</h2>

            {/* Premium map container */}
            <div className="rounded-xl overflow-hidden shadow-lg border border-white/10 h-[400px] mb-8">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2997.9393855000076!2d69.27223287910451!3d41.28842365258908!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8b7eac6b3353%3A0xe8351a8ecf2f6f3e!2sabclinic.uz!5e0!3m2!1sen!2sro!4v1740846993568!5m2!1sen!2sro"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(0.3) contrast(1.1)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Clinic Location"
                className="z-0"
              ></iframe>
            </div>

            {/* Premium working hours table */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-medium mb-4 flex items-center">
                <Clock size={18} className="mr-2 text-blue-400" />
                График работы
              </h3>

              <div className="space-y-2">
                {workingHours.map((item, index) => (
                  <motion.div
                    key={item.day}
                    className="flex justify-between py-2 border-b border-white/10 last:border-b-0"
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.05 }}
                  >
                    <span className="text-gray-400">{item.day}</span>
                    <span className={item.day === 'Воскресенье' ? 'text-red-400' : 'text-white'}>
                      {item.hours}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact form column */}
          <motion.div
            ref={formRef}
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-6">Запись на прием</h2>

            {/* Premium form container */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 relative overflow-hidden">
              {/* Form overlay for success/sending states */}
              <AnimatePresence>
                {formStatus && (
                  <motion.div
                    className="absolute inset-0 backdrop-blur-sm flex items-center justify-center z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {formStatus === 'sending' && (
                      <div className="text-center">
                        <div className="inline-block w-12 h-12 border-4 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-xl">Отправка формы...</p>
                      </div>
                    )}

                    {formStatus === 'success' && (
                      <div className="text-center p-6 bg-black/30 rounded-xl border border-green-500/20">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle size={32} className="text-green-500" />
                        </div>
                        <h3 className="text-2xl font-medium text-white mb-2">Форма отправлена!</h3>
                        <p className="text-gray-300">
                          Спасибо за ваше обращение. Мы свяжемся с вами в ближайшее время.
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

              {/* Contact form */}
              <form onSubmit={handleSubmit} className="relative z-0">
                <FormInput
                  label="Имя"
                  name="name"
                  placeholder="Введите ваше имя"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  required
                  delay={0.2}
                />

                <FormInput
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="mail@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  required
                  delay={0.3}
                />

                <FormInput
                  label="Телефон"
                  name="phone"
                  placeholder="+998 XX XXX XX XX"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  required
                  delay={0.4}
                />

                <motion.div
                  className="mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isFormInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <label
                    htmlFor="service"
                    className="block text-white/80 text-sm font-medium mb-2 flex items-center"
                  >
                    Услуга <span className="text-blue-400 ml-1">*</span>
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/5 border ${errors.service ? 'border-red-500/50' : 'border-white/10'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-white transition-all backdrop-blur-sm appearance-none`}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23ffffff' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 1rem center',
                      backgroundSize: '1rem',
                    }}
                  >
                    {serviceOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.service && (
                    <motion.p
                      className="mt-1 text-sm text-red-400 flex items-center"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <AlertCircle size={14} className="mr-1" /> {errors.service}
                    </motion.p>
                  )}
                </motion.div>

                <FormInput
                  label="Сообщение"
                  name="message"
                  placeholder="Расскажите, что вас беспокоит или уточните детали вашего обращения..."
                  value={formData.message}
                  onChange={handleChange}
                  textarea
                  delay={0.6}
                  error={errors.message}
                />

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isFormInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center transition-all group relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center">
                      <span className="mr-2">Отправить заявку</span>
                      <Send
                        size={16}
                        className="inline-block transition-transform group-hover:translate-x-1"
                      />
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-white/10"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.5 }}
                    />
                  </button>

                  <p className="text-sm text-gray-400 mt-4 text-center">
                    Нажимая на кнопку, вы соглашаетесь с нашей{' '}
                    <a
                      href="/privacy"
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      политикой конфиденциальности
                    </a>
                  </p>
                </motion.div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
