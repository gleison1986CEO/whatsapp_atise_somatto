import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  BelongsTo,
  ForeignKey
} from "sequelize-typescript";
import Company from "./Company";
import Contact from "./Contact";
import Ticket from "./Ticket";
import User from "./User";

@Table
class ScheduleService extends Model<ScheduleService> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column(DataType.TEXT)
  body: string;

  @Column(DataType.TEXT)
  mediaName: string;

  @Column(DataType.TEXT)
  mediaPath: string;

  @Column(DataType.TEXT)
  link: string;

  @Column(DataType.DATE)
  sendAt: Date;

  @Column(DataType.DATE)
  sentAt: Date;

  @Column(DataType.INTEGER)
  contactId: number;

  @ForeignKey(() => Ticket)
  @Column(DataType.INTEGER)
  ticketId: number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  userId: number;

  @ForeignKey(() => Company)
  @Column(DataType.INTEGER)
  companyId: number;

  @Column(DataType.STRING)
  status: string;

  @Column(DataType.STRING)
  hinovaContactName: string;

  @Column(DataType.STRING)
  CsvUrl: string;

  @Column(DataType.STRING)
  perDay: string;

  @Column(DataType.STRING)
  betweenDays: string;

  @Column(DataType.STRING)
  periodStart: string;

  @Column(DataType.STRING)
  periodEnd: string;

  @Column(DataType.STRING)
  fila: string;

  @Column(DataType.STRING)
  atendente: string;

  @Column(DataType.INTEGER)
  para_atendimento: number;

  @Column(DataType.STRING)
  sendAtStart: string;

  @Column(DataType.STRING)
  sendAtEnd: string;

  @Column(DataType.STRING)
  qtdHours: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @BelongsTo(() => Contact, "contactId")
  contact: Contact;

  @BelongsTo(() => Ticket)
  ticket: Ticket;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Company)
  company: Company;
}
export default ScheduleService;
