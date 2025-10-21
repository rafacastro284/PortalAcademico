//"banco de dados" dos usuarios - exemplo/teste
let usuarios = [];

function carregarUsuarios() {
    const usuariosSalvos = localStorage.getItem('usuariosPortalAcademico');
    if (usuariosSalvos) {
        usuarios = JSON.parse(usuariosSalvos);
        console.log('Usuários carregados do localStorage:', usuarios.length, 'usuários');
    } else {
        console.log('Criando usuários padrão...');
        usuarios = [
            {
                cpf: "111.111.111-11",
                senha: "1111111111",
                perfil: "admin",
                nome: "Joana Maria",
                email: "admin@escola.com",
                dataCadastro: new Date().toISOString()
            },
            {
                cpf: "888.888.888-88",
                senha: "8888888888",
                perfil: "aluno",
                nome: "Fernanda Lima", 
                matricula: "8888888888",
                email: "aluna@escola.com",
                turma: "8A",
                dataCadastro: new Date().toISOString()
            },
            {
              cpf: "444.444.444-44",
              senha: "4444444444",
              perfil: "aluno",
              nome: "Eduardo Pereira",
              matricula: "4444444444",
              email: "aluno@escola.com",
              turma: "8A",
              dataCadastro: new Date().toISOString()
            },
            {
                cpf: "222.222.222-22",
                senha: "2222222222",
                perfil: "professor",
                nome: "Carlos Silva",
                registro: "PROF001",
                email: "elverton@escola.com",
                disciplina: "matematica",
                dataCadastro: new Date().toISOString()
            },
            {
                cpf: "333.333.333-33",
                senha: "3333333333", 
                perfil: "diretor",
                nome: "Jorge Amado",
                registro: "DIR001",
                email: "diretor@escola.com",
                dataCadastro: new Date().toISOString()
            },
            {
              cpf: "999.999.999-99",
              senha: "9999999999",
              perfil: "secretario",
              nome: "Elzébio da Paz",
              registro: "SEC001",
              email: "secretario@escola.com",
              dataCadastro: new Date().toISOString()
            }
        ];
        localStorage.setItem('usuariosPortalAcademico', JSON.stringify(usuarios));
        console.log('Usuários criados manualmente!');
        console.log('Total:', JSON.parse(localStorage.getItem('usuariosPortalAcademico')).length);
        salvarUsuarios(); 
        console.log('Usuários padrão criados:', usuarios);
    }
}

function salvarUsuarios() {
    localStorage.setItem('usuariosPortalAcademico', JSON.stringify(usuarios));
    console.log('Usuários salvos no localStorage:', usuarios.length, 'usuários');
}

carregarUsuarios();

//adicionar novo usuario - apenas admin pode add
function adicionarUsuario(novoUsuario){
  //verifica se cpf ja existe
  const cpfExistente = usuarios.find(user => 
    user.cpf.replace(/\D/g, '') === novoUsuario.cpf.replace(/\D/g, '')
  );
  
  if (cpfExistente){
    return {success: false, message: 'CPF já cadastrado no sistema'};
  }
  
  usuarios.push(novoUsuario);
  salvarUsuarios(); 
  return {success: true, message: 'Usuário cadastrado com sucesso'};
}

function autenticarUsuario(cpf, senha){
  const cpfLimpo = cpf.replace(/\D/g, '');
  
  const usuario = usuarios.find(user => {
    const userCpfLimpo = user.cpf.replace(/\D/g, '');
    return userCpfLimpo === cpfLimpo && user.senha === senha;
  });
  
  return usuario || null;
}

