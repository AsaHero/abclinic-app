// src/data/timelineData.ts
export interface TimelineEntry {
  year: number;
  title: string;
  description: string;
  image: string;
}

// Using placeholder images until real images are available
export const timelineData: TimelineEntry[] = [
  {
    year: 1995,
    title: '1995 год',
    description:
      'История стоматологии уходит корнями в древние времена, когда люди использовали примитивные методы для лечения зубов, такие как вырывание больных зубов. С течением времени развитие медицины привело к появлению современной стоматологии.',
    image:
      'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?q=80&w=1200&auto=format&fit=crop', // Placeholder
  },
  {
    year: 1998,
    title: '1998 год',
    description:
      'Наша клиника была основана группой энтузиастов, стремящихся изменить подход к стоматологическому лечению и сделать его более комфортным для пациентов.',
    image:
      'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=1200&auto=format&fit=crop', // Placeholder
  },
  {
    year: 2002,
    title: '2002 год',
    description:
      'Расширение клиники и внедрение новых технологий лечения. Мы были одними из первых, кто начал использовать цифровые рентгеновские системы в нашем регионе.',
    image:
      'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?q=80&w=1200&auto=format&fit=crop', // Placeholder
  },
  {
    year: 2005,
    title: '2005 год',
    description:
      'Открытие образовательного центра для стоматологов. Начало проведения регулярных семинаров и мастер-классов для повышения квалификации специалистов.',
    image:
      'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?q=80&w=1200&auto=format&fit=crop', // Placeholder
  },
  {
    year: 2008,
    title: '2008 год',
    description:
      'Внедрение инновационных методов имплантации зубов. Наши специалисты прошли обучение в ведущих клиниках Европы и привезли передовой опыт.',
    image:
      'https://images.unsplash.com/photo-1504257432389-52343af06ae3?q=80&w=1200&auto=format&fit=crop', // Placeholder
  },
  {
    year: 2012,
    title: '2012 год',
    description:
      'Открытие нового современного здания клиники, оснащенного по последнему слову техники. Значительное расширение спектра предоставляемых услуг.',
    image:
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200&auto=format&fit=crop', // Placeholder
  },
  {
    year: 2015,
    title: '2015 год',
    description:
      'Открытие нового современного здания клиники, оснащенного по последнему слову техники. Значительное расширение спектра предоставляемых услуг.',
    image:
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200&auto=format&fit=crop', // Placeholder
  },
  {
    year: 2017,
    title: '2017 год',
    description:
      'Открытие нового современного здания клиники, оснащенного по последнему слову техники. Значительное расширение спектра предоставляемых услуг.',
    image:
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200&auto=format&fit=crop', // Placeholder
  },
];
