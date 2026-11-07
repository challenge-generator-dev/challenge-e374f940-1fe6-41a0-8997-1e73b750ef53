# Implementación de CRUD de ordenes en DynamoDB

El sistema debe permitir la gestión completa de órdenes en DynamoDB a través de la interfaz de usuario. Las órdenes tienen atributos como ID, cliente, productos, estado y fecha. El sistema debe soportar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre las órdenes y manejar adecuadamente los errores y casos borde del dominio.

## Informacion General

| Campo | Valor |
|-------|-------|
| **Tema** | Persistir ordenes en DynamoDB desde la interfaz |
| **Nivel** | advanced-l2 |
| **Tipo** | practical |
| **Tiempo estimado** | 8 horas |

## Fases del Reto

### Fase 0: Configuración del Proyecto

**Objetivo:** Obtener el proyecto base funcional enviando el Código Base a un asistente de IA, que lo analizará, corregirá errores y entregará cada archivo con su ruta.

**Tiempo estimado:** 15-30 minutos

**Instrucciones:**

- Asegúrate de tener instalado para ejecutar el proyecto: Node.js 18+, npm, VS Code o similar.
- Copia todo el contenido del campo **Código Base** de este reto — incluyendo el texto de instrucciones que aparece al inicio.
- Abre un asistente de IA (Claude en claude.ai, ChatGPT o Gemini — se recomienda Claude), pega el contenido copiado en el chat y envíalo.
- El asistente analizará los archivos, corregirá errores y entregará cada archivo con su ruta. Guárdalos en la carpeta donde quieras trabajar, respetando las rutas.
- Ejecuta `npm install && npm run build` (o `npm start`). Si no hay errores, estás listo.

**Entregable:** El proyecto compila/arranca sin errores.

<details>
<summary>Pistas de conocimiento</summary>

- Copia el Código Base completo incluyendo el texto de instrucciones al inicio — esas instrucciones le indican al asistente exactamente qué hacer con los archivos.
- Si el asistente no entrega todos los archivos al terminar el análisis, escríbele: "entrégame todos los archivos con su ruta".
- Si el proyecto tiene errores al arrancar, comparte el mensaje de error con el mismo asistente para que lo corrija.

</details>

### Fase 1: Creación de la estructura básica

**Objetivo:** Definir la estructura y las operaciones básicas para la gestión de órdenes en DynamoDB.

**Tiempo estimado:** 2 horas

**Instrucciones:**

- Identificar los atributos necesarios para una orden.
- Definir las operaciones CRUD para las órdenes.
- Establecer las reglas de validación para los atributos de las órdenes.

**Entregable:** Especificación de las operaciones CRUD y reglas de validación para las órdenes en DynamoDB.

<details>
<summary>Pistas de conocimiento</summary>

- Considera los atributos y relaciones entre las órdenes y otros componentes del sistema.
- Piensa en los posibles errores y cómo manejarlos.

</details>

### Fase 2: Implementación de las operaciones CRUD

**Objetivo:** Implementar las operaciones CRUD para las órdenes en DynamoDB.

**Tiempo estimado:** 4 horas

**Instrucciones:**

- Desarrollar las funciones para crear, leer, actualizar y eliminar órdenes en DynamoDB.
- Asegurar que las operaciones cumplan con las reglas de validación definidas.
- Manejar adecuadamente los errores y casos borde del dominio.

**Entregable:** Implementación funcional de las operaciones CRUD para las órdenes en DynamoDB.

<details>
<summary>Pistas de conocimiento</summary>

- Utiliza Terraform para versionar la infraestructura.
- Prueba cada operación para asegurar que cumple con los criterios de aceptación.

</details>

### Fase 3: Versión y despliegue de la infraestructura

**Objetivo:** Versionar y desplegar la infraestructura utilizando Terraform.

**Tiempo estimado:** 2 horas

**Instrucciones:**

- Configurar Terraform para versionar la infraestructura de DynamoDB.
- Desplegar la infraestructura y asegurar que las operaciones CRUD funcionen correctamente.
- Documentar el proceso de versión y despliegue.

**Entregable:** Infraestructura versionada y desplegada utilizando Terraform, con documentación del proceso.

<details>
<summary>Pistas de conocimiento</summary>

- Asegura que la documentación incluya todos los pasos necesarios para replicar el despliegue.
- Prueba el despliegue en un entorno de prueba antes de la producción.

</details>

## Dimensiones Evaluadas

- **queEs**: ¿Qué son las operaciones CRUD y por qué son importantes en la gestión de órdenes en DynamoDB?
- **paraQueSirve**: ¿Para qué sirve versionar la infraestructura con Terraform en este contexto?
- **comoSeUsa**: ¿Cómo se usan las operaciones CRUD para gestionar órdenes en DynamoDB?
- **erroresComunes**: ¿Cuáles son los errores comunes al implementar operaciones CRUD en DynamoDB y cómo se pueden evitar?
- **queDecisionesImplica**: ¿Qué decisiones implica el versionado y despliegue de la infraestructura con Terraform?

## Criterios de Evaluacion

- Definición clara de los atributos y operaciones CRUD para las órdenes en DynamoDB.
- Implementación funcional de las operaciones CRUD que cumple con las reglas de validación.
- Manejo adecuado de los errores y casos borde del dominio.
- Versionado y despliegue correcto de la infraestructura utilizando Terraform.
- Documentación completa y clara del proceso de versión y despliegue.

## Como trabajar con un asistente de IA

Hay dos caminos, elegi uno:

- **AGENTS.md** (recomendado) — instrucciones nativas del repo. Abri esta carpeta con tu agente local (Claude Code, Cursor, Codex, Copilot, Gemini) y las carga solo. Sabe que archivos faltan y con que comando se verifica, y completa el scaffold escribiendo en disco.
- **PROMPT_MEJORA.md** — para copiar y pegar en un chat (claude.ai, ChatGPT) si no tenes un agente en el IDE. Declara lo mismo que AGENTS.md; los archivos que te devuelva el chat los guardas en esta carpeta respetando las rutas.

Ninguno de los dos resuelve las fases del reto: eso es tu trabajo.

## Mapa de componentes

El repo tiene una carpeta por componente. Cada uno se instala y verifica dentro de la suya.

| Componente | Carpeta | Rol | Capa | Track | Tecnologias |
|---|---|---|---|---|---|
| `api` | `api/` | practice | server | Node | DynamoDB |
| `client` | `client/` | chapter, support | client | React | React |
| `infra` | `infra/` | support | infra | Terraform (AWS) | Terraform |
| `infra-local` | (raiz) | support | infra | Compose local | DynamoDB |

## Orden de arranque

1. `docker compose up -d` (en la raiz) — levanta la infraestructura local.
2. `cd infra && terraform fmt -check -recursive && terraform init -backend=false && terraform validate` — componente `infra` (support).
3. `cd api && npm install && npm run build` — componente `api` (practice).
4. `cd client && npm install && npm run build` — componente `client` (chapter, support).

### Contratos entre componentes

- `api` expone http (api: http://localhost:3000):
  - `POST /orders`
  - `GET /orders/:id`
  - `PUT /orders/:id`
  - `DELETE /orders/:id`
  - `GET /orders`

## Herramientas

- **Terraform**: Herramienta de trabajo del candidato: usala en la fase donde se depura o se prueba la solucion (no es una dependencia del proyecto).

## Verificacion

El proyecto esta listo para trabajar cuando este comando corre sin errores:

```bash
(cd api && npm install && npm run build) && (cd client && npm install && npm run build) && (cd infra && terraform fmt -check -recursive && terraform init -backend=false && terraform validate) && docker compose config -q
```

---

*Reto generado automaticamente por Challenge Generator - Pragma*
