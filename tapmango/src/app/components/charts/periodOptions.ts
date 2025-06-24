export const PERIOD_OPTIONS = {
  CUSTOM: 'Custom',
  LAST_MONTH: 'Last Month',
  LAST_QUARTER: 'Last Quarter',
  LAST_YEAR: 'Last Year',
} as const;

export type PeriodType = (typeof PERIOD_OPTIONS)[keyof typeof PERIOD_OPTIONS];
