import { ref } from 'vue'

const STORAGE_KEY = 'CJJC_DARK_MODE'

const readStored = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

const apply = (dark) => {
  document.body.classList.toggle('dark-mode', dark)
  try {
    localStorage.setItem(STORAGE_KEY, dark ? '1' : '0')
  } catch {
    // Almacenamiento no disponible (modo privado, etc.): el modo oscuro
    // sigue funcionando, solo que no se recuerda entre sesiones.
  }
}

const isDark = ref(document.body.classList.contains('dark-mode') || readStored())
apply(isDark.value)

export function useDarkMode() {
  const toggleDarkMode = () => {
    isDark.value = !isDark.value
    apply(isDark.value)
  }

  return {
    isDark,
    toggleDarkMode,
  }
}
