<script setup lang="ts">
// ServiceItem.vue - 個別のサービスカードコンポーネント

interface Service {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  features: string[];
  price?: string;
  deliveryTime?: string;
}

const props = defineProps<{
  service: Service
}>();
</script>

<template>
  <div class="service-card">
    <div class="image-container">
      <img 
        :src="service.imageUrl" 
        :alt="service.title"
      >
    </div>
    
    <div class="service-content">
      <h3>{{ service.title }}</h3>
      
      <p class="description">{{ service.description }}</p>
      
      <div class="features-section">
        <h4>主な特徴</h4>
        <ul>
          <li v-for="(feature, index) in service.features" :key="index">
            {{ feature }}
          </li>
        </ul>
      </div>
      
      <div class="details-section" v-if="service.price || service.deliveryTime">
        <div class="detail-item" v-if="service.price">
          <span class="detail-label">料金目安:</span>
          <span class="detail-value">{{ service.price }}</span>
        </div>
        
        <div class="detail-item" v-if="service.deliveryTime">
          <span class="detail-label">納期目安:</span>
          <span class="detail-value">{{ service.deliveryTime }}</span>
        </div>
      </div>
      
      <div class="action-button">
        <a href="mailto:dahlia1209@gmail.com?subject=サービスについての問い合わせ:{{ service.title }}" class="contact-button">
          お問い合わせ
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.service-card {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background-color: white;
  height: 100%;
}

.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.image-container {
  height: 180px;
  overflow: hidden;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.service-card:hover .image-container img {
  transform: scale(1.05);
}

.service-content {
  padding: 24px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

h3 {
  margin: 0 0 16px 0;
  color: var(--color-heading);
  font-size: 1.4rem;
  font-weight: 600;
}

.description {
  margin-bottom: 20px;
  color: var(--color-text);
  line-height: 1.6;
}

.features-section {
  margin-bottom: 20px;
}

h4 {
  font-size: 1.1rem;
  margin-bottom: 10px;
  color: var(--color-heading);
  font-weight: 500;
}

ul {
  padding-left: 20px;
  margin: 0;
}

li {
  margin-bottom: 6px;
  position: relative;
}

.details-section {
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.detail-item {
  display: flex;
  margin-bottom: 8px;
}

.detail-label {
  font-weight: 500;
  min-width: 90px;
}

.action-button {
  margin-top: 20px;
  text-align: center;
}

.contact-button {
  display: inline-block;
  background-color: #41b883;
  color: white;
  padding: 10px 24px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.3s;
}

.contact-button:hover {
  background-color: #389f70;
}

/* @media (prefers-color-scheme: dark) {
  .service-card {
    background-color: var(--vt-c-black-soft);
  }
  
  .details-section {
    border-top-color: var(--vt-c-divider-dark-2);
  }
} */
</style>