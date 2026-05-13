const test = require('node:test');
const assert = require('node:assert/strict');
const { validateForm, isValid, emptyForm, EMAIL_RE } = require('../src/utils/validation');

test('emptyForm() returns object with array fields initialised', () => {
  const f = emptyForm();
  assert.equal(f.fullName, '');
  assert.deepEqual(f.features, []);
  assert.deepEqual(f.pages, []);
  assert.deepEqual(f.content, []);
  assert.deepEqual(f.devices, []);
  assert.deepEqual(f.integrations, []);
  assert.equal(f.projectType, '');
  assert.equal(f.targetAction, '');
  assert.equal(f.competitors, '');
  assert.equal(f.hasBrandbook, '');
});

test('EMAIL_RE matches common emails', () => {
  assert.ok(EMAIL_RE.test('user@example.com'));
  assert.ok(EMAIL_RE.test('john.doe+tag@sub.domain.io'));
});

test('EMAIL_RE rejects invalid emails', () => {
  assert.equal(EMAIL_RE.test('plain'), false);
  assert.equal(EMAIL_RE.test('a@b'), false);
  assert.equal(EMAIL_RE.test('@no-local.com'), false);
  assert.equal(EMAIL_RE.test('no-at.com'), false);
});

test('empty form produces errors for every required field (ua)', () => {
  const errors = validateForm(emptyForm(), 'ua');
  const required = [
    'fullName', 'email', 'phoneOrMessenger',
    'projectType', 'goals', 'targetAction', 'competitors',
    'siteType', 'features', 'designPreferences', 'references',
    'hasBrandbook', 'pages', 'content', 'audience', 'devices',
    'integrations', 'budget', 'deadline', 'support',
  ];
  for (const k of required) {
    assert.ok(errors[k], `expected error for "${k}" but got none`);
  }
  assert.equal(isValid(errors), false);
});

test('uses Russian messages when lang="ru"', () => {
  const errors = validateForm(emptyForm(), 'ru');
  assert.equal(errors.fullName, 'Укажите ФИО');
  assert.equal(errors.email, 'Введите корректный email');
});

test('uses Ukrainian messages when lang="ua"', () => {
  const errors = validateForm(emptyForm(), 'ua');
  assert.equal(errors.fullName, 'Вкажіть ПІБ');
  assert.equal(errors.email, 'Введіть коректний email');
});

test('a fully filled valid form produces no errors', () => {
  const f = {
    ...emptyForm(),
    fullName: 'Иван Иванов',
    email: 'ivan@example.com',
    phoneOrMessenger: '+380501234567',
    projectType: 'new',
    goals: 'Продажи',
    targetAction: 'Оставить заявку',
    competitors: 'https://a.com, https://b.com',
    siteType: 'siteTypeShop',
    features: ['basket'],
    designPreferences: 'Светлый минимализм',
    references: 'https://example.com',
    hasBrandbook: 'no',
    pages: ['home'],
    content: ['logo'],
    audience: '25-45 Украина',
    devices: ['mobile', 'desktop'],
    integrations: ['none'],
    budget: 'b_2000_5000',
    deadline: '2 месяца',
    support: 'supportNo',
  };
  const errors = validateForm(f, 'ru');
  assert.deepEqual(errors, {});
  assert.equal(isValid(errors), true);
});

test('projectType=redesign requires currentSiteUrl', () => {
  const f = { ...emptyForm(), projectType: 'redesign' };
  const errors = validateForm(f, 'ua');
  assert.ok(errors.currentSiteUrl);
});

test('hasBrandbook=yes_full requires brandbookLink', () => {
  const f = { ...emptyForm(), hasBrandbook: 'yes_full' };
  const errors = validateForm(f, 'ua');
  assert.ok(errors.brandbookLink);
});

test('hasBrandbook=no does NOT require brandbookLink', () => {
  const f = { ...emptyForm(), hasBrandbook: 'no' };
  const errors = validateForm(f, 'ua');
  assert.equal(errors.brandbookLink, undefined);
});

test('support=supportYes requires supportScope', () => {
  const f = { ...emptyForm(), support: 'supportYes' };
  const errors = validateForm(f, 'ua');
  assert.ok(errors.supportScope);
});

test('support=supportNo does NOT require supportScope', () => {
  const f = { ...emptyForm(), support: 'supportNo' };
  const errors = validateForm(f, 'ua');
  assert.equal(errors.supportScope, undefined);
});

test('siteType=other requires siteTypeOther', () => {
  const f = { ...emptyForm(), siteType: 'other' };
  const errors = validateForm(f, 'ua');
  assert.ok(errors.siteTypeOther);
});

test('support=other requires supportOther', () => {
  const f = { ...emptyForm(), support: 'other' };
  const errors = validateForm(f, 'ua');
  assert.ok(errors.supportOther);
});

test('whitespace-only strings count as blank', () => {
  const f = { ...emptyForm(), fullName: '   ', email: '  ', goals: '\t\n' };
  const errors = validateForm(f, 'ua');
  assert.ok(errors.fullName);
  assert.ok(errors.email);
  assert.ok(errors.goals);
});
