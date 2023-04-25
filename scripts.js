axios.defaults.headers.common['Authorization'] = 'MYJXM2hWhW6XPZBVBwjAsy83';

var nome = prompt("Qual o seu nome?");
var elemento = document.querySelector(".botao_usuario");
elemento.innerHTML = `Olá,  <p>${nome}!</p>`;

var selecao = [-1,-1,-1];

var modelo = ["t-shirt", "top-tank", "long"];
var gola = ["v-neck", "round", "polo"];
var tecido = ["silk", "cotton", "polyester"];

var link; 

function select(tipo,item) {

    var item_sel = parseInt(item.slice(-1));
    if (tipo == '.modelo') { selecao[0] = item_sel; }
    if (tipo == '.gola') { selecao[1] = item_sel; }
    if (tipo == '.tecido') {  selecao[2] = item_sel; }
 
    const s1 = document.querySelector(tipo+" .selected");
    if (s1 !== null) { 
      s1.classList.remove('selected');
    }
    
    const s2 = document.querySelector(item);
    if (s2 !== s1) {
      s2.classList.toggle('selected');
    }
    checa_botao();
}

function checa_botao() {
    console.log("Checa botão");
    const p1 = document.querySelector(".modelo .selected");
    const p2 = document.querySelector(".gola .selected");
    const p3 = document.querySelector(".tecido .selected");
    
    const bs = document.querySelector(".confirmar_pedido");

    link = document.querySelector(".link").value;
    console.log(link);
  
    if (p1 !== null && p2 !== null && p3 !== null && link.length > 4) {
       bs.removeAttribute("disabled");
       console.log("Disabled removido");
    }
    else {
        bs.disabled = true;
        console.log("Botão disabled");
    }
     
  }


  function confirmar_pedido () {

    const data = {
        "model": modelo[selecao[0]],
        "neck": gola[selecao[1]],
        "material": tecido[selecao[2]],
        "image": link,
        "owner": nome,
        "author": nome
    }
    console.log(data);

    const query = axios.post('https://mock-api.driven.com.br/api/v4/shirts-api/shirts', data);
    query.then(checar_pedido);
    query.catch(erro_pedido);
  }

  function checar_pedido (answer) {
        console.log(answer.data);
        console.log(answer.status);
        if (answer.status === 201) {
            console.log("sucesso");
            setTimeout(remove_sucesso, 10000); 
            sucesso();
        }
  }

  function erro_pedido () {
    console.log(answer.data);
    console.log(answer.status);
    if (answer.status === 201) {
        console.log("sucesso");
        setTimeout(remove_deu_erro, 10000); 
        erro();
    }
  }

  function sucesso() {
    document.querySelector(".container_area_pedido").classList.add("nao_mostra");
    document.querySelector(".sucesso").classList.remove("nao_mostra");   
  }

  function remove_sucesso() {
    document.querySelector(".container_area_pedido").classList.remove("nao_mostra");
    document.querySelector(".sucesso").classList.add("nao_mostra");   
  }

  function deu_erro() {
    document.querySelector(".container_area_pedido").classList.add("nao_mostra");
    document.querySelector(".erro").classList.remove("nao_mostra");   
  }

  function remove_deu_erro() {
    document.querySelector(".container_area_pedido").classList.add("nao_mostra");
    document.querySelector(".erro").classList.remove("nao_mostra");   
  }