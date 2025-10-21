let professorLogado = null;
let turmas = [];
let turmaSelecionada = null;
let alunosTurma = [];
let notasTurma = [];
let frequenciaTurma = [];

document.addEventListener('DOMContentLoaded', function() {
    console.log('=== PORTAL DO PROFESSOR CARREGADO ===');
    
    //verifica se o usuario ta logado e se eh professor
    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
    
    if (!usuarioLogado || usuarioLogado.perfil !== 'professor') {
        alert('Acesso negado! Esta área é restrita para professores.');
        window.location.href = 'login.html';
        return;
    }
    
    professorLogado = usuarioLogado;
    carregarDadosProfessor();
    carregarTurmas();
    
    //botao de sair
    document.querySelector('.btn-sair').addEventListener('click', function() {
        sessionStorage.removeItem('usuarioLogado');
        window.location.href = 'login.html';
    });
    
    //data padrao para frequencia
    document.getElementById('data-frequencia').value = new Date().toISOString().split('T')[0];
    
    //atualiza data no rodape
    document.getElementById('data-atual').textContent = new Date().toLocaleDateString('pt-BR');
});

function carregarDadosProfessor() {
    const nomeFormatado = formatarNome(professorLogado.nome);
    
    document.getElementById('nomeProfessor').textContent = nomeFormatado;
    document.getElementById('registroProfessor').textContent = `Registro: ${professorLogado.registro || 'N/A'}`;
    document.getElementById('materiaProfessor').textContent = `Matéria: ${professorLogado.disciplina || 'N/A'}`;
}

function formatarNome(nome) {
    return nome.split(' ')
        .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase())
        .join(' ');
}

async function carregarTurmas() {
    //simulador de carregamento
    setTimeout(() => {
        turmas = [
            {
                id: 1,
                nome: "9º Ano A",
                disciplina: "Matemática",
                horario: "08:00-09:30",
                totalAlunos: 32,
                dias: "Segunda e Quarta"
            },
            {
                id: 2,
                nome: "9º Ano B",
                disciplina: "Matemática",
                horario: "10:00-11:30",
                totalAlunos: 28,
                dias: "Terça e Quinta"
            },
            {
                id: 3,
                nome: "1º Ano Médio A",
                disciplina: "Física",
                horario: "14:00-15:30",
                totalAlunos: 30,
                dias: "Segunda e Quarta"
            },
            {
                id: 4,
                nome: "2º Ano Médio B",
                disciplina: "Matemática",
                horario: "16:00-17:30",
                totalAlunos: 25,
                dias: "Terça e Quinta"
            }
        ];
        
        atualizarMetricas();
        renderizarTurmas();
    }, 1000);
}

function renderizarTurmas() {
    const container = document.getElementById('lista-turmas');
    
    if (turmas.length === 0) {
        container.innerHTML = `
            <div class="sem-dados" style="display: block; grid-column: 1 / -1;">
                <div class="icone-sem-dados">🧮</div>
                <h3>Nenhuma turma atribuída</h3>
                <p>Entre em contato com a coordenação para atribuição de turmas.</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    turmas.forEach(turma => {
        html += `
            <div class="card-turma" onclick="selecionarTurma(${turma.id})">
                <h3>${turma.nome}</h3>
                <p class="disciplina">${turma.disciplina}</p>
                <div class="info-turma">
                    <div class="alunos-turma">
                        <span class="valor">${turma.totalAlunos}</span>
                        <span class="label">Alunos</span>
                    </div>
                    <div class="horario-turma">
                        <span class="valor">${turma.horario}</span>
                        <span class="label">Horário</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function atualizarMetricas() {
    const totalTurmas = turmas.length;
    const totalAlunos = turmas.reduce((sum, turma) => sum + turma.totalAlunos, 0);
    const disciplinasUnicas = [...new Set(turmas.map(turma => turma.disciplina))].length;
    
    document.getElementById('totalTurmas').textContent = totalTurmas;
    document.getElementById('totalAlunos').textContent = totalAlunos;
    document.getElementById('totalDisciplinas').textContent = disciplinasUnicas;
}

function selecionarTurma(turmaId) {
    turmaSelecionada = turmas.find(t => t.id === turmaId);
    
    if (!turmaSelecionada) return;
    
    //atualiza as informacoes da turma
    document.getElementById('titulo-turma').textContent = turmaSelecionada.nome;
    document.getElementById('info-turma').textContent = `Disciplina: ${turmaSelecionada.disciplina} | Horário: ${turmaSelecionada.horario}`;
    
    //exconde a secao de turmas e mostra gerenciamento
    document.querySelector('.secao-turmas').style.display = 'none';
    document.getElementById('secao-gerenciar').style.display = 'block';
    
    //carrega os dados da turma selecionada
    carregarAlunosTurma();
    
    //reseta para a aba de alunos
    mostrarAba('alunos');
}

function voltarParaTurmas() {
    document.getElementById('secao-gerenciar').style.display = 'none';
    document.querySelector('.secao-turmas').style.display = 'block';
    turmaSelecionada = null;
    alunosTurma = [];
}

function mostrarAba(aba) {
    //remove a classe active de todas as abas
    document.querySelectorAll('.aba-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.querySelectorAll('.aba-conteudo').forEach(conteudo => {
        conteudo.classList.remove('active');
    });
    
    //adiciona a classe active na aba selecionada
    document.querySelector(`.aba-btn[onclick="mostrarAba('${aba}')"]`).classList.add('active');
    document.getElementById(`aba-${aba}`).classList.add('active');
    
    //carrega os dados especificos da aba
    if (aba === 'notas') {
        carregarFormularioNotas();
    } else if (aba === 'frequencia') {
        carregarFormularioFrequencia();
    }
}

async function carregarAlunosTurma() {
    //simulador de carregamento de alunos
    alunosTurma = [
        {
            id: 1,
            matricula: "2024001",
            nome: "Ana Clara Silva",
            status: "cursando",
            media: 8.5,
            frequencia: 95
        },
        {
            id: 2,
            matricula: "2024002",
            nome: "Bruno Oliveira Santos",
            status: "cursando",
            media: 7.2,
            frequencia: 88
        },
        {
            id: 3,
            matricula: "2024003",
            nome: "Carla Rodrigues",
            status: "cursando",
            media: 6.8,
            frequencia: 92
        },
        {
            id: 4,
            matricula: "2024004",
            nome: "Daniel Costa Lima",
            status: "cursando",
            media: 9.0,
            frequencia: 98
        },
        {
            id: 5,
            matricula: "2024005",
            nome: "Eduardo Pereira",
            status: "recuperacao",
            media: 5.5,
            frequencia: 85
        }
    ];
    
    renderizarAlunos();
}

function renderizarAlunos() {
    const corpoTabela = document.getElementById('corpo-alunos');
    const semAlunos = document.getElementById('sem-alunos');
    
    if (alunosTurma.length === 0) {
        corpoTabela.innerHTML = '';
        semAlunos.style.display = 'block';
        return;
    }
    
    semAlunos.style.display = 'none';
    
    let html = '';
    alunosTurma.forEach(aluno => {
        const statusClass = `badge-status badge-${aluno.status}`;
        const statusText = {
            'aprovado': 'Aprovado',
            'recuperacao': 'Recuperação',
            'reprovado': 'Reprovado',
            'cursando': 'Cursando'
        }[aluno.status] || aluno.status;
        
        html += `
            <tr>
                <td><strong>${aluno.matricula}</strong></td>
                <td>${aluno.nome}</td>
                <td><span class="${statusClass}">${statusText}</span></td>
                <td><strong>${aluno.media}</strong></td>
                <td>${aluno.frequencia}%</td>
                <td>
                    <button class="btn-acao btn-visualizar" onclick="visualizarAluno(${aluno.id})">👁️ Ver</button>
                    <button class="btn-acao btn-editar" onclick="editarAluno(${aluno.id})">✏️ Editar</button>
                </td>
            </tr>
        `;
    });
    
    corpoTabela.innerHTML = html;
}

async function carregarFormularioNotas() {
    const corpoTabela = document.getElementById('corpo-lancar-notas');
    
    let html = '';
    alunosTurma.forEach(aluno => {
        //simulador de notas existentes
        const notaExistente = Math.random() > 0.5 ? (Math.random() * 10).toFixed(1) : '';
        const statusNota = notaExistente ? 'Lançada' : 'Pendente';
        
        html += `
            <tr>
                <td><strong>${aluno.matricula}</strong></td>
                <td>${aluno.nome}</td>
                <td>
                    <input type="number" 
                           class="input-nota" 
                           id="nota-${aluno.id}" 
                           value="${notaExistente}" 
                           min="0" 
                           max="10" 
                           step="0.1"
                           placeholder="0.0">
                </td>
                <td>${statusNota}</td>
                <td>${notaExistente ? new Date().toLocaleDateString('pt-BR') : '-'}</td>
            </tr>
        `;
    });
    
    corpoTabela.innerHTML = html;
}

async function salvarNotas() {
    const bimestre = document.getElementById('selecionar-bimestre').value;
    const avaliacao = document.getElementById('selecionar-avaliacao').value;
    
    let notasParaSalvar = [];
    let hasErrors = false;
    
    alunosTurma.forEach(aluno => {
        const inputNota = document.getElementById(`nota-${aluno.id}`);
        const nota = parseFloat(inputNota.value);
        
        if (inputNota.value && (nota < 0 || nota > 10)) {
            inputNota.style.borderColor = '#dc2626';
            hasErrors = true;
        } else if (inputNota.value) {
            inputNota.style.borderColor = '#10b981';
            notasParaSalvar.push({
                alunoId: aluno.id,
                alunoNome: aluno.nome,
                bimestre: bimestre,
                avaliacao: avaliacao,
                nota: nota
            });
        }
    });
    
    if (hasErrors) {
        alert('Erro: As notas devem estar entre 0 e 10!');
        return;
    }
    
    if (notasParaSalvar.length === 0) {
        alert('Nenhuma nota para salvar!');
        return;
    }
    
    //simulador de salvamento
    console.log('Notas a serem salvas:', notasParaSalvar);
    
    const confirmacao = confirm(`Deseja salvar ${notasParaSalvar.length} notas para o ${bimestre}º bimestre (${avaliacao.toUpperCase()})?`);
    
    if (confirmacao) {
        //simulador de delay de salvamento
        const btnSalvar = document.querySelector('#aba-notas .btn-salvar');
        const textoOriginal = btnSalvar.innerHTML;
        btnSalvar.innerHTML = 'Salvando...';
        btnSalvar.disabled = true;
        
        setTimeout(() => {
            alert(`${notasParaSalvar.length} notas salvas com sucesso!`);
            btnSalvar.innerHTML = textoOriginal;
            btnSalvar.disabled = false;
            
            alunosTurma.forEach(aluno => {
                const inputNota = document.getElementById(`nota-${aluno.id}`);
                if (inputNota.value) {
                    const linha = inputNota.closest('tr');
                    const celulaStatus = linha.cells[3];
                    celulaStatus.textContent = 'Lançada';
                }
            });
        }, 1500);
    }
}

async function carregarFormularioFrequencia() {
    const corpoTabela = document.getElementById('corpo-lancar-frequencia');
    
    let html = '';
    alunosTurma.forEach(aluno => {
        //simulador de frequencia existente
        const frequenciaExistente = Math.random() > 0.7 ? (Math.random() > 0.5 ? 'presente' : 'falta') : 'presente';
        const justificativaExistente = frequenciaExistente === 'falta' ? 'Não justificada' : '';
        
        html += `
            <tr>
                <td><strong>${aluno.matricula}</strong></td>
                <td>${aluno.nome}</td>
                <td>
                    <select class="select-frequencia" id="frequencia-${aluno.id}">
                        <option value="presente" ${frequenciaExistente === 'presente' ? 'selected' : ''}>✅ Presente</option>
                        <option value="falta" ${frequenciaExistente === 'falta' ? 'selected' : ''}>❌ Falta</option>
                        <option value="justificada" ${frequenciaExistente === 'justificada' ? 'selected' : ''}>🖊️ Justificada</option>
                    </select>
                </td>
                <td>
                    <input type="text" 
                           class="input-justificativa" 
                           id="justificativa-${aluno.id}" 
                           value="${justificativaExistente}"
                           placeholder="Motivo da falta...">
                </td>
            </tr>
        `;
    });
    
    corpoTabela.innerHTML = html;
}

function marcarTodosPresentes() {
    alunosTurma.forEach(aluno => {
        const select = document.getElementById(`frequencia-${aluno.id}`);
        if (select) select.value = 'presente';
    });
    alert('Todos os alunos marcados como presentes!');
}

function marcarTodosFaltantes() {
    alunosTurma.forEach(aluno => {
        const select = document.getElementById(`frequencia-${aluno.id}`);
        if (select) select.value = 'falta';
    });
    alert('Todos os alunos marcados como faltantes!');
}

function limparFrequencia() {
    alunosTurma.forEach(aluno => {
        const select = document.getElementById(`frequencia-${aluno.id}`);
        const justificativa = document.getElementById(`justificativa-${aluno.id}`);
        if (select) select.value = 'presente';
        if (justificativa) justificativa.value = '';
    });
    alert('Frequência limpa!');
}

async function salvarFrequencia() {
    const dataFrequencia = document.getElementById('data-frequencia').value;
    
    if (!dataFrequencia) {
        alert('Selecione uma data para a frequência!');
        return;
    }
    
    let frequenciaParaSalvar = [];
    
    //coleta todas as frequencias
    alunosTurma.forEach(aluno => {
        const select = document.getElementById(`frequencia-${aluno.id}`);
        const justificativa = document.getElementById(`justificativa-${aluno.id}`);
        
        frequenciaParaSalvar.push({
            alunoId: aluno.id,
            alunoNome: aluno.nome,
            data: dataFrequencia,
            status: select.value,
            justificativa: justificativa.value
        });
    });
    
    //simulador de salvamento
    console.log('Frequência a ser salva:', frequenciaParaSalvar);
    
    const confirmacao = confirm(`Deseja salvar a frequência do dia ${new Date(dataFrequencia).toLocaleDateString('pt-BR')}?`);
    
    if (confirmacao) {
        const btnSalvar = document.querySelector('#aba-frequencia .btn-salvar');
        const textoOriginal = btnSalvar.innerHTML;
        btnSalvar.innerHTML = 'Salvando...';
        btnSalvar.disabled = true;
        
        setTimeout(() => {
            alert(`Frequência salva com sucesso para ${frequenciaParaSalvar.length} alunos!`);
            btnSalvar.innerHTML = textoOriginal;
            btnSalvar.disabled = false;
        }, 1500);
    }
}

function exportarListaAlunos() {
    alert('📥 Exportando lista de alunos...');
}

function visualizarAluno(alunoId) {
    const aluno = alunosTurma.find(a => a.id === alunoId);
    if (aluno) {
        alert(`👨‍🎓 Visualizando aluno:\n\nNome: ${aluno.nome}\nMatrícula: ${aluno.matricula}\nMédia: ${aluno.media}\nFrequência: ${aluno.frequencia}%`);
    }
}

function editarAluno(alunoId) {
    const aluno = alunosTurma.find(a => a.id === alunoId);
    if (aluno) {
        alert(`✏️ Editando aluno: ${aluno.nome}\n\nEm um sistema real, abriria um formulário de edição.`);
    }
}