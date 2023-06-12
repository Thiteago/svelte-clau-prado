import { PUBLIC_BACKEND_URL } from '$env/static/public'
import { DateTime } from "luxon";

export const cpfRegexp = /([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})/;

export async function createdCart(id){
  await fetch(`${PUBLIC_BACKEND_URL}/carrinho/registar/${id}`, {
    method: 'POST',
  })
}

export async function fetchCategorias(){
  const response = await fetch(`${PUBLIC_BACKEND_URL}/categoria/listar`)
  if(response.status === 200){
    const data = await response.json()
    return data
  }
}


export async function fetchAlugueis(){
  const response = await fetch(`${PUBLIC_BACKEND_URL}/aluguel/listar`)
  if(response.status === 200){
    const data = await response.json()
    return data
  }
}

export async function fetchInitialAvaliacoes(){
  const response = await fetch(`${PUBLIC_BACKEND_URL}/avaliacoes/listar_inicio`)
  if(response.status === 200){
    const data = await response.json()
    return data
  }
}

export async function registerVisit(logado = false){
  await fetch(`${PUBLIC_BACKEND_URL}/Usuarios/visita/${logado}`, {
    method: 'POST',
  })
}

export async function changeOrderAddress(orderId, addressId){
  const response = await fetch(`${PUBLIC_BACKEND_URL}/pedido/alterar/endereco/${orderId}`,{
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'PATCH',
    body: JSON.stringify({
      enderecoId: addressId
    })

  })
  if(response.status === 200){
    return true
  }
  return false
}

export async function getUsers(){
  const response = await fetch(`${PUBLIC_BACKEND_URL}/Usuarios`)
  const usuarios = await response.json()
  return usuarios
}

export async function checkIfCartIsAvailable(carrinho){
  const response = await fetch(`${PUBLIC_BACKEND_URL}/carrinho/verificarDisponibilidade`,{
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(carrinho)
  })
  if(response.status === 200){
    return true
  }
  return false
}

export async function updateToSended(id, codigo){
  await fetch(`${PUBLIC_BACKEND_URL}/pedido/alterar/envio/${id}`,{
    headers: {
      'Content-Type': 'application/json'
      },
      method: 'PATCH',
      body: JSON.stringify({
        codigo_rastreio: codigo
      })
  }).then((response) => {
    if(response.status === 200){
      return true
    }
    return false
  })
}

export async function fetchDespesas(inicio, fim){
  const response = await fetch(`${PUBLIC_BACKEND_URL}/despesas/listar`, {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      dataInicial: inicio,
      dataFinal: fim
    })
  })
  if(response.status === 200){
    const data = await response.json()
    data.forEach((despesa) => {
      despesa.data = DateTime.fromISO(despesa.data).toFormat('dd/MM/yyyy')
    })
    return data
  }
}

export async function updateDevolution(idPedido, idAluguel, codigo){
  const response = await fetch(`${PUBLIC_BACKEND_URL}/pedido/alterar/devolucao/${idPedido}`,{
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'PATCH',
    body: JSON.stringify({
      codigo_rastreio: codigo,
      idAluguel: idAluguel
    })
  })

  if(response.status === 200){
    return true
  }else{
    return false
  }
}

export async function saveNewAddress(address, userId){
  const response = await fetch (`${PUBLIC_BACKEND_URL}/Usuarios/${userId}/NovoEndereco`, {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      endereco: address
    })
  })
  if(response.status === 201){
    let data = await response.json()
    return data
  }
  return []
}

export async function fetchOrdersByUserId(userId){
  const response = await fetch(`${PUBLIC_BACKEND_URL}/pedido/listar/user/${userId}`)
  if(response.status === 200){
    const data = await response.json()
    if(data.length > 0){
      data.forEach((sale) => {
        sale.data_pedido = formatDate(sale.data_pedido)
      })

      return data
    }
  }
  return []
}

export async function fetchOrdersById(id){
  const response = await fetch(`${PUBLIC_BACKEND_URL}/pedido/listar/${id}`)
  if(response.status === 200){
    const data = await response.json()
    data.data_pedido = formatDate(data.data_pedido)
    return data
  }
  return []
}

export async function fetchOrders(){
  const response = await fetch(`${PUBLIC_BACKEND_URL}/pedido/listar`)
  if(response.status === 200){
    const data = await response.json()
    if(data.length > 0){
      data.forEach((sale) => {
        sale.data_pedido = formatDate(sale.data_pedido)
      })
      return data
    }
  }
  return []
}

export async function calculateDiscount(products){
  let promotional_value
  if(products.length != 0 && products.length != undefined){
    products.forEach((item) => {
      if(item.promocao != null && item.promocao.status == 'Ativo'){
        if(item.promocao.tipo == 'valor_fixo'){
          item.valor = item.valor - item.promocao.valor_desconto
        } else {
          item.valor = item.valor - (item.valor * (item.promocao.valor_desconto / 100))
        }
      }
    })
  }else{
    if(products.promocao != null && products.promocao.status == 'Ativo'){
      if(products.promocao.tipo == 'valor_fixo'){
        promotional_value = products.valor - products.promocao.valor_desconto
      } else {
        promotional_value = products.valor - (products.valor * (products.promocao.valor_desconto / 100))
      }
      return Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(promotional_value)
    }
  }

}

export async function fetchProducts(){
  const response = await fetch(`${PUBLIC_BACKEND_URL}/Produto`)
  if(response.status === 200){
    let data = await response.json()
    if(data.length > 0){
      return data
    }
  }
  return []
}

export async function fetchProductsById(id){
  const response = await fetch(`${PUBLIC_BACKEND_URL}/Produto/${id}`)
  let data = await response.json()

  return data
}

export async function fetchPromotions(){
  const response = await fetch(`${PUBLIC_BACKEND_URL}/promocao/listar`)
  if(response.status === 200){
    const data = await response.json()
    if(data.length > 0){
      return data
    }
  }
  return []
}

export async function fetchPromoById(id){
  const response = await fetch(`${PUBLIC_BACKEND_URL}/promocao/listar/${id}`)
  if(response.ok){
    const data = await response.json()
    return data
  }
  return []
}

export async function fetchDisable(id){
  const response = await fetch(`${PUBLIC_BACKEND_URL}/promocao/desabilitar/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  if(response.status === 200){
    return true
  }
  return false
}

export function formatToCurrency(value){
  return Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export function formatDate(date){
  let data = new Date(date)
  let dia = data.getDate()
  let mes = data.getMonth() + 1 
  let ano = data.getFullYear()
  
  return `${dia}/${mes}/${ano}`
}

export async function fetchAddress(userId){
  const response = await fetch(`${PUBLIC_BACKEND_URL}/Usuarios/${userId}/Enderecos`)
  const data = await response.json()

  return data
}

export function validateCPF(cpf){
  if(cpfRegexp.test(cpf)){
    return true
  }
  return false
}

export async function createNewUser(user){
  const response = await fetch(`${PUBLIC_BACKEND_URL}/NovoUsuario`,{
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(user)
  })

  let data = await response.json()
  return data
}