const { response } = require("express");
const { request } = require("express");
const express = require("express");
const { type } = require("express/lib/response");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(express.json());

const curstomers = [];

// Middleware
function verifyIfExistsAccountCPF(req, res, next) {
    const { cpf } = req.headers;

    const customer = curstomers.find((customer) => customer.cpf === cpf);

    if (!customer) {
      return res.status(400).json({ error: "Customer not found" });
    };

    request.customer = customer;

    return next();
}
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

app.get("/statement", verifyIfExistsAccountCPF, (req, res) => { 
    const { customer } = request;
    return res.json(customer.statement);
});

app.post("/deposit", verifyIfExistsAccountCPF, (req, res) => {
    const { description, amount} = req.body;

    const { customer } = req;

    const statementOperation = {
        description,
        amount,
        created_at: new Date(),
        type: "Credit"
    }

    customer.statement.push(statementOperation);

    return res.status(201).send();
})

app.listen(3131);