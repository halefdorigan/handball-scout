import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function normalizeBrazilianNumber(value: string): string | null {
  const trimmed = value.trim().replace(/\s+/g, '');
  if (trimmed === '') {
    return null;
  }
  const hasComma = trimmed.includes(',');
  const hasDot = trimmed.includes('.');
  let normalized: string;
  if (hasComma && hasDot) {
    const commaIndex = trimmed.lastIndexOf(',');
    const dotIndex = trimmed.lastIndexOf('.');
    normalized = dotIndex > commaIndex
      ? trimmed.replace(/,/g, '')
      : trimmed.replace(/\./g, '').replace(',', '.');
  } else if (hasComma) {
    if ((trimmed.match(/,/g) || []).length > 1) {
      return null;
    }
    normalized = trimmed.replace(',', '.');
  } else if (hasDot) {
    normalized = /^\d{1,3}(\.\d{3})+$/.test(trimmed)
      ? trimmed.replace(/\./g, '')
      : trimmed;
  } else {
    normalized = trimmed;
  }
  if (!/^-?\d+(\.\d+)?$/.test(normalized)) {
    return null;
  }
  return normalized;
}

export function parseBrazilianNumber(value: string | number | null | undefined): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value !== 'string') {
    return null;
  }
  const normalized = normalizeBrazilianNumber(value);
  if (normalized === null) {
    return null;
  }
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

export function formatBrazilianNumber(value: number): string {
  return String(value).replace('.', ',');
}

export function brazilianNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value === null || value === undefined || value === '') {
      return null;
    }
    return parseBrazilianNumber(value) === null ? { invalidNumber: true } : null;
  };
}

export function brazilianIntegerValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value === null || value === undefined || value === '') {
      return null;
    }
    const parsed = parseBrazilianNumber(value);
    if (parsed === null || !Number.isInteger(parsed)) {
      return { invalidNumber: true };
    }
    return null;
  };
}

export function brazilianNumberRangeValidator(min: number, max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value === null || value === undefined || value === '') {
      return null;
    }
    const parsed = parseBrazilianNumber(value);
    if (parsed === null) {
      return null;
    }
    if (parsed < min) {
      return { min: { min, actual: value } };
    }
    if (parsed > max) {
      return { max: { max, actual: value } };
    }
    return null;
  };
}