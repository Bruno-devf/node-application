const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

const sequelize = new Sequelize('checklist', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});


const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true,
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                user.password = await bcrypt.hash(user.password, 10);
            }
        },
        beforeUpdate: async (user) => {
            if (user.password) {
                user.password = await bcrypt.hash(user.password, 10);
            }
        }
    }
});

User.prototype.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

const Checklist = sequelize.define('Checklist', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    }
}, {
    timestamps: true
});

const Task = sequelize.define('Task', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: true
});

const ChecklistTask = sequelize.define('ChecklistTask', {
    checklist_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Checklists',
            key: 'id'
        }
    },
    task_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Tasks',
            key: 'id'
        }
    }
}, {
    timestamps: false
});


User.hasMany(Checklist);
Checklist.belongsTo(User);

Checklist.belongsToMany(Task, { through: 'ChecklistTask' });
Task.belongsToMany(Checklist, { through: 'ChecklistTask' });


const syncDatabase = async () => {
    try {
        await sequelize.sync();
        console.log('Banco de dados sincronizado!');
    } catch (error) {
        console.error('Erro ao criar as tabelas:', error);
    }
};

module.exports = { sequelize, syncDatabase, User, Checklist, Task, ChecklistTask };
