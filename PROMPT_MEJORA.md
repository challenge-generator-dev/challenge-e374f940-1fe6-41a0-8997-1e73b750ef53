# Prompt para Mejorar el Codigo Base

Copia y pega el contenido del bloque de abajo en un asistente de IA (Claude, ChatGPT)
para obtener el proyecto completo y arrancable. Guarda los archivos que te devuelva en la
carpeta del repo, respetando exactamente las rutas.

Si preferis trabajar en tu editor con un agente local (Claude Code, Cursor, Copilot), usa `AGENTS.md` en vez de este archivo: dice lo mismo pero para que escriba los archivos en disco.

## Las dos reglas que no se negocian

1. **Completa el boilerplate.** Todo lo que el proyecto necesita para compilar y arrancar: manifiesto de dependencias, punto de entrada, configuracion, capa de interfaz, y las capas del patron arquitectonico declarado. Eso es andamiaje y es tu trabajo.
2. **NO resuelvas el reto.** Los entregables de las fases son el trabajo de la persona. El hueco pedagogico se deja como esta: el proyecto arranca, pero lo que el reto pide implementar NO esta implementado.

Dicho de otra forma: si algo impide compilar, arreglalo. Si algo es logica de negocio incompleta, validaciones ausentes, un secreto hardcodeado o un patron mejorable, dejalo exactamente como esta — es lo que la persona tiene que encontrar.

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

## Lo que le falta a este proyecto

Esto NO lo tenes que adivinar: salio de comparar el proyecto contra la arquitectura declarada del reto y de un analisis estatico del codigo. Completalo TODO.

### Referencias colgando en el codigo que si esta

Cada una rompe la compilacion:

- `api/src/application/dto/create-order.dto.ts` — `ProductDto.some`: Se invoca `some` sobre `ProductDto`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.

## Como saber que terminaste

```bash
(cd api && npm install && npm run build) && (cd client && npm install && npm run build) && (cd infra && terraform fmt -check -recursive && terraform init -backend=false && terraform validate) && docker compose config -q
```

Ese comando corriendo sin errores es la definicion de "listo".

---

```
## Briefing del reto (autoridad)
Este bloque manda sobre los archivos adjuntos. El stack y el rol salen de AQUÍ, no de un topic genérico ni de markdown placeholder.

### Perfil
Chapter Frontend, Especialidad Desarrollador, Tecnología React, Advanced L2

### Brecha de conocimiento
CRUD de ordenes en DynamoDB desde la interfaz (corrida e2e 20261106212220607), Implementa operaciones CRUD de ordenes en DynamoDB desde la interfaz y versiona la infraestructura

### Misión / candidato
Gestionar ordenes

### Reto
- Tema: Persistir ordenes en DynamoDB desde la interfaz
- Seniority: advanced-l2
- Tipo: practical
- Título: Implementación de CRUD de ordenes en DynamoDB
- Tiempo estimado: 8 horas

### Fases (trabajo del HUMANO — PROHIBIDO completarlas)
No implementes estos entregables. Dejalos como hueco pedagógico. El asistente solo materializa el proyecto arrancable para que el participante pueda trabajar.
- Fase 1: Creación de la estructura básica — objetivo: Definir la estructura y las operaciones básicas para la gestión de órdenes en DynamoDB. — entregable (NO resolver): Especificación de las operaciones CRUD y reglas de validación para las órdenes en DynamoDB.
- Fase 2: Implementación de las operaciones CRUD — objetivo: Implementar las operaciones CRUD para las órdenes en DynamoDB. — entregable (NO resolver): Implementación funcional de las operaciones CRUD para las órdenes en DynamoDB.
- Fase 3: Versión y despliegue de la infraestructura — objetivo: Versionar y desplegar la infraestructura utilizando Terraform. — entregable (NO resolver): Infraestructura versionada y desplegada utilizando Terraform, con documentación del proceso.

Eres un asistente experto en análisis, corrección y generación de archivos de cualquier tipo:
código fuente, documentación, hojas de cálculo, documentos Word, configuraciones, entre otros.
Voy a enviarte una cadena de texto que contiene uno o más archivos. Cada archivo está delimitado por un marcador con el siguiente formato:
// === ARCHIVO: ruta/del/archivo.extension ===
o también puede aparecer como:
## === ARCHIVO: ruta/del/archivo.extension ===
Lo que sigue al marcador puede ser:

El contenido real del archivo (código, texto, YAML, etc.)
Una descripción en lenguaje natural de lo que debe contener el archivo


TU TAREA
PASO 0 — ¿Esto es un proyecto o una carcasa?
Antes de extraer archivos, leé el Briefing (si está) y diagnosticá el adjunto.

Es CARCASA si ocurre CUALQUIERA de estas:
- No hay manifiesto de dependencias del stack del briefing (manifest.json de VTEX IO / package.json / pom.xml / build.gradle / requirements.txt / go.mod / *.tf / *.csproj, según corresponda)
- Hay un "binario" que en realidad es un comentario ("no puede ser mostrado como texto plano", placeholder .fig/.docx vacío)
- Los markdowns ya completan entregables de fases posteriores ("se implementó fade-in", lista de áreas ya resuelta)

Si es CARCASA:
- MATERIALIZÁ un proyecto que arranca en el stack del briefing (VTEX IO Store Framework, Angular, Terraform, pytest, Nest, etc.). Incluí manifiesto, punto de entrada y capa de interfaz reales.
- NO copies los markdowns de "solución" como si fueran el producto. Son ruido de generación.
- NO resuelvas las fases del briefing (están marcadas PROHIBIDO). Dejá el hueco pedagógico: el flujo existe, las microinteracciones/calidad/infra que el reto pide NO están hechas.
- Después seguí al PASO 5 (entrega de archivos).

Si es un proyecto REAL (manifiesto + código que compila o arranca):
- Seguí PASO 1 en adelante. 🔴 compilación sí. 🟡 pedagógico no.

PASO 1 — Detección y extracción
Identifica todos los archivos presentes en la cadena. Para cada archivo extrae:

Su ruta completa (ej: src/main/java/com/pragma/Service.java)
Su contenido o descripción

PASO 2 — Clasificación por tipo
Clasifica cada archivo en una de estas categorías:
A) Código fuente (Java, Python, TypeScript, JavaScript, Kotlin, etc.)
B) Configuración / documentación (YAML, properties, Markdown, JSON, txt, etc.)
C) Excel (.xlsx, .xls, .csv)
D) Word (.docx, .doc)
E) Otro tipo de archivo binario o especial
PASO 3 — Clasificación de errores en código fuente

Objetivo prioritario: que el proyecto compile. No corrijas flujo de negocio ni lógica funcional.

Antes de modificar cualquier archivo de código fuente, clasifica cada problema encontrado en una de estas dos categorías:
🔴 ERROR DE COMPILACIÓN — corregir siempre
Son errores que impiden que el proyecto arranque, sin valor pedagógico:

Import faltante o incorrecto
Clase, método o variable referenciada que no existe en ningún archivo del proyecto
Error de sintaxis
Anotación con atributos inválidos
Dependencia ausente en pom.xml, package.json, etc.
Archivo referenciado que no existe y debe ser creado con implementación mínima

→ CORREGIR estos errores.
🟡 PROBLEMA FUNCIONAL O DE CALIDAD — preservar siempre
Son problemas que no impiden compilar. Pueden ser intencionales para el aprendizaje:

Clave secreta hardcodeada ("secret", "password123")
API deprecada que funciona pero tiene reemplazo moderno
Lógica de negocio incorrecta o incompleta
Código redundante o de baja legibilidad
Falta de validaciones en flujo de negocio
Patrones de diseño incorrectos pero funcionales
Concurrencia no segura
Configuración funcional pero no óptima

→ PRESERVAR tal cual. No corregir, no mejorar, no comentar.
PASO 4 — Procesamiento según tipo de archivo
Tipo A — Código fuente
Aplica únicamente las correcciones clasificadas como 🔴 ERROR DE COMPILACIÓN.
No alteres ningún elemento clasificado como 🟡 PROBLEMA FUNCIONAL O DE CALIDAD.
Si falta un archivo referenciado, créalo con la implementación mínima necesaria para compilar.
Tipo B — Configuración / documentación
Extrae el contenido tal cual, sin modificaciones salvo errores evidentes de sintaxis
(ej: YAML mal indentado).
Tipo C — Excel (.xlsx)
Si viene con contenido real, genera el archivo respetando ese contenido.
Si viene con descripción en lenguaje natural, genera un archivo Excel funcional con:

Fila de encabezados en negrita con color de fondo distintivo
Columnas con ancho ajustado al contenido
Tipos de dato correctos por columna
Validaciones si la descripción lo indica
Hojas nombradas descriptivamente si hay más de una
Filas de ejemplo si no hay datos reales

Tipo D — Word (.docx)
Si viene con contenido real, genera el archivo respetando ese contenido.
Si viene con descripción en lenguaje natural, genera un documento Word funcional con:

Estilos de título (Título 1, Título 2) para jerarquía de secciones
Fuente legible (Calibri o equivalente), tamaño 11-12pt para cuerpo
Márgenes estándar
Tabla de contenido si tiene múltiples secciones
Tablas con encabezados en negrita si aplica

Tipo E — Otro
Genera el archivo con el contenido o estructura más apropiada según la descripción.
PASO 5 — Entrega de archivos
Entregá cada archivo con su ruta completa, respetando exactamente la estructura de rutas
indicada por los marcadores: un bloque por archivo, precedido por su ruta. No generes ZIPs
ni archivos adjuntos.
La entrega debe incluir:

Archivos de código con únicamente los errores de compilación corregidos
Archivos de configuración y documentación sin cambios
Archivos nuevos creados para resolver dependencias de compilación faltantes
Archivos Excel y Word generados desde descripción

IMPORTANTE: Entregá los archivos completos al finalizar. No preguntes si el usuario
quiere recibirlos. Simplemente entregalos; No debes desplegar en el chat el resumen de lo que arreglaste, solo entregá los archivos.

REGLAS IMPORTANTES

No omitas ningún archivo aunque no tenga errores ni modificaciones
Respeta los nombres y rutas exactas indicadas por los marcadores
Si un archivo no tiene marcador claro, infiere el nombre desde su contenido
Si la cadena contiene solo documentación, placeholders o binarios fake, NO la reproduzcas:
aplicá PASO 0 (materializar el proyecto del briefing). Reproducir la carcasa es un fallo.
No agregues texto después del último archivo entregado
No preguntes si el usuario quiere los archivos: simplemente entregalos siempre
Si detectas que falta un archivo de configuración necesario para compilar
(pom.xml, package.json, requirements.txt, build.gradle, etc.), créalo e inclúyelo
inferiendo su contenido desde los imports y frameworks detectados en el código
Nunca corrijas problemas 🟡 aunque parezcan obvios o fáciles de mejorar.
El participante que recibirá este proyecto los debe encontrar y resolver él mismo.


INPUT
Aquí está la cadena con los archivos:

// === ARCHIVO: api/package.json ===
{
  "name": "order-management-api",
  "version": "1.0.0",
  "description": "API para gestión de órdenes en DynamoDB",
  "main": "dist/main.js",
  "scripts": {
    "build": "rimraf dist && tsc",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "ts-node src/main.ts",
    "start:dev": "nest start --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json"
  },
  "dependencies": {
    "@aws-sdk/client-dynamodb": "^3.507.0",
    "@aws-sdk/lib-dynamodb": "^3.507.0",
    "@nestjs/common": "^11.1.0",
    "@nestjs/config": "^3.1.0",
    "@nestjs/core": "^11.1.0",
    "@nestjs/platform-express": "^11.1.0",
    "@nestjs/swagger": "^7.3.0",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.0",
    "reflect-metadata": "^0.2.1",
    "rxjs": "^7.8.1",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "@nestjs/testing": "^11.1.0",
    "@types/express": "^5.0.0",
    "@types/node": "^20.11.16",
    "@types/uuid": "^9.0.8",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.0.1",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-prettier": "^5.0.0",
    "jest": "^29.7.0",
    "prettier": "^3.0.0",
    "rimraf": "^5.0.5",
    "supertest": "^6.3.3",
    "ts-jest": "^29.1.0",
    "ts-loader": "^9.4.3",
    "ts-node": "^10.9.1",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.7.0"
  },
  "jest": {
    "moduleFileExtensions": [
      "js",
      "json",
      "ts"
    ],
    "rootDir": "src",
    "testRegex": ".spec.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": [
      "**/*.(t|j)s"
    ],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  }
}


// === ARCHIVO: api/tsconfig.json ===
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2022",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "strictBindCallApply": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": false,
    "paths": {
      "@app/*": ["src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "test", "**/*.spec.ts"]
}

// === ARCHIVO: api/src/main.ts ===
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración global de pipes para validación
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Order Management API')
    .setDescription('API para gestión de órdenes en DynamoDB')
    .setVersion('1.0')
    .addTag('orders')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Configuración de CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Puerto de escucha
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000;
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap().catch((err) => {
  console.error('Failed to bootstrap application', err);
  process.exit(1);
});

// === ARCHIVO: api/src/domain/entities/order.entity.ts ===
import { v4 as uuidv4 } from 'uuid';

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export class Order {
  readonly id: string;
  readonly customerId: string;
  readonly products: Array<{ productId: string; quantity: number; price: number }>;
  status: OrderStatus;
  readonly createdAt: Date;
  updatedAt: Date;

  constructor(
    customerId: string,
    products: Array<{ productId: string; quantity: number; price: number }>,
    status: OrderStatus = OrderStatus.PENDING
  ) {
    if (!customerId || customerId.trim().length === 0) {
      throw new Error('Customer ID is required');
    }
    if (!products || products.length === 0) {
      throw new Error('At least one product is required');
    }
    if (products.some(p => !p.productId || p.quantity <= 0 || p.price <= 0)) {
      throw new Error('Invalid product data');
    }

    this.id = uuidv4();
    this.customerId = customerId;
    this.products = products;
    this.status = status;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  updateStatus(newStatus: OrderStatus): void {
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
      [OrderStatus.PROCESSING]: [OrderStatus.COMPLETED, OrderStatus.CANCELLED],
      [OrderStatus.COMPLETED]: [],
      [OrderStatus.CANCELLED]: []
    };

    if (!validTransitions[this.status].includes(newStatus)) {
      throw new Error(`Cannot transition from ${this.status} to ${newStatus}`);
    }

    this.status = newStatus;
    this.updatedAt = new Date();
  }

  getTotalAmount(): number {
    return this.products.reduce((total, product) => total + (product.quantity * product.price), 0);
  }
}

// === ARCHIVO: api/src/domain/repositories/order.repository.ts ===
import { Order } from '../entities/order.entity';

export interface OrderRepository {
  create(order: Order): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  update(order: Order): Promise<Order>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Order[]>;
}

// === ARCHIVO: api/src/application/dto/create-order.dto.ts ===
import { IsString, IsNotEmpty, IsArray, ValidateNested, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

class ProductDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0.01)
  price: number;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  products: ProductDto[];

  constructor(customerId: string, products: ProductDto[]) {
    this.customerId = customerId;
    this.products = products;
  }

  validate(): void {
    if (!this.customerId || this.customerId.trim().length === 0) {
      throw new Error('Customer ID is required');
    }
    if (!this.products || this.products.length === 0) {
      throw new Error('At least one product is required');
    }
    if (this.products.some(p => !p.productId || p.quantity <= 0 || p.price <= 0)) {
      throw new Error('Invalid product data');
    }
  }
}

// === ARCHIVO: api/src/application/dto/update-order.dto.ts ===
import { IsString, IsArray, IsNumber, IsOptional, ValidateNested, Min, IsEnum, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../../domain/entities/order.entity';

class UpdateProductDto {
  @IsString()
  @IsNotEmpty()
  readonly productId!: string;

  @IsNumber()
  @Min(1)
  readonly quantity!: number;

  @IsNumber()
  @Min(0)
  readonly price!: number;
}

export class UpdateOrderDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  readonly customerId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateProductDto)
  @IsOptional()
  readonly products?: UpdateProductDto[];

  @IsEnum(OrderStatus)
  @IsOptional()
  readonly status?: OrderStatus;

  constructor(data?: Partial<UpdateOrderDto>) {
    if (data) {
      this.customerId = data.customerId;
      this.products = data.products;
      this.status = data.status;
    }
  }

  validate(): void {
    if (!this.customerId && !this.products && !this.status) {
      throw new Error('At least one field must be provided for update');
    }

    if (this.products && this.products.length === 0) {
      throw new Error('Products array cannot be empty');
    }

    if (this.products) {
      this.products.forEach((product, index) => {
        if (!product.productId || product.productId.trim() === '') {
          throw new Error(`Product at index ${index} must have a valid productId`);
        }
        if (product.quantity <= 0) {
          throw new Error(`Product at index ${index} must have quantity greater than 0`);
        }
        if (product.price < 0) {
          throw new Error(`Product at index ${index} must have a non-negative price`);
        }
      });
    }
  }
}

// === ARCHIVO: api/src/application/services/order.service.ts ===
import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { OrderRepository } from '../../domain/repositories/order.repository';
import { Order, OrderStatus } from '../../domain/entities/order.entity';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      createOrderDto.validate();

      const order = new Order(
        this.generateOrderId(),
        createOrderDto.customerId,
        createOrderDto.products.map(p => ({
          productId: p.productId,
          quantity: p.quantity,
          price: p.price,
        })),
        new Date(),
        OrderStatus.PENDING,
      );

      return await this.orderRepository.create(order);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create order', error.message);
    }
  }

  async getOrder(id: string): Promise<Order> {
    if (!id || id.trim() === '') {
      throw new BadRequestException('Order ID is required');
    }

    try {
      const order = await this.orderRepository.findById(id);

      if (!order) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      return order;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve order', error.message);
    }
  }

  async updateOrder(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    if (!id || id.trim() === '') {
      throw new BadRequestException('Order ID is required');
    }

    try {
      const existingOrder = await this.orderRepository.findById(id);

      if (!existingOrder) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      if (updateOrderDto.status) {
        existingOrder.updateStatus(updateOrderDto.status);
      }

      const updatedProducts = updateOrderDto.products 
        ? updateOrderDto.products.map(p => ({
            productId: p.productId,
            quantity: p.quantity,
            price: p.price,
          }))
        : existingOrder.products;

      const updatedCustomerId = updateOrderDto.customerId || existingOrder.customerId;

      const updatedOrder = new Order(
        existingOrder.id,
        updatedCustomerId,
        updatedProducts,
        existingOrder.createdAt,
        existingOrder.products && existingOrder.products.length > 0 
          ? OrderStatus.PROCESSING 
          : OrderStatus.PENDING,
      );

      return await this.orderRepository.update(updatedOrder);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update order', error.message);
    }
  }

  async deleteOrder(id: string): Promise<void> {
    if (!id || id.trim() === '') {
      throw new BadRequestException('Order ID is required');
    }

    try {
      const existingOrder = await this.orderRepository.findById(id);

      if (!existingOrder) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      await this.orderRepository.delete(id);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete order', error.message);
    }
  }

  async listOrders(): Promise<Order[]> {
    try {
      return await this.orderRepository.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Failed to list orders', error.message);
    }
  }

  private generateOrderId(): string {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 15);
    return `ORD-${timestamp}-${randomPart}`.toUpperCase();
  }
}

// === ARCHIVO: api/src/infrastructure/repositories/dynamodb/order.repository.ts ===
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DynamoDBClient,
  DynamoDBClientConfig,
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { Order } from '../../../domain/entities/order.entity';
import { OrderRepository } from '../../../domain/repositories/order.repository';

@Injectable()
export class DynamoDBOrderRepository implements OrderRepository, OnModuleInit, OnModuleDestroy {
  private client: DynamoDBClient;
  private tableName: string;

  constructor(private readonly configService: ConfigService) {
    const config: DynamoDBClientConfig = {
      region: this.configService.get<string>('AWS_REGION', 'us-east-1'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID') || '',
        secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY') || '',
      },
    };

    const endpoint = this.configService.get<string>('DYNAMODB_ENDPOINT');
    if (endpoint) {
      config.endpoint = endpoint;
    }

    this.client = new DynamoDBClient(config);
    this.tableName = this.configService.get<string>('DYNAMODB_TABLE_NAME', 'orders');
  }

  async onModuleInit(): Promise<void> {
    console.log('DynamoDB Order Repository initialized');
  }

  async onModuleDestroy(): Promise<void> {
    this.client.destroy();
  }

  private toDynamoDBItem(order: Order): Record<string, unknown> {
    return {
      id: order.id,
      customerId: order.customerId,
      products: order.products,
      createdAt: order.createdAt.toISOString(),
      totalAmount: order.getTotalAmount(),
      status: order instanceof Order ? this.getStatusValue(order) : 'PENDING',
    };
  }

  private getStatusValue(order: Order): string {
    const statusMap: Record<string, string> = {
      PENDING: 'PENDING',
      CONFIRMED: 'CONFIRMED',
      SHIPPED: 'SHIPPED',
      DELIVERED: 'DELIVERED',
      CANCELLED: 'CANCELLED',
    };
    const statusKey = Object.keys(statusMap).find(
      (key) => (OrderStatus as Record<string, unknown>)[key] === order.status,
    );
    return statusKey ? statusMap[statusKey] : 'PENDING';
  }

  private fromDynamoDBItem(item: Record<string, unknown> | undefined): Order | null {
    if (!item) return null;

    const { OrderStatus } = require('../../../domain/entities/order.entity');
    
    const products = (item.products as Array<{ productId: string; quantity: number; price: number }>) || [];
    const createdAt = item.createdAt ? new Date(item.createdAt as string) : new Date();
    const statusValue = (item.status as string) || 'PENDING';
    const status = (OrderStatus as Record<string, OrderStatus>)[statusValue] || OrderStatus.PENDING;

    const order = new Order(
      item.id as string,
      item.customerId as string,
      products,
      createdAt,
      status,
    );

    return order;
  }

  async create(order: Order): Promise<Order> {
    const command = new PutCommand({
      TableName: this.tableName,
      Item: this.toDynamoDBItem(order),
      ConditionExpression: 'attribute_not_exists(id)',
    });

    await this.client.send(command);
    console.log(`Order ${order.id} created successfully in DynamoDB`);
    return order;
  }

  async findById(id: string): Promise<Order | null> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: { id },
    });

    const result = await this.client.send(command);
    return this.fromDynamoDBItem(result.Item as Record<string, unknown> | undefined);
  }

  async update(order: Order): Promise<Order> {
    const command = new UpdateCommand({
      TableName: this.tableName,
      Key: { id: order.id },
      UpdateExpression: 'SET customerId = :customerId, products = :products, #status = :status',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':customerId': order.customerId,
        ':products': order.products,
        ':status': this.getStatusValue(order),
      },
      ReturnValues: 'ALL_NEW',
    });

    const result = await this.client.send(command);
    console.log(`Order ${order.id} updated successfully in DynamoDB`);
    return this.fromDynamoDBItem(result.Attributes as Record<string, unknown>) || order;
  }

  async delete(id: string): Promise<void> {
    const command = new DeleteCommand({
      TableName: this.tableName,
      Key: { id },
    });

    await this.client.send(command);
    console.log(`Order ${id} deleted successfully from DynamoDB`);
  }

  async findAll(): Promise<Order[]> {
    const command = new ScanCommand({
      TableName: this.tableName,
    });

    const result = await this.client.send(command);
    const items = result.Items || [];
    return items
      .map((item) => this.fromDynamoDBItem(item as Record<string, unknown>))
      .filter((order): order is Order => order !== null);
  }
}

import { OrderStatus } from '../../../domain/entities/order.entity';

// === ARCHIVO: api/src/infrastructure/controllers/order.controller.ts ===
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { Order } from '../../domain/entities/order.entity';
import { OrderService } from '../../application/services/order.service';
import { CreateOrderDto } from '../../application/dto/create-order.dto';
import { UpdateOrderDto } from '../../application/dto/update-order.dto';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  private readonly logger = new Logger(OrderController.name);

  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully', type: Order })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    this.logger.log(`Creating order for customer: ${createOrderDto.customerId}`);
    
    try {
      createOrderDto.validate();
      const order = await this.orderService.createOrder(createOrderDto);
      this.logger.log(`Order created with ID: ${order.id}`);
      return order;
    } catch (error) {
      this.logger.error(`Failed to create order: ${error.message}`, error.stack);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create order');
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an order by ID' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order found', type: Order })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getOrder(@Param('id') id: string): Promise<Order> {
    this.logger.log(`Fetching order with ID: ${id}`);
    
    try {
      const order = await this.orderService.getOrder(id);
      if (!order) {
        this.logger.warn(`Order not found: ${id}`);
        throw new NotFoundException(`Order with ID ${id} not found`);
      }
      return order;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to fetch order: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to fetch order');
    }
  }

  @Get()
  @ApiOperation({ summary: 'List all orders' })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully', type: [Order] })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async listOrders(): Promise<Order[]> {
    this.logger.log('Fetching all orders');
    
    try {
      const orders = await this.orderService.listOrders();
      this.logger.log(`Retrieved ${orders.length} orders`);
      return orders;
    } catch (error) {
      this.logger.error(`Failed to list orders: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to list orders');
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing order' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiBody({ type: UpdateOrderDto })
  @ApiResponse({ status: 200, description: 'Order updated successfully', type: Order })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    this.logger.log(`Updating order with ID: ${id}`);
    
    try {
      const order = await this.orderService.updateOrder(id, updateOrderDto);
      if (!order) {
        this.logger.warn(`Order not found for update: ${id}`);
        throw new NotFoundException(`Order with ID ${id} not found`);
      }
      this.logger.log(`Order ${id} updated successfully`);
      return order;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Failed to update order: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to update order');
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an order' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({ status: 204, description: 'Order deleted successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async deleteOrder(@Param('id') id: string): Promise<void> {
    this.logger.log(`Deleting order with ID: ${id}`);
    
    try {
      const exists = await this.orderService.getOrder(id);
      if (!exists) {
        this.logger.warn(`Order not found for deletion: ${id}`);
        throw new NotFoundException(`Order with ID ${id} not found`);
      }
      await this.orderService.deleteOrder(id);
      this.logger.log(`Order ${id} deleted successfully`);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to delete order: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to delete order');
    }
  }
}

// === ARCHIVO: api/src/infrastructure/controllers/order.controller.spec.ts ===
import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from '../../application/services/order.service';
import { Order, OrderStatus } from '../../domain/entities/order.entity';
import { CreateOrderDto } from '../../application/dto/create-order.dto';
import { UpdateOrderDto } from '../../application/dto/update-order.dto';

describe('OrderController', () => {
  let controller: OrderController;
  let orderService: jest.Mocked<OrderService>;

  const mockOrder: Order = new Order(
    'order-123',
    'customer-456',
    [
      { productId: 'prod-1', quantity: 2, price: 100.0 },
      { productId: 'prod-2', quantity: 1, price: 50.0 },
    ],
    new Date('2024-01-15T10:00:00Z'),
    OrderStatus.PENDING,
  );

  beforeEach(async () => {
    const mockOrderService = {
      createOrder: jest.fn(),
      getOrder: jest.fn(),
      updateOrder: jest.fn(),
      deleteOrder: jest.fn(),
      listOrders: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    orderService = module.get(OrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    it('should create an order successfully', async () => {
      const createDto = new CreateOrderDto('customer-456', [
        { productId: 'prod-1', quantity: 2, price: 100.0 },
      ]);
      orderService.createOrder.mockResolvedValue(mockOrder);

      const result = await controller.createOrder(createDto);

      expect(orderService.createOrder).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockOrder);
    });

    it('should throw BadRequestException when validation fails', async () => {
      const createDto = new CreateOrderDto('', []);
      
      await expect(controller.createOrder(createDto)).rejects.toThrow(BadRequestException);
      expect(orderService.createOrder).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException on service error', async () => {
      const createDto = new CreateOrderDto('customer-456', [
        { productId: 'prod-1', quantity: 1, price: 100.0 },
      ]);
      orderService.createOrder.mockRejectedValue(new Error('Database error'));

      await expect(controller.createOrder(createDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('getOrder', () => {
    it('should return an order when found', async () => {
      orderService.getOrder.mockResolvedValue(mockOrder);

      const result = await controller.getOrder('order-123');

      expect(orderService.getOrder).toHaveBeenCalledWith('order-123');
      expect(result).toEqual(mockOrder);
    });

    it('should throw NotFoundException when order not found', async () => {
      orderService.getOrder.mockResolvedValue(null);

      await expect(controller.getOrder('non-existent')).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on service error', async () => {
      orderService.getOrder.mockRejectedValue(new Error('Database connection failed'));

      await expect(controller.getOrder('order-123')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('listOrders', () => {
    it('should return all orders', async () => {
      const orders = [mockOrder, { ...mockOrder, id: 'order-456' }];
      orderService.listOrders.mockResolvedValue(orders);

      const result = await controller.listOrders();

      expect(orderService.listOrders).toHaveBeenCalled();
      expect(result).toEqual(orders);
    });

    it('should return empty array when no orders exist', async () => {
      orderService.listOrders.mockResolvedValue([]);

      const result = await controller.listOrders();

      expect(orderService.listOrders).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('should throw InternalServerErrorException on service error', async () => {
      orderService.listOrders.mockRejectedValue(new Error('DynamoDB error'));

      await expect(controller.listOrders()).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('updateOrder', () => {
    it('should update an order successfully', async () => {
      const updateDto = new UpdateOrderDto();
      updateDto.customerId = 'new-customer';
      const updatedOrder = { ...mockOrder, customerId: 'new-customer' };
      orderService.updateOrder.mockResolvedValue(updatedOrder as Order);

      const result = await controller.updateOrder('order-123', updateDto);

      expect(orderService.updateOrder).toHaveBeenCalledWith('order-123', updateDto);
      expect(result).toEqual(updatedOrder);
    });

    it('should throw NotFoundException when order to update not found', async () => {
      const updateDto = new UpdateOrderDto();
      updateDto.customerId = 'new-customer';
      orderService.updateOrder.mockResolvedValue(null);

      await expect(controller.updateOrder('non-existent', updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException on service error', async () => {
      const updateDto = new UpdateOrderDto();
      updateDto.customerId = 'new-customer';
      orderService.updateOrder.mockRejectedValue(new Error('Update failed'));

      await expect(controller.updateOrder('order-123', updateDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('deleteOrder', () => {
    it('should delete an order successfully', async () => {
      orderService.getOrder.mockResolvedValue(mockOrder);
      orderService.deleteOrder.mockResolvedValue();

      await controller.deleteOrder('order-123');

      expect(orderService.getOrder).toHaveBeenCalledWith('order-123');
      expect(orderService.deleteOrder).toHaveBeenCalledWith('order-123');
    });

    it('should throw NotFoundException when order to delete not found', async () => {
      orderService.getOrder.mockResolvedValue(null);

      await expect(controller.deleteOrder('non-existent')).rejects.toThrow(NotFoundException);
      expect(orderService.deleteOrder).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException on service error', async () => {
      orderService.getOrder.mockResolvedValue(mockOrder);
      orderService.deleteOrder.mockRejectedValue(new Error('Delete failed'));

      await expect(controller.deleteOrder('order-123')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
}

// === ARCHIVO: api/src/app.module.ts ===
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { OrderController } from './infrastructure/controllers/order.controller';
import { OrderService } from './application/services/order.service';
import { DynamoDBOrderRepository } from './infrastructure/repositories/dynamodb/order.repository';
import { GlobalExceptionFilter } from '../infrastructure/filters/global-exception.filter';
import { dynamoDbConfig } from './config/dynamodb.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dynamoDbConfig],
    }),
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    DynamoDBOrderRepository,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
"// === ARCHIVO: infrastructure/filters/global-exception.filter.ts ===
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Error interno del servidor';
    let error = 'Internal Server Error';
    let details: unknown = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as Record<string, unknown>;
        message = (responseObj.message as string) || exception.message;
        error = (responseObj.error as string) || error;
        details = responseObj.details;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(
        `Unhandled exception: ${exception.message}`,
        exception.stack,
      );
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      error,
      message,
      ...(details && { details }),
    };

    this.logger.error(
      `${request.method} ${request.url} ${status} - ${message}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    response.status(status).json(errorResponse);
  }
}

// === ARCHIVO: api/src/config/dynamodb.config.ts ===
import { DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';

export interface DynamoDbConfigOptions {
  region: string;
  endpoint?: string;
  credentials?: {
    accessKeyId: string;
    secretAccessKey: string;
  };
  tableName: string;
}

export const dynamoDbConfig = (): { dynamodb: DynamoDbConfigOptions } => {
  return {
    dynamodb: {
      region: process.env.AWS_REGION || 'us-east-1',
      endpoint: process.env.DYNAMODB_ENDPOINT,
      credentials: process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
        ? {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          }
        : undefined,
      tableName: process.env.DYNAMODB_TABLE_NAME || 'orders',
    },
  };
};

export const getDynamoDBClientConfig = (): DynamoDBClientConfig => {
  const config: DynamoDBClientConfig = {
    region: process.env.AWS_REGION || 'us-east-1',
  };

  if (process.env.DYNAMODB_ENDPOINT) {
    config.endpoint = process.env.DYNAMODB_ENDPOINT;
  }

  if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    config.credentials = {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    };
  }

  return config;
};

export const getTableName = (): string => {
  return process.env.DYNAMODB_TABLE_NAME || 'orders';
};

export const validateDynamoDbConfig = (): void => {
  const requiredEnvVars = ['AWS_REGION'];
  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar],
  );

  if (missingEnvVars.length > 0) {
    console.warn(
      `Warning: Missing environment variables for DynamoDB configuration: ${missingEnvVars.join(', ')}. Using default values.`,
    );
  }

  if (process.env.DYNAMODB_ENDPOINT) {
    console.log(`Using DynamoDB endpoint: ${process.env.DYNAMODB_ENDPOINT}`);
  } else {
    console.log(`Using DynamoDB region: ${process.env.AWS_REGION || 'us-east-1'}`);
  }

  console.log(`DynamoDB table: ${process.env.DYNAMODB_TABLE_NAME || 'orders'}`);
};

// === ARCHIVO: api/test/jest-e2e.json ===
{
  "moduleFileExtensions": [
    "js",
    "json",
    "ts"
  ],
  "rootDir": ".",
  "testEnvironment": "node",
  "testRegex": ".e2e-spec.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  }
}


// === ARCHIVO: client/package.json ===
{
  "name": "client",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "test": "vitest",
    "test:watch": "vitest watch"
  },
  "dependencies": {
    "axios": "1.6.7",
    "react": "19.0.0-beta-26f2496093-20240514",
    "react-dom": "19.0.0-beta-26f2496093-20240514",
    "react-router-dom": "^6.22.0",
    "zustand": "4.4.7",
    "msw": "2.2.14"
  },
  "devDependencies": {
    "@testing-library/react": "14.2.1",
    "@types/react": "18.2.56",
    "@types/react-dom": "18.2.19",
    "@vitejs/plugin-react": "4.2.1",
    "eslint": "8.56.0",
    "eslint-plugin-react": "7.33.2",
    "eslint-plugin-react-hooks": "4.6.0",
    "eslint-plugin-react-refresh": "0.4.5",
    "typescript": "^5.7.3",
    "vite": "5.0.0",
    "vitest": "1.2.2"
  },
  "eslintConfig": {
    "extends": [
      "eslint:recommended",
      "plugin:react/recommended",
      "plugin:react-hooks/recommended"
    ],
    "parserOptions": {
      "ecmaVersion": "latest",
      "sourceType": "module",
      "ecmaFeatures": {
        "jsx": true
      }
    },
    "rules": {
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off"
    },
    "settings": {
      "react": {
        "version": "detect"
      }
    }
  }
}


// === ARCHIVO: client/vite.config.ts ===
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@features': fileURLToPath(new URL('./src/features', import.meta.url)),
      '@shared': fileURLToPath(new URL('./src/shared', import.meta.url)),
      '@services': fileURLToPath(new URL('./src/services', import.meta.url)),
      '@types': fileURLToPath(new URL('./src/types', import.meta.url))
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    }
  }
});

// === ARCHIVO: client/tsconfig.json ===
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": [
      "ES2020",
      "DOM",
      "DOM.Iterable"
    ],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "node",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "paths": {
      "@/*": [
        "src/*"
      ],
      "@features/*": [
        "src/features/*"
      ],
      "@shared/*": [
        "src/shared/*"
      ],
      "@services/*": [
        "src/services/*"
      ],
      "@types/*": [
        "src/types/*"
      ]
    }
  },
  "include": [
    "src"
  ]
}


// === ARCHIVO: client/src/main.tsx ===
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

async function enableMocking() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser');
    return worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: {
        url: '/mockServiceWorker.js'
      }
    });
  }
  return Promise.resolve();
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
});

// === ARCHIVO: client/src/App.tsx ===
import { Routes, Route, Navigate } from 'react-router-dom';
import { useOrderStore } from './features/orders/orderStore';
import { OrderList } from './features/orders/OrderList';
import { OrderForm } from './features/orders/OrderForm';
import { ErrorMessage } from './shared/components/ErrorMessage';
import { LoadingSpinner } from './shared/components/LoadingSpinner';

function App() {
  const { error, isLoading, clearError } = useOrderStore();

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Gestión de Órdenes</h1>
        <p>Sistema de gestión de órdenes en DynamoDB</p>
      </header>

      <main className="app-main">
        {error && (
          <ErrorMessage 
            message={error} 
            onClose={clearError}
          />
        )}

        {isLoading && <LoadingSpinner />}

        <Routes>
          <Route path="/" element={<Navigate to="/orders" replace />} />
          <Route path="/orders" element={<OrderList />} />
          <Route path="/orders/new" element={<OrderForm />} />
          <Route path="/orders/:id/edit" element={<OrderForm />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

// === ARCHIVO: client/index.html ===
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Sistema de gestión de órdenes en DynamoDB - CRUD completo con React" />
    <meta name="theme-color" content="#2563eb" />
    <meta name="color-scheme" content="light dark" />
    <meta property="og:title" content="Gestión de Órdenes" />
    <meta property="og:description" content="Sistema de gestión de órdenes en DynamoDB" />
    <meta property="og:type" content="website" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <link rel="apple-touch-icon" href="/icon-192.png" />
    <link rel="manifest" href="/manifest.json" />
    <title>Gestión de Órdenes</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      html, body, #root {
        height: 100%;
        width: 100%;
      }
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        background-color: #f8fafc;
        color: #1e293b;
      }
      @media (prefers-color-scheme: dark) {
        body {
          background-color: #0f172a;
          color: #f1f5f9;
        }
      }
      #root {
        display: flex;
        flex-direction: column;
      }
      .loading-container {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
        flex-direction: column;
        gap: 1rem;
      }
      .loading-spinner {
        width: 48px;
        height: 48px;
        border: 4px solid #e2e8f0;
        border-top-color: #2563eb;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      .loading-text {
        font-size: 1rem;
        color: #64748b;
      }
      .error-container {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
        flex-direction: column;
        gap: 1rem;
        padding: 2rem;
        text-align: center;
      }
      .error-icon {
        font-size: 3rem;
        color: #ef4444;
      }
      .error-message {
        font-size: 1.125rem;
        color: #dc2626;
        max-width: 400px;
      }
      .error-retry {
        padding: 0.75rem 1.5rem;
        background-color: #2563eb;
        color: white;
        border: none;
        border-radius: 0.5rem;
        cursor: pointer;
        font-size: 1rem;
        transition: background-color 0.2s;
      }
      .error-retry:hover {
        background-color: #1d4ed8;
      }
    </style>
  </head>
  <body>
    <div id="root">
      <div class="loading-container" aria-label="Cargando aplicación">
        <div class="loading-spinner" role="status"></div>
        <p class="loading-text">Cargando aplicación...</p>
      </div>
    </div>
    <script type="module" src="/src/main.tsx"></script>
    <noscript>
      <div class="error-container">
        <span class="error-icon" role="img" aria-label="Error">⚠️</span>
        <p class="error-message">
          Esta aplicación requiere JavaScript para funcionar. 
          Por favor, habilite JavaScript en su navegador o utilice uno que lo soporte.
        </p>
      </div>
    </noscript>
  </body>
</html>

// === ARCHIVO: client/src/features/orders/OrderItem.tsx ===
import React from 'react';
import { Order } from '@/types/order';

interface OrderItemProps {
  order: Order;
  onEdit: (order: Order) => void;
  onDelete: (id: string) => void;
}

export const OrderItem: React.FC<OrderItemProps> = ({ order, onEdit, onDelete }) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusColor = (status: string): string => {
    const statusColors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      processing: 'bg-blue-100 text-blue-800 border-blue-300',
      completed: 'bg-green-100 text-green-800 border-green-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300'
    };
    return statusColors[status.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const calculateTotal = (): string => {
    if (!order.products || order.products.length === 0) {
      return '$0.00';
    }
    const total = order.products.reduce((sum, product) => {
      return sum + (product.price * product.quantity);
    }, 0);
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(total);
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 mb-4 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Orden #{order.id.slice(0, 8).toUpperCase()}
          </h3>
          <p className="text-sm text-gray-500">
            Cliente: <span className="font-medium">{order.clientName}</span>
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
          {order.status.toUpperCase()}
        </span>
      </div>

      <div className="mb-3">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Productos:</h4>
        <ul className="space-y-1">
          {order.products?.map((product, index) => (
            <li key={index} className="text-sm text-gray-600 flex justify-between">
              <span>{product.name} x{product.quantity}</span>
              <span className="font-medium">${(product.price * product.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          <span className="block">Creada: {formatDate(order.createdAt)}</span>
          {order.updatedAt && (
            <span className="block">Actualizada: {formatDate(order.updatedAt)}</span>
          )}
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-gray-900">
            Total: {calculateTotal()}
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onEdit(order)}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
        >
          Editar
        </button>
        <button
          onClick={() => {
            if (window.confirm('¿Está seguro de eliminar esta orden?')) {
              onDelete(order.id);
            }
          }}
          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

// === ARCHIVO: client/src/features/orders/OrderList.tsx ===
import React, { useEffect, useState } from 'react';
import { Order } from '@/types/order';
import { orderService } from '@/services/order.service';
import { OrderItem } from './OrderItem';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { ErrorMessage } from '@/shared/components/ErrorMessage';

interface OrderListProps {
  onEditOrder: (order: Order) => void;
  refreshTrigger?: number;
}

export const OrderList: React.FC<OrderListProps> = ({ onEditOrder, refreshTrigger = 0 }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const fetchOrders = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await orderService.listOrders();
      setOrders(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar las órdenes';
      setError(errorMessage);
      console.error('Error fetching orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [refreshTrigger]);

  const handleDelete = async (id: string): Promise<void> => {
    try {
      setDeleteLoading(id);
      await orderService.deleteOrder(id);
      setOrders(prev => prev.filter(order => order.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar la orden';
      setError(errorMessage);
      console.error('Error deleting order:', err);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleEdit = (order: Order): void => {
    onEditOrder(order);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <ErrorMessage 
          message={error} 
          onRetry={fetchOrders}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Lista de Órdenes
        </h2>
        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200 text-sm font-medium"
        >
          Actualizar
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center">
          <p className="text-gray-500 text-lg">
            No hay órdenes disponibles.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Cree una nueva orden para comenzar.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderItem
              key={order.id}
              order={order}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {deleteLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6">
            <LoadingSpinner />
            <p className="mt-2 text-gray-600">Eliminando orden...</p>
          </div>
        </div>
      )}
    </div>
  );
};

// === ARCHIVO: client/src/features/orders/OrderForm.tsx ===
import { useState, useEffect } from 'react';
import { useOrderStore } from './orderStore';
import { CreateOrderDto, UpdateOrderDto, Order, OrderStatus } from '@/types/order';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { ErrorMessage } from '@/shared/components/ErrorMessage';

interface OrderFormProps {
  order?: Order | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface OrderItemInput {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export function OrderForm({ order, onSuccess, onCancel }: OrderFormProps) {
  const { createOrder, updateOrder, isLoading, error, clearError } = useOrderStore();
  const isEditing = !!order;

  const [customerId, setCustomerId] = useState(order?.customerId || '');
  const [customerName, setCustomerName] = useState(order?.customerName || '');
  const [items, setItems] = useState<OrderItemInput[]>(
    order?.items?.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    })) || [{ productId: '', productName: '', quantity: 1, unitPrice: 0 }]
  );
  const [status, setStatus] = useState<OrderStatus>(order?.status || 'pending');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const addItem = () => {
    setItems([...items, { productId: '', productName: '', quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof OrderItemInput, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  };

  const validateForm = (): boolean => {
    if (!customerId.trim()) {
      setFormError('El ID del cliente es obligatorio');
      return false;
    }
    if (!customerName.trim()) {
      setFormError('El nombre del cliente es obligatorio');
      return false;
    }
    const validItems = items.filter(
      (item) => item.productId.trim() && item.productName.trim() && item.quantity > 0
    );
    if (validItems.length === 0) {
      setFormError('Debe agregar al menos un producto');
      return false;
    }
    setFormError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const validItems = items
        .filter((item) => item.productId.trim() && item.productName.trim())
        .map((item) => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        }));

      if (isEditing && order) {
        const updateData: UpdateOrderDto = {
          customerId,
          customerName,
          items: validItems,
          status,
        };
        await updateOrder(order.id, updateData);
      } else {
        const createData: CreateOrderDto = {
          customerId,
          customerName,
          items: validItems,
          status: 'pending',
        };
        await createOrder(createData);
      }
      onSuccess?.();
    } catch {
      // Error manejado por el store
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <form onSubmit={handleSubmit} className="order-form">
      {(error || formError) && (
        <ErrorMessage message={formError || error || ''} onClose={() => {
          setFormError(null);
          clearError();
        }} />
      )}

      <div className="form-section">
        <h3>Información del Cliente</h3>
        <div className="form-group">
          <label htmlFor="customerId">ID del Cliente</label>
          <input
            id="customerId"
            type="text"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="customerName">Nombre del Cliente</label>
          <input
            id="customerName"
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
      </div>

      {isEditing && (
        <div className="form-section">
          <h3>Estado de la Orden</h3>
          <div className="form-group">
            <label htmlFor="status">Estado</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as OrderStatus)}
              disabled={isLoading}
            >
              <option value="pending">Pendiente</option>
              <option value="processing">Procesando</option>
              <option value="completed">Completada</option>
              <option value="cancelled">Cancelada</option>
            </select>
          </div>
        </div>
      )}

      <div className="form-section">
        <h3>Productos</h3>
        {items.map((item, index) => (
          <div key={index} className="item-row">
            <div className="form-group">
              <label htmlFor={`productId-${index}`}>ID Producto</label>
              <input
                id={`productId-${index}`}
                type="text"
                value={item.productId}
                onChange={(e) => updateItem(index, 'productId', e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor={`productName-${index}`}>Nombre Producto</label>
              <input
                id={`productName-${index}`}
                type="text"
                value={item.productName}
                onChange={(e) => updateItem(index, 'productName', e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor={`quantity-${index}`}>Cantidad</label>
              <input
                id={`quantity-${index}`}
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                disabled={isLoading}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor={`unitPrice-${index}`}>Precio Unitario</label>
              <input
                id={`unitPrice-${index}`}
                type="number"
                min="0"
                step="0.01"
                value={item.unitPrice}
                onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                disabled={isLoading}
                required
              />
            </div>
            <button
              type="button"
              onClick={() => removeItem(index)}
              disabled={isLoading || items.length === 1}
              className="btn-remove"
            >
              Eliminar
            </button>
          </div>
        ))}
        <button type="button" onClick={addItem} disabled={isLoading} className="btn-add">
          Agregar Producto
        </button>
      </div>

      <div className="form-section total-section">
        <span className="total-label">Total:</span>
        <span className="total-value">${calculateTotal().toFixed(2)}</span>
      </div>

      <div className="form-actions">
        <button type="submit" disabled={isLoading} className="btn-submit">
          {isLoading ? 'Guardando...' : isEditing ? 'Actualizar Orden' : 'Crear Orden'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} disabled={isLoading} className="btn-cancel">
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

// === ARCHIVO: client/src/types/order.ts ===
export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateOrderDto {
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }>;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  notes?: string;
}

export interface UpdateOrderDto {
  status?: OrderStatus;
  items?: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }>;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  notes?: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderListResponse {
  orders: Order[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, unknown>;
}

// === ARCHIVO: client/src/services/order.service.ts ===
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { Order, CreateOrderDto, UpdateOrderDto, ApiError } from '@/types/order';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export class OrderService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `${API_BASE_URL}/api`,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        if (error.response) {
          const errorData = error.response.data;
          console.error('API Error Response:', {
            status: error.response.status,
            message: errorData?.message || error.message,
            code: errorData?.code,
          });
          return Promise.reject(new Error(errorData?.message || 'Error en la solicitud'));
        } else if (error.request) {
          console.error('API No Response:', error.message);
          return Promise.reject(new Error('No se recibió respuesta del servidor'));
        } else {
          console.error('API Request Error:', error.message);
          return Promise.reject(new Error('Error al procesar la solicitud'));
        }
      }
    );
  }

  async createOrder(orderData: CreateOrderDto): Promise<Order> {
    const response: AxiosResponse<Order> = await this.client.post<Order>('/orders', orderData);
    return response.data;
  }

  async getOrder(id: string): Promise<Order> {
    if (!id || id.trim() === '') {
      throw new Error('El ID de la orden es requerido');
    }
    const response: AxiosResponse<Order> = await this.client.get<Order>(`/orders/${id}`);
    return response.data;
  }

  async updateOrder(id: string, orderData: UpdateOrderDto): Promise<Order> {
    if (!id || id.trim() === '') {
      throw new Error('El ID de la orden es requerido');
    }
    const response: AxiosResponse<Order> = await this.client.put<Order>(`/orders/${id}`, orderData);
    return response.data;
  }

  async deleteOrder(id: string): Promise<void> {
    if (!id || id.trim() === '') {
      throw new Error('El ID de la orden es requerido');
    }
    await this.client.delete(`/orders/${id}`);
  }

  async listOrders(params?: {
    page?: number;
    pageSize?: number;
    status?: string;
    customerId?: string;
  }): Promise<Order[]> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params?.pageSize) {
      queryParams.append('pageSize', params.pageSize.toString());
    }
    if (params?.status) {
      queryParams.append('status', params.status);
    }
    if (params?.customerId) {
      queryParams.append('customerId', params.customerId);
    }

    const queryString = queryParams.toString();
    const url = queryString ? `/orders?${queryString}` : '/orders';
    
    const response: AxiosResponse<Order[]> = await this.client.get<Order[]>(url);
    return response.data;
  }

  async getOrdersByStatus(status: string): Promise<Order[]> {
    const response: AxiosResponse<Order[]> = await this.client.get<Order[]>(`/orders?status=${status}`);
    return response.data;
  }

  async getOrdersByCustomer(customerId: string): Promise<Order[]> {
    if (!customerId || customerId.trim() === '') {
      throw new Error('El ID del cliente es requerido');
    }
    const response: AxiosResponse<Order[]> = await this.client.get<Order[]>(`/orders?customerId=${customerId}`);
    return response.data;
  }
}

export const orderService = new OrderService();
export default orderService;

// === ARCHIVO: client/src/shared/components/ErrorMessage.tsx ===
import React from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  onRetry, 
  className = '' 
}) => {
  return (
    <div 
      role="alert"
      className={`error-message-container ${className}`}
      style={{
        padding: '1rem',
        borderRadius: '8px',
        backgroundColor: '#fee2e2',
        border: '1px solid #fecaca',
        color: '#991b1b',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        alignItems: 'flex-start'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 20 20" 
          fill="currentColor"
          aria-hidden="true"
        >
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
        </svg>
        <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Error</span>
      </div>
      
      <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: '1.5' }}>
        {message}
      </p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'background-color 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
          aria-label="Reintentar"
        >
          Reintentar
        </button>
      )}
    </div>
  );
};

// === ARCHIVO: client/src/shared/components/LoadingSpinner.tsx ===
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  className?: string;
  fullScreen?: boolean;
}

const sizeMap = {
  small: 24,
  medium: 40,
  large: 64
};

const messageSizeMap = {
  small: '0.75rem',
  medium: '0.875rem',
  large: '1rem'
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  message,
  className = '',
  fullScreen = false 
}) => {
  const spinnerSize = sizeMap[size];
  const fontSize = messageSizeMap[size];
  
  const containerStyle: React.CSSProperties = fullScreen ? {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 9999,
    gap: '1rem'
  } : {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
    gap: '1rem'
  };
  
  const spinnerStyle: React.CSSProperties = {
    width: spinnerSize,
    height: spinnerSize,
    border: '3px solid #e5e7eb',
    borderTopColor: '#3b82f6',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite'
  };
  
  return (
    <div 
      className={`loading-spinner-container ${className}`}
      style={containerStyle}
      role="status"
      aria-live="polite"
      aria-label={message || 'Cargando...'}
    >
      <style>
        {`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
      
      <div 
        style={spinnerStyle}
        aria-hidden="true"
      />
      
      {message && (
        <span style={{ 
          color: '#6b7280', 
          fontSize,
          fontWeight: 500 
        }}>
          {message}
        </span>
      )}
      
      <span className="sr-only" style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0
      }}>
        {message || 'Cargando contenido'}
      </span>
    </div>
  );
};

// Componente auxiliar para estados de carga inline
interface InlineLoadingProps {
  text?: string;
}

export const InlineLoading: React.FC<InlineLoadingProps> = ({ 
  text = 'Cargando...' 
}) => (
  <span 
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: '#6b7280',
      fontSize: '0.875rem'
    }}
    role="status"
    aria-label={text}
  >
    <span 
      style={{
        width: '12px',
        height: '12px',
        border: '2px solid #e5e7eb',
        borderTopColor: '#3b82f6',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }}
      aria-hidden="true"
    />
    {text}
    <style>
      {`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}
    </style>
  </span>
);

// === ARCHIVO: client/src/index.css ===
/* Estilos pendientes: archivo creado automaticamente porque otro modulo lo importa. */


// === ARCHIVO: client/src/setupTests.ts ===
// Setup de tests generado automaticamente (referenciado por la config del runner).
// Agrega aca matchers globales o mocks compartidos.
export {};


// === ARCHIVO: client/src/mocks/browser.ts ===
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

// === ARCHIVO: client/src/features/orders/orderStore.ts ===
import { create } from 'zustand';
import { Order, CreateOrderDto, UpdateOrderDto, OrderStatus } from '../../types/order';
import { OrderService } from '../../services/order.service';

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  
  fetchOrders: (status?: OrderStatus, customerId?: string) => Promise<void>;
  fetchOrder: (id: string) => Promise<void>;
  createOrder: (orderData: CreateOrderDto) => Promise<Order>;
  updateOrder: (id: string, orderData: UpdateOrderDto) => Promise<Order>;
  deleteOrder: (id: string) => Promise<void>;
  clearError: () => void;
  clearCurrentOrder: () => void;
}

const orderService = new OrderService();

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,

  fetchOrders: async (status?: OrderStatus, customerId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (customerId) params.append('customerId', customerId);
      
      const orders = await orderService.listOrders(
        params.toString() ? Object.fromEntries(params) : undefined
      );
      set({ orders, isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch orders';
      set({ error: message, isLoading: false });
    }
  },

  fetchOrder: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const order = await orderService.getOrder(id);
      set({ currentOrder: order, isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch order';
      set({ error: message, isLoading: false });
    }
  },

  createOrder: async (orderData: CreateOrderDto) => {
    set({ isLoading: true, error: null });
    try {
      const newOrder = await orderService.createOrder(orderData);
      set(state => ({
        orders: [...state.orders, newOrder],
        isLoading: false
      }));
      return newOrder;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create order';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  updateOrder: async (id: string, orderData: UpdateOrderDto) => {
    set({ isLoading: true, error: null });
    try {
      const updatedOrder = await orderService.updateOrder(id, orderData);
      set(state => ({
        orders: state.orders.map(o => o.id === id ? updatedOrder : o),
        currentOrder: state.currentOrder?.id === id ? updatedOrder : state.currentOrder,
        isLoading: false
      }));
      return updatedOrder;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update order';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  deleteOrder: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await orderService.deleteOrder(id);
      set(state => ({
        orders: state.orders.filter(o => o.id !== id),
        currentOrder: state.currentOrder?.id === id ? null : state.currentOrder,
        isLoading: false
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete order';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
  clearCurrentOrder: () => set({ currentOrder: null })
}));

// === ARCHIVO: client/src/mocks/handlers.ts ===
import { http, HttpResponse, delay } from 'msw';
import type { Order, CreateOrderDto, UpdateOrderDto } from '../types/order';

const ordersDb: Order[] = [
  {
    id: '1',
    customerId: 'customer-001',
    customerName: 'Juan Pérez',
    items: [
      { productId: 'prod-001', productName: 'Laptop Pro', quantity: 1, unitPrice: 1299.99 },
      { productId: 'prod-002', productName: 'Mouse Inalámbrico', quantity: 2, unitPrice: 29.99 }
    ],
    total: 1359.97,
    status: 'completed',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T14:20:00Z'
  },
  {
    id: '2',
    customerId: 'customer-002',
    customerName: 'María García',
    items: [
      { productId: 'prod-003', productName: 'Monitor 27"', quantity: 1, unitPrice: 399.99 }
    ],
    total: 399.99,
    status: 'processing',
    createdAt: '2024-01-16T09:15:00Z',
    updatedAt: '2024-01-16T09:15:00Z'
  },
  {
    id: '3',
    customerId: 'customer-003',
    customerName: 'Carlos López',
    items: [
      { productId: 'prod-004', productName: 'Teclado Mecánico', quantity: 1, unitPrice: 149.99 },
      { productId: 'prod-005', productName: 'Alfombrilla XL', quantity: 1, unitPrice: 24.99 }
    ],
    total: 174.98,
    status: 'pending',
    createdAt: '2024-01-17T16:45:00Z',
    updatedAt: '2024-01-17T16:45:00Z'
  }
];

let nextId = 4;

export const handlers = [
  http.get('http://localhost:3000/orders', async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const customerId = url.searchParams.get('customerId');
    
    let filteredOrders = [...ordersDb];
    
    if (status) {
      filteredOrders = filteredOrders.filter(order => order.status === status);
    }
    
    if (customerId) {
      filteredOrders = filteredOrders.filter(order => order.customerId === customerId);
    }
    
    return HttpResponse.json(filteredOrders);
  }),
  
  http.get('http://localhost:3000/orders/:id', async ({ params }) => {
    await delay(200);
    const order = ordersDb.find(o => o.id === params.id);
    
    if (!order) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(order);
  }),
  
  http.post('http://localhost:3000/orders', async ({ request }) => {
    await delay(400);
    const body = await request.json() as CreateOrderDto;
    
    const newOrder: Order = {
      id: String(nextId++),
      customerId: body.customerId,
      customerName: body.customerName,
      items: body.items,
      total: body.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    ordersDb.push(newOrder);
    return HttpResponse.json(newOrder, { status: 201 });
  }),
  
  http.put('http://localhost:3000/orders/:id', async ({ params, request }) => {
    await delay(300);
    const orderIndex = ordersDb.findIndex(o => o.id === params.id);
    
    if (orderIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    
    const body = await request.json() as UpdateOrderDto;
    const updatedOrder: Order = {
      ...ordersDb[orderIndex],
      ...body,
      updatedAt: new Date().toISOString()
    };
    
    if (body.items) {
      updatedOrder.total = body.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    }
    
    ordersDb[orderIndex] = updatedOrder;
    return HttpResponse.json(updatedOrder);
  }),
  
  http.delete('http://localhost:3000/orders/:id', async ({ params }) => {
    await delay(250);
    const orderIndex = ordersDb.findIndex(o => o.id === params.id);
    
    if (orderIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    
    ordersDb.splice(orderIndex, 1);
    return new HttpResponse(null, { status: 204 });
  })
];

// === ARCHIVO: infra/README.md ===
# Terraform Infrastructure Module

## Overview
This Terraform module provisions AWS infrastructure resources following a modular structure.

## Structure
```
.
├── environments/
│   └── dev/
│       ├── main.tf          # Environment-specific resources
│       ├── terraform.tfvars  # Environment-specific variables
│       └── variables.tf      # Environment-specific variable declarations
├── modules/
│   └── dynamodb/
│       ├── main.tf          # DynamoDB resource definitions
│       ├── outputs.tf        # Module outputs
│       └── variables.tf      # Module input variables
├── providers.tf             # AWS provider configuration
├── variables.tf             # Root module variable declarations
├── versions.tf              # Terraform version constraints
└── outputs.tf               # Root module outputs
```

## Prerequisites
- Terraform >= 1.0.0
- AWS CLI configured with valid credentials
- IAM permissions to create the resources defined in the module

## Setup
1. Navigate to the desired environment directory (e.g., `environments/dev/`)
2. Initialize Terraform:
   ```bash
   terraform init
   ```
3. Review the execution plan:
   ```bash
   terraform plan
   ```
4. Apply the configuration:
   ```bash
   terraform apply
   ```

## Variables
Variables are defined in:
- Root `variables.tf`
- Environment-specific `variables.tf`
- Module-specific `variables.tf`

Environment-specific values are set in `terraform.tfvars` files.

## Outputs
Output values are defined in:
- Root `outputs.tf`
- Module `outputs.tf` files

## Validation
After applying, verify resources were created in the AWS Console or via AWS CLI.

## Cleanup
To destroy the created infrastructure:
```bash
terraform destroy
```

// === ARCHIVO: infra/providers.tf ===
terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.19.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Environment = var.environment
      Project     = var.project_name
      ManagedBy   = "Terraform"
    }
  }
}

# Configuración adicional para el proveedor AWS
# que permite manejar características avanzadas de DynamoDB
# como Time to Live (TTL) y Streams para eventos
provider "aws" {
  alias = "secondary"

  region = var.aws_secondary_region

  default_tags {
    tags = {
      Environment = var.environment
      Project     = var.project_name
      ManagedBy   = "Terraform"
    }
  }
}

# Validación de la región primaria para asegurar
# que coincide con las regiones habilitadas para DynamoDB
locals {
  valid_regions = [
    "us-east-1",
    "us-west-2",
    "eu-west-1",
    "ap-southeast-1"
  ]

  region_validation = contains(local.valid_regions, var.aws_region) ? true : "La región ${var.aws_region} no está soportada para DynamoDB"
}

# Configuración de endpoints para pruebas locales
# cuando se usa LocalStack o DynamoDB Local
resource "aws_dynamodb_endpoint" "local" {
  count             = var.use_localstack ? 1 : 0
  provider          = aws
  service_name      = "dynamodb"
  vpc_endpoint_type = "Interface"
  vpc_id            = var.vpc_id

  security_group_ids = var.security_group_ids

  private_dns_enabled = true
}

// === ARCHIVO: infra/variables.tf ===
variable "aws_region" {
  description = "Región principal de AWS donde se desplegarán los recursos."
  type        = string
  default     = "us-east-1"

  validation {
    condition     = contains(["us-east-1", "us-west-2", "eu-west-1", "ap-southeast-1"], var.aws_region)
    error_message = "La región debe ser una de las siguientes: us-east-1, us-west-2, eu-west-1, ap-southeast-1."
  }
}

variable "aws_secondary_region" {
  description = "Región secundaria de AWS para réplicas o recursos adicionales."
  type        = string
  default     = "us-west-2"
}

variable "environment" {
  description = "Entorno de despliegue (dev, staging, prod)."
  type        = string
  default     = "dev"

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "El entorno debe ser uno de: dev, staging, prod."
  }
}

variable "project_name" {
  description = "Nombre del proyecto para etiquetar recursos."
  type        = string
  default     = "order-management"
}

variable "use_localstack" {
  description = "Indica si se debe configurar para usar LocalStack en lugar de AWS real."
  type        = bool
  default     = false
}

variable "vpc_id" {
  description = "ID de la VPC donde se crearán los endpoints para DynamoDB Local."
  type        = string
  default     = ""
}

variable "security_group_ids" {
  description = "IDs de los security groups para los endpoints de DynamoDB Local."
  type        = list(string)
  default     = []
}

variable "dynamodb_table_name" {
  description = "Nombre de la tabla DynamoDB para órdenes."
  type        = string
  default     = "orders"
}

variable "billing_mode" {
  description = "Modo de facturación para la tabla DynamoDB (PROVISIONED o PAY_PER_REQUEST)."
  type        = string
  default     = "PAY_PER_REQUEST"

  validation {
    condition     = contains(["PROVISIONED", "PAY_PER_REQUEST"], var.billing_mode)
    error_message = "El modo de facturación debe ser PROVISIONED o PAY_PER_REQUEST."
  }
}

variable "read_capacity" {
  description = "Capacidad de lectura provisionada para la tabla DynamoDB (solo aplicable si billing_mode es PROVISIONED)."
  type        = number
  default     = 5
}

variable "write_capacity" {
  description = "Capacidad de escritura provisionada para la tabla DynamoDB (solo aplicable si billing_mode es PROVISIONED)."
  type        = number
  default     = 5
}

variable "enable_ttl" {
  description = "Indica si se debe habilitar Time to Live (TTL) en la tabla DynamoDB."
  type        = bool
  default     = false
}

variable "ttl_attribute_name" {
  description = "Nombre del atributo que se usará para TTL en DynamoDB."
  type        = string
  default     = "expiration_time"
}

variable "enable_stream" {
  description = "Indica si se debe habilitar el stream de DynamoDB para capturar cambios."
  type        = bool
  default     = false
}

variable "stream_view_type" {
  description = "Tipo de vista del stream de DynamoDB (KEYS_ONLY, NEW_IMAGE, OLD_IMAGE, NEW_AND_OLD_IMAGES)."
  type        = string
  default     = "NEW_AND_OLD_IMAGES"

  validation {
    condition     = contains(["KEYS_ONLY", "NEW_IMAGE", "OLD_IMAGE", "NEW_AND_OLD_IMAGES"], var.stream_view_type)
    error_message = "El tipo de vista del stream debe ser uno de: KEYS_ONLY, NEW_IMAGE, OLD_IMAGE, NEW_AND_OLD_IMAGES."
  }
}

// === ARCHIVO: infra/modules/dynamodb/variables.tf ===
variable "table_name" {
  description = "Nombre de la tabla DynamoDB."
  type        = string
}

variable "billing_mode" {
  description = "Modo de facturación para la tabla DynamoDB (PROVISIONED o PAY_PER_REQUEST)."
  type        = string
  default     = "PAY_PER_REQUEST"

  validation {
    condition     = contains(["PROVISIONED", "PAY_PER_REQUEST"], var.billing_mode)
    error_message = "El modo de facturación debe ser PROVISIONED o PAY_PER_REQUEST."
  }
}

variable "read_capacity" {
  description = "Capacidad de lectura provisionada para la tabla DynamoDB."
  type        = number
  default     = 5
}

variable "write_capacity" {
  description = "Capacidad de escritura provisionada para la tabla DynamoDB."
  type        = number
  default     = 5
}

variable "hash_key" {
  description = "Atributo que se usará como clave hash (partition key) de la tabla."
  type        = string
  default     = "id"
}

variable "range_key" {
  description = "Atributo que se usará como clave de rango (sort key) de la tabla."
  type        = string
  default     = ""
}

variable "attributes" {
  description = "Lista de atributos para la tabla DynamoDB."
  type = list(object({
    name = string
    type = string
  }))
  default = [
    {
      name = "id"
      type = "S"
    }
  ]
}

variable "global_secondary_indexes" {
  description = "Lista de índices secundarios globales para la tabla DynamoDB."
  type = list(object({
    name            = string
    hash_key        = string
    range_key       = string
    projection_type = string
    read_capacity   = number
    write_capacity  = number
    non_key_attributes = list(string)
  }))
  default = []
}

variable "local_secondary_indexes" {
  description = "Lista de índices secundarios locales para la tabla DynamoDB."
  type = list(object({
    name            = string
    range_key       = string
    projection_type = string
    non_key_attributes = list(string)
  }))
  default = []
}

variable "enable_ttl" {
  description = "Indica si se debe habilitar Time to Live (TTL) en la tabla DynamoDB."
  type        = bool
  default     = false
}

variable "ttl_attribute_name" {
  description = "Nombre del atributo que se usará para TTL en DynamoDB."
  type        = string
  default     = "expiration_time"
}

variable "enable_stream" {
  description = "Indica si se debe habilitar el stream de DynamoDB para capturar cambios."
  type        = bool
  default     = false
}

variable "stream_view_type" {
  description = "Tipo de vista del stream de DynamoDB (KEYS_ONLY, NEW_IMAGE, OLD_IMAGE, NEW_AND_OLD_IMAGES)."
  type        = string
  default     = "NEW_AND_OLD_IMAGES"
}

variable "tags" {
  description = "Etiquetas adicionales para la tabla DynamoDB."
  type        = map(string)
  default     = {}
}

variable "point_in_time_recovery" {
  description = "Indica si se debe habilitar la recuperación de punto en el tiempo para la tabla."
  type        = bool
  default     = false
}

variable "server_side_encryption" {
  description = "Configuración de cifrado del lado del servidor para la tabla DynamoDB."
  type = object({
    enabled     = bool
    kms_key_arn = string
  })
  default = {
    enabled     = true
    kms_key_arn = ""
  }
}

// === ARCHIVO: infra/environments/dev/variables.tf ===
variable "aws_region" {
  description = "Región de AWS para el entorno de desarrollo."
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Nombre del entorno (dev)."
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "Nombre del proyecto para etiquetar recursos en desarrollo."
  type        = string
  default     = "order-management"
}

variable "dynamodb_table_name" {
  description = "Nombre de la tabla DynamoDB para órdenes en desarrollo."
  type        = string
  default     = "orders-dev"
}

variable "billing_mode" {
  description = "Modo de facturación para la tabla DynamoDB en desarrollo."
  type        = string
  default     = "PAY_PER_REQUEST"
}

variable "enable_ttl" {
  description = "Indica si se debe habilitar TTL en la tabla DynamoDB de desarrollo."
  type        = bool
  default     = false
}

variable "enable_stream" {
  description = "Indica si se debe habilitar el stream de DynamoDB en desarrollo."
  type        = bool
  default     = true
}

variable "stream_view_type" {
  description = "Tipo de vista del stream para DynamoDB en desarrollo."
  type        = string
  default     = "NEW_AND_OLD_IMAGES"
}

variable "global_secondary_indexes" {
  description = "Índices secundarios globales para la tabla DynamoDB en desarrollo."
  type = list(object({
    name            = string
    hash_key        = string
    range_key       = string
    projection_type = string
    read_capacity   = number
    write_capacity  = number
    non_key_attributes = list(string)
  }))
  default = [
    {
      name            = "client-index"
      hash_key        = "client_id"
      range_key       = "order_date"
      projection_type = "INCLUDE"
      read_capacity   = 5
      write_capacity  = 5
      non_key_attributes = ["status", "total_amount"]
    },
    {
      name            = "status-index"
      hash_key        = "status"
      range_key       = "order_date"
      projection_type = "KEYS_ONLY"
      read_capacity   = 5
      write_capacity  = 5
      non_key_attributes = []
    }
  ]
}

variable "attributes" {
  description = "Atributos para la tabla DynamoDB en desarrollo."
  type = list(object({
    name = string
    type = string
  }))
  default = [
    {
      name = "id"
      type = "S"
    },
    {
      name = "client_id"
      type = "S"
    },
    {
      name = "order_date"
      type = "S"
    },
    {
      name = "status"
      type = "S"
    },
    {
      name = "total_amount"
      type = "N"
    },
    {
      name = "products"
      type = "L"
    }
  ]
}

variable "server_side_encryption" {
  description = "Configuración de cifrado para la tabla DynamoDB en desarrollo."
  type = object({
    enabled     = bool
    kms_key_arn = string
  })
  default = {
    enabled     = false
    kms_key_arn = ""
  }
}

variable "point_in_time_recovery" {
  description = "Indica si se debe habilitar la recuperación de punto en el tiempo para la tabla en desarrollo."
  type        = bool
  default     = false
}

// === ARCHIVO: infra/versions.tf ===
terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.19.0"
    }
  }
}

# Configuración del proveedor de AWS para todas las regiones y entornos
# El proveedor se configura dinámicamente según el entorno de despliegue
# mediante las variables de entorno AWS_DEFAULT_REGION, AWS_ACCESS_KEY_ID
# y AWS_SECRET_ACCESS_KEY, o mediante archivos de configuración de credenciales
# en ~/.aws/credentials. Para entornos de producción se recomienda usar
# IAM Roles con instancias de EC2 o mediante AWS SSO para evitar credenciales
# hardcodeadas en el código.
#
# Proveedor principal que se utiliza en todo el código de Terraform
# para la creación de recursos de AWS. Este proveedor se configura
# automáticamente cuando se ejecuta terraform init y se vincula
# con el backend de estado configurado en el archivo providers.tf
# de nivel superior del proyecto.
provider "aws" {
  alias  = "region_primary"
  region = var.aws_region

  default_tags {
    tags = {
      Environment = var.environment
      Project     = "order-management-system"
      ManagedBy   = "terraform"
      CreatedBy   = "terraform-module"
    }
  }

  # Configuración de retries para manejar errores transitorios de API
  # AWS puede devolver errores temporales durante operaciones de creación
  # o modificación de recursos, especialmente en entornos de alta demanda
  retries {
    max_attempts = 5
  }
}

# Proveedor secundario para regiones alternativas donde se requiera
# replicación de recursos o despliegue multi-region. Este proveedor
# se utiliza principalmente para tablas de DynamoDB que requieren
# replicación cross-region o para recursos que deben desplegarse
# en múltiples regiones por requisitos de compliance o latencia
provider "aws" {
  alias  = "region_secondary"
  region = var.aws_region_secondary != "" ? var.aws_region_secondary : var.aws_region

  default_tags {
    tags = {
      Environment = var.environment
      Project     = "order-management-system"
      ManagedBy   = "terraform"
      CreatedBy   = "terraform-module"
      Replica     = "true"
    }
  }
}

# Configuración de endpoints para desarrollo local con LocalStack
# Cuando la variable use_localstack es true, Terraform utilizará
# los endpoints de LocalStack en lugar de los de AWS real. Esto
# permite ejecutar pruebas de infraestructura sin costos de AWS
# y sin necesidad de credenciales reales. Útil para entornos de
# desarrollo y pipelines de CI/CD que necesitan validar la
# configuración de Terraform antes de desplegar a AWS real.
provider "aws" {
  alias  = "localstack"
  region = "us-east-1"

  endpoints {
    dynamodb = "http://localhost:4566"
    sts      = "http://localhost:4566"
  }

  skip_credentials_validation = true
  skip_requesting_account_id  = true
  skip_metadata_api_check     = true
  s3_use_path_style           = true
}
"// === ARCHIVO: infra/README.md ===
# Módulo de Infraestructura para Gestión de Órdenes en DynamoDB

Este módulo de Terraform define la infraestructura necesaria para el sistema de gestión de órdenes en DynamoDB.

## Descripción General

El módulo proporciona la configuración completa para desplegar una tabla de DynamoDB optimizada para operaciones CRUD de órdenes, incluyendo:

- Tabla principal de órdenes con índices secundarios para diferentes patrones de acceso
- Configuración de capacidad aprovisionada o bajo demanda
- Replicación entre regiones si es necesario
- Políticas de lifecycle para gestión de datos
- Configuración de Point-in-Time Recovery
-exportación de información de los recursos creados

## Recursos Definidos

### Tabla de Órdenes (DynamoDB)

La tabla principal de órdenes se configura con los siguientes atributos:

- **order_id**: Identificador único de la orden (clave de partición)
- **customer_id**: Identificador del cliente (índice secundario)
- **status**: Estado de la orden (índice secundario)
- **created_at**: Fecha de creación (tipo timestamp)
- **updated_at**: Fecha de última actualización
- **total_amount**: Monto total de la orden
- **items**: Lista de productos en la orden
- **shipping_address**: Dirección de envío

### Características de la Tabla

- **Mode de capacidad**: Aprovisionado (por defecto) o bajo demanda
- **TTL**: Configurable para auto-eliminación de registros antiguos
- **Point-in-Time Recovery**: Habilitado por defecto para recuperación ante desastres
- **Server-Side Encryption**: Cifrado con AWS owned keys o CMK
- **Streams**: Habilitados para capturar cambios en la tabla

## Uso del Módulo

```hcl
module "order_infrastructure" {
  source = "./infra"

  environment     = "dev"
  aws_region      = "us-east-1"
  table_name      = "orders"
  billing_mode    = "PROVISIONED"
  read_capacity   = 5
  write_capacity  = 5
  enable_ttl      = true
  ttl_attribute   = "expires_at"
  enable_streams  = true
}
```

## Validación Local

Para validar la configuración de Terraform antes de aplicar cambios:

```bash
# Inicializar Terraform
terraform init

# Validar sintaxis y configuración
terraform validate

# Planificar cambios sin aplicar
terraform plan -var-file=environments/dev/terraform.tfvars

# Aplicar cambios (solo en entorno de desarrollo local)
terraform apply -var-file=environments/dev/terraform.tfvars
```

## Variables Requeridas

| Variable | Descripción | Tipo |
|----------|-------------|------|
| `environment` | Entorno de despliegue (dev, staging, prod) | string |
| `aws_region` | Región de AWS donde se crearán los recursos | string |
| `table_name` | Nombre de la tabla de DynamoDB | string |

## Variables Opcionales

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `billing_mode` | Modo de facturación (PROVISIONED o PAY_PER_REQUEST) | PROVISIONED |
| `read_capacity` | Capacidad de lectura para modo aprovisionado | 5 |
| `write_capacity` | Capacidad de escritura para modo aprovisionado | 5 |
| `enable_ttl` | Habilitar Time-To-Live para auto-eliminación | false |
| `ttl_attribute` | Nombre del atributo TTL | expires_at |
| `enable_streams` | Habilitar DynamoDB Streams | true |
| `enable_deletion_protection` | Proteger contra eliminación accidental | true |

## Outputs

El módulo exporta la siguiente información:

- **table_name**: Nombre de la tabla de DynamoDB creada
- **table_arn**: ARN completo de la tabla
- **table_id**: ID único de la tabla
- **stream_arn**: ARN del stream de DynamoDB (si está habilitado)
- **region**: Región donde se desplegó la tabla

## Consideraciones de Seguridad

- El cifrado de datos en reposo está habilitado por defecto
- Se recomienda usar AWS KMS CMK para entornos de producción
- La protección contra eliminación accidental está habilitada por defecto
- Los logs de CloudTrail deben estar habilitados para auditoría

## Costeo Estimado

El coste mensual aproximado para el modo aprovisionado con capacidades mínimas:

- Tabla DynamoDB (5 RCU, 5 WCU): ~$1.25/mes
- Almacenamiento (estimado 1GB): ~$0.25/mes
- Streams (si habilitado): ~$0.02/mes

## Buenas Prácticas

1. Usar nombres descriptivos para los recursos
2. Etiquetar todos los recursos con metadatos relevantes
3. Habilitar Point-in-Time Recovery en producción
4. Usar capacity units mínimos y escalar según demanda
5. Revisar los outputs después de aplicar cambios
6. Mantener el estado de Terraform en backend remoto (S3)
"// === ARCHIVO: infra/main.tf ===
# Configuración Principal de Infraestructura para Gestión de Órdenes
#
# Este archivo define los recursos principales de AWS necesarios para el
# sistema de gestión de órdenes, incluyendo la tabla de DynamoDB principal
# y sus componentes asociados como streams, índices y políticas de acceso.
#
# La arquitectura utiliza el módulo de DynamoDB para crear la tabla de
# manera modular y reusable, permitiendo configuración flexible según
# el entorno de despliegue.

# Módulo de DynamoDB para la tabla de órdenes
# Este módulo encapsula toda la configuración necesaria para crear
# una tabla de DynamoDB optimizada para el caso de uso de gestión de órdenes.
# El módulo maneja la creación de la tabla, índices secundarios, streams
# y configuraciones de seguridad automáticamente.
module "dynamodb_orders" {
  source = "./modules/dynamodb"

  # Nombre de la tabla que se creará en DynamoDB
  # Debe ser único dentro de la cuenta y región de AWS
  table_name = var.table_name

  # Entorno de despliegue para etiquetado y separación lógica
  environment = var.environment

  # Atributos de la clave primaria y secundaria
  # DynamoDB requiere definir todos los atributos que participan
  # en claves primarias y secundarias upfront
  hash_key  = "order_id"
  range_key = "created_at"

  # Atributos adicionales que se almacenan en la tabla
  attributes = [
    {
      name = "order_id"
      type = "S"
    },
    {
      name = "customer_id"
      type = "S"
    },
    {
      name = "status"
      type = "S"
    },
    {
      name = "created_at"
      type = "S"
    },
    {
      name = "updated_at"
      type = "S"
    }
  ]

  # Índice secundario global para consultas por customer_id
  # Permite realizar consultas eficientes de todas las órdenes
  # de un cliente específico sin necesidad de escanear la tabla
  global_secondary_indexes = [
    {
      name            = "customer_id_index"
      hash_key        = "customer_id"
      range_key       = "created_at"
      projection_type = "ALL"
      read_capacity   = var.billing_mode == "PROVISIONED" ? var.read_capacity : null
      write_capacity  = var.billing_mode == "PROVISIONED" ? var.write_capacity : null
    }
  ]

  # Índice secundario local para consultas por estado y fecha
  # Útil para consultas de órdenes por estado en un rango de fechas
  local_secondary_indexes = [
    {
      name          = "status_created_at_index"
      range_key     = "created_at"
      projection_type = "ALL"
    }
  ]

  # Configuración de capacidad de lectura/escritura
  billing_mode    = var.billing_mode
  read_capacity   = var.read_capacity
  write_capacity  = var.write_capacity

  # Configuración de Time-To-Live para auto-eliminación
  # Útil para datos temporales o regulaciones de retención
  enable_ttl    = var.enable_ttl
  ttl_attribute = var.ttl_attribute

  # Habilitar DynamoDB Streams para capturar cambios
  # Necesario para arquitecturas event-driven que reactúan
  # a cambios en las órdenes (actualizaciones de inventario,
  # notificaciones al cliente, etc.)
  enable_streams = var.enable_streams
  stream_view_type = "NEW_AND_OLD_IMAGES"

  # Configuración de cifrado del lado del servidor
  # Usar AWS owned keys para development, CMK para producción
  server_side_encryption_enabled = true
  server_side_encryption_kms_key  = var.kms_key_arn

  # Protección contra eliminación accidental
  # Crítico para entornos de producción donde la pérdida
  # de datos tendría impacto de negocio significativo
  deletion_protection_enabled = var.enable_deletion_protection

  # Configuración de Point-in-Time Recovery
  # Permite restaurar la tabla a cualquier punto en los
  # últimos 35 días. Recomendado para producción.
  point_in_time_recovery_enabled = var.enable_point_in_time_recovery

  # Categorías de destino para auditoría de acceso
  # Configura tablas de CloudTrail o S3 para logging
  audit_config = {
    enabled = var.enable_audit
    log_retention_days = var.audit_log_retention_days
  }
}

# Recurso IAM para permitir acceso a la tabla desde Lambda
# Define una política de acceso que puede ser adjuntada a
# funciones Lambda que necesitan leer/escribir órdenes
resource "aws_iam_policy" "dynamodb_access_policy" {
  name        = "${var.table_name}-access-policy"
  description = "Política de acceso a la tabla de órdenes en DynamoDB"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid = "AllowReadAccessToOrders"
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ]
        Resource = [
          module.dynamodb_orders.table_arn,
          "${module.dynamodb_orders.table_arn}/index/*"
        ]
      },
      {
        Sid = "AllowWriteAccessToOrders"
        Effect = "Allow"
        Action = [
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem"
        ]
        Resource = module.dynamodb_orders.table_arn
      },
      {
        Sid = "AllowStreamReadAccess"
        Effect = "Allow"
        Action = [
          "dynamodb:GetRecords",
          "dynamodb:GetShardIterator",
          "dynamodb:ListStreams"
        ]
        Resource = module.dynamodb_orders.stream_arn
        Condition = {
          Bool = {
            "dynamodb:StreamViewType" = ["NEW_IMAGE", "OLD_IMAGE", "NEW_AND_OLD_IMAGES"]
          }
        }
      }
    ]
  })

  tags = {
    Name        = "${var.table_name}-access-policy"
    Environment = var.environment
    Project     = "order-management-system"
    ManagedBy   = "terraform"
  }
}

# Alarma de CloudWatch para monitorear throttling de la tabla
# Detecta cuando la tabla está alcanzand su capacidad aprovisionada
# y puede indicar necesidad de increase de capacidad o optimización
resource "aws_cloudwatch_metric_alarm" "throttle_alarm" {
  count = var.billing_mode == "PROVISIONED" ? 1 : 0

  alarm_name          = "${var.table_name}-throttle-alarm"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "ThrottledRequests"
  namespace           = "AWS/DynamoDB"
  period              = "300"
  statistic           = "Sum"
  threshold           = "0"
  alarm_description   = "This metric monitors DynamoDB throttling for ${var.table_name}"
  alarm_actions       = var.sns_topic_arn != "" ? [var.sns_topic_arn] : []

  dimensions = {
    TableName = module.dynamodb_orders.table_name
  }

  tags = {
    Name        = "${var.table_name}-throttle-alarm"
    Environment = var.environment
    Project     = "order-management-system"
  }
}

# Alarma de CloudWatch para consumo de capacidad de lectura
# Monitorea el consumo de Read Capacity Units para asegurar
# que la tabla tiene suficiente capacidad aprovisionada
resource "aws_cloudwatch_metric_alarm" "read_capacity_alarm" {
  count = var.billing_mode == "PROVISIONED" ? 1 : 0

  alarm_name          = "${var.table_name}-read-capacity-alarm"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "ConsumedReadCapacityUnits"
  namespace           = "AWS/DynamoDB"
  period              = "300"
  statistic           = "Maximum"
  threshold           = var.read_capacity * 80 / 100
  alarm_description   = "This metric monitors DynamoDB read capacity for ${var.table_name}"
  alarm_actions       = var.sns_topic_arn != "" ? [var.sns_topic_arn] : []

  dimensions = {
    TableName = module.dynamodb_orders.table_name
  }

  tags = {
    Name        = "${var.table_name}-read-capacity-alarm"
    Environment = var.environment
    Project     = "order-management-system"
  }
}

# Alarma de CloudWatch para consumo de capacidad de escritura
# Monitorea el consumo de Write Capacity Units para evitar
# escribir errores por capacidad insuficiente
resource "aws_cloudwatch_metric_alarm" "write_capacity_alarm" {
  count = var.billing_mode == "PROVISIONED" ? 1 : 0

  alarm_name          = "${var.table_name}-write-capacity-alarm"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "ConsumedWriteCapacityUnits"
  namespace           = "AWS/DynamoDB"
  period              = "300"
  statistic           = "Maximum"
  threshold           = var.write_capacity * 80 / 100
  alarm_description   = "This metric monitors DynamoDB write capacity for ${var.table_name}"
  alarm_actions       = var.sns_topic_arn != "" ? [var.sns_topic_arn] : []

  dimensions = {
    TableName = module.dynamodb_orders.table_name
  }

  tags = {
    Name        = "${var.table_name}-write-capacity-alarm"
    Environment = var.environment
    Project     = "order-management-system"
  }
}

# Recurso opcional de SNS para notificaciones de alarmas
# Solo se crea si se proporciona un topic ARN válido
resource "aws_sns_topic" "alerts_topic" {
  count = var.sns_topic_arn != "" ? 0 : 1

  name         = "${var.environment}-dynamodb-alerts"
  display_name = "Alertas de DynamoDB - ${var.environment}"

  tags = {
    Name        = "${var.environment}-dynamodb-alerts"
    Environment = var.environment
    Project     = "order-management-system"
  }
}

# Data source para importar la clave KMS existente si se especifica
# Si no se especifica, DynamoDB usará cifrado por defecto con AWS owned keys
data "aws_kms_key" "dynamodb_kms" {
  count = var.kms_key_arn != "" ? 1 : 0
  key_id = var.kms_key_arn
}

// === ARCHIVO: infra/outputs.tf ===
# Outputs de la configuración de Terraform
# Expone la información de los recursos creados para consumo externo

output "dynamodb_table_name" {
  description = "Nombre de la tabla de DynamoDB creada"
  value       = module.dynamodb.table_name
}

output "dynamodb_table_arn" {
  description = "ARN de la tabla de DynamoDB"
  value       = module.dynamodb.table_arn
}

output "dynamodb_table_id" {
  description = "ID de la tabla de DynamoDB"
  value       = module.dynamodb.table_id
}

output "dynamodb_table_endpoint" {
  description = "Endpoint de la tabla de DynamoDB"
  value       = "https://dynamodb.${var.aws_region}.amazonaws.com"
}

output "environment" {
  description = "Entorno donde se desplegó la infraestructura"
  value       = var.environment
}

output "aws_region" {
  description = "Región de AWS donde se desplegó la infraestructura"
  value       = var.aws_region
}

output "dynamodb_tags" {
  description = "Tags aplicados a la tabla de DynamoDB"
  value       = module.dynamodb.table_tags
}

// === ARCHIVO: infra/environments/dev/terraform.tfvars ===
# Variables específicas para el entorno de desarrollo
# Estas variables sobrescriben los valores por defecto definidos en variables.tf

environment = "dev"
aws_region  = "us-east-1"

# Configuración de la tabla de DynamoDB para desarrollo
dynamodb_table_name = "orders-dev"
dynamodb_partition_key = "orderId"
dynamodb_sort_key      = "customerId"

# Configuración de capacidad bajo demanda para desarrollo (paga por uso)
dynamodb_billing_mode = "PAY_PER_REQUEST"

# Habilitar server-side encryption
dynamodb_enable_encryption = true

# Habilitar eliminación lógica (soft delete)
dynamodb_enable_deletion_protection = false

# Configuración de TTL para limpieza automática de órdenes antiguas
dynamodb_enable_ttl     = true
dynamodb_ttl_attribute  = "expirationTime"

# Tags específicos para el entorno de desarrollo
environment_tags = {
  Environment = "development"
  CostCenter  = "engineering"
  Project     = "orders-management"
  ManagedBy   = "terraform"
}

# Configuración de lifecycle para desarrollo
enable_versioning = false

# Configuración de backups point-in-time recovery
enable_point_in_time_recovery = false

// === ARCHIVO: infra/environments/dev/main.tf ===
# Configuración de Terraform para el entorno de desarrollo
# Este archivo define los recursos específicos del entorno dev

terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.19"
    }
  }

  # Backend remote state para almacenamiento del estado de Terraform
  backend "s3" {
    bucket         = "orders-terraform-state"
    key            = "dev/terraform.tfstate"
    region         = var.aws_region
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}

# Proveedor de AWS para el entorno de desarrollo
provider "aws" {
  region = var.aws_region

  default_tags {
    tags = merge(
      var.common_tags,
      var.environment_tags,
      {
        Environment = var.environment
        Terraform   = "true"
      }
    )
  }

  # Configuración de retries para operaciones que pueden fallar temporalmente
  max_retries = 3

  # Habilitar modo de acceso a DynamoDB local para testing
  # Commentar en producción
  # endpoints {
  #   dynamodb = "http://localhost:8000"
  # }
}

# Alias provider para operaciones en regiones alternativas si es necesario
provider "aws" {
  alias  = "secondary_region"
  region = "us-west-2"

  default_tags {
    tags = merge(
      var.common_tags,
      var.environment_tags,
      {
        Environment = "${var.environment}-backup"
        Terraform   = "true"
      }
    )
  }
}

# Módulo de DynamoDB para gestionar la tabla de órdenes
module "dynamodb" {
  source = "../../modules/dynamodb"

  # Nombre de la tabla - específico para desarrollo
  table_name = var.dynamodb_table_name

  # Claves de partición y ordenamiento
  partition_key = var.dynamodb_partition_key
  sort_key      = var.dynamodb_sort_key

  # Configuración de facturación - PAY_PER_REQUEST para desarrollo
  billing_mode = var.dynamodb_billing_mode

  # Configuración de capacidad leída y escrita (solo para PROVISIONED)
  # read_capacity  = var.dynamodb_read_capacity
  # write_capacity = var.dynamodb_write_capacity

  # Habilitar cifrado server-side
  enable_encryption = var.dynamodb_enable_encryption

  # Tipo de cifrado
  # server_side_encryption_kms_key_id = var.dynamodb_kms_key_id
  # server_side_encryption_type       = var.dynamodb_encryption_type

  # Habilitar protección contra eliminación
  enable_deletion_protection = var.dynamodb_enable_deletion_protection

  # Habilitar TTL
  enable_ttl    = var.dynamodb_enable_ttl
  ttl_attribute = var.dynamodb_ttl_attribute

  # Configuración de streams de DynamoDB para captura de cambios
  enable_streams         = true
  stream_view_type       = "NEW_AND_OLD_IMAGES"
  stream_enabled         = true

  # Point-in-time recovery
  enable_point_in_time_recovery = var.enable_point_in_time_recovery

  # Tags específicos del módulo
  tags = merge(
    var.common_tags,
    var.environment_tags,
    {
      Name        = "orders-dynamodb-${var.environment}"
      Description = "Tabla de órdenes para el entorno de desarrollo"
    }
  )
}

# Output local para facilitar referencia en este archivo
locals {
  table_name = module.dynamodb.table_name
  table_arn  = module.dynamodb.table_arn
}

# Resource: Política de acceso a la tabla de DynamoDB para desarrollo
resource "aws_iam_policy" "dynamodb_access_dev" {
  name        = "orders-dynamodb-access-${var.environment}"
  description = "Política de acceso a la tabla de órdenes en entorno de desarrollo"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:DescribeTable",
          "dynamodb:GetRecords",
          "dynamodb:GetShardIterator"
        ]
        Resource = [
          module.dynamodb.table_arn,
          "${module.dynamodb.table_arn}/index/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "dynamodb:ListTables"
        ]
        Resource = "*"
      }
    ]
  })

  tags = merge(
    var.common_tags,
    var.environment_tags,
    {
      Name = "orders-dynamodb-access-policy-${var.environment}"
    }
  )
}

# Resource: Asignar política a rol de Lambda (preparado para cuando se implemente la función)
resource "aws_iam_role_policy_attachment" "lambda_dynamodb_access_dev" {
  count = var.enable_lambda_integration ? 1 : 0

  role       = "orders-lambda-role-${var.environment}"
  policy_arn = aws_iam_policy.dynamodb_access_dev.arn
}

# Resource: Alarma de CloudWatch para monitorear throttling en desarrollo
resource "aws_cloudwatch_metric_alarm" "dynamodb_throttle_dev" {
  count = var.enable_monitoring

  alarm_name          = "orders-dynamodb-throttle-${var.environment}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "ThrottledRequests"
  namespace           = "AWS/DynamoDB"
  period              = "300"
  statistic           = "Sum"
  threshold           = "10"
  alarm_description   = "Alarma cuando hay throttling en la tabla de órdenes de desarrollo"
  alarm_actions       = []
  ok_actions          = []

  dimensions = {
    TableName = module.dynamodb.table_name
  }

  tags = merge(
    var.common_tags,
    var.environment_tags,
    {
      Name = "orders-dynamodb-throttle-alarm-${var.environment}"
    }
  )
}

# Resource: Alarma de CloudWatch para consumo de capacidad
resource "aws_cloudwatch_metric_alarm" "dynamodb_consumed_capacity_dev" {
  count = var.enable_monitoring && var.dynamodb_billing_mode == "PROVISIONED"

  alarm_name          = "orders-dynamodb-capacity-${var.environment}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "ConsumedReadCapacityUnits"
  namespace           = "AWS/DynamoDB"
  period              = "300"
  statistic           = "Maximum"
  threshold           = var.dynamodb_read_capacity * 80 / 100
  alarm_description   = "Alarma cuando el consumo de capacidad de lectura supera el 80%"

  dimensions = {
    TableName = module.dynamodb.table_name
  }

  tags = merge(
    var.common_tags,
    var.environment_tags,
    {
      Name = "orders-dynamodb-capacity-alarm-${var.environment}"
    }
  )
}

// === ARCHIVO: infra/modules/dynamodb/main.tf ===
resource "aws_dynamodb_table" "orders" {
  name           = var.table_name
  billing_mode   = var.billing_mode
  hash_key       = var.partition_key
  range_key      = var.sort_key

  dynamic "attribute" {
    for_each = var.attributes
    content {
      name = attribute.value.name
      type = attribute.value.type
    }
  }

  tags = merge(
    var.tags,
    {
      "Name"        = var.table_name
      "Environment" = var.environment
      "ManagedBy"   = "Terraform"
      "Project"     = var.project_name
    }
  )

  lifecycle {
    ignore_changes = [tags]
  }

  dynamic "global_secondary_index" {
    for_each = var.gsi_definition
    content {
      name            = global_secondary_index.value.name
      hash_key        = global_secondary_index.value.hash_key
      range_key       = try(global_secondary_index.value.range_key, null)
      projection_type = global_secondary_index.value.projection_type
      read_capacity   = try(global_secondary_index.value.read_capacity, null)
      write_capacity  = try(global_secondary_index.value.write_capacity, null)
    }
  }

  dynamic "local_secondary_index" {
    for_each = var.lsi_definition
    content {
      name            = local_secondary_index.value.name
      range_key       = local_secondary_index.value.range_key
      projection_type = local_secondary_index.value.projection_type
    }
  }

  server_side_encryption {
    enabled     = var.server_side_encryption
    kms_key_arn = var.kms_key_arn
  }

  point_in_time_recovery {
    enabled = var.point_in_time_recovery
  }

  ttl {
    enabled        = var.ttl_enabled
    attribute_name = var.ttl_attribute_name
  }

  stream_enabled   = var.stream_enabled
  stream_view_type = var.stream_view_type

  timeouts {
    create = var.timeouts_create
    update = var.timeouts_update
    delete = var.timeouts_delete
  }
}

resource "aws_dynamodb_table_item" "seed_data" {
  for_each = var.initial_items != null ? { for item in var.initial_items : item[var.partition_key] => item } : {}

  table_name = aws_dynamodb_table.orders.name
  hash_key   = each.value[var.partition_key]

  dynamic "range_key" {
    for_each = var.sort_key != null ? [1] : []
    content {
      S = each.value[var.sort_key]
    }
  }

  item = jsonencode(each.value)
}

resource "aws_cloudwatch_log_group" "dynamodb_logs" {
  count              = var.enable_dynamodb_logs ? 1 : 0
  name               = "/aws/dynamodb/${var.table_name}"
  retention_in_days = var.log_retention_days
  kms_key_id         = var.log_kms_key_arn

  tags = merge(
    var.tags,
    {
      "Name"        = "${var.table_name}-logs"
      "Environment" = var.environment
    }
  )
}

resource "aws_kms_key" "dynamodb_table_key" {
  count                   = var.create_kms_key && var.server_side_encryption ? 1 : 0
  description             = "KMS key for DynamoDB table ${var.table_name}"
  deletion_window_in_days = var.kms_deletion_window
  enable_key_rotation     = var.kms_enable_key_rotation

  tags = merge(
    var.tags,
    {
      "Name"        = "${var.table_name}-kms-key"
      "Environment" = var.environment
    }
  )
}

resource "aws_kms_alias" "dynamodb_table_key_alias" {
  count          = var.create_kms_key && var.server_side_encryption ? 1 : 0
  name           = "alias/${var.table_name}-key"
  target_key_id  = aws_kms_key.dynamodb_table_key[0].key_id
}

data "aws_iam_policy_document" "dynamodb_kms_policy" {
  count = var.create_kms_key && var.server_side_encryption ? 1 : 0

  statement {
    sid = "Enable IAM User Permissions"
    effect = "Allow"
    principals {
      type        = "AWS"
      identifiers = ["arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"]
    }
    actions   = ["kms:*"]
    resources = ["*"]
  }

  statement {
    sid = "Allow DynamoDB to use the key"
    effect = "Allow"
    principals {
      type        = "Service"
      identifiers = ["dynamodb.amazonaws.com"]
    }
    actions = [
      "kms:Encrypt",
      "kms:Decrypt",
      "kms:ReEncrypt*",
      "kms:GenerateDataKey*",
      "kms:DescribeKey",
      "kms:CreateGrant"
    ]
    resources = [aws_kms_key.dynamodb_table_key[0].arn]
    condition {
      test     = "StringEquals"
      variable = "kms:CallerAccount"
      values   = [data.aws_caller_identity.current.account_id]
    }
  }
}

resource "aws_kms_key_policy" "dynamodb_kms_policy" {
  count  = var.create_kms_key && var.server_side_encryption ? 1 : 0
  key_id = aws_kms_key.dynamodb_table_key[0].id
  policy = data.aws_iam_policy_document.dynamodb_kms_policy[0].json
}

data "aws_caller_identity" "current" {}

resource "aws_backup_plan" "dynamodb_backup" {
  count = var.enable_backup ? 1 : 0
  name  = "${var.table_name}-backup-plan"

  rule {
    name             = "daily-backup"
    schedule         = var.backup_schedule
    target_vault_name = var.backup_vault_name
    start_window     = var.backup_start_window
    completion_window = var.backup_completion_window
    lifecycle {
      cold_storage_after = var.backup_cold_storage_after
      delete_after       = var.backup_delete_after
    }
  }

  tags = merge(
    var.tags,
    {
      "Name"        = "${var.table_name}-backup-plan"
      "Environment" = var.environment
    }
  )
}

resource "aws_backup_selection" "dynamodb_backup_selection" {
  count     = var.enable_backup ? 1 : 0
  name      = "${var.table_name}-backup-selection"
  plan_id   = aws_backup_plan.dynamodb_backup[0].id
  resources = [aws_dynamodb_table.orders.arn]

  condition {
    string_eq {
      key   = "aws:ResourceTag/Environment"
      value = var.environment
    }
  }
}

resource "aws_backup_vault" "dynamodb_backup_vault" {
  count = var.enable_backup ? 1 : 0
  name  = var.backup_vault_name

  kms_key_arn = var.backup_vault_kms_key_arn

  tags = merge(
    var.tags,
    {
      "Name"        = "${var.table_name}-backup-vault"
      "Environment" = var.environment
    }
  )
}

// === ARCHIVO: infra/modules/dynamodb/outputs.tf ===
output "table_name" {
  description = "Nombre de la tabla DynamoDB"
  value       = aws_dynamodb_table.orders.name
}

output "table_arn" {
  description = "ARN de la tabla DynamoDB"
  value       = aws_dynamodb_table.orders.arn
}

output "table_id" {
  description = "ID único de la tabla DynamoDB"
  value       = aws_dynamodb_table.orders.id
}

output "table_stream_arn" {
  description = "ARN del stream de DynamoDB si está habilitado"
  value       = try(aws_dynamodb_table.orders.stream_arn, null)
}

output "table_stream_label" {
  description = "Etiqueta del stream de DynamoDB"
  value       = try(aws_dynamodb_table.orders.stream_label, null)
}

output "table_endpoint" {
  description = "Endpoint de la tabla DynamoDB"
  value       = "https://dynamodb.${data.aws_region.current.name}.amazonaws.com"
}

output "table_region" {
  description = "Región donde está creada la tabla DynamoDB"
  value       = data.aws_region.current.name
}

output "table_items_count" {
  description = "Cantidad de elementos iniciales cargados en la tabla"
  value       = length(var.initial_items != null ? var.initial_items : [])
}

output "gsi_names" {
  description = "Lista de nombres de índices secundarios globales"
  value       = [for gsi in aws_dynamodb_table.orders.global_secondary_index : gsi.name]
}

output "lsi_names" {
  description = "Lista de nombres de índices secundarios locales"
  value       = [for lsi in aws_dynamodb_table.orders.local_secondary_index : lsi.name]
}

output "kms_key_arn" {
  description = "ARN de la clave KMS utilizada para el cifrado"
  value       = var.server_side_encryption ? (var.create_kms_key ? aws_kms_key.dynamodb_table_key[0].arn : var.kms_key_arn) : null
}

output "kms_key_id" {
  description = "ID de la clave KMS utilizada para el cifrado"
  value       = var.server_side_encryption ? (var.create_kms_key ? aws_kms_key.dynamodb_table_key[0].key_id : null) : null
}

output "backup_plan_id" {
  description = "ID del plan de backup si está habilitado"
  value       = var.enable_backup ? aws_backup_plan.dynamodb_backup[0].id : null
}

output "backup_vault_name" {
  description = "Nombre del vault de backup"
  value       = var.enable_backup ? aws_backup_vault.dynamodb_backup_vault[0].name : null
}

output "log_group_name" {
  description = "Nombre del grupo de logs de CloudWatch"
  value       = var.enable_dynamodb_logs ? aws_cloudwatch_log_group.dynamodb_logs[0].name : null
}

output "table_attributes" {
  description = "Lista de atributos definidos en la tabla"
  value       = [for attr in aws_dynamodb_table.orders.attribute : {
    name = attr.name
    type = attr.type
  }]
}

output "table_billing_mode" {
  description = "Modo de facturación de la tabla"
  value       = aws_dynamodb_table.orders.billing_mode
}

output "table_status" {
  description = "Estado actual de la tabla"
  value       = aws_dynamodb_table.orders.status
}

output "table_size_bytes" {
  description = "Tamaño de la tabla en bytes"
  value       = aws_dynamodb_table.orders.size_bytes
}

output "table_item_count" {
  description = "Cantidad de items en la tabla"
  value       = aws_dynamodb_table.orders.item_count
}

output "tags" {
  description = "Etiquetas aplicadas a la tabla"
  value       = aws_dynamodb_table.orders.tags
}

output "partition_key_attribute" {
  description = "Nombre del atributo de clave de partición"
  value       = var.partition_key
}

output "sort_key_attribute" {
  description = "Nombre del atributo de clave de ordenación"
  value       = var.sort_key
}

data "aws_region" "current" {}

// === ARCHIVO: infra/main.tf ===
terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.19"
    }
  }

  backend "local" {
    path = "terraform.tfstate"
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Environment = var.environment
      Project     = "ordenes-dynamodb"
      ManagedBy   = "terraform"
    }
  }

  dynamic "assume_role" {
    for_each = var.assume_role_arn != "" ? [var.assume_role_arn] : []
    content {
      role_arn = assume_role.value
    }
  }
}

module "dynamodb" {
  source = "./modules/dynamodb"

  environment          = var.environment
  table_name           = var.dynamodb_table_name
  billing_mode         = var.dynamodb_billing_mode
  read_capacity        = var.dynamodb_read_capacity
  write_capacity       = var.dynamodb_write_capacity
  enable_point_in_time_recovery = var.dynamodb_enable_pitr
  enable_server_side_encryption = var.dynamodb_enable_sse
  kms_key_id           = var.dynamodb_kms_key_id
  ttl_attribute_name   = var.dynamodb_ttl_attribute
  tags                 = var.common_tags
}

resource "aws_sns_topic" "ordenes_notifications" {
  count = var.enable_sns_notifications ? 1 : 0

  name             = "ordenes-${var.environment}-notifications"
  display_name     = "Ordenes ${title(var.environment)} Notifications"
  fifo_topic       = false
  content_based_deduplication = false

  tags = merge(var.common_tags, {
    Name = "ordenes-${var.environment}-notifications"
  })
}

resource "aws_cloudwatch_log_group" "ordenes_api" {
  count = var.enable_cloudwatch_logs ? 1 : 0

  name              = "/aws/ordenes/${var.environment}/api"
  retention_in_days = var.cloudwatch_retention_days
  kms_key_id        = var.cloudwatch_kms_key_id

  tags = merge(var.common_tags, {
    Name = "ordenes-${var.environment}-api-logs"
  })
}

resource "aws_kms_key" "ordenes_encryption" {
  count = var.enable_kms_encryption ? 1 : 0

  description             = "KMS key for ordenes ${var.environment} data encryption"
  deletion_window_in_days = 10
  enable_key_rotation     = true

  tags = merge(var.common_tags, {
    Name = "ordenes-${var.environment}-kms-key"
  })
}

resource "aws_kms_alias" "ordenes_encryption_alias" {
  count = var.enable_kms_encryption ? 1 : 0

  name          = "alias/ordenes-${var.environment}"
  target_key_id = aws_kms_key.ordenes_encryption[0].key_id
}

data "aws_caller_identity" "current" {}

data "aws_region" "current" {}

locals {
  account_id    = data.aws_caller_identity.current.account_id
  current_region = data.aws_region.current.name

  ordenes_table_arn = module.dynamodb.table_arn
  ordenes_table_id  = module.dynamodb.table_id

  all_tags = merge(
    var.common_tags,
    {
      AccountID = local.account_id
      Region    = local.current_region
    }
  )
}

// === ARCHIVO: docker-compose.yml ===
# Infraestructura local del reto. SOLO desarrollo: credenciales de ejemplo (local-dev-only), puertos en loopback.
# Levantar: docker compose up -d --wait
name: infra-local
services:
  dynamodb-local:
    image: "amazon/dynamodb-local:2.5.2"
    command: ["-jar","DynamoDBLocal.jar","-sharedDb","-inMemory"]
    ports:
      - "127.0.0.1:8000:8000"
    healthcheck:
      test: ["CMD-SHELL","bash -c ':> /dev/tcp/127.0.0.1/8000' || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 10
      start_period: 5s


// === ARCHIVO: infra-local/README.md ===
# Infraestructura local

Servicios de soporte para el reto, definidos en `docker-compose.yml` (raiz del repo).

```bash
docker compose up -d --wait
```

| Servicio | Imagen | Puertos (host) |
|---|---|---|
| DynamoDB Local | `amazon/dynamodb-local:2.5.2` | 8000 |

Credenciales: solo de desarrollo local (`local-dev-only`, `local`). No son secretos ni deben reutilizarse.
Los scripts de `infra-local/` (tablas, topics) se ejecutan con el compose en estado healthy.


// === ARCHIVO: infra-local/dynamodb/create-tables.sh ===
#!/usr/bin/env bash
# Crea las tablas en DynamoDB Local (idempotente). Credenciales dummy: DynamoDB Local no valida firmas.
set -euo pipefail

export AWS_ACCESS_KEY_ID=local
export AWS_SECRET_ACCESS_KEY=local
export AWS_REGION=us-east-1
ENDPOINT="${DYNAMODB_ENDPOINT:-http://localhost:8000}"

create_table() {
  local name="$1" pk="$2" sk="${3:-}"
  if aws dynamodb describe-table --table-name "$name" --endpoint-url "$ENDPOINT" >/dev/null 2>&1; then
    echo "Tabla $name ya existe"
    return
  fi
  local attrs="AttributeName=$pk,AttributeType=S"
  local keys="AttributeName=$pk,KeyType=HASH"
  if [ -n "$sk" ]; then
    attrs="$attrs AttributeName=$sk,AttributeType=S"
    keys="$keys AttributeName=$sk,KeyType=RANGE"
  fi
  # shellcheck disable=SC2086
  aws dynamodb create-table --table-name "$name" --attribute-definitions $attrs --key-schema $keys \
    --billing-mode PAY_PER_REQUEST --endpoint-url "$ENDPOINT" >/dev/null
  echo "Tabla $name creada"
}

create_table "app-items" "id"

```
