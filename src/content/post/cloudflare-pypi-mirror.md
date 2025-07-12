---
layout: ../../layouts/post.astro
title: Nuevo servicio de espejo PyPI de Cloudflare
description: El espejo PyPI de Cloudflare admite PEP 691 y CORS, permitiendo acceso a PyPI desde China continental para Micropip, con código abierto disponible.
dateFormatted: 21 diciembre 2024
---

[Pyodide](https://micropip.pyodide.org/en/stable/index.html) es una biblioteca que permite ejecutar Python en WebAssembly, utilizando [Micropip](https://micropip.pyodide.org/en/stable/index.html) para instalar paquetes desde PyPI. Debido a los requisitos de WebAssembly en el navegador —como el soporte para CORS y la compatibilidad con [PEP 691](https://peps.python.org/pep-0691/)—, y al hecho de que el espejo TUNA de la Universidad de Tsinghua **no** admite CORS, se generan algunos obstáculos.

Aunque PyPI no es directamente accesible desde China continental, existen varios espejos disponibles. Instituciones como la Universidad de Tsinghua, Alibaba Cloud, Tencent Cloud y Huawei Cloud ofrecen servicios de réplica. Sin embargo, salvo el espejo TUNA, **ninguno de ellos admite la API Simple basada en JSON (PEP 691)**.

El problema es que **WebAssembly necesita tanto compatibilidad con CORS como cumplimiento del PEP 691** para funcionar correctamente en el navegador. Y como el único espejo con PEP 691 (TUNA) no tiene soporte CORS, **no hay una opción funcional para usar Micropip desde China continental**.

Frente a esta situación, decidí crear un espejo PyPI basado en **Cloudflare** que **sí cumple con CORS y PEP 691**.

---

## Opciones de implementación

Este espejo se puede construir usando dos soluciones ofrecidas por Cloudflare, cada una con sus ventajas y limitaciones:

### [Workers](https://workers.cloudflare.com/)

**Ventajas:**  
✅ Disponible con el plan gratuito.

**Desventajas:**  
⚠️ Genera múltiples peticiones a Workers, lo que puede sobrepasar los límites del plan gratuito, provocando interrupciones o la necesidad de actualizar al plan pago.

### [Snippets](https://developers.cloudflare.com/rules/snippets/)

**Ventajas:**  
✅ No genera peticiones a Workers, ideal para alto volumen de uso.

**Desventajas:**  
❌ Solo está disponible a partir del plan Pro. No está disponible en el plan gratuito.

---

## Código fuente

El código correspondiente ha sido liberado como **código abierto** y se encuentra disponible en:

🔗 [https://github.com/ccbikai/cloudflare-pypi-mirror](https://github.com/ccbikai/cloudflare-pypi-mirror)

[![Cloudflare PyPI Mirror](https://github.html.zone/ccbikai/cloudflare-pypi-mirror)](https://github.com/ccbikai/cloudflare-pypi-mirror)
