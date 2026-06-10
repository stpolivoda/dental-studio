import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isValidName, isValidPhone } from '../js/validators.js';

test('isValidName rejects empty or too-short input', () => {
  assert.equal(isValidName(''), false);
  assert.equal(isValidName('   '), false);
  assert.equal(isValidName('A'), false);
});

test('isValidName accepts real names, trimming whitespace', () => {
  assert.equal(isValidName('Олена'), true);
  assert.equal(isValidName('  Jan  '), true);
});

test('isValidPhone rejects empty, too-short, or non-numeric input', () => {
  assert.equal(isValidPhone(''), false);
  assert.equal(isValidPhone('123'), false);
  assert.equal(isValidPhone('not a phone'), false);
});

test('isValidPhone accepts common Ukrainian phone formats', () => {
  assert.equal(isValidPhone('+380501234567'), true);
  assert.equal(isValidPhone('0501234567'), true);
  assert.equal(isValidPhone('(050) 123-45-67'), true);
});
