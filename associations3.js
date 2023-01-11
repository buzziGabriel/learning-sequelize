const Sequelize = require('sequelize')
const { DataTypes, Op } = Sequelize

const sequelize = new Sequelize('sequelize-associations-tutorial', 'root', '', {
    dialect: 'mysql'
})

const Customer = sequelize.define('customer', {
    customerName: {
        type: DataTypes.STRING
    }
}, {
    timestamps: false
})

const Product = sequelize.define('product', {
    productName: {
        type: DataTypes.STRING
    }
}, {
    timestamps: false
})
// Dessa forma o proprio sequelize fica responsavel por criar a junction table, ou join table
/*
Customer.belongsToMany(Product, { 
    through: 'customerProduct',
    foreingKey: "customer_id"
}) // Aqui precisamos obrigatoriamente passar as opcoes
Product.belongsToMany(Customer, { 
    through: 'customerProduct',
    foreingKey: "product_id"
}) // Nos dois
*/
// Podemos tambem criar por conta propria tabela de juncao
const CustomerProduct = sequelize.define('customerproduct', {
    customerProductId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
}, {
    timestamps: false
})
// Quando criamos a junction model por conta propria ao inves de mandar uma string no throgh mandamos a propria junction model que criamos
Customer.belongsToMany(Product, { 
    through: CustomerProduct
})
Product.belongsToMany(Customer, { 
    through: CustomerProduct
})

let customer, product
/*
sequelize.sync({alter: true})
.then(()=>{
    return Customer.findOne({where: {customerName: 'WittCode'}})
})
.then((data)=>{
    customer = data
    return Product.findAll()
})
.then((data)=>{
    product = data
    customer.addProducts(product)
})
.catch((err)=>{
    console.log(err)
})
*/
sequelize.sync({alter: true})
.then(()=>{
    return Product.findOne({where: {productName: 'LapTop'}})
})
.then((data)=>{
    product = data
    return Customer.findAll()
})
.then((data)=>{
    customer = data
    product.addCustomers(customer)
})
.catch((err)=>{
    console.log(err)
})

// O default do onDelete para Many to Many eh CASCADE