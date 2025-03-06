import * as Yup from "yup";

import AppError from "../../errors/AppError";
import ScheduleService from "../../models/ScheduleService";

interface Request {
  body: string;
  sendAt: string;
  contactId: number | string;
  companyId: number | string;
  userId?: number | string;
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

const CreateService = async ({
  body,
  sendAt,
  contactId,
  companyId,
  userId,
  link,
  mediaPath,
  mediaName,
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
}: Request): Promise<ScheduleService> => {
  const schema = Yup.object().shape({
    body: Yup.string().required().min(5),
    sendAt: Yup.string().required()
  });

  try {
    await schema.validate({ body, sendAt });
  } catch (err: any) {
    throw new AppError(err.message);
  }

  const schedule = await ScheduleService.create(
    {
      body,
      sendAt,
      contactId,
      companyId,
      userId,
      link,
      mediaPath,
      mediaName,
      status: 'PENDENTE',
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
    }
  );

  await schedule.reload();

  return schedule;
};

export default CreateService;
