import { useId, type ReactNode } from 'react';
import type { Identity } from '@/domain/profile';
import { SocialLinks } from '@/features/hero/SocialLinks';
import styles from './HeroSection.module.css';

interface HeroSectionProps {
  readonly identity: Identity;
  readonly visual?: ReactNode;
  readonly id?: string;
}

export function HeroSection({ identity, visual, id }: HeroSectionProps) {
  const headingId = useId();

  return (
    <section id={id} aria-labelledby={headingId} className={styles.hero}>
      <div className={styles.text}>
        <p className={styles.headline}>{identity.headline}</p>
        <h1 id={headingId} className={styles.name}>
          {identity.fullName}
        </h1>
        <p className={styles.location}>{identity.location}</p>
        <p className={styles.summary}>{identity.summary}</p>
        <SocialLinks links={identity.socials} />
      </div>
      {visual && <div className={styles.visual}>{visual}</div>}
    </section>
  );
}
