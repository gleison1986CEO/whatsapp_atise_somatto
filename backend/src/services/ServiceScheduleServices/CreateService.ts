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
  periodStart?: string;
  periodEnd?: string;
  sendAtStart?: string;
  sendAtEnd?: string;
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
  periodStart,
  periodEnd,
  sendAtStart,
  sendAtEnd
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
      periodStart,
      periodEnd,
      sendAtStart,
      sendAtEnd
    }
  );

  await schedule.reload();

  return schedule;
};

export default CreateService;
