import * as Yup from "yup";

import FilterNameTicket from "../../models/FilterNameTicket";

interface Request {
  filterName: string;
}

const CreateFilterNameTicketService = async ({
  filterName
}: Request): Promise<FilterNameTicket> => {


  const schedule = await FilterNameTicket.create(
    {
      filterName
    }
  );

  await schedule.reload();

  return schedule;
};

export default CreateFilterNameTicketService;
