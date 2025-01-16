//importando as bibliotecas
const express = require('express');
const cors = require('cors');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const { sequelize, syncDatabase } = require('./db');
const { Task } = require('./db');


//configurações
const app = express();
const port = 3031;


app.use(cors());

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: true }));


sequelize.authenticate().then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
}).catch((error) => {
    console.error('Não foi possível estabelecer uma conexão com o banco de dados:', error);
});

const hbs = exphbs.create({
    helpers: {
        eq: function (a, b) {
            return a === b;
        }
    }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

//fim das configurações

//rotas

app.get('/delete/:id', (req, res) => {
    const taskId = req.params.id;
    Task.destroy({ where: { id: taskId } }).then(() => {
        res.redirect('/');
    }).catch(err => {
        console.error(err);
        res.status(500).send('Erro ao excluir tarefa');
    });
});

app.post('/update-status/:id', (req, res) => {
    const taskId = req.params.id;
    const newStatus = req.body.status === 'completo' ? 'completo' : 'pendente';

    Task.update({ status: newStatus }, { where: { id: taskId } })
        .then(([updated]) => {
            if (updated) {
                res.redirect('/');
            } else {
                res.status(404).send('Tarefa não encontrada');
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Erro ao atualizar o status');
        });
});




app.get('/editar-tarefa/:id', async (req, res) => {
    const taskId = req.params.id;
    try {
        const task = await Task.findByPk(taskId);

        if (task) {
            res.render('edit', { task });
        } else {
            res.status(404).send('Tarefa não encontrada');
        }
    } catch (error) {
        console.error('Erro ao buscar tarefa:', error);
        res.status(500).send('Erro ao buscar tarefa');
    }
});

app.post('/atualizar-tarefa/:id', async (req, res) => {
    console.log(req.body);
    const taskId = req.params.id;
    const { name, description } = req.body;

    try {
        const task = await Task.findByPk(taskId);

        if (task) {
            task.name = name;
            task.description = description;
            await task.save();
            res.redirect('/');
        } else {
            res.status(404).send('Tarefa não encontrada');
        }
    } catch (error) {
        console.error('Erro ao atualizar tarefa:', error);
        res.status(500).send('Erro ao atualizar tarefa');
    }
});






app.get('/', (req, res) => {
    Task.findAll({ order: [['id', 'DESC']] }).then(tasks => {
        const tasksData = tasks.map(task => task.toJSON());
        res.render('home', { tarefas: tasksData });
    }).catch(err => {
        console.error(err);
        res.status(500).send('Erro ao buscar tarefas');
    });
});



app.get('/cadastro', (req, res) => {
    res.render('form');
});

app.post('/cadastrotask', async (req, res) => {
    const { name, description } = req.body;
    const task = await Task.create({ name, description });
    res.redirect('/');
});


//config do servidor

syncDatabase();
app.listen(port, () => {
    console.log(`Exemplo de aplicativo escutando na porta ${port}`);
});
