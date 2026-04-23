-- =====================================================
-- eTwin Database Schema + Sample Data
-- Import this file in phpMyAdmin or run with:
--   mysql -u root -p < etwin.sql
-- =====================================================

CREATE DATABASE IF NOT EXISTS etwin_db
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE etwin_db;

-- =====================================================
-- DROP in dependency order
-- =====================================================
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS contact_messages;
DROP TABLE IF EXISTS service_requests;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS digital_products;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS admins;

-- =====================================================
-- TABLE: admins  (dashboard login)
-- =====================================================
CREATE TABLE admins (
  id          INT             PRIMARY KEY AUTO_INCREMENT,
  username    VARCHAR(64)     NOT NULL UNIQUE,
  password    VARCHAR(255)    NOT NULL,    -- bcrypt hash
  name        VARCHAR(128)    NOT NULL,
  created_at  TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Default admin: username=admin / password=admin123
-- (bcrypt hash for "admin123")
INSERT INTO admins (username, password, name) VALUES
('admin', '$2y$10$H8m1tQEYGq1JcOMCd2k0POaEJxTmSJWmkZVXl2jR9aBnQwGqDdBfa', 'eTwin Admin');

-- =====================================================
-- TABLE: products  (electronics)
-- =====================================================
CREATE TABLE products (
  id            VARCHAR(64)    PRIMARY KEY,
  name          VARCHAR(255)   NOT NULL,
  price         DECIMAL(10,2)  NOT NULL,
  category      VARCHAR(64)    NOT NULL,
  image         VARCHAR(255)   NOT NULL,
  description   TEXT           NOT NULL,
  highlights    JSON           NULL,
  stock         INT            NOT NULL DEFAULT 100,
  created_at    TIMESTAMP      DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO products (id, name, price, category, image, description, highlights, stock) VALUES
('etwin-aura-headphones', 'eTwin Aura Headphones', 249.00, 'Audio',
 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
 'Immersive over-ear headphones with adaptive noise cancellation and 40h playback.',
 '["Active Noise Cancellation","40h Battery","Hi-Res Audio","Spatial Sound"]', 120),

('etwin-pulse-watch', 'eTwin Pulse Watch', 329.00, 'Wearables',
 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800',
 'Track every heartbeat with a luminous AMOLED display and 7-day battery life.',
 '["AMOLED Always-On","ECG + SpO2","GPS","7-day Battery"]', 80),

('etwin-blade-laptop', 'eTwin Blade Laptop', 1599.00, 'Computers',
 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
 'Ultraportable powerhouse with neural chip and 16GB unified memory.',
 '["Neural Chip M-Pro","16GB Memory","14” Liquid Retina","18h Battery"]', 35),

('etwin-air-buds', 'eTwin Air Buds', 149.00, 'Audio',
 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800',
 'True wireless earbuds with H1 chip and transparency mode.',
 '["Active Noise Cancellation","Transparency Mode","Wireless Charging"]', 200),

('etwin-vision-phone', 'eTwin Vision Phone', 899.00, 'Mobile',
 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
 'Flagship smartphone with triple-lens AI camera and 6.7” OLED display.',
 '["6.7” OLED 120Hz","Triple AI Camera","5G","256GB"]', 60),

('etwin-glide-mouse', 'eTwin Glide Mouse', 89.00, 'Accessories',
 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800',
 'Precision wireless mouse with 26K DPI sensor and programmable RGB.',
 '["26K DPI Sensor","RGB Lighting","70h Battery"]', 250),

('etwin-mecha-keyboard', 'eTwin Mecha Keyboard', 159.00, 'Accessories',
 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800',
 'Tenkeyless mechanical keyboard with hot-swappable switches and per-key RGB.',
 '["Hot-swap Switches","Per-key RGB","USB-C","Aluminium Frame"]', 90),

('etwin-vision-mini', 'eTwin Vision Mini', 699.00, 'Mobile',
 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800',
 'All the flagship power in a compact 5.8” form. Pocketable and fast.',
 '["5.8” OLED","Dual AI Camera","5G","128GB"]', 75);

-- =====================================================
-- TABLE: digital_products
-- =====================================================
CREATE TABLE digital_products (
  id            VARCHAR(64)    PRIMARY KEY,
  name          VARCHAR(255)   NOT NULL,
  type          VARCHAR(64)    NOT NULL,
  price         DECIMAL(10,2)  NOT NULL,
  old_price     DECIMAL(10,2)  NULL,
  rating        DECIMAL(2,1)   NOT NULL DEFAULT 5.0,
  sales         INT            NOT NULL DEFAULT 0,
  tagline       VARCHAR(255)   NOT NULL,
  features      JSON           NULL,
  badge         VARCHAR(32)    NULL,
  download_url  VARCHAR(255)   NULL,
  created_at    TIMESTAMP      DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO digital_products (id, name, type, price, old_price, rating, sales, tagline, features, badge) VALUES
('nova-saas-template', 'Nova SaaS Template', 'Website Template', 49.00, 79.00, 4.9, 1240,
 'Production-ready Next.js + Tailwind SaaS landing template.',
 '["Next.js 14","10+ sections","Dark mode","Lifetime updates"]', 'Bestseller'),
('aurora-wp-theme', 'Aurora WordPress Theme', 'WordPress Theme', 59.00, NULL, 4.8, 860,
 'Premium WordPress theme for agencies and creators.',
 '["Elementor ready","WooCommerce","Speed optimized","RTL support"]', 'New'),
('atlas-chatbot-module', 'Atlas AI Chatbot Module', 'Chatbot Module', 89.00, 129.00, 5.0, 410,
 'Plug-and-play GPT chatbot with multi-channel support.',
 '["OpenAI + Gemini","WhatsApp & Web","Custom training","Analytics"]', 'Pro'),
('orbit-odoo-crm', 'Orbit CRM — Odoo Module', 'Odoo Module', 119.00, NULL, 4.7, 320,
 'Advanced CRM extension for Odoo 16/17 with pipeline AI.',
 '["Odoo 16 & 17","AI lead scoring","Email automation","REST API"]', NULL),
('vertex-shopify-theme', 'Vertex Shopify Theme', 'Shopify Theme', 79.00, NULL, 4.9, 980,
 'Conversion-optimized Shopify 2.0 theme for fashion & tech.',
 '["Shopify 2.0","Mega menu","Quick checkout","Sections everywhere"]', 'Bestseller'),
('pulse-dashboard-kit', 'Pulse Admin Dashboard Kit', 'Dashboard Kit', 39.00, 69.00, 4.8, 1530,
 '120+ React + Tailwind admin components and pages.',
 '["120+ components","Charts & tables","Auth flows","Figma file"]', 'New');

-- =====================================================
-- TABLE: services
-- =====================================================
CREATE TABLE services (
  id            VARCHAR(64)    PRIMARY KEY,
  title         VARCHAR(255)   NOT NULL,
  icon          VARCHAR(64)    NOT NULL,
  description   TEXT           NOT NULL,
  features      JSON           NULL,
  created_at    TIMESTAMP      DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO services (id, title, icon, description, features) VALUES
('web-development', 'Website Development', 'Code2',
 'Custom-built, blazing-fast websites engineered with modern frameworks.',
 '["React / Next.js","SEO optimized","CMS Integration"]'),
('ecommerce', 'eCommerce Stores', 'ShoppingBag',
 'End-to-end online stores with secure checkout and smart inventory.',
 '["Stripe & Paddle","Inventory Sync","Analytics Dashboard"]'),
('saas', 'SaaS Solutions', 'Cloud',
 'Scalable software platforms with auth, billing, and dashboards.',
 '["Multi-tenant","Subscription Billing","Cloud Native"]'),
('mobile', 'Mobile Apps', 'Smartphone',
 'Native-feel iOS and Android apps that perform like a dream.',
 '["React Native","Push Notifications","Offline-first"]'),
('ai', 'AI Integrations', 'Sparkles',
 'Plug intelligent automation, chat, and recommendation systems.',
 '["LLM Integrations","Custom Agents","Vector Search"]'),
('security', 'Security & DevOps', 'ShieldCheck',
 'Hardening, monitoring, and CI/CD pipelines.',
 '["Penetration Testing","CI/CD","24/7 Monitoring"]');

-- =====================================================
-- TABLE: orders
-- =====================================================
CREATE TABLE orders (
  id              INT             PRIMARY KEY AUTO_INCREMENT,
  customer_name   VARCHAR(255)    NOT NULL,
  customer_email  VARCHAR(255)    NOT NULL,
  customer_phone  VARCHAR(64)     NULL,
  address         TEXT            NULL,
  subtotal        DECIMAL(10,2)   NOT NULL,
  shipping        DECIMAL(10,2)   NOT NULL DEFAULT 0,
  tax             DECIMAL(10,2)   NOT NULL DEFAULT 0,
  total           DECIMAL(10,2)   NOT NULL,
  status          VARCHAR(32)     NOT NULL DEFAULT 'pending',
  created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE order_items (
  id            INT             PRIMARY KEY AUTO_INCREMENT,
  order_id      INT             NOT NULL,
  product_id    VARCHAR(64)     NOT NULL,
  product_name  VARCHAR(255)    NOT NULL,
  unit_price    DECIMAL(10,2)   NOT NULL,
  quantity      INT             NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- TABLE: contact_messages
-- =====================================================
CREATE TABLE contact_messages (
  id          INT            PRIMARY KEY AUTO_INCREMENT,
  name        VARCHAR(255)   NOT NULL,
  email       VARCHAR(255)   NOT NULL,
  subject     VARCHAR(255)   NOT NULL,
  message     TEXT           NOT NULL,
  is_read     TINYINT(1)     NOT NULL DEFAULT 0,
  created_at  TIMESTAMP      DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- TABLE: service_requests
-- =====================================================
CREATE TABLE service_requests (
  id          INT            PRIMARY KEY AUTO_INCREMENT,
  service_id  VARCHAR(64)    NOT NULL,
  name        VARCHAR(255)   NOT NULL,
  email       VARCHAR(255)   NOT NULL,
  budget      VARCHAR(64)    NULL,
  message     TEXT           NULL,
  is_read     TINYINT(1)     NOT NULL DEFAULT 0,
  created_at  TIMESTAMP      DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
