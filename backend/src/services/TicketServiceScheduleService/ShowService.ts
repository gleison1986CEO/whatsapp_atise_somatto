import TicketScheduleService from "../../models/TicketScheduleService";
import AppError from "../../errors/AppError";
import Contact from "../../models/Contact";
import User from "../../models/User";
import FilterNameTicket from "../../models/FilterNameTicket";

const ScheduleService = async (id: string | number): Promise<TicketScheduleService> => {
  const schedule = await TicketScheduleService.findByPk(id, {
    include: [
      { model: FilterNameTicket, as: "filterNameTicket", attributes: ["filterName"] }
    ]
  });

  if (!schedule) {
    throw new AppError("ERR_NO_SCHEDULE_FOUND", 404);
  }

  return schedule;
};

export default ScheduleService;
