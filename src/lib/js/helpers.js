import { PUBLIC_BACKEND_URL } from '$env/static/public'

export const cpfRegexp = /([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})/;

export async function fetchOrdersById(userId){
  const response = await fetch(`${PUBLIC_BACKEND_URL}/pedido/listar/${userId}`)
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
        products.valor = products.valor - products.promocao.valor_desconto
        
      } else {
        products.valor = products.valor - (products.valor * (products.promocao.valor_desconto / 100))
      
      }
      return Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(products.valor)
    }
  }
  
  return products
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