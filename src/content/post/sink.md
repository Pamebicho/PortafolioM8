---
layout: ../../layouts/post.astro
title: Sink – Sistema de enlaces cortos con estadísticas basado en Cloudflare
description: Plataforma para acortar URLs y visualizar estadísticas, sin límites estrictos y 100% serverless
dateFormatted: 4 enero 2025
---

Durante un tiempo, compartí sitios web en [Twitter](https://x.com/0xKaiBi) usando enlaces cortos para evaluar el interés de la audiencia. De todas las plataformas que probé, **Dub** ofrecía la mejor experiencia de usuario. Sin embargo, tenía una limitación crítica: al superar las 1000 visitas mensuales, ya no permite ver estadísticas, lo que lo vuelve poco escalable.

Durante el feriado de Qingming, descubrí que [Cloudflare Workers Analytics Engine](https://developers.cloudflare.com/analytics/analytics-engine/) no solo permite almacenar datos, sino también consultarlos vía API. Esto me motivó a desarrollar un MVP que pudiera escalar hasta **3 millones de visitas mensuales** sin problema. Como Cloudflare utiliza probablemente **Clickhouse** en su infraestructura, el rendimiento no fue una preocupación.

Más adelante, en el descanso del Día del Trabajo, mejoré la interfaz de usuario y tras usarlo medio mes, confirmé que la experiencia era estable y satisfactoria. Por eso decidí **liberarlo como código abierto** para que cualquier persona pueda utilizarlo o adaptarlo.

---

## 🧩 Funcionalidades principales

- ✂️ Acortamiento de enlaces
- 📈 Estadísticas de visitas
- ☁️ Despliegue 100% serverless (Cloudflare Workers)
- 🧩 Slug personalizado
- 🤖 Slug generado con IA
- ⏳ Vencimiento configurable por enlace

---

## 🧪 Demo en vivo

🔗 [Sink.Cool](https://sink.cool/dashboard)  
🔑 Token del sitio: `SinkCool`

### 📊 Panel general de estadísticas

![Panel General](https://static.miantiao.me/share/CBuVes/sink.cool_dashboard.png)

<details>
  <summary><b>Gestión de Enlaces</b></summary>
  <img alt="Gestión de Enlaces" src="https://static.miantiao.me/share/uQVX7Q/sink.cool_dashboard_links.png"/>
</details>

<details>
  <summary><b>Estadísticas por Enlace</b></summary>
  <img alt="Estadísticas por Enlace" src="https://static.miantiao.me/share/WfyCXT/sink.cool_dashboard_link_slug=0.png"/>
</details>

---

## 🛠️ Código abierto

El código fuente está disponible en GitHub para que puedas revisarlo, adaptarlo o colaborar:

[![ccbikai/sink - GitHub](https://github.html.zone/ccbikai/sink)](https://github.com/ccbikai/sink)

---

## 🚧 Roadmap (trabajo en progreso)

- Extensión para navegadores
- Extensión para Raycast
- Accesos directos para Apple Shortcuts
- Mejora en la gestión de enlaces (con soporte para **Cloudflare D1**)
- Análisis avanzado (filtros por fecha, dispositivo, etc.)
- Optimización del panel (carga infinita)
- Soporte para otras plataformas

---

Si te interesa el desarrollo web, sígueme en [Twitter](https://x.com/0xKaiBi) donde comparto avances, ideas y recursos útiles. 🚀

---

Finally, feel free to follow me on [Twitter](https://x.com/0xKaiBi) for updates on development progress and to share some web development news.
