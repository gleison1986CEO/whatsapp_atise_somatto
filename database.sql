CREATE TABLE public."TicketScheduleServices" (
	id int4 DEFAULT nextval('"TiketScheduleServices_id_seq"'::regclass) NOT NULL,
	body text NOT NULL,
	status text NULL,
	"mediaPath" text NULL,
	"mediaName" text NULL,
	link text NULL,
	"sendAt" timestamptz NULL,
	"sentAt" timestamptz NULL,
	"contactId" int4 NULL,
	"ticketId" int4 NULL,
	"userId" int4 NULL,
	"companyId" int4 NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	"mediaAudioName" varchar(255) NULL,
	"mediaAudioPath" varchar(255) NULL
);