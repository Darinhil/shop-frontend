<template>
  <div :class="containerClasses">
    <div class="relative">
      <div class="w-12 h-12 border-4 border-slate-200 rounded-full"></div>
      <div class="w-12 h-12 border-4 border-primary-600 rounded-full absolute top-0 left-0 animate-spin" :style="{ borderTopColor: 'transparent' }"></div>
    </div>
    <p v-if="text" class="mt-4 text-slate-600 font-medium">{{ text }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  text: {
    type: String,
    default: ''
  },
  fullScreen: {
    type: Boolean,
    default: false
  }
})

const containerClasses = computed(() => {
  const baseClasses = 'flex flex-col items-center justify-center'
  
  const sizeClasses = {
    small: 'scale-75',
    medium: 'scale-100',
    large: 'scale-125'
  }
  
  const screenClasses = props.fullScreen ? 'fixed inset-0 bg-white/80 backdrop-blur-sm z-50' : 'p-8'
  
  return [baseClasses, sizeClasses[props.size], screenClasses].join(' ')
})
</script>
