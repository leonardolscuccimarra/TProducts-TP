const socket = io()

/* if (!usuario) {
  Swal.fire({
    title: 'Bienvenido',
    text: 'Ingresá tu nombre para entrar al chat',
    input: 'text',
    allowOutsideClick: false,          
    confirmButtonText: 'Entrar'       
  }).then(result => {                  
    usuario = result.value            
    localStorage.setItem('usuario', usuario) 
    socket.emit('registro', usuario)   
  })
} else {
  socket.emit('registro', usuario)    
}
 */

// seleccionamos elementos
const btn = document.getElementById('btnEnviar')
const lista = document.getElementById('lista')

btn.addEventListener('click', () => {
    const texto = input.value
    socket.emit('mensaje', { usuario, texto })
    input.value = ''
})

socket.on('mensaje', data => {
    const li = document.createElement('li')
    li.textContent = `${data.usuario}: ${data.texto}`
    lista.appendChild(li)
})
