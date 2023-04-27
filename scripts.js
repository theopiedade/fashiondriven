axios.defaults.headers.common['Authorization'] = 'MYJXM2hWhW6XPZBVBwjAsy83';

var nome = prompt("Qual o seu nome?");
var elemento = document.querySelector(".botao_usuario");
elemento.innerHTML = `Olá,  <p>${nome}!</p>`;
var busca = "Todos os modelos";
busca_blusas(busca, '.b1');

var selecao = ["","",""];

var modelo = ["t-shirt", "top-tank", "long"];
var gola = ["v-neck", "round", "polo"];
var tecido = ["silk", "cotton", "polyester"];

var link; 

var erro_mensagem;
var erro_codigo;

function select(tipo,item) {

    var item_sel = parseInt(item.slice(-1));
    if (tipo == '.modelo') { selecao[0] = modelo[item_sel]; }
    if (tipo == '.gola') { selecao[1] = gola[item_sel]; }
    if (tipo == '.tecido') {  selecao[2] = tecido[item_sel]; }
 
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
  
    if (p1 !== null && p2 !== null && p3 !== null && link.length > 0) {
       bs.removeAttribute("disabled");
       bs.classList.add("checked");
       console.log("Disabled removido");
  
    }
    else {
        bs.disabled = true;
        console.log("Botão disabled");
        bs.classList.remove("checked");
    }
     
  }


  function confirmar_pedido (dono) {
    if (dono == null || dono == undefined) { dono = nome; }

    const data = {
        "model": selecao[0],
        "neck": selecao[1],
        "material": selecao[2],
        "image": link,
        "owner": dono,
        "author": dono
    }
    console.log(data);

    const query = axios.post('https://mock-api.driven.com.br/api/v4/shirts-api/shirts', data);
    query.then(checar_pedido);
    query.catch(erro_pedido);
  }

  function checar_pedido (answer) {
        if (answer.status === 201) {
            console.log("sucesso");
            setTimeout(remove_sucesso, 10000); 
            sucesso();
            busca_blusas('Todos os modelos', '.b1');
        }
  }

  function erro_pedido (answer) {
    console.log("Deu erro");
    console.log("Erro:"+answer.code+" Msg:"+answer.message);
    erro_codigo = answer.code;
    erro_mensagem = answer.message;
    setTimeout(remove_deu_erro, 10000); 
    deu_erro();
  }
  

  function sucesso() {
    document.querySelector(".container_area_pedido").classList.add("nao_mostra");
    document.querySelector(".sucesso").classList.remove("nao_mostra");   
  }

  function remove_sucesso() {
    document.querySelector(".container_area_pedido").classList.remove("nao_mostra");
    document.querySelector(".sucesso").classList.add("nao_mostra");
    if (document.querySelector(".modelo .selected").classList) remove_selecoes_e_link();
    checa_botao()
 }

 function remove_selecoes_e_link() {
    document.querySelector(".modelo .selected").classList.remove("selected");
    document.querySelector(".gola .selected").classList.remove("selected");
    document.querySelector(".tecido .selected").classList.remove("selected");
    document.querySelector(".link").value = '';
 }

  function deu_erro() {
    document.querySelector(".container_area_pedido").classList.add("nao_mostra");
    document.querySelector(".erro").classList.remove("nao_mostra");
    document.querySelector(".erro .mensagem").innerHTML=`${erro_codigo} - ${erro_mensagem}`;   
  }

  function remove_deu_erro() {
    document.querySelector(".container_area_pedido").classList.remove("nao_mostra");
    document.querySelector(".erro").classList.add("nao_mostra");   
  }

  function busca_blusas(tipos, botao) {
    document.querySelector(".botoes_ultimos_pedidos .checked").classList.remove("checked");
    document.querySelector(".botoes_ultimos_pedidos "+botao).classList.add("checked");
    busca = tipos;
    const query = axios.get('https://mock-api.driven.com.br/api/v4/shirts-api/shirts');
    query.then(listar_blusas);
  }
  
  function listar_blusas(answer) {
    let elemento = document.querySelector('.area_camisetas');
    elemento.innerHTML ="";


    for (let i=0;i<=9;i++) { 
        let d = answer.data;
        if (busca == 'Todos os modelos') {
                elemento.innerHTML += `
                <div class="camisetas_feitas" onclick="selecao_ultimos_modal('${d[i].model}','${d[i].neck}','${d[i].material}','${d[i].image}','${d[i].owner}')">
                <img src="${answer.data[i].image}"/>
                <div class="criador"><p>Criador:</p> ${answer.data[i].owner}</div>
                </div>
                `;
            }
            else if (answer.data[i].model == busca) {
                        console.log("Id: "+answer.data[i].id+" Model: "+answer.data[i].model+ " Imagem: "+answer.data[i].image);
                        elemento.innerHTML += `
                        <div class="camisetas_feitas" onclick="selecao_ultimos_modal('${d[i].model}','${d[i].neck}','${d[i].material}','${d[i].image}','${d[i].owner}')">
                        <img src="${answer.data[i].image}"/>
                        <div class="criador"><p>Criador:</p> ${answer.data[i].owner}</div>
                        </div>
                        `;
                }
       }
}


 function selecao_ultimos(model, neck, material, image, owner) {
    let pergunta = confirm("Deseja mesmo adquirir esse pedido?");
    if (pergunta === true) {
        alert("Encomenda feita! modelo: "+model+" neck:"+neck+" material:"+material+" image:"+image+" owner:"+owner);
        selecao[0]=model;
        selecao[1]=neck;
        selecao[2]=material;
        link = image;
        confirmar_pedido(owner);
    }
 }

 function selecao_ultimos_modal(model, neck, material, image, owner) {
    let modal = document.querySelector('.bloco_modal');

    if (typeof modal == 'undefined' || modal === null)  return;

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    document.querySelector('.sucesso_modal').innerHTML = `
        <img src="${image}"/>
        <div class="sucesso_modal_direita">
        <h1>${model} com gola ${neck} de ${material}</h1>
        <div class="criador"><p>Criador:</p>${owner}</div>
        <input class="button checked" type="button" value="Confirmar Pedido" onclick="confirmar_pedido_modal('${model}','${neck}','${material}','${image}','${owner}')"></input>
        <h3 onclick="fechar_sucesso_modal()">Cancelar</h3>
    `;
 }


function fechar_sucesso_modal() {
    let modal = document.querySelector('.bloco_modal');

    if (typeof modal == 'undefined' || modal === null) return;

 
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function confirmar_pedido_modal(model, neck, material, image, owner) {
    selecao[0]=model;
    selecao[1]=neck;
    selecao[2]=material;
    link = image;
    confirmar_pedido(owner);
}