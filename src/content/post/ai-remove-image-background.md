---
layout: ../../layouts/post.astro
title: El navegador usa IA localmente para eliminar fondos de imágenes
description: El navegador usa IA localmente para eliminar fondos de imágenes
dateFormatted: 10 Julio 2025
---

Últimamente he estado explorando todo este tema de la inteligencia artificial en el desarrollo front-end, ¡y me topé con un ejemplo genial usando **Transformers.js**! Lo convertí en una pequeña herramienta muy útil, ¡échale un vistazo!

Básicamente, utiliza **Transformers.js** dentro de un **WebWorker** para aprovechar **WebGPU** y ejecutar el modelo **RMBG-1.4**. En resumen: ahora puedes usar IA para eliminar el fondo de imágenes *directamente en tu navegador*. Y lo mejor: ¡tarda solo medio segundo en procesar una imagen 4K en mi Mac M1 PRO!

Aquí está el enlace a la herramienta: [https://html.zone/background-remover](https://html.zone/background-remover)

[![AI background remover](https://og-image.html.zone/https://html.zone/background-remover)](https://html.zone/background-remover)

* * *

¿Quieres construirla tú mismo?   Visita el repositorio en GitHub [https://github.com/xenova/transformers.js/tree/main/examples/remove-background-client](https://github.com/xenova/transformers.js/tree/main/examples/remove-background-client) Ojo: necesitas usar **Transformers.js versión 3 o superior** para que funcione con WebGPU.