import TicketScheduleService from "../../models/TicketScheduleService";
import AppError from "../../errors/AppError";

const DeleteService = async (id: string | number, companyId: number): Promise<void> => {
  const schedule = await TicketScheduleService.findOne({
    where: { id }
  });

  if (!schedule) {
    throw new AppError("ERR_NO_SCHEDULE_FOUND", 404);
  }

  await schedule.destroy();
};

export default DeleteService;
