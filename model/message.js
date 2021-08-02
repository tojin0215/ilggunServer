export default (sequelize, DataTypes) => {
    return sequelize.define('message', {
        ind :{ type: DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
        type: { type: DataTypes.INTEGER },
        system: { type: DataTypes.INTEGER },

        f : {type:DataTypes.STRING(50)},
        f_name : {type:DataTypes.STRING(50)},
        t : {type:DataTypes.STRING(50)},
        t_name : {type:DataTypes.STRING(50)},
        message : {type:DataTypes.STRING(50)},
        time : {type:DataTypes.STRING(50)},
        r : { type: DataTypes.INTEGER },
        ft : { type: DataTypes.INTEGER },
    },{
      timestamps:false
    });
}