export default (sequelize, DataTypes) => {
    return sequelize.define('overtimework', {
        business : {type:DataTypes.STRING(50)},
        workername : {type:DataTypes.STRING(50)},

        year : { type:DataTypes.INTEGER },
        month : { type:DataTypes.INTEGER },
        date : { type:DataTypes.INTEGER },

        day : {type:DataTypes.STRING(50)},
        time : {type:DataTypes.STRING(50)},
        subt : { type:DataTypes.FLOAT },
        startdate : {type:DataTypes.STRING(50), defaultValue: '2020/01/01'},
    },{
      timestamps:false
    });
}