import useCommonStore from '@/stores/common.js';


// Aplica estilos personalizados aos controles de transformação dos objetos
function applyStyleToControls(...objects) {
    const commonStore = useCommonStore();

    const brandColor = commonStore.brandColor;
    objects.forEach(obj => {
        if (!obj) return;
        obj.set({
            borderColor: brandColor,
            cornerColor: brandColor,
            cornerStyle: 'circle',
            cornerSize: 10,
            touchCornerSize: 28, // área de toque maior pras alças no celular
            transparentCorners: false,
            hasControls: true,
            hasBorders: true
        });
    });
}

export { applyStyleToControls };
