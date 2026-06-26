<template>
  <div class="input-group">
    <label v-if="label" :for="id" class="block text-sm font-semibold text-slate-700 mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="relative">
      <span v-if="prefix" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{{ prefix }}</span>
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="inputClasses"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />
      <span v-if="suffix" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">{{ suffix }}</span>
      <slot name="suffix"></slot>
    </div>
    <p v-if="error" class="mt-1 text-sm text-red-500">{{ error }}</p>
    <p v-if="hint && !error" class="mt-1 text-sm text-slate-500">{{ hint }}</p>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  hint: {
    type: String,
    default: ''
  },
  prefix: {
    type: String,
    default: ''
  },
  suffix: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  }
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus'])

const isFocused = ref(false)

const id = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`)

const inputClasses = computed(() => {
  const baseClasses = 'w-full border rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const sizeClasses = {
    small: 'py-2 px-3 text-sm',
    medium: 'py-3 px-4 text-base',
    large: 'py-4 px-5 text-lg'
  }
  
  const stateClasses = props.error
    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
    : isFocused.value
    ? 'border-primary-500 focus:ring-primary-500 focus:border-primary-500'
    : 'border-slate-200 focus:ring-primary-500 focus:border-primary-500'
  
  const disabledClasses = props.disabled ? 'bg-slate-100 cursor-not-allowed opacity-60' : 'bg-white'
  
  const paddingClasses = props.prefix ? 'pl-10' : props.suffix ? 'pr-10' : ''
  
  return [baseClasses, sizeClasses[props.size], stateClasses, disabledClasses, paddingClasses].join(' ')
})

const handleInput = (event) => {
  emit('update:modelValue', event.target.value)
}

const handleBlur = () => {
  isFocused.value = false
  emit('blur')
}

const handleFocus = () => {
  isFocused.value = true
  emit('focus')
}
</script>
