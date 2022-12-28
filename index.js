const Sequelize = require('sequelize')
const { DataTypes , Op } = Sequelize; // Op sao operadores logicos
const bcrypt = require('bcrypt')
const zlib = require('zlib')

// --------------- CONEXAO COM O BANCO DE DADOS ---------------------- //
const sequelize = new Sequelize('projeto-basico-sequelize','root','',{
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    define: {
        freezeTableName: true
    } // Podemos passar as opcoes do terceiro argumento da funcao define diretamente por aqui para nao precisar especificar para todas as tabela
})
/*
// Fazendo isso nao precisamos fazer o sync para cada model que criarmos
//sequelize.sync({ alter: true })
// Isso aqui server para dropar todas as tables que terminem com _test do banco
//sequelize.drop({match: /_test$/})

// ---------------------- DEFINICAO DE UMA MODEL, OU TABELA NO BANCO ---------------------- //
// Pesquisar na documentacao todas as validacoes que sao possiveis
const Users = sequelize.define('user', {
    // Podemos definir nossa primaryKey manualmente como foi feito aqui mas por default o sequelize adiciona uma colina chama id em todas as tabelas como primarykey
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING
    },
    age: {
        type: DataTypes.INTEGER,
        defaultValue: 21
    },
    WittCodeRocks: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, 
{
    freezeTableName: true, //Naturalmete o sequelize pluraliza o nome da tabela, 
    //por exemplo no argumento da funcao define passamos user, caso essa opcao nao 
    //for explicitada ou estiver com false, o nome d atable ano banco sera users.
    timestamps: false, // Nao adiciona as colunas createdAt e updatedAt automaticamente na tabela do banco
})

*/

// ---------------------- DIFERENTES FORMA DE INSERIR REGISTROS NA TABELA CRIADA ---------------------- //

// Esse eh o codigo para sincronizar as models do sequelize com o banco de dados
// a opcao force: true, exclui as tabelas do banco com o nome da que estamos querendo adicionar e a adiciona
// a opcao alter: true, altera a tabela com o mesmo nome da que estamos sincronizando fazendo as modificacoes necessarias
// por default o sequelize soh cria ou altera uma tabela se nao existir uma com o mesmo nome no banco\
/*
Users.sync({ alter: true }).then(()=>{
    console.log('Table and model synced succesfully!')
    /*
    const user = Users.build({username: 'gabriel', password: '123', age: '22', WittCodeRocks: true}) // Aqui criamos uma instancia da model Users mas nao salvamos ainda na base
    user.username = 'soccer' // Podemos mudar propriedades e valores antes de salvar
    return user.save() // Essa eh a funcao que salva no banco de fato o novo objeto user
    */
    //utilizar essa forma de salvar no banco por vezes pode ser trabalhoso, por isso temos tambem o metodo .create()
    /*
    return Users.create({
        username: 'WittCode',
        password: 'subscribe',
        age: 25,
        WittCodeRocks: false
    })
    // O data que retorna no .then() do crete e um objeto javascript por isso podemos aplicar o .toJSON() direto nele, o que nao acontece no .bulkCreate()
    
    // Podemos acrescentar mais de um objeto de uma vez utilizando a funcao .bulkCreate() e passando um vetor com os objetos a serema gravados na base
    // O bulkCrete nao eh uma boa opcao quando temos validacoes que sao feitas utilizando o sequelize pq ele nao valida cada um dos dados enviados, a nao ser que explicitemos essa opcao
    return Users.bulkCreate([
        {
            username: 'Tom',
            password: 'like',
            age: 25,
            WittCodeRocks: false
        },
        {
            username: 'Mike',
            password: '123231',
            age: 31,
        }
    ], {validate: true}) // Assim habilitamos as validacoes no bulkCreate() mas isso nao eh eficiente do ponto de vista de recursos
}).then((data)=>{ // O data que retorna do .bulkCreate() eh um vetor de objetos, por isso temos que fazer um loop e aplicar o .toJSON() em cada elemento do vetor
    //data.decrement({age: 2}) // Podemos somar ou subtrair valores de campos numericos .decrement() ou .increment(), podemos fazer mais de um campo de uma vez por acrescentar o campo desejado no objeto de argumento
    data.forEach((element)=>{

        console.log(element.toJSON())
    })
    /*
    data.username = 'pizza' // Podemos alterar parametros do objeto que esta sendo incluido no .then() do create e assim ele ja adiciona alterado quando damos o .save()
    data.age = 28
    return data.save({fields: ['age']})  // o .save() tambem e uma funcao assincrona por isso tambem precisa do seu .then()
                                        // Podemos tambem especificar para o save os campos que queremos modificar dentro do .then() caso queiramos que apenas uma modificacao seja aplicada ao objeto
    //return data.destroy() // podemos usar o .destroy() para eliminar o objeto e nao acrescentar nada na base de dados
    //return data.reload() // ignora as modificacoes feitar no .then() do create e adiciona o objeto como foi originalmente mandado para o create()
    
}).then((data)=>{
    //console.log('User Updated')
    console.log('User Destroy')
    console.log(data.toJSON())

})
.catch((err)=>{
    console.log(err)
})
*/
// Isso aqui server apenas para testar a conexao
/*
sequelize.authenticate().then(()=>{
    console.log('Connection Succesful!')
}).catch((err)=>{
    console.log('Error connecting to database')
})
*/

const Users = sequelize.define('user', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        // Por padrao como em qualquer metodo get() de uma classe javascript, ele e quem eh acionado quando fazemos Users.username (que eh apenas uma key em uma instancia de Users)
        // Podemos usar isso sempre que quisermos manipular de alguma forma um dado antes de ele ser mostrado ao usuario
        // getters e setters no sequelzie nao suportam funcoes assincronas!
        get() {
            const rawValue = this.getDataValue('username') // Essa funcao eh a mesma coisa que usar this.username, mas como a this.username chama a get() se fizermos dentro da prorpia get () isso gera um loop
            return rawValue.toUpperCase()
        }
    },
    password: {
        type: DataTypes.STRING,
        // getters e setters no sequelzie nao suportam funcoes assincronas!
        // O setter soh vai acrescentar passos nomento de inserir dados no banco usando qualquer metodo padrao do sequelize como o .create() antes do create inserir na base ele vai passar pelo set, se houver.
        set(value) {
            const salt = bcrypt.genSaltSync(12); //Acrescenta um nivel a mais de protecao a criptografia
            const hash = bcrypt.hashSync(value, salt)
            this.setDataValue('password', hash)    
        }
    },
    age: {
        type: DataTypes.INTEGER,
        defaultValue: 21
    },
    WittCodeRocks: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    description: {
        type: DataTypes.STRING,
        set(value) {
            const compressed = zlib.deflateSync(value).toString('base64');
            this.setDataValue('description', compressed)
        },
        get() {
            const value = this.getDataValue('description')
            const uncompressed = zlib.inflateSync(Buffer.from(value, 'base64'))
            return uncompressed.toString()
        }
    },
    // CAMPO VIRTUAL: Esse campo nao vai ficar quardado na base de dados, elem existe apenas para fazer processamentos com o sequelize
    // Pode ser usado quando queremos mostra para o usuario mais de uma coluna na tabela concatenada, ou realizar operacoes entre dados, como se fosse uma coluna separada (nova)
    aboutUser: {
        type: DataTypes.VIRTUAL,
        get() {
            return `${this.username} ${this.description}`
        }
    }
}, 
{
    freezeTableName: true,
    timestamps: false
})

Users.sync({ alter: true }).then(()=>{
    /*
    return Users.findAll({attributes: [['username', 'myName'],['password', 'pwd']]}) // O .findAll() retorna um vetor com cada um dos registros da tabela de Users, para imprimir temos que fazer um loop q percorre cada um deles
                                                    // O segundo elemento de cada elemento do vetor de atributos da tabela que queremos mostrar serve como um 'as' do sql
    */
    //return Users.findAll({attributes: [[sequelize.fn('AVG', sequelize.col('age')), 'How old']]}) // Com o sequelize.fn() podemos executar as funcoes do sql ('SUM', 'AVG' ,...)
    //return Users.findAll({attributes: {exclude: ['password']}}) // Podemos tambem excluir campos do select
    //return Users.findAll({attributes: ['username'], where: {age: 28, username: 'WittCode'}}) // WHERE
    //return Users.findAll({limit: 2}) //Para limitar o numero de resultados
    //return Users.findAll({attributes: ['age'], order: [['age', 'ASC']]}) // Para ordenar devemos mandar um vetor com os campos pelos quais queremos ordenar e cada campo deve ser um vetor que contem o seu nome a ordem que queremos ordenar ASC ou DESC
    // Essa query soma as idades de quem tem o mesmo username e mostra cada user name diferente e a soma das suas idades
    /*
    return Users.findAll({attributes:   
                            [   'username', 
                                [sequelize.fn('SUM', sequelize.col('age')), 'SUM AGE']
                            ],
                            group: 'username'
                        })
    */
    // Essa query faz a selecao dos registros que tem username='soccer' OU age=45
    // Naturalmente o where ja eh em forma de OU, entao nao eh necessario explicitar mas podemos usar outros operadores como .and, .gt, .lt
    /*
    return Users.findAll({where: {
        [Op.or]: {username: 'soccer', age: 45}
    }})
    */
    // Essa query seleciona todos os registros com a idade maior que 25 .gt = greater then   .lt = less then\
    /*
    return Users.findAll({where: {
        age: {
            [Op.gt]:25
        }
    }})
    */
   // Essa query retorna todos os registros com age menor que 45 ou null
   /*
    return Users.findAll({where: {
        age: {
            [Op.or]: {
                [Op.lt]: 45,
                [Op.eq]: null
            }
        }
    }})
    */
   // Essa query retorna todos os registros que tem 6 caracteres no username
   /*
    return Users.findAll({where: 
        sequelize.where(sequelize.fn('char_length', sequelize.col('username')), 6) //Para usarmos o sequelize.fn() dentro de um where precisamos fazer o where com sequelize.where()
    })
    */
   // UPDATE
   /*
    return Users.update({username: 'pizza'}, {
        where: {age: 31}
    })
    */
   // Essa query atualiza todos os cadastro que tem age > 1
   /*
    return Users.update({username: 'Yes!'}, {
        where: {age: {
            [Op.gt]: 1
        }}
    })
    */
   // REMOVE WHERE
   /*
   return Users.destroy({where: {username: 'Yes!'}})
   */
   // REMOVE TUDO
   /*
   return Users.destroy({truncate: true})
    */

   // UTILITYs
   //return Users.max('age')
   //return Users.sum('age', {where: {age: 87}})
    /*
   return Users.findAll({
    where: {age: 22},
    raw: true // raw true serve para retirar as informacoes extras que o sequelize manda no objeto do resultado do select
   })
   */

   //return Users.findByPk(1); // Busca pela chave primaria
    /*
    return Users.findOne({where: {
        age: {
            [Op.or]: {
                [Op.lt] : 25,
                [Op.eq] : 87
            }
        }
    }}); // pode conter um where, retorna a primeira linha do resultado
    */
    /*
    return Users.findOrCreate({
        where: {username: 'Under'},
        defaults: {
            age: 37 // O defaults aqui substui o do objeto declarado no .define()
        }
    })// Retorna caso exista, caso contrario cria um registro e ja o retorna
    
    // Reotrna nao soh o resultado mas tambem um booleeno dizendo se foi criado ou nao (created=true -> cria um novo e retorna ele; create=false->retorna o existente)
    // Para pegar esse boolean no .then() usa-se descontrucao do vetor (objeto): const [result, created] = data;
    */

    // O .findAndCountAll retorna um objeto com o numero de linhas e outro com os resultados, funciona da mesma forma que o .findAll() porem traz tambem o numero de linhas
    /*
    return Users.findAndCountAll({
        where: {username: 'Robo'},
        raw: true // Lembrando, utliza-se o raw para poder usar o console.log() direto, sem precisar aplicar o .toJSON()
    })
    */

    return Users.findOne({where: {username: 'Wire'}})
    
}).then((data)=>{ 
    console.log(data.username)
    console.log(data.password)
    console.log(data.description)
    console.log(data.aboutUser)
})
.catch((err)=>{
    console.log(err)
})