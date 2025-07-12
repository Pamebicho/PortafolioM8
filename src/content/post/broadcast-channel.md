---
layout: ../../layouts/post.astro
title: BroadcastChannel – Convierte tu canal de Telegram en un microblog
description: Convierte tu canal de Telegram en un microblog
dateFormatted: 11 mayo 2025
---

He estado compartiendo algunas herramientas interesantes en [X](https://x.com/0xKaibi) y también sincronizándolas con mi canal de Telegram. Vi que [Austin comentó que está preparando un sitio web](https://x.com/austinit/status/1817832660758081651) para compilar todo el contenido compartido. Eso me recordó una plantilla que descubrí recientemente llamada [Sepia](https://github.com/Planetable/SiteTemplateSepia), y pensé en convertir mi canal de Telegram en un microblog.

La dificultad no fue alta; completé la funcionalidad principal en un fin de semana. Durante el proceso logré una implementación completamente del lado del navegador, **sin usar JavaScript**, y me gustaría compartir algunos puntos técnicos interesantes:

1. El **modo anti-spoiler** y la visualización/ocultamiento de la barra de búsqueda móvil se implementaron usando la pseudo-clase `:checked` de CSS junto con el combinador de hermanos adyacentes `+`. [Referencia](https://www.tpisoftware.com/tpu/articleDetails/2744)

2. Las **animaciones de transición** utilizaron *CSS View Transitions*. [Referencia](https://liruifengv.com/posts/zero-js-view-transitions/)

3. El **visor de imágenes (lightbox)** se logró usando el atributo `popover` de HTML. [Referencia](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes/popover)

4. La funcionalidad de "**volver arriba**" se implementó usando `animation-timeline` en CSS, exclusivo de Chrome versión 115 en adelante. [Referencia](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-timeline/view)

5. El **layout tipo masonry con múltiples imágenes** se hizo usando *CSS Grid*. [Referencia](https://www.smashingmagazine.com/native-css-masonry-layout-css-grid/)

6. Las **estadísticas de visitas** se registraron mediante una imagen transparente de 1px como fondo del logo, una técnica antigua que hoy en día ya casi no es soportada por los servicios de analítica modernos.

7. Para **bloquear por completo la ejecución de JavaScript en el navegador**, utilicé la política `Content-Security-Policy: script-src 'none'`. [Referencia](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Security-Policy/script-src)

Después de terminar el proyecto, lo liberé como código abierto, ¡y me sorprendió gratamente la recepción! En solo una semana, recibió más de **800 estrellas en GitHub**.

Si te interesa, puedes verlo aquí:

🔗 <https://github.com/ccbikai/BroadcastChannel>

[![Repositorio BroadcastChannel en GitHub](https://github.html.zone/ccbikai/BroadcastChannel)](https://github.com/ccbikai/BroadcastChannel)
