<template>
  <div :class="['card', paddingClasses]">
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

withDefaults(defineProps<Props>(), {
  padding: 'md',
});

const paddingClasses = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};
</script>
