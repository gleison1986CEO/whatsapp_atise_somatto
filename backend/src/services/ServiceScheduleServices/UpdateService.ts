import * as Yup from "yup";

import AppError from "../../errors/AppError";
import ScheduleService from "../../models/ScheduleService";
import ShowService from "./ShowService";

interface ScheduleData {
  id?: number;
  body?: string;
  sendAt?: string;
  sentAt?: string;
  contactId?: number;
  companyId?: number;
  ticketId?: number;
  userId?: number;
  link?: string;
  mediaPath?: string;
  mediaName?: string;
  filterId?: string;
  hinovaContactName?: string;
  CsvUrl?: string;
  perDay?: string;
  betweenDays?: string;
  periodStart?: string;
  periodEnd?: string;
  sendAtStart?: string;
  sendAtEnd?: string;
  fila?: string;
  atendente?: string;
  para_atendimento?: string;
  qtdHours?: string;
}

interface Request {
  scheduleData: ScheduleData;
  id: string | number;
  companyId: number;
}

const UpdateUserService = async ({
  scheduleData,
  id,
  companyId
}: Request): Promise<ScheduleService | undefined> => {
  const schedule = await ShowService(id, companyId);

  if (schedule?.companyId !== companyId) {
    throw new AppError("Não é possível alterar registros de outra empresa");
  }

  const schema = Yup.object().shape({
    body: Yup.string().min(5)
  });

  const {
    body,
    sendAt,
    sentAt,
    contactId,
    ticketId,
    userId,
    link,
    mediaPath,
    mediaName,
    filterId,
    hinovaContactName,
    CsvUrl,
    perDay,
    betweenDays,
    periodStart,
    periodEnd,
    sendAtStart,
    sendAtEnd,
    fila,
    atendente,
    para_atendimento,
    qtdHours
  } = scheduleData;

  try {
    await schema.validate({ body });
  } catch (err: any) {
    throw new AppError(err.message);
  }

  await schedule.update({
    body,
    sendAt,
    sentAt,
    contactId,
    ticketId,
    userId,
    link,
    mediaPath,
    mediaName,
    filterId,
    hinovaContactName,
    CsvUrl,
    perDay,
    betweenDays,
    periodStart,
    periodEnd,
    sendAtStart,
    sendAtEnd,
    fila,
    atendente,
    para_atendimento,
    qtdHours
  });

  await schedule.reload();
  return schedule;
};

export default UpdateUserService;
