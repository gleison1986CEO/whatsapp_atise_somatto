import { Op, Sequelize } from "sequelize";
import FilterNameTicket from "../../models/FilterNameTicket";

const ListFilterTickets = async () => {
  const data = await FilterNameTicket.findAndCountAll();
  return data;
};

export default ListFilterTickets;
