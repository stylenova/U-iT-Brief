<template>
  <div>
    <header class="header-bar">
      <div class="lang-switch">
        <button v-for="l in langs" :key="l" :class="{active: lang===l}" @click="setLang(l)">{{ l.toUpperCase() }}</button>
      </div>
    </header>
    <form @submit.prevent="submitForm">
      <div class="section">
        <h3>1. {{ t('contactsTitle') }}</h3>
        <label>{{ t('fullName') }} *</label>
        <input type="text" v-model="form.fullName" :placeholder="t('fullNamePh')" required />
        <div v-if="errors.fullName" class="error">{{ errors.fullName }}</div>
        <label>{{ t('email') }} *</label>
        <input type="email" v-model="form.email" :placeholder="t('emailPh')" required />
        <div v-if="errors.email" class="error">{{ errors.email }}</div>
        <label>{{ t('phone') }} *</label>
        <input type="text" v-model="form.phoneOrMessenger" :placeholder="t('phonePh')" required />
        <div v-if="errors.phoneOrMessenger" class="error">{{ errors.phoneOrMessenger }}</div>
        <label>{{ t('company') }}</label>
        <input type="text" v-model="form.company" :placeholder="t('companyPh')" />
        <label>{{ t('aboutCompany') }}</label>
        <textarea v-model="form.aboutCompany" :placeholder="t('aboutCompanyPh')"></textarea>
      </div>
      <div class="section">
        <h3>3. {{ t('goals') }} <span style="color:red">*</span></h3>
        <textarea v-model="form.goals" :placeholder="t('goalsPh')"></textarea>
        <div v-if="errors.goals" class="error">{{ errors.goals }}</div>
      </div>


    <div class="section">
      <h3>4. {{ t('siteType') }} <span style="color:red">*</span></h3>
      <select v-model="form.siteType" required>
        <option disabled value="">{{ t('chooseSiteType') }}</option>
        <option v-for="key in ['siteTypeShop','siteTypeCorp','siteTypeBlog','siteTypeLanding','siteTypePortal','siteTypeCard','other']" :key="key" :value="key">{{ t(key) }}</option>
      </select>
      <div v-if="form.siteType === 'other'">
        <input type="text" v-model="form.siteTypeOther" :placeholder="t('siteTypeOtherPh')" />
      </div>
    </div>


    <div class="section">
      <h3>5. {{ t('features') }} <span style="color:red">*</span></h3>
      <div class="checkbox-group">
        <div v-for="option in featuresOptions" :key="option.value" class="checkbox-inline">
          <input type="checkbox" :id="option.value" :value="option.value" v-model="form.features" />
          <label :for="option.value">{{ t(option.label) }}</label>
        </div>
        <div class="checkbox-inline">
          <input type="checkbox" id="featureOther" value="other" v-model="form.features" />
          <label for="featureOther">{{ t('other') }}:</label>
          <input v-if="form.features.includes('other')" type="text" v-model="form.featuresOther" :placeholder="t('describePh') || 'Опишите'" style="margin-left:10px;flex:1;min-width:120px;" />
        </div>
      </div>
    </div>


    <div class="section">
      <h3>6. {{ t('designTitle') }}</h3>
      <label>{{ t('designPreferences') }} <span style="color:red">*</span></label>
      <textarea v-model="form.designPreferences" required :placeholder="t('designPreferencesPh')"></textarea>
      <label>{{ t('references') }} <span style="color:red">*</span></label>
      <textarea v-model="form.references" required :placeholder="t('referencesPh')"></textarea>
    </div>


    <div class="section">
      <h3>7. {{ t('pages') }} <span style="color:red">*</span></h3>
      <div class="checkbox-group">
        <div v-for="option in pagesOptions" :key="option.value" class="checkbox-inline">
          <input type="checkbox" :id="option.value" :value="option.value" v-model="form.pages" />
          <label :for="option.value">{{ t(option.label) }}</label>
        </div>
        <div class="checkbox-inline">
          <input type="checkbox" id="pageOther" value="other" v-model="form.pages" />
          <label for="pageOther">{{ t('other') }}:</label>
          <input v-if="form.pages.includes('other')" type="text" v-model="form.pagesOther" :placeholder="t('describePh') || 'Опишите'" style="margin-left:10px;flex:1;min-width:120px;" />
        </div>
      </div>
    </div>


    <div class="section">
      <h3>8. {{ t('content') }} <span style="color:red">*</span></h3>
      <div class="checkbox-group">
        <div v-for="option in contentOptions" :key="option.value" class="checkbox-inline">
          <input type="checkbox" :id="option.value" :value="option.value" v-model="form.content" />
          <label :for="option.value">{{ t(option.label) }}</label>
        </div>
        <div class="checkbox-inline">
          <input type="checkbox" id="contentHelp" value="contentHelp" v-model="form.content" />
          <label for="contentHelp">{{ t('contentHelp') || 'Если чего-то нет, нужна ли помощь в создании?' }}</label>
        </div>
      </div>
    </div>


    <div class="section">
      <h3>9. {{ t('audience') }} <span style="color:red">*</span></h3>
      <textarea v-model="form.audience" required :placeholder="t('audiencePh')"></textarea>
    </div>

    <div class="section">
      <h3>10. {{ t('techTitle') }}</h3>
      <label>{{ t('techLabel') }}</label>
      <textarea v-model="form.tech" :placeholder="t('techPh')"></textarea>
    </div>


    <div class="section">
      <h3>11. {{ t('budgetTitle') }}</h3>
      <label>{{ t('budget') }} <span style="color:red">*</span></label>
      <input type="text" v-model="form.budget" required :placeholder="t('budgetPh')" />
      <label>{{ t('deadline') }} <span style="color:red">*</span></label>
      <input type="text" v-model="form.deadline" required :placeholder="t('deadlinePh')" />
      <label>{{ t('startDate') }}</label>
      <input type="date" v-model="form.startDate" />
    </div>

    <div class="section">
      <h3>12. {{ t('supportTitle') }}</h3>
      <select v-model="form.support" required>
        <option disabled value="">{{ t('chooseSupport') }}</option>
        <option value="supportYes">{{ t('supportYes') }}</option>
        <option value="supportNo">{{ t('supportNo') }}</option>
        <option value="other">{{ t('other') }}</option>
      </select>
      <div v-if="form.support === 'other'">
        <input type="text" v-model="form.supportOther" :placeholder="t('describePh')" />
      </div>
    </div>

    <div class="section">
      <h3>13. {{ t('commentsTitle') }}</h3>
      <textarea v-model="form.comments" :placeholder="t('commentsPh')"></textarea>
    </div>

    <button type="submit">{{ t('sendBtn') || 'Отправить' }}</button>
    </form>

    <div v-if="showPopup" class="popup">
      <div class="popup-content">
        <h2>{{ t('popupTitle') }}</h2>
        <p>{{ t('popupText') }}</p>
        <button @click="showPopup=false">OK</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      lang: 'ru',
      langs: ['ua', 'ru'],
      featuresOptions: [
        { label: 'basket', value: 'basket' },
        { label: 'payment', value: 'payment' },
        { label: 'reviews', value: 'reviews' },
        { label: 'contactForm', value: 'contactForm' },
        { label: 'calculator', value: 'calculator' },
        { label: 'account', value: 'account' },
        { label: 'filters', value: 'filters' },
      ],
      pagesOptions: [
        { label: 'home', value: 'home' },
        { label: 'about', value: 'about' },
        { label: 'contacts', value: 'contacts' },
        { label: 'blog', value: 'blog' },
        { label: 'catalog', value: 'catalog' },
        { label: 'product', value: 'product' },
        { label: 'basket', value: 'basket' },
        { label: 'order', value: 'order' },
        { label: 'account', value: 'account' },
        { label: 'privacy', value: 'privacy' },
        { label: 'return', value: 'return' },
        { label: '404', value: '404' },
      ],
      contentOptions: [
        { label: 'logo', value: 'logo' },
        { label: 'texts', value: 'texts' },
        { label: 'images', value: 'images' },
        { label: 'video', value: 'video' },
      ],
      translations: {
        ru: {
          other: 'Другое',
          describePh: 'Опишите',
          contentHelp: 'Если чего-то нет, нужна ли помощь в создании?',
          chooseSiteType: 'Выберите тип сайта',
          siteTypeShop: 'Интернет-магазин',
          siteTypeCorp: 'Корпоративный сайт',
          siteTypeBlog: 'Блог',
          siteTypeLanding: 'Лендинг',
          siteTypePortal: 'Портал',
          siteTypeCard: 'Сайт-визитка',
          siteTypeOtherPh: 'Уточните тип сайта',
          basket: 'Корзина',
          payment: 'Онлайн-оплата',
          reviews: 'Отзывы',
          contactForm: 'Контактная форма',
          calculator: 'Калькулятор',
          account: 'Личный кабинет',
          filters: 'Фильтры для поиска',
          home: 'Главная',
          about: 'О нас',
          contacts: 'Контакты',
          blog: 'Блог',
          catalog: 'Каталог',
          product: 'Карточка товара',
          order: 'Оформление заказа',
          privacy: 'Политика конфиденциальности',
          return: 'Политика возврата',
          logo: 'Логотип',
          texts: 'Тексты',
          images: 'Изображения',
          video: 'Видео',
          '404': '404',
          // Секции
          contactsTitle: 'Контактные данные',
          aboutCompany: 'О компании/проекте',
          goals: 'Цели и задачи сайта',
          siteType: 'Тип сайта',
          features: 'Функционал',
          designTitle: 'Дизайн и референсы',
          pages: 'Страницы',
          content: 'Контент',
          audience: 'Целевая аудитория',
          techTitle: 'Технические требования',
          budgetTitle: 'Бюджет и сроки',
          supportTitle: 'Поддержка после запуска',
          commentsTitle: 'Дополнительные комментарии',
          // Остальные ключи
          briefTitle: 'Бриф на разработку сайта',
          fullName: 'ФИО',
          fullNamePh: 'Ваше имя и фамилия',
          email: 'Email',
          emailPh: 'example@email.com',
          phone: 'Телефон или мессенджер',
          phonePh: '+380... или @username',
          company: 'Компания/проект',
          companyPh: 'Название компании или проекта (если есть)',
          aboutCompanyPh: 'Кратко опишите сферу деятельности, особенности, преимущества',
          goalsPh: 'Зачем нужен сайт? Какие задачи должен решать?',
          designPreferences: 'Дизайн',
          designPreferencesPh: 'Опишите ваши пожелания по стилю, цветам, атмосфере',
          references: 'Референсы',
          referencesPh: 'Вставьте ссылки и опишите, что именно нравится',
          pages: 'Страницы',
          content: 'Контент',
          audiencePh: 'Возраст, интересы, география',
          techLabel: 'Мультиязычность, адаптивность, SEO, интеграции',
          techPh: 'Например: мобильная версия, языки, интеграции с CRM, SEO, аналитика и т.д.',
          budgetPh: 'Вкажіть суму або діапазон',
          deadlinePh: 'Наприклад: 2 місяці',
          chooseSupport: 'Оберіть варіант',
          supportYes: 'Так',
          supportNo: 'Ні',
          commentsPh: 'Будь-які додаткові побажання, інтеграції, особливі вимоги',
          sendBtn: 'Отправить',
          errFullName: 'Укажите ФИО',
          errEmail: 'Введите корректный email',
          errPhone: 'Укажите телефон или мессенджер',
          errGoals: 'Опишите цели и задачи',
          popupTitle: 'Спасибо за заявку!',
          popupText: 'Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время и подготовим индивидуальное предложение для вашего проекта.'
        },
        ua: {
          other: 'Інше',
          describePh: 'Опишіть',
          contentHelp: 'Якщо чогось немає, потрібна допомога у створенні?',
          chooseSiteType: 'Оберіть тип сайту',
          siteTypeShop: 'Інтернет-магазин',
          siteTypeCorp: 'Корпоративний сайт',
          siteTypeBlog: 'Блог',
          siteTypeLanding: 'Лендінг',
          siteTypePortal: 'Портал',
          siteTypeCard: 'Сайт-визитка',
          siteTypeOtherPh: 'Уточніть тип сайту',
          basket: 'Кошик',
          payment: 'Онлайн-оплата',
          reviews: 'Відгуки',
          contactForm: 'Контактна форма',
          calculator: 'Калькулятор',
          account: 'Особистий кабінет',
          filters: 'Фільтри для пошуку',
          home: 'Головна',
          about: 'Про нас',
          contacts: 'Контакти',
          blog: 'Блог',
          catalog: 'Каталог',
          product: 'Картка товару',
          order: 'Оформлення замовлення',
          privacy: 'Політика конфіденційності',
          return: 'Політика повернення',
          logo: 'Логотип',
          texts: 'Тексти',
          images: 'Зображення',
          video: 'Відео',
          '404': '404',
          // Секции
          contactsTitle: 'Контактні дані',
          aboutCompany: 'Про компанію/проєкт',
          goals: 'Цілі та задачі сайту',
          siteType: 'Тип сайту',
          features: 'Функціонал',
          designTitle: 'Дизайн і референси',
          pages: 'Сторінки',
          content: 'Контент',
          audience: 'Цільова аудиторія',
          techTitle: 'Технічні вимоги',
          budgetTitle: 'Бюджет і терміни',
          supportTitle: 'Підтримка після запуску',
          commentsTitle: 'Додаткові коментарі',
          // Остальні ключі
          briefTitle: 'Бриф на розробку сайту',
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
          goalsPh: 'Навіщо потрібен сайт? Які задачі має вирішувати?',
          siteType: 'Тип сайту',
          features: 'Функціонал',
          designPreferences: 'Дизайн',
          references: 'Референси',
          pages: 'Сторінки',
          content: 'Контент',
          audience: 'Цільова аудиторія',
          tech: 'Технічні вимоги',
          budget: 'Бюджет',
          deadline: 'Терміни',
          startDate: 'Дата старту',
          support: 'Підтримка',
          comments: 'Коментарі',
          sendBtn: 'Відправити',
          errFullName: 'Вкажіть ПІБ',
          errEmail: 'Введіть коректний email',
          errPhone: 'Вкажіть телефон або месенджер',
          errGoals: 'Опишіть цілі та задачі',
          popupTitle: 'Дякуємо за заявку!',
          popupText: 'Ваша заявка відправлена. Ми зв’яжемося з вами найближчим часом і підготуємо індивідуальну пропозицію для вашого проєкту.'
        }
      },
      errors: {},
      showPopup: false,
      form: {
        fullName: '',
        email: '',
        phoneOrMessenger: '',
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
        multilang: '',
        budget: '',
        deadline: '',
        startDate: '',
        support: '',
        supportOther: '',
        comments: '',
      },
      featuresOptions: [
        { label: 'Корзина', value: 'basket' },
        { label: 'Онлайн-оплата', value: 'payment' },
        { label: 'Отзывы', value: 'reviews' },
        { label: 'Контактная форма', value: 'contact' },
        { label: 'Калькулятор', value: 'calculator' },
        { label: 'Личный кабинет', value: 'account' },
        { label: 'Фильтры для поиска', value: 'filters' },
      ],
      pagesOptions: [
        { label: 'Главная', value: 'home' },
        { label: 'О нас', value: 'about' },
        { label: 'Контакты', value: 'contacts' },
        { label: 'Блог', value: 'blog' },
        { label: 'Каталог', value: 'catalog' },
        { label: 'Карточка товара', value: 'product' },
        { label: 'Корзина', value: 'basket' },
        { label: 'Оформление заказа', value: 'order' },
        { label: 'Личный кабинет', value: 'account' },
        { label: 'Политика конфиденциальности', value: 'privacy' },
        { label: 'Политика возврата', value: 'return' },
        { label: '404', value: '404' },
      ],
      contentOptions: [
        { label: 'Логотип', value: 'logo' },
        { label: 'Тексты', value: 'texts' },
        { label: 'Изображения', value: 'images' },
        { label: 'Видео', value: 'video' },
      ],
    };
  },
  methods: {
    setLang(l) {
      this.lang = l;
    },
    t(key) {
      const val = this.translations[this.lang][key];
      console.log('t:', this.lang, key, '=>', val);
      return val || key;
    },
    validate() {
      const e = {};
      if (!this.form.fullName) e.fullName = this.t('errFullName');
      if (!this.form.email || !/^\S+@\S+\.\S+$/.test(this.form.email)) e.email = this.t('errEmail');
      if (!this.form.phoneOrMessenger) e.phoneOrMessenger = this.t('errPhone');
      if (!this.form.goals) e.goals = this.t('errGoals');
      this.errors = e;
      return Object.keys(e).length === 0;
    },
    async submitForm() {
      if (!this.validate()) return;
      const apiUrl = 'https://v1.nocodeapi.com/stylenova/telegram/GnNGVfrFyUpLIQxD';
      const f = this.form;
      const message = `\n<b>${this.t('briefTitle')}</b>\n${this.t('fullName')}: ${f.fullName}\nEmail: ${f.email}\n${this.t('phone')}: ${f.phoneOrMessenger}\n${this.t('company')}: ${f.company}\n${this.t('aboutCompany')}: ${f.aboutCompany}\n${this.t('goals')}: ${f.goals}\n${this.t('siteType')}: ${f.siteType === 'Другое' ? f.siteTypeOther : f.siteType}\n${this.t('features')}: ${(f.features || []).join(', ')}${f.featuresOther ? ' (' + f.featuresOther + ')' : ''}\n${this.t('designPreferences')}: ${f.designPreferences}\n${this.t('references')}: ${f.references}\n${this.t('pages')}: ${(f.pages || []).join(', ')}${f.pagesOther ? ' (' + f.pagesOther + ')' : ''}\n${this.t('content')}: ${(f.content || []).join(', ')}\n${this.t('audience')}: ${f.audience}\n${this.t('tech')}: ${f.tech}\n${this.t('budget')}: ${f.budget}\n${this.t('deadline')}: ${f.deadline}\n${this.t('startDate')}: ${f.startDate}\n${this.t('support')}: ${f.support === 'Другое' ? f.supportOther : f.support}\n${this.t('comments')}: ${f.comments}`;

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: message,
            parse_mode: 'HTML'
          })
        });
        if (response.ok) {
          this.showPopup = true;
          // Автоматическое закрытие попапа через 10 секунд и редирект
          setTimeout(() => {
            this.showPopup = false;
            this.$router
              ? this.$router.push('/thanks')
              : (window.location.href = '/thanks');
          }, 10000);
        } else {
          alert(this.t('errSend') || 'Ошибка отправки. Попробуйте позже.');
        }
      } catch (e) {
        alert(this.t('errConn') || 'Ошибка соединения с сервером.');
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
  font-size: 0.97em;
  margin-bottom: 8px;
  margin-top: -8px;
}
.popup {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.35);
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
  box-shadow: 0 8px 32px rgba(60,60,60,0.18);
  text-align: center;
}
.popup-content h2 {
  margin-bottom: 16px;
  color: #42b983;
}
.popup-content button {
  margin-top: 18px;
  background: #42b983;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 28px;
  font-size: 1.1rem;
  cursor: pointer;
}
form {
  max-width: 950px;
  width: 95vw;
  min-width: 340px;
  margin: 32px auto;
  padding: 32px 48px;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 32px rgba(60, 60, 60, 0.10);
  border: 1px solid #e5e7eb;
}

h2 {
  text-align: center;
  margin-bottom: 28px;
  font-size: 2rem;
  font-weight: 700;
  color: #222;
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
  transition: border 0.2s;
}
input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #42b983;
  background: #fff;
}

/* Кастомные чекбоксы */
input[type="checkbox"] {
  accent-color: #42b983;
  width: 20px;
  height: 20px;
  margin-right: 10px;
  vertical-align: middle;
  cursor: pointer;
}

/* Стилизация чекбоксов и их подписей */
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

button {
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
  box-shadow: 0 2px 8px rgba(66,185,131,0.08);
  transition: background 0.2s, box-shadow 0.2s;
}
button:hover {
  background: linear-gradient(90deg, #369870 0%, #42b983 100%);
  box-shadow: 0 4px 16px rgba(66,185,131,0.13);
}

/* Обязательные поля */
label span[style] {
  color: #e53935 !important;
  margin-left: 2px;
}

textarea {
  min-height: 60px;
  resize: vertical;
}

@media (max-width: 700px) {
  form {
    padding: 16px 4vw;
    max-width: 98vw;
  }
  h2 {
    font-size: 1.3rem;
  }
}
  .header-bar {
    width: 100vw;
    background: #f7fafd;
    box-shadow: 0 2px 8px rgba(60,60,60,0.04);
    padding: 18px 0 10px 0;
    margin-bottom: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
