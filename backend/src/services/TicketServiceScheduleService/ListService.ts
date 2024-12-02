import { Op, Sequelize } from "sequelize";
import Contact from "../../models/Contact";
import TicketScheduleService from "../../models/TicketScheduleService";
import User from "../../models/User";

interface Request {
  searchParam?: string;
  contactId?: number | string;
  userId?: number | string;
  companyId?: number;
  pageNumber?: string | number;
}

interface Response {
  schedules: TicketScheduleService[];
  count: number;
  hasMore: boolean;
}

const ListService = async ({
  searchParam,
  contactId = "",
  userId = "",
  pageNumber = "1",
  companyId
}: Request): Promise<Response> => {
  let whereCondition = {};
  const limit = 20;
  const offset = limit * (+pageNumber - 1);

  if (searchParam) {
    whereCondition = {
      [Op.or]: [
        {
          "$TicketScheduleServices.body$": Sequelize.where(
            Sequelize.fn("LOWER", Sequelize.col("TicketScheduleServices.body")),
            "LIKE",
            `%${searchParam.toLowerCase()}%`
          )
        }
      ],
    }
  }

  if (userId !== "") {
    whereCondition = {
      ...whereCondition,
      userId
    }
  }

  whereCondition = {
    ...whereCondition
  }

  const { count, rows: schedules } = await TicketScheduleService.findAndCountAll({
    where: whereCondition,
    limit,
    offset,
    order: [["createdAt", "DESC"]]
  });

  const hasMore = count > offset + schedules.length;

  return {
    schedules,
    count,
    hasMore
  };
};

export default ListService;
