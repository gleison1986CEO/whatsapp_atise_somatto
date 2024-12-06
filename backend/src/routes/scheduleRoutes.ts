import express from "express";
import isAuth from "../middleware/isAuth";

import * as ScheduleController from "../controllers/ScheduleController";
import * as ServiceScheduleController from "../controllers/ServiceScheduleController";
import * as TicketServiceScheduleController from "../controllers/TicketServiceScheduleController";
import * as AnnouncementController from "../controllers/AnnouncementController";
import routes from "./announcementRoutes";
import multer from "multer";
import uploadConfig from "../config/upload";

const upload = multer(uploadConfig);


const scheduleRoutes = express.Router();

scheduleRoutes.get("/schedules", isAuth, ScheduleController.index);

scheduleRoutes.post("/schedules", isAuth, ScheduleController.store);

scheduleRoutes.put("/schedules/:scheduleId", isAuth, ScheduleController.update);

scheduleRoutes.get("/schedules/:scheduleId", isAuth, ScheduleController.show);

scheduleRoutes.delete("/schedules/:scheduleId", isAuth, ScheduleController.remove);

// SERVICES SCHEDULES

scheduleRoutes.get("/service_schedules", isAuth, ServiceScheduleController.index);

scheduleRoutes.post("/service_schedules", isAuth, ServiceScheduleController.store);

scheduleRoutes.put("/service_schedules/:scheduleId", isAuth, ServiceScheduleController.update);

scheduleRoutes.get("/service_schedules/:scheduleId", isAuth, ServiceScheduleController.show);

scheduleRoutes.post("/service_schedules/validate", isAuth, ServiceScheduleController.validate);

scheduleRoutes.delete("/service_schedules/:scheduleId", isAuth, ServiceScheduleController.remove);


routes.post(
  "/service_schedules/:id/media-upload",
  isAuth,
  upload.array("file"),
  ServiceScheduleController.mediaUpload
);

routes.delete(
  "/service_schedules/:id/media-upload",
  isAuth,
  ServiceScheduleController.deleteMedia
);

// TICKET SERVICES SCHEDULES

scheduleRoutes.get("/ticket_service_schedules", isAuth, TicketServiceScheduleController.index);

scheduleRoutes.post("/ticket_service_schedules", isAuth, TicketServiceScheduleController.store);

scheduleRoutes.post("/ticket_service_schedules_ticket", isAuth, TicketServiceScheduleController.storeTicket);
scheduleRoutes.get("/ticket_service_schedules_ticket", isAuth, TicketServiceScheduleController.getTickets);

scheduleRoutes.put("/ticket_service_schedules/:scheduleId", isAuth, TicketServiceScheduleController.update);

scheduleRoutes.get("/ticket_service_schedules/:scheduleId", isAuth, TicketServiceScheduleController.show);

scheduleRoutes.delete("/ticket_service_schedules/:scheduleId", isAuth, TicketServiceScheduleController.remove);


routes.post(
  "/ticket_service_schedules/:id/media-upload",
  isAuth,
  upload.array("file"),
  TicketServiceScheduleController.mediaUpload
);

routes.delete(
  "/ticket_service_schedules/:id/media-upload",
  isAuth,
  TicketServiceScheduleController.deleteMedia
);

export default scheduleRoutes;
