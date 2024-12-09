import { Op, Sequelize } from "sequelize";
import FilterNameTicket from "../../models/FilterNameTicket";
import TicketScheduleService from "../../models/TicketScheduleService";

const ListFilterTickets = async () => {
  const data = await FilterNameTicket.findAndCountAll({
    include: [{ model: TicketScheduleService, as: "ticketScheduleService" }]
  });
  return data;
};

export default ListFilterTickets;
