const fs = require('fs')
const { join } = require('path')

const clientesPath = join(__dirname, 'clientes.json')
const fornecedoresPath = join(__dirname, 'fornecedores.json')
const produtosPath = join(__dirname, 'produtos.json')
const vendasPath = join(__dirname, 'vendas.json')
const vendedoresPath = join(__dirname, 'vendedores.json')
const usuariosPath = join(__dirname, 'usuarios.json')

const getVendas = (dataMin) => {
    try {
        const vendas = JSON.parse(fs.existsSync(vendasPath)
            ? fs.readFileSync(vendasPath)
            : [])

        const vendasPeriodo = vendas.filter((venda) => {
            return Date.parse(venda.data) >= Date.parse(dataMin)
        })

        return vendasPeriodo
    } catch (error) {
        return []
    }
}

const getProdutos = () => {
    const produtos = fs.existsSync(produtosPath)
        ? fs.readFileSync(produtosPath)
        : []

    try {
        return JSON.parse(produtos)
    } catch (error) {
        return []
    }
}

const getVendedores = () => {
    const vendedores = fs.existsSync(vendedoresPath)
        ? fs.readFileSync(vendedoresPath)
        : []

    try {
        return JSON.parse(vendedores)
    } catch (error) {
        return []
    }
}

const getFornecedores = () => {
    const fornecedores = fs.existsSync(fornecedoresPath)
        ? fs.readFileSync(fornecedoresPath)
        : []

    try {
        return JSON.parse(fornecedores)
    } catch (error) {
        return []
    }
}

const getClientes = () => {
    const clientes = fs.existsSync(clientesPath)
        ? fs.readFileSync(clientesPath)
        : []

    try {
        return JSON.parse(clientes)
    } catch (error) {
        return []
    }
}

const getUsuario = (login, senha) => {
    try {
        const usuarios = JSON.parse(fs.existsSync(usuariosPath)
            ? fs.readFileSync(usuariosPath)
            : [])

        const usuario = usuarios.find(usuario => ((usuario.login === login) && (usuario.senha === senha)))

        return usuario
    } catch (error) {
        return []
    }
}

const registraVenda = (vendas) => fs.writeFileSync(vendasPath, JSON.stringify(vendas, null, '\t'))
const registraProduto = (produtos) => fs.writeFileSync(produtosPath, JSON.stringify(produtos, null, '\t'))
const registraVendedor = (vendedores) => fs.writeFileSync(vendedoresPath, JSON.stringify(vendedores, null, '\t'))
const registraFornecedor = (fornecedores) => fs.writeFileSync(fornecedoresPath, JSON.stringify(fornecedores, null, '\t'))
const registraCliente = (clientes) => fs.writeFileSync(clientesPath, JSON.stringify(clientes, null, '\t'))

const routes = (app) => {
    app.route('/produtos/')
        .get((req, res) => {
            const produtos = getProdutos()
            res.send({ produtos })
        })
        .post((req, res) => {
            let produtos = getProdutos()

            produtos.push(req.body)
            registraProduto(produtos)

            res.status(201).send('OK')
        })
        .put((req, res) => {
            registraProduto(getProdutos().map(produto => {
                if (produto.codBarra === req.body.codBarra) {
                    return req.body
                }

                return produto
            }))

            res.status(200).send('OK')
        })
        .delete((req, res) => {
            registraProduto(getProdutos().filter(produto => produto.codBarra !== req.body.codBarra))

            res.status(200).send('OK')
        })

    app.route('/clientes/')
        .get((req, res) => {
            let clientes = getClientes()
            if (req.body.CPF) {
                clientes = clientes.find(cliente => cliente.CPF === req.body.CPF)
            }
            res.send({ clientes })
        })
        .post((req, res) => {
            let clientes = getClientes()
            clientes.push(req.body)
            registraCliente(clientes)

            res.status(201).send('OK')
        })
        .put((req, res) => {
            registraCliente(getClientes().map(cliente => {
                if (cliente.CPF === req.body.CPF) {
                    return req.body
                }

                return cliente
            }))

            res.status(200).send('OK')
        })
        .delete((req, res) => {
            registraCliente(getClientes().filter(cliente => cliente.CPF !== req.body.CPF))

            res.status(200).send('OK')
        })

    app.route('/vendedores/')
        .get((req, res) => {
            let vendedores = getVendedores()
            if (req.body.matrícula) {
                vendedores = vendedores.find(vendedor => vendedor.matrícula === req.body.matrícula)
            }
            res.send({ vendedores })
        })
        .post((req, res) => {
            let vendedores = getVendedores()
            vendedores.push(req.body)
            registraVendedor(vendedores)

            res.status(201).send('OK')
        })
        .put((req, res) => {
            registraVendedor(getVendedores().map(vendedor => {
                if (vendedor.matrícula === req.body.matrícula) {
                    return req.body
                }

                return vendedor
            }))

            res.status(200).send('OK')
        })
        .delete((req, res) => {
            registraVendedor(getVendedores().filter(vendedor => vendedor.matrícula !== req.body.matrícula))

            res.status(200).send('OK')
        })

    app.route('/fornecedores/')
        .get((req, res) => {
            const fornecedores = getFornecedores()
            res.send({ fornecedores })
        })
        .post((req, res) => {
            let fornecedores = getFornecedores()
            fornecedores.push(req.body)
            registraFornecedor(fornecedores)

            res.status(201).send('OK')
        })
        .put((req, res) => {
            registraFornecedor(getFornecedores().map(fornecedor => {
                if (fornecedor.CNPJ === req.body.CNPJ) {
                    return req.body
                }

                return fornecedor
            }))

            res.status(200).send('OK')
        })
        .delete((req, res) => {
            registraFornecedor(getFornecedores().filter(fornecedor => fornecedor.CNPJ !== req.body.CNPJ))

            res.status(200).send('OK')
        })

    app.route('/vendas/')
        .get((req, res) => {
            const vendas = req.query.periodo ? getVendas(req.query.periodo) : getVendas(0)

            for (venda of vendas) {
                for (item of venda.itens) {
                    const produto = getProdutos().find(produto => produto.codBarra == item.produto)

                    item.nome = produto.nome
                    item.preço = produto.precoVenda
                }
            }

            res.send({ vendas })
        })
        .post((req, res) => {
            let vendas = getVendas(0)
            vendas.push(req.body)
            registraVenda(vendas)

            let produtos = getProdutos()

            let custo = 0

            for (item of req.body.itens) {
                let produto = produtos.find(produto => produto.codBarra == item.produto)

                produto.quantEstoque -= item.quantidade

                custo += produto.precoVenda * item.quantidade

                if (produto.quantEstoque <= 0) {
                    produto.quantEstoque = 0
                    produto.status = "Fora de Estoque"
                }
            }

            registraProduto(produtos)

            let clientes = getClientes()
            clientes.find(cliente => cliente.CPF === req.body.cliente).pontos += custo / 100

            registraCliente(clientes)

            res.status(201).send('OK')
        })
    // .put((req, res) => {
    //     registraVenda(getVendas().map(venda => {
    //         if (venda.número === req.body.número) {
    //             return req.body
    //         }

    //         return venda
    //     }))

    //     res.status(200).send('OK')
    // })
    // .delete((req, res) => {
    //     registraVenda(getVendas().filter(venda => venda.número !== req.body.número))

    //     res.status(200).send('OK')
    // })

    app.route('/login/')
        .get((req, res) => {
            const usuario = getUsuario(req.query.login, req.query.senha)

            res.send({ usuario })
        })
}

module.exports = routes
