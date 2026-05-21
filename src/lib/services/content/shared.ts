import type { Phase } from './types';

export const SHARED_PHASES: Record<'en' | 'es', Phase[]> = {
    en: [
        {
            number: '01', name: 'Discovery & scope',
            description: 'Align on goals, audience, scope and content list.',
            deliverable: 'written scope and timeline',
        },
        {
            number: '02', name: 'Design & planning',
            description: 'Mockups and architecture signed off before building.',
            deliverable: 'design and architecture approved',
        },
        {
            number: '03', name: 'Build',
            description: 'Core implementation with regular preview builds.',
            deliverable: 'feature-complete preview build',
        },
        {
            number: '04', name: 'QA & polish',
            description: 'Testing, performance profiling and bug fixing.',
            deliverable: 'release-candidate build',
        },
        {
            number: '05', name: 'Launch & handover',
            description: 'Deploy, post-launch fixes, repository and docs transferred.',
            deliverable: 'live with full ownership in your hands',
        },
    ],
    es: [
        {
            number: '01', name: 'Descubrimiento y alcance',
            description: 'Alineamos objetivos, público, alcance y lista de contenidos.',
            deliverable: 'alcance y plazos por escrito',
        },
        {
            number: '02', name: 'Diseño y planificación',
            description: 'Mockups y arquitectura aprobados antes de empezar a construir.',
            deliverable: 'diseño y arquitectura aprobados',
        },
        {
            number: '03', name: 'Desarrollo',
            description: 'Implementación del núcleo con builds de previsualización periódicas.',
            deliverable: 'build de previsualización con todas las funciones',
        },
        {
            number: '04', name: 'QA y pulido',
            description: 'Pruebas, perfilado de rendimiento y corrección de errores.',
            deliverable: 'build candidata a lanzamiento',
        },
        {
            number: '05', name: 'Lanzamiento y entrega',
            description: 'Despliegue, correcciones post-lanzamiento y traspaso del repositorio y la documentación.',
            deliverable: 'en producción y con la propiedad completa en tus manos',
        },
    ],
};
