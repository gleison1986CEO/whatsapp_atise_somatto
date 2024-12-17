import TicketScheduleService from "../../models/TicketScheduleService";
import AppError from "../../errors/AppError";
import FilterNameTicket from "../../models/FilterNameTicket";

const DeleteTicketService = async (id: string | number): Promise<void> => {
  const schedule = await FilterNameTicket.findOne({
    where: { id }
  });

  if (!schedule) {
    throw new AppError("ERR_NO_SCHEDULE_FOUND", 404);
  }

  await schedule.destroy();
};

export default DeleteTicketService;
