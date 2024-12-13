import * as Yup from "yup";

import AppError from "../../errors/AppError";
import TicketScheduleService from "../../models/TicketScheduleService";
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
  filterId?: number
}

interface Request {
  scheduleData: ScheduleData;
  id: string | number;
  companyId: number;
  filterId: number;
}

const UpdateUserService = async ({
  scheduleData,
  id,
  companyId
}: Request): Promise<TicketScheduleService | undefined> => {
  const schedule = await ShowService(id);

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
    filterId
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
    filterId
  });

  await schedule.reload();
  return schedule;
};

export default UpdateUserService;
