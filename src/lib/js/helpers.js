
export async function fetchSales(userId){
  const response = await fetch(`http://localhost:3333/pedido/listar/${userId}`)
  const data = await response.json()

  data.forEach((sale) => {
    sale.data_pedido = formatDate(sale.data_pedido)
  })
  
  return data
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