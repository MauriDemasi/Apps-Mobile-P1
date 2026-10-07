# Tienda Fullstack — Parcial 1

Proyecto de e-commerce hecho con Node.js + React para la materia Aplicaciones para Móviles (2.º año). Tienda con dos tipos de usuarios (clientes y administradores con roles), catálogo de productos con filtros y panel de administración.

## Stack

- **Back:** Node.js, Express, Sequelize, MySQL, JWT, bcryptjs
- **Front:** React, React Router, Axios, Context API, Tailwind CSS, Recharts

## Estructura

```
.
├── docker-compose.yml   # MySQL para desarrollo local
├── api/                 # Backend (puerto 3000)
│   └── src/
│       ├── models/      # Client, Admin (con roles), Product
│       ├── controllers/ # auth, client, admin, products, categorías
│       ├── middleware/  # verifyToken, isClient/isAdmin, checkAdminRole
│       ├── routes/      # /api/auth, /api/client, /api/admin, /api/products
│       └── utils/       # JWT (access 15m + refresh 7d)
└── app/                 # Frontend con Vite (puerto 5173)
    └── src/
        ├── context/     # AuthContext (sesión dual), ThemeContext (claro/oscuro)
        ├── components/  # Guards de rutas, Sidebar, cards, formularios, gráficos
        └── pages/       # Home, logins, dashboards, productos, usuarios, reportes
```

## Cómo correrlo

Necesitás Docker y Node 18+.

```bash
# 1. Base de datos
docker compose up -d

# 2. Backend (en una terminal)
cd api
cp .env.example .env   # si no existe el .env (ya trae valores de desarrollo)
npm install
npm run dev            # http://localhost:3000/api/status

# 3. Frontend (en otra terminal)
cd app
npm install
npm run dev            # http://localhost:5173
```

Las tablas se crean solas al arrancar y se cargan datos de prueba.

## Usuarios de prueba

| Rol              | Email                        | Password          |
|------------------|------------------------------|-------------------|
| Cliente          | cliente@tienda.com           | cliente123        |
| Superadmin       | superadmin@tienda.com        | superadmin123     |
| Gestor productos | gestor_productos@tienda.com  | gestor_productos123 |
| Auditor          | auditor@tienda.com           | auditor123        |

## Endpoints principales

- `POST /api/auth/client/login` y `POST /api/auth/admin/login` → devuelven access + refresh token
- `POST /api/auth/refresh` → renueva el access token
- `POST /api/auth/logout` → invalida la sesión
- `GET /api/client/perfil` (solo cliente)
- `GET /api/admin/metricas|usuarios|reportes` (según rol)
- `GET /api/products?page=&limit=&search=&category=&sortBy=&order=` (público, paginado)
- `POST /api/products`, `PUT /api/products/:id` (superadmin y gestor)
- `DELETE /api/products/:id` (solo superadmin, borrado lógico)

## Decisiones que tomé

- Tablas separadas para clientes y administradores (no se mezclan ni los datos ni los logins).
- Roles con middleware propio: el tipo (`client`/`admin`) abre la puerta y el rol (`superadmin`/`gestor_productos`/`auditor`) abre la sala.
- Borrar es solo superadmin porque es destructivo; el borrado es lógico (`deletedAt`), y crear con el mismo nombre revive el producto.
- Access cortos + refresh en DB para poder revocar sesiones con logout.
- Tema claro/oscuro con un contexto aparte del de sesión.
