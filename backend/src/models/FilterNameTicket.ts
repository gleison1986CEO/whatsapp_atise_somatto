import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  UpdatedAt
} from "sequelize-typescript";
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
}

export default FilterNameTicket;
