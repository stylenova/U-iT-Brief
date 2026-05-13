<template>
  <div>
    <header class="header-bar">
      <div class="lang-switch">
        <button
          v-for="l in langs"
          :key="l"
          type="button"
          :class="{ active: lang === l }"
          @click="setLang(l)"
        >{{ l.toUpperCase() }}</button>
      </div>
    </header>

    <form novalidate @submit.prevent="submitForm">
      <div class="brief-header">
        <h1 class="brief-title">{{ t('briefTitle') }}</h1>
        <div class="brief-desc">{{ t('briefDesc') }}</div>
      </div>

      <!-- 1. Контакты -->
      <div class="section">
        <h3>1. {{ t('contactsTitle') }}</h3>

        <label>{{ t('fullName') }} <span class="required">*</span></label>
        <input
          type="text"
          v-model="form.fullName"
          :placeholder="t('fullNamePh')"
          :class="{ 'has-error': errors.fullName }"
        />
        <div v-if="errors.fullName" class="error">{{ errors.fullName }}</div>

        <label>{{ t('email') }} <span class="required">*</span></label>
        <input
          type="email"
          v-model="form.email"
          :placeholder="t('emailPh')"
          :class="{ 'has-error': errors.email }"
        />
        <div v-if="errors.email" class="error">{{ errors.email }}</div>

        <label>{{ t('phone') }} <span class="required">*</span></label>
        <input
          type="text"
          v-model="form.phoneOrMessenger"
          :placeholder="t('phonePh')"
          :class="{ 'has-error': errors.phoneOrMessenger }"
        />
        <div v-if="errors.phoneOrMessenger" class="error">{{ errors.phoneOrMessenger }}</div>

        <label>{{ t('company') }}</label>
        <input type="text" v-model="form.company" :placeholder="t('companyPh')" />

        <label>{{ t('aboutCompany') }}</label>
        <textarea v-model="form.aboutCompany" :placeholder="t('aboutCompanyPh')"></textarea>
      </div>

      <!-- 3. Цели -->
      <div class="section">
        <h3>3. {{ t('goals') }} <span class="required">*</span></h3>
        <textarea
          v-model="form.goals"
          :placeholder="t('goalsPh')"
          :class="{ 'has-error': errors.goals }"
        ></textarea>
        <div v-if="errors.goals" class="error">{{ errors.goals }}</div>
      </div>

      <!-- 4. Тип сайта -->
      <div class="section">
        <h3>4. {{ t('siteType') }} <span class="required">*</span></h3>
        <select v-model="form.siteType" :class="{ 'has-error': errors.siteType }">
          <option disabled value="">{{ t('chooseSiteType') }}</option>
          <option
            v-for="key in ['siteTypeShop','siteTypeCorp','siteTypeBlog','siteTypeLanding','siteTypePortal','siteTypeCard','other']"
            :key="key"
            :value="key"
          >{{ t(key) }}</option>
        </select>
        <div v-if="errors.siteType" class="error">{{ errors.siteType }}</div>
        <div v-if="form.siteType === 'other'">
          <input
            type="text"
            v-model="form.siteTypeOther"
            :placeholder="t('siteTypeOtherPh')"
            :class="{ 'has-error': errors.siteTypeOther }"
          />
          <div v-if="errors.siteTypeOther" class="error">{{ errors.siteTypeOther }}</div>
        </div>
      </div>

      <!-- 5. Функционал -->
      <div class="section" :class="{ 'section-error': errors.features }">
        <h3>5. {{ t('features') }} <span class="required">*</span></h3>
        <div class="checkbox-group">
          <div v-for="option in featuresOptions" :key="option.value" class="checkbox-inline">
            <input type="checkbox" :id="'feat_' + option.value" :value="option.value" v-model="form.features" />
            <label :for="'feat_' + option.value">{{ option.label }}</label>
          </div>
          <div class="checkbox-inline">
            <input type="checkbox" id="featureOther" value="other" v-model="form.features" />
            <label for="featureOther">{{ t('other') }}:</label>
            <input
              v-if="form.features.includes('other')"
              type="text"
              v-model="form.featuresOther"
              :placeholder="t('describePh')"
              style="margin-left:10px;flex:1;min-width:120px;"
            />
          </div>
        </div>
        <div v-if="errors.features" class="error">{{ errors.features }}</div>
      </div>

      <!-- 6. Дизайн -->
      <div class="section">
        <h3>6. {{ t('designTitle') }}</h3>

        <label>{{ t('designPreferences') }} <span class="required">*</span></label>
        <textarea
          v-model="form.designPreferences"
          :placeholder="t('designPreferencesPh')"
          :class="{ 'has-error': errors.designPreferences }"
        ></textarea>
        <div v-if="errors.designPreferences" class="error">{{ errors.designPreferences }}</div>

        <label>{{ t('references') }} <span class="required">*</span></label>
        <textarea
          v-model="form.references"
          :placeholder="t('referencesPh')"
          :class="{ 'has-error': errors.references }"
        ></textarea>
        <div v-if="errors.references" class="error">{{ errors.references }}</div>
      </div>

      <!-- 7. Страницы -->
      <div class="section" :class="{ 'section-error': errors.pages }">
        <h3>7. {{ t('pages') }} <span class="required">*</span></h3>
        <div class="checkbox-group">
          <div v-for="option in pagesOptions" :key="option.value" class="checkbox-inline">
            <input type="checkbox" :id="'page_' + option.value" :value="option.value" v-model="form.pages" />
            <label :for="'page_' + option.value">{{ option.label }}</label>
          </div>
          <div class="checkbox-inline">
            <input type="checkbox" id="pageOther" value="other" v-model="form.pages" />
            <label for="pageOther">{{ t('other') }}:</label>
            <input
              v-if="form.pages.includes('other')"
              type="text"
              v-model="form.pagesOther"
              :placeholder="t('describePh')"
              style="margin-left:10px;flex:1;min-width:120px;"
            />
          </div>
        </div>
        <div v-if="errors.pages" class="error">{{ errors.pages }}</div>
      </div>

      <!-- 8. Контент -->
      <div class="section" :class="{ 'section-error': errors.content }">
        <h3>8. {{ t('content') }} <span class="required">*</span></h3>
        <div class="checkbox-group">
          <div v-for="option in contentOptions" :key="option.value" class="checkbox-inline">
            <input type="checkbox" :id="'content_' + option.value" :value="option.value" v-model="form.content" />
            <label :for="'content_' + option.value">{{ option.label }}</label>
          </div>
          <div class="checkbox-inline">
            <input type="checkbox" id="contentHelp" value="contentHelp" v-model="form.content" />
            <label for="contentHelp">{{ t('contentHelp') }}</label>
          </div>
        </div>
        <div v-if="errors.content" class="error">{{ errors.content }}</div>
      </div>

      <!-- 9. Аудитория -->
      <div class="section">
        <h3>9. {{ t('audience') }} <span class="required">*</span></h3>
        <textarea
          v-model="form.audience"
          :placeholder="t('audiencePh')"
          :class="{ 'has-error': errors.audience }"
        ></textarea>
        <div v-if="errors.audience" class="error">{{ errors.audience }}</div>
      </div>

      <!-- 10. Технические требования -->
      <div class="section">
        <h3>10. {{ t('techTitle') }}</h3>
        <label>{{ t('techLabel') }}</label>
        <textarea v-model="form.tech" :placeholder="t('techPh')"></textarea>
      </div>

      <!-- 11. Бюджет и сроки -->
      <div class="section">
        <h3>11. {{ t('budgetTitle') }}</h3>

        <label>{{ t('budget') }} <span class="required">*</span></label>
        <input
          type="text"
          v-model="form.budget"
          :placeholder="t('budgetPh')"
          :class="{ 'has-error': errors.budget }"
        />
        <div v-if="errors.budget" class="error">{{ errors.budget }}</div>

        <label>{{ t('deadline') }} <span class="required">*</span></label>
        <input
          type="text"
          v-model="form.deadline"
          :placeholder="t('deadlinePh')"
          :class="{ 'has-error': errors.deadline }"
        />
        <div v-if="errors.deadline" class="error">{{ errors.deadline }}</div>

        <label>{{ t('startDate') }}</label>
        <div class="datepicker-wrap">
          <VueDatePicker
            v-model="form.startDate"
            :locale="lang === 'ru' ? 'ru' : 'uk'"
            format="dd.MM.yyyy"
            :enable-time-picker="false"
            :placeholder="t('startDatePh')"
            :text-input="false"
            :clearable="true"
            auto-apply
            :week-start="1"
          />
        </div>
      </div>

      <!-- 12. Поддержка -->
      <div class="section">
        <h3>12. {{ t('supportTitle') }}</h3>
        <select v-model="form.support" :class="{ 'has-error': errors.support }">
          <option disabled value="">{{ t('chooseSupport') }}</option>
          <option value="supportYes">{{ t('supportYes') }}</option>
          <option value="supportNo">{{ t('supportNo') }}</option>
          <option value="other">{{ t('other') }}</option>
        </select>
        <div v-if="errors.support" class="error">{{ errors.support }}</div>
        <div v-if="form.support === 'other'">
          <input
            type="text"
            v-model="form.supportOther"
            :placeholder="t('describePh')"
            :class="{ 'has-error': errors.supportOther }"
          />
          <div v-if="errors.supportOther" class="error">{{ errors.supportOther }}</div>
        </div>
      </div>

      <!-- 13. Комментарии -->
      <div class="section">
        <h3>13. {{ t('commentsTitle') }}</h3>
        <textarea v-model="form.comments" :placeholder="t('commentsPh')"></textarea>
      </div>

      <div v-if="hasErrors" class="form-error-summary">{{ t('formHasErrors') }}</div>

      <button type="submit" :disabled="sending">
        {{ sending ? t('sendingBtn') : t('sendBtn') }}
      </button>
    </form>

    <div v-if="showPopup" class="popup">
      <div class="popup-content">
        <h2>{{ t('popupTitle') }}</h2>
        <p>{{ t('popupText') }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { validateForm, isValid, emptyForm } from '../utils/validation';

const TRANSLATIONS = {
  ua: {
    briefTitle: 'U-iT Бриф',
    briefDesc: 'Заповніть цей бриф, щоб ми могли краще зрозуміти ваші цілі, задачі та побажання для майбутнього сайту. Це допоможе нам підготувати для вас найкращу пропозицію.',

    other: 'Інше',
    describePh: 'Опишіть',

    contactsTitle: 'Контактні дані',
    fullName: 'ПІБ',
    fullNamePh: 'Ваше ім’я та прізвище',
    email: 'Email',
    emailPh: 'example@email.com',
    phone: 'Телефон або месенджер',
    phonePh: '+380... або @username',
    company: 'Компанія/проєкт',
    companyPh: 'Назва компанії або проєкту (якщо є)',
    aboutCompany: 'Про компанію/проєкт',
    aboutCompanyPh: 'Коротко опишіть сферу діяльності, особливості, переваги',

    goals: 'Цілі та задачі сайту',
    goalsPh: 'Навіщо потрібен сайт? Які задачі він має вирішувати?',

    siteType: 'Тип сайту',
    chooseSiteType: 'Оберіть тип сайту',
    siteTypeShop: 'Інтернет-магазин',
    siteTypeCorp: 'Корпоративний сайт',
    siteTypeBlog: 'Блог',
    siteTypeLanding: 'Лендінг',
    siteTypePortal: 'Портал',
    siteTypeCard: 'Сайт-візитка',
    siteTypeOtherPh: 'Уточніть тип сайту',

    features: 'Функціонал',
    f_basket: 'Кошик',
    f_payment: 'Онлайн-оплата',
    f_reviews: 'Відгуки',
    f_contactForm: 'Контактна форма',
    f_calculator: 'Калькулятор',
    f_account: 'Особистий кабінет',
    f_filters: 'Фільтри для пошуку',

    designTitle: 'Дизайн і референси',
    designPreferences: 'Дизайн',
    designPreferencesPh: 'Опишіть ваші побажання щодо стилю, кольорів, атмосфери',
    references: 'Референси',
    referencesPh: 'Вставте посилання й опишіть, що саме подобається',

    pages: 'Сторінки',
    p_home: 'Головна',
    p_about: 'Про нас',
    p_contacts: 'Контакти',
    p_blog: 'Блог',
    p_catalog: 'Каталог',
    p_product: 'Картка товару',
    p_basket: 'Кошик',
    p_order: 'Оформлення замовлення',
    p_account: 'Особистий кабінет',
    p_privacy: 'Політика конфіденційності',
    p_return: 'Політика повернення',
    p_404: '404',

    content: 'Контент',
    c_logo: 'Логотип',
    c_texts: 'Тексти',
    c_images: 'Зображення',
    c_video: 'Відео',
    contentHelp: 'Якщо чогось немає — потрібна допомога у створенні?',

    audience: 'Цільова аудиторія',
    audiencePh: 'Вік, інтереси, географія',

    techTitle: 'Мультимовність, адаптивність, SEO, інтеграції',
    techLabel: 'Мультимовність, адаптивність, SEO, інтеграції',
    techPh: 'Наприклад: мобільна версія, мови, інтеграції з CRM, SEO, аналітика тощо.',

    budgetTitle: 'Бюджет і терміни',
    budget: 'Бюджет',
    budgetPh: 'Вкажіть суму або діапазон',
    deadline: 'Терміни',
    deadlinePh: 'Наприклад: 2 місяці',
    startDate: 'Дата старту',
    startDatePh: 'Оберіть дату',

    supportTitle: 'Підтримка після запуску',
    chooseSupport: 'Оберіть варіант',
    supportYes: 'Так',
    supportNo: 'Ні',

    commentsTitle: 'Додаткові коментарі',
    commentsPh: 'Будь-які додаткові побажання, інтеграції, особливі вимоги',

    sendBtn: 'Відправити',
    sendingBtn: 'Відправляємо…',
    formHasErrors: 'Будь ласка, заповніть усі обов’язкові поля, виділені червоним.',

    popupTitle: 'Дякуємо за заявку!',
    popupText: 'Ваша заявка відправлена. Ми зв’яжемося з вами найближчим часом.',
    errSend: 'Помилка відправки. Спробуйте пізніше.',
    errConn: 'Помилка з’єднання з сервером.',
  },
  ru: {
    briefTitle: 'U-iT Бриф',
    briefDesc: 'Заполните этот бриф, чтобы мы могли лучше понять ваши цели, задачи и пожелания для будущего сайта. Это поможет нам подготовить для вас наилучшее предложение.',

    other: 'Другое',
    describePh: 'Опишите',

    contactsTitle: 'Контактные данные',
    fullName: 'ФИО',
    fullNamePh: 'Ваше имя и фамилия',
    email: 'Email',
    emailPh: 'example@email.com',
    phone: 'Телефон или мессенджер',
    phonePh: '+380... или @username',
    company: 'Компания/проект',
    companyPh: 'Название компании или проекта (если есть)',
    aboutCompany: 'О компании/проекте',
    aboutCompanyPh: 'Кратко опишите сферу деятельности, особенности, преимущества',

    goals: 'Цели и задачи сайта',
    goalsPh: 'Зачем нужен сайт? Какие задачи он должен решать?',

    siteType: 'Тип сайта',
    chooseSiteType: 'Выберите тип сайта',
    siteTypeShop: 'Интернет-магазин',
    siteTypeCorp: 'Корпоративный сайт',
    siteTypeBlog: 'Блог',
    siteTypeLanding: 'Лендинг',
    siteTypePortal: 'Портал',
    siteTypeCard: 'Сайт-визитка',
    siteTypeOtherPh: 'Уточните тип сайта',

    features: 'Функционал',
    f_basket: 'Корзина',
    f_payment: 'Онлайн-оплата',
    f_reviews: 'Отзывы',
    f_contactForm: 'Контактная форма',
    f_calculator: 'Калькулятор',
    f_account: 'Личный кабинет',
    f_filters: 'Фильтры для поиска',

    designTitle: 'Дизайн и референсы',
    designPreferences: 'Дизайн',
    designPreferencesPh: 'Опишите ваши пожелания по стилю, цветам, атмосфере',
    references: 'Референсы',
    referencesPh: 'Вставьте ссылки и опишите, что именно нравится',

    pages: 'Страницы',
    p_home: 'Главная',
    p_about: 'О нас',
    p_contacts: 'Контакты',
    p_blog: 'Блог',
    p_catalog: 'Каталог',
    p_product: 'Карточка товара',
    p_basket: 'Корзина',
    p_order: 'Оформление заказа',
    p_account: 'Личный кабинет',
    p_privacy: 'Политика конфиденциальности',
    p_return: 'Политика возврата',
    p_404: '404',

    content: 'Контент',
    c_logo: 'Логотип',
    c_texts: 'Тексты',
    c_images: 'Изображения',
    c_video: 'Видео',
    contentHelp: 'Если чего-то нет — нужна ли помощь в создании?',

    audience: 'Целевая аудитория',
    audiencePh: 'Возраст, интересы, география',

    techTitle: 'Мультиязычность, адаптивность, SEO, интеграции',
    techLabel: 'Мультиязычность, адаптивность, SEO, интеграции',
    techPh: 'Например: мобильная версия, языки, интеграции с CRM, SEO, аналитика и т.д.',

    budgetTitle: 'Бюджет и сроки',
    budget: 'Бюджет',
    budgetPh: 'Укажите сумму или диапазон',
    deadline: 'Сроки',
    deadlinePh: 'Например: 2 месяца',
    startDate: 'Дата старта',
    startDatePh: 'Выберите дату',

    supportTitle: 'Поддержка после запуска',
    chooseSupport: 'Выберите вариант',
    supportYes: 'Да',
    supportNo: 'Нет',

    commentsTitle: 'Дополнительные комментарии',
    commentsPh: 'Любые дополнительные пожелания, интеграции, особые требования',

    sendBtn: 'Отправить',
    sendingBtn: 'Отправляем…',
    formHasErrors: 'Пожалуйста, заполните все обязательные поля, выделенные красным.',

    popupTitle: 'Спасибо за заявку!',
    popupText: 'Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.',
    errSend: 'Ошибка отправки. Попробуйте позже.',
    errConn: 'Ошибка соединения с сервером.',
  },
};

const FEATURE_KEYS = ['basket', 'payment', 'reviews', 'contactForm', 'calculator', 'account', 'filters'];
const PAGE_KEYS = ['home', 'about', 'contacts', 'blog', 'catalog', 'product', 'basket', 'order', 'account', 'privacy', 'return', '404'];
const CONTENT_KEYS = ['logo', 'texts', 'images', 'video'];

const API_URL = 'https://v1.nocodeapi.com/stylenova/telegram/GnNGVfrFyUpLIQxD';
const REDIRECT_URL = '/thanks.html';
const REDIRECT_DELAY_MS = 2500;

export default {
  name: 'ClientQuestionnaire',
  components: { VueDatePicker },
  data() {
    return {
      lang: 'ua',
      langs: ['ua', 'ru'],
      sending: false,
      showPopup: false,
      errors: {},
      form: emptyForm(),
    };
  },
  computed: {
    featuresOptions() {
      return FEATURE_KEYS.map((k) => ({ value: k, label: this.t('f_' + k) }));
    },
    pagesOptions() {
      return PAGE_KEYS.map((k) => ({ value: k, label: this.t('p_' + k) }));
    },
    contentOptions() {
      return CONTENT_KEYS.map((k) => ({ value: k, label: this.t('c_' + k) }));
    },
    hasErrors() {
      return Object.keys(this.errors).length > 0;
    },
  },
  methods: {
    setLang(l) {
      this.lang = l;
      // Re-translate existing errors so messages match the new language.
      if (this.hasErrors) this.errors = validateForm(this.form, this.lang);
    },
    t(key) {
      const dict = TRANSLATIONS[this.lang] || TRANSLATIONS.ua;
      return Object.prototype.hasOwnProperty.call(dict, key) ? dict[key] : key;
    },
    validate() {
      this.errors = validateForm(this.form, this.lang);
      const ok = isValid(this.errors);
      if (!ok) this.$nextTick(() => this.scrollToFirstError());
      return ok;
    },
    scrollToFirstError() {
      const el = this.$el && this.$el.querySelector ? this.$el.querySelector('.has-error, .section-error') : null;
      if (el && typeof el.scrollIntoView === 'function') {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    },
    formatStartDate() {
      const d = this.form.startDate;
      if (!d) return '';
      const dt = d instanceof Date ? d : new Date(d);
      if (isNaN(dt.getTime())) return '';
      const dd = String(dt.getDate()).padStart(2, '0');
      const mm = String(dt.getMonth() + 1).padStart(2, '0');
      return `${dd}.${mm}.${dt.getFullYear()}`;
    },
    buildMessage() {
      const f = this.form;
      const featuresList = (f.features || []).filter((v) => v !== 'other').map((v) => `• ${this.t('f_' + v)}`).join('\n');
      const pagesList = (f.pages || []).filter((v) => v !== 'other').map((v) => `• ${this.t('p_' + v)}`).join('\n');
      const contentList = (f.content || []).filter((v) => v !== 'contentHelp').map((v) => `• ${this.t('c_' + v)}`).join('\n');
      const startDate = this.formatStartDate();

      if (this.lang === 'ua') {
        return `<b>📝 Бриф на розробку сайту</b>\n\n` +
          `<b>👤 Контактні дані</b>\nПІБ: <b>${f.fullName}</b>\nEmail: <b>${f.email}</b>\nТелефон/месенджер: <b>${f.phoneOrMessenger}</b>\nКомпанія/проєкт: ${f.company || '-'}\n\n` +
          `<b>ℹ️ Про компанію/проєкт</b>\n${f.aboutCompany || '-'}\n\n` +
          `<b>🎯 Цілі та задачі</b>\n${f.goals || '-'}\n\n` +
          `<b>🌐 Тип сайту</b>\n${f.siteType === 'other' ? f.siteTypeOther : this.t(f.siteType)}\n\n` +
          `<b>⚙️ Функціонал</b>\n${featuresList || '-'}${f.featuresOther ? `\nІнше: ${f.featuresOther}` : ''}\n\n` +
          `<b>🎨 Дизайн та референси</b>\nПобажання: ${f.designPreferences || '-'}\nРеференси: ${f.references || '-'}\n\n` +
          `<b>📄 Сторінки</b>\n${pagesList || '-'}${f.pagesOther ? `\nІнше: ${f.pagesOther}` : ''}\n\n` +
          `<b>🖼️ Контент</b>\n${contentList || '-'}\n\n` +
          `<b>👥 Цільова аудиторія</b>\n${f.audience || '-'}\n\n` +
          `<b>🛠️ Технічні вимоги</b>\n${f.tech || '-'}\n\n` +
          `<b>💰 Бюджет</b>: ${f.budget || '-'}\n<b>⏳ Термін</b>: ${f.deadline || '-'}\n<b>📅 Дата старту</b>: ${startDate || '-'}\n\n` +
          `<b>🤝 Підтримка</b>\n${f.support === 'other' ? f.supportOther : this.t(f.support)}\n\n` +
          `<b>💬 Додаткові коментарі</b>\n${f.comments || '-'}`;
      }
      return `<b>📝 Бриф на разработку сайта</b>\n\n` +
        `<b>👤 Контактные данные</b>\nФИО: <b>${f.fullName}</b>\nEmail: <b>${f.email}</b>\nТелефон/мессенджер: <b>${f.phoneOrMessenger}</b>\nКомпания/проект: ${f.company || '-'}\n\n` +
        `<b>ℹ️ О компании/проекте</b>\n${f.aboutCompany || '-'}\n\n` +
        `<b>🎯 Цели и задачи</b>\n${f.goals || '-'}\n\n` +
        `<b>🌐 Тип сайта</b>\n${f.siteType === 'other' ? f.siteTypeOther : this.t(f.siteType)}\n\n` +
        `<b>⚙️ Функционал</b>\n${featuresList || '-'}${f.featuresOther ? `\nДругое: ${f.featuresOther}` : ''}\n\n` +
        `<b>🎨 Дизайн и референсы</b>\nПожелания: ${f.designPreferences || '-'}\nРеференсы: ${f.references || '-'}\n\n` +
        `<b>📄 Страницы</b>\n${pagesList || '-'}${f.pagesOther ? `\nДругое: ${f.pagesOther}` : ''}\n\n` +
        `<b>🖼️ Контент</b>\n${contentList || '-'}\n\n` +
        `<b>👥 Целевая аудитория</b>\n${f.audience || '-'}\n\n` +
        `<b>🛠️ Технические требования</b>\n${f.tech || '-'}\n\n` +
        `<b>💰 Бюджет</b>: ${f.budget || '-'}\n<b>⏳ Сроки</b>: ${f.deadline || '-'}\n<b>📅 Дата старта</b>: ${startDate || '-'}\n\n` +
        `<b>🤝 Поддержка</b>\n${f.support === 'other' ? f.supportOther : this.t(f.support)}\n\n` +
        `<b>💬 Дополнительные комментарии</b>\n${f.comments || '-'}`;
    },
    resetForm() {
      this.form = emptyForm();
      this.errors = {};
    },
    async submitForm() {
      if (!this.validate()) return;
      this.sending = true;
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ Title: this.buildMessage() }),
        });
        if (!response.ok) throw new Error('bad status: ' + response.status);

        this.showPopup = true;
        this.resetForm();
        setTimeout(() => {
          this.showPopup = false;
          window.location.href = REDIRECT_URL;
        }, REDIRECT_DELAY_MS);
      } catch (err) {
        const isHttpErr = err && err.message && err.message.startsWith('bad status');
        // eslint-disable-next-line no-alert
        alert(this.t(isHttpErr ? 'errSend' : 'errConn'));
      } finally {
        this.sending = false;
      }
    },
  },
};
</script>

<style scoped>
.lang-switch {
  display: flex;
  gap: 8px;
  margin-bottom: 18px;
  justify-content: center;
}
.lang-switch button {
  background: #f3f3f3;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  padding: 4px 12px;
  font-size: 1rem;
  cursor: pointer;
  color: #333;
  transition: background 0.2s, color 0.2s;
}
.lang-switch button.active {
  background: #42b983;
  color: #fff;
  border-color: #42b983;
}

.error {
  color: #e53935;
  font-size: 0.93em;
  margin-top: -10px;
  margin-bottom: 10px;
}

.has-error {
  border-color: #e53935 !important;
  background: #fff5f5 !important;
  box-shadow: 0 0 0 2px rgba(229, 57, 53, 0.12);
}

.section-error {
  border-left: 3px solid #e53935;
  padding-left: 12px;
  margin-left: -15px;
}

.form-error-summary {
  color: #e53935;
  background: #fff5f5;
  border: 1px solid #f3c2c0;
  border-radius: 6px;
  padding: 10px 14px;
  margin-bottom: 16px;
  font-size: 0.97rem;
  text-align: center;
}

.popup {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.popup-content {
  background: #fff;
  border-radius: 12px;
  padding: 36px 32px;
  max-width: 400px;
  box-shadow: 0 8px 32px rgba(60, 60, 60, 0.18);
  text-align: center;
}
.popup-content h2 {
  margin-bottom: 16px;
  color: #42b983;
}

form {
  max-width: 950px;
  width: 95vw;
  min-width: 340px;
  margin: 32px auto;
  padding: 32px 48px;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 8px rgba(60, 60, 60, 0.06);
  border: 1px solid #e5e7eb;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #222;
}

.section {
  margin-bottom: 28px;
  padding-bottom: 18px;
  border-bottom: 1px solid #f0f0f0;
}

input[type="text"],
input[type="email"],
input[type="date"],
select,
textarea {
  width: 100%;
  margin-bottom: 14px;
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  background: #fafbfc;
  transition: border 0.2s, background 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
}
input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #42b983;
  background: #fff;
}

input[type="checkbox"] {
  accent-color: #42b983;
  width: 20px;
  height: 20px;
  margin-right: 10px;
  vertical-align: middle;
  cursor: pointer;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-bottom: 10px;
}
.checkbox-inline {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}
.checkbox-inline label {
  font-weight: 400;
  color: #333;
  margin-bottom: 0;
  cursor: pointer;
}

button[type="submit"] {
  padding: 12px 32px;
  background: linear-gradient(90deg, #42b983 0%, #369870 100%);
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin: 0 auto;
  display: block;
  box-shadow: 0 2px 8px rgba(66, 185, 131, 0.08);
  transition: background 0.2s, box-shadow 0.2s, opacity 0.2s;
}
button[type="submit"]:hover { background: linear-gradient(90deg, #369870 0%, #42b983 100%); }
button[type="submit"]:disabled { opacity: 0.6; cursor: progress; }

textarea { min-height: 60px; resize: vertical; }

.datepicker-wrap { margin-bottom: 14px; }
.datepicker-wrap :deep(.dp__input) { cursor: pointer; }

@media (max-width: 700px) {
  form { padding: 16px 4vw; max-width: 98vw; }
}

.header-bar {
  width: 100%;
  background: transparent;
  border-bottom: 1px solid #e5e7eb;
  padding: 18px 0 10px 0;
  margin-bottom: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.required {
  color: #e53935;
  font-weight: bold;
  font-size: 1.2em;
  margin-left: 2px;
  vertical-align: middle;
}
.brief-title {
  font-size: 2.1rem;
  font-weight: 800;
  display: block;
  margin: 0.2em auto 0.2em auto;
  letter-spacing: 0.01em;
  color: #1a1a1a;
  text-align: center;
}
.brief-desc {
  display: block;
  text-align: center;
  font-size: 1.13rem;
  color: #444;
  margin: 0 auto 1.2em auto;
  font-weight: 400;
}
</style>
