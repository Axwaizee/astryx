import React, { useCallback, Ref } from 'react';
import { TextInput } from '../TextInput';
import type { BaseProps } from '../BaseProps';

export interface MonthYearSelectorProps extends BaseProps {
  /** The currently selected two-digit month (01-12) */
  selectedMonth: string;
  /** The currently selected four-digit year */
  selectedYear: string;
  /** Callback fired when the month selection changes */
  onMonthChange: (value: string) => void;
  /** Callback fired when the year selection changes */
  onYearChange: (value: string) => void;
  /** Forwarded ref */
  ref?: Ref<HTMLInputElement>;
}

/**
 * Native month and year selector.
 */
export function MonthYearSelector({
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
  ref,
  ...baseProps
}: MonthYearSelectorProps) {
  const paddedMonth = selectedMonth.length === 1 ? `0${selectedMonth}` : selectedMonth;
  const value = selectedYear && selectedMonth ? `${selectedYear}-${paddedMonth}` : '';

  const handleChange = useCallback((val: string) => {
    if (val) {
      const parts = val.split('-');
      if (parts.length === 2) {
        onYearChange(parts[0]);
        onMonthChange(parts[1]);
      }
    } else {
      onYearChange('');
      onMonthChange('');
    }
  }, [onMonthChange, onYearChange]);

  return (
    <TextInput
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      type={"month" as any}
      value={value}
      onChange={handleChange}
      // eslint-disable-next-line @astryx/no-hardcoded-i18n-string
      label="Month and Year"
      isLabelHidden
      size="md"
      width={180}
      ref={ref}
      {...baseProps}
    />
  );
}
