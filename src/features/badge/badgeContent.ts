import type { Identity } from '@/domain/profile';

export interface BadgeContact {
  readonly label: string;
  readonly url: string;
}

export interface BadgeFront {
  readonly name: string;
  readonly title: string;
  readonly organization: string;
  readonly photoUrl: string;
  readonly badgeId: string;
}

export interface BadgeBack {
  readonly summary: string;
  readonly location: string;
  readonly contacts: readonly BadgeContact[];
}

export interface BadgeContent {
  readonly front: BadgeFront;
  readonly back: BadgeBack;
}

export function toBadgeContent(identity: Identity): BadgeContent {
  return {
    front: {
      name: identity.fullName,
      title: identity.headline,
      organization: identity.organization,
      photoUrl: identity.photoUrl,
      badgeId: identity.badgeId,
    },
    back: {
      summary: identity.summary,
      location: identity.location,
      contacts: identity.socials.map(({ label, url }) => ({ label, url })),
    },
  };
}

/** First and last name initials, used when the badge photo is missing. */
export function initials(fullName: string): string {
  const words = fullName.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';
  const first = words[0] ?? '';
  const last = words.length > 1 ? (words[words.length - 1] ?? '') : '';
  return (first.charAt(0) + last.charAt(0)).toUpperCase();
}
