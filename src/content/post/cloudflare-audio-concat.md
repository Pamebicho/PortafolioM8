---
layout: ../../layouts/post.astro
title: Usa Cloudflare Workers para concatenar archivos de audio
description: Cómo usar Cloudflare Workers para unir archivos de audio con FFmpeg en el navegador.
dateFormatted: 19 abril 2025
---

Recientemente actualicé el [Podcast en chino de Hacker News](https://hacker-news.agi.li/) para usar un formato con dos locutores. Como los modelos actuales de síntesis de voz no manejan bien los diálogos entre dos personas, necesitaba una forma de unir los archivos de audio de cada hablante.

El proyecto se ejecuta en el entorno de **Cloudflare Workers**, el cual carece de muchas funcionalidades de Node.js y no permite usar extensiones en C++. Además, los contenedores de Cloudflare aún no están disponibles de forma generalizada. Por lo tanto, tuve que recurrir a la **Browser Rendering API** para realizar la tarea de fusión de audio.

**FFmpeg** es la herramienta estándar para concatenar archivos de audio, y afortunadamente ahora puede ejecutarse en el navegador gracias a WebAssembly (WASM). Así que el enfoque técnico general fue el siguiente:

1. Usar un *Worker Binding* para lanzar una instancia del navegador (mediante la Browser Rendering API).
2. Hacer que el navegador navegue a una página de mezcla de audio, ejecute la operación de concatenación y devuelva el resultado como un `Blob`.
3. Recibir el `Blob` en el Worker y subirlo a un bucket de almacenamiento en R2.

El código no es muy extenso, pero la depuración fue compleja porque la renderización del navegador ocurre de forma remota.

---

### Código del lado del navegador para concatenar audio

```
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Audio</title>
  </head>
  <body>
    <script>
      const concatAudioFilesOnBrowser = async (audioFiles) => {
        const script = document.createElement('script')
        script.src = 'https://unpkg.com/@ffmpeg/ffmpeg@0.11.6/dist/ffmpeg.min.js'
        document.head.appendChild(script)
        await new Promise((resolve) => (script.onload = resolve))

        const { createFFmpeg, fetchFile } = FFmpeg
        const ffmpeg = createFFmpeg({ log: true })

        await ffmpeg.load()

        // Download and write each file to FFmpeg's virtual file system
        for (const [index, audioFile] of audioFiles.entries()) {
          const audioData = await fetchFile(audioFile)
          ffmpeg.FS('writeFile', `input${index}.mp3`, audioData)
        }

        // Create a file list for ffmpeg concat
        const fileList = audioFiles.map((_, i) => `file 'input${i}.mp3'`).join('\n')
        ffmpeg.FS('writeFile', 'filelist.txt', fileList)

        // Execute FFmpeg command to concatenate files
        await ffmpeg.run(
          '-f',
          'concat',
          '-safe',
          '0',
          '-i',
          'filelist.txt',
          '-c:a',
          'libmp3lame',
          '-q:a',
          '5',
          'output.mp3',
        )

        // Read the output file
        const data = ffmpeg.FS('readFile', 'output.mp3')

        // Create a downloadable link
        const blob = new Blob([data.buffer], { type: 'audio/mp3' })

        // Clean up
        audioFiles.forEach((_, i) => {
          ffmpeg.FS('unlink', `input${i}.mp3`)
        })
        ffmpeg.FS('unlink', 'filelist.txt')
        ffmpeg.FS('unlink', 'output.mp3')

        return blob
      }
    </script>
  </body>
</html>
```

### Worker Codes

```
export async function concatAudioFiles(audioFiles: string[], BROWSER: Fetcher, { workerUrl }: { workerUrl: string }) {
  const browser = await puppeteer.launch(BROWSER)
  const page = await browser.newPage()
  await page.goto(`${workerUrl}/audio`)

  console.info('start concat audio files', audioFiles)
  const fileUrl = await page.evaluate(async (audioFiles) => {
    // JS runs here in the browser.
    // @ts-expect-error Objects in the browser
    const blob = await concatAudioFilesOnBrowser(audioFiles)

    const result = new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
    return await result
  }, audioFiles) as string

  console.info('concat audio files result', fileUrl.substring(0, 100))

  await browser.close()

  const response = await fetch(fileUrl)
  return await response.blob()
}

const audio = await concatAudioFiles(audioFiles, env.BROWSER, { workerUrl: env.HACKER_NEWS_WORKER_URL })
return new Response(audio)
```
