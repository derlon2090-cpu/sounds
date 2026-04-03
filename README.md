# Saudi TTS SaaS

منصة SaaS لتحويل النص العربي إلى صوت، مع محرك داخلي، API خاص، لوحة Studio، ونظام jobs غير متزامن.

## الهيكل

```text
apps/
  web/                 # واجهة Next.js
services/
  api/                 # FastAPI + PostgreSQL
  worker/              # Celery worker + Arabic preprocessing + audio rendering
infra/
  docker-compose.yml   # Postgres + Redis + API + Worker + Web
docs/
  architecture.md      # المخطط الهندسي والقرارات
```

## التشغيل السريع

```powershell
Copy-Item .env.example .env
docker compose -f infra/docker-compose.yml --env-file .env up --build
```

## الروابط

- Web: http://localhost:3000
- API Docs: http://localhost:8000/docs

## ملاحظات

- الـ Worker الحالي يستخدم مولّد WAV تجريبي deterministic حتى نثبت البايبلاين قبل إدخال FastPitch أو VITS.
- `sound.html` تُرك كما هو بدون تعديل.
