"use client";

// src/components/layout/Header.tsx
import { useEffect, useState, useCallback, useRef, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import BookingButton from "../common/BookingButton";

type SubmenuItem = {
  to: string;
  label: string;
  description?: string;
  icon?: ReactNode;
};

type NavItem = {
  to: string;
  label: string;
  hasSubmenu: boolean;
  submenuItems?: SubmenuItem[];
};

const NavLink = ({
  to,
  label,
  isActive,
  onMouseEnter,
  onMouseLeave,
}: {
  to: string;
  label: string;
  isActive: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) => {
  return (
    <Link
      href={to}
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

const SubMenu = ({
  items,
  show,
  onMouseEnter,
  onMouseLeave,
}: {
  items?: SubmenuItem[];
  show: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) => {
  if (!items || items.length === 0) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-[#002a27]/95 backdrop-blur-lg
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
                href={item.to}
                className="block px-4 py-2.5 text-white/80 hover:text-white hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center">
                  {item.icon && <span className="mr-3 text-forest-400">{item.icon}</span>}
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

const navItems: NavItem[] = [
  {
    to: "/about",
    label: "О клинике",
    hasSubmenu: false,
  },
  {
    to: "/team",
    label: "Команда",
    hasSubmenu: false,
  },
  {
    to: "/services",
    label: "Услуги",
    hasSubmenu: true,
    submenuItems: [
      {
        to: "/complex-treatment",
        label: "Комплексное лечение",
        description: "Пакеты комплексных решений со скидкой",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        to: "/services",
        label: "Все услуги",
        description: "Полный прайс-лист всех услуг клиники",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    to: "/blog",
    label: "Блог",
    hasSubmenu: false,
  },
  {
    to: "/documents",
    label: "Подготовка к приёму",
    hasSubmenu: false,
  },
  {
    to: "/contact",
    label: "Контакты",
    hasSubmenu: false,
  },
];

// Extracted so it can render twice: once fixed-centered for mobile (where
// nav/buttons collapse away and dead-center is always safe), once as a
// normal flex child between nav and the button group on desktop. Desktop
// nav width isn't fixed (item count/labels change), so a viewport-centered
// fixed logo there drifts into whichever nav link happens to end up past
// center — flexbox positioning can't overlap a sibling, ever.
const Logo = ({ className }: { className: string }) => (
  <Link href="/" className={className}>
    <motion.div
      className="relative flex items-center justify-center"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <motion.div
        className="absolute inset-0 bg-white/10 rounded-full blur-lg"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
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
          ease: "easeInOut",
          delay: 0.5,
        }}
      />

      <motion.img
        src="/images/logo.png"
        alt="AB Clinic"
        className="relative h-14 md:h-16 drop-shadow-lg"
        animate={{
          y: [0, -2, 0],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.5, 1],
        }}
        whileHover={{
          scale: 1.08,
          rotate: [0, -1, 1, 0],
          transition: {
            duration: 0.6,
            rotate: {
              duration: 0.8,
              ease: "easeInOut",
            },
          },
        }}
        whileTap={{
          scale: 0.96,
          transition: { duration: 0.1 },
        }}
      />

      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={false}
        whileHover={{
          background: [
            "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 40% 40%, rgba(255,255,255,0.1) 0%, transparent 50%)",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  </Link>
);

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null);
  const pathname = usePathname();
  const submenuTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    setIsMenuOpen(false);
    setActiveSubmenu(null);
  }, [pathname]);

  useEffect(() => {
    if (isMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;

      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${window.scrollY}px`;
      document.body.style.width = "100%";

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
        document.body.style.top = "";
        document.body.style.width = "";

        const scrollPosition = parseInt(document.body.style.top || "0") * -1;
        window.scrollTo(0, scrollPosition);
      };
    }
  }, [isMenuOpen]);

  const handleScroll = useCallback(() => {
    if (isMenuOpen) return;

    const currentScrollY = window.scrollY;

    if (currentScrollY > scrollY + 10 && currentScrollY > 100) {
      setIsVisible(false);
    } else if (currentScrollY < scrollY - 10 || currentScrollY < 100) {
      setIsVisible(true);
    }

    setIsScrolled(currentScrollY > 20);
    setScrollY(currentScrollY);
  }, [scrollY, isMenuOpen]);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [handleScroll]);

  const handleSubmenuEnter = (index: number) => {
    clearTimeout(submenuTimeoutRef.current);
    setActiveSubmenu(index);
  };

  const handleSubmenuLeave = () => {
    submenuTimeoutRef.current = setTimeout(() => {
      setActiveSubmenu(null);
    }, 300);
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <motion.header
        className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-[#001d1c]/95 backdrop-blur-md shadow-lg" : "bg-transparent"
        }`}
        initial={{ y: 0 }}
        animate={{
          y: isVisible || isMenuOpen ? 0 : -100,
          opacity: isVisible || isMenuOpen ? 1 : 0,
        }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="container mx-auto px-6 py-6 flex justify-between items-center relative">
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
                        isActive={pathname === item.to || pathname.startsWith(`${item.to}/`)}
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

          <Logo className="hidden lg:flex flex-shrink-0 mx-6" />

          <div className="hidden lg:flex items-center space-x-4">
            <BookingButton glass className="items-center rounded-full px-5 py-2.5 text-white font-medium">
              Записаться
            </BookingButton>

            <Button
              asChild
              className="bg-white hover:bg-white/90 text-primary-900 rounded-full px-4 py-6
              flex items-center transition-all duration-300 hover:shadow-lg hover:shadow-forest-900/10"
            >
              <a href="tel:+99895122-88-55" className="flex items-center">
                <span className="w-8 h-8 rounded-full bg-forest-500 flex items-center justify-center">
                  <Phone size={14} className="text-white" />
                </span>
                <span className="font-medium">+998 95 122-88-55</span>
              </a>
            </Button>
          </div>

          <motion.button
            className="lg:hidden text-white p-2 z-20 relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleMenuToggle}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
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

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="lg:hidden fixed inset-0 bg-[#001d1c]/98 backdrop-blur-md z-10 pt-24 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="container mx-auto px-4 py-6 flex flex-col h-full overflow-y-auto">
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
                          href={item.to}
                          className="py-2 font-inter text-xl text-gray-300 transition-colors block"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.label}
                        </Link>

                        {item.hasSubmenu && (
                          <div className="ml-4 mt-3 space-y-3">
                            {item.submenuItems?.map((subItem, subIdx) => (
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
                                  href={subItem.to}
                                  className="py-1 text-white/70 hover:text-white flex items-center transition-all duration-200"
                                  onClick={() => setIsMenuOpen(false)}
                                >
                                  <span className="mr-2 text-forest-400">{subItem.icon}</span>
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

                <div className="pt-6 border-t border-white/10 space-y-3">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    <BookingButton className="w-full inline-flex items-center justify-center rounded-full py-3 border border-white/30 text-white bg-transparent hover:bg-white/10 backdrop-blur-sm font-medium">
                      Записаться
                    </BookingButton>
                  </motion.div>

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

      {/* Mobile only — nav/buttons collapse to just the hamburger here, so a
          fixed dead-center logo can never collide with anything. Desktop's
          instance is the flex child up in the header row above, precisely
          because a fixed center CAN collide there (see Logo's comment). */}
      <Logo className="lg:hidden fixed top-4 left-1/2 -translate-x-1/2 z-[100]" />
    </>
  );
};

export default Header;
