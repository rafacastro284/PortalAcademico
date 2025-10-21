function validarLogin(event) {
  event.preventDefault();
  const cpf = document.getElementById('cpf').value.trim();
  const senha = document.getElementById('senha').value.trim();

  console.log('Tentando login com:', { cpf, senha }); 

  if (cpf === "" || senha === "") {
    alert("Por favor, preencha todos os campos.");
    return false;
  }

  const usuario = autenticarUsuario(cpf, senha);
  console.log('Usuário encontrado:', usuario); 

  if (usuario){
    //armazena usuario para usar nas outras paginas
    sessionStorage.setItem('usuarioLogado', JSON.stringify(usuario));

    //redireciona baseado no perfil
    switch(usuario.perfil) {
      case 'admin':
        window.location.href = 'admin.html';
        break;
      case 'professor':
        window.location.href = 'professor.html';
        break;
      case 'aluno':
        window.location.href = 'aluno.html';
        break;
      case 'diretor':  
        window.location.href = 'diretor.html';
        break;
      case 'secretario':
        window.location.href = 'secretario.html';
        break;
      default:
        alert('Perfil não reconhecido');
    }
  }else {
    alert('CPF ou senha inválidos!');
  }

  return false;
}

//máscara de CPF
document.getElementById('cpf').addEventListener('input', function (e) {
  let value = e.target.value.replace(/\D/g, '');
  if (value.length > 11) value = value.slice(0, 11);
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  e.target.value = value;
});