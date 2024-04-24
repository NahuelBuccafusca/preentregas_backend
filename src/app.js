const express= require('express')
const app= express()
const productsRouter= require("./routes/products.router.js")
const cartsRouter= require("./routes/carts.router.js") 
const PORT=8080

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use("/", productsRouter)
app.use("/",cartsRouter)

app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`)
})
