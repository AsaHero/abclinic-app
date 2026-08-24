"use client";

import { useState, useRef, type ReactNode } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertCircle, ChevronDown } from "lucide-react";
import type { ServiceCategory } from "@/types/serviceData";
import BookingButton from "@/components/common/BookingButton";

const ContactInfoCard = ({
  icon: Icon,
  title,
  children,
  delay = 0,
}: {
  icon: typeof Phone;
  title: string;
  children: ReactNode;
  delay?: number;
}) => {
  return (
    <motion.div
      className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all hover:shadow-lg hover:shadow-forest-900/5 hover:-translate-y-1"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      <div className="flex items-start">
        <div className="p-3 bg-forest-500/10 rounded-lg mr-4">
          <Icon size={20} className="text-forest-400" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
          <div className="text-gray-400">{children}</div>
        </div>
      </div>
    </motion.div>
  );
};

type SelectOption = { value: string; label: string };

const CustomSelect = ({
  label,
  name,
  placeholder,
  value,
  onChange,
  options,
  error,
  required = false,
  delay = 0,
}: {
  label: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: { target: { name: string; value: string } }) => void;
  options: SelectOption[];
  error?: string;
  required?: boolean;
  delay?: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);
  const isInView = useInView(selectRef, { once: true, amount: 0.2 });

  const handleSelect = (optionValue: string) => {
    onChange({ target: { name, value: optionValue } });
    setIsOpen(false);
  };

  const selectedOption = options.find((option) => option.value === value);

  return (
    <motion.div
      ref={selectRef}
      className="mb-6 relative"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
    >
      <label htmlFor={name} className="text-white/80 text-sm font-medium mb-2 flex items-center">
        {label} {required && <span className="text-forest-400 ml-1">*</span>}
      </label>

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-4 py-3 bg-white/5 border ${error ? "border-red-500/50" : "border-white/10"} rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500/50 focus:border-transparent text-white transition-all backdrop-blur-sm text-left flex items-center justify-between`}
        >
          <span className={selectedOption?.value ? "text-white" : "text-gray-500"}>
            {selectedOption?.label || placeholder}
          </span>
          <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 z-50 mt-1 bg-gray-800/95 backdrop-blur-sm border border-white/10 rounded-lg shadow-xl max-h-60 overflow-y-auto"
            >
              {options.map((option, index) => (
                <motion.button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.1, delay: index * 0.02 }}
                  className={`w-full px-4 py-3 text-left hover:bg-white/10 transition-colors ${
                    option.value === value ? "bg-forest-500/20 text-forest-300" : "text-white"
                  } ${option.value === "" ? "text-gray-400" : ""}`}
                >
                  {option.label}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <motion.p
          className="mt-1 text-sm text-red-400 flex items-center"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <AlertCircle size={14} className="mr-1" /> {error}
        </motion.p>
      )}
    </motion.div>
  );
};

const FormInput = ({
  label,
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  textarea = false,
  delay = 0,
}: {
  label: string;
  type?: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  error?: string;
  required?: boolean;
  textarea?: boolean;
  delay?: number;
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
      <label htmlFor={name} className="text-white/80 text-sm font-medium mb-2 flex items-center">
        {label} {required && <span className="text-forest-400 ml-1">*</span>}
      </label>
      {/* ym-disable-keys: excludes this field's typed content from Yandex
          Webvisor's session-recording playback — layout.tsx enables
          webvisor sitewide, and without this a support person browsing
          session replays could read every patient's name/phone/message
          verbatim. Required on every input here, not just the obviously
          sensitive ones. */}
      {textarea ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={5}
          className={`ym-disable-keys w-full px-4 py-3 bg-white/5 border ${error ? "border-red-500/50" : "border-white/10"} rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500/50 focus:border-transparent text-white placeholder-gray-500 transition-all backdrop-blur-sm`}
        />
      ) : (
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`ym-disable-keys w-full px-4 py-3 bg-white/5 border ${error ? "border-red-500/50" : "border-white/10"} rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500/50 focus:border-transparent text-white placeholder-gray-500 transition-all backdrop-blur-sm`}
        />
      )}
      {error && (
        <motion.p
          className="mt-1 text-sm text-red-400 flex items-center"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <AlertCircle size={14} className="mr-1" /> {error}
        </motion.p>
      )}
    </motion.div>
  );
};

type FormState = {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
};

type FormStatus = null | "sending" | "success" | "error";

declare global {
  interface Window {
    ym?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

export default function ContactPageBody({ categories }: { categories: ServiceCategory[] }) {
  const [formData, setFormData] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [formStatus, setFormStatus] = useState<FormStatus>(null);

  const sectionRef = useRef(null);
  const formRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const isFormInView = useInView(formRef, { once: true, amount: 0.2 });

  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const sendToBackend = async (data: FormState) => {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }

      return result.success;
    } catch (error) {
      console.error("Error sending to backend:", error);
      throw error;
    }
  };

  const validateForm = (): Partial<FormState> => {
    const newErrors: Partial<FormState> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Имя обязательно для заполнения";
    }

    if (!formData.email.trim() && !formData.phone.trim()) {
      newErrors.email = "Укажите email или телефон для связи";
      newErrors.phone = "Укажите email или телефон для связи";
    } else {
      if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Пожалуйста, введите корректный email";
      }

      if (
        formData.phone.trim() &&
        !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(formData.phone)
      ) {
        newErrors.phone = "Пожалуйста, введите корректный номер телефона";
      }
    }

    if (!formData.service) {
      newErrors.service = "Пожалуйста, выберите услугу";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).some((key) => formErrors[key as keyof FormState])) {
      setErrors(formErrors);
      return;
    }

    setFormStatus("sending");

    try {
      const success = await sendToBackend(formData);

      if (success) {
        window.ym?.(105088457, "reachGoal", "contact_form_sent");
        window.gtag?.("event", "contact_form_sent", { page: "contact" });

        setFormStatus("success");

        setTimeout(() => {
          setFormData({ name: "", email: "", phone: "", service: "", message: "" });
          setFormStatus(null);
        }, 3000);
      } else {
        throw new Error("Backend returned failure status");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormStatus("error");

      setTimeout(() => {
        setFormStatus(null);
      }, 3000);
    }
  };

  const serviceOptions: SelectOption[] = [
    { value: "", label: "Выберите услугу" },
    ...categories.map((category) => ({
      value: category.id,
      label: category.title,
    })),
  ];

  const workingHours = [
    { day: "Понедельник", hours: "09:00 – 18:00" },
    { day: "Вторник", hours: "09:00 – 18:00" },
    { day: "Среда", hours: "09:00 – 18:00" },
    { day: "Четверг", hours: "09:00 – 18:00" },
    { day: "Пятница", hours: "09:00 – 18:00" },
    { day: "Суббота", hours: "09:00 – 18:00" },
    { day: "Воскресенье", hours: "Выходной" },
  ];

  return (
    <div className="min-h-screen bg-[#001d1c] text-white pt-24">
      <div className="relative overflow-hidden bg-primary-900 pb-16">
        <div className="absolute inset-0 bg-[url('/images/pattern-dot.svg')] bg-repeat opacity-5 pointer-events-none" />

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
            className="h-1 w-24 bg-gradient-to-r from-forest-500 to-forest-400 mb-8"
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

      <div ref={sectionRef} className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ContactInfoCard icon={Phone} title="Телефон" delay={0.2}>
            <a href="tel:+998951228855" className="hover:text-white transition-colors">
              (+998) 95-122-88-55
            </a>
          </ContactInfoCard>

          <ContactInfoCard icon={Mail} title="Email" delay={0.3}>
            <a href="mailto:abclinicuz@gmail.com" className="hover:text-white transition-colors">
              abclinicuz@gmail.com
            </a>
          </ContactInfoCard>

          <ContactInfoCard icon={MapPin} title="Адрес" delay={0.4}>
            <p className="mb-1">Ташкент, ул. Нукусс, 88/55</p>
            <a
              href="https://maps.app.goo.gl/zWmNZtq1TCcv8hG67"
              target="_blank"
              rel="noopener noreferrer"
              className="text-forest-400 hover:text-forest-300 transition-colors inline-flex items-center"
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
            <p className="mb-2">Пн-Cб: 9:00 – 18:00</p>
          </ContactInfoCard>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          <motion.div
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h2 className="text-2xl font-arista-light mb-6">Наше расположение</h2>

            <div className="rounded-xl overflow-hidden shadow-lg border border-white/10 h-[400px] mb-8">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2997.9393855000076!2d69.27223287910451!3d41.28842365258908!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8b7eac6b3353%3A0xe8351a8ecf2f6f3e!2sabclinic.uz!5e0!3m2!1sen!2sro!4v1740846993568!5m2!1sen!2sro"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "grayscale(0.3) contrast(1.1)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Clinic Location"
                className="z-0"
              ></iframe>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-medium mb-4 flex items-center">
                <Clock size={18} className="mr-2 text-forest-400" />
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
                    <span className={item.day === "Воскресенье" ? "text-red-400" : "text-white"}>
                      {item.hours}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            ref={formRef}
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h2 className="text-2xl font-arista-light mb-6">Запись на прием</h2>

            <div className="mb-6 bg-forest-500/10 border border-forest-500/20 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="font-medium text-white mb-1">Записаться онлайн прямо сейчас</p>
                <p className="text-sm text-gray-400">
                  Выберите удобное время в нашей системе записи — займёт меньше минуты.
                </p>
              </div>
              <BookingButton className="shrink-0 inline-flex items-center justify-center gap-2 bg-forest-500 hover:bg-forest-600 text-white font-medium px-5 py-3 rounded-lg transition-colors whitespace-nowrap">
                Выбрать время
              </BookingButton>
            </div>

            <p className="text-sm text-gray-400 mb-4">
              Или оставьте заявку — мы свяжемся с вами и подберём время сами:
            </p>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 relative overflow-hidden">
              <AnimatePresence>
                {formStatus && (
                  <motion.div
                    className="absolute inset-0 backdrop-blur-sm flex items-center justify-center z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {formStatus === "sending" && (
                      <div className="text-center">
                        <div className="inline-block w-12 h-12 border-4 border-t-forest-500 border-r-forest-500 border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-xl">Отправка формы...</p>
                      </div>
                    )}

                    {formStatus === "success" && (
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

                    {formStatus === "error" && (
                      <div className="text-center p-6 bg-black/30 rounded-xl border border-red-500/20">
                        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <AlertCircle size={32} className="text-red-500" />
                        </div>
                        <h3 className="text-2xl font-medium text-white mb-2">Ошибка отправки</h3>
                        <p className="text-gray-300">
                          Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз или
                          свяжитесь с нами по телефону.
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="absolute top-0 right-0 w-40 h-40 bg-forest-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-forest-500/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

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
                  delay={0.3}
                />

                <FormInput
                  label="Телефон"
                  name="phone"
                  placeholder="+998 XX XXX XX XX"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  delay={0.4}
                />

                <div className="mb-4 -mt-2">
                  <p className="text-sm text-gray-400">* Укажите email или телефон для связи</p>
                </div>

                <CustomSelect
                  label="Услуга"
                  name="service"
                  placeholder="Выберите услугу"
                  value={formData.service}
                  onChange={handleChange}
                  options={serviceOptions}
                  error={errors.service}
                  required
                  delay={0.5}
                />

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
                    className="w-full bg-gradient-to-r from-forest-600 to-forest-500 hover:from-forest-500 hover:to-forest-600 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center transition-all group relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center">
                      <span className="mr-2">Отправить заявку</span>
                      <Send size={16} className="inline-block transition-transform group-hover:translate-x-1" />
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-white/10"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.5 }}
                    />
                  </button>

                  <p className="text-sm text-gray-400 mt-4 text-center">
                    Нажимая на кнопку, вы соглашаетесь с нашей{" "}
                    <a href="/privacy" className="text-forest-400 hover:text-forest-300 transition-colors">
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
}
