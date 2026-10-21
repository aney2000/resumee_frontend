/**
 * ============================================================================
 *  YOUR CV DATA — THIS IS THE ONLY FILE YOU NEED TO EDIT.
 * ============================================================================
 *
 *  Everything below is PLACEHOLDER content. Replace it with your own details.
 *
 *  - Dates use the 'YYYY-MM' format. Omit `end` for something that is ongoing.
 *  - Every `id` must be unique across experiences, education, projects and courses.
 *  - Photo: put your picture at `public/photo.jpg` and set `photoUrl: '/photo.jpg'`.
 *    Until then the placeholder silhouette `public/photo.svg` is used.
 *
 *  A test (`src/data/profile.data.test.ts`) validates this file, so run
 *  `npm test` after editing to catch typos in dates or duplicate ids.
 * ============================================================================
 */
import type { Profile } from '@/domain/profile';

export const profileData: Profile = {
  identity: {
    fullName: 'Your Name',
    headline: 'Frontend Engineer',
    location: 'Berlin, Germany',
    photoUrl: '/photo.svg',
    summary:
      'Frontend engineer focused on accessible, well-tested interfaces and delightful interactive experiences. I enjoy turning complex problems into simple, maintainable products.',
    badgeId: 'EMP-000123',
    organization: 'Example Corp',
    socials: [
      { label: 'GitHub', url: 'https://github.com/your-handle', kind: 'github' },
      { label: 'LinkedIn', url: 'https://www.linkedin.com/in/your-handle', kind: 'linkedin' },
      { label: 'Email', url: 'mailto:you@example.com', kind: 'email' },
      { label: 'Website', url: 'https://example.com', kind: 'website' },
    ],
  },
  experiences: [
    {
      id: 'exp-senior-frontend',
      role: 'Senior Frontend Engineer',
      company: 'Example Corp',
      period: { start: '2022-04' },
      description: 'Lead frontend development of the customer-facing web platform.',
      highlights: [
        'Introduced a component library adopted by 5 product teams',
        'Cut bundle size by 35% through code splitting and lazy loading',
        'Mentored 4 junior engineers',
      ],
      technologies: ['React', 'TypeScript', 'Vite', 'Vitest', 'Storybook'],
    },
    {
      id: 'exp-frontend',
      role: 'Frontend Engineer',
      company: 'Startup GmbH',
      period: { start: '2019-09', end: '2022-03' },
      description: 'Built and maintained the single-page dashboard application.',
      highlights: [
        'Migrated the codebase from JavaScript to TypeScript',
        'Raised test coverage from 20% to 85%',
      ],
      technologies: ['React', 'Redux', 'TypeScript', 'Jest'],
    },
    {
      id: 'exp-junior-web',
      role: 'Junior Web Developer',
      company: 'Agency Studio',
      period: { start: '2018-07', end: '2019-08' },
      description: 'Delivered responsive marketing websites for agency clients.',
      highlights: ['Shipped 12 client websites', 'Improved Lighthouse scores to 90+'],
      technologies: ['HTML', 'CSS', 'JavaScript', 'WordPress'],
    },
  ],
  education: [
    {
      id: 'edu-msc',
      degree: 'M.Sc. Computer Science',
      institution: 'Example University',
      period: { start: '2016-10', end: '2018-06' },
      description: 'Focus on human-computer interaction and computer graphics.',
    },
    {
      id: 'edu-bsc',
      degree: 'B.Sc. Computer Science',
      institution: 'Example University',
      period: { start: '2013-10', end: '2016-09' },
      description: 'Foundations of software engineering, algorithms and web technologies.',
    },
  ],
  projects: [
    {
      id: 'prj-portfolio',
      name: '3D Portfolio',
      description: 'This interactive 3D CV built with React and Three.js.',
      technologies: ['React', 'TypeScript', 'Three.js'],
      repoUrl: 'https://github.com/your-handle/portfolio',
      period: { start: '2026-09' },
    },
    {
      id: 'prj-habit-tracker',
      name: 'Habit Tracker',
      description: 'An offline-first progressive web app for tracking daily habits.',
      technologies: ['React', 'IndexedDB', 'Service Workers'],
      url: 'https://habits.example.com',
      repoUrl: 'https://github.com/your-handle/habit-tracker',
      period: { start: '2023-02', end: '2023-08' },
    },
    {
      id: 'prj-ui-kit',
      name: 'Accessible UI Kit',
      description: 'A small open-source collection of accessible React components.',
      technologies: ['React', 'TypeScript', 'Testing Library'],
      repoUrl: 'https://github.com/your-handle/ui-kit',
      period: { start: '2021-05', end: '2021-12' },
    },
  ],
  courses: [
    {
      id: 'crs-testing',
      title: 'Testing JavaScript Applications',
      provider: 'Online Academy',
      completedOn: '2024-03',
      certificateUrl: 'https://example.com/certificates/testing',
      skills: ['Unit testing', 'Integration testing', 'TDD'],
    },
    {
      id: 'crs-threejs',
      title: 'Three.js Journey',
      provider: 'Online Academy',
      completedOn: '2025-01',
      skills: ['Three.js', 'WebGL', 'Shaders'],
    },
    {
      id: 'crs-a11y',
      title: 'Web Accessibility Fundamentals',
      provider: 'Learning Platform',
      completedOn: '2022-11',
      skills: ['WCAG', 'ARIA', 'Screen readers'],
    },
    {
      id: 'crs-typescript',
      title: 'Advanced TypeScript',
      provider: 'Learning Platform',
      completedOn: '2021-02',
      skills: ['Generics', 'Type-level programming'],
    },
  ],
  skills: [
    { category: 'Languages', items: ['TypeScript', 'JavaScript', 'HTML', 'CSS'] },
    { category: 'Frameworks', items: ['React', 'Vite', 'Three.js'] },
    { category: 'Testing', items: ['Vitest', 'Testing Library', 'Playwright'] },
    { category: 'Practices', items: ['TDD', 'SOLID', 'Accessibility', 'CI/CD'] },
  ],
};
