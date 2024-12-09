import { Op, Sequelize, Includeable } from "sequelize";
import Contact from "../../models/Contact";
import TicketScheduleService from "../../models/TicketScheduleService";
import User from "../../models/User";
import FilterNameTicket from "../../models/FilterNameTicket";

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
  let includeCondition: Includeable[];
  let whereCondition = {};
  const limit = 20;
  const offset = limit * (+pageNumber - 1);

  includeCondition = [
    {
      model: FilterNameTicket,
      as: "filterNameTicket",
      attributes: ["id", "filterName"]
    }
  ]

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
    include: includeCondition,
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
