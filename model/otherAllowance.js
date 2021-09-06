
export default (sequelize, DataTypes) => {
  return sequelize.define('otherAllowance', {
    bang: { type: DataTypes.STRING(200) },
    id: { type: DataTypes.STRING(50), defaultValue: '' },
    year: { type: DataTypes.STRING(50) },
    month: { type: DataTypes.STRING(50) },
    Salary: { type: DataTypes.STRING(200) },

    taxation: { type: DataTypes.STRING(200) },
    t_position: { type: DataTypes.STRING(200) },
    t_bonus: { type: DataTypes.STRING(200) },
    t_extension: { type: DataTypes.STRING(200) },
    t_etc: { type: DataTypes.STRING(200) },

    taxFree: { type: DataTypes.STRING(200) },
    f_meals: { type: DataTypes.STRING(200) },
    f_carMaintenanceFee: { type: DataTypes.STRING(200) },
    f_childcareAllowance: { type: DataTypes.STRING(200) },
  }, {
    timestamps: false
  });
}