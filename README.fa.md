<div align="center">

# AI Health Companion

### پایش سلامت شخصی و تحلیل به‌قدرت هوش مصنوعی

نرم‌افزار پایش سلامت تک‌لایه‌ای که به شما اجازه می‌دهد ۱۰ شاخص سلامت ثبت کنید، روندها را از طریق نمودارهای تعاملی تصویرسازی کنید و بینش‌های سلامتی تولیدشده با هوش مصنوعی دریافت کنید — همه از طریق Prisma، NextAuth و OpenAI پشتیبانی می‌شود.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Coming_Soon-0a0a0a?style=for-the-badge&labelColor=0a0a0a&color=3b82f6)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-0a0a0a?style=for-the-badge&labelColor=0a0a0a&color=22c55e)](LICENSE)
[![Next.js 16](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma_6-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)

</div>

---

## نمای کلی

AI Health Companion یک داشبورد سلامت شخصی است که داده‌های خام سلامت را به بینش‌های قابل‌اعمال تبدیل می‌کند. هر چیز از BMI و آزمایش‌های خون تا کیفیت خواب و هیدراتاسیون را رصد کنید — سپس اجازه دهید هوش مصنوعی الگوهای خود را تحلیل کرده و توصیه‌های شخصی‌سازی‌شده ارائه دهد.

---

## ویژگی‌ها

| ویژگی | توضیح |
|:--------|:------------|
| **۱۰ ماژول سلامت** | BMI، آزمایش‌های خون، تغذیه، خواب، ورزش، مصرف آب، کالری‌ها، مکمل‌ها، سلامت مو و سلامت پوست |
| **تحلیل سلامت هوشمند** | تحلیل به‌قدرت OpenAI با هر دو نقطه‌پایان پاسخ استاندارد و استریم (SSE) |
| **نمودارهای تعاملی** | تصویرسازی داده‌ها به‌قدرت Recharts برای تحلیل روند در همه شاخص‌های سلامت |
| **احراز هویت** | NextAuth.js با ارائه‌دهنده‌ی اعتبار، جریان‌های ورود/ثبت‌نام و محافظت مسیر از طریق میان‌افزار |
| **دستگاه چیدمان داشبورد** | چیدمان ماژولار داشبورد با فرم‌های ورودی در هر ماژول و بینش‌های تجمیع‌شده |
| **پنل بینش‌های هوشمند** | پنل اختصاصی که توصیه‌های سلامتی تولیدشده با هوش مصنوعی و تحلیل الگو را نمایش می‌دهد |
| **مدیریت پروفایل** | صفحه‌ی پروفایل کاربر با نمای کلی داده‌های سلامت شخصی |
| **طراحی واکنش‌گرا** | چیدمان Mobile-first که با Tailwind CSS ساخته شده |
| **تم تاریک/روشن** | تغییر تم با آگاهی از سیستم |

---

## پشته فناوری

| لایه | فناوری‌ها |
|:------|:-------------|
| **فریم‌ورک** | Next.js 16 (App Router, Turbopack) |
| **زبان** | TypeScript 5.7 |
| **استایلینگ** | Tailwind CSS 3.4, PostCSS |
| **دیتابیس** | SQLite از طریق Prisma ORM 6.9 |
| **احراز هویت** | NextAuth.js 4.24 |
| **هوش مصنوعی** | OpenAI API (استریم + استاندارد) |
| **وضعیت** | Zustand 5 |
| **انیمیشن** | Framer Motion 11 |
| **نمودارها** | Recharts 2.15 |
| **هش کردن رمز** | bcryptjs 3 |

---

## ساختار پروژه

```
ai-health-companion/
├── prisma/
│   ├── schema.prisma          # اسکیمای دیتابیس
│   ├── seed.js                # اسکریپت بذر
│   └── dev.db                 # دیتابیس توسعه SQLite
├── src/
│   ├── app/
│   │   ├── auth/              # صفحات ورود و خطا
│   │   ├── log/               # ثبت داده‌های سلامت
│   │   ├── profile/           # پروفایل کاربر
│   │   └── api/
│   │       ├── analyze-health/       # نقطه‌پایان تحلیل هوشمند
│   │       ├── analyze-health/stream/ # هوشمند استریم (SSE)
│   │       ├── auth/                 # NextAuth + ثبت‌نام
│   │       └── health-data/          # API CRUD
│   ├── components/
│   │   ├── ai-insights/       # نمایش بینش‌های هوشمند
│   │   ├── charts/            # تصویرسازی داده‌ها
│   │   ├── dashboard/         # چیدمان شبکه‌ی ماژول‌ها
│   │   └── modules/           # ۱۰ ماژول ورودی سلامت
│   ├── lib/
│   │   ├── auth.ts            # پیکربندی NextAuth
│   │   ├── db.ts              #単例 Prisma
│   │   └── ai-analysis.ts     # یکپارچگی OpenAI
│   ├── store/                 # وضعیت Zustand
│   ├── types/                 # انواع TypeScript
│   └── middleware.ts          # محافظت مسیر
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## شروع سریع

### پیش‌نیازها

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

### نصب

```bash
git clone https://github.com/mohammadhossein-asadi/ai-health-companion.git
cd ai-health-companion
npm install
```

### راه‌اندازی دیتابیس

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

### پیکربندی محیط

فایل `.env` بسازید:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
OPENAI_API_KEY="sk-..."
```

### توسعه

```bash
npm run dev
```

در آدرس `http://localhost:3000` باز می‌شود.

### بیلد نسخه‌ی تولید

```bash
npm run build
npm run start
```

---

## معماری

```
┌─────────────────────────────────────┐
│            فرانت‌اند                 │
│  صفحات (App Router) + کامپوننت‌ها   │
│  فروشگاه Zustand + Recharts          │
├─────────────────────────────────────┤
│          لایه API                  │
│  /api/health-data (CRUD)           │
│  /api/analyze-health (هوش مصنوعی)          │
│  /api/auth/* (NextAuth)            │
├─────────────────────────────────────┤
│          لایه داده                 │
│  Prisma ORM → SQLite               │
└─────────────────────────────────────┘
```

### تحلیل هوشمند استریم

نقطه‌پایان `/api/analyze-health/stream` از `ReadableStream` برای ارائه‌ی بینش‌های سلامتی تولیدشده با هوش مصنوعی به زمان واقعی استفاده می‌کند، اجازه می‌دهد رابط کاربری توصیه‌ها را در حین تولید رندر کند نه اینکه منتظر پاسخ کامل بماند.

---

## اسکریپت‌ها

| دستور | توضیح |
|:--------|:------------|
| `npm run dev` | راه‌اندازی سرور توسعه با Turbopack |
| `npm run build` | بیلد نسخه‌ی تولید |
| `npm run start` | اجرای سرور نسخه‌ی تولید |
| `npm run lint` | ESLint |

---

## تصمیمات کلیدی معماری

### Prisma + SQLite برای پایداری بی‌پیکربندی
SQLite به هیچ سرور دیتابیس جداگانه نیاز ندارد — کاملاً مناسب برای توسعه محلی و استقرارهای کوچک. Prisma دسترسی دیتابیس ایمن-تایپ را با کلاینت تولیدشده خود فراهم می‌کند.

### ارائه‌دهنده‌ی اعتبار NextAuth.js
احراز هویت اعتبار سفارشی با هش کردن رمز bcrypt. میان‌افزار همه مسیرهای زیر `/log`، `/profile` و `/api/health-data` را محافظت می‌کند.

### هوشمند استریم از طریق SSE
نقطه‌پایان `/api/analyze-health/stream` از یک `ReadableStream` با کدگر سفارشی برای ارائه‌ی پاسخ‌های هوشمند 토큰-به-تکن استفاده می‌کند، امکان به‌روزرسانی آنی رابط کاربری را بدون WebSockets فراهم می‌کند.

### ماژول‌های سلامت ماژولار
هر یک از ۱۰ شاخص سلامت یک کامپوننت خود-مشخص با فرم ورودی، اعتبارسنجی و نوع نمودار خود است — افزودن شاخص‌های جدید آسان می‌کند.

### Zustand برای وضعیت کلاینت
مدیریت وضعیت سبک برای چیدمان داشبورد، ماژول فعال و پنل بینش‌های هوشمند — بدون بار Kontext API.

---

## مجوز

این پروژه تحت [مجوز MIT](LICENSE) منتشر شده است.

---

<div align="center">

**Mohammadhossein Asadi** — مهندس فرانت‌اند و فرانت‌به‌کل

[![GitHub](https://img.shields.io/badge/GitHub-mohammadhossein--asadi-0a0a0a?style=flat-square&logo=github)](https://github.com/mohammadhossein-asadi)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-mohammadhossein--asadi-0a66c2?style=flat-square&logo=linkedin)](https://linkedin.com/in/mohammadhossein-asadi)

</div>
