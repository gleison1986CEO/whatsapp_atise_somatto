import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return Promise.all([
      queryInterface.addColumn("Contacts", "cpf", {
        type: DataTypes.STRING,
        allowNull: true
      }),
      queryInterface.addColumn("Contacts", "data_nascimento", {
        type: DataTypes.STRING,
        allowNull: true
      }),
      queryInterface.addColumn("Contacts", "rg", {
        type: DataTypes.STRING,
        allowNull: true
      }),
      queryInterface.addColumn("Contacts", "cnh", {
        type: DataTypes.STRING,
        allowNull: true
      }),
      queryInterface.addColumn("Contacts", "categoria_cnh", {
        type: DataTypes.STRING,
        allowNull: true
      }),
      queryInterface.addColumn("Contacts", "data_vencimento_habilitacao", {
        type: DataTypes.STRING,
        allowNull: true
      }),
      queryInterface.addColumn("Contacts", "telefone_celular", {
        type: DataTypes.STRING,
        allowNull: true
      }),
      queryInterface.addColumn("Contacts", "cep", {
        type: DataTypes.STRING,
        allowNull: true
      }),
      queryInterface.addColumn("Contacts", "logradouro", {
        type: DataTypes.STRING,
        allowNull: true
      }),
      queryInterface.addColumn("Contacts", "numero", {
        type: DataTypes.STRING,
        allowNull: true
      }),
      queryInterface.addColumn("Contacts", "complemento", {
        type: DataTypes.STRING,
        allowNull: true
      }),
      queryInterface.addColumn("Contacts", "bairro", {
        type: DataTypes.STRING,
        allowNull: true
      }),
      queryInterface.addColumn("Contacts", "cidade", {
        type: DataTypes.STRING,
        allowNull: true
      }),
      queryInterface.addColumn("Contacts", "estado", {
        type: DataTypes.STRING,
        allowNull: true
      }),
      queryInterface.addColumn("Contacts", "spcSerasa", {
        type: DataTypes.STRING,
        allowNull: true
      }),
      queryInterface.addColumn("Contacts", "descricao_tipo_cobranca_recorrente", {
        type: DataTypes.STRING,
        allowNull: true
      }), queryInterface.addColumn("Contacts", "veiculo_placa_1", {
        type: DataTypes.STRING,
        allowNull: true
      }), queryInterface.addColumn("Contacts", "veiculo_placa_2", {
        type: DataTypes.STRING,
        allowNull: true
      }), queryInterface.addColumn("Contacts", "veiculo_placa_3", {
        type: DataTypes.STRING,
        allowNull: true
      }), queryInterface.addColumn("Contacts", "veiculo_placa_4", {
        type: DataTypes.STRING,
        allowNull: true
      }), queryInterface.addColumn("Contacts", "veiculo_placa_5", {
        type: DataTypes.STRING,
        allowNull: true
      }), queryInterface.addColumn("Contacts", "veiculo_placa_6", {
        type: DataTypes.STRING,
        allowNull: true
      }),
      queryInterface.addColumn("Contacts", "veiculo_chassi_1", {
        type: DataTypes.STRING,
        allowNull: true
      }), queryInterface.addColumn("Contacts", "veiculo_chassi_2", {
        type: DataTypes.STRING,
        allowNull: true
      }), queryInterface.addColumn("Contacts", "veiculo_chassi_3", {
        type: DataTypes.STRING,
        allowNull: true
      }), queryInterface.addColumn("Contacts", "veiculo_chassi_4", {
        type: DataTypes.STRING,
        allowNull: true
      }), queryInterface.addColumn("Contacts", "veiculo_chassi_5", {
        type: DataTypes.STRING,
        allowNull: true
      }), queryInterface.addColumn("Contacts", "veiculo_chassi_6", {
        type: DataTypes.STRING,
        allowNull: true
      }),
      queryInterface.addColumn("Contacts", "veiculo_fipe_1", {
        type: DataTypes.STRING,
        allowNull: true
      }),
      queryInterface.addColumn("Contacts", "veiculo_fipe_2", {
        type: DataTypes.STRING,
        allowNull: true
      }),
      queryInterface.addColumn("Contacts", "veiculo_fipe_3", {
        type: DataTypes.STRING,
        allowNull: true
      }),
      queryInterface.addColumn("Contacts", "veiculo_fipe_4", {
        type: DataTypes.STRING,
        allowNull: true
      }),
      queryInterface.addColumn("Contacts", "veiculo_fipe_5", {
        type: DataTypes.STRING,
        allowNull: true
      }),
      queryInterface.addColumn("Contacts", "veiculo_fipe_6", {
        type: DataTypes.STRING,
        allowNull: true
      }),
      queryInterface.addColumn("Contacts", "veiculo_descricao_modelo_1", {
        type: DataTypes.STRING,
        allowNull: true
      }),
      queryInterface.addColumn("Contacts", "veiculo_descricao_modelo_2", {
        type: DataTypes.STRING,
        allowNull: true
      }),
      queryInterface.addColumn("Contacts", "veiculo_descricao_modelo_3", {
        type: DataTypes.STRING,
        allowNull: true
      }),
      queryInterface.addColumn("Contacts", "veiculo_descricao_modelo_4", {
        type: DataTypes.STRING,
        allowNull: true
      }),
      queryInterface.addColumn("Contacts", "veiculo_descricao_modelo_5", {
        type: DataTypes.STRING,
        allowNull: true
      }),
      queryInterface.addColumn("Contacts", "veiculo_descricao_modelo_6", {
        type: DataTypes.STRING,
        allowNull: true
      })
    ]);
  },

  down: (queryInterface: QueryInterface) => {
    return Promise.all([
      queryInterface.removeColumn("Contacts", "cpf"),
      queryInterface.removeColumn("Contacts", "data_nascimento"),
      queryInterface.removeColumn("Contacts", "rg"),
      queryInterface.removeColumn("Contacts", "cnh"),
      queryInterface.removeColumn("Contacts", "categoria_cnh"),
      queryInterface.removeColumn("Contacts", "data_vencimento_habilitacao"),
      queryInterface.removeColumn("Contacts", "telefone_celular"),
      queryInterface.removeColumn("Contacts", "cep"),
      queryInterface.removeColumn("Contacts", "logradouro"),
      queryInterface.removeColumn("Contacts", "numero"),
      queryInterface.removeColumn("Contacts", "complemento"),
      queryInterface.removeColumn("Contacts", "bairro"),
      queryInterface.removeColumn("Contacts", "cidade"),
      queryInterface.removeColumn("Contacts", "estado"),
      queryInterface.removeColumn("Contacts", "spcSerasa"),
      queryInterface.removeColumn("Contacts", "descricao_tipo_cobranca_recorrente"),
      queryInterface.removeColumn("Contacts", "veiculo_placa_1"),
      queryInterface.removeColumn("Contacts", "veiculo_placa_2"),
      queryInterface.removeColumn("Contacts", "veiculo_placa_3"),
      queryInterface.removeColumn("Contacts", "veiculo_placa_4"),
      queryInterface.removeColumn("Contacts", "veiculo_placa_5"),
      queryInterface.removeColumn("Contacts", "veiculo_placa_6"),
      queryInterface.removeColumn("Contacts", "veiculo_chassi_1"),
      queryInterface.removeColumn("Contacts", "veiculo_chassi_2"),
      queryInterface.removeColumn("Contacts", "veiculo_chassi_3"),
      queryInterface.removeColumn("Contacts", "veiculo_chassi_4"),
      queryInterface.removeColumn("Contacts", "veiculo_chassi_5"),
      queryInterface.removeColumn("Contacts", "veiculo_chassi_6"),
      queryInterface.removeColumn("Contacts", "veiculo_fipe_1"),
      queryInterface.removeColumn("Contacts", "veiculo_fipe_2"),
      queryInterface.removeColumn("Contacts", "veiculo_fipe_3"),
      queryInterface.removeColumn("Contacts", "veiculo_fipe_4"),
      queryInterface.removeColumn("Contacts", "veiculo_fipe_5"),
      queryInterface.removeColumn("Contacts", "veiculo_fipe_6"),
      queryInterface.removeColumn("Contacts", "veiculo_descricao_modelo_1"),
      queryInterface.removeColumn("Contacts", "veiculo_descricao_modelo_2"),
      queryInterface.removeColumn("Contacts", "veiculo_descricao_modelo_3"),
      queryInterface.removeColumn("Contacts", "veiculo_descricao_modelo_4"),
      queryInterface.removeColumn("Contacts", "veiculo_descricao_modelo_5"),
      queryInterface.removeColumn("Contacts", "veiculo_descricao_modelo_6")
    ]);
  }
};
