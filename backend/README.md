# eTwin — PHP + MySQL Backend

Native PHP REST API (no framework) for the eTwin store. Works on XAMPP / MAMP / WAMP / Laragon.

## 1. Requirements

- PHP 7.4+ (8.x recommended)
- MySQL 5.7+ / MariaDB 10+
- Apache with `mod_rewrite` enabled (XAMPP: enabled by default)

## 2. Install

1. Copy the entire project (or just the `backend/` folder) into your local server root.
   In your case the full project lives at:
   - **XAMPP**: `C:/xampp/htdocs/test/etwin-digital-nexus/`
   - So the backend is reachable at: `http://localhost/test/etwin-digital-nexus/backend/`

2. Open phpMyAdmin → import `backend/database/etwin.sql`
   (creates database `etwin_db` + tables + sample data + default admin).

3. Edit `backend/config/database.php` if your MySQL user/password differ
   (Laragon default is often user `root`, password empty unless you changed it).

4. Start Apache + MySQL.

## 3. Test it

Open in your browser:

```
http://localhost/test/etwin-digital-nexus/backend/api/products
http://localhost/test/etwin-digital-nexus/backend/api/digital-products
http://localhost/test/etwin-digital-nexus/backend/api/services
```

You should get JSON. If you see HTML or a 404, `mod_rewrite` is not enabled.

## 4. Connect the React app

Create a `.env` file in the project root (next to `package.json`):

```
VITE_API_URL=http://localhost/test/etwin-digital-nexus/backend/api
```

Then restart `npm run dev`. The admin login at `/admin` will hit your local PHP.

### Laragon examples

If Laragon serves this project as a virtual host, your URLs may look like:

```
http://etwin-digital-nexus.test/backend/api
http://myshop.test/backend/api
```

In that case set:

```
VITE_API_URL=http://etwin-digital-nexus.test/backend/api
```

If you open the built app directly from the same Laragon domain, the frontend can
also auto-detect `/backend/api` without extra config.

> ⚠️ **Important about the Lovable preview:**
> The Lovable online preview runs on `https://*.lovable.app`. Your browser will
> **block** calls from `https` to `http://localhost` (mixed content) and the
> session cookie won't travel cross-origin. To use this PHP backend you must
> run the React app **locally** with `npm run dev` (so it runs on
> `http://localhost:5173`) — not from the cloud preview.

## 5. Default admin login

```
username: admin
password: admin123
```

## 6. Available endpoints

### Public
| Method | URL                                | Description                        |
|--------|------------------------------------|------------------------------------|
| GET    | `/api/products`                    | List electronics                   |
| GET    | `/api/products/{id}`               | Single product                     |
| GET    | `/api/digital-products`            | List digital products              |
| GET    | `/api/services`                    | List services                      |
| POST   | `/api/orders`                      | Create order (cart checkout)       |
| POST   | `/api/contact`                     | Submit contact form                |
| POST   | `/api/services/request`            | Request a service                  |

### Admin (session required)
| Method            | URL                          |
|-------------------|------------------------------|
| POST              | `/api/admin/login`           |
| POST              | `/api/admin/logout`          |
| GET               | `/api/admin/me`              |
| GET               | `/api/stats`                 |
| POST/PUT/DELETE   | `/api/products(/:id)`        |
| POST/PUT/DELETE   | `/api/digital-products(/:id)`|
| POST/PUT/DELETE   | `/api/services(/:id)`        |
| GET/PUT/DELETE    | `/api/orders(/:id)`          |
| GET/PUT/DELETE    | `/api/messages(/:id)`        |
| GET/PUT/DELETE    | `/api/requests(/:id)`        |

## 7. Folder structure

```
backend/
├── api/
│   ├── admin-auth.php
│   ├── products.php
│   ├── digital-products.php
│   ├── services.php
│   ├── orders.php
│   ├── messages.php
│   ├── requests.php
│   ├── service-request.php
│   ├── stats.php
│   └── contact.php
├── config/
│   ├── database.php
│   ├── cors.php
│   └── auth.php
├── database/
│   └── etwin.sql
├── .htaccess
└── index.php
```
