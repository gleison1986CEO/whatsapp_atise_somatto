import { Request, Response } from "express";
import { getIO } from "../libs/socket";

import AppError from "../errors/AppError";

// import CreateSer

import CreateFilterNameTicketService from "../services/TicketServiceScheduleService/CreateFilterNameTicketService";
import CreateService from "../services/TicketServiceScheduleService/CreateService";
import ListService from "../services/TicketServiceScheduleService/ListService";
import UpdateService from "../services/TicketServiceScheduleService/UpdateService";
import ShowService from "../services/TicketServiceScheduleService/ShowService";
import DeleteService from "../services/TicketServiceScheduleService/DeleteService";

import { head } from "lodash";

import ScheduleService from "../models/TicketScheduleService";
import ListFilterTickets from "../services/TicketServiceScheduleService/ListFilterTickets";

import path from "path";
import fs from "fs";

type IndexQuery = {
  searchParam?: string;
  contactId?: number | string;
  userId?: number | string;
  pageNumber?: string | number;
};

export const index = async (req: Request, res: Response): Promise<Response> => {
  const { userId, pageNumber, searchParam } = req.query as IndexQuery;
  const { companyId } = req.user;

  const { schedules, count, hasMore } = await ListService({
    searchParam,
    userId,
    pageNumber,
    companyId
  });

  return res.json({ schedules, count, hasMore });
};

export const storeTicket = async (req: Request, res: Response): Promise<Response> => {
  const {
    filterName
  } = req.body;

  const schedule = await CreateFilterNameTicketService({
    filterName
  });

  return res.status(200).json(schedule);
};

export const getTickets = async (req: Request, res: Response): Promise<Response> => {

  const schedule = await ListFilterTickets();

  return res.status(200).json(schedule);
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const {
    body,
    sendAt,
    contactId = "null",
    userId,
    link,
    filterId
  } = req.body;
  const { companyId } = req.user;

  const schedule = await CreateService({
    body,
    sendAt,
    contactId,
    companyId,
    userId,
    link,
    filterId
  });

  const io = getIO();
  io.emit("schedule", {
    action: "create",
    schedule
  });

  return res.status(200).json(schedule);
};

export const show = async (req: Request, res: Response): Promise<Response> => {
  const { scheduleId } = req.params;
  // const { companyId } = req.user;

  const schedule = await ShowService(scheduleId);

  return res.status(200).json(schedule);
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  if (req.user.profile !== "admin") {
    throw new AppError("ERR_NO_PERMISSION", 403);
  }

  const { scheduleId } = req.params;
  const scheduleData = req.body;
  const { companyId } = req.user;
  const { filterId } = req.body;

  const schedule = await UpdateService({ scheduleData, id: scheduleId, companyId, filterId });

  const io = getIO();
  io.emit("schedule", {
    action: "update",
    schedule
  });

  return res.status(200).json(schedule);
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { scheduleId } = req.params;
  const { companyId } = req.user;

  await DeleteService(scheduleId, companyId);

  const io = getIO();
  io.emit("schedule", {
    action: "delete",
    scheduleId
  });

  return res.status(200).json({ message: "Schedule deleted" });
};

export const mediaUpload = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  const files = req.files as Express.Multer.File[];
  const file = head(files);

  try {
    const announcement = await ScheduleService.findByPk(id);

    await announcement.update({
      mediaPath: file.filename,
      mediaName: file.originalname
    });
    await announcement.reload();

    const io = getIO();
    io.emit(`schedule`, {
      action: "update",
      record: announcement
    });

    return res.send({ mensagem: "Mensagem enviada" });
  } catch (err: any) {
    throw new AppError(err.message);
  }
};

export const deleteMedia = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;

  try {
    const announcement = await ScheduleService.findByPk(id);
    const filePath = path.resolve("public", announcement.mediaPath);
    const fileExists = fs.existsSync(filePath);
    if (fileExists) {
      fs.unlinkSync(filePath);
    }

    await announcement.update({
      mediaPath: null,
      mediaName: null
    });
    await announcement.reload();

    const io = getIO();
    io.emit(`schedule`, {
      action: "update",
      record: announcement
    });

    return res.send({ mensagem: "Arquivo excluído" });
  } catch (err: any) {
    throw new AppError(err.message);
  }
};
