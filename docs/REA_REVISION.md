# Revisión de la skill REA (github.com/morluto/rea)

Fecha: 20/11/2026 · Revisado: README, DISCLAIMER, manifiestos de plugin (`.claude-plugin/plugin.json`, `.codex-plugin/mcp.json`) y estructura del repo, leídos en GitHub sin descargar ni ejecutar nada.

## Qué es
No es una skill de texto: es un **servidor MCP** (`rea-agents`, npm, licencia MIT, v6.10.1) para **ingeniería inversa**. Analiza binarios nativos (con Hopper, Ghidra o IDA), apps JavaScript/Electron (recupera el código fuente de los bundles), .NET, APK de Android, firmware, capturas de red (HAR, mitmproxy) y webs mediante un navegador Chrome controlado.

## Qué permisos pide
- La instalación (`npx rea-agents setup`) **modifica la configuración de tus agentes** (Claude Code, Cursor…) para registrar el servidor MCP. Hace copia de seguridad.
- El servidor se ejecuta con **Node.js en tu equipo, con tus permisos de usuario**, y puede lanzar programas, adjuntarse a navegadores y procesos, y capturar tráfico de red.
- Según su propia documentación, «no requiere permisos ni aprobación por llamada»: una vez instalado, el agente puede usar todas sus herramientas sin preguntar.
- Opcionalmente instala Hopper (con aprobación).

## ¿Es segura?
- No he visto señales de malware en lo revisado. Es open source y su descargo de responsabilidad prohíbe el uso ilícito.
- Pero es una herramienta **muy potente con acceso amplio** a tu PC, y se actualiza muy a menudo vía npm: cada actualización es código nuevo que no hemos revisado.
- Señal rara: el repo, creado en abril de 2026, marca ~470.000 estrellas, una cifra fuera de lo normal. No implica que sea maliciosa, pero no la tomo como prueba de confianza.

## ¿Encaja con lo que quieres?
**No, y la recomiendo no instalarla para este proyecto.**
- Su función principal (decompilar apps, recuperar código de bundles JavaScript, capturar el tráfico de la API) es justo lo que pusiste como límite: no descompilar, no usar la API interna y no copiar código.
- Para sacar una lista de funciones de páginas públicas basta con mirarlas, sin herramientas de ingeniería inversa. Esa lista ya está en `PLAN.md`.
- Si aun así quieres usarla en otro proyecto: instálala en una máquina o usuario aparte, fija la versión (`rea-agents@6.10.1`) y no la registres en el agente de este proyecto.
