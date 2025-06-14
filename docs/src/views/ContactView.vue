<script setup lang="ts">
import { ref, computed } from 'vue';
import HomeHeadline from '../components/HomeHeadline.vue';
import { Headline } from '../models/page';
import { useContactStore } from '../stores/contact'
import { type EmailMessage,type ContactMessage } from '../models/contact';

const contactStore = useContactStore()

const name = ref('');
const email = ref('');
const subject = ref('');
const message = ref('');
const submitted = ref(false);
const submitting = ref(false);
const error = ref(false);

const submitForm = async () => {
  if (!name.value || !email.value || !message.value) {
    return;
  }

  submitting.value = true;

  try {
    const contactMessage = {
      name:name.value,
      email:email.value,
      message:message.value,
      subject:subject.value
    } as ContactMessage
    const response = await contactStore.service.sendmail(contactMessage)
    const result = await response.json();
    submitted.value = true
  } catch (error) {
    console.error('メール送信中にエラーが発生しました。', error)
  }

};

const getSubmitLabel = computed(() => {
  if (submitted.value) return "送信済み"
  else if (submitting.value) return "送信中..."
  else return '送信する'
})


</script>

<template>
  <div class="contact-view">
    <HomeHeadline :headline="new Headline('contact-page', 'お問い合わせ')" />

    <div class="contact-info">
      <p>ご質問、ご相談、ご依頼等がございましたら下記フォームよりお問い合わせください。</p>
    </div>

    <div class="contact-form-container">
      <form @submit.prevent="submitForm" class="contact-form">
        <div class="form-group">
          <label for="name">お名前 <span class="required">*</span></label>
          <input id="name" v-model="name" type="text" required placeholder="山田 太郎">
        </div>

        <div class="form-group">
          <label for="email">メールアドレス <span class="required">*</span></label>
          <input id="email" v-model="email" type="email" required placeholder="example@email.com">
        </div>

        <div class="form-group">
          <label for="subject">件名</label>
          <input id="subject" v-model="subject" type="text" placeholder="お問い合わせ内容の概要">
        </div>

        <div class="form-group">
          <label for="message">メッセージ <span class="required">*</span></label>
          <textarea id="message" v-model="message" required rows="6" placeholder="お問い合わせ内容の詳細をご記入ください"></textarea>
        </div>

        <div class="form-footer">
          <p class="required-note"><span class="required">*</span> は必須項目です</p>
          <button type="submit" :disabled="submitting || !name || !email || !message" class="submit-button">
            {{ getSubmitLabel }}
          </button>
        </div>
      </form>

      <div class="form-response" v-if="submitted">
        <div class="success-message">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M8 12l2 2 4-4"></path>
          </svg>
          <p>お問い合わせありがとうございます。メッセージが送信されました。</p>
          <p>できるだけ早くご返信いたします。</p>
        </div>
      </div>

      <div class="form-response" v-if="error">
        <div class="error-message">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <p>申し訳ありませんが、エラーが発生しました。</p>
          <p>後ほど再度お試しいただくか、直接メールでお問い合わせください。</p>
        </div>
      </div>
    </div>

    <div class="contact-alternatives">
      <HomeHeadline :headline="new Headline('other-contact', 'その他の連絡方法')" />
      <p>お問い合わせフォームを使用せずに直接連絡する場合は、以下の連絡先をご利用ください。</p>

      <div class="contact-methods">
        <div class="contact-method">
          <h3>メール</h3>
          <p><a href="mailto:dahlia1209@gmail.com">dahlia1209@gmail.com</a></p>
        </div>

        <!-- 必要に応じて他の連絡方法を追加できます -->
        <!-- 
        <div class="contact-method">
          <h3>SNS</h3>
          <p>Twitter: <a href="https://twitter.com/yourhandle" target="_blank">@yourhandle</a></p>
          <p>GitHub: <a href="https://github.com/dahlia1209" target="_blank">dahlia1209</a></p>
        </div>
        -->
      </div>
    </div>
  </div>
</template>

<style scoped>
.contact-view {
  padding: 0 30px;
}

.contact-info {
  margin: 20px 0;
  line-height: 1.6;
}

.contact-form-container {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 30px;
  margin: 20px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.contact-form {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

@media (min-width: 768px) {
  .contact-form {
    grid-template-columns: 1fr 1fr;
    gap: 25px;
  }

  .form-group:nth-child(3),
  .form-group:nth-child(4),
  .form-footer {
    grid-column: span 2;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 6px;
  font-weight: 500;
  font-size: 0.95rem;
}

input,
textarea {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.3s;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #41b883;
  box-shadow: 0 0 0 2px rgba(65, 184, 131, 0.2);
}

.required {
  color: #e74c3c;
  margin-left: 3px;
}

.required-note {
  font-size: 0.85rem;
  color: #666;
}

.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.submit-button {
  background-color: #41b883;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover:not(:disabled) {
  background-color: #389f70;
}

.submit-button:disabled {
  background-color: #a8d5c5;
  cursor: not-allowed;
}

.form-response {
  margin-top: 20px;
}

.success-message,
.error-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px;
  border-radius: 8px;
  animation: fadeIn 0.5s;
}

.success-message {
  background-color: #d4edda;
  color: #155724;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
}

.success-message svg,
.error-message svg {
  margin-bottom: 10px;
}

.success-message svg {
  color: #28a745;
}

.error-message svg {
  color: #dc3545;
}

.contact-alternatives {
  margin-top: 40px;
}

.contact-methods {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.contact-method {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.contact-method h3 {
  margin: 0 0 10px 0;
  color: #2D3E50;
  font-size: 1.1rem;
  font-weight: 600;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>