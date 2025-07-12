---
layout: ../../layouts/post.astro
title: L(O*62).ONG – Haz tu URL más larga
description: loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo.ong es el nombre de dominio más largo
dateFormatted: 1 marzo 2025
---

[![GitHub](https://github.html.zone/ccbikai/loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo.ong)](https://github.com/ccbikai/loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo.ong)

Este pequeño experimento fue creado la semana pasada. Solo necesitó unas pocas líneas de código.

Tuve varios problemas al momento de desplegarlo, principalmente relacionados con los certificados HTTPS.

👉 El segmento más largo permitido en un nombre de dominio es de **63 caracteres**.  
👉 El campo `commonName` del certificado HTTPS acepta como máximo **64 caracteres**.

Esto hizo que **Cloudflare**, **Vercel** y **Netlify** no pudieran generar certificados HTTPS con **Let's Encrypt**, ya que ellos utilizan el dominio completo en el `commonName`.

Sin embargo, **Zeabur** sí logró firmar el certificado con Let's Encrypt.

Finalmente, cambiando el emisor del certificado de Cloudflare a **Google Trust Services LLC**, se pudo firmar correctamente.

🔎 Puedes ver los certificados relacionados en:  
[https://crt.sh/?q=loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo.ong](https://crt.sh/?q=loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo.ong)

