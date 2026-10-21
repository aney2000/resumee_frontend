import {
  compareYearMonth,
  durationInMonths,
  formatDateRange,
  formatDuration,
  formatYearMonth,
  parseYearMonth,
} from '@/domain/dateRange';

describe('parseYearMonth', () => {
  it('parses a valid YYYY-MM string', () => {
    expect(parseYearMonth('2021-03')).toEqual({ year: 2021, month: 3 });
  });

  it('accepts January and December boundaries', () => {
    expect(parseYearMonth('1999-01')).toEqual({ year: 1999, month: 1 });
    expect(parseYearMonth('2030-12')).toEqual({ year: 2030, month: 12 });
  });

  it.each(['', '2021', '2021-3', '2021-00', '2021-13', '21-03', '2021/03', ' 2021-03', 'abcd-ef'])(
    'throws a descriptive error for %j',
    (input) => {
      expect(() => parseYearMonth(input)).toThrow(
        `Invalid YearMonth "${input}": expected format YYYY-MM`,
      );
    },
  );
});

describe('compareYearMonth', () => {
  it('returns a negative number when a is earlier', () => {
    expect(compareYearMonth('2020-12', '2021-01')).toBeLessThan(0);
  });

  it('returns a positive number when a is later', () => {
    expect(compareYearMonth('2021-02', '2021-01')).toBeGreaterThan(0);
  });

  it('returns zero for equal months', () => {
    expect(compareYearMonth('2021-05', '2021-05')).toBe(0);
  });

  it('sorts an array chronologically', () => {
    expect(['2022-01', '2019-07', '2021-03'].sort(compareYearMonth)).toEqual([
      '2019-07',
      '2021-03',
      '2022-01',
    ]);
  });
});

describe('formatYearMonth', () => {
  it('formats with the default English locale', () => {
    expect(formatYearMonth('2021-03')).toBe('Mar 2021');
  });

  it('formats December without time zone drift', () => {
    expect(formatYearMonth('2020-12')).toBe('Dec 2020');
  });

  it('honours the given locale', () => {
    expect(formatYearMonth('2021-05', 'de')).toBe('Mai 2021');
  });
});

describe('formatDateRange', () => {
  it('formats a closed range', () => {
    expect(formatDateRange({ start: '2019-01', end: '2021-03' })).toBe('Jan 2019 – Mar 2021');
  });

  it('formats an ongoing range as Present', () => {
    expect(formatDateRange({ start: '2021-03' })).toBe('Mar 2021 – Present');
  });

  it('passes the locale through to both ends', () => {
    expect(formatDateRange({ start: '2021-05', end: '2022-03' }, 'de')).toBe(
      'Mai 2021 – März 2022',
    );
  });
});

describe('durationInMonths', () => {
  const now = new Date(Date.UTC(2024, 5, 15)); // June 2024

  it('counts both the start and end month', () => {
    expect(durationInMonths({ start: '2020-01', end: '2020-03' }, now)).toBe(3);
  });

  it('counts a single-month range as one month', () => {
    expect(durationInMonths({ start: '2020-01', end: '2020-01' }, now)).toBe(1);
  });

  it('spans year boundaries', () => {
    expect(durationInMonths({ start: '2019-11', end: '2021-02' }, now)).toBe(16);
  });

  it('uses the injected now for ongoing ranges', () => {
    expect(durationInMonths({ start: '2024-01' }, now)).toBe(6);
  });

  it('throws when the end is before the start', () => {
    expect(() => durationInMonths({ start: '2021-03', end: '2021-01' }, now)).toThrow(
      'DateRange end "2021-01" is before start "2021-03"',
    );
  });
});

describe('formatDuration', () => {
  it.each([
    [1, '1 mo'],
    [5, '5 mos'],
    [12, '1 yr'],
    [24, '2 yrs'],
    [13, '1 yr 1 mo'],
    [27, '2 yrs 3 mos'],
  ])('formats %i months as %j', (months, expected) => {
    expect(formatDuration(months)).toBe(expected);
  });

  it('formats zero months', () => {
    expect(formatDuration(0)).toBe('0 mos');
  });

  it.each([-1, 1.5, Number.NaN])('throws for invalid month count %d', (months) => {
    expect(() => formatDuration(months)).toThrow(
      `Invalid month count ${months}: expected a non-negative integer`,
    );
  });
});
