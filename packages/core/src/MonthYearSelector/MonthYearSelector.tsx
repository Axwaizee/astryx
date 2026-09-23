"use client";

// Copyright (c) Meta Platforms, Inc. and affiliates.

import React, {useRef, useState, useId} from 'react';
import * as stylex from '@stylexjs/stylex';
import {usePopover} from '../Popover';
import {Icon} from '../Icon';
import {Field, inputWrapperStyles} from '../Field';
import {
  colorVars,
  spacingVars,
  radiusVars,
  sizeVars,
  typeScaleVars,
} from '../theme/tokens.stylex';
import {IconButton} from '../IconButton';
import type {BaseProps} from '../BaseProps';
import {focusOutlineStyles} from '../utils';

const styles = stylex.create({
  fieldWrapper: {
    display: 'flex',
    alignItems: 'center',
    cursor: {default: 'pointer', ':is(:disabled,[aria-disabled="true"])': 'default'},
    backgroundColor: 'transparent',
    border: 'none',
    width: '100%',
    padding: 0,
    outline: 'none',
    justifyContent: 'space-between',
    height: sizeVars['--size-element-md'],
  },
  inputText: {
    flex: 1,
    textAlign: 'start',
    paddingInline: spacingVars['--spacing-3'],
    fontSize: typeScaleVars['--text-body-size'],
    color: colorVars['--color-text-primary'],
  },
  icon: {
    display: 'flex',
    paddingInlineEnd: spacingVars['--spacing-3'],
  },
  popoverBody: {
    padding: spacingVars['--spacing-4'],
    width: 260,
    backgroundColor: colorVars['--color-background-popover'],
    borderRadius: radiusVars['--radius-element'],
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacingVars['--spacing-4'],
  },
  yearLabel: {
    fontSize: typeScaleVars['--text-large-size'],
    fontWeight: 600,
    color: colorVars['--color-text-primary'],
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: spacingVars['--spacing-2'],
    marginBottom: spacingVars['--spacing-4'],
  },
  monthButton: {
    padding: spacingVars['--spacing-2'],
    borderRadius: radiusVars['--radius-element'],
    border: `1px solid transparent`,
    backgroundColor: 'transparent',
    color: colorVars['--color-text-primary'],
    cursor: {default: 'pointer', ':is(:disabled,[aria-disabled="true"])': 'default'},
    textAlign: 'center',
    outline: 'none',
    ':hover:where(:not(:disabled,[aria-disabled="true"]))': {
      backgroundColor: colorVars['--color-background-muted'],
    },
  },
  monthSelected: {
    backgroundColor: colorVars['--color-accent'],
    color: colorVars['--color-on-accent'],
    ':hover:where(:not(:disabled,[aria-disabled="true"]))': {
      backgroundColor: colorVars['--color-accent'],
    },
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    borderTop: `1px solid ${colorVars['--color-background-muted']}`,
    paddingTop: spacingVars['--spacing-3'],
  },
  footerButton: {
    background: 'none',
    border: 'none',
    color: colorVars['--color-accent'],
    cursor: {default: 'pointer', ':is(:disabled,[aria-disabled="true"])': 'default'},
    fontSize: typeScaleVars['--text-supporting-size'],
    padding: spacingVars['--spacing-1'],
    ':hover:where(:not(:disabled,[aria-disabled="true"]))': {
      textDecoration: 'underline',
    },
  },
});

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const MONTHS_FULL = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export interface MonthYearSelectorProps extends BaseProps {
  label?: string;
  isLabelHidden?: boolean;
  selectedMonth: string;
  selectedYear: string;
  onMonthChange: (value: string) => void;
  onYearChange: (value: string) => void;
}

export function MonthYearSelector({
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
  label,
  isLabelHidden,
  ...baseProps
}: MonthYearSelectorProps) {
  const inputID = useId();

  const currentMonthNum = selectedMonth
    ? parseInt(selectedMonth, 10)
    : new Date().getMonth() + 1;
  const currentYearNum = selectedYear
    ? parseInt(selectedYear, 10)
    : new Date().getFullYear();

  const [viewYear, setViewYear] = useState(currentYearNum);

  const popover = usePopover({
    dialogLabel: 'Choose month and year',
  });

  const toggleOpen = () => {
    if (popover.isOpen) {
      popover.hide();
    } else {
      setViewYear(currentYearNum);
      popover.show();
    }
  };

  const handleMonthSelect = (monthIndex: number) => {
    const pad = (monthIndex + 1).toString().padStart(2, '0');
    onMonthChange(pad);
    onYearChange(viewYear.toString());
    popover.hide();
  };

  const handleClear = () => {
    onMonthChange('');
    onYearChange('');
    popover.hide();
  };

  const handleThisMonth = () => {
    const today = new Date();
    const pad = (today.getMonth() + 1).toString().padStart(2, '0');
    onMonthChange(pad);
    onYearChange(today.getFullYear().toString());
    popover.hide();
  };

  const displayLabel =
    selectedMonth && selectedYear
      ? `${MONTHS_FULL[parseInt(selectedMonth, 10) - 1]} ${selectedYear}`
      : '';

  return (
    <>
      <Field
        label={label || 'Month and Year'}
        isLabelHidden={isLabelHidden !== false}
        inputID={inputID}
        width={200}
        {...baseProps}>
        <div
          ref={el => popover.triggerRef(el)}
          {...stylex.props(inputWrapperStyles.base)}>
          <button
            id={inputID}
            type="button"
            onClick={toggleOpen}
            {...stylex.props(
              styles.fieldWrapper,
              focusOutlineStyles.focusVisible,
            )}>
            <span {...stylex.props(styles.inputText)}>
              {displayLabel || (
                <span style={{color: 'var(--color-text-secondary)'}}>
                  Select month
                </span>
              )}
            </span>
            <span {...stylex.props(styles.icon)}>
              <Icon icon="calendar" size="sm" color="secondary" />
            </span>
          </button>
        </div>
      </Field>

      {popover.render(
        <div {...stylex.props(styles.popoverBody)}>
          <div {...stylex.props(styles.header)}>
            <IconButton
              icon={<Icon icon="chevronLeft" size="sm" color="inherit" />}
              label="Previous year"
              onClick={() => setViewYear(y => y - 1)}
              variant="ghost"
              size="sm"
            />
            <span {...stylex.props(styles.yearLabel)}>{viewYear}</span>
            <IconButton
              icon={<Icon icon="chevronRight" size="sm" color="inherit" />}
              label="Next year"
              onClick={() => setViewYear(y => y + 1)}
              variant="ghost"
              size="sm"
            />
          </div>

          <div {...stylex.props(styles.grid)}>
            {MONTHS.map((m, i) => {
              const isSelected =
                selectedYear !== '' &&
                parseInt(selectedYear, 10) === viewYear &&
                currentMonthNum === i + 1;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => handleMonthSelect(i)}
                  {...stylex.props(
                    styles.monthButton,
                    isSelected ? styles.monthSelected : null,
                  )}>
                  {m}
                </button>
              );
            })}
          </div>

          <div {...stylex.props(styles.footer)}>
            <button
              type="button"
              onClick={handleClear}
              {...stylex.props(styles.footerButton)}>
              Clear
            </button>
            <button
              type="button"
              onClick={handleThisMonth}
              {...stylex.props(styles.footerButton)}>
              This month
            </button>
          </div>
        </div>,
        {placement: 'below', alignment: 'start'},
      )}
    </>
  );
}
