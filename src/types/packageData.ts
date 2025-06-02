// src/types/treatmentPackages.ts

export interface TreatmentPackage {
  id: string;
  name: string;
  description: string;
  detailedDescription?: string;
  includedServices: {
    serviceId: string;
    name: string;
    description?: string;
  }[];
  totalDuration: string;
  packagePrice: number;
  originalPrice: number; // Sum of individual prices
  discount?: number; // Percentage discount
  popular?: boolean;
  imageUrl?: string;
  benefits: string[];
  suitableFor?: string[];
  process?: {
    step: number;
    title: string;
    description: string;
  }[];
  forNewClientsOnly?: boolean; // Added for "First Step" package
  category?: string; // For categorization purposes
}

// First Step Package for new clients
export const firstStepPackage: TreatmentPackage = {
  id: 'first-step-package',
  name: 'Пакет "Первый шаг"',
  description:
    'Специальное предложение для новых клиентов: консультация специалиста + профессиональная гигиена полости рта.',
  detailedDescription:
    'Идеальное начало заботы о вашем стоматологическом здоровье. Пакет включает подробную консультацию с составлением плана лечения и профессиональную чистку зубов по специальной цене для новых клиентов.',
  includedServices: [
    {
      serviceId: 'consult-diagnostic',
      name: 'Консультация и диагностика',
      description: 'Подробный осмотр, фото-протокол, диагностика и составление плана лечения',
    },
    {
      serviceId: 'hygiene-initial',
      name: 'Профессиональная гигиена полости рта',
      description: 'Комплексная процедура удаления зубных отложений и полировки поверхности зубов',
    },
  ],
  totalDuration: '80 мин',
  packagePrice: 4500, // Reduced price
  originalPrice: 5300, // Sum of individual prices (consultation + hygiene)
  discount: 15, // Percentage discount
  popular: true,
  benefits: [
    'Экономия 15% по сравнению с отдельной записью на услуги',
    'Комплексный подход к диагностике с первого посещения',
    'Составление индивидуального плана лечения',
    'Профессиональная чистка зубов для свежего дыхания и здоровья десен',
  ],
  suitableFor: [
    'Для новых клиентов клиники',
    'Если вы не посещали стоматолога более года',
    'Для профилактического осмотра и чистки',
  ],
  process: [
    {
      step: 1,
      title: 'Первичная консультация',
      description: 'Знакомство с врачом, сбор анамнеза и обсуждение ваших целей лечения',
    },
    {
      step: 2,
      title: 'Диагностика',
      description: 'Тщательный осмотр зубов и десен, фотопротокол, при необходимости — рентген',
    },
    {
      step: 3,
      title: 'Составление плана',
      description: 'Врач предложит оптимальный план лечения с учетом ваших пожеланий и бюджета',
    },
    {
      step: 4,
      title: 'Профессиональная гигиена',
      description: 'Удаление зубных отложений с использованием современных технологий',
    },
  ],
  forNewClientsOnly: true,
  category: 'hygiene',
};

// Sample packages
export const treatmentPackages: TreatmentPackage[] = [
  // First Step Package is listed first
  firstStepPackage,

  {
    id: 'complete-smile-makeover',
    name: 'Комплексное преображение улыбки',
    description:
      'Полное преобразование вашей улыбки, включающее отбеливание, виниры и профессиональную чистку.',
    includedServices: [
      { serviceId: 'whitening', name: 'Профессиональное отбеливание зубов' },
      { serviceId: 'veneers', name: 'Установка виниров' },
      { serviceId: 'hygiene', name: 'Профессиональная чистка зубов' },
    ],
    totalDuration: '3-4 недели',
    packagePrice: 45000,
    originalPrice: 55000,
    discount: 18,
    popular: true,
    benefits: [
      'Значительно более светлые зубы',
      'Коррекция формы и цвета передних зубов',
      'Здоровые десны и свежее дыхание',
      'Долговременный результат',
    ],
    suitableFor: [
      'Для подготовки к важным событиям (свадьба, юбилей)',
      'При желании кардинально изменить внешний вид улыбки',
      'Для устранения нескольких эстетических проблем одновременно',
    ],
    process: [
      {
        step: 1,
        title: 'Консультация и планирование',
        description: 'Детальное обсуждение ваших пожеланий и разработка плана лечения',
      },
      {
        step: 2,
        title: 'Профессиональная чистка',
        description: 'Удаление зубного камня и подготовка к дальнейшим процедурам',
      },
      {
        step: 3,
        title: 'Отбеливание зубов',
        description: 'Процедура отбеливания с применением современных технологий',
      },
      {
        step: 4,
        title: 'Установка виниров',
        description: 'Установка виниров для создания идеальной формы и цвета зубов',
      },
    ],
  },
];

// Helper functions
export const getPopularPackages = () => {
  return treatmentPackages.filter((pkg) => pkg.popular);
};

export const getAllPackages = () => {
  return treatmentPackages;
};

export const getPackageById = (id: string) => {
  return treatmentPackages.find((pkg) => pkg.id === id);
};

// New helper for First Step Package
export const getFirstStepPackage = () => {
  return firstStepPackage;
};
