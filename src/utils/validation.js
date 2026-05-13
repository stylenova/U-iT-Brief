// Pure validation utilities for the brief form.
// No DOM / Vue dependencies — easy to unit-test.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const MESSAGES = {
  ua: {
    fullName: 'Вкажіть ПІБ',
    email: 'Введіть коректний email',
    phoneOrMessenger: 'Вкажіть телефон або месенджер',
    projectType: 'Оберіть тип проєкту',
    currentSiteUrl: 'Вкажіть посилання на поточний сайт',
    goals: 'Опишіть цілі та задачі',
    targetAction: 'Опишіть, що має зробити відвідувач',
    competitors: 'Додайте 2–3 приклади конкурентів',
    siteType: 'Оберіть тип сайту',
    siteTypeOther: 'Уточніть тип сайту',
    features: 'Оберіть хоча б один пункт',
    designPreferences: 'Опишіть побажання щодо дизайну',
    references: 'Додайте референси',
    hasBrandbook: 'Оберіть варіант',
    brandbookLink: 'Додайте посилання або опис матеріалів',
    pages: 'Оберіть хоча б одну сторінку',
    content: 'Оберіть хоча б один пункт',
    audience: 'Опишіть цільову аудиторію',
    devices: 'Оберіть хоча б один пристрій',
    integrations: 'Оберіть інтеграції або позначте «Не потрібно»',
    budget: 'Оберіть діапазон бюджету',
    deadline: 'Вкажіть терміни',
    support: 'Оберіть варіант підтримки',
    supportOther: 'Опишіть варіант підтримки',
    supportScope: 'Оберіть обсяг підтримки',
  },
  ru: {
    fullName: 'Укажите ФИО',
    email: 'Введите корректный email',
    phoneOrMessenger: 'Укажите телефон или мессенджер',
    projectType: 'Выберите тип проекта',
    currentSiteUrl: 'Укажите ссылку на текущий сайт',
    goals: 'Опишите цели и задачи',
    targetAction: 'Опишите, что должен сделать посетитель',
    competitors: 'Добавьте 2–3 примера конкурентов',
    siteType: 'Выберите тип сайта',
    siteTypeOther: 'Уточните тип сайта',
    features: 'Выберите хотя бы один пункт',
    designPreferences: 'Опишите пожелания по дизайну',
    references: 'Добавьте референсы',
    hasBrandbook: 'Выберите вариант',
    brandbookLink: 'Добавьте ссылку или опишите материалы',
    pages: 'Выберите хотя бы одну страницу',
    content: 'Выберите хотя бы один пункт',
    audience: 'Опишите целевую аудиторию',
    devices: 'Выберите хотя бы одно устройство',
    integrations: 'Выберите интеграции или отметьте «Не нужны»',
    budget: 'Выберите диапазон бюджета',
    deadline: 'Укажите сроки',
    support: 'Выберите вариант поддержки',
    supportOther: 'Опишите вариант поддержки',
    supportScope: 'Выберите объём поддержки',
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

  if (isBlank(form.projectType)) {
    errors.projectType = m.projectType;
  } else if (form.projectType === 'redesign' && isBlank(form.currentSiteUrl)) {
    errors.currentSiteUrl = m.currentSiteUrl;
  }

  if (isBlank(form.goals)) errors.goals = m.goals;
  if (isBlank(form.targetAction)) errors.targetAction = m.targetAction;
  if (isBlank(form.competitors)) errors.competitors = m.competitors;

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

  if (isBlank(form.hasBrandbook)) {
    errors.hasBrandbook = m.hasBrandbook;
  } else if ((form.hasBrandbook === 'yes_full' || form.hasBrandbook === 'yes_logo') && isBlank(form.brandbookLink)) {
    errors.brandbookLink = m.brandbookLink;
  }

  if (!Array.isArray(form.pages) || form.pages.length === 0) {
    errors.pages = m.pages;
  }

  if (!Array.isArray(form.content) || form.content.length === 0) {
    errors.content = m.content;
  }

  if (isBlank(form.audience)) errors.audience = m.audience;

  if (!Array.isArray(form.devices) || form.devices.length === 0) {
    errors.devices = m.devices;
  }

  if (!Array.isArray(form.integrations) || form.integrations.length === 0) {
    errors.integrations = m.integrations;
  }

  if (isBlank(form.budget)) errors.budget = m.budget;
  if (isBlank(form.deadline)) errors.deadline = m.deadline;

  if (isBlank(form.support)) {
    errors.support = m.support;
  } else if (form.support === 'other' && isBlank(form.supportOther)) {
    errors.supportOther = m.supportOther;
  } else if (form.support === 'supportYes' && isBlank(form.supportScope)) {
    errors.supportScope = m.supportScope;
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
    projectType: '',
    currentSiteUrl: '',
    goals: '',
    targetAction: '',
    competitors: '',
    siteType: '',
    siteTypeOther: '',
    features: [],
    featuresOther: '',
    designPreferences: '',
    references: '',
    hasBrandbook: '',
    brandbookLink: '',
    pages: [],
    pagesOther: '',
    content: [],
    audience: '',
    devices: [],
    tech: '',
    integrations: [],
    integrationsOther: '',
    budget: '',
    deadline: '',
    startDate: '',
    support: '',
    supportOther: '',
    supportScope: '',
    comments: '',
  };
}

module.exports = { validateForm, isValid, emptyForm, EMAIL_RE };
