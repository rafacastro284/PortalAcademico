document.addEventListener('DOMContentLoaded', function() {
    console.log('=== PÁGINA VISUALIZAR USUÁRIOS CARREGADA ===');
    
    //verifica se o usuario ta logado e se eh admin
    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
    
    if (!usuarioLogado || usuarioLogado.perfil !== 'admin') {
        alert('Acesso negado! Esta área é restrita para administradores.');
        window.location.href = 'login.html';
        return;
    }
    
    //infos do admin
    document.getElementById('nomeAdmin').textContent = `Olá, ${usuarioLogado.nome}!`;
    
    //botão de sair
    document.querySelector('.btn-sair').addEventListener('click', function() {
        sessionStorage.removeItem('usuarioLogado');
        window.location.href = 'login.html';
    });
    
    carregarUsuarios();
    
    console.log('Página de visualização configurada com sucesso!');
});

function obterUsuarios() {
    try {
        const usuariosSalvos = localStorage.getItem('usuariosPortalAcademico');
        if (!usuariosSalvos) {
            console.log('Nenhum dado encontrado no localStorage');
            return [];
        }
        
        const usuarios = JSON.parse(usuariosSalvos);
        console.log('Usuários carregados:', usuarios.length);
        return usuarios;
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        return [];
    }
}

function carregarUsuarios() {
    console.log('Carregando usuários...');
    
    const usuarios = obterUsuarios();
    const corpoTabela = document.getElementById('corpoTabela');
    const semUsuarios = document.getElementById('semUsuarios');
    
    atualizarMetricas(usuarios);
    
    if (usuarios.length === 0) {
        corpoTabela.innerHTML = '';
        semUsuarios.style.display = 'block';
        console.log('Nenhum usuário para exibir');
        return;
    }
    
    semUsuarios.style.display = 'none';
    
    let html = '';
    
    usuarios.forEach((usuario, index) => {
        const dataCadastro = usuario.dataCadastro 
            ? new Date(usuario.dataCadastro).toLocaleDateString('pt-BR')
            : 'Não informada';
        
        let badgeClass = 'perfil-badge ';
        let badgeText = '';
        
        switch(usuario.perfil) {
            case 'admin':
                badgeClass += 'admin';
                badgeText = 'ADMIN';
                break;
            case 'professor':
                badgeClass += 'professor';
                badgeText = 'PROFESSOR';
                break;
            case 'aluno':
                badgeClass += 'aluno';
                badgeText = 'ALUNO';
                break;
            case 'diretor':
                badgeClass += 'diretor';
                badgeText = 'DIRETOR';
                break;
            default:
                badgeClass += 'aluno';
                badgeText = usuario.perfil?.toUpperCase() || 'USUÁRIO';
        }
        
        html += `
            <tr>
                <td><strong>${usuario.nome || 'Não informado'}</strong></td>
                <td>${usuario.cpf || 'Não informado'}</td>
                <td><span class="${badgeClass}">${badgeText}</span></td>
                <td>${usuario.matricula || usuario.registro || '-'}</td>
                <td>${usuario.email || '-'}</td>
                <td>${dataCadastro}</td>
                <td>
                    <button class="btn-acao btn-editar" onclick="editarUsuario('${usuario.cpf}')">Editar</button>
                    <button class="btn-acao btn-excluir" onclick="excluirUsuario('${usuario.cpf}')">Excluir</button>
                </td>
            </tr>
        `;
    });
    
    corpoTabela.innerHTML = html;
    console.log('Tabela carregada com', usuarios.length, 'usuários');
}

function atualizarMetricas(usuarios) {
    const totalUsuarios = usuarios.length;
    const totalAlunos = usuarios.filter(user => user.perfil === 'aluno').length;
    const totalProfessores = usuarios.filter(user => user.perfil === 'professor').length;
    const totalDiretores = usuarios.filter(user => user.perfil === 'diretor').length; 
    const totalAdmins = usuarios.filter(user => user.perfil === 'admin').length;
    
    document.getElementById('totalUsuarios').textContent = totalUsuarios;
    document.getElementById('totalAlunos').textContent = totalAlunos;
    document.getElementById('totalProfessores').textContent = totalProfessores;
    document.getElementById('totalAdmins').textContent = totalAdmins;
    document.getElementById('totalDiretores').textContent = totalDiretores;
    
    console.log('Métricas atualizadas:', { totalUsuarios, totalAlunos, totalProfessores,totalDiretores, totalAdmins });
}

function filtrarUsuarios() {
    const filtroPerfil = document.getElementById('filtroPerfil').value;
    const termoBusca = document.getElementById('buscar').value.toLowerCase();
    const usuarios = obterUsuarios();
    
    let usuariosFiltrados = usuarios;
    
    if (filtroPerfil !== 'todos') {
        usuariosFiltrados = usuariosFiltrados.filter(user => user.perfil === filtroPerfil);
    }
    
    if (termoBusca) {
        usuariosFiltrados = usuariosFiltrados.filter(user => 
            (user.nome && user.nome.toLowerCase().includes(termoBusca)) ||
            (user.cpf && user.cpf.includes(termoBusca)) ||
            (user.email && user.email.toLowerCase().includes(termoBusca)) ||
            (user.matricula && user.matricula.toLowerCase().includes(termoBusca)) ||
            (user.registro && user.registro.toLowerCase().includes(termoBusca))
        );
    }
    
    //atualiza a tabela com os usuarios filtrados
    const corpoTabela = document.getElementById('corpoTabela');
    const semUsuarios = document.getElementById('semUsuarios');
    
    if (usuariosFiltrados.length === 0) {
        corpoTabela.innerHTML = '';
        semUsuarios.style.display = 'block';
        semUsuarios.innerHTML = `
            <div class="icone-sem-dados">🔍</div>
            <h3>Nenhum usuário encontrado</h3>
            <p>Tente alterar os filtros ou termos de busca.</p>
        `;
        return;
    }
    
    semUsuarios.style.display = 'none';
    
    //monta a tabela com os dados filtrados
    let html = '';
    usuariosFiltrados.forEach(usuario => {
        const dataCadastro = usuario.dataCadastro 
            ? new Date(usuario.dataCadastro).toLocaleDateString('pt-BR')
            : 'Não informada';
        
        let badgeClass = 'perfil-badge ';
        switch(usuario.perfil) {
            case 'admin': badgeClass += 'admin'; break;
            case 'professor': badgeClass += 'professor'; break;
            case 'aluno': badgeClass += 'aluno'; break;
        }
        
        html += `
            <tr>
                <td><strong>${usuario.nome}</strong></td>
                <td>${usuario.cpf}</td>
                <td><span class="${badgeClass}">${usuario.perfil.toUpperCase()}</span></td>
                <td>${usuario.matricula || usuario.registro || '-'}</td>
                <td>${usuario.email || '-'}</td>
                <td>${dataCadastro}</td>
                <td>
                    <button class="btn-acao btn-editar" onclick="editarUsuario('${usuario.cpf}')">Editar</button>
                    <button class="btn-acao btn-excluir" onclick="excluirUsuario('${usuario.cpf}')">Excluir</button>
                </td>
            </tr>
        `;
    });
    
    corpoTabela.innerHTML = html;
}

function editarUsuario(cpf) {
    console.log('Editando usuário com CPF:', cpf);
    
    const usuarios = obterUsuarios();
    const usuario = usuarios.find(user => user.cpf === cpf);
    
    if (!usuario) {
        alert('Usuário não encontrado!');
        return;
    }
    
    // Cria um formulário de edição simples
    const novoNome = prompt('Editar nome:', usuario.nome || '');
    if (novoNome === null) return; // Usuário cancelou
    
    const novoEmail = prompt('Editar email:', usuario.email || '');
    if (novoEmail === null) return;
    
    // Atualiza os dados do usuário
    usuario.nome = novoNome.trim();
    usuario.email = novoEmail.trim();
    
    // Salva as alterações
    localStorage.setItem('usuariosPortalAcademico', JSON.stringify(usuarios));
    
    // Recarrega a tabela
    carregarUsuarios();
    
    alert('Usuário atualizado com sucesso!');
    console.log('Usuário editado:', usuario);
}

function excluirUsuario(cpf) {
    console.log('Excluindo usuário com CPF:', cpf);
    
    const usuarios = obterUsuarios();
    const usuario = usuarios.find(user => user.cpf === cpf);
    
    if (!usuario) {
        alert('Usuário não encontrado!');
        return;
    }
    
    // Confirmação de exclusão
    const confirmacao = confirm(`Tem certeza que deseja excluir o usuário:\n\nNome: ${usuario.nome}\nCPF: ${usuario.cpf}\nPerfil: ${usuario.perfil}\n\nEsta ação não pode ser desfeita!`);
    
    if (!confirmacao) return;
    
    // Remove o usuário do array
    const usuariosAtualizados = usuarios.filter(user => user.cpf !== cpf);
    
    // Salva no localStorage
    localStorage.setItem('usuariosPortalAcademico', JSON.stringify(usuariosAtualizados));
    
    // Recarrega a tabela
    carregarUsuarios();
    
    alert('Usuário excluído com sucesso!');
    console.log('Usuário excluído:', usuario);
}