# 📏 Medidas Corporais

Aplicativo web de registro e acompanhamento de medidas corporais com suporte a múltiplos perfis.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)

## ✨ Funcionalidades

- **Múltiplos perfis** — cada pessoa tem seu próprio histórico isolado
- **Diagrama de silhueta** — tela desktop com inputs posicionados anatomicamente ao redor de uma silhueta SVG
- **Formulário adaptativo** — mobile-first com seções agrupadas por região corporal
- **Gráficos de evolução** — Recharts com filtro de período (30d/90d/6m/1a/tudo) e toggle de métricas
- **Exportação CSV** — separador `;` compatível com Excel no padrão pt-BR
- **Tema claro/escuro** — persiste via `localStorage` (next-themes)
- **Dashboard por perfil** — peso atual, IMC, cintura, sparkline dos últimos 90 dias

## 🛠 Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 15 App Router + TypeScript |
| Banco de dados | SQLite via Prisma v7 + LibSQL adapter |
| UI | Tailwind CSS 4 + shadcn/ui (base-ui) |
| Formulários | React Hook Form + Zod |
| Gráficos | Recharts |
| Datas | date-fns (locale pt-BR) |
| Notificações | sonner |
| Tema | next-themes |

## 🚀 Como executar

### Pré-requisitos

- Node.js 18+
- npm

### Instalação

```bash
# 1. Clone o repositório
git clone <url-do-repo>
cd body-measurements

# 2. Instale as dependências
npm install

# 3. Crie o banco de dados
npx prisma migrate dev

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

### Variáveis de ambiente

Nenhuma variável de ambiente é necessária para desenvolvimento local.
O banco SQLite é criado automaticamente em `data/app.db`.

## 📁 Estrutura de pastas

```
src/
├── app/
│   ├── page.tsx                              # Seletor de perfis
│   ├── layout.tsx                            # Layout raiz (tema, toasts)
│   └── profile/
│       ├── new/page.tsx                      # Criar perfil
│       └── [id]/
│           ├── page.tsx                      # Dashboard do perfil
│           ├── edit/page.tsx                 # Editar perfil
│           ├── new/page.tsx                  # ⭐ Novo registro (silhueta)
│           ├── measurements/
│           │   ├── page.tsx                  # Histórico de medidas
│           │   ├── export/route.ts           # Download CSV
│           │   └── [measurementId]/page.tsx  # Editar registro
│           └── charts/page.tsx               # Gráficos de evolução
├── actions/
│   ├── profiles.ts                           # Server Actions de perfil
│   └── measurements.ts                       # Server Actions de medidas
├── components/
│   ├── layout/                               # AppShell, ThemeToggle, ThemeProvider
│   ├── profile/                              # ProfileCard, ProfileForm, ColorPicker...
│   ├── measurement/                          # BodyDiagram, MeasurementForm, DeltaBadge...
│   └── charts/                               # ChartsClient, MeasurementChart...
├── lib/
│   ├── db.ts                                 # Singleton Prisma (hot-reload safe)
│   ├── utils.ts                              # cn(), formatDate(), calcBMI()...
│   └── csv.ts                                # Serialização CSV (separador ;)
└── schemas/
    ├── profile.schema.ts                     # Validação Zod do perfil
    └── measurement.schema.ts                 # Validação Zod das medidas
```

## 📐 Medidas registradas

| Campo | Unidade |
|-------|---------|
| Peso | kg |
| Cintura acima do umbigo | cm |
| Cintura no umbigo | cm |
| Braço direito / esquerdo | cm |
| Antebraço direito / esquerdo | cm |
| Glúteos | cm |
| Coxa direita / esquerda | cm |
| Panturrilha direita / esquerda | cm |

## 📝 Notas de desenvolvimento

- **Prisma v7**: requer driver adapter (`@prisma/adapter-libsql`). O `DATABASE_URL` não vai no `schema.prisma` — é passado via `new PrismaLibSql({ url })` em `src/lib/db.ts`.
- **shadcn/ui v4 (base-ui)**: não possui `asChild`. Use `buttonVariants()` em `<Link>` ou o prop `render` nos triggers (`SheetTrigger`, `AlertDialogTrigger`).
- **Server Actions**: nunca usam `redirect()` — retornam `{ redirectTo }` e o Client Component faz `router.push()` + `toast.success()`.

## 📦 Build para produção

```bash
npm run build
npm start
```

> O banco de dados `data/app.db` não é incluído no repositório. Execute `npx prisma migrate deploy` antes de iniciar em produção.
