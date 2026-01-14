<template>
    <div class="relative flex flex-col items-center justify-center h-full overflow-hidden">
        <div class="w-full absolute z-20 top-2 left-1/2 -translate-x-1/2 flex items-center justify-between px-2">
            <div class="">
            </div>
            <div class="grow flex items-center justify-center gap-4">
                <div class="flex items-center justify-center gap-2">
                    <div class="flex items-center gap-3 p-1.5 rounded-md shadow-xl bg-white">
                        <div class="flex items-center justify-center gap-2">
                            <div class="relative group">
                                <input type="text" v-model="drawingAreaWidth" placeholder="Largura"
                                class="w-14 h-8 text-sm text-center border border-slate-200 rounded p-1 bg-slate-100">
                                <Tooltip
                                    position="bottom"
                                    class="top-full left-1/2 -translate-x-1/2"
                                >
                                    <span class="text-xs">Largura</span>
                                </Tooltip>
                            </div>
                            <span>×</span>
                            <div class="relative group">
                                <input type="text" v-model="drawingAreaHeight" placeholder="Altura"
                                    class="w-14 h-8 text-sm text-center border border-slate-200 rounded p-1 bg-slate-100">
                                <Tooltip
                                    position="bottom"
                                    class="top-full left-1/2 -translate-x-1/2"
                                >
                                    <span class="text-xs">Altura</span>
                                </Tooltip>
                            </div>
                        </div>
                        <div class="h-6 border-r border-slate-300"></div>
                        <div class="flex items-center justify-center gap-2">
                            <div class="group relative flex items-center">
                                <button
                                    @click="zoomOut()"
                                    class="h-8 w-8 flex items-center justify-center bg-slate-100 hover:bg-primary-500 hover:text-white text-black rounded-l transition-colors">
                                    <iconify-icon icon="material-symbols:remove" class="inline-block"></iconify-icon>
                                </button>
                                <span
                                    class="flex items-center border-y border-slate-200 justify-center text-sm bg-slate-100 h-8 font-medium min-w-[50px] text-center">{{
                                    Math.round(zoomLevel * 100) }}%</span>
                                <button @click="zoomIn()"
                                    class="h-8 w-8 flex items-center justify-center bg-slate-100 hover:bg-primary-500 hover:text-white text-black rounded-r transition-colors">
                                    <iconify-icon icon="material-symbols:add" class="inline-block"></iconify-icon>
                                </button>

                                <Tooltip
                                    position="bottom"
                                    class="top-full left-1/2 -translate-x-1/2"
                                >
                                    <span class="text-xs">Zoom</span>
                                </Tooltip>
                            </div>
                            <div class="group relative">
                                <button @click="fitToCanvas()"
                                    class="h-8 w-8 flex items-center justify-center bg-slate-100 hover:bg-primary-500 hover:text-white text-black rounded transition-colors">
                                    <iconify-icon icon="carbon:fit-to-screen" class="inline-block"></iconify-icon>
                                </button>
                                <Tooltip
                                    position="bottom"
                                    class="top-full left-1/2 -translate-x-1/2"
                                >
                                    <span class="text-xs">Resetar zoom</span>
                                </Tooltip>
                            </div>
                        </div>
                        <!-- botão comparar ocultado -->
                        <div class="h-6 border-r border-slate-300"></div>
                        <div class="flex items-center">
                            <div class="group relative">
                                <button @click="handleDisplayModeClick('ltr')"
                                    class="h-8 w-8 text-sm flex items-center justify-center bg-slate-100 hover:bg-primary-500 hover:text-white text-black rounded-l transition-colors"
                                    :class="{ 'bg-primary-500! text-white': displayMode === 'ltr' }">
                                    <iconify-icon icon="streamline:interface-layout-two-columns-colums-layout-layouts-two"
                                        class="inline-block"></iconify-icon>
                                </button>
                                <Tooltip
                                    position="bottom"
                                    class="top-full left-1/2 -translate-x-1/2"
                                >
                                    <span class="text-xs">Dividir verticalmente</span>
                                </Tooltip>
                            </div>
                            <div class="group relative">
                                <button @click="handleDisplayModeClick('ttb')"
                                    class="h-8 w-8 text-sm flex items-center justify-center bg-slate-100 hover:bg-primary-500 hover:text-white text-black rounded-r transition-colors"
                                    :class="{ 'bg-primary-500! text-white': displayMode === 'ttb' }">
                                    <iconify-icon icon="streamline:interface-layout-two-columns-colums-layout-layouts-two"
                                        class="rotate-90 inline-block"></iconify-icon>
                                </button>
                                <Tooltip
                                    position="bottom"
                                    class="top-full left-1/2 -translate-x-1/2"
                                >
                                    <span class="text-xs">Dividir horizontalmente</span>
                                </Tooltip>
                            </div>
                        </div>
                        <div class="h-6 border-r border-slate-300"></div>
                        <div class="flex items-center gap-2">
                            <div class="group relative">
                                <button @click="setActiveTool('select')"
                                    class="h-8 w-8 relative pb-1.5 flex flex-col items-center justify-center bg-slate-100 hover:bg-primary-500 hover:text-white text-black rounded transition-colors"
                                    :class="{ 'bg-primary-500! text-white': activeTool === 'select' || activeTool === null }">
                                    <iconify-icon icon="iconamoon:cursor-fill" class="text-sm inline-block"></iconify-icon>
                                    <span class="text-xs absolute bottom-0.5 right-1">
                                        <small>1</small>
                                    </span>
                                </button>
                                <Tooltip position="bottom" class="top-full left-1/2 -translate-x-1/2">
                                    <span class="text-xs whitespace-nowrap">Selecionar (1)</span>
                                </Tooltip>
                            </div>
                            <div class="group relative">
                                <button @click="setActiveTool('draw')"
                                    class="h-8 w-8 relative pb-1.5 flex flex-col items-center justify-center bg-slate-100 hover:bg-primary-500 hover:text-white text-black rounded transition-colors"
                                    :class="{ 'bg-primary-500! text-white': activeTool === 'draw' }">
                                    <iconify-icon icon="streamline:pen-draw" class="text-sm inline-block"></iconify-icon>
                                    <span class="text-xs absolute bottom-0.5 right-1">
                                        <small>2</small>
                                    </span>
                                </button>
                                <Tooltip position="bottom" class="top-full left-1/2 -translate-x-1/2">
                                    <span class="text-xs whitespace-nowrap">Desenhar (2)</span>
                                </Tooltip>
                            </div>
                            <div class="group relative">
                                <button @click="setActiveTool('rectangle')"
                                    class="h-8 w-8 relative pb-1.5 flex flex-col items-center justify-center bg-slate-100 hover:bg-primary-500 hover:text-white text-black rounded transition-colors"
                                    :class="{ 'bg-primary-500! text-white': activeTool === 'rectangle' }">
                                    <iconify-icon icon="ic:outline-square" class="text-sm inline-block"></iconify-icon>
                                    <span class="text-xs absolute bottom-0.5 right-1">
                                        <small>3</small>
                                    </span>
                                </button>
                                <Tooltip position="bottom" class="top-full left-1/2 -translate-x-1/2">
                                    <span class="text-xs whitespace-nowrap">Retângulo (3)</span>
                                </Tooltip>
                            </div>
                            <div class="group relative">
                                <button @click="setActiveTool('circle')"
                                    class="h-8 w-8 relative pb-1.5 flex flex-col items-center justify-center bg-slate-100 hover:bg-primary-500 hover:text-white text-black rounded transition-colors"
                                    :class="{ 'bg-primary-500! text-white': activeTool === 'circle' }">
                                    <iconify-icon icon="mdi:checkbox-blank-circle-outline"
                                        class="text-sm inline-block"></iconify-icon>
                                    <span class="text-xs absolute bottom-0.5 right-1">
                                        <small>4</small>
                                    </span>
                                </button>
                                <Tooltip position="bottom" class="top-full left-1/2 -translate-x-1/2">
                                    <span class="text-xs whitespace-nowrap">Círculo (4)</span>
                                </Tooltip>
                            </div>
                            <div class="group relative">
                                <button @click="setActiveTool('triangle')"
                                    class="h-8 w-8 relative pb-1.5 flex flex-col items-center justify-center bg-slate-100 hover:bg-primary-500 hover:text-white text-black rounded transition-colors"
                                    :class="{ 'bg-primary-500! text-white': activeTool === 'triangle' }">
                                    <iconify-icon icon="mdi:triangle-outline" class="text-sm inline-block"></iconify-icon>
                                    <span class="text-xs absolute bottom-0.5 right-1">
                                        <small>5</small>
                                    </span>
                                </button>
                                <Tooltip position="bottom" class="top-full left-1/2 -translate-x-1/2">
                                    <span class="text-xs whitespace-nowrap">Triângulo (5)</span>
                                </Tooltip>
                            </div>
                            <div class="group relative">
                                <button @click="setActiveTool('line')"
                                    class="h-8 w-8 relative pb-1.5 flex flex-col items-center justify-center bg-slate-100 hover:bg-primary-500 hover:text-white text-black rounded transition-colors"
                                    :class="{ 'bg-primary-500! text-white': activeTool === 'line' }">
                                    <iconify-icon icon="garden:dash-stroke-16"
                                        class="inline-block -rotate-45"></iconify-icon>
                                    <span class="text-sm absolute bottom-0.5 right-1">
                                        <small>6</small>
                                    </span>
                                </button>
                                <Tooltip position="bottom" class="top-full left-1/2 -translate-x-1/2">
                                    <span class="text-xs whitespace-nowrap">Linha (6)</span>
                                </Tooltip>
                            </div>
                            <div class="group relative">
                                <button @click="setActiveTool('arrow')"
                                    class="h-8 w-8 relative pb-1.5 flex flex-col items-center justify-center bg-slate-100 hover:bg-primary-500 hover:text-white text-black rounded transition-colors"
                                    :class="{ 'bg-primary-500! text-white': activeTool === 'arrow' }">
                                    <iconify-icon icon="material-symbols-light:line-start-arrow-notch-rounded"
                                        class="text-lg inline-block -rotate-45"></iconify-icon>
                                    <span class="text-sm absolute bottom-0.5 right-1">
                                        <small>7</small>
                                    </span>
                                </button>
                                <Tooltip position="bottom" class="top-full left-1/2 -translate-x-1/2">
                                    <span class="text-xs whitespace-nowrap">Seta (7)</span>
                                </Tooltip>
                            </div>
                            <div class="group relative">
                                <button @click="setActiveTool('text')"
                                    class="h-8 w-8 relative pb-1.5 flex flex-col items-center justify-center bg-slate-100 hover:bg-primary-500 hover:text-white text-black rounded transition-colors"
                                    :class="{ 'bg-primary-500! text-white': activeTool === 'text' }">
                                    <iconify-icon icon="iconoir:text" class="text-base inline-block"></iconify-icon>
                                    <span class="text-sm absolute bottom-0.5 right-1">
                                        <small>8</small>
                                    </span>
                                </button>
                                <Tooltip position="bottom" class="top-full left-1/2 -translate-x-1/2">
                                    <span class="text-xs whitespace-nowrap">Texto (8)</span>
                                </Tooltip>
                            </div>
                            <!-- botão borracha ocultado -->
                        </div>
                        <div class="h-6 border-r border-slate-300"></div>
                        
                        <div class="group relative">
                            <button @click="toggleWatermark()"
                                class="h-8 w-8 flex flex-col items-center justify-center bg-slate-100 hover:bg-slate-200 text-black rounded transition-colors"
                                :class="{ 'bg-primary-500! text-white': showWatermark }">
                                <iconify-icon icon="mdi-light:bookmark" class="text-lg inline-block"></iconify-icon>
                            </button>
                            <Tooltip position="bottom" class="top-full left-1/2 -translate-x-1/2">
                                <span class="text-xs whitespace-nowrap">Marca d'água</span>
                            </Tooltip>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="ready"
            class="absolute cursor-initial top-1/2 -translate-y-1/2 w-56 bg-white z-10 border border-slate-200 rounded p-4 shadow-lg text-xs transition-all duration-500 opacity-0 pointer-events-none -right-16 max-h-[80%]"
            :class="{
                'opacity-100! pointer-events-auto! right-2!':
                    (
                        (
                            activeObject &&
                            activeTool === 'select' &&
                            activeObject?.id !== 'drawingArea' &&
                            activeObject?.class !== 'resize-handle'
                        )
                    ) || (
                        ['draw', 'text', 'rectangle', 'circle', 'line', 'arrow'].includes(activeTool)
                    )
            }">
            <div class="flex flex-col gap-2 border-b border-slate-200 pb-4 last:border-b-0 last:mb-0 last:pb-0">
                <div
                    v-if="fabricCanvas.getActiveObject()?.type == 'image'"
                >
                    <button
                        class="h-8 w-8 flex items-center justify-center border border-slate-200 rounded text-xs transition-colors hover:bg-slate-200"
                        @click="toggleCropper()">
                        <iconify-icon icon="mdi:crop" class="text-base inline-block"></iconify-icon>
                    </button>
                </div>
                <div
                    v-if="activeObject && activeObject.id !== 'firstImage' && activeObject.id !== 'secondImage'"
                    class="flex justify-end gap-2"
                >
                    <button
                        class="h-8 w-8 flex items-center justify-center border border-slate-200 rounded text-xs transition-colors hover:bg-slate-200"
                        @click="duplicateActiveObject()">
                        <iconify-icon icon="cil:clone" class="text-sm inline-block"></iconify-icon>
                    </button>
                    <button
                        class="h-8 w-8 flex items-center justify-center border border-slate-200 rounded text-xs transition-colors hover:bg-slate-200"
                        @click="deleteActiveObject()">
                        <iconify-icon icon="ic:baseline-delete-outline"
                            class="text-base inline-block"></iconify-icon>
                    </button>
                </div>
            </div>
            <template v-if="
                (activeObject && activeObject.hasOwnProperty('opacity')) || activeTool !== 'select'
            ">
                <div v-if="activeObject"
                    class="flex flex-col gap-2 border-b border-slate-200 pb-2 mb-2 last:border-b-0 last:mb-0 last:pb-0">
                    <div class="flex items-center justify-between text-xs">
                        <div>Escala:</div>
                        <div>
                            <!-- uniform scale -->
                            <button
                                class="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-200 cursor-pointer"
                                @click="objectUniformScale = !objectUniformScale">
                                <!-- lock outline icon -->
                                <iconify-icon
                                    :icon="objectUniformScale ? 'material-symbols:lock-outline' : 'material-symbols:lock-open-right-outline'"
                                    class="w-5 h-5 inline-block"></iconify-icon>
                            </button>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="flex items-center">
                            <div class="h-8 w-8 flex items-center justify-center">X:</div>
                            <div class="w-full flex items-center justify-end">
                                <input type="number" :value="objectScaleX" min="0.1" max="2" step="0.05"
                                    class="w-16 bg-slate-100 rounded h-6 text-center border border-slate-200 p-1"
                                    @input="objectScaleChangedInput($event, 'x')" />
                            </div>
                        </div>
                        <div class="flex items-center">
                            <div class="h-8 w-8 flex items-center justify-center">Y:</div>
                            <div class="w-full flex items-center justify-end">
                                <input type="number" :value="objectScaleY" min="0.1" max="2" step="0.05"
                                    class="w-16 bg-slate-100 rounded h-6 text-center border border-slate-200 p-1"
                                    @input="objectScaleChangedInput($event, 'y')" />
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    class="flex flex-col gap-2 border-b border-slate-200 pb-2 mb-2 last:border-b-0 last:mb-0 last:pb-0">
                    <div class="flex items-center justify-between text-xs">
                        <div>Opacidade:</div>
                        <div>{{ objectOpacity * 100 }}%</div>
                    </div>
                    <div class="">
                        <input type="range"
                            class="w-full h-1 mb-6 bg-slate-200 rounded-lg appearance-none cursor-pointer range-sm  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-[12px] [&::-webkit-slider-thumb]:w-[12px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-500"
                            min="0" max="1" step="0.1" v-model="objectOpacity">
                    </div>
                </div>
            </template>
            <template v-if="
                ['draw', 'line', 'arrow', 'rectangle', 'circle', 'triangle'].includes(activeTool) ||
                ['path', 'polyline', 'arrow'].includes(activeObject?.type) ||
                (
                    activeObject?.hasOwnProperty('strokeWidth') &&
                    activeObject?.id !== 'firstImage' &&
                    activeObject?.id !== 'secondImage'
                )
            ">
                <div
                    class="flex flex-col gap-2 border-b border-slate-200 pb-2 mb-2 last:border-b-0 last:mb-0 last:pb-0">
                    <div class="flex items-center justify-between text-xs">
                        <div>
                            <template v-if="
                                activeTool === 'draw' ||
                                activeTool === 'line' ||
                                activeTool === 'arrow' ||
                                activeObject?.type === 'path' ||
                                activeObject?.type === 'polyline'
                            ">
                                Espessura:
                            </template>
                            <template v-else>
                                Borda:
                            </template>
                        </div>
                        <div>{{ objectStrokeWidthMultiplier }}</div>
                    </div>
                    <div class="flex flex-col gap-2">
                        <div class="">
                            <input type="range"
                                class="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer range-sm  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-[12px] [&::-webkit-slider-thumb]:w-[12px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-500"
                                min="0" max="10" step="2" v-model="objectStrokeWidthMultiplier">
                        </div>
                        <div class="flex items-center justify-between text-xs">
                            <div v-for="value in [0, 2, 4, 6, 8, 10]" :key="value"
                                class="flex gap-4 items-center justify-center text-xs" :class="['w-[10px]']">
                                <button
                                    class="rounded-full aspect-square bg-slate-700 hover:outline transition-colors cursor-pointer focus:outline-2 outline-offset-2 outline-primary-500"
                                    :style="{
                                        width: `${value}px`,
                                        height: `${value}px`
                                    }" @click="objectStrokeWidthMultiplier = value"></button>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    class="flex flex-col gap-2 border-b border-slate-200 pb-2 mb-2 last:border-b-0 last:mb-0 last:pb-0">
                    <div class="flex items-center justify-between text-xs">
                        <div>Cor
                            <template v-if="
                                activeTool === 'line' ||
                                activeTool === 'draw' ||
                                activeTool === 'arrow' ||
                                activeObject?.type === 'path' ||
                                activeObject?.type === 'polyline'
                            ">da linha</template>
                            <template v-else>da borda</template>
                            :
                        </div>
                        <div>{{ lineStrokeColor }}</div>
                    </div>
                    <div class="flex flex-col gap-2">
                        <ColorSelector
                            v-model="lineStrokeColor"
                            @close="closeColorPicker"
                        />
                    </div>
                </div>
            </template>
            <template v-if="
                activeTool === 'rectangle' ||
                activeTool === 'circle' ||
                activeObject?.type === 'rect' ||
                activeObject?.type === 'circle' ||
                activeObject?.type === 'triangle'
            ">
                <div
                    class="flex flex-col gap-2 border-b border-slate-200 pb-2 mb-2 last:border-b-0 last:mb-0 last:pb-0">
                    <div class="flex items-center justify-between text-xs">
                        <div>Preenchimento:</div>
                        <div>{{ fillColor }}</div>
                    </div>
                    <div class="flex flex-col gap-2">
                        <ColorSelector v-model="fillColor" @close="closeColorPicker" />
                    </div>
                </div>
            </template>

            <template v-if="
                activeTool === 'text' ||
                (
                    activeObject && activeObject.type === 'i-text' && (
                        activeTool === null || activeTool === 'select'
                    )
                )
            ">
                <div
                    class="flex flex-col gap-2 border-b border-slate-200 pb-2 mb-2 last:border-b-0 last:mb-0 last:pb-0">
                    <div class="flex items-center justify-between text-xs">
                        <div>Tamanho da Fonte:</div>
                        <div>{{ textFontSize }}px</div>
                    </div>
                    <div class="flex flex-col gap-2">
                        <input type="range"
                            class="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer range-sm  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-[12px] [&::-webkit-slider-thumb]:w-[12px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-500"
                            min="8" max="120" step="2" v-model="textFontSize">
                    </div>
                </div>
                <div
                    class="flex flex-col gap-2 border-b border-slate-200 pb-2 mb-2 last:border-b-0 last:mb-0 last:pb-0">
                    <div class="flex items-center justify-between text-xs">
                        <div>Cor do Texto:</div>
                        <div>{{ textColor }}</div>
                    </div>
                    <div class="flex flex-col gap-2">
                        <ColorSelector v-model="textColor" @close="closeColorPicker" />
                    </div>
                </div>

                <div
                    class="flex flex-col gap-2 border-b border-slate-200 pb-2 mb-2 last:border-b-0 last:mb-0 last:pb-0">
                    <div class="flex items-center justify-between text-xs">
                        <div>Família da Fonte:</div>
                    </div>
                    <select v-model="textFontFamily"
                        class="w-full p-2 text-xs border border-slate-200 rounded bg-slate-100">
                        <option value="Arial">Arial</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Helvetica">Helvetica</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Courier New">Courier New</option>
                    </select>
                </div>

                <div
                    class="flex flex-col gap-2 border-b border-slate-200 pb-2 mb-2 last:border-b-0 last:mb-0 last:pb-0">
                    <div class="flex items-center justify-between text-xs">
                        <div>Estilo:</div>
                    </div>
                    <div class="flex gap-2">
                        <button @click="textIsBold = !textIsBold"
                            class="flex-1 h-8 flex items-center justify-center border border-slate-200 rounded text-xs font-bold transition-colors"
                            :class="textIsBold ? 'bg-primary-500 text-white border-primary-500' : 'bg-slate-100 hover:bg-slate-200'">
                            B
                        </button>
                        <button @click="textIsItalic = !textIsItalic"
                            class="flex-1 h-8 flex items-center justify-center border border-slate-200 rounded text-xs italic transition-colors"
                            :class="textIsItalic ? 'bg-primary-500 text-white border-primary-500' : 'bg-slate-100 hover:bg-slate-200'">
                            I
                        </button>
                        <button @click="textIsUnderline = !textIsUnderline"
                            class="flex-1 h-8 flex items-center justify-center border border-slate-200 rounded text-xs underline transition-colors"
                            :class="textIsUnderline ? 'bg-primary-500 text-white border-primary-500' : 'bg-slate-100 hover:bg-slate-200'">
                            U
                        </button>
                    </div>
                </div>
            </template>
            <template v-if="activeObject && activeObject.id !== 'firstImage' && activeObject.id !== 'secondImage'">
                <div
                    class="flex flex-col gap-2 border-b border-slate-200 pb-2 mb-2 last:border-b-0 last:mb-0 last:pb-0">
                    <div class="flex items-center justify-between text-xs">
                        <div>Ordem:</div>
                    </div>
                    <div class="flex gap-2">
                        <button @click="bringObjectToFront"
                            class="flex-1 h-8 flex items-center justify-center border border-slate-200 rounded text-xs transition-colors hover:bg-slate-200">
                            <iconify-icon icon="hugeicons:layer-bring-to-front"
                                class="text-base inline-block"></iconify-icon>
                        </button>
                        <button @click="bringObjectForward"
                            class="flex-1 h-8 flex items-center justify-center border border-slate-200 rounded text-xs transition-colors hover:bg-slate-200">
                            <iconify-icon icon="hugeicons:layer-bring-forward"
                                class="text-base inline-block"></iconify-icon>
                        </button>
                        <button @click="sendObjectBackwards"
                            class="flex-1 h-8 flex items-center justify-center border border-slate-200 rounded text-xs transition-colors hover:bg-slate-200">
                            <iconify-icon icon="hugeicons:layer-send-backward"
                                class="text-base inline-block"></iconify-icon>
                        </button>
                        <button @click="sendObjectToBack"
                            class="flex-1 h-8 flex items-center justify-center border border-slate-200 rounded text-xs transition-colors hover:bg-slate-200">
                            <iconify-icon icon="hugeicons:layer-send-to-back"
                                class="text-base inline-block"></iconify-icon>
                        </button>

                    </div>
                </div>
            </template>
        </div>
        <div class="grow flex items-center justify-center w-full bg-[url(@/assets/image.png)] bg-size-[800px]">
            <div ref="canvasContainer" class="max-h-full overflow-auto w-full h-full flex items-center justify-center">
                <div ref="canvasWrapper" class="relative w-full h-full">
                    <canvas ref="canvasEl"></canvas>
                </div>
                <div
                    class="absolute pointer-events-none w-full flex items-center justify-between bottom-4 left-1/2 transform -translate-x-1/2">
                    <div class="grid grid-cols-2 md:grid-cols-3 w-full">
                        <div class="hidden md:flex pl-4 pb-6">
                            <div>
                            </div>
                        </div>
                        <div class="flex items-center justify-center gap-4">
                            <div class="flex items-center justify-center pointer-events-auto">
                                <button @click="undo()" :disabled="undoStack.length <= 1"
                                    class="h-8 w-8 bg-slate-200 flex items-center justify-center border-2 border-r-0 border-slate-300 hover:bg-primary-500 hover:text-white text-black rounded-l-lg transition-colors">
                                    <iconify-icon icon="iconoir:undo" class="inline-block"></iconify-icon>
                                </button>
                                <button @click="redo()" :disabled="redoStack.length === 0"
                                    class="h-8 w-8 bg-slate-200 flex items-center justify-center border-2 border-slate-300 hover:bg-primary-500 hover:text-white text-black rounded-r-lg transition-colors">
                                    <iconify-icon icon="iconoir:redo" class="inline-block"></iconify-icon>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Botão Finalizar fixo no canto inferior direito -->
        <button @click="finishDrawing()"
            class="fixed bottom-6 right-6 z-50 h-10 px-8 pointer-events-auto flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white rounded font-semibold transition-colors cursor-pointer shadow-lg">
            <iconify-icon icon="iconoir:check" class="text-2xl inline-block"></iconify-icon>
            <span class="ml-3">Finalizar</span>
        </button>

        <!-- Modal de Comparação -->
        <Dialog 
            :is-visible="showCompareModal"
            dialog-id="compare"
            title="Comparar Imagens"
            @close="showCompareModal = false"
        >
            <Compare
                :images-to-compare="imagesToCompare"
            />
        </Dialog>
        <Dialog 
            :is-visible="showCropperModal"
            dialog-id="crop"
            title="Cortar Imagem"
            @close="showCropperModal = false"
            >
            <Cropper
                :image="imageToCrop"
                @image-cropped="applyCroppedImage"
            />
        </Dialog>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed, nextTick, defineAsyncComponent } from 'vue';
import { Canvas, FabricImage, Rect, PencilBrush, Path, IText, Circle, Triangle, Polyline, Point, util } from 'fabric'

import { EraserBrush, ClippingGroup } from '@erase2d/fabric';

import { applyStyleToControls } from '@/composables/useControls.js';

import useCommonStore from '@/stores/common.js';
const commonStore = useCommonStore();

import ColorSelector from '@/components/ColorSelector.vue';
import Tooltip from '@/components/Tooltip.vue';
import Dialog from '@/components/Dialog.vue';
import Compare from '@/components/Compare.vue';
import Cropper from '@/components/Cropper.vue';

// import { useRangeInput } from '@/composables/useRangeInput.js';
// const rangeInput = useRangeInput();

// Define um nome de componente multi-palavra para atender a regra de lint
defineOptions({ name: 'ImageAnnotatorApp' });

// === DOCUMENTAÇÃO DO SCRIPT ===

// 1. DEFINIÇÃO DAS PROPRIEDADES (PROPS)
// 'defineProps' declara os dados que o componente espera receber do HTML.
// Nosso componente precisa das URLs de duas imagens.
const props = defineProps({
    imgLeftSrc: {
        type: String,
        required: true,
    },
    imgRightSrc: {
        type: String,
        required: true,
    },
    logoSettings: {
        type: Object,
        required: false,
        default: () => ({
            url: '/logo-comprido-escuro.png',
            position: 'bottom-right',
            scale: 1,
            opacity: 0.5,
        }),
    },
});

const emit = defineEmits(['finished']);

const ready = ref(false);
const finishing = ref(false);
const altKeyPressed = ref(false);
const showCompareModal = ref(false);
const showCropperModal = ref(false);

// URLs de dados para comparação de imagens
const img1DataUrl = ref('');
const img2DataUrl = ref('');

// Variáveis para pan com botão direito
const isPanning = ref(false);
const lastPanPoint = ref({ x: 0, y: 0 });

const eraser = ref(null);

// Variáveis para zoom suave com mouse wheel (removidas se não usadas)

// 2. VARIÁVEIS DE REFERÊNCIA

const canvasContainer = ref(null);
const canvasWrapper = ref(null);

// 'canvasEl' é uma referência direta ao elemento <canvas> no template.
// O Vue irá conectar esta variável ao elemento que tem ref="canvasEl".
const canvasEl = ref(null);
// 'fabricCanvas' guardará a instância do Fabric.js para podermos manipular o canvas.
let fabricCanvas = null

const showWatermark = ref(false);
const watermark = ref(null);

const firstImage = ref(null);
const firstClipPath = ref(null);
const secondImage = ref(null);
const secondClipPath = ref(null);
const drawingArea = ref(null); // Área de desenho (retângulo transparente)
const zoomLevel = ref(1);
const maxZoom = ref(4.5);
const minZoom = ref(0.3);
let isSwitchingDisplayMode = false;

const imagesToCompare = ref({
    first: null,
    second: null,
});
const imageToCrop = ref(null);

const drawingAreaWidth = ref(0);
const drawingAreaHeight = ref(0);

const activeObject = ref();
const objectScaleX = ref(1);
const objectScaleY = ref(1);
const objectUniformScale = ref(true); // Escala uniforme (X e Y juntos)
const objectOpacity = ref(1);

const watchObjectScale = ref(true);

// Variáveis para o histórico de ações (Undo/Redo)
const undoStack = ref([]);
const redoStack = ref([]);
const maxHistorySize = 50; // Limite de ações no histórico
let isRestoring = false; // Flag para evitar que o estado seja salvo durante uma restauração
let isDrawingAreaUpdating = false; // Flag para evitar loops entre input e redimensionamento manual

const displayMode = ref('ltr'); // 'ltr' (left-to-right) ou 'ttb' (top-to-bottom)
const activeTool = ref(); // Ferramenta ativa (ex: 'draw', 'select', etc.)

const baseStrokeWidth = ref(1); // Largura base do pincel
const objectStrokeWidthMultiplier = ref(4); // Multiplicador da largura do pincel

// Variáveis para a ferramenta de texto
const textFontSize = ref(24); // Tamanho da fonte
const textFontFamily = ref('Arial'); // Família da fonte
const textColor = ref('#000000'); // Cor do texto
const textIsBold = ref(false); // Texto em negrito
const textIsItalic = ref(false); // Texto em itálico
const textIsUnderline = ref(false); // Texto sublinhado

const handlersColor = '#d1d5d9';
const handlersColorOver = '#c0c4c8';
const cornerHandlersColor = '#b4c3d8';
const cornerHandlersColorOver = '#8494ab';

// Handlers dos cantos para redimensionamento diagonal
const cornerHandleSize = 50; // Tamanho do L
const cornerThickness = 10; // Espessura da linha do L

// Variáveis para a ferramenta de desenho de formas
const isDrawingRect = ref(false);
const isDrawingCircle = ref(false);
const isDrawingTriangle = ref(false);
const isDrawingLine = ref(false);
const isDrawingArrow = ref(false);
let rect, circle, triangle, line, arrow, origX, origY;
const fillColor = ref(commonStore.brandColor); // Cor de preenchimento de novos objetos
const lineStrokeColor = ref(commonStore.brandColor); // Cor da linha para linhas e setas
const watermarkWidthPercent = 0.2; // Marca d'água ocupa 50% da largura do drawingArea (ajustável)

// 3. CICLO DE VIDA 'onMounted'
// O código dentro do 'onMounted' só executa *depois* que o componente foi montado na página.
// Isso é crucial, pois garante que o elemento <canvas> já existe no DOM para que o
// Fabric.js possa controlá-lo.
onMounted(async () => {
    // Inicializa o Fabric.js, associando-o ao nosso elemento canvas.
    fabricCanvas = new Canvas(canvasEl.value, {
        preserveObjectStacking: true, // Permite que objetos fiquem acima de outros
        selectionFullyContained: true, // Seleciona apenas objetos totalmente dentro do retângulo de seleção
        fireRightClick: true,  // Habilita eventos de clique direito
        fireMiddleClick: true, // Habilita eventos de clique do meio
        stopContextMenu: true, // Impede o menu de contexto padrão
    });

    window.fabricCanvas = fabricCanvas;

    eraser.value = new EraserBrush(fabricCanvas);
    eraser.value.width = 30;
    eraser.value.on('start', (e) => {
        console.log('e', e);

    });

    eraser.value.on('end', async (e) => {
        e.preventDefault();

        const { path, targets } = e.detail;
        // const isErased = targets.includes(circle);

        // const pathPerObjectMap = await eraser.value.commit({ path, targets });

        // const committedEraser = circle.clipPath instanceof ClippingGroup;
    });

    // Configurar eventos do Fabric.js
    setupFabricEvents();

    // Chama a função para carregar as imagens.
    await loadImages();
    await adjustCanvasSize();
    await addClipPaths();

    // Adiciona listener para redimensionamento da janela
    window.addEventListener('resize', adjustCanvasSize);

    // Configura os atalhos de teclado para Undo/Redo
    setupKeyboardShortcuts();

    // Configura os listeners para salvar o estado do canvas
    setupCanvasStateListeners();

    addWatermark();
    // Ativa a ferramenta de seleção por padrão
    activateSelectionMode();
    addDrawingAreaHandlers();

    // const arrow = new Arrow({
    //     x1: 50,
    //     y1: 50,
    //     x2: 90,
    //     y2: 90,
    //     stroke: 'blue',
    //     strokeWidth: 3,
    //     selectable: true,
    // });
    // fabricCanvas.add(arrow);

    // Salva o estado inicial do canvas após tudo estar configurado
    setTimeout(() => {
        saveCanvasState();
        ready.value = true;
    }, 500);
});

// Limpa o listener quando o componente for desmontado
onUnmounted(() => {
    window.removeEventListener('resize', adjustCanvasSize);
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);
});

watch(displayMode, async (newMode, oldMode) => {
    if (isRestoring) return;
    switchDisplayMode(newMode);
});

// Watchers para atualizar a área de desenho quando as dimensões mudarem
watch([drawingAreaWidth, drawingAreaHeight], (
    newValues,
    oldValues
) => {
    updateDrawingAreaDimensions(oldValues, newValues);
}, { deep: true });

watch(activeObject, (newObj) => {
    if (newObj) {
        objectScaleX.value = parseFloat(newObj.scaleX?.toFixed(2));
        objectScaleY.value = parseFloat(newObj.scaleY?.toFixed(2));
        objectOpacity.value = parseFloat(newObj?.opacity)?.toFixed(2);
    }
});

watch(objectScaleX, (newScale) => {
    if (watchObjectScale.value === false) return;

    if (activeObject.value && !isNaN(newScale) && newScale > 0) {
        const ratio = activeObject.value.scaleY / activeObject.value.scaleX;
        let scaleY = activeObject.value.scaleY;

        if (objectUniformScale.value) {
            objectScaleY.value = newScale * ratio;
            scaleY = newScale * ratio;
        }

        activeObject.value.set({
            scaleX: newScale,
            scaleY: scaleY,
        });
        activeObject.value.setCoords();
        fabricCanvas.requestRenderAll();
        saveCanvasState();
    }
});

watch(objectScaleY, (newScale) => {
    if (watchObjectScale.value === false) return;

    if (activeObject.value && !isNaN(newScale) && newScale > 0) {

        const ratio = activeObject.value.scaleX / activeObject.value.scaleY;
        let scaleX = activeObject.value.scaleX;

        if (objectUniformScale.value) {
            objectScaleX.value = newScale * ratio;
            scaleX = newScale * ratio;
        }

        activeObject.value.set({
            scaleX: scaleX,
            scaleY: newScale
        });
        fabricCanvas.requestRenderAll();
        saveCanvasState();
    }
});

watch(objectOpacity, (newOpacity) => {
    if (activeObject.value && !isNaN(newOpacity) && newOpacity >= 0 && newOpacity <= 1) {
        activeObject.value.set({
            opacity: newOpacity
        });
        fabricCanvas.requestRenderAll();
        saveCanvasState();
    }
});

watch(objectStrokeWidthMultiplier, (newWidth) => {
    if (activeTool.value === 'draw' && fabricCanvas.freeDrawingBrush) {
        objectStrokeWidthMultiplier.value = Math.max(0, Math.min(newWidth, 11)); // Limita entre 0 e 11
        updateBrushWidth();
    } else if (
        activeObject.value && (
            Object.prototype.hasOwnProperty.call(activeObject.value, 'strokeWidth'))
    ) {
        if (activeObject.value && (
            activeObject.value.id !== 'firstImage' &&
            activeObject.value.id !== 'secondImage'
        )) {
            objectStrokeWidthMultiplier.value = Math.max(0, Math.min(newWidth, 11)); // Limita entre 0 e 11
            activeObject.value.set({
                strokeWidth: baseStrokeWidth.value * objectStrokeWidthMultiplier.value
            });
            fabricCanvas.requestRenderAll();
            saveCanvasState();
        }
    }
}
);

watch(() => lineStrokeColor.value, (newColor) => {
    const activeObject = fabricCanvas.getActiveObject();
    if (activeTool.value === 'draw' && fabricCanvas.freeDrawingBrush) {
        fabricCanvas.freeDrawingBrush.color = newColor;
    } else if (
        activeObject && Object.prototype.hasOwnProperty.call(activeObject, 'stroke')
    ) {
        activeObject.set({ stroke: newColor });
    }
    fabricCanvas.renderAll();
});

watch(textFontSize, (newSize) => {

    if (activeObject.value && activeObject.value.type === 'i-text') {
        activeObject.value.set({
            fontSize: newSize
        });
        fabricCanvas.requestRenderAll();
        saveCanvasState();
    }
});

watch(textFontFamily, (newFamily) => {
    if (activeObject.value && activeObject.value.type === 'i-text') {
        activeObject.value.set({
            fontFamily: newFamily
        });
        fabricCanvas.requestRenderAll();
        saveCanvasState();
    }
});

watch(textColor, (newColor) => {
    if (activeObject.value && activeObject.value.type === 'i-text') {
        activeObject.value.set({
            fill: newColor
        });
        fabricCanvas.requestRenderAll();
        saveCanvasState();
    }
});
watch(textIsBold, (isBold) => {
    if (activeObject.value && activeObject.value.type === 'i-text') {
        activeObject.value.set({
            fontWeight: isBold ? 'bold' : 'normal'
        });
        fabricCanvas.requestRenderAll();
        saveCanvasState();
    }
});
watch(textIsItalic, (isItalic) => {
    if (activeObject.value && activeObject.value.type === 'i-text') {
        activeObject.value.set({
            fontStyle: isItalic ? 'italic' : 'normal'
        });
        fabricCanvas.requestRenderAll();
        saveCanvasState();
    }
});
watch(textIsUnderline, (isUnderline) => {
    if (activeObject.value && activeObject.value.type === 'i-text') {
        activeObject.value.set({
            underline: isUnderline
        });
        fabricCanvas.requestRenderAll();
        saveCanvasState();
    }
});

watch(fillColor, (newColor) => {

    const hasFill = activeObject.value && Object.prototype.hasOwnProperty.call(activeObject.value, 'fill');

    if (hasFill) {
        activeObject.value.set({
            fill: newColor
        });
        fabricCanvas.requestRenderAll();
        saveCanvasState();
    }
});


const logoSettings = computed(() => {
    if (typeof props.logoSettings === 'string') {
        const settings = JSON.parse(props.logoSettings);
        return {
            url: settings.url || '/logo-comprido-escuro.png',
            position: settings.position || 'bottom-right',
            scale: settings.scale || 1,
            opacity: settings.opacity || 0.5,
        }
    } return {
        url: props.logoSettings.url || '/logo-comprido-escuro.png',
        position: props.logoSettings.position || 'bottom-right',
        scale: props.logoSettings.scale || 1,
        opacity: props.logoSettings.opacity || 0.5,
    }
});


// 4. FUNÇÕES PRINCIPAIS

async function applyCroppedImage(croppedImageData) {
    const dataURL = croppedImageData.dataURL;

    if (!dataURL || !imageToCrop.value) return;

    const id = imageToCrop.value.id;
    const image = fabricCanvas.getObjects().find(obj => obj.id === id);
    if (!image) return;    

    // Store current visual properties to maintain appearance
    const currentLeft = image.left;
    const currentTop = image.top;

    try {
        // In FabricJS v6, setSrc returns a Promise
        await image.setSrc(dataURL, { crossOrigin: 'anonymous' });
        
        // After the new image loads, adjust scale to maintain visual size
        // The new image has the cropped dimensions, so we need to scale it
        // to match the previous visual size if that's desired behavior
        
        // Option 1: Maintain the same visual size (scale to fit previous size)
        // const newScaleX = currentScaledWidth / croppedWidth;
        // const newScaleY = currentScaledHeight / croppedHeight;
        
        // Option 2: Keep original scale (cropped image might appear smaller/larger)
        // Comment out the lines above and uncomment below to use original scale:
        const newScaleX = image.scaleX;
        const newScaleY = image.scaleY;
        
        image.set({
            scaleX: newScaleX,
            scaleY: newScaleY,
            left: currentLeft,
            top: currentTop
        });

        image.setCoords();
        
        const newRatio = image.getScaledWidth() / image.getScaledHeight();
        const da = drawingArea.value;
        let daRatio;

        if(displayMode.value === 'ltr'){
            daRatio = (da.width / 2) / da.height;
        } else {
            daRatio = da.width / (da.height / 2);
        }
        
        if(newRatio > daRatio) {
            objectScaleX.value = ((da.width / ( displayMode.value === 'ltr' ? 2 : 1)) / image.width);
            objectScaleY.value = objectScaleX.value;
        } else {
            objectScaleY.value = (da.height / ( displayMode.value === 'ltr' ? 1 : 2)) / image.height;
            objectScaleX.value = objectScaleY.value;
        }     

        image.set({
            scaleX: objectScaleX.value,
            scaleY: objectScaleY.value,
        });
        
        image.setCoords();
        fabricCanvas.requestRenderAll();
        saveCanvasState();
        
        imageToCrop.value = null;
        showCropperModal.value = false;
        
        console.log('Image successfully replaced with cropped version');
    } catch (error) {
        console.error('Error applying cropped image:', error);
        // Optionally show user feedback about the error
        alert('Erro ao aplicar a imagem cortada. Tente novamente.');
    }
}

async function switchDisplayMode(newMode, options = {}) {
    const { skipSave = false, force = false } = options;

    const zoomAtStart = fabricCanvas.getZoom();
    console.log('🔄 switchDisplayMode:', newMode, '| skipSave:', skipSave, '| zoom at start:', Math.round(zoomAtStart * 100) + '%');

    if (!force && isSwitchingDisplayMode) return;
    if (!force && isRestoring) return;

    isSwitchingDisplayMode = true;
    try {
        if (fabricCanvas) {
            fabricCanvas.discardActiveObject();
            fabricCanvas.requestRenderAll();
        }

        if (!isRestoring && displayMode.value !== newMode) {
            displayMode.value = newMode;
        }

        const ready = await ensureDisplayModeDependenciesReady();
        if (!ready) {
            console.warn('⚠️ Display mode switch skipped: canvas not ready');
            return;
        }

        const fi = firstImage.value;
        const si = secondImage.value;
        if (fi) fi.set('isManuallyMoved', false);
        if (si) si.set('isManuallyMoved', false);

        const currentZoomBeforeUpdate = fabricCanvas.getZoom();
        const currentViewportBeforeUpdate = [...fabricCanvas.viewportTransform];

        await adjustCanvasSize(true);
        await addDrawingArea();
        await nextTick();
        await updateClipPathsSize();
        await nextTick();
        await updateImagesPosition();
        await nextTick();
        
        const beforeHandlersAdd = fabricCanvas.getObjects().filter(o => o.class === 'resize-handle').length;
        console.log('📍 Before addDrawingAreaHandlers:', beforeHandlersAdd, 'handlers');
        
        await addDrawingAreaHandlers();

        const afterHandlersAdd = fabricCanvas.getObjects().filter(o => o.class === 'resize-handle').length;
        console.log('📍 After addDrawingAreaHandlers:', afterHandlersAdd, 'handlers');
        
        if (!skipSave) {
            console.log('📐 Calling fitToCanvas (skipDrawingAreaUpdate=true)');
            await fitToCanvas(false, true);
            if (newMode === 'ttb') {
                await ensureDrawingAreaVisible();
            }
        } else {
            fabricCanvas.setZoom(currentZoomBeforeUpdate);
            fabricCanvas.viewportTransform = currentViewportBeforeUpdate;
            fabricCanvas.setViewportTransform(currentViewportBeforeUpdate);
            zoomLevel.value = currentZoomBeforeUpdate;
            fabricCanvas.requestRenderAll();
        }
        
        if (!isRestoring && !skipSave) {
            saveCanvasState();
        }

        const finalHandlerCount = fabricCanvas.getObjects().filter(o => o.class === 'resize-handle').length;
        const finalZoom = fabricCanvas.getZoom();
        console.log('✅ switchDisplayMode END:', finalHandlerCount, 'handlers | zoom:', Math.round(finalZoom * 100) + '% | zoomLevel.value:', Math.round(zoomLevel.value * 100) + '%');
    } finally {
        isSwitchingDisplayMode = false;
    }
}

async function ensureDisplayModeDependenciesReady(timeout = 1000, interval = 50) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
        if (
            fabricCanvas &&
            firstImage.value &&
            secondImage.value &&
            drawingArea.value &&
            firstClipPath.value &&
            secondClipPath.value
        ) {
            return true;
        }
        await new Promise(resolve => setTimeout(resolve, interval));
    }
    return false;
}

async function handleDisplayModeClick(mode) {
    const currentZoomAtClick = fabricCanvas.getZoom();
    console.log('🖱️ Click:', mode, '(current:', displayMode.value + ') | zoom before click:', Math.round(currentZoomAtClick * 100) + '% | zoomLevel.value:', Math.round(zoomLevel.value * 100) + '%');
    
    if (isRestoring) return;

    if (isSwitchingDisplayMode) {
        let attempts = 0;
        while (isSwitchingDisplayMode && attempts < 50) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
    }
    
    if (displayMode.value === mode) {
        await switchDisplayMode(mode, { force: true });
    } else {
        displayMode.value = mode;
    }
}

function objectScaleChangedInput(event, axis) {
    const value = parseFloat(event.target.value).toFixed(2);
    if (!isNaN(value) && value > 0) {
        watchObjectScale.value = true;
    } else {
        watchObjectScale.value = false;
    }

    if (axis === 'x') {
        objectScaleX.value = value;
    } else if (axis === 'y') {
        objectScaleY.value = value;
    }
}

async function addDrawingArea() {
    if (!firstClipPath.value || !secondClipPath.value) return;

    const handlersBeforeDA = fabricCanvas.getObjects().filter(o => o.class === 'resize-handle');
    console.log('🏗️ addDrawingArea: handlers before:', handlersBeforeDA.length);

    // SEMPRE remove todos os handlers antes de criar novo drawingArea
    if (handlersBeforeDA.length > 0) {
        handlersBeforeDA.forEach(handle => fabricCanvas.remove(handle));
        fabricCanvas.requestRenderAll();
        await nextTick();
    }

    // Remove drawingArea antigo se existir
    const da =  fabricCanvas.getObjects().find(obj => obj.id === 'drawingArea');
    if(da) {
        fabricCanvas.remove(da);
        drawingArea.value = null;
    }

    const canvasWidth = fabricCanvas.getWidth();
    const canvasHeight = fabricCanvas.getHeight();

    const minImageHeight = Math.min(firstImage.value.getScaledHeight(), secondImage.value.getScaledHeight());
    const minImageWidth = Math.min(firstImage.value.getScaledWidth(), secondImage.value.getScaledWidth());
    
    let daw = minImageWidth * 2;
    let dah = minImageHeight;

    if(displayMode.value === 'ttb') {
        // Em top-to-bottom, o drawingArea deve ser tão largo quanto a menor imagem
        // e tão alto quanto duas vezes a altura da menor imagem
        daw = minImageWidth;
        dah = minImageHeight * 2;
    }

    // Cria o retângulo da área de desenho
    const drawingAreaRect = new Rect({
        left: canvasWidth / 2,
        top: canvasHeight / 2,
        width: daw,
        height: dah,
        fill: 'white', // Fundo branco para a área de desenho
        stroke: 'oklch(67.72% 0.103 40.38)', // Cor da borda azul
        borderColor: 'oklch(67.72% 0.103 40.38)',
        cornerColor: 'orange',
        strokeWidth: 0,
        strokeUniform: true,
        selectable: false,
        evented: true,
        id: 'drawingArea',
        absolutePositioned: true,
        resizeByCorners: true,
        lockUniScaling: false,
        hasControls: true,
        hasBorders: true,
        cornerSize: 8,
        transparentCorners: false,
        borderColor: '#007ACC',
        cornerColor: '#007ACC',
        cornerStrokeColor: '#ffffff',
        lockRotation: true, // Impede rotação, apenas redimensionamento
        lockMovementX: true, // Impede movimento horizontal
        lockMovementY: true, // Impede movimento vertical
        centeredScaling: true, // Redimensionamento centralizado
        originX: 'center', // Origem X no centro
        originY: 'center', // Origem Y no centro
        perPixelTargetFind: false,

    });

    drawingArea.value = drawingAreaRect;
    drawingAreaWidth.value = daw;
    drawingAreaHeight.value = dah;

    // Adiciona ao canvas
    fabricCanvas.add(drawingAreaRect);
    fabricCanvas.sendObjectToBack(drawingAreaRect);

    // Armazena a referência
    drawingArea.value = drawingAreaRect;

    // // Adiciona listener para atualizar os inputs quando redimensionado
    // drawingAreaRect.on('scaling', () => {
    //     if (!isDrawingAreaUpdating) {
    //         isDrawingAreaUpdating = true;
    //         const newWidth = Math.round(drawingAreaRect.width * drawingAreaRect.scaleX);
    //         const newHeight = Math.round(drawingAreaRect.height * drawingAreaRect.scaleY);
    //         drawingAreaWidth.value = newWidth;
    //         drawingAreaHeight.value = newHeight;

    //         // Redimensiona os clipPaths em tempo real
    //         updateClipPathsSize();

    //         // Atualiza a posição da watermark em tempo real
    //         updateWatermarkPosition();

    //         isDrawingAreaUpdating = false;
    //     }
    // });

    drawingAreaRect.on('modified', async () => {
        if (!isDrawingAreaUpdating) {
            
            isDrawingAreaUpdating = true;
            // Guarda o tamanho antigo antes de aplicar o novo
            const oldWidth = drawingAreaRect.width;
            const oldHeight = drawingAreaRect.height;
            const newWidth = Math.round(drawingAreaRect.width * drawingAreaRect.scaleX);
            const newHeight = Math.round(drawingAreaRect.height * drawingAreaRect.scaleY);
            drawingAreaWidth.value = newWidth;
            drawingAreaHeight.value = newHeight;

            // Normaliza o objeto para manter apenas width/height sem escala
            drawingAreaRect.set({
                width: newWidth,
                height: newHeight,
                scaleX: 1,
                scaleY: 1
            });

            // Redimensiona os clipPaths para seguir o drawingArea
            await updateClipPathsSize();

            // Reposiciona as imagens preservando offsets relativos, se houver
            await updateImagesPosition({ width: oldWidth, height: oldHeight });

            // Atualiza a posição da watermark após redimensionamento
            updateWatermarkPosition();

            fabricCanvas.requestRenderAll();
            isDrawingAreaUpdating = false;
        }
    });

    fabricCanvas.requestRenderAll();
    
    const handlersAfterDA = fabricCanvas.getObjects().filter(o => o.class === 'resize-handle');
    console.log('🏗️ addDrawingArea: handlers after:', handlersAfterDA.length);
}

/**
 * Redimensiona os clipPaths baseado nas dimensões do drawingArea
 */
async function updateClipPathsSize() {
    if (!drawingArea.value || !firstClipPath.value || !secondClipPath.value) return;

    let daw = drawingArea.value.width;
    let dah = drawingArea.value.height;
    let dal = drawingArea.value.left - (daw / 2); // Ajusta para originX: center
    let dat = drawingArea.value.top - (dah / 2); // Ajusta para originY: center

    let clipWidth = daw / 2;
    let clipHeight = dah;

    if(displayMode.value === 'ttb') {
        dal = drawingArea.value.left - (daw / 2); // Ajusta para originX: center
        dat = drawingArea.value.top - (dah / 2); // Ajusta para originY: center

        clipWidth = daw;
        clipHeight = dah / 2;
    }

    // First clipPath ocupa metade esquerda
    firstClipPath.value.set({
        left: dal,
        top: dat,
        width: clipWidth,
        height: clipHeight
    });

    // Second clipPath ocupa metade direita
    secondClipPath.value.set({
        left: dal + (displayMode.value === 'ltr' ? clipWidth : 0),
        top: dat + (displayMode.value === 'ltr' ? 0 : clipHeight),
        width: clipWidth,
        height: clipHeight
    });

    firstClipPath.value.setCoords();
    secondClipPath.value.setCoords();

    fabricCanvas.requestRenderAll();
}

async function updateImagesPosition(oldSize = null) {
    if (!drawingArea.value || !firstImage.value || !secondImage.value || !firstClipPath.value || !secondClipPath.value) return;

    const da = drawingArea.value;

    const compute = (img, clip, isFirst) => {

        const clipLeft = clip.left;
        const clipTop = clip.top;
        const clipW = clip.width;
        const clipH = clip.height;

        const newCenterX = clipLeft + clipW / 2;
        const newCenterY = clipTop + clipH / 2;

        // // Se a imagem nunca foi movida manualmente ou não temos tamanho antigo, centraliza
        if (!oldSize || !img.isManuallyMoved) {
            const left = newCenterX - img.getScaledWidth() / 2;
            const top = newCenterY - img.getScaledHeight() / 2;
            img.set({ left, top });
            img.setCoords();
            return;
        }

        // Calcula centro do clip antigo baseado no tamanho anterior do drawingArea (mantendo o centro do drawingArea)

        if (!oldSize) return; // Se não tem tamanho antigo, não faz nada

        const oldDAW = oldSize.width;
        const oldDAH = oldSize.height;
        const oldDALeft = da.left - oldDAW / 2;
        const oldDATop = da.top - oldDAH / 2;

        let oldClipW, oldClipH, oldClipLeft, oldClipTop;

        if (displayMode.value === 'ttb') {
            // Top-to-bottom: imagens ficam uma em cima da outra
            oldClipW = oldDAW;
            oldClipH = oldDAH / 2;
            oldClipLeft = oldDALeft;
            oldClipTop = isFirst ? oldDATop : oldDATop + oldDAH / 2;
        } else {
            // Left-to-right (padrão): imagens ficam lado a lado
            oldClipW = oldDAW / 2;
            oldClipH = oldDAH;
            oldClipLeft = isFirst ? oldDALeft : oldDALeft + oldDAW / 2;
            oldClipTop = oldDATop;
        }

        const oldClipCenterX = oldClipLeft + oldClipW / 2;
        const oldClipCenterY = oldClipTop + oldClipH / 2;

        // Centro atual da imagem (antes de reposicionar)
        const imgCenterX = img.left + img.getScaledWidth() / 2;
        const imgCenterY = img.top + img.getScaledHeight() / 2;

        // Offset relativo normalizado em relação ao clip antigo
        const dxNorm = (imgCenterX - oldClipCenterX) / (oldClipW / 2 || 1);
        const dyNorm = (imgCenterY - oldClipCenterY) / (oldClipH / 2 || 1);

        // Aplica o mesmo offset relativo no novo clip
        const dx = dxNorm * (clipW / 2);
        const dy = dyNorm * (clipH / 2);

        const finalCenterX = newCenterX + dx;
        const finalCenterY = newCenterY + dy;

        const left = finalCenterX - img.getScaledWidth() / 2;
        const top = finalCenterY - img.getScaledHeight() / 2;
        img.set({ left, top });
        img.setCoords();
    };

    if(firstImage.value) compute(firstImage.value, firstClipPath.value, true);
    if(secondImage.value) compute(secondImage.value, secondClipPath.value, false);

    fabricCanvas.requestRenderAll();
}

/**
 * Atualiza as dimensões da área de desenho baseado nos inputs do usuário
 */
async function updateDrawingAreaDimensions(oldValues, newValues) {
    if (!drawingArea.value || !fabricCanvas || isDrawingAreaUpdating) return;

    isDrawingAreaUpdating = true;

    const newWidth = parseInt(newValues[0]) || 0;
    const newHeight = parseInt(newValues[1]) || 0;

    if (newWidth <= 0 || newHeight <= 0) {
        isDrawingAreaUpdating = false;
        return;
    }

    // Captura tamanho antigo para preservar posição relativa das imagens movidas
    const oldSize = {
        width: parseInt(oldValues?.[0]) || drawingArea.value.width,
        height: parseInt(oldValues?.[1]) || drawingArea.value.height,
    };

    // Atualiza as dimensões da área de desenho
    drawingArea.value.set({
        width: newWidth,
        height: newHeight,
        scaleX: 1,
        scaleY: 1
    });
    drawingArea.value.setCoords();

    // Redimensiona os clipPaths para seguir o drawingArea
    await updateClipPathsSize();
    
    // Atualiza a posição das imagens com base no tamanho anterior
    await updateImagesPosition(oldSize);

    // Atualiza a posição da watermark
    updateWatermarkPosition();

    isDrawingAreaUpdating = false;
}

/**
 * Salva o estado atual do canvas no histórico (undo stack).
 */
function saveCanvasState() {
    if (isRestoring) return; // Não salva se estiver restaurando um estado

    // Limpa a pilha de refazer (redo stack) sempre que uma nova ação é feita
    redoStack.value = [];

    // Garante que clipPaths têm ID antes de serializar
    if (firstClipPath.value && !firstClipPath.value.id) {
        firstClipPath.value.set('id', 'firstClipPath');
    }
    if (secondClipPath.value && !secondClipPath.value.id) {
        secondClipPath.value.set('id', 'secondClipPath');
    }

    // Serializa o canvas para JSON, incluindo propriedades personalizadas
    const canvasState = fabricCanvas.toObject([
        'id',
        'class',
        'selectable',
        'evented',
        'absolutePositioned',
        'isManuallyMoved'
    ]);

    // Remove handlers do estado salvo para evitar duplicação no restore
    if (canvasState.objects) {
        const originalCount = canvasState.objects.length;
        canvasState.objects = canvasState.objects.filter(obj => obj.class !== 'resize-handle');
        const filteredCount = canvasState.objects.length;
        const filtered = originalCount - filteredCount;
        if (filtered > 0) {
            console.log('💾 saveCanvasState: filtered', filtered, 'handlers from state');
        }
    }

    const state = JSON.stringify({
        displayMode: displayMode.value,
        canvas: canvasState,
    });
    

    // Adiciona o estado à pilha de desfazer
    undoStack.value.push(state);

    // Limita o tamanho do histórico para não consumir muita memória
    if (undoStack.value.length > maxHistorySize) {
        undoStack.value.shift(); // Remove o estado mais antigo
    }
}

/**
 * Desfaz a última ação (Ctrl+Z).
 */
async function undo() {
    if (undoStack.value.length <= 1) return; // Mantém o estado inicial na pilha

    // Move o estado atual da pilha de desfazer para a de refazer
    const currentState = undoStack.value.pop();
    redoStack.value.push(currentState);

    // Pega o estado anterior
    const previousState = undoStack.value[undoStack.value.length - 1];

    // Restaura o canvas para o estado anterior
    await restoreCanvasState(previousState);
}

/**
 * Refaz a última ação desfeita (Ctrl+Shift+Z).
 */
async function redo() {
    if (redoStack.value.length === 0) return;

    // Move o estado da pilha de refazer de volta para a de desfazer
    const stateToRestore = redoStack.value.pop();
    undoStack.value.push(stateToRestore);

    // Restaura o canvas para este estado
    await restoreCanvasState(stateToRestore);
}

/**
 * Restaura o canvas a partir de um objeto de estado JSON.
 */
async function restoreCanvasState(state) {
    console.log('🔙 UNDO/REDO START');
    isRestoring = true;

    let restoredDisplayMode = null;
    try {
        const parsed = typeof state === 'string' ? JSON.parse(state) : state;
        const canvasState = parsed?.canvas ?? parsed;
        restoredDisplayMode = parsed?.displayMode ?? inferDisplayModeFromClipPaths(parsed);
        
        if (restoredDisplayMode && restoredDisplayMode !== displayMode.value) {
            displayMode.value = restoredDisplayMode;
        }

        const currentZoom = fabricCanvas.getZoom();
        const currentViewportTransform = [...fabricCanvas.viewportTransform];
        
        fabricCanvas.discardActiveObject();
        await fabricCanvas.loadFromJSON(canvasState);

        const handlersAfterLoad = fabricCanvas.getObjects().filter(o => o.class === 'resize-handle');
        console.log('🔙 After loadFromJSON:', handlersAfterLoad.length, 'handlers');

        fabricCanvas.setZoom(currentZoom);
        fabricCanvas.viewportTransform = currentViewportTransform;
        fabricCanvas.setViewportTransform(currentViewportTransform);
        zoomLevel.value = currentZoom;
        
        await nextTick();
        
        firstImage.value = fabricCanvas.getObjects().find(o => o.id === 'firstImage');
        secondImage.value = fabricCanvas.getObjects().find(o => o.id === 'secondImage');
        drawingArea.value = fabricCanvas.getObjects().find(o => o.id === 'drawingArea');
        watermark.value = fabricCanvas.getObjects().find(o => o.id === 'watermark');

        firstClipPath.value = firstImage.value?.clipPath || fabricCanvas.getObjects().find(o => o.id === 'firstClipPath');
        secondClipPath.value = secondImage.value?.clipPath || fabricCanvas.getObjects().find(o => o.id === 'secondClipPath');
        
        if (firstClipPath.value && !firstClipPath.value.id) {
            firstClipPath.value.set('id', 'firstClipPath');
        }
        if (secondClipPath.value && !secondClipPath.value.id) {
            secondClipPath.value.set('id', 'secondClipPath');
        }
        
        if (firstImage.value && firstClipPath.value && !firstImage.value.clipPath) {
            firstImage.value.clipPath = firstClipPath.value;
        }
        if (secondImage.value && secondClipPath.value && !secondImage.value.clipPath) {
            secondImage.value.clipPath = secondClipPath.value;
        }
        
        fabricCanvas.getObjects().forEach(obj => {
            if (obj.id !== 'drawingArea' && obj.class !== 'resize-handle' && obj.id !== 'watermark') {
                applyStyleToControls(obj);
            }
        });
        
        if (drawingArea.value) {
            drawingAreaWidth.value = drawingArea.value.width;
            drawingAreaHeight.value = drawingArea.value.height;
        }
        
        fabricCanvas.requestRenderAll();
        await nextTick();

    } catch (error) {
        console.error('❌ Erro ao restaurar estado:', error);
    } finally {
        isRestoring = false;
    }
    
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 50));
    
    const modeToApply = restoredDisplayMode || displayMode.value;
    console.log('🔙 Calling switchDisplayMode after restore:', modeToApply);
    
    if (modeToApply) {
        await switchDisplayMode(modeToApply, { skipSave: true, force: true });
    }
    console.log('🔙 UNDO/REDO END');
}

function inferDisplayModeFromClipPaths(stateObj) {
    try {
        const canvasObj = stateObj?.canvas ?? stateObj;
        const objects = canvasObj?.objects;
        if (!Array.isArray(objects)) return null;

        const firstClip = objects.find(o => o.id === 'firstClipPath');
        const secondClip = objects.find(o => o.id === 'secondClipPath');
        if (!firstClip || !secondClip) return null;

        // Se os clipPaths dividem altura (mesma width, metade da height), é ttb
        const sameWidth = Math.abs(firstClip.width - secondClip.width) < 1e-3;
        const sameHeight = Math.abs(firstClip.height - secondClip.height) < 1e-3;
        if (!sameWidth && sameHeight) {
            return 'ltr';
        }
        if (sameWidth && !sameHeight) {
            return 'ttb';
        }
        // Heurística adicional: compara top
        if (Math.abs(firstClip.top - secondClip.top) > Math.abs(firstClip.left - secondClip.left)) {
            return 'ttb';
        }
        return 'ltr';
    } catch (e) {
        return null;
    }
}

/**
 * Configura os listeners de eventos do canvas para salvar o estado automaticamente.
 */
function setupCanvasStateListeners() {
    fabricCanvas.on({
        'object:modified': saveCanvasState,
        'path:created': (e) => {
            const path = e?.path;
            if (path) {
                // Garante seleção precisa por pixel
                path.set({ perPixelTargetFind: true });
                path.padding = 4;
                // Atribui um ID único somente se ainda não houver um
                if (!path.id) {
                    const uid = `path-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
                    path.set({ id: uid });
                }

                applyStyleToControls(path);
            }
            saveCanvasState();
        },
        'selection:created': (e) => {
            // Limpa estados de hover quando algo é selecionado
            clearAllHoverStates();

            // se a ferramenta ativa não for 'select', ignora a seleção
            if (['draw', 'rectangle', 'circle', 'triangle', 'line', 'arrow', 'erase'].includes(activeTool.value)) {
                fabricCanvas.discardActiveObject();
                fabricCanvas.requestRenderAll();
                manageSelection(null);
                return;
            }

            // console.log(e);
            if (e.selected.length > 1) {
                const objectsToIgnore = e.selected.filter(o => o.id === 'drawingArea' || o.class === 'resize-handle');

                const selection = fabricCanvas.getActiveObject();

                applyStyleToControls(selection);

                if (selection && selection.type.toLowerCase() === 'activeselection') {
                    objectsToIgnore.forEach(obj => {
                        selection.remove(obj);
                    });
                    // if (selection.size() === 1) {
                    //     fabricCanvas.setActiveObject(selection.item(0));
                    //     manageSelection(selection.item(0));
                    // } else {
                    //     fabricCanvas.discardActiveObject();
                    //     manageSelection(null);
                    // }
                    fabricCanvas.requestRenderAll();
                }

            } else {
                manageSelection(e.selected[0]);
            }
        },
        'selection:updated': (e) => {
            // Limpa estados de hover quando a seleção é atualizada
            clearAllHoverStates();

            const objectsToIgnore = e.selected.filter(o => o.id === 'drawingArea' || o.class === 'resize-handle');
            const activeSelection = fabricCanvas.getActiveObject();
            if (activeSelection?._objects?.length > 1) {

                if (activeSelection) {

                    objectsToIgnore.forEach(obj => {
                        activeSelection.remove(obj);
                    });
                    if (activeSelection.size() === 1) {
                        fabricCanvas.setActiveObject(activeSelection.item(0));
                        manageSelection(activeSelection.item(0));
                    } else if (activeSelection.size() === 0) {
                        fabricCanvas.discardActiveObject();
                        manageSelection(null);
                    }
                }

                applyStyleToControls(activeSelection);

            } else {
                manageSelection(e.selected[0]);

                if (activeSelection?._objects?.length > 1) {
                    applyStyleToControls(activeSelection);
                } else {
                    if (activeSelection.id !== 'drawingArea' && activeSelection.class !== 'resize-handle') {
                        applyStyleToControls(activeSelection);
                    }
                }
            }
        },
        'selection:cleared': () => {
            manageSelection(null);
        },
        'object:scaling': (e) => {
            const obj = e.target;
            watchObjectScale.value = false

            objectScaleX.value = obj.scaleX.toFixed(2);
            objectScaleY.value = obj.scaleY.toFixed(2);
        },
    });
}

/**
 * Configura os atalhos de teclado para as funções de desfazer e refazer.
 */
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
}

function manageSelection(object) {
    activeObject.value = object;
}

/**
 * Manipulador de eventos de teclado.
 */
function handleKeyDown(e) {

    if(showCompareModal.value || showCropperModal.value) return;

    // Atalho para Desfazer: Ctrl+Z
    if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
    }
    // Atalho para Refazer: Ctrl+Shift+Z ou Ctrl+Y
    if (e.ctrlKey && (e.key === 'y' || (e.shiftKey && e.key === 'Z'))) {
        e.preventDefault();
        redo();
    }
    // Atalho para Remover: Delete ou Backspace
    if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        removeSelectedObjects();
    }

    if (e.key === 'Escape') {
        e.preventDefault();
        setActiveTool(null);
        fabricCanvas.discardActiveObject();
        fabricCanvas.requestRenderAll();
        manageSelection(null);
    }

    // alt
    altKeyPressed.value = e.altKey;

    if (!activeObject.value || activeObject.value.type !== 'i-text' || activeObject.value.isEditing === false) {
        // Atalhos para mover objetos selecionados com as setas
        if (activeObject.value) {
            let step = 1;
            if (e.shiftKey) step = 10; // Move 10 pixels se Shift estiver pressionado

            switch (e.key) {
                case 'ArrowUp':
                    e.preventDefault();
                    activeObject.value.top -= step;
                    activeObject.value.setCoords();
                    fabricCanvas.requestRenderAll();
                    saveCanvasState();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    activeObject.value.top += step;
                    activeObject.value.setCoords();
                    fabricCanvas.requestRenderAll();
                    saveCanvasState();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    activeObject.value.left -= step;
                    activeObject.value.setCoords();
                    fabricCanvas.requestRenderAll();
                    saveCanvasState();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    activeObject.value.left += step;
                    activeObject.value.setCoords();
                    fabricCanvas.requestRenderAll();
                    saveCanvasState();
                    break;
                default:
                    break;
            }
        }

        switch (e.key) {
            case '1':
                setActiveTool('select');
                break;
            case '2':
                setActiveTool('draw');
                break;
            case '3':
                setActiveTool('rectangle');
                break;
            case '4':
                setActiveTool('circle');
                break;
            case '5':
                setActiveTool('triangle');
                break;
            case '6':
                setActiveTool('line');
                break;
            case '7':
                setActiveTool('arrow');
                break;
            case '8':
                setActiveTool('text');
                break;
            case '9':
                setActiveTool('eraser');
                break;
            default:
                break;
        }
    }
}

function handleKeyUp(e) {
    
    if(showCompareModal.value || showCropperModal.value) return;

    if (e.key === 'Alt') {
        altKeyPressed.value = false;
    }
}

/**
 * Remove os objetos selecionados do canvas
 */
function removeSelectedObjects() {
    if (!fabricCanvas) return;

    const activeObject = fabricCanvas.getActiveObject();

    if (!activeObject) return;

    // Verifica se é uma seleção múltipla
    if (activeObject.type === 'activeSelection') {
        if (activeObject.id === 'firstImage' || activeObject.id === 'secondImage') {
            alert('Ainda não é possível remover as imagens principais porque não há como adicioná-las novamente.');
            return; // Não remove elementos essenciais
        }

        const objectsToRemove = activeObject.getObjects().filter(obj => {
            // Não permite remover imagens principais, área de desenho ou handlers de resize
            return obj.id !== 'drawingArea' &&
                obj.id !== 'watermark' &&
                obj.class !== 'resize-handle';
        });

        if (objectsToRemove.length > 0) {
            objectsToRemove.forEach(obj => {
                fabricCanvas.remove(obj);
            });
            fabricCanvas.discardActiveObject();
            fabricCanvas.requestRenderAll();
            saveCanvasState();
        }
    } else {
        if (activeObject.id === 'firstImage' || activeObject.id === 'secondImage') {
            alert('Ainda não é possível remover as imagens principais porque não há como adicioná-las novamente.');
            return; // Não remove elementos essenciais
        }
        // Verificações de segurança - não permite remover elementos essenciais
        if (activeObject.id === 'drawingArea' ||
            activeObject.id === 'watermark' ||
            activeObject.class === 'resize-handle') {
            return; // Não remove elementos essenciais
        }

        // Remove o objeto único selecionado
        fabricCanvas.remove(activeObject);
        fabricCanvas.discardActiveObject();
        fabricCanvas.requestRenderAll();
        saveCanvasState();
    }
}

/**
 * Adicionar handlers para redimensionamento da área de desenho
*/
function addDrawingAreaHandlers() {
    if (!drawingArea.value) return;

    const existingHandles = fabricCanvas.getObjects().filter(o => o.class === 'resize-handle');
    console.log('🔧 addDrawingAreaHandlers: existing handlers:', existingHandles.length);
    
    if (existingHandles.length > 0) {
        console.warn('⚠️ Found', existingHandles.length, 'handlers - removing');
        existingHandles.forEach(handle => fabricCanvas.remove(handle));
        fabricCanvas.requestRenderAll();
    }

    const commonProps = {
        hasBorders: false,
        fill: handlersColor,
        strokeWidth: 1,
        stroke: 'transparent',
        originX: 'center',
        originY: 'center',
        hasControls: false,
        hasBorders: false,
        selectable: true,
        class: 'resize-handle',
        padding: 2,
        // excludeFromExport: true,
    };

    const leftHandle = new Rect({
        ...commonProps,
        left: drawingArea.value.left - drawingArea.value.width / 2,
        top: drawingArea.value.top,
        width: 10,
        height: drawingArea.value.height - 90,
        id: 'leftHandle',
        lockMovementY: true,
        hoverCursor: 'ew-resize',
    });

    const rightHandle = new Rect({
        ...commonProps,
        left: drawingArea.value.left + drawingArea.value.width / 2,
        top: drawingArea.value.top,
        width: 10,
        height: drawingArea.value.height - 90,
        id: 'rightHandle',
        class: 'resize-handle',
        lockMovementY: true,
        hoverCursor: 'ew-resize',
    });

    const topHandle = new Rect({
        ...commonProps,
        left: drawingArea.value.left,
        top: drawingArea.value.top - drawingArea.value.height / 2,
        width: drawingArea.value.width - 90,
        height: 10,
        id: 'topHandle',
        lockMovementX: true,
        hoverCursor: 'ns-resize',
    });

    const bottomHandle = new Rect({
        ...commonProps,
        left: drawingArea.value.left,
        top: drawingArea.value.top + drawingArea.value.height / 2,
        width: drawingArea.value.width - 90,
        height: 10,
        id: 'bottomHandle',
        lockMovementX: true,
        hoverCursor: 'ns-resize',
    });

    const topLeftHandle = new Path(`M 0 0 L ${cornerHandleSize} 0 L ${cornerHandleSize} ${cornerThickness} L ${cornerThickness} ${cornerThickness} L ${cornerThickness} ${cornerHandleSize} L 0 ${cornerHandleSize} Z`, {
        left: drawingArea.value.left - drawingArea.value.width / 2 + cornerHandleSize / 2 - cornerThickness / 2,
        top: drawingArea.value.top - drawingArea.value.height / 2 + cornerHandleSize / 2 - cornerThickness / 2,
        fill: cornerHandlersColor,
        stroke: 'transparent',
        strokeWidth: 1,
        originX: 'center',
        originY: 'center',
        hasControls: false,
        hasBorders: false,
        selectable: true,
        class: 'resize-handle',
        id: 'topLeftHandle',
        hoverCursor: 'nw-resize',
    });

    const topRightHandle = new Path(`M 0 0 L 0 ${cornerThickness} L ${cornerHandleSize - cornerThickness} ${cornerThickness} L ${cornerHandleSize - cornerThickness} ${cornerHandleSize} L ${cornerHandleSize} ${cornerHandleSize} L ${cornerHandleSize} 0 Z`, {
        left: drawingArea.value.left + drawingArea.value.width / 2 - cornerHandleSize / 2 + cornerThickness / 2,
        top: drawingArea.value.top - drawingArea.value.height / 2 + cornerHandleSize / 2 - cornerThickness / 2,
        fill: cornerHandlersColor,
        stroke: 'transparent',
        strokeWidth: 1,
        originX: 'center',
        originY: 'center',
        hasControls: false,
        hasBorders: false,
        selectable: true,
        class: 'resize-handle',
        id: 'topRightHandle',
        hoverCursor: 'ne-resize',
    });

    const bottomLeftHandle = new Path(`M 0 0 L ${cornerThickness} 0 L ${cornerThickness} ${cornerHandleSize - cornerThickness} L ${cornerHandleSize} ${cornerHandleSize - cornerThickness} L ${cornerHandleSize} ${cornerHandleSize} L 0 ${cornerHandleSize} Z`, {
        left: drawingArea.value.left - drawingArea.value.width / 2 + cornerHandleSize / 2 - cornerThickness / 2,
        top: drawingArea.value.top + drawingArea.value.height / 2 - cornerHandleSize / 2 + cornerThickness / 2,
        fill: cornerHandlersColor,
        stroke: 'transparent',
        strokeWidth: 1,
        originX: 'center',
        originY: 'center',
        hasControls: false,
        hasBorders: false,
        selectable: true,
        class: 'resize-handle',
        id: 'bottomLeftHandle',
        hoverCursor: 'sw-resize',
    });

    const bottomRightHandle = new Path(`M 0 ${cornerHandleSize - cornerThickness} L 0 ${cornerHandleSize} L ${cornerHandleSize} ${cornerHandleSize} L ${cornerHandleSize} 0 L ${cornerHandleSize - cornerThickness} 0 L ${cornerHandleSize - cornerThickness} ${cornerHandleSize - cornerThickness} Z`, {
        left: drawingArea.value.left + drawingArea.value.width / 2 - cornerHandleSize / 2 + cornerThickness / 2,
        top: drawingArea.value.top + drawingArea.value.height / 2 - cornerHandleSize / 2 + cornerThickness / 2,
        fill: cornerHandlersColor,
        stroke: 'transparent',
        strokeWidth: 1,
        originX: 'center',
        originY: 'center',
        hasControls: false,
        hasBorders: false,
        selectable: true,
        class: 'resize-handle',
        id: 'bottomRightHandle',
        hoverCursor: 'se-resize',
    });

    fabricCanvas.add(leftHandle);
    fabricCanvas.add(rightHandle);
    fabricCanvas.add(topHandle);
    fabricCanvas.add(bottomHandle);
    fabricCanvas.add(topLeftHandle);
    fabricCanvas.add(topRightHandle);
    fabricCanvas.add(bottomLeftHandle);
    fabricCanvas.add(bottomRightHandle);
    
    const totalHandlers = fabricCanvas.getObjects().filter(o => o.class === 'resize-handle').length;
    console.log('🔧 addDrawingAreaHandlers: created 8, total now:', totalHandlers);
    
    if (totalHandlers !== 8) {
        console.error('❌ WRONG COUNT! Expected 8 but got', totalHandlers);
        const allHandlers = fabricCanvas.getObjects().filter(o => o.class === 'resize-handle');
        allHandlers.forEach(h => console.log('  ', h.id));
    }
}

/**
 * Anima o zoom suavemente de um valor para outro
 */
function animateZoom(startZoom, endZoom, duration = 300, centerPoint = null) {
    return new Promise((resolve) => {
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Função de easing (ease-out)
            const easeProgress = 1 - Math.pow(1 - progress, 3);

            const currentZoom = startZoom + (endZoom - startZoom) * easeProgress;

            if (centerPoint) {
                fabricCanvas.zoomToPoint(centerPoint, currentZoom);
            } else {
                fabricCanvas.setZoom(currentZoom);
            }

            zoomLevel.value = currentZoom;

            fabricCanvas.requestRenderAll();

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                resolve();
            }
        };

        requestAnimationFrame(animate);
    });
}

/**
 * Anima a transformação do viewport suavemente
 */
function animateViewportTransform(startTransform, endTransform, duration = 300) {
    return new Promise((resolve) => {
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Função de easing (ease-out)
            const easeProgress = 1 - Math.pow(1 - progress, 3);

            const currentTransform = startTransform.map((start, index) => {
                const end = endTransform[index];
                return start + (end - start) * easeProgress;
            });

            fabricCanvas.viewportTransform = currentTransform;
            fabricCanvas.requestRenderAll();

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                resolve();
            }
        };

        requestAnimationFrame(animate);
    });
}

/**
 * Define os limites mínimo e máximo de zoom
 */
function setZoomLimits(min, max) {
    if (min > 0 && max > min) {
        minZoom.value = min;
        maxZoom.value = max;

        // Garante que o zoom atual esteja dentro dos novos limites
        const currentZoom = fabricCanvas.getZoom();
        if (currentZoom < min || currentZoom > max) {
            const newZoom = Math.min(Math.max(currentZoom, min), max);
            fabricCanvas.setZoom(newZoom);
            zoomLevel.value = newZoom;
            fabricCanvas.requestRenderAll();
        }
    }
}

/**
 * Define o nível de zoom diretamente com animação suave
 */
async function setZoom(level, animate = true) {
    const targetZoom = Math.min(Math.max(level, minZoom.value), maxZoom.value);
    const currentZoom = fabricCanvas.getZoom();

    if (animate && targetZoom !== currentZoom) {
        await animateZoom(currentZoom, targetZoom, 300);
    } else {
        fabricCanvas.setZoom(targetZoom);
        zoomLevel.value = targetZoom;
        fabricCanvas.requestRenderAll();
    }
}

/**
 * Reseta o zoom para 1x (100%) e centraliza o canvas com animação suave
 */
async function resetZoom() {
    const targetZoom = Math.min(Math.max(1, minZoom.value), maxZoom.value);
    const currentZoom = fabricCanvas.getZoom();
    const currentTransform = [...fabricCanvas.viewportTransform];
    const targetTransform = [1, 0, 0, 1, 0, 0];

    // Anima o zoom e o viewport em paralelo
    await Promise.all([
        animateZoom(currentZoom, targetZoom, 400),
        animateViewportTransform(currentTransform, targetTransform, 400)
    ]);
}

/**
 * Faz zoom in (aumenta o zoom) com animação suave
 */
async function zoomIn(factor = 1.2) {
    console.log('zoomIn');
    
    const currentZoom = fabricCanvas.getZoom();
    const newZoom = Math.min(currentZoom * factor, maxZoom.value);

    if (newZoom !== currentZoom) {
        updateWatermarkPosition();
        await animateZoom(currentZoom, newZoom, 250);

    }
}

/**
 * Faz zoom out (diminui o zoom) com animação suave
 */
async function zoomOut(factor = 1.2) {
    const currentZoom = fabricCanvas.getZoom();
    const newZoom = Math.max(currentZoom / factor, minZoom.value);

    if (newZoom !== currentZoom) {
        updateWatermarkPosition();
        await animateZoom(currentZoom, newZoom, 250);
    }
}

/**
 * Ajusta o zoom para caber todo o conteúdo no canvas com animação suave
 */
async function fitToCanvas(withTransition = true, skipDrawingAreaUpdate = false) {
    if (!firstImage.value || !secondImage.value) return;

    const currentZoomBefore = fabricCanvas.getZoom();
    console.log('📐 fitToCanvas START | current zoom:', Math.round(currentZoomBefore * 100) + '%', '| skipDrawingAreaUpdate:', skipDrawingAreaUpdate);

    const canvasWidth = fabricCanvas.getWidth();
    const canvasHeight = fabricCanvas.getHeight();

    // Calcula o zoom necessário para caber as duas imagens
    let totalImageWidth, totalImageHeight;
    
    if (displayMode.value === 'ltr') {
        // Modo lado a lado: soma larguras, pega maior altura
        totalImageWidth = firstImage.value.getScaledWidth() + secondImage.value.getScaledWidth();
        totalImageHeight = Math.max(firstImage.value.getScaledHeight(), secondImage.value.getScaledHeight());
    } else {
        // Modo TTB: pega maior largura, soma alturas
        totalImageWidth = Math.max(firstImage.value.getScaledWidth(), secondImage.value.getScaledWidth());
        totalImageHeight = firstImage.value.getScaledHeight() + secondImage.value.getScaledHeight();
        
        // No modo TTB, limita a altura máxima à altura da janela
        const windowHeight = window.innerHeight;
        totalImageHeight = Math.min(totalImageHeight, windowHeight);
    }

    const scaleX = canvasWidth / totalImageWidth;
    const scaleY = canvasHeight / totalImageHeight;
    const targetZoom = Math.min(Math.max(Math.min(scaleX, scaleY), minZoom.value), maxZoom.value);

    const currentZoom = fabricCanvas.getZoom();
    const currentTransform = [...fabricCanvas.viewportTransform];
    const targetTransform = [1, 0, 0, 1, 0, 0];

    console.log('📐 fitToCanvas: calculated target zoom:', Math.round(targetZoom * 100) + '%');

    if(withTransition) {
        // Anima o zoom e o viewport em paralelo
        await Promise.all([
            animateZoom(currentZoom, targetZoom, 500),
            animateViewportTransform(currentTransform, targetTransform, 500)
        ]);
    } else {
        fabricCanvas.setZoom(targetZoom);
        fabricCanvas.viewportTransform = targetTransform;
        zoomLevel.value = targetZoom; // Atualiza o valor reativo do zoom
        fabricCanvas.requestRenderAll();
    }
    
    const finalZoom = fabricCanvas.getZoom();
    console.log('📐 fitToCanvas END | zoom now:', Math.round(finalZoom * 100) + '% | zoomLevel.value:', Math.round(zoomLevel.value * 100) + '%');

    // Só atualiza a área de desenho se não for chamado de switchDisplayMode
    if (!skipDrawingAreaUpdate) {
        console.log('📐 fitToCanvas: calling addDrawingArea (will remove handlers!)');
        await addDrawingArea();
        const handlersAfterFit = fabricCanvas.getObjects().filter(o => o.class === 'resize-handle').length;
        console.log('📐 fitToCanvas END:', handlersAfterFit, 'handlers');
    }
}

async function ensureDrawingAreaVisible() {
    if (!drawingArea.value) return;

    await nextTick();

    const canvasWidth = fabricCanvas.getWidth();
    const canvasHeight = fabricCanvas.getHeight();
    const margin = 120;

    const daBounds = drawingArea.value.getBoundingRect();

    const requiredZoomX = (canvasWidth - margin) / daBounds.width;
    const requiredZoomY = (canvasHeight - margin) / daBounds.height;
    const requiredZoomFactor = Math.min(requiredZoomX, requiredZoomY);

    const currentZoom = fabricCanvas.getZoom();
    let targetZoom = currentZoom;

    // Só aplica o zoom se for para diminuir (zoom out)
    if (requiredZoomFactor < 1) {
        targetZoom = currentZoom * requiredZoomFactor;
    }

    // Aplica o zoom se necessário
    if (targetZoom !== currentZoom) {
        console.log('📏 ensureDrawingAreaVisible: adjusting zoom from', Math.round(currentZoom * 100) + '% to', Math.round(targetZoom * 100) + '%');
        const centerPoint = drawingArea.value.getCenterPoint();
        fabricCanvas.zoomToPoint(centerPoint, targetZoom);
        zoomLevel.value = targetZoom;
        fabricCanvas.requestRenderAll();
        console.log('📏 ensureDrawingAreaVisible END | zoomLevel.value:', Math.round(zoomLevel.value * 100) + '%');
    } else {
        console.log('📏 ensureDrawingAreaVisible: no zoom adjustment needed');
    }
}

function createText(x, y) {
    const text = new IText('Digite aqui...', {
        left: x,
        top: y,
        fontSize: textFontSize.value,
        fontFamily: textFontFamily.value,
        fill: textColor.value,
        fontWeight: textIsBold.value ? 'bold' : 'normal',
        fontStyle: textIsItalic.value ? 'italic' : 'normal',
        underline: textIsUnderline.value,
        editable: true,
        cornerColor: '#4285f4',
        cornerStyle: 'circle',
        transparentCorners: false,
        cornerSize: 8,
        rotatingPointOffset: 40,
        opacity: objectOpacity.value,
        strokeWidth: baseStrokeWidth.value * objectStrokeWidthMultiplier.value,
    });

    fabricCanvas.add(text);
    fabricCanvas.setActiveObject(text);
    fabricCanvas.renderAll();

    // Entra em modo de edição automaticamente
    text.enterEditing();
    text.selectAll();
    applyStyleToControls(text);

    saveCanvasState();
}

/**
 * Verifica se um objeto é selecionável e deve mostrar hover
 */
function isSelectableObject(obj) {
    // Exclui objetos essenciais do sistema
    const excludedIds = ['drawingArea', 'watermark'];
    const excludedClasses = ['resize-handle'];

    return obj &&
        obj.selectable &&
        !excludedIds?.includes(obj.id) &&
        !excludedClasses?.includes(obj.class);
}

async function setHoverState(target) {
    // Lógica para objetos selecionáveis (hover highlight)
    if (target && isSelectableObject(target)) {
        
        // Só aplica hover se o objeto não estiver já selecionado
        const activeObject = fabricCanvas.getActiveObject();
        const isCurrentlySelected = activeObject === target ||
            (activeObject?.type === 'activeSelection' && activeObject.contains(target));

        if (!isCurrentlySelected) {
            // // Salva o estado original das bordas se ainda não foi salvo
            // if (!target._originalBorderState) {
            //     target._originalBorderState = {
            //         borderColor: target.borderColor,
            //         hasBorders: target.hasBorders,
            //         borderWidth: target.borderWidth
            //     };
            // }

            // // Aplica o estilo de hover
            // target.set({
            //     borderColor: '#007ACC', // Cor azul para hover
            //     hasBorders: true,
            //     borderWidth: 2,
            // });

            let clone = await target.clone();

            const type = clone.type;

            clone.set({
                selectable: false,
                evented: false,
                hoverCursor: 'default',
                id: `${target.id}-hover`,
                stroke: commonStore.brandColor,
                strokeWidth: target.strokeWidth ? target.strokeWidth + 4 : 4,
                fill: target.fill || 'transparent',
                paintFirst: 'stroke',
            });

            if (type === 'path') {
                clone.set({
                    left: clone.left - clone.strokeWidth / 2,
                    top: clone.top - clone.strokeWidth / 2,
                });
            }

            if (type === 'i-text' || type === 'textbox') {
                // Textboxes e IText precisam de ajuste especial
                clone.set({
                    left: clone.left - clone.strokeWidth / 2,
                    top: clone.top - clone.strokeWidth / 2,
                });
            }

            if (type === 'image' || type === 'rect' || type === 'ellipse') {
                // create a rectangle with the same dimensions as the image
                const rect = new Rect({
                    left: clone.left - clone.strokeWidth,
                    top: clone.top - clone.strokeWidth,
                    width: clone.getScaledWidth(),
                    height: clone.getScaledHeight(),
                    fill: 'transparent',
                    selectable: false,
                    evented: false,
                    hoverCursor: 'default',
                    id: `${target.id}-hover`,
                    angle: clone.angle,
                    stroke: clone.stroke,
                    strokeWidth: clone.strokeWidth,
                    strokeColor: clone.strokeColor,
                    paintFirst: 'stroke',
                });

                clone = rect;
            }

            fabricCanvas.add(clone);
            fabricCanvas.bringObjectToFront(clone);

            fabricCanvas.requestRenderAll();
        }
    }
}

/**
 * Remove estados de hover de todos os objetos
 */
function clearAllHoverStates() {
    fabricCanvas.getObjects().forEach(obj => {
        if (obj.id && obj.id.includes('-hover')) {
            fabricCanvas.remove(obj);
        } else if (obj.class === 'resize-handle') {
            // Reseta a cor dos handlers de resize
            if (['topLeftHandle', 'topRightHandle', 'bottomLeftHandle', 'bottomRightHandle'].includes(obj.id)) {
                obj.set('fill', cornerHandlersColor);
            } else {
                obj.set('fill', handlersColor);
            }
        }
    });
    fabricCanvas.requestRenderAll();
}

/**
 * Cria um Path de seta com coordenadas absolutas, deixando ponta na posição final.
 */
function createArrowShape(x1, y1, x2, y2, strokeWidth, strokeColor, baseOptions = {}) {
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const headLength = Math.max(12, strokeWidth * 3);
    const headWidth = headLength * 0.6;

    const tip = { x: x2, y: y2 };
    const baseX = x2 - headLength * Math.cos(angle);
    const baseY = y2 - headLength * Math.sin(angle);

    const left = {
        x: baseX + headWidth * Math.sin(angle),
        y: baseY - headWidth * Math.cos(angle),
    };
    const right = {
        x: baseX - headWidth * Math.sin(angle),
        y: baseY + headWidth * Math.cos(angle),
    };

    const minX = Math.min(x1, tip.x, left.x, right.x);
    const minY = Math.min(y1, tip.y, left.y, right.y);

    const path = [
        ['M', x1 - minX, y1 - minY],
        ['L', tip.x - minX, tip.y - minY],
        ['M', tip.x - minX, tip.y - minY],
        ['L', left.x - minX, left.y - minY],
        ['M', tip.x - minX, tip.y - minY],
        ['L', right.x - minX, right.y - minY],
    ];

    return new Path(path, {
        ...baseOptions,
        left: minX,
        top: minY,
        fill: null,
        stroke: strokeColor,
        strokeWidth,
        originX: 'left',
        originY: 'top',
        strokeLineCap: 'round',
        strokeLineJoin: 'round',
        perPixelTargetFind: true,
        strokeUniform: true,
        pathOffset: { x: 0, y: 0 },
    });
}

function setupFabricEvents() {
    if (!fabricCanvas) return;

    fabricCanvas.on('mouse:wheel', function (opt) {
        const delta = opt.e.deltaY;
        const currentZoom = fabricCanvas.getZoom();

        // Calcula o novo nível de zoom com incrementos mais suaves
        const zoomStep = delta > 0 ? 0.9 : 1.1;
        let newZoom = currentZoom * zoomStep;
        newZoom = Math.min(Math.max(newZoom, minZoom.value), maxZoom.value);

        // Se o zoom não mudou (limite atingido), não faz nada
        if (newZoom === currentZoom) {
            opt.e.preventDefault();
            opt.e.stopPropagation();
            return;
        }

        // Obtém as coordenadas do mouse em relação ao canvas (viewport coordinates)
        const canvasRect = fabricCanvas.upperCanvasEl.getBoundingClientRect();
        const mouseX = opt.e.clientX - canvasRect.left;
        const mouseY = opt.e.clientY - canvasRect.top;

        // Converte para coordenadas do world space (canvas coordinates)
        const vpt = fabricCanvas.viewportTransform;
        const worldX = (mouseX - vpt[4]) / vpt[0];
        const worldY = (mouseY - vpt[5]) / vpt[3];

        // Calcula o novo viewport transform para manter o ponto sob o mouse fixo
        const newVpt = [...vpt];

        // Atualiza a escala
        newVpt[0] = newZoom;
        newVpt[3] = newZoom;

        // Ajusta a translação para manter o ponto sob o mouse na mesma posição na tela
        newVpt[4] = mouseX - worldX * newZoom;
        newVpt[5] = mouseY - worldY * newZoom;

        // Aplica a transformação
        fabricCanvas.setViewportTransform(newVpt);

        zoomLevel.value = newZoom;

        updateWatermarkPosition();

        opt.e.preventDefault();
        opt.e.stopPropagation();

        fabricCanvas.requestRenderAll();
    });

    // Desabilita a seleção de grupo com clique e arraste para evitar conflitos
    fabricCanvas.selection = false;

    // Configurar pan (arrastar para mover visualização) quando zoom > 1
    let isDragging = false;
    let lastPosX = 0;
    let lastPosY = 0;

    fabricCanvas.on('text:editing:entered', function () {
        activeTool.value = 'text';
    });

    fabricCanvas.on('text:editing:exited', function () {
        activeTool.value = 'select';

        fabricCanvas.isDrawingMode = false;
        fabricCanvas.selection = true; // Permite selecionar textos existentes
        fabricCanvas.defaultCursor = 'default';
        fabricCanvas.hoverCursor = 'default';
        fabricCanvas.requestRenderAll();

        saveCanvasState();
    });

    fabricCanvas.on('mouse:down', function (opt) {
        const evt = opt.e;
        // remove all hover states
        clearAllHoverStates();

        if (activeTool.value === 'rectangle') {

            isDrawingRect.value = true;
            const pointer = fabricCanvas.getPointer(evt);
            origX = pointer.x;
            origY = pointer.y;
            rect = new Rect({
                left: origX,
                top: origY,
                originX: 'left',
                originY: 'top',
                width: pointer.x - origX,
                height: pointer.y - origY,
                angle: 0,
                opacity: objectOpacity.value,
                strokeWidth: baseStrokeWidth.value * objectStrokeWidthMultiplier.value,
                fill: 'transparent',
                stroke: lineStrokeColor.value,
                transparentCorners: false
            });
            fabricCanvas.add(rect);
            return;
        }

        if (activeTool.value === 'circle') {
            isDrawingCircle.value = true;
            const pointer = fabricCanvas.getPointer(evt);
            origX = pointer.x;
            origY = pointer.y;
            circle = new Circle({
                left: origX,
                top: origY,
                originX: 'center',
                originY: 'center',
                opacity: objectOpacity.value,
                strokeWidth: baseStrokeWidth.value * objectStrokeWidthMultiplier.value,
                fill: 'transparent',
                stroke: lineStrokeColor.value,
                radius: 0,
                transparentCorners: false
            });
            fabricCanvas.add(circle);
            return;
        }

        if (activeTool.value === 'triangle') {
            isDrawingTriangle.value = true;
            const pointer = fabricCanvas.getPointer(evt);
            origX = pointer.x;
            origY = pointer.y;
            triangle = new Triangle({
                left: origX,
                top: origY,
                originX: 'left',
                originY: 'top',
                opacity: objectOpacity.value,
                strokeWidth: baseStrokeWidth.value * objectStrokeWidthMultiplier.value,
                fill: fillColor.value,
                stroke: lineStrokeColor.value,
                width: Math.abs(pointer.x - origX),
                height: Math.abs(pointer.y - origY),
                transparentCorners: false
            });
            fabricCanvas.add(triangle);
            return;
        }

        if (activeTool.value === 'line') {
            isDrawingLine.value = true;
            const pointer = fabricCanvas.getPointer(evt);
            const points = [
                { x: pointer.x, y: pointer.y },
            ];
            line = new Polyline(points, {
                left: pointer.x,
                top: pointer.y,
                fill: null,
                opacity: objectOpacity.value,
                strokeWidth: baseStrokeWidth.value * objectStrokeWidthMultiplier.value,
                stroke: lineStrokeColor.value,
                selectable: false,
                evented: false,
                id: `line-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
                perPixelTargetFind: true,
            });

            fabricCanvas.add(line);
            return;
        }

        if (activeTool.value === 'arrow') {
            isDrawingArrow.value = true;
            const pointer = fabricCanvas.getPointer(evt);
            const strokeWidth = baseStrokeWidth.value * objectStrokeWidthMultiplier.value;

            origX = pointer.x;
            origY = pointer.y;

            arrow = createArrowShape(
                origX,
                origY,
                origX,
                origY,
                strokeWidth,
                lineStrokeColor.value,
                {
                    opacity: objectOpacity.value,
                    selectable: false,
                    evented: false,
                    id: `arrow-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
                },
            );

            fabricCanvas.add(arrow);
            return;
        }

        // Funcionalidade de texto - criar texto no clique
        if (activeTool.value === 'text') {
            // Verifica se já existe um texto em modo de edição
            const editingText = fabricCanvas.getObjects().find(obj =>
                obj.type === 'i-text' && obj.isEditing,
            );

            // Se já existe um texto sendo editado, não cria um novo
            if (editingText) {
                return;
            }

            const pointer = fabricCanvas.getPointer(evt);
            createText(pointer.x, pointer.y);
            return;
        }

        // Pan com botão do meio do mouse (button 1) ou Alt + clique esquerdo ou zoom > 1
        if (evt.button === 1 || evt.altKey === true) {
            isDragging = true;
            fabricCanvas.selection = false;
            lastPosX = evt.clientX;
            lastPosY = evt.clientY;
            fabricCanvas.setCursor('grab');

            // Previne o comportamento padrão do botão do meio (scroll)
            if (evt.button === 1) {
                evt.preventDefault();
            }
        }

        // Pan com botão direito do mouse (button 2)
        if (evt.button === 2) {
            evt.preventDefault(); // Previne menu de contexto
            isPanning.value = true;
            fabricCanvas.selection = false;
            lastPanPoint.value = { x: evt.clientX, y: evt.clientY };
            fabricCanvas.setCursor('grab');
        }
    });

    fabricCanvas.on('mouse:move', function (opt) {
        if (isDragging) {
            const evt = opt.e;
            const vpt = fabricCanvas.viewportTransform;
            vpt[4] += evt.clientX - lastPosX;
            vpt[5] += evt.clientY - lastPosY;
            lastPosX = evt.clientX;
            lastPosY = evt.clientY;
            fabricCanvas.setCursor('grabbing');
        }

        // Pan com botão direito
        if (isPanning.value) {
            const evt = opt.e;
            const vpt = fabricCanvas.viewportTransform;
            vpt[4] += evt.clientX - lastPanPoint.value.x;
            vpt[5] += evt.clientY - lastPanPoint.value.y;
            lastPanPoint.value = { x: evt.clientX, y: evt.clientY };
            fabricCanvas.setCursor('grabbing');
            fabricCanvas.requestRenderAll();
        }

        if (isDrawingRect.value) {
            const pointer = fabricCanvas.getPointer(opt.e);

            if (origX > pointer.x) {
                rect.set({ left: Math.abs(pointer.x) });
            }
            if (origY > pointer.y) {
                rect.set({ top: Math.abs(pointer.y) });
            }

            rect.set({ width: Math.abs(origX - pointer.x) });
            rect.set({ height: Math.abs(origY - pointer.y) });
        }

        if (isDrawingCircle.value) {
            const pointer = fabricCanvas.getPointer(opt.e);
            
            // Calcula a distância entre o ponto inicial e o cursor (diâmetro)
            const dx = pointer.x - origX;
            const dy = pointer.y - origY;
            const diameter = Math.sqrt(dx * dx + dy * dy);
            const radius = diameter / 2;
            
            // Centro do círculo (ponto médio entre início e cursor)
            const centerX = origX + dx / 2;
            const centerY = origY + dy / 2;
            
            circle.set({
                left: centerX,
                top: centerY,
                originX: 'center',
                originY: 'center',
                radius: radius
            });
        }

        if (isDrawingTriangle.value) {
            const pointer = fabricCanvas.getPointer(opt.e);

            if (origX > pointer.x) {
                triangle.set({ left: Math.abs(pointer.x) });
            }
            if (origY > pointer.y) {
                triangle.set({ top: Math.abs(pointer.y) });
            }

            triangle.set({ width: Math.abs(origX - pointer.x) });
            triangle.set({ height: Math.abs(origY - pointer.y) });
        }

        if (isDrawingLine.value) {
            const pointer = fabricCanvas.getPointer(opt.e);
            const points = line.points;

            const newPoint = {
                x: pointer.x,
                y: pointer.y,
            };

            const newPoints = [
                {
                    x: points[0].x,
                    y: points[0].y,
                }, newPoint
            ]

            const newLine = new Polyline(newPoints, {
                left: Math.min(points[0].x, newPoint.x),
                top: Math.min(points[0].y, newPoint.y),
                strokeWidth: line.strokeWidth,
                fill: null,
                stroke: line.stroke,
                selectable: false,
                evented: false,
                id: line.id,
                perPixelTargetFind: line.perPixelTargetFind,
            });

            fabricCanvas.remove(line);
            line = newLine;
            fabricCanvas.add(line);
            line.setCoords();
        }

        if (isDrawingArrow.value && arrow) {
            const pointer = fabricCanvas.getPointer(opt.e);
            const newArrow = createArrowShape(
                origX,
                origY,
                pointer.x,
                pointer.y,
                arrow.strokeWidth,
                arrow.stroke,
                {
                    opacity: arrow.opacity,
                    selectable: false,
                    evented: false,
                    id: arrow.id,
                },
            );

            fabricCanvas.remove(arrow);
            arrow = newArrow;
            fabricCanvas.add(arrow);
            arrow.setCoords();
        }

        fabricCanvas.renderAll();
    });

    fabricCanvas.on('mouse:up', function () {
        if (isDragging) {
            fabricCanvas.setViewportTransform(fabricCanvas.viewportTransform);
            isDragging = false;
            fabricCanvas.selection = true;
            fabricCanvas.setCursor('default');
        }

        // Finalizar pan com botão direito
        if (isPanning.value) {
            fabricCanvas.setViewportTransform(fabricCanvas.viewportTransform);
            isPanning.value = false;
            fabricCanvas.selection = true;
            fabricCanvas.setCursor('default');
        }

        if (isDrawingRect.value) {
            isDrawingRect.value = false;
            rect.setCoords();
            applyStyleToControls(rect);
            fabricCanvas.setActiveObject(rect);
            saveCanvasState();
            // Mantém a ferramenta ativa ao invés de voltar para seleção
            setActiveTool('rectangle');
            return;
        }

        if (isDrawingCircle.value) {
            isDrawingCircle.value = false;
            circle.setCoords();
            applyStyleToControls(circle);
            fabricCanvas.setActiveObject(circle);
            saveCanvasState();
            // Mantém a ferramenta ativa ao invés de voltar para seleção
            setActiveTool('circle');
            return;
        }

        if (isDrawingTriangle.value) {
            isDrawingTriangle.value = false;
            triangle.setCoords();
            applyStyleToControls(triangle);
            fabricCanvas.setActiveObject(triangle);
            saveCanvasState();
            // Mantém a ferramenta ativa ao invés de voltar para seleção
            setActiveTool('triangle');
            return;
        }

        if (isDrawingLine.value) {
            isDrawingLine.value = false;
            line.set({
                selectable: true,
                evented: true,
            });
            line.setCoords();
            applyStyleToControls(line);
            fabricCanvas.setActiveObject(line);
            saveCanvasState();
            // Mantém a ferramenta ativa ao invés de voltar para seleção
            setActiveTool('line');
            return;
        }

        if (isDrawingArrow.value) {
            isDrawingArrow.value = false;
            arrow.set({
                selectable: true,
                evented: true,
            });
            arrow.setCoords();
            applyStyleToControls(arrow);
            fabricCanvas.setActiveObject(arrow);
            saveCanvasState();
            // Mantém a ferramenta ativa ao invés de voltar para seleção
            setActiveTool('arrow');
            return;
        }
    });

    fabricCanvas.on('mouse:over', async function (opt) {
        const target = opt.target;

        // Lógica para resize handles
        if (target?.class === 'resize-handle') {
            if (['topLeftHandle', 'topRightHandle', 'bottomLeftHandle', 'bottomRightHandle'].includes(target.id)) {
                target.set('fill', cornerHandlersColorOver);
            } else {
                target.set('fill', handlersColorOver);
            }
            fabricCanvas.bringObjectToFront(target);
            fabricCanvas.requestRenderAll();
            return;
        }

        setHoverState(target);
    });

    fabricCanvas.on('mouse:out', function (opt) {
        const target = opt.target;

        // Lógica para resize handles
        if (target?.class === 'resize-handle') {
            // revert object's fill color when not hovering
            if (['topLeftHandle', 'topRightHandle', 'bottomLeftHandle', 'bottomRightHandle'].includes(target.id)) {
                target.set('fill', cornerHandlersColor);
            } else {
                target.set('fill', handlersColor);
            }
            fabricCanvas.requestRenderAll();
            return;
        }

        // Lógica para objetos selecionáveis (remover hover highlight)
        if (target && isSelectableObject(target)) {

            // if (!isCurrentlySelected) {
            //     Restaura o estado original das bordas
            //     target.set({
            //         borderColor: target._originalBorderState.borderColor,
            //         hasBorders: target._originalBorderState.hasBorders,
            //         borderWidth: target._originalBorderState.borderWidth
            //     });

            //     // Remove o estado salvo
            //     delete target._originalBorderState;

            // }
            const hoverClone = fabricCanvas.getObjects().find(o => o.id === `${target.id}-hover`);
            if (hoverClone) {
                fabricCanvas.remove(hoverClone);
            }

            fabricCanvas.requestRenderAll();
        }
    });

    // Previne o menu de contexto ao usar o botão do meio e botão direito (pan)
    fabricCanvas.upperCanvasEl.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    });

    // Previne o comportamento de scroll padrão do botão do meio
    fabricCanvas.upperCanvasEl.addEventListener('mousedown', function (e) {
        if (e.button === 1) {
            e.preventDefault();
        }
    });

    // Adiciona listener para manter as imagens centralizadas quando movidas
    fabricCanvas.on('object:moving', function (e) {
        const obj = e.target;
        const objects = fabricCanvas.getObjects();

        if (obj.id === firstImage.value.id || obj.id === secondImage.value.id) {
            // Marca que a imagem foi movida manualmente; para não recentralizar automaticamente
            obj.set('isManuallyMoved', true);
        }

        if (obj.class === 'resize-handle') {

            const topLeftHandle = objects.find(o => o.id === 'topLeftHandle');
            const topRightHandle = objects.find(o => o.id === 'topRightHandle');
            const bottomLeftHandle = objects.find(o => o.id === 'bottomLeftHandle');
            const bottomRightHandle = objects.find(o => o.id === 'bottomRightHandle');
            const drawingAreaObj = objects.find(o => o.id === 'drawingArea');

            if (obj.id === 'leftHandle' || obj.id === 'rightHandle') {
                if (drawingAreaObj) {
                    const newWidth = (Math.abs(obj.left - drawingAreaObj.left) * 2);
                    drawingAreaWidth.value = Math.round(newWidth);
                }

                if (obj.id === 'leftHandle') {
                    const rightHandle = objects.find(o => o.id === 'rightHandle');


                    if (rightHandle) {
                        rightHandle.set({ left: drawingAreaObj.left + (drawingAreaObj.width / 2) });
                        rightHandle.setCoords();
                    }

                    topLeftHandle?.set({
                        left: obj.left + topLeftHandle.width / 2 - cornerThickness / 2,
                    });
                    bottomLeftHandle?.set({
                        left: obj.left + bottomLeftHandle.width / 2 - cornerThickness / 2,
                    });
                    topRightHandle?.set({
                        left: drawingAreaObj.left + drawingAreaObj.width / 2 - topRightHandle.width / 2 + cornerThickness / 2,
                    });
                    bottomRightHandle?.set({
                        left: drawingAreaObj.left + drawingAreaObj.width / 2 - bottomRightHandle.width / 2 + cornerThickness / 2,
                    });
                } else if (obj.id === 'rightHandle') {

                    const leftHandle = objects.find(o => o.id === 'leftHandle');
                    // adjust left handle position
                    if (leftHandle) {
                        leftHandle.set({ left: drawingAreaObj.left - (drawingAreaObj.width / 2) });
                        leftHandle.setCoords();
                    }

                    topRightHandle?.set({
                        left: obj.left - topRightHandle.width / 2 + cornerThickness / 2,
                    });
                    bottomRightHandle?.set({
                        left: obj.left - bottomRightHandle.width / 2 + cornerThickness / 2,
                    });
                    topLeftHandle?.set({
                        left: drawingAreaObj.left - drawingAreaObj.width / 2 + topLeftHandle.width / 2 - cornerThickness / 2,
                    });
                    bottomLeftHandle?.set({
                        left: drawingAreaObj.left - drawingAreaObj.width / 2 + bottomLeftHandle.width / 2 - cornerThickness / 2,
                    });
                }

                // adjust top and bottom handles width
                const topHandle = objects.find(o => o.id === 'topHandle');
                const bottomHandle = objects.find(o => o.id === 'bottomHandle');
                if (topHandle) {
                    topHandle.set({ width: drawingAreaObj.width - 90 });
                    topHandle.setCoords();
                }
                if (bottomHandle) {
                    bottomHandle.set({ width: drawingAreaObj.width - 90 });
                    bottomHandle.setCoords();
                }
            }

            if (obj.id === 'topHandle' || obj.id === 'bottomHandle') {

                if (drawingAreaObj) {
                    const newHeight = Math.abs(obj.top - drawingAreaObj.top) * 2;
                    drawingAreaHeight.value = Math.round(newHeight);
                }

                if (obj.id === 'topHandle') {
                    const bottomHandle = objects.find(o => o.id === 'bottomHandle');
                    // adjust bottom handle position
                    if (bottomHandle) {
                        bottomHandle.set({ top: drawingAreaObj.top + (drawingAreaObj.height / 2) });
                        bottomHandle.setCoords();
                    }

                    topLeftHandle?.set({
                        top: obj.top + topLeftHandle.height / 2 - cornerThickness / 2,
                    });
                    topRightHandle?.set({
                        top: obj.top + topRightHandle.height / 2 - cornerThickness / 2,
                    });
                    bottomLeftHandle?.set({
                        top: drawingAreaObj.top + drawingAreaObj.height / 2 - bottomLeftHandle.height / 2 + cornerThickness / 2,
                    });
                    bottomRightHandle?.set({
                        top: drawingAreaObj.top + drawingAreaObj.height / 2 - bottomRightHandle.height / 2 + cornerThickness / 2,
                    });
                } else if (obj.id === 'bottomHandle') {
                    const topHandle = objects.find(o => o.id === 'topHandle');
                    // adjust top handle position
                    if (topHandle) {
                        topHandle.set({ top: drawingAreaObj.top - (drawingAreaObj.height / 2) });
                        topHandle.setCoords();
                    }
                    bottomLeftHandle?.set({
                        top: obj.top - bottomLeftHandle.height / 2 + cornerThickness / 2,
                    });
                    bottomRightHandle?.set({
                        top: obj.top - bottomRightHandle.height / 2 + cornerThickness / 2,
                    });
                    topLeftHandle?.set({
                        top: drawingAreaObj.top - drawingAreaObj.height / 2 + topLeftHandle.height / 2 - cornerThickness / 2,
                    });
                    topRightHandle?.set({
                        top: drawingAreaObj.top - drawingAreaObj.height / 2 + topRightHandle.height / 2 - cornerThickness / 2,
                    });
                }

                // adjust left and right handles height
                const leftHandle = objects.find(o => o.id === 'leftHandle');
                const rightHandle = objects.find(o => o.id === 'rightHandle');
                if (leftHandle) {
                    leftHandle.set({ height: drawingAreaObj.height - 90 });
                    leftHandle.setCoords();
                }
                if (rightHandle) {
                    rightHandle.set({ height: drawingAreaObj.height - 90 });
                    rightHandle.setCoords();
                }
            }

            // Handlers dos cantos para redimensionamento diagonal
            if (obj.id === 'topLeftHandle' || obj.id === 'topRightHandle' ||
                obj.id === 'bottomLeftHandle' || obj.id === 'bottomRightHandle'
            ) {

                if (drawingAreaObj) {
                    let newWidth, newHeight;

                    if (obj.id === 'topLeftHandle') {
                        newWidth = Math.abs(drawingAreaObj.left - obj.left + obj.width / 2 - cornerThickness / 2) * 2;
                        newHeight = Math.abs(drawingAreaObj.top - obj.top + obj.height / 2 - cornerThickness / 2) * 2;
                    } else if (obj.id === 'topRightHandle') {
                        newWidth = Math.abs(obj.left - drawingAreaObj.left + obj.width / 2 - cornerThickness / 2) * 2;
                        newHeight = Math.abs(drawingAreaObj.top - obj.top + obj.height / 2 - cornerThickness / 2) * 2;
                    } else if (obj.id === 'bottomLeftHandle') {
                        newWidth = Math.abs(drawingAreaObj.left - obj.left + obj.width / 2 - cornerThickness / 2) * 2;
                        newHeight = Math.abs(obj.top - drawingAreaObj.top + obj.height / 2 - cornerThickness / 2) * 2;
                    } else if (obj.id === 'bottomRightHandle') {
                        newWidth = Math.abs(obj.left - drawingAreaObj.left + obj.width / 2 - cornerThickness / 2) * 2;
                        newHeight = Math.abs(obj.top - drawingAreaObj.top + obj.height / 2 - cornerThickness / 2) * 2;
                    }

                    drawingAreaWidth.value = Math.round(newWidth);
                    drawingAreaHeight.value = Math.round(newHeight);

                    // Atualiza posições de todos os outros handlers
                    const handles = {
                        left: objects.find(o => o.id === 'leftHandle'),
                        right: objects.find(o => o.id === 'rightHandle'),
                        top: objects.find(o => o.id === 'topHandle'),
                        bottom: objects.find(o => o.id === 'bottomHandle'),
                        topLeft: objects.find(o => o.id === 'topLeftHandle'),
                        topRight: objects.find(o => o.id === 'topRightHandle'),
                        bottomLeft: objects.find(o => o.id === 'bottomLeftHandle'),
                        bottomRight: objects.find(o => o.id === 'bottomRightHandle')
                    };

                    // Atualiza handlers laterais
                    if (handles.left) {
                        handles.left.set({
                            left: drawingAreaObj.left - drawingAreaObj.width / 2,
                            height: drawingAreaObj.height - 90
                        });
                        handles.left.setCoords();
                    }
                    if (handles.right) {
                        handles.right.set({
                            left: drawingAreaObj.left + drawingAreaObj.width / 2,
                            height: drawingAreaObj.height - 90
                        });
                        handles.right.setCoords();
                    }
                    if (handles.top) {
                        handles.top.set({
                            top: drawingAreaObj.top - drawingAreaObj.height / 2,
                            width: drawingAreaObj.width - 90
                        });
                        handles.top.setCoords();
                    }
                    if (handles.bottom) {
                        handles.bottom.set({
                            top: drawingAreaObj.top + drawingAreaObj.height / 2,
                            width: drawingAreaObj.width - 90
                        });
                        handles.bottom.setCoords();
                    }

                    // Atualiza outros handlers dos cantos
                    Object.entries(handles).forEach(([key, handle]) => {
                        if (handle && handle !== obj) {
                            if (key === 'topLeft') {
                                handle.set({
                                    left: drawingAreaObj.left - drawingAreaObj.width / 2 + cornerHandleSize / 2 - cornerThickness / 2,
                                    top: drawingAreaObj.top - drawingAreaObj.height / 2 + cornerHandleSize / 2 - cornerThickness / 2
                                });
                            } else if (key === 'topRight') {
                                handle.set({
                                    left: drawingAreaObj.left + drawingAreaObj.width / 2 - cornerHandleSize / 2 + cornerThickness / 2,
                                    top: drawingAreaObj.top - drawingAreaObj.height / 2 + cornerHandleSize / 2 - cornerThickness / 2
                                });
                            } else if (key === 'bottomLeft') {
                                handle.set({
                                    left: drawingAreaObj.left - drawingAreaObj.width / 2 + cornerHandleSize / 2 - cornerThickness / 2,
                                    top: drawingAreaObj.top + drawingAreaObj.height / 2 - cornerHandleSize / 2 + cornerThickness / 2
                                });
                            } else if (key === 'bottomRight') {
                                handle.set({
                                    left: drawingAreaObj.left + drawingAreaObj.width / 2 - cornerHandleSize / 2 + cornerThickness / 2,
                                    top: drawingAreaObj.top + drawingAreaObj.height / 2 - cornerHandleSize / 2 + cornerThickness / 2
                                });
                            }
                            handle.setCoords();
                        }
                    });
                }
            }

            topLeftHandle.setCoords();
            topRightHandle.setCoords();
            bottomLeftHandle.setCoords();
            bottomRightHandle.setCoords();
        }
    });
}

/**
 * Centraliza as imagens dentro de seus respectivos clipPaths
 */
function centerImagesInClipPaths() {
    if (!firstImage.value || !secondImage.value || !firstClipPath.value || !secondClipPath.value) return;

    // const firstClipPathObj = fabricCanvas.getObjects().find(obj => obj.id === 'firstClipPath');
    // const secondClipPathObj = fabricCanvas.getObjects().find(obj => obj.id === 'secondClipPath');

    // const firstClipWidth = firstClipPathObj ? firstClipPathObj.width : 0;
    // const firstClipHeight = firstClipPathObj ? firstClipPathObj.height : 0

    // // Centraliza a primeira imagem EXATAMENTE no centro da metade esquerda
    // const img1ScaledWidth = firstImage.value.getScaledWidth();
    // const img1ScaledHeight = firstImage.value.getScaledHeight();
    // const img1CenterX = (firstClipWidth - img1ScaledWidth) / 2;
    // const img1CenterY = (firstClipHeight - img1ScaledHeight) / 2;

    // firstImage.value.set({
    //     left: img1CenterX,
    //     top: img1CenterY
    // });

    // // Centraliza a segunda imagem EXATAMENTE no centro da metade direita
    // const img2ScaledWidth = secondImage.value.getScaledWidth();
    // const img2ScaledHeight = secondImage.value.getScaledHeight();
    // const img2CenterX = firstClipWidth + (secondClipPathObj ? secondClipPathObj.left : 0) + (secondClipPathObj ? secondClipPathObj.width : 0 - img2ScaledWidth) / 2;
    // const img2CenterY = (secondClipPathObj ? secondClipPathObj.top : 0) + (secondClipPathObj ? secondClipPathObj.height : 0 - img2ScaledHeight) / 2;

    // secondImage.value.set({
    //     left: img2CenterX,
    //     top: img2CenterY
    // });

    // fabricCanvas.renderAll();





    const firstClipPathObj = firstImage.value.clipPath;
    const secondClipPathObj = secondImage.value.clipPath;

    firstImage.value.set({
        left: firstClipPathObj.left,
        top: firstClipPathObj.top
    });

    secondImage.value.set({
        left: secondClipPathObj.left,
        top: secondClipPathObj.top
    });

    firstImage.value.setCoords();
    secondImage.value.setCoords();

    fabricCanvas.requestRenderAll();
}

async function addClipPaths() {
    if (firstImage.value && secondImage.value) {

        const firstImageObj = fabricCanvas.getObjects().find(obj => obj.id === 'firstImage');
        const secondImageObj = fabricCanvas.getObjects().find(obj => obj.id === 'secondImage');

        const totalImageWidth = (firstImageObj ? firstImageObj.getScaledWidth() : 0) + (secondImageObj ? secondImageObj.getScaledWidth() : 0);
        const maxImageHeight = Math.max(firstImageObj ? firstImageObj.getScaledHeight() : 0, secondImageObj ? secondImageObj.getScaledHeight() : 0);

        const clipPath1 = new Rect({
            width: totalImageWidth / 2,
            height: maxImageHeight,
            absolutePositioned: true,
            selectable: false,
            evented: false,
            opacity: 0.3,
            fill: 'red',
            id: 'firstClipPath',
        });

        const clipPath2 = new Rect({
            width: totalImageWidth / 2,
            height: maxImageHeight,
            absolutePositioned: true,
            selectable: false,
            evented: false,
            opacity: 0.3,
            fill: 'blue',
            id: 'secondClipPath',
        });

        firstImage.value.clipPath = clipPath1;
        secondImage.value.clipPath = clipPath2;

        // fabricCanvas.add(clipPath1);
        // fabricCanvas.add(clipPath2);

        fabricCanvas.requestRenderAll();

        firstClipPath.value = clipPath1;
        secondClipPath.value = clipPath2;

        // Centraliza as imagens dentro de seus clipPaths

        // Adiciona a área de desenho após criar os clipPaths
        await addDrawingArea();
        await centerImagesInClipPaths();
    }
}

/**
 * Carrega as duas imagens das URLs fornecidas via props, calcula o tamanho
 * necessário para o canvas e as posiciona lado a lado.
 */
async function loadImages() {
    // 'FabricImage.fromURL' é uma operação assíncrona (leva um tempo para baixar a imagem).
    // 'Promise.all' é a forma ideal de executar duas ou mais operações assíncronas ao
    // mesmo tempo e esperar que todas terminem.
    await Promise.all([
        FabricImage.fromURL(props.imgLeftSrc, { crossOrigin: 'anonymous' }),
        FabricImage.fromURL(props.imgRightSrc, { crossOrigin: 'anonymous' })
    ]).then(([imgLeft, imgRight]) => {

        // Obtém as dimensões do container
        const container = canvasContainer.value;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        // pré-dimensiona a menor imagem se houver diferença de altura ≥ 10%
        const leftW = imgLeft.width;
        const leftH = imgLeft.height;
        const rightW = imgRight.width;
        const rightH = imgRight.height;

        let preScaleLeft = 1;
        let preScaleRight = 1;

        if (leftH > 0 && rightH > 0) {
            const largerH = Math.max(leftH, rightH);
            const smallerH = Math.min(leftH, rightH);
            const heightRatio = largerH / smallerH;
            if (heightRatio >= 1.1) {
                if (leftH > rightH) {
                    preScaleLeft = rightH / leftH; // reduz a esquerda para igualar altura da direita
                } else {
                    preScaleRight = leftH / rightH; // reduz a direita para igualar altura da esquerda
                }
            }
        }

        // dimensões consideradas após o pré-scale (antes de ajustar ao container)
        const preTotalImageWidth = (leftW * preScaleLeft) + (rightW * preScaleRight);
        const preMaxImageHeight = Math.max(leftH * preScaleLeft, rightH * preScaleRight);

        // Calcula o fator de escala para caber no container
        const scaleX = containerWidth / preTotalImageWidth;
        const scaleY = containerHeight / preMaxImageHeight;
        const scale = Math.min(scaleX, scaleY, 0.85); // Não aumenta se já cabe

        // aplica escala combinada (pré-scale para igualar alturas + scale para caber no container)
        imgLeft.scale(scale * preScaleLeft);
        imgRight.scale(scale * preScaleRight);

        // set id for images e flags iniciais
        imgLeft.set({
            id: 'firstImage',
            isManuallyMoved: false,
        });

        imgRight.set({
            id: 'secondImage',
            isManuallyMoved: false,
        });

        // Calcula as dimensões finais do canvas com base nas dimensões pós-escala
        const canvasWidth = Math.min(preTotalImageWidth * scale, containerWidth);
        const canvasHeight = Math.min(preMaxImageHeight * scale, containerHeight);
        // const left = (containerWidth - canvasWidth) / 2;
        // const top = (containerHeight - canvasHeight) / 2;

        // Define o tamanho do canvas
        fabricCanvas.setDimensions({
            width: canvasWidth,
            height: canvasHeight,
        });

        // set slate background for canvas
        fabricCanvas.backgroundColor = '#F1F5F9';

        // Adiciona as imagens ao canvas.
        // O Fabric trata cada item como um objeto que pode ser movido, rotacionado, etc.
        fabricCanvas.add(imgLeft.set({
            evented: true,
            selectable: true,
            centeredScaling: true,
            lockRotation: true,
            lockScalingFlip: true,
            strokeUniform: true,
        }));
        fabricCanvas.add(imgRight.set({
            evented: true,
            selectable: true,
            centeredScaling: true,
            lockRotation: true,
            lockScalingFlip: true,
            strokeUniform: true,
        }));

        imgLeft.setControlsVisibility({
            mtr: false
        });
        imgRight.setControlsVisibility({
            mtr: false
        });

        applyStyleToControls(imgLeft, imgRight);

        // set images
        firstImage.value = imgLeft;
        secondImage.value = imgRight;

        fabricCanvas.renderAll();
    });
}

async function adjustCanvasSize(skipDrawingArea = false) {
    if (fabricCanvas) {
        const container = canvasWrapper.value;

        if (container) {
            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;

            // Define o tamanho do canvas para não ultrapassar o container
            fabricCanvas.setDimensions({
                width: containerWidth,
                height: containerHeight
            });

            fabricCanvas.renderAll();

            // Atualiza a área de desenho após redimensionar (a menos que seja pulado)
            if (!skipDrawingArea) {
                await addDrawingArea();
            }
        }
    }
}

/**
 * Atualiza a largura do pincel baseada no nível de zoom
 */
function updateBrushWidth() {
    if (fabricCanvas && fabricCanvas.freeDrawingBrush) {
        const adjustedWidth = objectStrokeWidthMultiplier.value * baseStrokeWidth.value;
        fabricCanvas.freeDrawingBrush.width = adjustedWidth;
    }
}


/**
 * Desativa o modo de desenho, voltando ao modo padrão de seleção de objetos.
 */
function activateSelectionMode() {
    activeTool.value = 'select';
    if (fabricCanvas) {
        fabricCanvas.isDrawingMode = false;
        fabricCanvas.selection = true; // Habilita seleção quando ferramenta de seleção está ativa
        fabricCanvas.defaultCursor = 'default';
        fabricCanvas.hoverCursor = 'default';
    }
}

function setActiveTool(tool) {
    if (tool !== activeTool.value) {
        fabricCanvas.discardActiveObject();
    }

    activeTool.value = tool;

    // Reseta para o padrão: seleção ativa, modo de desenho desativado
    fabricCanvas.isDrawingMode = false;
    fabricCanvas.selection = true;
    fabricCanvas.defaultCursor = 'default';
    fabricCanvas.hoverCursor = 'default';

    switch (tool) {
        case 'select':
            activateSelectionMode();
            break;

        case 'draw':
            // Ativa o modo de desenho livre
            fabricCanvas.isDrawingMode = true;
            fabricCanvas.freeDrawingBrush = new PencilBrush(fabricCanvas);
            fabricCanvas.freeDrawingBrush.width = parseInt(objectStrokeWidthMultiplier.value, 10) || 1;
            fabricCanvas.freeDrawingBrush.color = lineStrokeColor.value; // Define a cor inicial
            fabricCanvas.defaultCursor = 'crosshair';
            fabricCanvas.hoverCursor = 'crosshair';
            break;

        case 'rectangle':
            // Desativa o modo de desenho, mas permite seleção para modificar o retângulo
            fabricCanvas.isDrawingMode = false;
            fabricCanvas.selection = false;
            fabricCanvas.defaultCursor = 'crosshair';
            fabricCanvas.hoverCursor = 'crosshair';
            break;

        case 'circle':
            // Desativa o modo de desenho, mas permite seleção para modificar o círculo
            fabricCanvas.isDrawingMode = false;
            fabricCanvas.selection = false;
            fabricCanvas.defaultCursor = 'crosshair';
            fabricCanvas.hoverCursor = 'crosshair';
            break;

        case 'triangle':
            // Desativa o modo de desenho, mas permite seleção para modificar o triângulo
            fabricCanvas.isDrawingMode = false;
            fabricCanvas.selection = false;
            fabricCanvas.defaultCursor = 'crosshair';
            fabricCanvas.hoverCursor = 'crosshair';
            break;

        case 'line':
            // Desativa o modo de desenho, mas permite seleção para modificar a linha
            fabricCanvas.isDrawingMode = false;
            fabricCanvas.selection = false;
            fabricCanvas.defaultCursor = 'crosshair';
            fabricCanvas.hoverCursor = 'crosshair';
            break;

        case 'text':
            // Desativa a seleção para evitar selecionar outros objetos ao clicar para criar texto
            fabricCanvas.isDrawingMode = false;
            fabricCanvas.selection = false;
            fabricCanvas.defaultCursor = 'text';
            fabricCanvas.hoverCursor = 'text';
            break;
        case 'arrow':
            // Desativa o modo de desenho, mas permite seleção para modificar a seta
            fabricCanvas.isDrawingMode = false;
            fabricCanvas.selection = false;
            fabricCanvas.defaultCursor = 'crosshair';
            fabricCanvas.hoverCursor = 'crosshair';
            break;
        case 'eraser':
            fabricCanvas.freeDrawingBrush = eraser.value;
            fabricCanvas.isDrawingMode = true;
            fabricCanvas.freeDrawingBrush.width = parseInt(objectStrokeWidthMultiplier.value, 10) * 2 || 1;
            fabricCanvas.defaultCursor = 'crosshair';
            fabricCanvas.hoverCursor = 'crosshair';
            break;

        default:
            // Se a ferramenta não for reconhecida, volta para o modo de seleção
            activateSelectionMode();
            break;
    }

    fabricCanvas.requestRenderAll();
}

async function addWatermark() {
    if (!showWatermark.value || !fabricCanvas) return;

    const existingWatermark = fabricCanvas.getObjects().find(obj => obj.id === 'watermark');
    if (existingWatermark) {
        watermark.value = existingWatermark;
        fabricCanvas.bringObjectToFront(existingWatermark);
        updateWatermarkPosition();
        return;
    }

    await Promise.all([
        FabricImage.fromURL(logoSettings.value.url, { crossOrigin: 'anonymous' })
    ]).then(([watermarkObj]) => {
        console.log('💧 Watermark image loaded - original dimensions:', watermarkObj.width, 'x', watermarkObj.height);
        
        // Calcula escala baseada no drawingArea
        let calculatedScale = 0.2; // fallback
        if (drawingArea.value) {
            const targetWidth = drawingArea.value.width * watermarkWidthPercent;
            calculatedScale = targetWidth / watermarkObj.width;
            console.log('💧 addWatermark: drawingArea width:', drawingArea.value.width.toFixed(1),
                        '| target watermark width (20%):', targetWidth.toFixed(1),
                        '| calculated scale:', calculatedScale.toFixed(3));
        }

        watermarkObj.set({
            includeDefaultValues: true,
            opacity: logoSettings.value.opacity ? parseFloat(logoSettings.value.opacity) : 1,
            selectable: false,
            evented: false,
            excludeFromExport: !showWatermark.value,
            hoverCursor: 'default',
            id: 'watermark',
            scaleX: calculatedScale,
            scaleY: calculatedScale,
            objectFit: 'fill', // Estica a imagem para preencher o espaço
        });
        
        console.log('💧 Watermark after set - scaleX:', watermarkObj.scaleX, 'scaleY:', watermarkObj.scaleY,
                    '| scaled width:', watermarkObj.getScaledWidth().toFixed(1));
        
        watermark.value = watermarkObj;
        fabricCanvas.add(watermarkObj);
        updateWatermarkPosition();
        fabricCanvas.bringObjectToFront(watermarkObj);
        fabricCanvas.requestRenderAll();
    });
}

async function toggleWatermark() {
    
    showWatermark.value = !showWatermark.value;
    
    if (showWatermark.value) {
        await addWatermark();
    } else {
        if (watermark.value && fabricCanvas) {
            const existingWatermark = fabricCanvas.getObjects().find(obj => obj.id === 'watermark');
            fabricCanvas.remove(existingWatermark);
        }
    }

    setTimeout(() => {
        fabricCanvas.renderAll();
    }, 1000);
}

/**
 * Atualiza a posição e escala da marca d'água (proporcional à largura do drawingArea)
 */
function updateWatermarkPosition() {
    
    if (!fabricCanvas || !watermark.value || !drawingArea.value) return;

    const margin = 20;

    // Calcula as coordenadas do drawingArea (considerando que tem originX/Y: center)
    const drawingAreaWidth = drawingArea.value.width;
    const drawingAreaHeight = drawingArea.value.height;
    const drawingAreaLeft = drawingArea.value.left - (drawingAreaWidth / 2);
    const drawingAreaTop = drawingArea.value.top - (drawingAreaHeight / 2);
    const drawingAreaRight = drawingAreaLeft + drawingAreaWidth;
    const drawingAreaBottom = drawingAreaTop + drawingAreaHeight;

    // Calcula escala para que a marca d'água ocupe a porcentagem definida da largura do drawingArea
    const targetWidth = drawingAreaWidth * watermarkWidthPercent;
    const newScale = targetWidth / watermark.value.width;
    
    console.log('💧 updateWatermarkPosition: drawingArea width:', drawingAreaWidth.toFixed(1), 
                '| target watermark width:', targetWidth.toFixed(1), 
                '| calculated scale:', newScale.toFixed(3));
    
    // Atualiza a escala da marca d'água
    watermark.value.set({
        scaleX: newScale,
        scaleY: newScale,
        objectFit: 'fill', // Estica a imagem para preencher o espaço
    });

    const watermarkWidth = watermark.value.getScaledWidth();
    const watermarkHeight = watermark.value.getScaledHeight();
    
    console.log('💧 Watermark scaled width:', watermarkWidth.toFixed(1), 'height:', watermarkHeight.toFixed(1));

    let left = 0;
    let top = 0;


    switch (logoSettings.value.position) {
        case 'top-left':
            left = drawingAreaLeft + margin;
            top = drawingAreaTop + margin;
            break;
        case 'top-right':
            left = drawingAreaRight - watermarkWidth - margin;
            top = drawingAreaTop + margin;
            break;
        case 'bottom-left':
            left = drawingAreaLeft + margin;
            top = drawingAreaBottom - watermarkHeight - margin;
            break;
        case 'center':
            left = drawingAreaLeft + (drawingAreaWidth - watermarkWidth) / 2;
            top = drawingAreaTop + (drawingAreaHeight - watermarkHeight) / 2;
            break;
        case 'top-center':
            left = drawingAreaLeft + (drawingAreaWidth - watermarkWidth) / 2;
            top = drawingAreaTop + margin;
            break;
        case 'bottom-center':
            left = drawingAreaLeft + (drawingAreaWidth - watermarkWidth) / 2;
            top = drawingAreaBottom - watermarkHeight - margin;
            break;
        case 'bottom-right':
        default:
            left = drawingAreaRight - watermarkWidth - margin;
            top = drawingAreaBottom - watermarkHeight - margin;
            break;
    }

    // Atualiza posição da marca d'água (escala já foi atualizada acima)
    watermark.value.set({
        left: left,
        top: top,
        visible: showWatermark.value,
        excludeFromExport: !showWatermark.value,
    });
    watermark.value.setCoords();

    fabricCanvas.renderAll();
}

function bringObjectToFront() {
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject) {
        fabricCanvas.bringObjectToFront(activeObject);

        // watermark always on top
        if (watermark.value) {
            fabricCanvas.bringObjectToFront(watermark.value);
        }

        fabricCanvas.requestRenderAll();
        saveCanvasState();
    }
}

function sendObjectToBack() {
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject) {
        fabricCanvas.sendObjectToBack(activeObject);

        // first and second images always at the back
        if (firstImage.value) {
            fabricCanvas.sendObjectToBack(firstImage.value);
        }
        if (secondImage.value) {
            fabricCanvas.sendObjectToBack(secondImage.value);
        }

        fabricCanvas.requestRenderAll();
        saveCanvasState();
    }
}

function bringObjectForward() {
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject) {
        fabricCanvas.bringObjectForward(activeObject);

        // watermark always on top
        if (watermark.value) {
            fabricCanvas.bringObjectToFront(watermark.value);
        }

        fabricCanvas.requestRenderAll();
        saveCanvasState();
    }
}
function sendObjectBackwards() {
    const activeObject = fabricCanvas.getActiveObject();

    if (activeObject) {
        fabricCanvas.sendObjectBackwards(activeObject);

        // first and second images always at the back
        if (firstImage.value) {
            fabricCanvas.sendObjectToBack(firstImage.value);
        }
        if (secondImage.value) {
            fabricCanvas.sendObjectToBack(secondImage.value);
        }

        fabricCanvas.requestRenderAll();
        saveCanvasState();
    }
}

async function duplicateActiveObject() {
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject) {
        const cloned = await activeObject.clone();

        cloned.set({
            left: cloned.left + 20,
            top: cloned.top + 20,
            evented: true,
            selectable: true,
            id: `${cloned.id}-copy-${Date.now()}`,
        });
        fabricCanvas.add(cloned);
        fabricCanvas.setActiveObject(cloned);
        fabricCanvas.requestRenderAll();
        saveCanvasState();
    }
}

function deleteActiveObject() {
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject) {
        fabricCanvas.remove(activeObject);
        fabricCanvas.discardActiveObject();
        fabricCanvas.requestRenderAll();
        saveCanvasState();
    }
}

async function toggleCropper() {
    imageToCrop.value = fabricCanvas.getActiveObject();
    showCropperModal.value = !showCropperModal.value;
}

/**
 * Retorna objetos que são "cromo" do editor e não devem aparecer na exportação.
 * Mantém imagens principais e objetos do usuário intactos.
 */
function getEditorChromeObjects() {
    if (!fabricCanvas) return [];
    return fabricCanvas.getObjects().filter((obj) => {
        if (!obj) return false;
        // Bordas/área do editor
        if (obj.id === 'drawingArea') return true;
        // Handlers de resize do editor
        if (obj.class === 'resize-handle') return true;
        // Clones temporários de hover (highlight)
        if (typeof obj.id === 'string' && obj.id.endsWith('-hover')) return true;
        return false;
    });
}

/**
 * Esconde temporariamente o cromo do editor (drawingArea/handlers/hover) para exportação.
 * IMPORTANTE: também limpa stroke/fill/border dos clipPaths e drawingArea para evitar linhas de 1px.
 * Remove indicadores de seleção (borders, controls, corners) e estados de hover de TODOS os objetos.
 * Adiciona um retângulo branco temporário de fundo no lugar do drawingArea.
 * Retorna uma função para restaurar o estado original.
 */
function hideEditorChromeForExport() {
    // 1) Descarta qualquer objeto ativo (remove selection box)
    fabricCanvas.discardActiveObject();
    
    // 2) Limpa todos os estados de hover (clones temporários de highlight) - AGRESSIVAMENTE
    clearAllHoverStates();
    
    // 2.1) Remove QUALQUER objeto com id contendo '-hover' (dupla verificação robusta)
    const hoverObjects = fabricCanvas.getObjects().filter(obj => 
        obj?.id && typeof obj.id === 'string' && obj.id.includes('-hover')
    );
    hoverObjects.forEach(obj => fabricCanvas.remove(obj));
    
    // 2.2) Force render após remoção dos hovers
    fabricCanvas.requestRenderAll();
    
    // 3) REMOVE FISICAMENTE o cromo do editor (drawingArea, handlers, etc) do canvas
    // Não basta marcar como invisible - o toCanvasElement() ignora isso!
    const chrome = getEditorChromeObjects();
    const previous = chrome.map((obj) => ({
        obj,
        visible: obj.visible,
        excludeFromExport: obj.excludeFromExport,
        opacity: obj.opacity,
    }));

    // Remove todos os objetos de chrome do canvas (serão readicionados depois)
    chrome.forEach((obj) => {
        fabricCanvas.remove(obj);
    });

    // 4) Remove temporariamente borders/controls/corners de TODOS os objetos (não só do cromo)
    const allObjectsControlsPrev = [];
    fabricCanvas.getObjects().forEach((obj) => {
        if (!obj) return;
        allObjectsControlsPrev.push({
            obj,
            hasBorders: obj.hasBorders,
            hasControls: obj.hasControls,
            borderColor: obj.borderColor,
            cornerColor: obj.cornerColor,
            cornerStrokeColor: obj.cornerStrokeColor,
            transparentCorners: obj.transparentCorners,
        });
        obj.set({
            hasBorders: false,
            hasControls: false,
            borderColor: null,
            cornerColor: null,
            cornerStrokeColor: null,
        });
    });

    // 5) Limpa stroke/border do drawingArea (pode causar linhas mesmo com strokeWidth: 0)
    const drawingAreaPrev = drawingArea.value ? {
        stroke: drawingArea.value.stroke,
        strokeWidth: drawingArea.value.strokeWidth,
        hasBorders: drawingArea.value.hasBorders,
        borderColor: drawingArea.value.borderColor,
    } : null;

    if (drawingArea.value) {
        drawingArea.value.set({
            stroke: null,
            strokeWidth: 0,
            hasBorders: false,
            borderColor: null,
        });
    }

    // 6) Limpa fill/stroke dos clipPaths (red/blue podem vazar 1px)
    const clipPathsPrev = [];
    if (firstClipPath.value) {
        clipPathsPrev.push({
            obj: firstClipPath.value,
            fill: firstClipPath.value.fill,
            stroke: firstClipPath.value.stroke,
            strokeWidth: firstClipPath.value.strokeWidth,
        });
        firstClipPath.value.set({
            fill: null,
            stroke: null,
            strokeWidth: 0,
        });
    }
    if (secondClipPath.value) {
        clipPathsPrev.push({
            obj: secondClipPath.value,
            fill: secondClipPath.value.fill,
            stroke: secondClipPath.value.stroke,
            strokeWidth: secondClipPath.value.strokeWidth,
        });
        secondClipPath.value.set({
            fill: null,
            stroke: null,
            strokeWidth: 0,
        });
    }

    // 7) Cria retângulo branco temporário de fundo (abaixo de tudo)
    let tempBackground = null;
    if (drawingArea.value) {
        tempBackground = new Rect({
            left: drawingArea.value.left,
            top: drawingArea.value.top,
            width: drawingArea.value.width,
            height: drawingArea.value.height,
            fill: '#FFFFFF',
            stroke: null,
            strokeWidth: 0,
            selectable: false,
            evented: false,
            originX: 'center',
            originY: 'center',
            id: '__export_bg__',
        });
        fabricCanvas.add(tempBackground);
        fabricCanvas.sendObjectToBack(tempBackground);
        if (firstImage.value) fabricCanvas.sendObjectToBack(firstImage.value);
        if (secondImage.value) fabricCanvas.sendObjectToBack(secondImage.value);
        if (tempBackground) fabricCanvas.sendObjectToBack(tempBackground);
    }

    fabricCanvas.requestRenderAll();

    return () => {
        // Remove o fundo temporário
        if (tempBackground) {
            fabricCanvas.remove(tempBackground);
        }

        // Readiciona os objetos de chrome ao canvas (foram removidos para a exportação)
        chrome.forEach((obj) => {
            fabricCanvas.add(obj);
        });

        // Restaura propriedades do chrome
        previous.forEach(({ obj, visible, excludeFromExport, opacity }) => {
            obj.set({
                visible,
                excludeFromExport,
                opacity,
            });
        });

        // Restaura controls/borders de todos os objetos
        allObjectsControlsPrev.forEach(({ obj, hasBorders, hasControls, borderColor, cornerColor, cornerStrokeColor, transparentCorners }) => {
            obj.set({
                hasBorders,
                hasControls,
                borderColor,
                cornerColor,
                cornerStrokeColor,
                transparentCorners,
            });
        });

        // Restaura clipPaths
        clipPathsPrev.forEach(({ obj, fill, stroke, strokeWidth }) => {
            obj.set({ fill, stroke, strokeWidth });
        });

        // Restaura drawingArea
        if (drawingAreaPrev && drawingArea.value) {
            drawingArea.value.set(drawingAreaPrev);
        }

        fabricCanvas.requestRenderAll();
    };
}

/**
 * Retângulo de recorte (crop) para exportar exatamente a área de desenho.
 * Arredonda valores para evitar linhas de 1px por subpixel.
 */
function getExportCropRect(drawingAreaObj, insetPx = 0) {
    if (!drawingAreaObj) return null;
    // Usa a geometria do próprio drawingArea (origin center) — evita discrepâncias do boundingRect
    const raw = {
        left: Math.round(drawingAreaObj.left - drawingAreaObj.width / 2),
        top: Math.round(drawingAreaObj.top - drawingAreaObj.height / 2),
        width: Math.round(drawingAreaObj.width),
        height: Math.round(drawingAreaObj.height),
    };

    // Inset para remover linhas/halo de 1px (antialias/subpixel) do contorno do editor/clip
    const inset = Math.max(0, Math.floor(insetPx || 0));
    let left = raw.left + inset;
    let top = raw.top + inset;
    let width = raw.width - inset * 2;
    let height = raw.height - inset * 2;

    // Evita valores inválidos
    width = Math.max(1, width);
    height = Math.max(1, height);

    // Clampa dentro do canvas (evita “vazar” 1px e pegar background)
    if (fabricCanvas) {
        const maxW = fabricCanvas.getWidth();
        const maxH = fabricCanvas.getHeight();
        left = Math.max(0, Math.min(left, maxW - 1));
        top = Math.max(0, Math.min(top, maxH - 1));
        width = Math.min(width, maxW - left);
        height = Math.min(height, maxH - top);
    }

    return { left, top, width, height };
}

/**
 * Força um fundo sólido (normalmente branco) durante a exportação para evitar "bordas" do background do canvas.
 * Retorna uma função para restaurar o background anterior.
 */
function setCanvasBackgroundForExport(color = '#FFFFFF') {
    if (!fabricCanvas) return () => {};
    const prev = fabricCanvas.backgroundColor;
    fabricCanvas.backgroundColor = color;
    fabricCanvas.requestRenderAll();
    return () => {
        fabricCanvas.backgroundColor = prev;
        fabricCanvas.requestRenderAll();
    };
}

/**
 * Alinha objetos críticos em coordenadas inteiras (pixel grid) para evitar linhas finas por antialias/subpixel.
 * Em modos com divisão por 2, força dimensão par para o "meio" cair em inteiro.
 */
async function snapCriticalGeometryForExport() {
    if (!fabricCanvas || !drawingArea.value) return () => {};

    const snapshots = [];
    const snapSet = (obj, props) => {
        if (!obj) return;
        const prev = {};
        Object.keys(props).forEach((k) => { prev[k] = obj[k]; });
        snapshots.push({ obj, prev });
        obj.set(props);
        obj.setCoords?.();
    };

    // 1) Snap do drawingArea (mantém scale normalizada)
    let daW = Math.round(drawingArea.value.width);
    let daH = Math.round(drawingArea.value.height);
    const daLeft = Math.round(drawingArea.value.left);
    const daTop = Math.round(drawingArea.value.top);

    // Força dimensão par quando o layout divide por 2, para evitar clipWidth/clipHeight .5
    if (displayMode.value === 'ltr' && daW % 2 !== 0) daW += 1;
    if (displayMode.value === 'ttb' && daH % 2 !== 0) daH += 1;

    snapSet(drawingArea.value, {
        left: daLeft,
        top: daTop,
        width: daW,
        height: daH,
        scaleX: 1,
        scaleY: 1,
    });

    // 2) Recalcula e snap dos clipPaths com base no drawingArea alinhado
    await updateClipPathsSize();
    if (firstClipPath.value) {
        snapSet(firstClipPath.value, {
            left: Math.round(firstClipPath.value.left),
            top: Math.round(firstClipPath.value.top),
            width: Math.round(firstClipPath.value.width),
            height: Math.round(firstClipPath.value.height),
        });
    }
    if (secondClipPath.value) {
        snapSet(secondClipPath.value, {
            left: Math.round(secondClipPath.value.left),
            top: Math.round(secondClipPath.value.top),
            width: Math.round(secondClipPath.value.width),
            height: Math.round(secondClipPath.value.height),
        });
    }

    // 3) Snap leve das imagens (ajuda se elas estiverem em .5)
    if (firstImage.value) {
        snapSet(firstImage.value, {
            left: Math.round(firstImage.value.left),
            top: Math.round(firstImage.value.top),
        });
    }
    if (secondImage.value) {
        snapSet(secondImage.value, {
            left: Math.round(secondImage.value.left),
            top: Math.round(secondImage.value.top),
        });
    }

    fabricCanvas.requestRenderAll();

    // restore
    return () => {
        // restaura na ordem inversa pra reduzir inconsistência visual
        for (let i = snapshots.length - 1; i >= 0; i--) {
            const { obj, prev } = snapshots[i];
            obj.set(prev);
            obj.setCoords?.();
        }
        fabricCanvas.requestRenderAll();
    };
}

async function finishDrawing() {
    finishing.value = true;
    if (fabricCanvas && drawingArea) {
        // Desabilita seleção e interação após finalizar
        fabricCanvas.selection = false;
        fabricCanvas.defaultCursor = 'default';
        fabricCanvas.hoverCursor = 'default';
        
        // Desabilita eventos de interação em todos os objetos
        const allObjects = fabricCanvas.getObjects();
        allObjects.forEach(obj => {
            obj.set({
                selectable: false,
                evented: false,
                hoverCursor: 'default',
            });
        });
        
        if (fabricCanvas.isDrawingMode) {
            fabricCanvas.isDrawingMode = false;
            fabricCanvas.requestRenderAll();
            saveCanvasState();
        }

        // set opacity to 0 for all resize handles
        toggleResizeHandles(false);

        if(showWatermark.value && watermark.value) {
            const watermark = fabricCanvas.getObjects().find(obj => obj.id === 'watermark');
            if (watermark) {
                watermark.set({
                    visible: true,
                    excludeFromExport: false,
                });
                fabricCanvas.bringObjectToFront(watermark);
            }
        }

        fabricCanvas.requestRenderAll();

        // Limpa seleção e estados de hover (não faz parte do resultado)
        clearAllHoverStates();
        fabricCanvas.discardActiveObject();
        fabricCanvas.requestRenderAll();

        const origVptTransform = Object.assign(
            [],
            fabricCanvas.viewportTransform
        );
        fabricCanvas.viewportTransform = [1, 0, 0, 1, 0, 0];
        fabricCanvas.setViewportTransform(fabricCanvas.viewportTransform);

        // bring watermark to front
        if (watermark.value) {
            fabricCanvas.bringObjectToFront(watermark.value);
        }

        // Fundo branco durante exportação para não vazar o cinza do canvas (#F1F5F9)
        const restoreBackground = setCanvasBackgroundForExport('#FFFFFF');

        // Alinha geometria crítica em pixel-grid (evita linhas finas no topo/baixo)
        const restoreSnapping = await snapCriticalGeometryForExport();

        // IMPORTANT: esconde apenas o cromo do editor durante a exportação
        const restoreChrome = hideEditorChromeForExport();

        fabricCanvas.requestRenderAll();

        // Dupla verificação: lista todos os objetos para debug
        const allObjsIds = fabricCanvas.getObjects().map(o => ({ id: o.id, type: o.type, class: o.class }));
        console.log('🔍 Objects before export:', allObjsIds);
        
        // Verifica se ainda há hover escapando
        const remainingHovers = fabricCanvas.getObjects().filter(o => 
            o?.id && typeof o.id === 'string' && o.id.includes('-hover')
        );
        if (remainingHovers.length > 0) {
            console.warn('⚠️ Found remaining hover objects:', remainingHovers.map(o => o.id));
            remainingHovers.forEach(obj => fabricCanvas.remove(obj));
            fabricCanvas.requestRenderAll();
        }

        await new Promise((resolve) => setTimeout(resolve, 1000)); // Esperamos um segundo para garantir que o canvas foi redesenhado

        // log check if watermark is visible
        if (showWatermark.value && watermark.value) {
            const watermark = fabricCanvas.getObjects().find(obj => obj.id === 'watermark');
            console.log('Watermark visibility on export:', watermark ? watermark.visible : 'not found');
        }

        // Recorta exatamente a área do drawingArea (agora alinhada em pixel-grid)
        const crop = getExportCropRect(drawingArea.value, 0);
        const data = await new Promise((resolve, reject) => {
            fabricCanvas
                .toCanvasElement(1, crop)
                .toBlob(
                    (blob) => {
                        if (blob) resolve(blob);
                        else reject("Houve um erro ao gerar a imagem.");
                    },
                    "image/png",
                    1
                );
        });

        // reseta o viewport para o original
        fabricCanvas.viewportTransform = origVptTransform;
        fabricCanvas.setViewportTransform(fabricCanvas.viewportTransform);
        fabricCanvas.renderAll();

        // Restaura o cromo do editor após exportar
        restoreChrome();
        restoreSnapping();
        restoreBackground();

        emit('finished', data);

        // após exportar, o editor pode continuar visível normalmente
        fabricCanvas.requestRenderAll();

        setTimeout(() => {
            finishing.value = false;
            toggleResizeHandles(true);
            return data;
        }, 100);
    }
}

async function toggleResizeHandles(show) {
    if (!fabricCanvas) return;

    const handles = fabricCanvas.getObjects().filter(o => o.class === 'resize-handle');
    handles.forEach(handle => {
        handle.set({
            opacity: show ? 1 : 0,
            evented: show,
        });
    });

    fabricCanvas.requestRenderAll();
}

async function compareImages() {
    if (fabricCanvas && firstImage.value && secondImage.value) {
        
        // Salva o viewport transform original
        const origVptTransform = Object.assign(
            [],
            fabricCanvas.viewportTransform
        );
        
        // Reseta o viewport para capturar as imagens sem transformação
        fabricCanvas.viewportTransform = [1, 0, 0, 1, 0, 0];
        fabricCanvas.setViewportTransform(fabricCanvas.viewportTransform);
        fabricCanvas.requestRenderAll();

        // Criar uma imagem da firstImage cortada pelo clipPath
        const objects = fabricCanvas.getObjects();
        const fiClone = await objects.find(obj => obj.id === 'firstImage').clone();
        const siClone = await objects.find(obj => obj.id === 'secondImage').clone();

        const firstImageDataUrl = await new Promise( async (resolve, reject) => {
            
            const clipPath = fiClone.clipPath;
            const tempCanvas = new Canvas(null, {
                width: clipPath.width,
                height: clipPath.height,
            });
            
            // Com absolutePositioned: true, o clipPath tem coordenadas absolutas ao canvas
            // Precisamos calcular a posição da imagem relativa ao clipPath
            // A nova posição será: onde a imagem estava - onde o clipPath estava
            const newLeft = fiClone.left - clipPath.left;
            const newTop = fiClone.top - clipPath.top;
            
            // Remove o clipPath e posiciona a imagem no canvas temporário
            fiClone.set({
                left: newLeft,
                top: newTop,
                clipPath: null,
            });
            
            tempCanvas.add(fiClone);
            tempCanvas.requestRenderAll();
            // tempCanvas.toDataURL({
            //     format: 'png',
            //     quality: 1,
            //     multiplier: 1,
            // }, (dataUrl) => {
            //     tempCanvas.dispose();
            //     resolve(dataUrl);
            // });

            tempCanvas.toCanvasElement(1, {
                width: clipPath.width,
                height: clipPath.height,
            })
            .toBlob(
                (blob) => {
                    if (blob) resolve(blob);
                    else reject("Houve um erro ao gerar a imagem.");
                },
                "image/png",
                1
            );

        });
        

        // Criar uma imagem da secondImage cortada pelo clipPath
        const secondImageDataUrl = await new Promise((resolve, reject) => {
            const clipPath = siClone.clipPath;
            const tempCanvas = new Canvas(null, {
                width: clipPath.width,
                height: clipPath.height,
            });
            
            // Com absolutePositioned: true, o clipPath tem coordenadas absolutas ao canvas
            // Precisamos calcular a posição da imagem relativa ao clipPath
            // A nova posição será: onde a imagem estava - onde o clipPath estava
            const newLeft = siClone.left - clipPath.left;
            const newTop = siClone.top - clipPath.top;
            
            // Remove o clipPath e posiciona a imagem no canvas temporário
            siClone.set({
                left: newLeft,
                top: newTop,
                clipPath: null,
            });

            tempCanvas.add(siClone);
            tempCanvas.requestRenderAll();

            tempCanvas.toCanvasElement(1, {
                width: clipPath.width,
                height: clipPath.height,
            })
            .toBlob(
                (blob) => {
                    if (blob) resolve(blob);
                    else reject("Houve um erro ao gerar a imagem.");
                },
                "image/png",
                1
            );
        });

        // Reseta o viewport para o original
        fabricCanvas.viewportTransform = origVptTransform;
        fabricCanvas.setViewportTransform(fabricCanvas.viewportTransform);
        fabricCanvas.requestRenderAll();

        // Armazena as URLs nas variáveis reativas para uso no componente Compare
        imagesToCompare.value.first = firstImageDataUrl;
        imagesToCompare.value.second = secondImageDataUrl;

        showCompareModal.value = true;
    }
}

// Exposição de métodos para uso externo
defineExpose({
    setZoomLimits,
    setZoom,
    resetZoom,
    zoomIn,
    zoomOut,
    fitToCanvas,
    undo,
    redo,
    getZoomLevel: () => zoomLevel.value,
    getZoomLimits: () => ({ min: minZoom.value, max: maxZoom.value })
});

</script>

<style>
/* === DOCUMENTAÇÃO DO ESTILO === */
/* Como estamos usando o plugin '@tailwindcss/vite', esta única linha é suficiente
   para que o Tailwind processe as classes usadas no template e injete o CSS
   necessário dentro do Shadow DOM do web component. Isso garante que o estilo
   fique encapsulado e não vaze para o resto da página. */
@import "@/assets/main.css";


/* .canvas-container {
    width: 100% !important;
    height: 100% !important;
    position: relative;
} */
</style>