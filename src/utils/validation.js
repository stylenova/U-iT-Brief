// Pure validation utilities for the brief form.
// No DOM / Vue dependencies — easy to unit-test.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const MESSAGES = {
  ua: {
    fullName: 'Вкажіть ПІБ',
    email: 'Введіть коректний email',
    phoneOrMessenger: 'Вкажіть телефон або месенджер',
    goals: 'Опишіть цілі та задачі',
    siteType: 'Оберіть тип сайту',
    siteTypeOther: 'Уточніть тип сайту',
    features: 'Оберіть хоча б один пункт',
    designPreferences: 'Опишіть побажання щодо дизайну',
    references: 'Додайте референси',
    pages: 'Оберіть хоча б одну сторінку',
    content: 'Оберіть хоча б один пункт',
    audience: 'Опишіть цільову аудиторію',
    budget: 'Вкажіть бюджет',
    deadline: 'Вкажіть терміни',
    support: 'Оберіть варіант підтримки',
    supportOther: 'Опишіть варіант підтримки',
  },
  ru: {
    fullName: 'Укажите ФИО',
    email: 'Введите корректный email',
    phoneOrMessenger: 'Укажите телефон или мессенджер',
    goals: 'Опишите цели и задачи',
    siteType: 'Выберите тип сайта',
    siteTypeOther: 'Уточните тип сайта',
    features: 'Выберите хотя бы один пункт',
    designPreferences: 'Опишите пожелания по дизайну',
    references: 'Добавьте референсы',
    pages: 'Выберите хотя бы одну страницу',
    content: 'Выберите хотя бы один пункт',
    audience: 'Опишите целевую аудиторию',
    budget: 'Укажите бюджет',
    deadline: 'Укажите сроки',
    support: 'Выберите вариант поддержки',
    supportOther: 'Опишите вариант поддержки',
  },
};

function getMessages(lang) {
  return MESSAGES[lang] || MESSAGES.ua;
}

function isBlank(v) {
  return v === undefined || v === null || String(v).trim() === '';
}

function validateForm(form, lang = 'ua') {
  const m = getMessages(lang);
  const errors = {};

  if (isBlank(form.fullName)) errors.fullName = m.fullName;
  if (isBlank(form.email) || !EMAIL_RE.test(String(form.email).trim())) errors.email = m.email;
  if (isBlank(form.phoneOrMessenger)) errors.phoneOrMessenger = m.phoneOrMessenger;
  if (isBlank(form.goals)) errors.goals = m.goals;

  if (isBlank(form.siteType)) {
    errors.siteType = m.siteType;
  } else if (form.siteType === 'other' && isBlank(form.siteTypeOther)) {
    errors.siteTypeOther = m.siteTypeOther;
  }

  if (!Array.isArray(form.features) || form.features.length === 0) {
    errors.features = m.features;
  }

  if (isBlank(form.designPreferences)) errors.designPreferences = m.designPreferences;
  if (isBlank(form.references)) errors.references = m.references;

  if (!Array.isArray(form.pages) || form.pages.length === 0) {
    errors.pages = m.pages;
  }

  if (!Array.isArray(form.content) || form.content.length === 0) {
    errors.content = m.content;
  }

  if (isBlank(form.audience)) errors.audience = m.audience;
  if (isBlank(form.budget)) errors.budget = m.budget;
  if (isBlank(form.deadline)) errors.deadline = m.deadline;

  if (isBlank(form.support)) {
    errors.support = m.support;
  } else if (form.support === 'other' && isBlank(form.supportOther)) {
    errors.supportOther = m.supportOther;
  }

  return errors;
}

function isValid(errors) {
  return Object.keys(errors).length === 0;
}

function emptyForm() {
  return {
    fullName: '',
    email: '',
    phoneOrMessenger: '',
    company: '',
    aboutCompany: '',
    goals: '',
    siteType: '',
    siteTypeOther: '',
    features: [],
    featuresOther: '',
    designPreferences: '',
    references: '',
    pages: [],
    pagesOther: '',
    content: [],
    audience: '',
    tech: '',
    budget: '',
    deadline: '',
    startDate: '',
    support: '',
    supportOther: '',
    comments: '',
  };
}

module.exports = { validateForm, isValid, emptyForm, EMAIL_RE };
