import type { ReactNode } from 'react';
import type { Profile } from '@/domain/profile';
import { HeroSection } from '@/features/hero/HeroSection';
import { HeroVisualPlaceholder } from '@/app/HeroVisualPlaceholder';

export interface PageSection {
  readonly id: string;
  readonly label: string;
  readonly render: (profile: Profile, id: string) => ReactNode;
}

// Single source of truth for page order and navigation: append a section here to add it.
export const sections: readonly PageSection[] = [
  {
    id: 'about',
    label: 'About',
    render: (profile, id) => (
      <HeroSection id={id} identity={profile.identity} visual={<HeroVisualPlaceholder />} />
    ),
  },
];
