import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Unique,
  Default,
  HasMany,
  ForeignKey,
  BelongsTo
} from "sequelize-typescript";
import ContactCustomField from "./ContactCustomField";
import Ticket from "./Ticket";
import Company from "./Company";
import Schedule from "./Schedule";

@Table
class Contact extends Model<Contact> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  name: string;

  @AllowNull(false)
  @Unique
  @Column
  number: string;

  @AllowNull(false)
  @Default("")
  @Column
  email: string;

  @Default("")
  @Column
  profilePicUrl: string;

  @Column
  cpf: string;

  @Column
  data_nascimento: string;

  @Column
  rg: string;

  @Column
  cnh: string;

  @Column
  categoria_cnh: string;

  @Column
  data_vencimento_habilitacao: string;

  @Column
  telefone_celular: string;

  @Column
  cep: string;

  @Column
  logradouro: string;

  @Column
  numero: string;

  @Column
  complemento: string;

  @Column
  bairro: string;

  @Column
  cidade: string;

  @Column
  estado: string;

  @Column
  spcSerasa: string;

  @Column
  descricao_tipo_cobranca_recorrente: string;

  @Column
  veiculo_placa_1: string;

  @Column
  veiculo_placa_2: string;

  @Column
  veiculo_placa_3: string;

  @Column
  veiculo_placa_4: string;

  @Column
  veiculo_placa_5: string;
  @Column
  veiculo_placa_6: string;

  @Column
  veiculo_chassi_1: string;
  @Column
  veiculo_chassi_2: string;
  @Column
  veiculo_chassi_3: string;
  @Column
  veiculo_chassi_4: string;
  @Column
  veiculo_chassi_5: string;
  @Column
  veiculo_chassi_6: string;

  @Column
  veiculo_fipe_1: string;
  @Column
  veiculo_fipe_2: string;
  @Column
  veiculo_fipe_3: string;
  @Column
  veiculo_fipe_4: string;
  @Column
  veiculo_fipe_5: string;
  @Column
  veiculo_fipe_6: string;

  @Column
  veiculo_descricao_modelo_1: string;
  @Column
  veiculo_descricao_modelo_2: string;
  @Column
  veiculo_descricao_modelo_3: string;
  @Column
  veiculo_descricao_modelo_4: string;
  @Column
  veiculo_descricao_modelo_5: string;
  @Column
  veiculo_descricao_modelo_6: string;


  @Default(false)
  @Column
  isGroup: boolean;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @HasMany(() => Ticket)
  tickets: Ticket[];

  @HasMany(() => ContactCustomField)
  extraInfo: ContactCustomField[];

  @ForeignKey(() => Company)
  @Column
  companyId: number;

  @BelongsTo(() => Company)
  company: Company;

  @HasMany(() => Schedule, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
    hooks: true
  })
  schedules: Schedule[];
}

export default Contact;
