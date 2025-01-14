const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');

const app = express();
const port = 5252;

app.use(cors());
app.use(express.json());

const sequelize = new Sequelize('checklist', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

sequelize.authenticate().then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
}).catch((error) => {
    console.error('Não foi possível estabelecer uma conexão com o banco de dados:', error);
});








app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Exemplo de aplicativo escutando na porta ${port}`);
});