import TicketScheduleService from "../../models/TicketScheduleService";
import AppError from "../../errors/AppError";

const DeleteCardService = async (filterId: string): Promise<void> => {
  const schedule = await TicketScheduleService.destroy({
    where: { filterId }
  });

  if (!schedule) {
    throw new AppError("ERR_NO_SCHEDULE_FOUND", 404);
  }
};

export default DeleteCardService;
