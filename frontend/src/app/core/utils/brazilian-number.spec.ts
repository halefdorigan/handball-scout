import { FormControl } from '@angular/forms';
import {
  brazilianIntegerValidator,
  brazilianNumberRangeValidator,
  brazilianNumberValidator,
  formatBrazilianNumber,
  normalizeBrazilianNumber,
  parseBrazilianNumber
} from './brazilian-number';

describe('Brazilian number parsing', () => {
  it('parses a comma decimal', () => {
    expect(parseBrazilianNumber('1,5')).toBe(1.5);
    expect(parseBrazilianNumber('72,5')).toBe(72.5);
  });

  it('parses a dot decimal', () => {
    expect(parseBrazilianNumber('1.5')).toBe(1.5);
    expect(parseBrazilianNumber('72.5')).toBe(72.5);
  });

  it('parses a plain integer', () => {
    expect(parseBrazilianNumber('178')).toBe(178);
  });

  it('treats a lone dot with exactly three digits as a thousands separator', () => {
    expect(parseBrazilianNumber('1.000')).toBe(1000);
    expect(parseBrazilianNumber('12.345')).toBe(12345);
  });

  it('parses combined thousands and decimal separators', () => {
    expect(parseBrazilianNumber('1.234,56')).toBe(1234.56);
    expect(parseBrazilianNumber('1,234.56')).toBe(1234.56);
  });

  it('removes surrounding and inner whitespace', () => {
    expect(parseBrazilianNumber(' 72,5 ')).toBe(72.5);
    expect(parseBrazilianNumber('1 000')).toBe(1000);
  });

  it('returns null for invalid values', () => {
    expect(parseBrazilianNumber('abc')).toBeNull();
    expect(parseBrazilianNumber('1,5,5')).toBeNull();
    expect(parseBrazilianNumber('1..5')).toBeNull();
    expect(parseBrazilianNumber('')).toBeNull();
    expect(parseBrazilianNumber(undefined)).toBeNull();
    expect(parseBrazilianNumber(null)).toBeNull();
  });

  it('passes numeric values through unchanged', () => {
    expect(parseBrazilianNumber(72.5)).toBe(72.5);
    expect(parseBrazilianNumber(0)).toBe(0);
    expect(parseBrazilianNumber(NaN)).toBeNull();
  });
});

describe('Brazilian number normalization', () => {
  it('returns null for empty values', () => {
    expect(normalizeBrazilianNumber('')).toBeNull();
    expect(normalizeBrazilianNumber('   ')).toBeNull();
  });

  it('normalizes commas and dots to a canonical decimal dot', () => {
    expect(normalizeBrazilianNumber('1,5')).toBe('1.5');
    expect(normalizeBrazilianNumber('1.234,56')).toBe('1234.56');
  });
});

describe('Brazilian number formatting', () => {
  it('uses a comma as the decimal separator', () => {
    expect(formatBrazilianNumber(72.5)).toBe('72,5');
    expect(formatBrazilianNumber(72)).toBe('72');
    expect(formatBrazilianNumber(178)).toBe('178');
  });
});

describe('Brazilian number validators', () => {
  it('accepts decimal values with a comma', () => {
    const control = new FormControl('72,5');
    expect(brazilianNumberValidator()(control)).toBeNull();
  });

  it('rejects non-numeric values', () => {
    const control = new FormControl('abc');
    expect(brazilianNumberValidator()(control)).toEqual({ invalidNumber: true });
  });

  it('rejects decimals for integer fields', () => {
    const control = new FormControl('1,5');
    expect(brazilianIntegerValidator()(control)).toEqual({ invalidNumber: true });
  });

  it('accepts whole numbers for integer fields', () => {
    const control = new FormControl('178');
    expect(brazilianIntegerValidator()(control)).toBeNull();
  });

  it('ignores empty values so optional fields stay valid', () => {
    expect(brazilianNumberValidator()(new FormControl(''))).toBeNull();
    expect(brazilianIntegerValidator()(new FormControl(null))).toBeNull();
  });
});

describe('Brazilian number range validator', () => {
  it('accepts values inside the range using a comma decimal', () => {
    const control = new FormControl('72,5');
    expect(brazilianNumberRangeValidator(1, 400)(control)).toBeNull();
  });

  it('rejects values above the maximum', () => {
    const control = new FormControl('500');
    expect(brazilianNumberRangeValidator(1, 400)(control)).toEqual({ max: { max: 400, actual: '500' } });
  });

  it('rejects thousand-separated values above the maximum', () => {
    const control = new FormControl('1.000');
    expect(brazilianNumberRangeValidator(1, 400)(control)).toEqual({ max: { max: 400, actual: '1.000' } });
  });

  it('rejects values below the minimum', () => {
    const control = new FormControl('0');
    expect(brazilianNumberRangeValidator(1, 400)(control)).toEqual({ min: { min: 1, actual: '0' } });
  });

  it('ignores empty values so optional fields stay valid', () => {
    expect(brazilianNumberRangeValidator(1, 400)(new FormControl(''))).toBeNull();
  });
});