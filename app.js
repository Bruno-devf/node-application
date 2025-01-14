const express = require('express');
const cors = require('cors');
const handlebars = require('express-handlebars');
const { sequelize, syncDatabase } = require('./db');


const app = express();
const port = 3031;


app.use(cors());
app.use(express.json());


sequelize.authenticate().then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
}).catch((error) => {
    console.error('Não foi possível estabelecer uma conexão com o banco de dados:', error);
});


app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', './views');



app.get('/user', (req, res) => {
    res.render('form');
});



syncDatabase();
app.listen(port, () => {
    console.log(`Exemplo de aplicativo escutando na porta ${port}`);
});
