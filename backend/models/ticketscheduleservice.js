'use strict';
module.exports = (sequelize, DataTypes) => {
  const TicketScheduleService = sequelize.define('TicketScheduleService', {
    id: DataTypes.NUMBER
  }, {});
  TicketScheduleService.associate = function(models) {
    // associations can be defined here
  };
  return TicketScheduleService;
};