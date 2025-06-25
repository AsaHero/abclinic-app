// src/components/layout/Header.tsx
import { useEffect, useState, useCallback, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';

// Premium nav item component with animations
const NavLink = ({ to, label, isActive, onMouseEnter, onMouseLeave }) => {
  return (
    <Link
      to={to}
      className="relative group font-inter text-lg text-white transition-colors px-2 py-3 flex items-center"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {label}
      <motion.div
        className="absolute bottom-0 left-0 w-full h-[2px] bg-white/70 origin-center"
        initial={{ scaleX: isActive ? 1 : 0 }}
        animate={{ scaleX: isActive ? 1 : 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.2 }}
      />
    </Link>
  );
};

// Premium language button component with animations
const LanguageButton = ({ lang, isActive, onClick }) => {
  return (
    <motion.button
      className={`flex items-center space-x-1.5 hover:opacity-80 transition-all ${isActive ? 'text-white' : 'text-white/70'}`}
      onClick={() => onClick(lang)}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2 }}
    >
      <img src={`/flags/${lang}.svg`} alt={lang.toUpperCase()} className="w-5 h-4 rounded-sm" />
      <span className="font-inter text-sm">{lang.toUpperCase()}</span>
    </motion.button>
  );
};

// SubMenu component for premium dropdown
const SubMenu = ({ items, show, onMouseEnter, onMouseLeave }) => {
  if (!items || items.length === 0) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-[#1a1f25]/95 backdrop-blur-lg
            shadow-lg rounded-xl border border-white/10 overflow-hidden z-50 w-64"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <div className="py-2">
            {items.map((item, idx) => (
              <Link
                key={idx}
                to={item.to}
                className="block px-4 py-2.5 text-white/80 hover:text-white hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center">
                  {item.icon && <span className="mr-3 text-blue-400">{item.icon}</span>}
                  <div>
                    <p className="font-medium">{item.label}</p>
                    {item.description && (
                      <p className="text-xs text-white/50 mt-0.5">{item.description}</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Enhanced premium navigation data
const navItems = [
  {
    to: '/',
    label: 'О стоматологии',
    hasSubmenu: true,
    submenuItems: [
      {
        to: '/about/story',
        label: 'История клиники',
        description: 'Узнайте нашу историю и ценности',
        icon: (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
      },
      {
        to: '/',
        label: 'Инновации',
        description: 'Передовые технологии в стоматологии',
        icon: (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.66347 17H14.3364M11.9999 3V4M18.3639 5.63604L17.6568 6.34315M21 11.9999H20M4 11.9999H3M6.34309 6.34315L5.63599 5.63604M8.46441 15.5356C6.51179 13.5829 6.51179 10.4171 8.46441 8.46449C10.417 6.51187 13.5829 6.51187 15.5355 8.46449C17.4881 10.4171 17.4881 13.5829 15.5355 15.5356L14.9884 16.0827C14.3555 16.7155 13.9999 17.5739 13.9999 18.469V19C13.9999 20.1046 13.1045 21 11.9999 21C10.8954 21 9.99992 20.1046 9.99992 19V18.469C9.99992 17.5739 9.6444 16.7155 9.01151 16.0827L8.46441 15.5356Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
      },
      {
        to: '/',
        label: 'Наша команда',
        description: 'Познакомьтесь с нашими специалистами',
        icon: (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17 20H22V18C22 16.3431 20.6569 15 19 15C18.0444 15 17.1931 15.4468 16.6438 16.1429M17 20H7M17 20V18C17 17.3438 16.8736 16.717 16.6438 16.1429M16.6438 16.1429C15.6229 14.5564 13.9079 13.5 12 13.5C10.0921 13.5 8.37707 14.5564 7.35617 16.1429M7 20H2V18C2 16.3431 3.34315 15 5 15C5.95561 15 6.80686 15.4468 7.35617 16.1429M15 7C15 8.65685 13.6569 10 12 10C10.3431 10 9 8.65685 9 7C9 5.34315 10.3431 4 12 4C13.6569 4 15 5.34315 15 7ZM21 10C21 11.1046 20.1046 12 19 12C17.8954 12 17 11.1046 17 10C17 8.89543 17.8954 8 19 8C20.1046 8 21 8.89543 21 10ZM7 10C7 11.1046 6.10457 12 5 12C3.89543 12 3 11.1046 3 10C3 8.89543 3.89543 8 5 8C6.10457 8 7 8.89543 7 10Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
      },
    ],
  },
  {
    to: '/services', // This is the default page when clicking "Услуги"
    label: 'Услуги',
    hasSubmenu: false,
    submenuItems: [
      {
        to: '/complex-treatment',
        label: 'Комплексное лечение',
        description: 'Пакеты комплексных решений со скидкой',
        icon: (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 12L11 14L15 10M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
      },
      {
        to: '/services',
        label: 'Все услуги',
        description: 'Полный прайс-лист всех услуг клиники',
        icon: (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
      },
    ],
  },
  {
    to: '/contact',
    label: 'Контакты',
    hasSubmenu: false,
  },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState('ru');
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const location = useLocation();
  const submenuTimeoutRef = useRef(null);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setActiveSubmenu(null);
  }, [location]);

  // Body scroll lock when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      // Store original overflow
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;

      // Lock scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${window.scrollY}px`;
      document.body.style.width = '100%';

      // Cleanup function
      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
        document.body.style.top = '';
        document.body.style.width = '';

        // Restore scroll position
        const scrollPosition = parseInt(document.body.style.top || '0') * -1;
        window.scrollTo(0, scrollPosition);
      };
    }
  }, [isMenuOpen]);

  // Premium scroll handling with performance optimizations
  const handleScroll = useCallback(() => {
    // Don't handle scroll when mobile menu is open
    if (isMenuOpen) return;

    const currentScrollY = window.scrollY;

    // Determine if header should hide or show based on scroll direction
    if (currentScrollY > scrollY + 10 && currentScrollY > 100) {
      setIsVisible(false);
    } else if (currentScrollY < scrollY - 10 || currentScrollY < 100) {
      setIsVisible(true);
    }

    // Determine if header should be transparent or solid
    setIsScrolled(currentScrollY > 20);

    setScrollY(currentScrollY);
  }, [scrollY, isMenuOpen]);

  // Set up scroll event listener with proper cleanup and throttling
  useEffect(() => {
    let scrollTimer;
    let lastScrollY = 0;
    let ticking = false;

    const onScroll = () => {
      lastScrollY = window.scrollY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [handleScroll]);

  // Premium submenu handling with delay for better UX
  const handleSubmenuEnter = (index) => {
    clearTimeout(submenuTimeoutRef.current);
    setActiveSubmenu(index);
  };

  const handleSubmenuLeave = () => {
    submenuTimeoutRef.current = setTimeout(() => {
      setActiveSubmenu(null);
    }, 300);
  };

  // Handle language change
  const handleLanguageChange = (lang) => {
    setActiveLanguage(lang);
    // In a real app, would also change the app's language
  };

  // Handle mobile menu toggle
  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <motion.header
        className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-[#171b21]/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
        }`}
        initial={{ y: 0 }}
        animate={{
          y: isVisible || isMenuOpen ? 0 : -100, // Always show when menu is open
          opacity: isVisible || isMenuOpen ? 1 : 0,
        }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Main header content */}
        <div className="container mx-auto px-6 py-6 flex justify-between items-center relative">
          {/* Premium desktop navigation with enhanced animations */}
          <nav className="hidden lg:flex items-center">
            <ul className="flex space-x-8">
              {navItems.map((item, index) => (
                <li key={index} className="relative">
                  <div
                    onMouseEnter={() => item.hasSubmenu && handleSubmenuEnter(index)}
                    onMouseLeave={handleSubmenuLeave}
                  >
                    <div className="flex items-center">
                      <NavLink
                        to={item.to}
                        label={item.label}
                        isActive={
                          location.pathname === item.to ||
                          location.pathname.startsWith(`${item.to}/`)
                        }
                        onMouseEnter={() => item.hasSubmenu && handleSubmenuEnter(index)}
                        onMouseLeave={item.hasSubmenu ? handleSubmenuLeave : undefined}
                      />
                      {item.hasSubmenu && (
                        <motion.div
                          className="ml-1 text-white/70"
                          animate={{ rotate: activeSubmenu === index ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown size={14} />
                        </motion.div>
                      )}
                    </div>

                    {/* Submenu dropdown */}
                    {item.hasSubmenu && (
                      <SubMenu
                        items={item.submenuItems}
                        show={activeSubmenu === index}
                        onMouseEnter={() => handleSubmenuEnter(index)}
                        onMouseLeave={handleSubmenuLeave}
                      />
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </nav>

          {/* Premium language and contact buttons */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Premium call button with animation */}
            <Button
              asChild
              className="bg-white hover:bg-white/90 text-primary-900 rounded-full px-4 py-6
              flex items-center transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/10"
            >
              <a href="tel:+99895122-88-55" className="flex items-center">
                <span className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <Phone size={14} className="text-white" />
                </span>
                <span className="font-medium">+998 95 122-88-55</span>
              </a>
            </Button>
          </div>

          {/* Mobile menu button with premium animation */}
          <motion.button
            className="lg:hidden text-white p-2 z-20 relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleMenuToggle}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={24} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, rotate: 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -90 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={24} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Premium mobile menu with enhanced animations */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="lg:hidden fixed inset-0 bg-[#171b21]/98 backdrop-blur-md z-10 pt-24 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="container mx-auto px-4 py-6 flex flex-col h-full overflow-y-auto">
                {/* Mobile navigation links with premium animations */}
                <nav className="flex-1">
                  <ul className="space-y-6">
                    {navItems.map((item, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 + 0.1, duration: 0.3 }}
                      >
                        <Link
                          to={item.to}
                          className="py-2 font-inter text-xl text-gray-300 transition-colors block"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.label}
                        </Link>

                        {/* Mobile submenu - simplified version */}
                        {item.hasSubmenu && (
                          <div className="ml-4 mt-3 space-y-3">
                            {item.submenuItems.map((subItem, subIdx) => (
                              <motion.div
                                key={subIdx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                  delay: index * 0.05 + 0.1 + (subIdx + 1) * 0.03,
                                  duration: 0.3,
                                }}
                              >
                                <Link
                                  to={subItem.to}
                                  className="py-1 text-white/70 hover:text-white flex items-center transition-all duration-200"
                                  onClick={() => setIsMenuOpen(false)}
                                >
                                  <span className="mr-2 text-blue-400">{subItem.icon}</span>
                                  {subItem.label}
                                </Link>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </motion.li>
                    ))}
                  </ul>
                </nav>

                {/* Mobile bottom section with language and contact */}
                <div className="pt-6 border-t border-white/10">
                  {/* Contact button */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Button
                      asChild
                      className="w-full bg-white hover:bg-white/90 text-primary-900 rounded-full py-6 flex items-center justify-center"
                    >
                      <a href="tel:+99895122-88-55">
                        <Phone size={16} className="mr-2" />
                        Позвонить
                      </a>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Natural Logo with Organic Animations */}
      <Link to="/" className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[100]">
        <motion.div
          className="relative flex items-center justify-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {/* Subtle glow effect - multiple layers for better browser support */}
          <motion.div
            className="absolute inset-0 bg-white/10 rounded-full blur-lg"
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute inset-0 bg-white/20 rounded-full blur-md"
            animate={{
              scale: [1, 1.08, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.5,
            }}
          />

          {/* Main logo with natural breathing animation */}
          <motion.img
            src="/images/logo.png"
            alt="AB Clinic"
            //style={{ filter: "drop-shadow(0 0 0.1rem 0.1rem #ffffff)" }}
            className="relative h-14 md:h-16 drop-shadow-lg"
            animate={{
              y: [0, -2, 0],
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
              times: [0, 0.5, 1],
            }}
            whileHover={{
              scale: 1.08,
              rotate: [0, -1, 1, 0],
              transition: {
                duration: 0.6,
                rotate: {
                  duration: 0.8,
                  ease: 'easeInOut',
                },
              },
            }}
            whileTap={{
              scale: 0.96,
              transition: { duration: 0.1 },
            }}
          />

          {/* Interactive sparkle effect on hover */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={false}
            whileHover={{
              background: [
                'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                'radial-gradient(circle at 40% 40%, rgba(255,255,255,0.1) 0%, transparent 50%)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>
      </Link>
    </>
  );
};

export default Header;
