export default (sequelize, DataTypes) => {
    return sequelize.define('timelog', {
        bang : {type:DataTypes.STRING(50)},
        workername : {type:DataTypes.STRING(50)},

        year : { type:DataTypes.INTEGER },
        month : { type:DataTypes.INTEGER },
        date : { type:DataTypes.INTEGER },

        goto : {type:DataTypes.STRING(50)},
        leavee : {type:DataTypes.STRING(50)}
    },{
      timestamps:false
    });
}