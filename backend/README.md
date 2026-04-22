# eTwin — PHP + MySQL Backend

Native PHP REST API (no framework) for the eTwin store. Works on XAMPP / MAMP / WAMP / Laragon.

## 1. Requirements

- PHP 7.4+ (8.x recommended)
- MySQL 5.7+ / MariaDB 10+
- Apache with `mod_rewrite` enabled (XAMPP: enabled by default)

## 2. Install

1. Copy the entire `backend/` folder into your local server root:
   - **XAMPP**: `C:/xampp/htdocs/etwin-api/`
   - **MAMP**: `/Applications/MAMP/htdocs/etwin-api/`
   - **WAMP**: `C:/wamp64/www/etwin-api/`

2. Open phpMyAdmin → import `backend/database/etwin.sql`
   (creates database `etwin_db` + tables + sample data)

3. Edit `backend/config/database.php` if your MySQL user/password differ
   (default XAMPP: user `root`, password empty).

4. Start Apache + MySQL.

## 3. Test it

Open in your browser:

```
http://localhost/etwin-api/api/products
http://localhost/etwin-api/api/digital-products
http://localhost/etwin-api/api/services
```

You should get JSON.

## 4. Available endpoints

| Method | URL                                | Description                        |
|--------|------------------------------------|------------------------------------|
| GET    | `/api/products`                    | List electronics                   |
| GET    | `/api/products/{id}`               | Single product                     |
| GET    | `/api/digital-products`            | List digital products (templates…) |
| GET    | `/api/digital-products/{id}`       | Single digital product             |
| GET    | `/api/services`                    | List services                      |
| GET    | `/api/orders`                      | List orders                        |
| POST   | `/api/orders`                      | Create order (cart checkout)       |
| POST   | `/api/contact`                     | Submit contact form                |
| POST   | `/api/services/request`            | Request a service                  |

All responses are JSON. CORS is enabled for any origin (dev only).

## 5. Connect from React

In your React app you can call:

```js
fetch("http://localhost/etwin-api/api/products")
  .then(r => r.json())
  .then(console.log);
```

## 6. Folder structure

```
backend/
├── api/
│   ├── products.php
│   ├── digital-products.php
│   ├── services.php
│   ├── orders.php
│   └── contact.php
├── config/
│   ├── database.php
│   └── cors.php
├── database/
│   └── etwin.sql
├── .htaccess
└── index.php
```
