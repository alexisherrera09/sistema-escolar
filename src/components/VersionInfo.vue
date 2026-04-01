<template>
  <div :style="containerStyle" class="version-info-container">
    <img
      src="/ameinnovate-logo.png"
      alt="AME Innovate"
      class="ame-brand-logo"
      width="160"
      height="28"
      loading="lazy"
    />
    <span :style="versionBadgeStyle">
      <span class="hidden sm:inline">Versión: </span>{{ version }}
    </span>
    <span :style="environmentBadgeStyle">
      <span class="hidden sm:inline">Ambiente: </span>{{ environment }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getAppVersion, getEnvironment } from '../utils/env';

interface Props {
  style?: Record<string, any>;
}

const props = withDefaults(defineProps<Props>(), {
  style: () => ({}),
});

const version = computed(() => getAppVersion());
const environment = computed(() => getEnvironment());

const containerStyle = computed(() => ({
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
  fontSize: '10px',
  fontWeight: '600',
  textTransform: 'uppercase',
  fontFamily: "'Encode Sans', sans-serif",
  flexWrap: 'wrap',
  ...props.style,
}));

const badgeStyle = {
  padding: '4px 8px',
  borderRadius: '50px',
  fontSize: '10px',
  fontWeight: '600',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
};

const versionBadgeStyle = computed(() => ({
  ...badgeStyle,
  backgroundColor: 'var(--secondary-color, #6B7280)',
  color: 'white',
}));

const environmentBadgeStyle = computed(() => {
  const baseStyle = { ...badgeStyle };
  switch (environment.value) {
    case 'LOCAL':
      return {
        ...baseStyle,
        backgroundColor: '#4CAF50',
        color: 'white',
      };
    case 'QA':
      return {
        ...baseStyle,
        backgroundColor: '#FF9800',
        color: 'white',
      };
    case 'PRODUCTION':
      return {
        ...baseStyle,
        backgroundColor: 'var(--accent-color, #F10036)',
        color: 'white',
      };
    default:
      return {
        ...baseStyle,
        backgroundColor: '#757575',
        color: 'white',
      };
  }
});
</script>

<style scoped>
.ame-brand-logo {
  height: 28px;
  width: auto;
  max-width: 160px;
  object-fit: contain;
  display: block;
  flex-shrink: 0;
}

.version-info-container {
  font-family: 'Encode Sans', sans-serif;
}
</style>
