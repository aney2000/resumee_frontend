import type { DateRange, YearMonth } from '@/domain/profile';

export interface ParsedYearMonth {
  readonly year: number;
  readonly month: number;
}

const YEAR_MONTH_PATTERN = /^(\d{4})-(0[1-9]|1[0-2])$/;
const MONTHS_PER_YEAR = 12;
const PRESENT_LABEL = 'Present';

export function parseYearMonth(value: YearMonth): ParsedYearMonth {
  const match = YEAR_MONTH_PATTERN.exec(value);
  if (!match) {
    throw new Error(`Invalid YearMonth "${value}": expected format YYYY-MM`);
  }
  return { year: Number(match[1]), month: Number(match[2]) };
}

function toMonthIndex(value: YearMonth): number {
  const { year, month } = parseYearMonth(value);
  return year * MONTHS_PER_YEAR + (month - 1);
}

function dateToMonthIndex(date: Date): number {
  return date.getUTCFullYear() * MONTHS_PER_YEAR + date.getUTCMonth();
}

export function compareYearMonth(a: YearMonth, b: YearMonth): number {
  return toMonthIndex(a) - toMonthIndex(b);
}

export function formatYearMonth(value: YearMonth, locale = 'en'): string {
  const { year, month } = parseYearMonth(value);
  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, 1)));
}

export function formatDateRange(range: DateRange, locale = 'en'): string {
  const end = range.end === undefined ? PRESENT_LABEL : formatYearMonth(range.end, locale);
  return `${formatYearMonth(range.start, locale)} – ${end}`;
}

export function durationInMonths(range: DateRange, now: Date): number {
  const start = toMonthIndex(range.start);
  const end = range.end === undefined ? dateToMonthIndex(now) : toMonthIndex(range.end);
  if (end < start) {
    throw new Error(`DateRange end "${range.end ?? 'now'}" is before start "${range.start}"`);
  }
  return end - start + 1;
}

function pluralize(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function formatDuration(months: number): string {
  if (!Number.isInteger(months) || months < 0) {
    throw new Error(`Invalid month count ${months}: expected a non-negative integer`);
  }
  const years = Math.floor(months / MONTHS_PER_YEAR);
  const remainder = months % MONTHS_PER_YEAR;
  const parts: string[] = [];
  if (years > 0) parts.push(pluralize(years, 'yr', 'yrs'));
  if (remainder > 0 || years === 0) parts.push(pluralize(remainder, 'mo', 'mos'));
  return parts.join(' ');
}
