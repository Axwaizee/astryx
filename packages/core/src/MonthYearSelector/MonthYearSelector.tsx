import React, { useMemo } from 'react';
import { HStack } from '../Stack';
import { Selector } from '../Selector';

export interface MonthYearSelectorProps {
  /** The currently selected two-digit month (01-12) */
  selectedMonth: string;
  /** The currently selected four-digit year */
  selectedYear: string;
  /** Callback fired when the month selection changes */
  onMonthChange: (value: string) => void;
  /** Callback fired when the year selection changes */
  onYearChange: (value: string) => void;
  /** Starting year for the year dropdown. Defaults to 2020 */
  startYear?: number;
  /** Ending year for the year dropdown. Defaults to 2030 */
  endYear?: number;
}

const MONTHS = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

/**
 * A composite component for selecting a month and a year.
 */
export function MonthYearSelector({
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
  startYear = 2020,
  endYear = 2030,
}: MonthYearSelectorProps) {

  const YEARS = useMemo(() => {
    return Array.from({ length: Math.max(0, endYear - startYear + 1) }, (_, i) => {
      const yr = (startYear + i).toString();
      return { value: yr, label: yr };
    });
  }, [startYear, endYear]);

  return (
    <HStack gap={2}>
      <Selector
        label="Month"
        isLabelHidden
        options={MONTHS}
        value={selectedMonth}
        onChange={onMonthChange}
        width={140}
        size="md"
        variant="input"
      />
      <Selector
        label="Year"
        isLabelHidden
        options={YEARS}
        value={selectedYear}
        onChange={onYearChange}
        width={100}
        size="md"
        variant="input"
      />
    </HStack>
  );
}
