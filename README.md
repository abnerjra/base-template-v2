# Plantilla base de un REST API con node y TypeScript

Plantilla base realizado con node y typescript, la cual esta implementada a base de la arquitectura `pattern repository`.
La plantilla cuenta con las siguientes funcionalidades:

- ✅ Seeders precargados.
- ✅ Login y Logout.
- ✅ Administración de usurios.
- ✅ Administración de roles y permisos.
- ✅ Administración de modules.
- ✅ Listado de catálogos.
- ✅ Validación de sesión única.
- ✅ Mensajes de error perzonalizados.
- ✅ Docker para la administración de base de datos (postgreSQL).
- ✅ Colección de apis en postman.

---

## ✅ Requisitos

- [Node.js >= 18](https://nodejs.org/es/download)
- [PostgreSQL (Opcional)](https://www.postgresql.org/download/)
- [Docker (para manejo de base de datos)](https://www.docker.com/get-started/)

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
 https://github.com/abnerjra/base-template-v2.git
```

### 2. Crear archivo `.env`

Clonar el archivo `.env.template` y renombrarlo a `.env`

### 3. Instalación de dependencias

```bash
npm install
```

### 4. Ejecutar docker (Opcional)

- No es necesario tener instalado docker, pero se recomienda para el funcionamiento del proyecto
- Si no deseas trabajar con docker, es necesario tener instalado postgreSQL en su versión 15

```bash
docker compose up -d
```

### 5. Ejecutar migraciones

```bash
npm run prisma:migrate:reset:dev
```

### 6. Ejecutar seeders

```bash
npm run prisma:seed:dev
```

### 6. Levantar proyecto

```bash
npm run dev
```
