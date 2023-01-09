const { HasOne } = require('sequelize')
const Sequelize = require('sequelize')
const { DataTypes, Op } = Sequelize

const sequelize = new Sequelize('sequelize-associations-tutorial', 'root', '', {
    dialect: 'mysql'
})

// One to One relationship

const Country = sequelize.define('country', {
    countryName: {
        type: DataTypes.STRING,
        unique: true
    }
}, {
    timestamps: false
})

const Capital = sequelize.define('capital', {
    capitalName: {
        type: DataTypes.STRING,
        unique: true
    }
}, {
    timestamps: false
})

Country.hasOne(Capital) // Country eh a parent table e Capital eh a child table, nao pode existir uma capital sem um pais de referencia, na tabela capital tem uma chave extrangeira que aponta para pais

//Country.hasOne(Capital, {foreingKey: 'soccer'}) // podemos personalizar o nome da chave extrangeira
// Podemos definir mais opcoes a respeito do relacionamento como abaixo
/*
Country.hasOne(Capital, {foreingKey: {
    name: 'soccer',
    type: DataTypes.INTEGER,
    allowNull: false // Isso forca que para registrar um registro filho ele precisa ser associado no momento da craicao
}})
// Eh recomendavel que todas as opcoes passadas aqui sejam passadas no belongsTo tambem
*/

Country.hasOne(Capital, {onDelete: 'CASCATE'}) // usando a opcao onDelete: 'CASCATE' quando excluimos (destroy) um registro, todos os seu filhos sao apagados tambem
// Eh recomendavel que todas as opcoes passadas aqui sejam passadas no belongsTo tambem

// Neste caso, se fizermos capital.setCountry(country) tentando associar uma capital ja associada a um outro pais, o sequelize vai desmontar a associacao anterior e associar essa capital ao pais que especificamos.
// Mas se fizermos country.setCapital(capital) tentando fazer a mesma coisa, o sequelize nao desmonta o relacionamento atual ele apenas faz uma nova associacao o que configura um relacionamento 1 para muitos (um pais vai ter mais de uma capital, mais de uma capital vai ter a coluna de countryId igual a 2, por exemplo.)
// Isso por que escolhemos fazer Country.hasOne(capital) e Capital.belongsTo(Country)

let country, capital
/*
// O que fizemos abaixo foi associar de fato o registro do pais Spain com o da sua capital Madrid
sequelize.sync({
    alter: true
}).then(()=>{
    //working with our updated table
    return Capital.findOne({where: {capitalName: 'Madrid'}})
}).then((data)=>{
    capital = data
    return Country.findOne({where: {countryName: 'Spain'}})
}).then((data)=>{
    country = data
    country.setCapital(capital) // Esse metodo eh criado por padrao pelo sequelize toda vez que fazemos um relacionamento
})
.catch((err)=>{
    console.log(err)
})
*/
// Uma vez q os registros ja estao associados pela chave extrangeira podemos usar o metodo get para retorna o registro associado.
// Abaixo primeira buscamos o pais que desejamos e depois por ele chagamos no registro de sua capital
/*
sequelize.sync({
    alter: true
}).then(()=>{
    //working with our updated table
    return Country.findOne({where: {countryName: 'Spain'}})
}).then((data)=>{
    country = data
    return country.getCapital()
}).then((data)=>{
    console.log(data.toJSON())
})
.catch((err)=>{
    console.log(err)
})
*/
// Aqui criamos um novo pais e juntamente ja criamos registramos sua capital
/*
sequelize.sync({
    alter: true
}).then(()=>{
    //working with our updated table
    return Country.create({
        countryName: 'Mexico'
    })
}).then((data)=>{
    country = data
    return country.createCapital({
        capitalName: 'Cidade do Mexico'
    })
}).then((data)=>{
    console.log(data.toJSON())
})
.catch((err)=>{
    console.log(err)
})
*/
// Se voce quiser usar esse metodos que o sequelize cria por padrao nas duas tabelas do relacionamento vc precisa definir os dois lados do relacionamento Pai.hasOne e Filho.belongsTo
// Eh uma boa pratica utilizar os dois
Capital.belongsTo(Country) // O metodo belongs to faz o inverso do hasOne, enquanto o hasOne passa a chave primeira do tabela antes do ponto para a tabela entre parenteses, o belongsTo faz o contrario

sequelize.sync({
    alter: true
}).then(()=>{
    //working with our updated table
    return Country.findOne({where: {countryName: 'Brazil'}})
}).then((data)=>{
    country = data
    return Capital.findOne({where: {capitalName: 'Brasilia'}})
}).then((data)=>{
    capital = data
    return capital.setCountry(country)
}).then((data)=>{

})
.catch((err)=>{
    console.log(err)
})
