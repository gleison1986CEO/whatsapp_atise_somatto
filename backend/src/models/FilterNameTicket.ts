import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
  HasMany
} from "sequelize-typescript";
import TicketScheduleService from "./TicketScheduleService";
@Table
class FilterNameTicket extends Model<FilterNameTicket> {

  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  filterName: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @HasMany(() => TicketScheduleService, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
    hooks: true
  })
  ticketScheduleService: TicketScheduleService[];

}

export default FilterNameTicket;
