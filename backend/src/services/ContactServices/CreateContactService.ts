import AppError from "../../errors/AppError";
import Contact from "../../models/Contact";
import ContactCustomField from "../../models/ContactCustomField";

interface ExtraInfo extends ContactCustomField {
  name: string;
  value: string;
}

interface Request {
  name: string;
  number: string;
  email?: string;
  profilePicUrl?: string;
  companyId: number;
  cpf?: string;
  data_nascimento?: string;
  rg?: string;
  cnh?: string;
  categoria_cnh?: string;
  data_vencimento_habilitacao?: string;
  telefone_celular?: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string
  cidade?: string;
  estado?: string;
  spcSerasa?: string;
  descricao_tipo_cobranca_recorrente?: string;
  veiculo_placa_1?: string;
  veiculo_placa_2?: string;
  veiculo_placa_3?: string;
  veiculo_placa_4?: string;
  veiculo_placa_5?: string;
  veiculo_placa_6?: string;
  veiculo_chassi_1?: string;
  veiculo_chassi_2?: string;
  veiculo_chassi_3?: string;
  veiculo_chassi_4?: string;
  veiculo_chassi_5?: string;
  veiculo_chassi_6?: string;
  veiculo_fipe_1?: string;
  veiculo_fipe_2?: string;
  veiculo_fipe_3?: string;
  veiculo_fipe_4?: string;
  veiculo_fipe_5?: string;
  veiculo_fipe_6?: string;
  veiculo_descricao_modelo_1?: string;
  veiculo_descricao_modelo_2?: string;
  veiculo_descricao_modelo_3?: string;
  veiculo_descricao_modelo_4?: string;
  veiculo_descricao_modelo_5?: string;
  veiculo_descricao_modelo_6?: string;
  extraInfo?: ExtraInfo[];
}

const CreateContactService = async ({
  name,
  number,
  email = "",
  cpf = "",
  data_nascimento = "",
  rg = "",
  cnh = "",
  categoria_cnh = "",
  data_vencimento_habilitacao = "",
  telefone_celular = "",
  cep = "",
  logradouro = "",
  numero = "",
  complemento = "",
  bairro = "",
  cidade = "",
  estado = "",
  spcSerasa = "",
  descricao_tipo_cobranca_recorrente = "",
  veiculo_placa_1 = "",
  veiculo_placa_2 = "",
  veiculo_placa_3 = "",
  veiculo_placa_4 = "",
  veiculo_placa_5 = "",
  veiculo_placa_6 = "",
  veiculo_chassi_1 = "",
  veiculo_chassi_2 = "",
  veiculo_chassi_3 = "",
  veiculo_chassi_4 = "",
  veiculo_chassi_5 = "",
  veiculo_chassi_6 = "",
  veiculo_fipe_1 = "",
  veiculo_fipe_2 = "",
  veiculo_fipe_3 = "",
  veiculo_fipe_4 = "",
  veiculo_fipe_5 = "",
  veiculo_fipe_6 = "",
  veiculo_descricao_modelo_1 = "",
  veiculo_descricao_modelo_2 = "",
  veiculo_descricao_modelo_3 = "",
  veiculo_descricao_modelo_4 = "",
  veiculo_descricao_modelo_5 = "",
  veiculo_descricao_modelo_6 = "",
  companyId,
  extraInfo = []
}: Request): Promise<Contact> => {
  const numberExists = await Contact.findOne({
    where: { number, companyId }
  });

  if (numberExists) {
    throw new AppError("ERR_DUPLICATED_CONTACT");
  }

  const contact = await Contact.create(
    {
      name,
      number,
      email,
      cpf,
      data_nascimento,
      rg,
      cnh,
      categoria_cnh,
      data_vencimento_habilitacao,
      telefone_celular,
      cep,
      logradouro,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      spcSerasa,
      descricao_tipo_cobranca_recorrente,
      veiculo_placa_1,
      veiculo_placa_2,
      veiculo_placa_3,
      veiculo_placa_4,
      veiculo_placa_5,
      veiculo_placa_6,
      veiculo_chassi_1,
      veiculo_chassi_2,
      veiculo_chassi_3,
      veiculo_chassi_4,
      veiculo_chassi_5,
      veiculo_chassi_6,
      veiculo_fipe_1,
      veiculo_fipe_2,
      veiculo_fipe_3,
      veiculo_fipe_4,
      veiculo_fipe_5,
      veiculo_fipe_6,
      veiculo_descricao_modelo_1,
      veiculo_descricao_modelo_2,
      veiculo_descricao_modelo_3,
      veiculo_descricao_modelo_4,
      veiculo_descricao_modelo_5,
      veiculo_descricao_modelo_6,
      extraInfo,
      companyId
    },
    {
      include: ["extraInfo"]
    }
  );

  return contact;
};

export default CreateContactService;
