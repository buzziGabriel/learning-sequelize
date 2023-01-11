const Sequelize = require('sequelize')
const { DataTypes, Op } = Sequelize

const sequelize = new Sequelize('sequelize-associations-tutorial', 'root', '', {
    dialect: 'mysql'
})

const User = sequelize.define('user', {
    username: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    }
}, {
    timestamps: false
})

const Post = sequelize.define('post', {
    message: {
        type: DataTypes.STRING
    }
}, {
    timestamps: false
})

User.hasMany(Post)
Post.belongsTo(User)
/*
// Com a opcao CASCADE quando detroimos um user todos os seus posts sao apagados
User.hasMany(Post, {onDelete: 'CASCADE'}) 
Post.belongsTo(User, {onDelete: 'CASCADE'})
*/
let user, posts
/*
sequelize.sync({
    alter: true
})
.then(()=>{
    return User.findOne({where:{username: 'WittCode'}})
})
.then((data)=>{
    user = data
    return Post.findAll()
})
.then((data)=>{
    posts = data
    return user.addPosts(posts) //.addPosts() no plural faz com que todos esses posts passados como argumento da funcao recebam o userId que selecionamos na sua coluna de chave estrangeira
    
})
.then((data)=>{
    console.log(data)
})
.catch((err)=>{
    console.log(err)
})
*/
/*
sequelize.sync({
    alter: true
})
.then(()=>{
    return User.findOne({where:{username: 'WittCode'}})
})
.then((data)=>{
    user = data
    return user.countPosts() //.countPost() conta quantos registros existem na tabela filha (lado n) que fazem referencia a determinado registro da tabela pai (lado 1)
})
.then((data)=>{
    console.log(data)
})
.catch((err)=>{
    console.log(err)
})
*/
/*
sequelize.sync({
    alter: true
})
.then(()=>{
    return User.findOne({where:{username: 'WittCode'}})
})
.then((data)=>{
    user = data
    return Post.findOne()
})
.then((data)=>{
    posts = data
    return user.removePost(posts) // Nao remove o post, soh tira a associassao com esse user
    // Existe a versao no plural tambem .removePosts() que recebe um vetor com os posts que desejamos deletar
})
.then((data)=>{
    console.log(data)
})
.catch((err)=>{
    console.log(err)
})
*/
/*
sequelize.sync({
    alter: true
})
.then(()=>{
    return User.findOne()
})
.then((data)=>{
    user = data
    return Post.findOne()
})
.then((data)=>{
    posts = data
    posts.setUser(user) // Chamando o utility method na model Post para setar de qual User eh aquele post
})
.then((data)=>{
    console.log(data)
})
.catch((err)=>{
    console.log(err)
})
*/
