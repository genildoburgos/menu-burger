$(document).ready(function (){
    cardapio.eventos.init();
})

var cardapio = {};

var MEU_CARRINHO = [];

cardapio.eventos ={

    init: () => [
        cardapio.metodos.obterItensCardapio()
    ]

}

cardapio.metodos ={

    // obtem a lista de itens do cardápio
    obterItensCardapio: (categoria= 'burgers', vermais = false) => {
      
        var filtro = MENU[categoria];

        if(!vermais){
            $("#itensCardapio").html('')
            $('#btnVerMais').removeClass('hidden');
        }


        $.each(filtro, (i, e) => {

           
            let temp = cardapio.templates.item
            .replace(/\${img}/g, e.img)
            .replace(/\${name}/g, e.name)
            .replace(/\${valor}/g, e.price.toFixed(2).replace('.', ','))
            .replace(/\${id}/g, e.id)

            // botão vermais foi clicado(12 itens)
            if (vermais && i >= 8 && i < 12){
                $("#itensCardapio").append(temp)
            }

            // paginação inicial (8 itens)
            if (!vermais && i < 8 ){
                $("#itensCardapio").append(temp)
            }


        })

        // remover o ativo
        $(".container-menu a").removeClass('active')

        // seta o menu para ativo
        $("#menu-" + categoria).addClass('active')

    },

    //clique botão ver mais
    verMais: ()=> {

        var ativo = $(".container-menu a.active").attr('id').split('menu-')[1];
        cardapio.metodos.obterItensCardapio(ativo, true);

        $('#btnVerMais').addClass('hidden');

    },

    // diminuir a quantidade dos itens no menu
    diminuirQuantidade: (id) => {

        let qntdAtual = parseInt($('#qntd-' + id).text());

        if(qntdAtual > 0){
            $('#qntd-' + id).text(qntdAtual - 1)
        }

    },

    // aumentar a quantidade dos itens no menu
    aumentarQuantidade: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());
        $("#qntd-" + id).text(qntdAtual + 1)

    },
    //adicionar ao carrinho o item do menu
    adicionarAoCarrinho: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());
        if(qntdAtual > 0) {
            //obter categoria ativa
            var categoria = $(".container-menu a.active").attr('id').split('menu-')[1];

            //obtem lista de itens 
            let filtro =MENU[categoria];

            //obtem o item
            let item = $.grep(filtro, (e, i) => { return e.id == id} )


            if(item.length > 0){

                //validar se já existe esse item no carrinho
                let existe = $.grep(MEU_CARRINHO, (elem, index) => { return elem.id == id} )

                //caso já exista o item no carrinho, só altera a quantidade
                if (existe.length > 0) {
                    let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id))
                    MEU_CARRINHO[objIndex].qntd = MEU_CARRINHO[objIndex].qntd + qntdAtual;

                } 
                //caso ainda não exista o item no carrinho, adiciona ele
                else {
                    item[0].qntd = qntdAtual;
                    MEU_CARRINHO.push(item[0])                
                }

                cardapio.metodos.mensagem('Item adicionado ao carrinho', 'green');
                $("#qntd-" + id).text(0)

                cardapio.metodos.atualizarBadgeTotal();
            }
        }

    },

    //Atualiza o badge de totais dos botões "meu carrinho"
    atualizarBadgeTotal: ()=> {
        var total = 0;

        $.each(MEU_CARRINHO, (i, e) => {
            total += e.qntd
        })

        if(total > 0){
            $(".botao-carrinho").removeClass('hidden')
            $(".container-total-carrinho").removeClass('hidden')
            

        } else {
            $(".botao-carrinho").addClass('hidden')
            $(".container-total-carrinho").addClass('hidden')

        }

        $(".badge-total-carrinho").html(total);

    },




    // abrir 
    abrirCarrinho: (abrir)=> {
        if(abrir){
            $("#modalCarrinho").removeClass('hidden');
        } else {
            $("#modalCarrinho").addClass('hidden');
        }

    },










    //mensagens
    mensagem: (texto, cor ='red', tempo = 3500) => {

        let id = Math.floor(Date.now() * Math.random()).toString();
        
        let msg = `<div id="msg-${id}" class="animated fadeInDown toast ${cor}">${texto}</div>`;

        $("#container-mensagens").append(msg);

        setTimeout(() => {
            $('#msg-' + id).removeClass('fadeInDown');
            $('#msg-' + id).addClass('fadeOutUp');
            setTimeout(() => {
                $('#msg-' + id).remove();
            }, 800)
        }, tempo);

    }





}

cardapio.templates = {

    item: `
    <div class="col-3 mb-5">
    <div class="card card-item" id="\${id}">
        <div class="img-produto">
            <img src="\${img}" >
        </div>
        <p class="title-produto text-center mt-4">
            <b>\${name}</b>
        </p>
        <p class="price-produto text-center">
            <b>R$\${valor}</b>
        </p>
        <div class="add-carrinho">
            <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidade('\${id}')"><i class="fas fa-minus"></i></span>
            <span class="add-numero-itens" id="qntd-\${id}">0</i></span>
            <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidade('\${id}')"><i class="fas fa-plus"></i></span>
            <span class="btn btn-add" onclick="cardapio.metodos.adicionarAoCarrinho('\${id}')"><i class="fas fa-shopping-bag"></i></span>
        </div>
    </div>
    `

}