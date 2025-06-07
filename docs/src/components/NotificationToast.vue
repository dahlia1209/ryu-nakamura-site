<script setup lang="ts">
import { onUnmounted ,ref} from 'vue';

const props = defineProps<{
    type: 'success' | 'error',
    message: string,
}>();

const isClosed=ref(false)



const handleClose = () => {
  isClosed.value=true
};

onUnmounted(()=>{
    isClosed.value=true
})
</script>

<template>
    <div class="notification-toast" v-if="!isClosed">
        <div :class="[{'success-message': props.type == 'success'}, {'error-message': props.type == 'error'}]">
            <!-- Success Icon -->
            <svg v-if="props.type === 'success'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M8 12l2 2 4-4"></path>
            </svg>
            
            <!-- Error Icon -->
            <svg v-else-if="props.type === 'error'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            
            <span class="message-text">{{ message }}</span>
            
            <!-- Close Button -->
            <button @click="handleClose" class="close-button" type="button" aria-label="通知を閉じる">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
    </div>
</template>

<style scoped>
.notification-toast {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    padding: 0;
}

.success-message,
.error-message {
    display: flex;
    align-items: center;
    gap: 12px;
    text-align: left;
    padding: 16px 20px;
    border-radius: 8px;
    animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    min-width: 300px;
    max-width: 500px;
    position: relative;
}

.success-message {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
}

.error-message {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
}

.success-message svg:first-child {
    color: #28a745;
    flex-shrink: 0;
}

.error-message svg:first-child {
    color: #dc3545;
    flex-shrink: 0;
}

.message-text {
    flex-grow: 1;
    font-weight: 500;
    line-height: 1.4;
}

.close-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    opacity: 0.7;
    flex-shrink: 0;
}

.close-button:hover {
    opacity: 1;
    background-color: rgba(0, 0, 0, 0.1);
}

@keyframes slideIn {
    from {
        transform: translateX(-50%) translateY(-20px);
        opacity: 0;
        scale: 0.95;
    }
    to {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
        scale: 1;
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
    .notification-toast {
        top: 20px;
        left: 15px;
        right: 15px;
        transform: none;
    }
    
    .success-message,
    .error-message {
        min-width: auto;
        max-width: none;
        padding: 14px 16px;
        gap: 10px;
    }
    
    .message-text {
        font-size: 0.9rem;
    }
}
</style>