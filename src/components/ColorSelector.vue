<template>
  <div class="color-selector w-full">
    <div class="relative">
        <div class="flex flex-wrap -mx-1">
            <button
                ref="toggleColorSelector"
                class="w-6 h-6 m-0.5 cursor-pointer border border-slate-300 flex items-center justify-center bg-gradient-to-br bg-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500 hover:ring-2 hover:ring-offset-1 hover:ring-primary-500"
                @click="toggleSelector"
                title="Abrir seletor de cores"
            >
                <iconify-icon icon="mdi:palette-outline" class="flex items-center justify-center h-6 w-6 text-base text-black"></iconify-icon>
            </button>
            <button
                ref="transparentColorButton"
                class="w-6 h-6 m-0.5 cursor-pointer border border-slate-300 flex items-center justify-center bg-gradient-to-br bg-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500 hover:ring-2 hover:ring-offset-1 hover:ring-primary-500"
                @click="setNullColor()"
                title="Transparente"
            >
                <iconify-icon icon="tabler:color-picker-off" class="flex items-center justify-center h-6 w-6 text-base text-black"></iconify-icon>
            </button>
            <button v-for="color in mainColors" :key="color" class="w-6 h-6 m-0.5 cursor-pointer border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500 hover:ring-2 hover:ring-offset-1 hover:ring-primary-500"
                :class="{
                    'ring-2 ring-offset-1 ring-primary-500': selectedColor === color
                }"
                :style="{ backgroundColor: color }"
                :title="color"
                
                @click="selectColor(color)"
            ></button>
        </div>
        <!-- Popup ao lado do painel no desktop; no bottom sheet mobile expande no fluxo
             (posicionamento absoluto seria cortado pelo overflow do sheet) -->
        <div
            v-show="showSelector"
            ref="colorSelectorPopup"
            class="p-4 bg-white z-10
                sm:absolute sm:top-1/2 sm:-translate-y-1/2 sm:right-56 sm:min-w-full sm:border sm:border-gray-300 sm:rounded sm:shadow-lg
                max-sm:static max-sm:mt-2 max-sm:w-full max-sm:border max-sm:border-gray-200 max-sm:rounded"
        >
            <div class="mb-4 flex gap-2">
                <div>
                    <input
                        type="text"
                        v-model="manualColor"
                        @input="updateFromManualInput"
                        @blur="validateManualColor"
                        placeholder="#FF5722"
                        class="w-full text-xs px-2 h-7 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div 
                    class="w-full h-7 rounded relative overflow-hidden border border-gray-200"
                    :style="{ backgroundColor: colorWithTransparency }"
                >
                    <div 
                    class="absolute inset-0 checkered-bg"
                    ></div>
                    <div 
                        class="absolute inset-0 rounded-lg"
                        :style="{ 
                            backgroundColor: colorWithTransparency,
                        }"
                    >
                    </div>
                </div>
            </div>

            <!-- White to Black Gradient -->
            <div class="mb-4">
                <div class="flex gap-1 mb-1">
                    <div
                    v-for="(grayColor, index) in grayScale"
                    :key="index"
                    class="h-6 w-6 block cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500 hover:ring-2 hover:ring-offset-1 hover:ring-primary-500"
                    :style="{ backgroundColor: grayColor }"
                    @click="selectColor(grayColor)"
                    ></div>
                </div>
                <div class="space-y-1">
                    <div
                        v-for="colorGroup in colorGroups"
                        :key="colorGroup.name"
                        class="grid grid-cols-9 gap-1"
                    >
                    <button
                        v-for="(color, index) in colorGroup.variations"
                        :key="index"
                        class="h-6 w-6 block cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500 hover:ring-2 hover:ring-offset-1 hover:ring-primary-500"
                        :style="{ backgroundColor: color }"
                        @click="selectColor(color)"
                        :title="`${colorGroup.name} - ${index + 1}`"
                    ></button>
                    </div>
                </div>
            </div>

            <!-- Opacity Slider -->
            <div class="mb-2">
                <label class="flex justify-between text-xs text-gray-600 mb-2">
                    <div>Opacidade:</div>
                    <div>{{ opacity }}%</div>
                </label>
                <div class="relative">
                    <div class="w-full h-6 rounded checkered-bg border border-gray-200"></div>
                    <div 
                    class="absolute top-0 h-6 rounded pointer-events-none border border-gray-200"
                    :style="{ 
                        width: `${opacity}%`,
                        backgroundColor: colorWithTransparency
                    }"
                    ></div>
                    <input
                        type="range"
                        v-model="opacity"
                        min="0"
                        max="100"
                        class="absolute top-0 w-full h-6 opacity-0 cursor-pointer"
                        @input="emitUpdate"
                    />
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Object],
    default: '#3B82F6'
  }
})

const emit = defineEmits(['update:modelValue', 'colorSelected'])

const toggleColorSelector = ref(null)
const transparentColorButton = ref(null)
const colorSelectorPopup = ref(null)

// State
const showSelector = ref(false)
const selectedColor = ref('#3B82F6')
const opacity = ref(100)
const manualColor = ref('#3B82F6')

const mainColors = ['#F44336', '#FB803C', '#4CAF50', '#FFFFFF', '#3F51B5','#000000']

// Gray scale from white to black
const grayScale = [
  '#FFFFFF', '#E5E5E5', '#CCCCCC', '#B3B3B3', 
'#999999', '#808080', '#666666', '#333333', '#000000'
]

// Main color groups with variations (lightest to darkest)
const colorGroups = [{
    "name": "Vermelho",
    "variations": ["#FFEBEE", "#FFCDD2", "#EF9A9A", "#E57373", "#EF5350", "#F44336", "#E53935", "#D32F2F", "#B71C1C"]
}, {
    "name": "Laranja",
    "variations": ["#FFF3E0", "#FFE0B2", "#FFCC80", "#FFB74D", "#FFA726", "#FF9800", "#FB8C00", "#F57C00", "#E65100"]
}, {
    "name": "Amarelo",
    "variations": ["#FFF9C4", "#FFF9C4", "#FFF59D", "#FFF176", "#FFEE58", "#FFEB3B", "#FDD835", "#FBC02D", "#eead05"]
}, {
    "name": "Verde Limão",
    "variations": ["#F9FBE7", "#F0F4C3", "#E6EE9C", "#DCE775", "#D4E157", "#CDDC39", "#C0CA33", "#AFB42B", "#9E9D24"]
}, {
    "name": "Verde",
    "variations": ["#E8F5E9", "#C8E6C9", "#A5D6A7", "#81C784", "#66BB6A", "#4CAF50", "#43A047", "#388E3C", "#2E7D32"]
}, {
    "name": "Ciano",
    "variations": ["#E0F7FA", "#B2EBF2", "#80DEEA", "#4DD0E1", "#26C6DA", "#00BCD4", "#00ACC1", "#0097A7", "#00838F"]
}, {
    "name": "Azul Claro",
    "variations": ["#E3F2FD", "#BBDEFB", "#90CAF9", "#64B5F6", "#42A5F5", "#2196F3", "#1E88E5", "#1976D2", "#1565C0"]
}, {
    "name": "Índigo",
    "variations": ["#E8EAF6", "#C5CAE9", "#9FA8DA", "#7986CB", "#5C6BC0", "#3F51B5", "#3949AB", "#303F9F", "#283593"]
}, {
    "name": "Violeta",
    "variations": ["#F3E5F5", "#E1BEE7", "#CE93D8", "#BA68C8", "#AB47BC", "#9C27B0", "#8E24AA", "#7B1FA2", "#6A1B9A"]
}, {
    "name": "Magenta",
    "variations": ["#FCE4EC", "#F8BBD0", "#F48FB1", "#F06292", "#EC407A", "#E91E63", "#D81B60", "#C2185B", "#AD1457"]
}]

const colorWithTransparency = computed(() => {
  // Convert opacity (0-100) to alpha (0-255) then to hex
  const alpha = Math.round((opacity.value / 100) * 255)
  const alphaHex = alpha.toString(16).padStart(2, '0').toUpperCase()
  return selectedColor.value + alphaHex
})

// Color validation
function isValidHexColor(color) {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{8})$/.test(color)
}

function normalizeHexColor(color) {
  if (!color.startsWith('#')) {
    color = '#' + color
  }
  if (color.length === 4) {
    // Convert #RGB to #RRGGBB
    color = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3]
  }
  // If it has alpha channel, extract it
  if (color.length === 9) {
    const alphaHex = color.substring(7, 9)
    const alphaValue = parseInt(alphaHex, 16)
    opacity.value = Math.round((alphaValue / 255) * 100)
    color = color.substring(0, 7) // Remove alpha from the base color
  }
  return color.toUpperCase()
}

// Event handlers
function selectColor(color) {
  selectedColor.value = color
  manualColor.value = color
  emitUpdate()
}

function updateFromManualInput() {
  const color = manualColor.value.trim()
  if (isValidHexColor(color)) {
    selectedColor.value = normalizeHexColor(color)
    emitUpdate()
  }
}

function validateManualColor() {
  const color = manualColor.value.trim()
  if (color && !isValidHexColor(color)) {
    // Reset to current selected color if invalid
    manualColor.value = selectedColor.value
  } else if (color) {
    manualColor.value = normalizeHexColor(color)
    selectedColor.value = manualColor.value
    emitUpdate()
  }
}

function setNullColor() {
  const currOpacity = opacity.value
  opacity.value = 0
  emitUpdate()

  setTimeout(() => {
    opacity.value = currOpacity
  }, 200)
}

// Click away functionality usando composedPath para Web Components
function handleClickOutside(event) {
  // Se o popup não está aberto, não faz nada
  if (!showSelector.value) return
  
  // Usar composedPath para obter todos os elementos no caminho do evento
  const path = event.composedPath()
  
  // Verificar se algum elemento no path é um dos botões ou o popup
  const isOwnClick = path.some(element =>
    element === toggleColorSelector.value ||
    element === transparentColorButton.value ||
    element === colorSelectorPopup.value
  )

  // Se clicou nos controles do próprio seletor, não fecha
  if (isOwnClick) {
    return
  }
  
  // Se chegou aqui, clicou fora - fecha o popup
  showSelector.value = false
}

// Função para alternar o seletor
function toggleSelector() {
  showSelector.value = !showSelector.value
}

// Lifecycle hooks
onMounted(() => {
  // Adiciona listener no documento com capture para pegar eventos antes que sejam processados
  document.addEventListener('mousedown', handleClickOutside, true)
})

onUnmounted(() => {
  // Remove listener
  document.removeEventListener('mousedown', handleClickOutside, true)
})

function emitUpdate() {
  // Convert opacity (0-100) to alpha (0-255) then to hex
  const alpha = Math.round((opacity.value / 100) * 255)
  const alphaHex = alpha.toString(16).padStart(2, '0').toUpperCase()
  
  // Create final color with alpha channel
  const finalColor = selectedColor.value + alphaHex

  // Emit the color with alpha channel
  emit('update:modelValue', finalColor)
  emit('colorSelected', {
    color: selectedColor.value,
    opacity: opacity.value,
    finalColor: finalColor
  })
}

// Initialize from prop
function initializeFromModelValue() {
  if (typeof props.modelValue === 'string') {
    // Check if color has alpha channel (8 characters: #RRGGBBAA)
    if (props.modelValue.length === 9 && props.modelValue.startsWith('#')) {
      selectedColor.value = props.modelValue.substring(0, 7) // Remove alpha
      const alphaHex = props.modelValue.substring(7, 9)
      const alphaValue = parseInt(alphaHex, 16)
      opacity.value = Math.round((alphaValue / 255) * 100)
    } else {
      selectedColor.value = props.modelValue
      opacity.value = 100 // Default to fully opaque
    }
    manualColor.value = selectedColor.value
  } else if (typeof props.modelValue === 'object' && props.modelValue) {
    selectedColor.value = props.modelValue.color || '#3B82F6'
    opacity.value = props.modelValue.opacity || 100
    manualColor.value = selectedColor.value
  }
}

// Watchers
watch(() => props.modelValue, () => {
  initializeFromModelValue()
}, { immediate: true, deep: true })

// Initialize
initializeFromModelValue()
</script>

<style>
.checkered-bg {
  background-image: 
    linear-gradient(45deg, #f0f0f0 25%, transparent 25%), 
    linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), 
    linear-gradient(45deg, transparent 75%, #f0f0f0 75%), 
    linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 4px, 4px -4px, -4px 0px;
}
</style>