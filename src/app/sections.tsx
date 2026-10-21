import type { ReactNode } from 'react';
import type { Profile } from '@/domain/profile';
import { HeroSection } from '@/features/hero/HeroSection';
import { HeroVisualPlaceholder } from '@/app/HeroVisualPlaceholder';
import { ExperienceSection } from '@/features/experience/ExperienceSection';
import { EducationSection } from '@/features/education/EducationSection';
import { ProjectsSection } from '@/features/projects/ProjectsSection';
import { CoursesSection } from '@/features/courses/CoursesSection';
import { SkillsSection } from '@/features/skills/SkillsSection';

export interface PageSection {
  readonly id: string;
  readonly label: string;
  readonly render: (profile: Profile, id: string) => ReactNode;
}

// Captured once at the composition root so presentational components stay pure.
const now = new Date();

// Single source of truth for page order and navigation: append a section here to add it.
export const sections: readonly PageSection[] = [
  {
    id: 'about',
    label: 'About',
    render: (profile, id) => (
      <HeroSection id={id} identity={profile.identity} visual={<HeroVisualPlaceholder />} />
    ),
  },
  {
    id: 'experience',
    label: 'Experience',
    render: (profile, id) => (
      <ExperienceSection id={id} experiences={profile.experiences} now={now} />
    ),
  },
  {
    id: 'education',
    label: 'Education',
    render: (profile, id) => <EducationSection id={id} education={profile.education} now={now} />,
  },
  {
    id: 'projects',
    label: 'Projects',
    render: (profile, id) => <ProjectsSection id={id} projects={profile.projects} />,
  },
  {
    id: 'courses',
    label: 'Courses',
    render: (profile, id) => <CoursesSection id={id} courses={profile.courses} />,
  },
  {
    id: 'skills',
    label: 'Skills',
    render: (profile, id) => <SkillsSection id={id} skills={profile.skills} />,
  },
];
