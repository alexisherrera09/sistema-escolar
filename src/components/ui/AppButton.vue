<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[
      'px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
      variantClasses,
      disabled && 'opacity-50 cursor-not-allowed',
      sizeClasses,
    ]"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
});

defineEmits<{
  click: [event: MouseEvent];
}>();

const variantClasses = {
  primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500',
  secondary: 'bg-secondary-500 text-white hover:bg-secondary-600 focus:ring-secondary-500',
  danger: 'bg-danger text-white hover:bg-red-600 focus:ring-red-500',
  outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50 focus:ring-primary-500',
  ghost: 'text-primary-500 hover:bg-primary-50 focus:ring-primary-500',
};

const sizeClasses = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-base px-4 py-2',
  lg: 'text-lg px-6 py-3',
};
</script>
