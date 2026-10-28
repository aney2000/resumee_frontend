import type { SocialLink } from '@/domain/profile';
import { socialHref } from '@/features/hero/socialHref';
import styles from './SocialLinks.module.css';

interface SocialLinksProps {
  readonly links: readonly SocialLink[];
}

function externalAttributes(link: SocialLink) {
  return link.kind === 'email' ? {} : { target: '_blank', rel: 'noopener noreferrer' };
}

export function SocialLinks({ links }: SocialLinksProps) {
  if (links.length === 0) {
    return null;
  }

  return (
    <ul aria-label="Social links" className={styles.list}>
      {links.map((link) => (
        <li key={link.url}>
          <a className={styles.link} href={socialHref(link)} {...externalAttributes(link)}>
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
