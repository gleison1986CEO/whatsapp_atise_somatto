import { Op, fn, where, col, Filterable, Includeable } from "sequelize";

import Ticket from "../../models/Ticket";
import User from "../../models/User";
import Contact from "../../models/Contact";

interface Response {
  tickets: Ticket[];
  count: number;
  hasMore: boolean;
}

const ListTicketByUser = async ({ userId }): Promise<Response> => {
  let attributes: any[] = [
    "userId",
    [fn("count", col("Ticket.id")), "QtdAtendimentos"]
  ];

  if (userId != null) {
    attributes.push("lastMessage", "contactId");
  }

  const { count, rows: tickets } = await Ticket.findAndCountAll({
    attributes: attributes,
    where: {
      userId: {
        [Op.ne]: null
      }
    },
    group: userId != null
      ? [
        "Ticket.userId",
        "user.id",
        "user.name",
        "Ticket.lastMessage",
        "Ticket.contactId",
        "contact.id",
        "contact.name"
      ]
      : [
        "Ticket.userId",
        "user.id",
        "user.name"
      ],
    include: userId != null ? [{
      model: User,
      as: "user",
      attributes: ["id", "name"]
    },
    {
      model: Contact,
      as: "contact",
      attributes: ["id", "name"]
    }] : [{
      model: User,
      as: "user",
      attributes: ["id", "name"]
    }],
    distinct: true
  });

  return {
    tickets,
    count,
    hasMore: count > 40
  };
};

export default ListTicketByUser;
