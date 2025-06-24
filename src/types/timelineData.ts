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
    year: 1936,
    title: '1936 год',
    description: 'Начало пути. Первый Азимов в стоматологии. В 1936 году, сразу после окончания медтехникума, Исмоилжон Азимов стал единственным стоматологом посёлка Сырдарья, леча пациентов вручную на самодельной установке.',
    image: '/images/timeline/1936.jpg', // Placeholder
  },
  {
    year: 2018,
    title: '2018 год',
    description: 'Мы стояли перед дверями собственной клиники, полной надежд — и пустых стен.',
    image: '/images/timeline/2018.jpg', // Placeholder
  },
  {
    year: 2019,
    title: '2019 год',
    description:
      'Следующее поколение в деле. В 2019 году в клинику официально вошёл Азимов Абдухамиджон Мухамаджонович, младший представитель третьего поколения семьи.',
    image: '/images/timeline/2019.jpg', // Placeholder
  },
  {
    year: 2020,
    title: '2020 год',
    description:
      'Первая имплантация. Новый уровень клиники. Этот день стал поворотным: в 2020 году в abclinic.uz была проведена первая имплантация.',
    image: '/images/timeline/2020.jpg', // Placeholder
  },
  {
    year: 2021,
    title: '2021 год',
    description:
      'Новая глава в тех же стенах. Спустя три года мы вернулись к той самой комнате, с которой всё началось, — чтобы переосмыслить её.',
    image: '/images/timeline/2021.jpg', // Placeholder
  },
  {
    year: 2022,
    title: '2022 год',
    description: 'В 2022 году мы провели первый в истории клиники международный благотворительный проект: совместно с австралийскими хирургами-имплантологами мы устанавливали бесплатные имплантаты местному населению в течение недели.',
    image: '/images/timeline/2022.jpg', // Placeholder
  },
];
