document.addEventListener('DOMContentLoaded', function() {
  //verifica se o usuario ta logado e se eh admin
  const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
  
  if (!usuarioLogado || usuarioLogado.perfil !== 'admin') {
    alert('Acesso negado! Esta área é restrita para administradores.');
    window.location.href = 'login.html';
    return;
  }

  //mascara de cpf
  document.getElementById('cpf').addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    e.target.value = value;
  });
});

function mostrarCamposEspecificos() {
  const tipoUsuario = document.getElementById('tipoUsuario').value;
  
  document.querySelectorAll('.campos-especificos').forEach(campo => {
    campo.style.display = 'none';
  });
  
  if (tipoUsuario) {
    document.getElementById(`campos${tipoUsuario.charAt(0).toUpperCase() + tipoUsuario.slice(1)}`).style.display = 'grid';
  }
}

function cadastrarUsuario(event) {
  event.preventDefault();
  
  const tipoUsuario = document.getElementById('tipoUsuario').value;
  const nome = document.getElementById('nome').value;
  const cpf = document.getElementById('cpf').value;
  const email = document.getElementById('email').value;
  
  if (!tipoUsuario || !nome || !cpf || !email) {
    alert('Por favor, preencha todos os campos obrigatórios.');
    return false;
  }

  if (!validarCPF(cpf)) {
    alert('Por favor, insira um CPF válido.');
    return false;
  }

  const usuario = {
    nome: nome,
    cpf: cpf,
    email: email,
    perfil: tipoUsuario,
    senha: gerarSenhaPadrao(tipoUsuario),
    dataCadastro: new Date().toISOString() 
  };

  //adiciona campos especificos baseados no tipo
  switch(tipoUsuario) {
    case 'aluno':
      usuario.matricula = document.getElementById('matricula').value || gerarMatricula();
      usuario.turma = document.getElementById('turma').value;
      usuario.dataNascimento = document.getElementById('dataNascimento').value;
      break;
      
    case 'professor':
      usuario.registro = document.getElementById('registro').value || `PROF${Date.now().toString().slice(-3)}`;
      usuario.disciplina = document.getElementById('disciplina').value;
      usuario.formacao = document.getElementById('formacao').value;
      break;
      
    case 'admin':
      usuario.nivelAcesso = document.getElementById('nivelAcesso').value || 'completo';
      break;
    
    case 'diretor': 
      usuario.registro = document.getElementById('registroDiretor').value || `DIR${Date.now().toString().slice(-3)}`;
      usuario.nivelAcesso = document.getElementById('nivelAcessoDiretor').value || 'completo';
      break;
    
    case 'secretario': 
      usuario.registro = document.getElementById('registroSecretario').value || `SEC${Date.now().toString().slice(-3)}`;
      usuario.nivelAcesso = document.getElementById('nivelAcessoSecretario').value || 'matriculas';
      break;
  }

  const resultado = adicionarUsuario(usuario);
  
  if (resultado.success) {
    //mostra informacoes de login para o novo usuario
    const mensagem = `
      ${resultado.message}
      
      Informações de Acesso:
      Nome: ${usuario.nome}
      CPF: ${usuario.cpf}
      Senha: ${usuario.senha}
      Perfil: ${usuario.perfil}
      ${usuario.matricula ? `Matrícula: ${usuario.matricula}` : ''}
      
      Anote estas informações! O usuário deve alterar a senha no primeiro acesso.
    `;
    
    alert(mensagem);
    
    event.target.reset();
    
    document.querySelectorAll('.campos-especificos').forEach(campo => {
      campo.style.display = 'none';
    });
    
    //redireciona de volta apos 3 segundos
    setTimeout(() => {
      window.location.href = 'admin.html';
    }, 3000);
    
  } else {
    alert(`❌ ${resultado.message}`);
  }
  
  return false;
}

function validarCPF(cpf) {
  cpf = cpf.replace(/\D/g, '');
  return cpf.length === 11;
}

function obterUsuariosParaCadastro() {
    try {
        const usuariosSalvos = localStorage.getItem('usuariosPortalAcademico');
        return usuariosSalvos ? JSON.parse(usuariosSalvos) : [];
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        return [];
    }
}

function gerarMatricula() {
    const usuarios = obterUsuariosParaCadastro();
    const ano = new Date().getFullYear();
    const totalAlunos = usuarios.filter(u => u.perfil === 'aluno').length;
    const sequencial = (totalAlunos + 1).toString().padStart(4, '0');
    return `${ano}${sequencial}`;
}

function adicionarUsuario(usuario) {
    const usuarios = obterUsuariosParaCadastro();
    
    //verifica se cpf ja existe
    const cpfExistente = usuarios.find(user => 
        user.cpf.replace(/\D/g, '') === usuario.cpf.replace(/\D/g, '')
    );
    
    if (cpfExistente) {
        return {success: false, message: 'CPF já cadastrado no sistema'};
    }
    
    usuarios.push(usuario);
    
    try {
        localStorage.setItem('usuariosPortalAcademico', JSON.stringify(usuarios));
        return {success: true, message: 'Usuário cadastrado com sucesso'};
    } catch (error) {
        console.error('Erro ao salvar usuário:', error);
        return {success: false, message: 'Erro ao salvar usuário'};
    }
}