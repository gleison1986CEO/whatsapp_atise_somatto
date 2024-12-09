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
import Contact from "./Contact";
import FilterNameTicket from "./FilterNameTicket";
@Table
class TicketScheduleService extends Model<TicketScheduleService> {
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

  @Column
  sendAt: Date;

  @Column
  sentAt: Date;

  @ForeignKey(() => Contact)
  @Column
  contactId: number;

  @Column
  ticketId: number;

  @Column
  userId: number;

  @Column
  companyId: number;

  @Column
  status: string;

  @ForeignKey(() => FilterNameTicket)
  @Column
  filterId: number;

  @BelongsTo(() => FilterNameTicket)
  filterNameTicket: FilterNameTicket;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

export default TicketScheduleService;
