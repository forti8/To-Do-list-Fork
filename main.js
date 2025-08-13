
const botaoAdicionar = document.querySelector("#adicionarTarefa");
const lista = document.querySelector("#listaTarefas");
const formAdicionar = document.querySelector("#formAdicionar");
const divToDoListContent = document.querySelector("#to-do-list-content");

let contadorCriar = 0;
let contadorCarregar = 0;

//carregar localStorage e criar um novo li pra cada objeto (li)
let tarefas = JSON.parse(localStorage.getItem("tarefas") || "[]");
tarefas.forEach((objeto) =>{
    const textoObjeto = objeto.texto;
    const objetoChecado = objeto.estaChecado;
    montarLi(textoObjeto, contadorCarregar, objetoChecado);
    contadorCarregar++;
});

//parar por 1s
function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

function montarLi(texto, contador, checado){
    const linhaTarefa = document.createElement("li");
    linhaTarefa.classList.add("item");
    linhaTarefa.id = `item${contador}`;

    const labelCheck = document.createElement("label");
    labelCheck.classList.add("labelCheck");

    const checkboxTarefa = document.createElement("input");
    checkboxTarefa.classList.add("checkTarefa");
    checkboxTarefa.setAttribute("type", "checkbox");
    checkboxTarefa.checked = checado;

    const textoTarefa = document.createElement("span");
    textoTarefa.classList.add("nomeTarefa");

    const spanTextoTarefa = document.createElement("span");
    spanTextoTarefa.classList.add("textoTarefa");

    const iconeBotao = document.createElement("i");
    iconeBotao.classList.add("fa", "fa-times");

    spanTextoTarefa.innerText = texto;
    const botaoRemover = document.createElement("button");
    botaoRemover.classList.add("botaoRemover");

    //EVENT É UM PARÂMETRO QUE TEM TODAS AS INFORMACOES SOBRE O EVENTO QUE ACONTECEU
    botaoRemover.addEventListener("click", async (event)=>{
        //EVENT.TARGET PEGA O ELEMENTO ESPECÍFICO QUE FOI CLICADO
        //CLOSEST PEGA O LI PAI MAIS PROXIMO DO ELEMENTO QUE FOI CLICADO
        divToDoListContent.style.maxHeight = divToDoListContent.scrollHeight + 'px';

        event.target.closest('li').remove();

        requestAnimationFrame(() =>{
            if(lista.children.length === 0){
                divToDoListContent.style.maxHeight = '0px';
            }else{
                divToDoListContent.style.maxHeight = divToDoListContent.scrollHeight + 'px';
            }
        });
        salvarLista();
    });

    //montar estrutura
    botaoRemover.appendChild(iconeBotao);
    textoTarefa.appendChild(spanTextoTarefa)
    textoTarefa.appendChild(botaoRemover);
    labelCheck.appendChild(checkboxTarefa);
    labelCheck.appendChild(textoTarefa);
    linhaTarefa.appendChild(labelCheck);

    //inserir a nova tarefa no inicio da lista
    //insertBefore(novoElemento, elementoDeReferencia)
    lista.insertBefore(linhaTarefa, lista.firstChild);
    atualizarAlturaContainer();
}

function salvarLista(){
    const tarefas = [];
    lista.querySelectorAll("li").forEach((li)=>{
        const texto = li.querySelector(".textoTarefa").innerText;
        const estaChecado = li.querySelector(".checkTarefa").checked;
        tarefas.push({texto, estaChecado});
    });
    //substitui o valor da chave tarefas pro valor atual
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

botaoAdicionar.addEventListener("click", ()=>{
    const inputTarefa = document.querySelector("#inputTarefa").value;

    if(inputTarefa.trim() === ''){
        alert("Você precisa digitar algo");
    }
    else{
        montarLi(inputTarefa, contadorCriar, false);
        salvarLista();

        formAdicionar.reset();
        contadorCriar++;
    }
});
function atualizarAlturaContainer(){
    if(lista.children.length === 0){
        divToDoListContent.style.maxHeight = '0px';
    }else{
        divToDoListContent.style.maxHeight = divToDoListContent.scrollHeight + 'px';
    }
}

//quando marcada, reposicionar tarefa pro final da lista. Desmarcadas, mover para o começo da lista
lista.addEventListener("change", async(event)=>{
    console.log(event.target);

    //pega o li mais proximo do checkbox clicado
    const liPressionado = event.target.closest("li");

    await sleep(300);

    if(event.target.checked){
        console.log(event.target.checked);

        //append child remove o li de sua posição e o coloca no final da lista
        lista.appendChild(liPressionado);
    }else{
        console.log(event.target.checked);

        lista.insertBefore(liPressionado, lista.firstChild);
    }
    salvarLista();
}
);