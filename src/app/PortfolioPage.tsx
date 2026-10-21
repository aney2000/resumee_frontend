import { Fragment } from 'react';
import type { Profile } from '@/domain/profile';
import { SiteNav } from '@/features/navigation/SiteNav';
import { sections } from '@/app/sections';

interface PortfolioPageProps {
  readonly profile: Profile;
}

const navItems = sections.map(({ id, label }) => ({ id, label }));

export function PortfolioPage({ profile }: PortfolioPageProps) {
  return (
    <>
      <SiteNav items={navItems} />
      <main id="content">
        {sections.map((section) => (
          <Fragment key={section.id}>{section.render(profile, section.id)}</Fragment>
        ))}
      </main>
    </>
  );
}
