# IPS CHATBOT

- 67.207.86.253  = implementacao
- 209.38.150.38  = atendimento
- 64.23.235.27   = sac
- 64.23.133.38   = prospeccao
---
## DOWNLOAD INSTALL
- git clone https://github.com/gleison1986CEO/whatsapp_atise_somatto.git
- git clone https://github.com/gleison1986CEO/install_sh.git
---

## COMANDO DE UPDATE
- git clone https://github.com/gleison1986CEO/whatsapp_atise_somatto.git 
- rm -R backend && rm -R frontend
- cd whatsapp_atise_somatto
- mv backend ../ && mv frontend ../
- cd ..
- rm -R whatsapp_atise_somatto
- npm i --save && npm run build && pm2 restart all
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
- psql -h localhost -d witt_adv -U witt -p 5432
- ALTER TABLE "ScheduleServices" DROP CONSTRAINT "ScheduleServices_contactId_fkey"; // ALTERAÇÕES PARA HINOVA
- ALTER TABLE "ScheduleServices" ADD "hinovaContactName" VARCHAR(255);
- ALTER TABLE "TicketScheduleServices" ADD "hinovaContactName" VARCHAR(255);
---
## FRONTEND
- npm install
- npm run build
---
## PM2
- PM2 RESTART ALL
---
## WHISKEYSBAYLY FIX WHASTAPP NOT CONNECTION
- npm i @whiskeysockets/baileys@6.0.0
---

## MAKE REVISION ON[BAYLES AND WHASTAPP CONNECTIONS]
- BAYLES ERROS
- MESSAGE VEY SLOW

---

1- Primeiro acessar a pasta da libs com usuario deploy

/home/deploy/empresa/backend/src/libs


2-Segundo editar o arquivo wbots


no version voce vai acrencentar  [2,2431,1],

3- rodar o npm run build e depois pm2 restart all.
