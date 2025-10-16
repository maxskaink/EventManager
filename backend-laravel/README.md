# 🧠 Backend Laravel - Academic Platform API

API REST desarrollada con **Laravel 12** para una plataforma académica que gestiona usuarios, publicaciones, eventos y otros recursos académicos.

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalados:

- [Docker](https://www.docker.com/get-started) y Docker Compose
- [Git](https://git-scm.com/)

---

## 🚀 Instalación y Configuración

### 1️⃣ Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd backend-laravel
```

### 2️⃣ Configurar variables de entorno

Copia el archivo de entorno de ejemplo y configura tus credenciales:

```bash
cp .env.example .env
```

Luego edita el archivo `.env` y completa la sección de autenticación OAuth:

```dotenv
# OAuth Credentials
GOOGLE_CLIENT_ID=tu_client_id
GOOGLE_CLIENT_SECRET=tu_client_secret
GOOGLE_REDIRECT_URI=http://localhost/auth/callback
```

> ⚠️ **Importante:** Asegúrate de completar las credenciales de autenticación antes de levantar el entorno.

---

### 3️⃣ Iniciar el entorno con Laravel Sail

Levanta los contenedores con:

```bash
./vendor/bin/sail up -d
```

O usando un alias más corto (recomendado):

```bash
alias sail='./vendor/bin/sail'
sail up -d
```

---

### 4️⃣ Ejecutar migraciones

Cuando los contenedores estén corriendo, aplica las migraciones de base de datos:

```bash
sail artisan migrate
```

---

## 🔧 Desarrollo

### Comandos útiles de Sail

```bash
# Iniciar servicios
sail up -d

# Detener servicios
sail down

# Ver logs
sail logs -f

# Ejecutar comandos Artisan
sail artisan <comando>

# Acceder al contenedor
sail shell

# Ejecutar tests
sail test
```

---

## 🔑 Generación de Token de Prueba

Para facilitar el testing de la API, el proyecto incluye un comando personalizado que genera tokens de autenticación:

```bash
sail artisan auth:token
```

Este comando:

- Solo funciona en entorno local
- Genera un token **Sanctum** válido
- Crea un usuario de prueba si no existe (`test@example.com`)
- Revoca tokens anteriores del usuario
- Muestra el token listo para usar en **Postman** o **Insomnia**

**Uso con email personalizado:**

```bash
sail artisan auth:token usuario@example.com
```

**Salida esperada:**

```
Token generado exitosamente:

<token-generado>

Usa este header en Postman:
Authorization: Bearer <token-generado>
```

---

## 📡 Testing de la API

### Configuración en Postman / Insomnia

1. Genera un token con el comando `sail artisan auth:token`
2. En tus peticiones HTTP, agrega el header:

```
Authorization: Bearer <tu-token>
```

### Endpoints principales

- Base URL: `http://localhost/api`
- Autenticación mediante **Bearer Token (Sanctum)**

---

## 🗄️ Base de Datos

El proyecto usa **MySQL**, configurado por defecto con las siguientes credenciales (definidas en `.env`):

| Parámetro      | Valor       |
|----------------|--------------|
| Host           | mysql        |
| Puerto         | 3306         |
| Base de datos  | laravel      |
| Usuario        | sail         |
| Contraseña     | password     |

---

## 📦 Tecnologías Utilizadas

- **Framework:** Laravel 12.34.0
- **Autenticación:** Laravel Sanctum
- **Base de datos:** MySQL
- **Contenedores:** Docker + Laravel Sail
- **Queue:** Database
- **Frontend tooling:** Vite + TailwindCSS

---

## 🛠️ Paquetes Principales

| Paquete | Descripción |
|----------|--------------|
| `laravel/sanctum` | Autenticación de APIs |
| `guzzlehttp/guzzle` | Cliente HTTP |
| `firebase/php-jwt` | Manejo de JWT |
| `monolog/monolog` | Logging avanzado |
| `fakerphp/faker` | Generación de datos de prueba |

---

## 📝 Notas Adicionales

- El comando `auth:token` **solo está disponible en entorno local** por seguridad.
- **Nunca** subas tu archivo `.env` al repositorio.
- Los logs se encuentran en `storage/logs`.
- Para desarrollo en equipo, configura un `.env` propio por cada entorno.

---

💡 _Desarrollado con Laravel y Docker para un flujo moderno, modular y seguro._
