'use strict'

const openModal = () => document.getElementById('modal').classList.add('active')

const closeModal = () => {
    clearFields() //Limpar informações
    document.getElementById('modal').classList.remove('active')
}

// função do envio para servidor local
const getLocalStorage = () => JSON.parse(localStorage.getItem('db_client')) ?? [] // para não sobrepor um existente
const setLocalStorage = (dbClient) => localStorage.setItem("db_client", JSON.stringify(dbClient))

//CRUD - Create Read Update Delete

const deleteClient = (index) => { //para deletar um cliente criado
    const dbClient = readClient()
    dbClient.splice(index, 1)
    setLocalStorage(dbClient)
}

const updateClient = (index, client) => { //Para atualizar um existente
    const dbClient = readClient()
    dbClient[index] = client
    setLocalStorage(dbClient)
}

const readClient = () => getLocalStorage() // Função para ler o cliente

const createClient = (client) => {
    const dbClient = getLocalStorage() //Para criar o clliente
    dbClient.push(client)
    setLocalStorage(dbClient)
}

const isValidFields = () => {
    return document.getElementById('form').reportValidity() //Para verificar se todos o requisito foram atendidos
}

//Interação com o Layout

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
}

const saveClient = () => {
    if (isValidFields()) {
        const client = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            celular: document.getElementById('celular').value,
            cidade: document.getElementById('cidade').value
        }
        const index = document.getElementById('nome').dataset.index
        if (index == 'new') {
            createClient(client) //Criar
            updateTable()
            closeModal() // Fechar o modal
        } else {
            updateClient(index, client)
            updateTable()
            closeModal()
        }
    }
}

const createRow = (client, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${client.nome}</td>
        <td>${client.email}</td>
        <td>${client.celular}</td>
        <td>${client.cidade}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}">Excluir</button>
        </td>
    
    `
    document.querySelector('#tableClient>tbody').appendChild(newRow) // Para criar no html as novas tags
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableClient>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row)) // Para apagar a própria linha
}

const updateTable = () => { //Para trazer as informações salva no servidor local
    const dbClient = readClient()
    clearTable()
    dbClient.forEach(createRow) //Criar uma linha para cada cliente salvo
}

const fillFields = (client) => { // para preencher os campos que quer editar
    document.getElementById('nome').value = client.nome
    document.getElementById('email').value = client.email
    document.getElementById('celular').value = client.celular
    document.getElementById('cidade').value = client.cidade
    document.getElementById('nome').dataset.index = client.index
}

const editClient = (index) => { // funcão para editar o cliente cadastrado.
    const client = readClient()[index]
    client.index = index
    fillFields(client)
    openModal()
}

const editDelete = (event) => { // função para editar e deletar
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editClient(index)
        } else {
            const client = readClient()[index]
            const response = confirm(`Deseja realmente excluir o cliente ${client.nome}`)
            if (response) {
                deleteClient(index)
                updateTable()
            }
        }
    }
}

updateTable()

//Eventos

document.getElementById('cadastrarCliente').addEventListener('click', openModal)

document.getElementById('modalClose').addEventListener('click', closeModal)

document.getElementById('salvar').addEventListener('click', saveClient)

document.querySelector('#tableClient>tbody').addEventListener('click', editDelete)

//https://www.youtube.com/watch?v=_HEIqE_qqbQ
//https://github.com/fernandoleonid/mini-projetos-js/blob/master/08-crud/main.js