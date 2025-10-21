let alunoLogado = null;
let disciplinas = [];
let disciplinaSelecionada = null;
let notas = [];
let frequencias = [];

document.addEventListener('DOMContentLoaded', function() {
    console.log('=== PORTAL DO ALUNO CARREGADO ===');
    
    //verifica se o usuario ta logado e se eh aluno
    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
    
    if (!usuarioLogado || usuarioLogado.perfil !== 'aluno') {
        alert('Acesso negado! Esta área é restrita para alunos.');
        window.location.href = 'login.html';
        return;
    }
    
    alunoLogado = usuarioLogado;
    carregarDadosAluno();
    carregarDisciplinas();
    
    //botao sair
    document.querySelector('.btn-sair').addEventListener('click', function() {
        sessionStorage.removeItem('usuarioLogado');
        window.location.href = 'login.html';
    });
    
    //atualiza a data no canto inferior da pagina
    document.getElementById('data-atual').textContent = new Date().toLocaleDateString('pt-BR');
});

function carregarDadosAluno() {
    const nomeFormatado = formatarNome(alunoLogado.nome);
    
    document.getElementById('nomeAluno').textContent = nomeFormatado;
    document.getElementById('matriculaAluno').textContent = `📋 Matrícula: ${alunoLogado.matricula || 'N/A'}`;
    
    const turmaFormatada = formatarTurma(alunoLogado.turma);
    document.getElementById('turmaAluno').textContent = turmaFormatada;
}

function formatarNome(nome) {
    return nome.split(' ')
        .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase())
        .join(' ');
}

function formatarTurma(turma) {
    if (!turma) return 'Turma não definida';
    
    const turmaUpper = turma.toUpperCase();
    
    if (turmaUpper.match(/^\d[A-Z]$/)) {
        const ano = turmaUpper.charAt(0);
        const turmaLetra = turmaUpper.charAt(1);
        return `${ano}º Ano ${turmaLetra}`;
    }
    
    if (turmaUpper.match(/^\dº\s*ANO\s*[A-Z]$/i)) {
        return turmaUpper.replace(/(\d)\s*º\s*ANO\s*([A-Z])/i, '$1º Ano $2');
    }
    
    return turma;
}

async function carregarDisciplinas() {
    //simulador de carregamento
    setTimeout(() => {
        disciplinas = [
            {
                id: 1,
                nome: "Matemática",
                professor: "Prof. Carlos Silva",
                codigo: "MAT-101",
                cargaHoraria: "80h",
                notaAtual: 8.5,
                frequenciaAtual: 95
            },
            {
                id: 2,
                nome: "Português",
                professor: "Prof. Ana Santos",
                codigo: "POR-102",
                cargaHoraria: "80h",
                notaAtual: 7.2,
                frequenciaAtual: 88
            },
            {
                id: 3,
                nome: "História",
                professor: "Prof. Ricardo Lima",
                codigo: "HIS-103",
                cargaHoraria: "60h",
                notaAtual: 9.0,
                frequenciaAtual: 98
            },
            {
                id: 4,
                nome: "Física",
                professor: "Prof. Mariana Costa",
                codigo: "FIS-104",
                cargaHoraria: "80h",
                notaAtual: 6.8,
                frequenciaAtual: 92
            }
        ];
        
        atualizarMetricas();
        renderizarDisciplinas();
    }, 1000);
}

function renderizarDisciplinas() {
    const container = document.getElementById('lista-disciplinas');
    
    if (disciplinas.length === 0) {
        container.innerHTML = `
            <div class="sem-dados" style="display: block; grid-column: 1 / -1;">
                <div class="icone-sem-dados">📚</div>
                <h3>Nenhuma disciplina matriculada</h3>
                <p>Entre em contato com a secretaria para regularizar sua matrícula.</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    disciplinas.forEach(disciplina => {
        html += `
            <div class="card-disciplina" onclick="selecionarDisciplina(${disciplina.id})">
                <h3>${disciplina.nome}</h3>
                <p class="professor">${disciplina.professor}</p>
                <div class="info-disciplina">
                    <div class="nota-atual">
                        <span class="valor">${disciplina.notaAtual}</span>
                        <span class="label">Nota Atual</span>
                    </div>
                    <div class="frequencia-atual">
                        <span class="valor">${disciplina.frequenciaAtual}%</span>
                        <span class="label">Frequência</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function atualizarMetricas() {
    const totalDisciplinas = disciplinas.length;
    const mediaGeral = disciplinas.reduce((sum, disc) => sum + disc.notaAtual, 0) / totalDisciplinas;
    const frequenciaGeral = disciplinas.reduce((sum, disc) => sum + disc.frequenciaAtual, 0) / totalDisciplinas;
    
    document.getElementById('totalDisciplinas').textContent = totalDisciplinas;
    document.getElementById('mediaGeral').textContent = mediaGeral.toFixed(1);
    document.getElementById('frequenciaGeral').textContent = Math.round(frequenciaGeral) + '%';
}

function selecionarDisciplina(disciplinaId) {
    disciplinaSelecionada = disciplinas.find(d => d.id === disciplinaId);
    
    if (!disciplinaSelecionada) return;
    
    document.getElementById('titulo-disciplina').textContent = disciplinaSelecionada.nome;
    
    //esconde a secao de disciplinas e mostra detalhes
    document.querySelector('.secao-disciplinas').style.display = 'none';
    document.getElementById('secao-detalhes').style.display = 'block';
    
    //carrega os dados da disciplina selecionada
    carregarNotasDisciplina();
    carregarFrequenciaDisciplina();
    
    //volta para a aba de notas
    mostrarAba('notas');
}

function voltarParaDisciplinas() {
    document.getElementById('secao-detalhes').style.display = 'none';
    document.querySelector('.secao-disciplinas').style.display = 'block';
    disciplinaSelecionada = null;
}

function mostrarAba(aba) {
    document.querySelectorAll('.aba-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.querySelectorAll('.aba-conteudo').forEach(conteudo => {
        conteudo.classList.remove('active');
    });
    
    document.querySelector(`.aba-btn[onclick="mostrarAba('${aba}')"]`).classList.add('active');
    document.getElementById(`aba-${aba}`).classList.add('active');
}

async function carregarNotasDisciplina() {
    //simulador de carregamento de notas especificas da disciplina
    notas = [
        {
            id: 1,
            disciplinaId: disciplinaSelecionada.id,
            bimestre: 1,
            av1: 8.5,
            av2: 7.0,
            av3: 9.0,
            media: 8.2,
            situacao: "aprovado"
        },
        {
            id: 2,
            disciplinaId: disciplinaSelecionada.id,
            bimestre: 2,
            av1: 7.5,
            av2: 8.0,
            av3: null,
            media: 7.8,
            situacao: "cursando"
        }
    ];
    
    renderizarNotas();
    atualizarResumoNotas();
}

function renderizarNotas() {
    const corpoTabela = document.getElementById('corpo-notas');
    const semNotas = document.getElementById('sem-notas');
    
    if (notas.length === 0) {
        corpoTabela.innerHTML = '';
        semNotas.style.display = 'block';
        return;
    }
    
    semNotas.style.display = 'none';
    
    let html = '';
    notas.forEach(nota => {
        const situacaoClass = `badge-situacao badge-${nota.situacao}`;
        const situacaoText = {
            'aprovado': 'Aprovado',
            'recuperacao': 'Recuperação',
            'reprovado': 'Reprovado',
            'cursando': 'Cursando'
        }[nota.situacao] || nota.situacao;
        
        html += `
            <tr>
                <td><strong>${nota.bimestre}º Bimestre</strong></td>
                <td>${nota.av1 || '-'}</td>
                <td>${nota.av2 || '-'}</td>
                <td>${nota.av3 || '-'}</td>
                <td><strong>${nota.media.toFixed(1)}</strong></td>
                <td><span class="${situacaoClass}">${situacaoText}</span></td>
            </tr>
        `;
    });
    
    corpoTabela.innerHTML = html;
}

function atualizarResumoNotas() {
    const mediaDisciplina = disciplinaSelecionada.notaAtual;
    const bimestresLancados = notas.length;
    
    //determina a situação baseada na média
    let situacao = 'Cursando';
    let situacaoClass = 'badge-cursando';
    
    if (mediaDisciplina >= 7) {
        situacao = 'Aprovado';
        situacaoClass = 'badge-aprovado';
    } else if (mediaDisciplina >= 5) {
        situacao = 'Recuperação';
        situacaoClass = 'badge-recuperacao';
    } else if (mediaDisciplina > 0) {
        situacao = 'Reprovado';
        situacaoClass = 'badge-reprovado';
    }
    
    document.getElementById('media-disciplina').textContent = mediaDisciplina.toFixed(1);
    document.getElementById('situacao-disciplina').textContent = situacao;
    document.getElementById('bimestres-lancados').textContent = bimestresLancados;
}

async function carregarFrequenciaDisciplina() {
    //simulador de carregamento de frequencia especifica da disciplina
    frequencias = [
        {
            id: 1,
            disciplinaId: disciplinaSelecionada.id,
            data: "2025-03-15",
            status: "presente",
            observacoes: ""
        },
        {
            id: 2,
            disciplinaId: disciplinaSelecionada.id,
            data: "2025-03-17",
            status: "presente",
            observacoes: ""
        },
        {
            id: 3,
            disciplinaId: disciplinaSelecionada.id,
            data: "2025-03-20",
            status: "falta",
            observacoes: "Não justificada"
        },
        {
            id: 4,
            disciplinaId: disciplinaSelecionada.id,
            data: "2025-03-22",
            status: "justificada",
            observacoes: "Atestado médico"
        }
    ];
    
    renderizarFrequencia();
    atualizarResumoFrequencia();
}

function renderizarFrequencia() {
    const corpoTabela = document.getElementById('corpo-frequencia');
    const semFrequencia = document.getElementById('sem-frequencia');
    
    if (frequencias.length === 0) {
        corpoTabela.innerHTML = '';
        semFrequencia.style.display = 'block';
        return;
    }
    
    semFrequencia.style.display = 'none';
    
    let html = '';
    frequencias.forEach(freq => {
        const statusClass = `status-presenca status-${freq.status}`;
        const statusText = {
            'presente': 'Presente',
            'falta': 'Falta',
            'justificada': 'Justificada'
        }[freq.status] || freq.status;
        
        const dataFormatada = new Date(freq.data).toLocaleDateString('pt-BR');
        const diaSemana = new Date(freq.data).toLocaleDateString('pt-BR', { weekday: 'long' });
        const diaSemanaFormatado = diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1);
        
        html += `
            <tr>
                <td><strong>${dataFormatada}</strong></td>
                <td>${diaSemanaFormatado}</td>
                <td><span class="${statusClass}">${statusText}</span></td>
                <td>${freq.observacoes || '-'}</td>
            </tr>
        `;
    });
    
    corpoTabela.innerHTML = html;
}

function atualizarResumoFrequencia() {
    const totalRegistros = frequencias.length;
    const totalPresencas = frequencias.filter(f => f.status === 'presente').length;
    const totalFaltas = frequencias.filter(f => f.status === 'falta').length;
    const totalJustificadas = frequencias.filter(f => f.status === 'justificada').length;
    const frequenciaPercentual = totalRegistros > 0 ? Math.round((totalPresencas / totalRegistros) * 100) : 0;
    
    document.getElementById('frequencia-disciplina').textContent = frequenciaPercentual + '%';
    document.getElementById('total-presencas').textContent = totalPresencas;
    document.getElementById('total-faltas').textContent = totalFaltas;
    document.getElementById('total-justificadas').textContent = totalJustificadas;
}

function filtrarFrequencia() {
    const mesFiltro = document.getElementById('filtro-mes').value;
    
    let frequenciasFiltradas = frequencias;
    
    if (mesFiltro !== 'todos') {
        frequenciasFiltradas = frequencias.filter(freq => {
            const data = new Date(freq.data);
            return (data.getMonth() + 1).toString() === mesFiltro;
        });
    }
    
    //atualiza a tabela com frequencia filtrada
    const corpoTabela = document.getElementById('corpo-frequencia');
    const semFrequencia = document.getElementById('sem-frequencia');
    
    if (frequenciasFiltradas.length === 0) {
        corpoTabela.innerHTML = '';
        semFrequencia.style.display = 'block';
        return;
    }
    
    semFrequencia.style.display = 'none';
    
    let html = '';
    frequenciasFiltradas.forEach(freq => {
        const statusClass = `status-presenca status-${freq.status}`;
        const statusText = {
            'presente': 'Presente',
            'falta': 'Falta',
            'justificada': 'Justificada'
        }[freq.status] || freq.status;
        
        const dataFormatada = new Date(freq.data).toLocaleDateString('pt-BR');
        const diaSemana = new Date(freq.data).toLocaleDateString('pt-BR', { weekday: 'long' });
        const diaSemanaFormatado = diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1);
        
        html += `
            <tr>
                <td><strong>${dataFormatada}</strong></td>
                <td>${diaSemanaFormatado}</td>
                <td><span class="${statusClass}">${statusText}</span></td>
                <td>${freq.observacoes || '-'}</td>
            </tr>
        `;
    });
    
    corpoTabela.innerHTML = html;
}