// src/domain is framework-free (no React, no DOM) so it stays trivially unit-testable.

/** Calendar month in ISO form: 'YYYY-MM'. */
export type YearMonth = string;

/** A period of time. An undefined `end` means the period is ongoing. */
export interface DateRange {
  readonly start: YearMonth;
  readonly end?: YearMonth;
}

export type SocialLinkKind = 'github' | 'linkedin' | 'email' | 'website' | 'other';

export interface SocialLink {
  readonly label: string;
  readonly url: string;
  readonly kind: SocialLinkKind;
}

export interface Identity {
  readonly fullName: string;
  readonly headline: string;
  readonly location: string;
  readonly photoUrl: string;
  readonly summary: string;
  readonly badgeId: string;
  readonly organization: string;
  readonly socials: readonly SocialLink[];
}

export interface Experience {
  readonly id: string;
  readonly role: string;
  readonly company: string;
  readonly period: DateRange;
  readonly description: string;
  readonly highlights: readonly string[];
  readonly technologies: readonly string[];
}

export interface Education {
  readonly id: string;
  readonly degree: string;
  readonly institution: string;
  readonly period: DateRange;
  readonly description: string;
}

export interface Project {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly technologies: readonly string[];
  readonly url?: string;
  readonly repoUrl?: string;
  readonly period?: DateRange;
}

export interface Course {
  readonly id: string;
  readonly title: string;
  readonly provider: string;
  readonly completedOn: YearMonth;
  readonly certificateUrl?: string;
  readonly skills: readonly string[];
}

export interface SkillGroup {
  readonly category: string;
  readonly items: readonly string[];
}

export interface Profile {
  readonly identity: Identity;
  readonly experiences: readonly Experience[];
  readonly education: readonly Education[];
  readonly projects: readonly Project[];
  readonly courses: readonly Course[];
  readonly skills: readonly SkillGroup[];
}
