import ScheduleService from "../../models/ScheduleService";
import {Op, Sequelize} from "sequelize";

interface Request {
  createAt?:  string;
  userId?: number | string;
}

const ValidateService = async ({
                                 createAt = "",
                                 userId = "",
                               }: Request): Promise<any> => {

  const sendData = await ScheduleService.findAll({
    attributes: [
      [Sequelize.literal(`SUM(CASE WHEN EXTRACT(HOUR FROM "sendAt") < 12 THEN 1 ELSE 0 END)`), "manha"],
      [Sequelize.literal(`SUM(CASE WHEN EXTRACT(HOUR FROM "sendAt") >= 12 THEN 1 ELSE 0 END)`), "tarde"],
    ],
    where: {
      [Op.and]: [
        Sequelize.where(Sequelize.fn('DATE', Sequelize.col('sendAt')), createAt),  // Comparando apenas a data
        { userId: userId }
      ]
    }
  });

  return sendData;
};

export default ValidateService;
