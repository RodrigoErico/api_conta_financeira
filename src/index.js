const { response } = require("express");
const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(express.json());

const curstomers = [];

app.post("/account", (req, res) => {
    const { cpf, name } = req.body;

    const customerAlreadyExists = curstomers.some(
        (customer) => customer.cpf === cpf
    );
    
    if(customerAlreadyExists) {
        return response.status(400).json({ error: "Customer already exists!" })
    };


    curstomers.push({
        cpf,
        name,
        id: uuidv4(),
        statement: []
    });

    return res.status(201).send();

})
app.listen(3131);