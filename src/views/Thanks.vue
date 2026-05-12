<template>
  <div class="thanks-page">
    <h1>Спасибо за заявку!</h1>
    <p>Я получил вашу информацию и скоро свяжусь с вами.</p>
    <div class="contacts-block">
      <h2>Связаться напрямую</h2>
      <p>Если остались вопросы — напишите мне в Telegram:</p>
      <a href="https://t.me/U_iT_Dev" target="_blank" class="tg-link">@U_iT_Dev</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ThanksPage'
}
</script>

<style scoped>
.thanks-page {
  max-width: 500px;
  margin: 60px auto;
  padding: 32px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.08);
  text-align: center;
}
.tg-link {
  display: inline-block;
  margin-top: 12px;
  font-size: 1.2em;
  color: #229ED9;
  text-decoration: none;
  font-weight: bold;
}
.tg-link:hover {
  text-decoration: underline;
}
.contacts-block {
  margin-top: 32px;
}
</style>
