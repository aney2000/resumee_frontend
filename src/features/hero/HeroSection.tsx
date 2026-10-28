import { useId, type ReactNode } from 'react';
import type { Identity } from '@/domain/profile';
import { HeroActions } from '@/features/hero/HeroActions';
import { socialHref } from '@/features/hero/socialHref';
import { SocialLinks } from '@/features/hero/SocialLinks';
import styles from './HeroSection.module.css';

interface HeroSectionProps {
  readonly identity: Identity;
  readonly visual?: ReactNode;
  readonly id?: string;
}

export function HeroSection({ identity, visual, id }: HeroSectionProps) {
  const headingId = useId();
  const email = identity.socials.find((link) => link.kind === 'email');

  return (
    <section id={id} aria-labelledby={headingId} className={styles.hero}>
      <div className={styles.text}>
        <p className={styles.headline}>{identity.headline}</p>
        <h1 id={headingId} className={styles.name}>
          {identity.fullName}
        </h1>
        <p className={styles.location}>{identity.location}</p>
        <p className={styles.summary}>{identity.summary}</p>
        <HeroActions contactHref={email && socialHref(email)} />
        <SocialLinks links={identity.socials} />
      </div>
      {visual && <div className={styles.visual}>{visual}</div>}
    </section>
  );
}
