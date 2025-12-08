const socket = io();

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

/* const btnPost = document.getElementById('btnPost'); */
/* const btnPut = document.getElementById('btnPut');
const btnDelete = document.getElementById('btnDelete'); */
const lista = document.getElementById('lista');

/* btnPost.addEventListener('click', () => {

  //Multiple Values de: https://sweetalert2.github.io/#input-types
  const { value: formValues } = Swal.fire({
    title: "Multiple inputs",
    html: `
    <input id="swal-input1" class="swal2-input">
    <input id="swal-input2" class="swal2-input">
    <input id="swal-input3" class="swal2-input">
    <input id="swal-input4" class="swal2-input" inputLabel="Your IP address">
  `,
    focusConfirm: false,
    preConfirm: () => {
      return [
        document.getElementById("swal-input1").value,
        document.getElementById("swal-input2").value,
        document.getElementById("swal-input3").value,
        document.getElementById("swal-input2").value
      ];
    }
  });
  if (formValues) {
    fetch('http://localhost:8080/api/products', {
      method: "POST",

    });
  }
}); */

/*  btnPut.addEventListener('click', () => {
  socket.emit('put', "hola");
}); */

btnDelete.addEventListener('click', () => {
  const { value: pid } = Swal.fire({
    title: "ID del Objeto a Eliminar",
    input: "text",
    inputValue,
    showCancelButton: true,
  });

  fetch(`http://localhost:8080/api/products/${pid}`, {
    method: `delete`,
  });
});

socket.on('update', data => {
  lista.empty();
  data.forEach(o => {
    const li = document.createElement('li');
    li.textContent = `${o.title}: ${o.price} || ${o.category} || ID:${o.id} ${o.status ? `✅ Stock: ${o.stock}` : '❌'}`
    lista.appendChild(li);
  });
})
