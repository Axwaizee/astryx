import React, { useRef, useState, useId, useCallback, useEffect } from 'react';
import * as stylex from '@stylexjs/stylex';
import { usePopover } from '../Popover';
import { Icon } from '../Icon';
import { Field, inputWrapperStyles } from '../Field';
import { colorVars, spacingVars, radiusVars, sizeVars, typeScaleVars, easeVars, durationVars, fontWeightVars } from '../theme/tokens.stylex';
import { IconButton } from '../IconButton';
import type { BaseProps } from '../BaseProps';
import { focusOutlineStyles, mergeProps } from '../utils';

import { themeProps } from '../utils/themeProps';

// Reusing Astryx native field and input styles exactly like DateInput
const styles = stylex.create({
  inputWrapper: {
    height: sizeVars['--size-element-md'],
    minWidth: 180,
    cursor: 'pointer',
  },
  iconButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    margin: 0,
    borderWidth: 0,
    borderStyle: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    borderRadius: radiusVars['--radius-element'],
  },
  input: {
    display: 'block',
    flex: 1,
    minWidth: 0,
    borderWidth: 0,
    borderStyle: 'none',
    padding: 0,
    fontFamily: 'inherit',
    fontSize: typeScaleVars['--text-body-size'],
    color: colorVars['--color-text-primary'],
    backgroundColor: 'transparent',
    outline: 'none',
    cursor: 'pointer',
    '::placeholder': {
      color: colorVars['--color-text-disabled'],
    },
  },
  
  // Popover calendar styling equivalent to Astryx's Calendar styles
  calendar: {
    display: 'inline-block',
    padding: spacingVars['--spacing-3'],
    minWidth: '240px',
    backgroundColor: colorVars['--color-background-popover'],
    borderRadius: radiusVars['--radius-container'],
    boxShadow: 'var(--shadow-overlay)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacingVars['--spacing-2'],
    gap: spacingVars['--spacing-2'],
  },
  monthYearLabel: {
    flex: 1,
    textAlign: 'center',
    fontWeight: fontWeightVars['--font-weight-semibold'],
    fontSize: typeScaleVars['--text-label-size'],
    color: colorVars['--color-text-primary'],
  },
  monthsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: spacingVars['--spacing-1'],
    paddingTop: spacingVars['--spacing-2'],
  },
  
  // Days (months)
  monthCell: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: sizeVars['--size-element-md'],
  },
  monthBtn: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radiusVars['--radius-element'],
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: typeScaleVars['--text-body-size'],
    backgroundColor: 'transparent',
    color: colorVars['--color-text-primary'],
    transitionProperty: 'background-color, color',
    transitionDuration: durationVars['--duration-fast'],
    transitionTimingFunction: easeVars['--ease-standard'],
    ':hover': {
      backgroundColor: colorVars['--color-background-muted'],
    },
  },
  monthBtnSelected: {
    backgroundColor: colorVars['--color-accent'],
    color: colorVars['--color-on-accent'],
    ':hover': {
      backgroundColor: colorVars['--color-accent'],
    },
  },
  
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: spacingVars['--spacing-2'],
    paddingTop: spacingVars['--spacing-2'],
    borderTop: `1px solid ${colorVars['--color-background-muted']}`,
  },
  footerBtn: {
    background: 'none',
    border: 'none',
    color: colorVars['--color-text-secondary'],
    fontSize: typeScaleVars['--text-supporting-size'],
    cursor: 'pointer',
    padding: spacingVars['--spacing-1'],
    ':hover': {
      color: colorVars['--color-text-primary'],
    }
  }
});

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export interface MonthYearSelectorProps extends Omit<BaseProps, 'onChange'> {
  value?: string;           // Formatted as "YYYY-MM"
  onChange?: (val: string) => void;
  label?: string;
  isLabelHidden?: boolean;
  placeholder?: string;
}

export function MonthYearSelector({
  value,
  onChange,
  label = "Month and Year",
  isLabelHidden = false,
  placeholder = "Select a month",
  ...baseProps
}: MonthYearSelectorProps) {
  const inputID = useId();
  
  const [viewYear, setViewYear] = useState(() => {
    if (value) {
      const parts = value.split('-');
      if (parts.length === 2 && !isNaN(parseInt(parts[0], 10))) {
        return parseInt(parts[0], 10);
      }
    }
    return new Date().getFullYear();
  });

  const currentMonthNum = value ? parseInt(value.split('-')[1], 10) : undefined;
  const currentYearNum = value ? parseInt(value.split('-')[0], 10) : undefined;

  const popover = usePopover({
    dialogLabel: 'Choose month and year',
  });

  const handleToggle = useCallback(() => {
    if (popover.isOpen) {
      popover.hide();
    } else {
      if (currentYearNum) setViewYear(currentYearNum);
      popover.show();
    }
  }, [popover, currentYearNum]);

  const handleMonthSelect = (monthIndex: number) => {
    const pad = (monthIndex + 1).toString().padStart(2, '0');
    if (onChange) onChange(`${viewYear}-${pad}`);
    popover.hide();
  };

  const handleClear = () => {
    if (onChange) onChange('');
    popover.hide();
  };

  const handleThisMonth = () => {
    const today = new Date();
    const pad = (today.getMonth() + 1).toString().padStart(2, '0');
    if (onChange) onChange(`${today.getFullYear()}-${pad}`);
    popover.hide();
  };

  let displayLabel = '';
  if (currentMonthNum && currentYearNum) {
    displayLabel = `${MONTHS_FULL[currentMonthNum - 1]} ${currentYearNum}`;
  }

  const inputWrapper = (
    <div
      ref={el => popover.triggerRef(el)}
      {...stylex.props(
        inputWrapperStyles.base,
        styles.inputWrapper
      )}
      onClick={handleToggle}
    >
      <button
        type="button"
        tabIndex={-1}
        {...stylex.props(styles.iconButton)}
      >
        <Icon icon="calendar" size="sm" color="secondary" />
      </button>
      <input
        id={inputID}
        type="text"
        readOnly
        value={displayLabel}
        placeholder={placeholder}
        {...stylex.props(styles.input)}
      />
    </div>
  );

  return (
    <>
      <Field label={label} isLabelHidden={isLabelHidden} inputID={inputID} {...baseProps}>
        {inputWrapper}
      </Field>

      {popover.render(
        <div {...stylex.props(styles.calendar)}>
          <div {...stylex.props(styles.header)}>
            <IconButton 
              icon={<Icon icon="chevronLeft" size="sm" />} 
              label="Previous year" 
              onClick={() => setViewYear(y => y - 1)}
              variant="ghost"
            />
            <div {...stylex.props(styles.monthYearLabel)}>{viewYear}</div>
            <IconButton 
              icon={<Icon icon="chevronRight" size="sm" />} 
              label="Next year" 
              onClick={() => setViewYear(y => y + 1)}
              variant="ghost"
            />
          </div>
          
          <div {...stylex.props(styles.monthsContainer)}>
            {MONTHS.map((m, i) => {
              const isSelected = currentYearNum === viewYear && currentMonthNum === (i + 1);
              return (
                <div key={m} {...stylex.props(styles.monthCell)}>
                  <button
                    type="button"
                    onClick={() => handleMonthSelect(i)}
                    {...stylex.props(
                      styles.monthBtn,
                      isSelected && styles.monthBtnSelected
                    )}
                  >
                    {m}
                  </button>
                </div>
              );
            })}
          </div>

          <div {...stylex.props(styles.footer)}>
            <button type="button" onClick={handleThisMonth} {...stylex.props(styles.footerBtn)}>
              This month
            </button>
            <button type="button" onClick={handleClear} {...stylex.props(styles.footerBtn)}>
              Clear
            </button>
          </div>
        </div>,
        {placement: 'below', alignment: 'start'}
      )}
    </>
  );
}
