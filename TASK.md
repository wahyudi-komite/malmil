# Malmil D2C E-Commerce — Task Tracker
> Disimpan: 16 Juni 2026

---

## ✅ Phase 1: Database Schema & Backend Foundation
- [x] Remove datalist/datareal modules from app.module.ts
- [x] Update main.ts (Helmet, API prefix, rawBody, CORS)
- [x] Update .env.example with Malmil config
- [x] Install new backend dependencies
- [x] Extend User entity (phone, is_active, email_verified_at)
- [x] Create all new TypeORM entities (12 modules)
- [x] Update database seeder with e-commerce permissions & seed data
- [x] Update app.module.ts (register 12 modules, ScheduleModule, ServeStaticModule)

## ✅ Phase 2: Backend Core Modules
- [x] Common decorators (CurrentUser, Public, Roles), guards (RolesGuard)
- [x] Common exception filter (GlobalExceptionFilter)
- [x] Products module (controller, service, DTOs, entities, categories, inventory)
- [x] Cart module (guest session UUID, merge on login, coupon, stock validation)
- [x] Orders module (atomic transaction, order number, stock deduction, coupon)
- [x] Coupons module (CRUD, validate: percentage/fixed, min_order, usage, expiry)
- [x] Banners module (CRUD, date-aware active query)
- [x] Wishlist module (toggle, check, user-scoped)
- [x] Notifications module (user notifs, read tracking, newsletter subscribe)
- [x] Settings module (CRUD by key, bulk update, public endpoint)
- [x] Analytics module (dashboard stats, revenue chart)
- [x] Upload module (file upload, Multer UUID storage)
- [x] Inventory service (stock audit trail, low stock alerts)
- [x] Health check endpoint

## ✅ Phase 3: Payment Gateway Integration
- [x] Payment entity & module
- [x] Midtrans gateway (Snap API createTransaction, Core API status check)
- [x] Webhook controller with status mapping (paid/failed/expired/refunded)
- [x] Payment status updates order status
- [x] Signature verification (SHA512 order_id + status_code + gross_amount + server_key)

## ✅ Phase 4: Shipping Integration
- [x] Shipping entities (addresses, couriers, rates)
- [x] Address CRUD (user-scoped, is_default toggle)
- [x] Courier listing endpoint
- [x] Regions (37 provinces, 507 cities)
- [x] Rate calculation endpoint (mock — JNE, J&T, SiCepat, AnterAja, Pos)

## ✅ Phase 5: Frontend — Storefront
- [x] Storefront layout (header: logo, search, cart, user menu; footer; floating WA/IG)
- [x] Landing page (hero, best sellers, about, testimonials, Instagram, newsletter)
- [x] Catalog page (grid, search, filter by category, sort, pagination)
- [x] Product detail page (gallery, variant selector, add-to-cart)
- [x] Cart page (items, qty, subtotal, coupon, shipping estimation)
- [x] Checkout page (one-page: info → address → shipping → payment → review)
- [x] Payment status page (success/pending/failed)
- [x] Order tracking page
- [x] Customer dashboard (profile, addresses, order history, wishlist)
- [x] Theme system (dark/light mode with localStorage persistence)

## ✅ Phase 6: Admin Dashboard
- [x] Admin analytics dashboard (revenue chart, orders, top products, low stock)
- [x] Admin product management (list, form with rich text + variants, category manager)
- [x] Admin order management (list, detail, status update, resi input)
- [x] Admin marketing (banner manager with preview, coupon manager with stats)
- [x] Admin settings page
- [x] Admin users & roles & permissions (two-tab, permission checkbox assignment)
- [x] Admin inventory (summary cards, low stock alert, variant table, stock history modal)
- [x] Admin audit logs (table with action filter dropdown, color-coded actions)

## ✅ Phase 7: Marketing & Tracking
- [x] Tracking module (server-side Meta CAPI, GA4 Measurement Protocol)
- [x] Tracking controller (POST /tracking/event)

---

## ⬜ Current Sprint — Phase 8: Security & Performance
- [x] Rate caching for shipping rates (15 min TTL via in-memory cache)
- [ ] Webhook signature verification
- [x] Rate limiting per endpoint (auth: 5/min via @Throttle decorators, API global: 60/min)
- [x] Swagger/OpenAPI documentation (23 controllers tagged, available at /api/docs)
- [x] Database indexes optimization (45 @Index() added across 18 entity files)
- [x] Angular SSR for SEO pages (server.ts, app.config.server, build successful)
- [ ] PWA support

## ⬜ Future
- [ ] Client-side Pixel (Facebook Pixel, Google Analytics, TikTok Pixel in index.html)
- [ ] Abandoned cart cron job (email + WhatsApp reminders)
- [ ] District data (7,277 kecamatan) for cascade address selector
- [ ] Biteship real connector (replace mock shipping rates)
- [ ] Rate caching 15 min TTL for Biteship (when integrated)
- [ ] Deployment: Nginx config, PM2 cluster mode, Cloudflare SSL, DB backup cron, CI/CD pipeline

---

## Notes
- Midtrans webhook signature: `SHA512(order_id + status_code + gross_amount + server_key)`
- MailService defaults to `MAIL_DRIVER=log` (console.log) in dev
- `sameSite: 'none'` on refresh token cookie for cross-origin OAuth
- APP_URL in .env must match deployment URL for password reset & email verification links
