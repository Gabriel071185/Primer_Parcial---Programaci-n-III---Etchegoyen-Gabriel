# Evaluación 1 – Programación 3 - Food Store

## 1. Objetivo del proyecto
Este proyecto implementa una aplicacion web utilizando TypeScript para gestionar:
- registro e inicio de sesion
- proteccion de rutas por autenticacion y rol
- visualizacion de catalogo
- carrito de compras persistente en LocalStorage

El objetivo principal es demostrar control de acceso, navegacion entre vistas y manejo de estado en frontend sin backend.

## 2. Stack tecnologico
- Vite 7
- TypeScript 5
- AlertifyJS (notificaciones)
- HTML + CSS + JS/TS 

## 3. Ejecucion del proyecto
### Requisitos
- Node.js 18+
- npm

### Instalacion
1. Clonar repositorio
2. Instalar dependencias:

```bash
npm install
```

### Ejecución en entorno de Desarrollo
```bash
npm run dev
```


```

## 4. Estructura general
```text
src/
  data/
    data.ts
  pages/
    auth/
      login/
      registro/
    admin/
      home/
    client/
      home/
    store/
      home/
      cart/
  types/
    IUser.ts
    Rol.ts
    product.ts
    categoria.ts
  utils/
    auth.ts
    localStorage.ts
    navigate.ts
    cart.utils.ts
    product.utils.ts
  main.ts
  style.css
index.html
vite.config.ts
```

## 5. Configuracion de las vistas

Entradas declaradas:
- index
- login
- registro
- adminHome
- clientHome
- storeHome
- storeCart

Esto permite generar y servir cada vista HTML como punto de entrada independiente.

## 6. Modelo de datos principal
### Usuario
Interfaz `IUser`:
- email: string
- password: string
- loggedIn: boolean
- role: "client" | "admin"

### Productos y categorias
Definidos en `src/data/data.ts` y tipados en `product.ts` + `categoria.ts`.

## 7. Persistencia en LocalStorage
Claves utilizadas:
- `usersData`: lista de usuarios registrados
- `userData`: sesion actual
- `cart`: carrito de compras

Utilidades:
- `saveUser`, `getUSer`, `removeUser` en `localStorage.ts`
- operaciones de carrito en `cart.utils.ts`

## 8. Autenticacion y proteccion de rutas
Archivo: `src/utils/auth.ts`

Funciones clave:
- `getAuthUser()`: obtiene y valida la sesion actual
- `protectRoute(...)`: protege vistas por login y opcionalmente por rol
- `checkAuhtUser(...)`: wrapper de compatibilidad para llamadas existentes
- `logout()`: elimina sesion, limpia carrito y redirige a index

### Alertas
Cuando una ruta redirige al login por falta de sesion o rol incorrecto:
- se guarda un mensaje temporal en `sessionStorage` (`authFlash`)
- en login se consume y se muestra con Alertify

## 9. Flujo funcional por vista
### 9.1 index (landing)
- Si hay sesion valida, redirige automaticamente segun rol
- Si no hay sesion, muestra acceso a login/registro y collage de productos

### 9.2 registro
- Valida nombre, email unico y confirmacion de contrasena
- Crea usuario con rol `client` por defecto
- Persiste en `usersData`

### 9.3 login
- Busca usuario en `usersData`
- Si credenciales correctas, guarda `userData` con `loggedIn: true`
- Redirige por rol: admin o cliente

### 9.4 admin/home
- Ruta protegida por rol `admin`
- Lista productos sin stock

### 9.5 client/home
- Ruta protegida por rol `client`
- Vista principal de cliente con acceso al catalogo

### 9.6 store/home
- Ruta protegida por rol `client`
- Permite filtrar/buscar productos y agregarlos al carrito

### 9.7 store/cart
- Ruta protegida por rol `client`
- Permite aumentar/disminuir cantidad, eliminar items, vaciar carrito y calcular total

## 10. Navegacion y UX
- `navigate.ts` centraliza `window.location.href`
- El logo del header se comporta de forma dinamica:
  - sin sesion: va a `index.html`
  - con sesion: va a `client/home/home.html`
- Notificaciones de feedback usando Alertify

## 11. Estilos y responsive
Archivo unico: `src/style.css`

Incluye:
- sistema base de variables CSS
- estilos de auth, admin, cliente, tienda y carrito
- footer global compartido
- media queries para tablet y mobile


##  Autor
- Estudiante: Etchegoyen Gabriel
- Materia: Programacion III
- Entrega correspondiente al primer parcial 
