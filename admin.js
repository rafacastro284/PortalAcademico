document.addEventListener('DOMContentLoaded', function() {
  //verifica se o usuario ta logado e se eh admin
  const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
  
  if (!usuarioLogado || usuarioLogado.perfil !== 'admin') {
    alert('Acesso negado! Esta área é restrita para administradores.');
    window.location.href = 'login.html';
    return;
  }
  
  //carrega informacoes do admin
  document.getElementById('nomeAdmin').textContent = `Olá, ${usuarioLogado.nome}!`;
    
  //botao de sair
  document.querySelector('.btn-sair').addEventListener('click', function() {
    sessionStorage.removeItem('usuarioLogado');
    window.location.href = 'login.html';
  });
});

function obterUsuarios() {
  const usuariosSalvos = localStorage.getItem('usuariosPortalAcademico');
  return usuariosSalvos ? JSON.parse(usuariosSalvos) : [];
}

function visualizarUsuarios() {
  const listaUsuarios = document.getElementById('listaUsuarios');
  const tabelaUsuarios = document.getElementById('tabelaUsuarios');
    
  const usuarios = obterUsuarios(); 
  
  console.log('Usuários carregados:', usuarios); 
  
  if (listaUsuarios.style.display === 'none') {
    //tabela de usuarios
    let html = `
      <table class="tabela-usuarios">
        <thead>
          <tr>
            <th>Nome</th>
            <th>CPF</th>
            <th>Perfil</th>
            <th>Matrícula/Registro</th>
            <th>E-mail</th>
            <th>Data Cadastro</th>
          </tr>
        </thead>
        <tbody>
    `;
    
    if (usuarios.length === 0) {
      html += `
        <tr>
          <td colspan="6" style="text-align: center; color: #666;">
            Nenhum usuário cadastrado
          </td>
        </tr>
      `;
    } else {
      usuarios.forEach(usuario => {
        const dataCadastro = usuario.dataCadastro 
          ? new Date(usuario.dataCadastro).toLocaleDateString('pt-BR')
          : 'Não informada';
          
        html += `
          <tr>
            <td><strong>${usuario.nome}</strong></td>
            <td>${usuario.cpf}</td>
            <td>
              <span class="perfil-badge ${usuario.perfil}">
                ${usuario.perfil.toUpperCase()}
              </span>
            </td>
            <td>${usuario.matricula || usuario.registro || '-'}</td>
            <td>${usuario.email || '-'}</td>
            <td>${dataCadastro}</td>
          </tr>
        `;
      });
    }
    
    html += `</tbody></table>`;
    tabelaUsuarios.innerHTML = html;
    listaUsuarios.style.display = 'block';
  } else {
    listaUsuarios.style.display = 'none';
  }
}