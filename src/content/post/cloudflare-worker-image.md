---
layout: ../../layouts/post.astro
title: Procesamiento de imágenes con Cloudflare Worker
description: Procesamiento de imágenes con Cloudflare Worker
dateFormatted: 18 noviembre 2024
---

## Contexto

Hace un tiempo configuré un almacenamiento en la nube de 10 GB con ancho de banda ilimitado usando [Backblaze B2](https://www.backblaze.com/cloud-storage) y Cloudflare, el cual uso tanto para compartir archivos como para alojar imágenes de mi blog. Funciona muy bien con **uPic**. Sin embargo, al usarlo como servicio de alojamiento de imágenes, noté que no admite redimensionamiento ni recorte. En el trabajo uso **Alibaba Cloud OSS** para procesar imágenes, y no podía conformarme con esta limitación, así que decidí crear mi propio servicio.

> La versión gratuita de Workers solo permite 10 ms de CPU, lo que con frecuencia supera los límites de uso, provocando fallas en la carga de imágenes. Actualmente migré a **Vercel Edge**, que puede usarse junto a un CDN. Ver: [https://chi.miantiao.me/post/cloudflare-worker-image/](https://chi.miantiao.me/post/cloudflare-worker-image/)

## Proceso

Tras investigar un poco, consideré dos opciones:

1. **Usar Cloudflare para hacer proxy a [Vercel Image](https://vercel.com/docs/image-optimization).**  
   Esto implica el flujo Cloudflare → Vercel → Cloudflare → Backblaze, lo cual afecta la estabilidad y la velocidad. Además, el límite gratuito es de solo **1000 solicitudes por mes**, lo cual es muy poco.

2. **Usar el servicio público [wsrv.nl](https://images.weserv.nl/).**  
   Aquí el flujo es Cloudflare → wsrv.nl → Cloudflare → Backblaze, pero el dominio no está bajo mi control. Si quiero tener control sobre el dominio, debo pasar otra vez por Workers, lo que complica todo.

Como ninguna opción me convencía, seguí investigando. La semana pasada, mientras trabajaba en un Email Worker, descubrí que **Cloudflare Worker admite [WebAssembly (WASM)](https://developers.cloudflare.com/workers/runtime-apis/webassembly/)**, lo que me dio la idea de usar Worker + WebAssembly para procesar imágenes.

Mi primera opción fue usar [sharp](https://sharp.pixelplumbing.com/), que ya conocía desde Node.js. Sin embargo, su autor explicó que **Cloudflare Worker no admite multithreading**, por lo que *sharp* no puede ejecutarse allí, al menos por ahora.

Buscando alternativas, encontré una popular librería en Rust llamada **[Photon](https://silvia-odwyer.github.io/photon/)**, junto con un [demo funcional](https://github.com/techwithdeo/cloudflare-workers/tree/main/photon-library). La probé y funcionó correctamente en Cloudflare Workers. Sin embargo, el demo tiene dos desventajas:

1. Photon necesita ser actualizado manualmente, y no sigue el ritmo de la versión oficial.
2. Solo puede exportar imágenes en formato PNG, lo cual genera archivos JPG más pesados tras el redimensionamiento.

## Resultado

Basado en la combinación “Photon + Worker”, investigué más y desarrollé una nueva solución inspirada en [DenoFlare](https://denoflare.dev/examples/transform-images-wasm) y [jSquash](https://github.com/jamsinclair/jSquash). Finalmente, utilicé Photon (con *patch-package* como dependencia), Squash WebAssembly y Cloudflare Worker para crear un servicio de procesamiento de imágenes con redimensionamiento.

> Originalmente quise soportar exportación en AVIF y JPEG XL, pero la **versión gratuita de Workers** impone un límite de 1 MB, así que tuve que descartar esas opciones.

### Funciones soportadas:

1. Procesamiento de imágenes en formatos: PNG, JPG, BMP, ICO y TIFF.
2. Exportación en: JPG, PNG y WEBP (WEBP es el formato predeterminado).
3. Soporte para operaciones en *pipeline* (encadenamiento).
4. Soporte para caché con Cloudflare.
5. Lista blanca de URLs para prevenir abuso.
6. Degradación elegante en caso de error: devuelve la imagen original (sin cachear el error).

---

## Demostración

### Conversión de formato

#### webp

![webp](https://image.miantiao.me/?url=https%3A%2F%2Fstatic.miantiao.me%2Fshare%2FMTyerw%2Fbanner-2048.jpeg&format=webp)

#### jpg

![jpg](https://image.miantiao.me/?url=https%3A%2F%2Fstatic.miantiao.me%2Fshare%2FMTyerw%2Fbanner-2048.jpeg&format=jpg)

#### png

![png](https://image.miantiao.me/?url=https%3A%2F%2Fstatic.miantiao.me%2Fshare%2FMTyerw%2Fbanner-2048.jpeg&format=png)

### Redimensionamiento

![resize](https://image.miantiao.me/?url=https%3A%2F%2Fstatic.miantiao.me%2Fshare%2FMTyerw%2Fbanner-2048.jpeg&action=resize!830,400,2)

### Rotación

![rotate](https://image.miantiao.me/?url=https%3A%2F%2Fstatic.miantiao.me%2Fshare%2FMTyerw%2Fbanner-2048.jpeg&action=rotate!90)

### Recorte

![crop](https://image.miantiao.me/?url=https%3A%2F%2Fstatic.miantiao.me%2Fshare%2FMTyerw%2Fbanner-2048.jpeg&action=crop!0,0,1000,1000)

### Filtros

![filter](https://image.miantiao.me/?url=https%3A%2F%2Fstatic.miantiao.me%2Fshare%2FMTyerw%2Fbanner-2048.jpeg&action=filter%21obsidian)

### Marca de agua (imagen)

![watermark](https://image.miantiao.me/?url=https%3A%2F%2Fstatic.miantiao.me%2Fshare%2FMTyerw%2Fbanner-2048.jpeg&action=watermark!https%3A%2F%2Fstatic.miantiao.me%2Fshare%2F6qIq4w%2FFhSUzU.png,20,20)

### Marca de agua (texto)

![draw_text](https://image.miantiao.me/?url=https%3A%2F%2Fstatic.miantiao.me%2Fshare%2FMTyerw%2Fbanner-2048.jpeg&action=draw_text!miantiao.me,20,20)

### Operaciones encadenadas (pipeline)

#### Redimensionar + rotar + marca de agua de texto

![resize & rotate & draw_text](https://image.miantiao.me/?url=https%3A%2F%2Fstatic.miantiao.me%2Fshare%2FMTyerw%2Fbanner-2048.jpeg&action=resize!830,400,2%7Crotate!180%7Cdraw_text!miantiao.me,10,10)

#### Redimensionar + marca de agua de imagen

![resize & watermark](https://image.miantiao.me/?url=https%3A%2F%2Fstatic.miantiao.me%2Fshare%2FMTyerw%2Fbanner-2048.jpeg&action=resize!830,400,2%7Cwatermark!https%3A%2F%2Fstatic.miantiao.me%2Fshare%2F6qIq4w%2FFhSUzU.png,10,10)

---

En teoría, se soportan **todas las operaciones disponibles en Photon**. Si te interesa, puedes consultar las URLs y modificar los parámetros según la [documentación oficial de Photon](https://docs.rs/photon-rs/latest/photon_rs/) para probarlo por tu cuenta.

Si encuentras algún problema, no dudes en dejar un comentario o compartir tu experiencia.

---

## Compartir

He publicado esta solución como código abierto en GitHub. Si quieres implementarla, puedes seguir la documentación del repositorio:

🔗 [https://github.com/ccbikai/cloudflare-worker-image](https://github.com/ccbikai/cloudflare-worker-image)

[![ccbikai/cloudflare-worker-image - GitHub](https://github.html.zone/ccbikai/cloudflare-worker-image)](https://github.com/ccbikai/cloudflare-worker-image)

---

[![Invítame un café ☕](https://static.miantiao.me/share/0WmsVP/CcmGr8.png)](https://www.buymeacoffee.com/miantiao)
