const axios = require('axios');
const restify = require('restify');
const errs  = require('restify-errors');

const server = restify.createServer({
    name:'quarentine',
    version:'1.0.0'
});

const knex = require('knex')({
  client: 'mysql',
  connection: {
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'db',
    port: 3306
    }
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());


server.listen(8081, function() {
    console.log('%s a página está dispobnível na porta %s', server.name,server.url);
});
  
  server.get('/', restify.plugins.serveStatic({
    directory: './dist',
    file: 'index.html'
  }));
  
  server.get('/read', function (req, res, next) {
    knex('rest').then((dados)=>{
      res.send(dados)
    },next)
    return next();
  });
  
  server.post('/create', function (req, res, next) {
    knex('rest')
      .insert(req.body)
      .then((dados)=>{
      res.send(dados)
    },next)
  
    return next();
  });
  
  server.get('/show/:id', function (req, res, next) {
    const{id} = req.params
  
    knex('rest')
      .where('id', id)
      .first()
      .then((dados)=>{
        if(!dados) return res.send(new errs.BadRequestError(`Id ${id}não encontrado`))
      res.send(dados)
    }, next)
    return next();
  });
  
  server.put('/update/:id', function (req, res, next) {
  const{id} = req.params
  
    knex('rest')
      .update(req.body)
      .where('id',id)
      .then((dados)=>{
        if(!dados) return res.send(new errs.BadRequestError(`Id ${id}não encontrado`))
      res.send("Dado atualizado com sucesso")
    },next)
  
    return next();
  });
  
  server.del('/delete/:id', function (req, res, next) {
    const{id} = req.params
      knex('rest')
        .delete()
        .where('id',id)
        .then((dados)=>{
          if(!dados) return res.send(new errs.BadRequestError(`Id ${id} não encontrado`))
        res.send(`Id ${id} deletado com sucesso`)
      },next)
    
      return next();
    });