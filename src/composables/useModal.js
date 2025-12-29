import { ref } from 'vue'

const isVisible = ref(false)
const title = ref('')
const message = ref('')
const type = ref(0) // 0 = info, 1 = confirm, 2 = input
const inputValue = ref('')
let resolver = null

export function useModal() {
  const show = ({ title: t, message: m, type: ty = 0 }) => {
    title.value = t
    message.value = m
    type.value = ty
    inputValue.value = ''
    isVisible.value = true

    return new Promise(resolve => {
      resolver = resolve
    })
  }

  const resolve = result => {
    isVisible.value = false

    if (resolver) {
      resolver(
        type.value === 2
          ? { ok: result, value: inputValue.value }
          : result
      )
      resolver = null
    }
  }

  return {
    isVisible,
    title,
    message,
    type,
    inputValue,
    show,
    resolve
  }
}
