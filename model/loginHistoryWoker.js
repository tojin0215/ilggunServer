export default (sequelize, DataTypes) => {
  return sequelize.define('loginHistory', {
    wokername: { type: DataTypes.STRING(50) },
    login_time: { type: DataTypes.STRING(100) },
    bang: { type: DataTypes.STRING(50) }

  }, {
    timestamps: false
  });
}