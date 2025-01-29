# IPS CHATBOT

- 67.207.86.253  = implementacao
- 209.38.150.38  = atendimento
- 64.23.235.27   = sac
- 64.23.133.38   = prospeccao
---
## DOWNLOAD INSTALL
- https://github.com/gleison1986CEO/install_sh.git
---

### UPDATE SOFTWARE
## BACKEND

- npm install
- remover 20211227010204-create-ticket-service-schedules.ts
- npm run build
- npx sequelize db:migrate
- recriar 20211227010204-create-ticket-service-schedules.ts
- npm run build
- npx sequelize db:migrate
- npx sequelize db:seed:all
- ALTER TABLE public."ScheduleServices" DROP CONSTRAINT "ScheduleServices_contactId_fkey"; // ALTERAÇÕES PARA HINOVA
- ALTER TABLE "TicketScheduleServices" ADD "hinovaContactName" VARCHAR(255); 
- psql -h localhost -d witt_adv -U witt -p 5432
---
## FRONTEND
- npm install
- npm run build
---
## PM2
- PM2 RESTART ALL
---
