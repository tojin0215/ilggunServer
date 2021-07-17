export default (sequelize, DataTypes) => {
    return sequelize.define('business', {
        id : { type:DataTypes.STRING(50) },
        name : { type:DataTypes.STRING(50) },
        bname : { type:DataTypes.STRING(50), primaryKey:true, allowNull:false },
        bnumber : { type:DataTypes.STRING(50) },
        bphone : { type:DataTypes.STRING(50) },
        baddress : { type:DataTypes.STRING(50) },
        stamp: { type: DataTypes.INTEGER },
        fivep: { type: DataTypes.INTEGER, defaultValue: 0 },
    },{
      timestamps:false
    });
}