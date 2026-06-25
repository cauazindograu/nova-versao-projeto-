const API = windows.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" ? "http://localhost:3000" : "https://nova-versao-projeto.onrender.com";
 
async function cadastrarAluno(event) {
    event.preventDefault();
 
    const nome = document.getElementById("nome").value;
    const idade = Number(document.getElementById("idade").value);
    const nivel = document.getElementById("nivel").value;
    const horario = document.getElementById("horario").value;
    const telefone = Number(document.getElementById("telefone").value);
 
    const novoAluno = {nome, idade, nivel, horario, telefone};
 
    try {
        const resposta = await fetch(`${API}/alunos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(novoAluno)
    });
 
    const dados = await resposta.json();
 
    if (!resposta.ok) {
        alert(dados.erro);
        return;
    }
    alert("Aluno cadastrado com sucesso");
   
    } catch (erro) {
        console.log(erro);
    }
}
 
async function carregarAlunos() {
    const lista = document.getElementById("lista");
 
    if (!lista) return;
    try {
        const resposta = await fetch(`${API}/alunos`);
        const alunos = await resposta.json();
        lista.innerHTML = ""
 
        for (let aluno of alunos) {
            lista.innerHTML += `
            <div class="aluno">
            <h2>${aluno.nome}</h2>
            <p>Idade: ${aluno.idade}</p>
            <p>Nível: ${aluno.nivel}</p>
            <p>Horário: ${aluno.horario}</p>
             <p>Telefone: ${aluno.telefone}</p>
            <P>Status:  ${aluno.ativo ? "ativo" : "inativo "} </P>
            <br>
            <button onclick="alternarStatus(${aluno.id})">Alterar Status</button>
            <br>
            <button onclick="removerAluno(${aluno.id})">Remover</button>
            <br>
            </div>
            `
        }
 
    } catch (erro) {
        console.log(erro)
    }
}
async function removerAluno(id) {
    await fetch (`${API}/alunos/${id}`,{
        method: "DELETE"
    });
    carregarAlunos ();
};

 async function alternarStatus (id) {
    await fetch (`${API}/alunos/${id}`,{
        method: "PUT"
    });
    carregarAlunos ();
 };
 

 async function carragarEstatisticas() {
    const painel = document.getElementById("estatisticas")
    if (!painel) return;
    try {
        const resposta = await fetch(`${API}/alunos`);
        const alunos = await resposta.json();
        const totalAlunos = alunos.length;
        const ativos = alunos.filter(aluno => aluno.ativo).length;
        const inativos = totalAlunos - ativos;
        const niveis = { "Iniciante": 0, "Intermediário": 0, "Avançado": 0 };
        alunos.forEach(aluno => {
            if (niveis[aluno.nivel] !== undefined)
                niveis[aluno.nivel]++;
        });
        painel.innerHTML = `
        <div class="card-stat">
        <h3>Matriculas</h3>
        <p>Total: <strong>${totalAlunos}</strong></p>
        <p>Alunos ativos: <strong>${ativos}</strong></p>
        <p>Alunos inativos: <strong>${inativos}</strong></p>
        </div>
        <div class="card-stat">
        <h3>Por nível:</h3>
        <p>Iniciante: <strong>${niveis["Iniciante"]}</strong></p>
        <p>Intermediário: <strong>${niveis["Intermediário"]}</strong></p>
        <p>Avançado: <strong>${niveis["Avançado"]}</strong></p>
        </div>
        `
    } catch(erro) {
        console.log("Erro ao carregar", erro);
    }
}
 
async function conferirAdm(event) {
    event.preventDefault();
    const senha = document.getElementById("senha").value;
 
    try{
        const resposta = await fetch (`${API}/admin`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({senha})
        });
        const dados = await resposta.json();
        if(!resposta.ok) {
            alert(dados.erro)
            return;
        }
        sessionStorage.setItem("admin_logado", "true");
        verificar();
    } catch(erro) {
        console.log("Erro na autenticação", erro);
    }
}
 
function verificar() {
    const login = document.getElementById("login");
    const conteudo = document.getElementById("conteudo");
 
    if (!login || !conteudo) return;
    if (sessionStorage.getItem("admin_logado") === "true") {
        login.style.display = "none";
        conteudo.style.display = "block";
        carragarEstatisticas();
    } else {
        login.style.display = "block";
        conteudo.style.display = "none";
    }
}
 
function logoutAdm() {
    sessionStorage.removeItem("admin_logado");
    window.location.reload();
}
 
carregarAlunos();
verificar();
 
//post,get,delet armazena envia e deleta
// let cria variavel
// req=requirir, res=resgatar
//if=se
//else=senao
//function=função
//
//
//