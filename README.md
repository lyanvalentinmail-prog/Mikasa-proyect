# Mikasa Bot Builder

Monorepo base para una plataforma multi-tenant de sub-bots WhatsApp. La web consume una API modular y el estado de cada bot queda aislado por `botId`. Esta primera entrega incluye dashboard, creación de bots, estado, conexión abstracta, estadísticas, logs y menú generado.

## Arranque
```bash
cp .env.example .env
npm run dev
```
Abrir `http://localhost:3000`. Para producción conectar `packages/database` a PostgreSQL, Redis para eventos y un proveedor WhatsApp compatible en `apps/bot/connection`.

## Arquitectura
- `apps/web`: cliente responsive y panel.
- `apps/api`: API HTTP, autorización por propietario pendiente de middleware de sesión.
- `apps/bot/connection`: contrato del proveedor WhatsApp (no se simula una conexión real en esta base).
- `packages/database`, `packages/types`, `packages/commands`: puntos de extensión para Prisma, contratos y motor de menú.

La conexión real requiere credenciales/proveedor y persistencia cifrada de sesión; el estado `waiting_qr` no se presenta como online.
