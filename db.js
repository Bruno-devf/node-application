const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('checklist', 'root', 'coxinha2007.', {
    host: 'localhost',
    dialect: 'mysql'
});


const Task = sequelize.define('task', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('completo', 'pendente'),
        allowNull: false,
        defaultValue: 'pendente'
    }
});



const syncDatabase = async () => {
    try {
        await sequelize.sync();
        console.log('Banco de dados sincronizado!');
    } catch (error) {
        console.error('Erro ao criar as tabelas:', error);
    }
};

module.exports = { sequelize, syncDatabase, Task };
