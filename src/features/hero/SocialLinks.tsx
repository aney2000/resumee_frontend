import type { SocialLink } from '@/domain/profile';
import styles from './SocialLinks.module.css';

interface SocialLinksProps {
  readonly links: readonly SocialLink[];
}

function hrefFor(link: SocialLink): string {
  if (link.kind === 'email' && !link.url.startsWith('mailto:')) {
    return `mailto:${link.url}`;
  }
  return link.url;
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
          <a className={styles.link} href={hrefFor(link)} {...externalAttributes(link)}>
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
