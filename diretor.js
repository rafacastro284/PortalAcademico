let diretorLogado = null;
let dadosEscola = {};
let relatorioAtual = null;

document.addEventListener('DOMContentLoaded', function() {
    console.log('=== PORTAL DO DIRETOR CARREGADO ===');
    
    //verifica se o usuario ta logado e se eh diretor
    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
    
    if (!usuarioLogado || usuarioLogado.perfil !== 'diretor') {
        alert('Acesso negado! Esta área é restrita para diretores.');
        window.location.href = 'login.html';
        return;
    }
    
    diretorLogado = usuarioLogado;
    carregarDadosDiretor();
    carregarDadosEscola();
    
    //botao de sair
    document.querySelector('.btn-sair').addEventListener('click', function() {
        sessionStorage.removeItem('usuarioLogado');
        window.location.href = 'login.html';
    });
    
    document.getElementById('data-atual').textContent = new Date().toLocaleDateString('pt-BR');
});

function carregarDadosDiretor() {
    const nomeFormatado = formatarNome(diretorLogado.nome);
    
    document.getElementById('nomeDiretor').textContent = nomeFormatado;
    document.getElementById('registroDiretor').textContent = `Registro: ${diretorLogado.registro || 'DIR001'}`;
}

function formatarNome(nome) {
    return nome.split(' ')
        .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase())
        .join(' ');
}

async function carregarDadosEscola() {
    //simulador de carregamento de dados
    setTimeout(() => {
        dadosEscola = {
            totalAlunos: 285,
            totalProfessores: 18,
            totalTurmas: 12,
            mediaGeral: 7.8,
            turmas: [
                { nome: "6º Ano A", totalAlunos: 24, media: 8.2, frequencia: 94 },
                { nome: "6º Ano B", totalAlunos: 26, media: 7.9, frequencia: 92 },
                { nome: "7º Ano A", totalAlunos: 28, media: 7.8, frequencia: 91 },
                { nome: "7º Ano B", totalAlunos: 25, media: 7.6, frequencia: 89 },
                { nome: "8º Ano A", totalAlunos: 30, media: 7.5, frequencia: 88 },
                { nome: "8º Ano B", totalAlunos: 27, media: 7.7, frequencia: 90 },
                { nome: "9º Ano A", totalAlunos: 32, media: 8.0, frequencia: 93 },
                { nome: "9º Ano B", totalAlunos: 28, media: 7.9, frequencia: 92 }
            ],
            professores: [
                { nome: "Carlos Silva", registro: "PROF001", disciplina: "Matemática", turmas: ["9A", "9B"], status: "ativo" },
                { nome: "Ana Santos", registro: "PROF002", disciplina: "Português", turmas: ["8A", "8B"], status: "ativo" },
                { nome: "Ricardo Lima", registro: "PROF003", disciplina: "História", turmas: ["7A", "7B"], status: "ativo" },
                { nome: "Mariana Costa", registro: "PROF004", disciplina: "Física", turmas: ["9A", "9B"], status: "ativo" }
            ],
            desempenhoAlunos: [
                { nome: "Ana Clara Silva", turma: "9A", media: 8.5, frequencia: 95, situacao: "aprovado" },
                { nome: "Bruno Oliveira", turma: "9A", media: 7.2, frequencia: 88, situacao: "aprovado" },
                { nome: "Carla Rodrigues", turma: "9B", media: 6.8, frequencia: 92, situacao: "recuperacao" },
                { nome: "Daniel Costa", turma: "9B", media: 9.0, frequencia: 98, situacao: "aprovado" },
                { nome: "Eduardo Pereira", turma: "8A", media: 5.5, frequencia: 85, situacao: "recuperacao" },
                { nome: "Fernanda Lima", turma: "8A", media: 8.8, frequencia: 96, situacao: "aprovado" }
            ]
        };
        
        atualizarMetricas();
    }, 1000);
}

function atualizarMetricas() {
    document.getElementById('totalAlunos').textContent = dadosEscola.totalAlunos;
    document.getElementById('totalProfessores').textContent = dadosEscola.totalProfessores;
    document.getElementById('totalTurmas').textContent = dadosEscola.totalTurmas;
    document.getElementById('mediaGeral').textContent = dadosEscola.mediaGeral.toFixed(1);
}

function mostrarRelatorio(tipo) {
    relatorioAtual = tipo;
    
    //esconde visao geral e mostra relatorios
    document.querySelector('.secao-visao-geral').style.display = 'none';
    document.getElementById('secao-relatorios').style.display = 'block';
    
    //atualiza titulo do relatorio
    const titulos = {
        'desempenho': 'Desempenho Acadêmico',
        'frequencia': 'Frequência Escolar',
        'professores': 'Corpo Docente',
        'turmas': 'Turmas e Séries',
        'disciplinas': 'Desempenho por Disciplina'
    };
    
    document.getElementById('titulo-relatorio').textContent = titulos[tipo] || 'Relatório';
    
    //esconde todos os conteúdos de relatório
    document.querySelectorAll('.relatorio-conteudo').forEach(conteudo => {
        conteudo.style.display = 'none';
    });
    
    document.getElementById(`relatorio-${tipo}`).style.display = 'block';
    
    switch(tipo) {
        case 'desempenho':
            carregarRelatorioDesempenho();
            break;
        case 'frequencia':
            carregarRelatorioFrequencia();
            break;
        case 'professores':
            carregarRelatorioProfessores();
            break;
        case 'turmas':
            carregarRelatorioTurmas();
            break;
        case 'disciplinas':
            carregarRelatorioDisciplinas();
            break;
    }
}

function voltarParaVisaoGeral() {
    document.getElementById('secao-relatorios').style.display = 'none';
    document.querySelector('.secao-visao-geral').style.display = 'block';
    relatorioAtual = null;
}

function filtrarRelatorio() {
    if (relatorioAtual) {
        switch(relatorioAtual) {
            case 'desempenho':
                carregarRelatorioDesempenho();
                break;
            case 'frequencia':
                carregarRelatorioFrequencia();
                break;
            case 'professores':
                carregarRelatorioProfessores();
                break;
        }
    }
}

function carregarRelatorioDesempenho() {
    const filtroTurma = document.getElementById('filtro-turma').value;
    
    let alunosFiltrados = dadosEscola.desempenhoAlunos;
    
    if (filtroTurma !== 'todas') {
        alunosFiltrados = alunosFiltrados.filter(aluno => aluno.turma === filtroTurma);
    }
    
    const mediaGeral = alunosFiltrados.reduce((sum, aluno) => sum + aluno.media, 0) / alunosFiltrados.length;
    const aprovados = alunosFiltrados.filter(aluno => aluno.situacao === 'aprovado').length;
    const recuperacao = alunosFiltrados.filter(aluno => aluno.situacao === 'recuperacao').length;
    const reprovados = alunosFiltrados.filter(aluno => aluno.situacao === 'reprovado').length;
    
    document.getElementById('media-geral-turma').textContent = mediaGeral.toFixed(1);
    document.getElementById('aprovados-turma').textContent = aprovados;
    document.getElementById('recuperacao-turma').textContent = recuperacao;
    document.getElementById('reprovados-turma').textContent = reprovados;
    
    const corpoTabela = document.getElementById('corpo-desempenho');
    
    let html = '';
    alunosFiltrados.forEach(aluno => {
        const situacaoClass = `badge-status badge-${aluno.situacao}`;
        const situacaoText = {
            'aprovado': 'Aprovado',
            'recuperacao': 'Recuperação',
            'reprovado': 'Reprovado'
        }[aluno.situacao] || aluno.situacao;
        
        html += `
            <tr>
                <td><strong>${aluno.nome}</strong></td>
                <td>${aluno.turma}</td>
                <td>${aluno.media.toFixed(1)}</td>
                <td>${aluno.frequencia}%</td>
                <td><span class="${situacaoClass}">${situacaoText}</span></td>
            </tr>
        `;
    });
    
    corpoTabela.innerHTML = html;
}

function carregarRelatorioFrequencia() {
    const filtroTurma = document.getElementById('filtro-turma').value;
    
    let turmasFiltradas = dadosEscola.turmas;
    
    if (filtroTurma !== 'todas') {
        turmasFiltradas = turmasFiltradas.filter(turma => turma.nome.includes(filtroTurma));
    }
    
    const frequenciaGeral = turmasFiltradas.reduce((sum, turma) => sum + turma.frequencia, 0) / turmasFiltradas.length;
    const totalPresencas = turmasFiltradas.reduce((sum, turma) => sum + Math.round(turma.totalAlunos * turma.frequencia / 100), 0);
    const totalFaltas = turmasFiltradas.reduce((sum, turma) => sum + Math.round(turma.totalAlunos * (100 - turma.frequencia) / 100), 0);
    const alunosCriticos = turmasFiltradas.reduce((sum, turma) => sum + Math.round(turma.totalAlunos * 0.1), 0); // 10% com baixa frequência
    
    document.getElementById('frequencia-geral').textContent = frequenciaGeral.toFixed(1) + '%';
    document.getElementById('total-presencas').textContent = totalPresencas;
    document.getElementById('total-faltas').textContent = totalFaltas;
    document.getElementById('alunos-criticos').textContent = alunosCriticos;
    
    const corpoTabela = document.getElementById('corpo-frequencia');
    
    let html = '';
    turmasFiltradas.forEach(turma => {
        const statusClass = turma.frequencia >= 90 ? 'badge-aprovado' : 
                           turma.frequencia >= 80 ? 'badge-recuperacao' : 'badge-reprovado';
        const statusText = turma.frequencia >= 90 ? 'Ótima' : 
                          turma.frequencia >= 80 ? 'Atenção' : 'Crítica';
        
        html += `
            <tr>
                <td><strong>${turma.nome}</strong></td>
                <td>${turma.totalAlunos}</td>
                <td>${turma.frequencia}%</td>
                <td>${Math.round(turma.totalAlunos * 0.1)}</td>
                <td><span class="badge-status ${statusClass}">${statusText}</span></td>
            </tr>
        `;
    });
    
    corpoTabela.innerHTML = html;
}

function carregarRelatorioProfessores() {
    const corpoTabela = document.getElementById('corpo-professores');
    
    let html = '';
    dadosEscola.professores.forEach(professor => {
        const statusClass = professor.status === 'ativo' ? 'badge-ativo' : 'badge-inativo';
        const statusText = professor.status === 'ativo' ? 'Ativo' : 'Inativo';
        
        html += `
            <tr>
                <td><strong>${professor.nome}</strong></td>
                <td>${professor.registro}</td>
                <td>${professor.disciplina}</td>
                <td>${professor.turmas.join(', ')}</td>
                <td>${professor.turmas.length * 25}</td>
                <td><span class="badge-status ${statusClass}">${statusText}</span></td>
            </tr>
        `;
    });
    
    corpoTabela.innerHTML = html;
}
function carregarRelatorioTurmas() {
    console.log('Carregando relatório de turmas...');
    //necessario implementar ainda
}

function carregarRelatorioDisciplinas() {
    console.log('Carregando relatório de disciplinas...');
    //necessario implementar ainda
}

