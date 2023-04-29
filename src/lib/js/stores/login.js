import { writable } from "svelte/store";
import { browser } from '$app/environment';


export const user = writable({
  cargo: '',
  email: '',
  id: 0,
  nome: ''
})

export const signed = writable(false)

export function logout(){
  localStorage.removeItem('@Auth:user')
  localStorage.removeItem('@Auth:token')
  localStorage.removeItem('cart')
  localStorage.removeItem('resume')
  localStorage.removeItem('idCart')
  localStorage.removeItem('temporaryAddress')
  user.set({
    cargo: '',
    email: '',
    id: 0,
    nome: ''
  })
  signed.set(false)
}

export function loadStorageData(){
  if(browser){
    user.set(JSON.parse(localStorage.getItem("@Auth:user"))) 
    if(localStorage.getItem("@Auth:user")!= null){
      signed.set(true)
    }else{
      signed.set(false)
    }
  }
}
