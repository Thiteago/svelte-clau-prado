
export const cpfRegexp = /([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})/;

export async function fetchSales(userId){
  const response = await fetch(`http://localhost:3333/pedido/listar/${userId}`)
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
  products.forEach((item) => {
    if(item.promocao != null && item.promocao.status == 'Ativo'){
      if(item.promocao.tipo == 'valor_fixo'){
        item.valor = item.valor - item.promocao.valor_desconto
      } else {
        item.valor = item.valor - (item.valor * (item.promocao.valor_desconto / 100))
      }
    }
  })
  return products
}

export async function fetchProducts(){
  const response = await fetch('http://localhost:3333/Produto')
  if(response.status === 200){
    let data = await response.json()
    if(data.length > 0){
      data = await calculateDiscount(data)
      return data
    }
  }
  return []
}

export async function fetchProductsById(id){
  const response = await fetch(`http://localhost:3333/Produto/${id}`)
  let data = await response.json()
  data.dataFabricacao = formatDate(data.dataFabricacao)
  await calculateDiscount([data])

  return data
}

export async function fetchPromotions(){
  const response = await fetch('http://localhost:3333/promocao/listar')
  if(response.status === 200){
    const data = await response.json()
    if(data.length > 0){
      return data
    }
  }
  return []
}

export async function fetchDisable(id){
  const response = await fetch(`http://localhost:3333/promocao/desabilitar/${id}`, {
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

export function formatDate(date){
  let data = new Date(date)
  let dia = data.getDate()
  let mes = data.getMonth() + 1 // Adiciona 1 porque o mês começa em zero (janeiro = 0)
  let ano = data.getFullYear()

  return `${dia}/${mes}/${ano}`
}

export async function fetchAddress(userId){
  const response = await fetch(`http://localhost:3333/Usuarios/${userId}/Enderecos`)
  const data = await response.json()

  return data
}

export function validateCPF(cpf){
  if(cpfRegexp.test(cpf)){
    return true
  }
  return false
}