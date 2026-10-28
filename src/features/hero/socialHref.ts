import type { SocialLink } from '@/domain/profile';

/** Email links may be stored as a bare address; everything else is used as is. */
export function socialHref(link: SocialLink): string {
  if (link.kind === 'email' && !link.url.startsWith('mailto:')) {
    return `mailto:${link.url}`;
  }
  return link.url;
}
