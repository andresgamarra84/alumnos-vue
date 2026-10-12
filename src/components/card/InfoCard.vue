<template>
  <component
    :is="interactive ? 'button' : 'article'"
    :type="interactive ? 'button' : undefined"
    :disabled="interactive ? disabled : undefined"
    :aria-disabled="disabled || undefined"
    :class="['info-card', `info-card--${variant}`, {
      'info-card--interactive': interactive && !disabled,
      'info-card--selected': selected,
      'info-card--muted': muted,
      'info-card--disabled': disabled,
      'info-card--compact': compact,
    }]"
    @click="onClick"
  >
    <div v-if="$slots.media" class="info-card__media">
      <slot name="media" />
    </div>

    <div class="info-card__main">
      <header v-if="title || $slots.title || $slots.badges || badge" class="info-card__header">
        <div class="info-card__heading">
          <div class="info-card__title">
            <slot name="title">{{ title }}</slot>
          </div>
          <div v-if="subtitle || $slots.subtitle" class="info-card__subtitle">
            <slot name="subtitle">{{ subtitle }}</slot>
          </div>
        </div>
        <div v-if="badge || $slots.badges" class="info-card__badges">
          <span v-if="badge" :class="['info-badge', `info-badge--${badgeVariant}`]">{{ badge }}</span>
          <slot name="badges" />
        </div>
      </header>

      <div v-if="$slots.default" class="info-card__body">
        <slot />
      </div>

      <footer v-if="$slots.actions" class="info-card__actions">
        <slot name="actions" />
      </footer>
    </div>
  </component>
</template>

<script setup>
/**
 * Tarjeta genérica de información.
 *
 * Props de apariencia
 *  - variant:   primary | success | warning | danger | info | neutral (color del borde lateral)
 *  - muted:     atenúa la tarjeta (ej: elementos eliminados)
 *  - disabled:  no responde a clicks (ej: cupo completo)
 *  - selected:  resalta la tarjeta (ej: elemento elegido de una lista)
 *  - compact:   menos padding
 *  - interactive: renderiza un <button> y emite `select` al click
 *
 * Slots: media, title, subtitle, badges, default (cuerpo), actions
 * Piezas complementarias: InfoMeta, InfoChip, InfoStat, InfoCardGrid
 */
const props = defineProps({
  title: String,
  subtitle: String,
  badge: String,
  badgeVariant: { type: String, default: 'neutral' },
  variant: { type: String, default: 'primary' },
  interactive: Boolean,
  selected: Boolean,
  muted: Boolean,
  disabled: Boolean,
  compact: Boolean,
});
const emit = defineEmits(['select']);

const onClick = (e) => {
  if (!props.interactive || props.disabled) return;
  emit('select', e);
};
</script>

<style scoped>
.info-card {
  --card-accent: var(--color-acento);
  display: flex;
  gap: 16px;
  width: 100%;
  padding: 16px 18px;
  text-align: left;
  color: inherit;
  font: inherit;
  background: var(--color-fondo-secundario);
  border: 1px solid var(--color-borde);
  border-left: 4px solid var(--card-accent);
  border-radius: 10px;
  box-shadow: 0 2px 4px var(--sombra-suave);
  transition: box-shadow .2s ease, transform .2s ease, opacity .2s ease, border-color .2s ease;
}

.info-card--primary { --card-accent: var(--color-acento); }
.info-card--success { --card-accent: var(--color-exito, #2e9e6b); }
.info-card--warning { --card-accent: var(--color-aviso, #e0a030); }
.info-card--danger  { --card-accent: var(--bs-danger, #dc3545); }
.info-card--info    { --card-accent: var(--color-info, #17a2b8); }
.info-card--neutral { --card-accent: var(--color-texto-secundario); }

.info-card--compact { padding: 10px 14px; gap: 12px; }

.info-card--interactive { cursor: pointer; }
.info-card--interactive:hover {
  box-shadow: 0 6px 14px var(--sombra-hover);
  transform: translateY(-2px);
}
.info-card--interactive:focus-visible {
  outline: 2px solid var(--card-accent);
  outline-offset: 2px;
}

.info-card--selected {
  border-color: var(--card-accent);
  box-shadow: 0 0 0 2px var(--card-accent);
}

.info-card--muted { opacity: .55; }
.info-card--muted:hover { opacity: .9; }

.info-card--disabled {
  opacity: .5;
  cursor: not-allowed;
  filter: grayscale(.6);
}

.info-card__media { flex: 0 0 auto; display: flex; align-items: center; }
.info-card__main { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 10px; }

.info-card__header { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; }
.info-card__heading { min-width: 0; }
.info-card__title { font-size: 1.1rem; font-weight: 700; line-height: 1.25; color: var(--color-texto-principal); }
.info-card__subtitle { font-size: .9rem; color: var(--color-texto-secundario); margin-top: 2px; }
.info-card__badges { display: flex; flex-wrap: wrap; gap: 6px; justify-content: flex-end; flex: 0 0 auto; }

.info-card__body { display: flex; flex-direction: column; gap: 8px; }

.info-card__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 10px;
  border-top: 1px dashed var(--color-borde);
}

.info-badge {
  display: inline-block;
  padding: 2px 10px;
  font-size: .75rem;
  font-weight: 700;
  border-radius: 999px;
  white-space: nowrap;
  color: var(--color-texto-principal);
  background: var(--color-fondo-principal);
  border: 1px solid var(--color-borde);
}
.info-badge--primary { color: #fff; background: var(--color-acento); border-color: transparent; }
.info-badge--success { color: #fff; background: var(--color-exito, #2e9e6b); border-color: transparent; }
.info-badge--warning { color: #3b2a00; background: var(--color-aviso, #e0a030); border-color: transparent; }
.info-badge--danger  { color: #fff; background: var(--bs-danger, #dc3545); border-color: transparent; }
</style>
