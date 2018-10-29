
$(document).ready(function () {
    var listaE = new Lista();
    var divID = 0;
    var raiz;
    var add;
    $('.comeco').show("slow");
    $('#add').click(function () {
        if (listaE.getTamanho() >= 100) {
            alert("Nem todo mundo é de ferro! Cansei por enquanto, que tal uma pausa?");
            $('#add').prop('disabled', true);
        } else {
            add = listaE.getTamanho();
            if (/^\d+$/.test($('#valor').val())) {//verifica se a entrada é um número.
                raiz = $('#entrada').offset();
                desligaBTN();//desabilita os botões para que duas animação não aconteçam ao mesmo tempo.						
                listaE.inserir((listaE.getTamanho() + 1), $('#valor').val(), divID);//posição, div:valor e id Adiciona ao fim da lista
                $('#apresentacao').append('<div id="caixa' + divID + '" class="float-left" style="position: absolute;"><div class="caixa float-left"><input type="text" value="' + $('#valor').val() + '" disabled></div><div class="comeco"></div></div>');//cria uma nova caixa para a simulação

                destinoTopo = 80 * parseInt((add * 110) / ($('#apresentacao').width() - 110));
                destinoEsquerdo = parseInt(((add * 110) % ($('#apresentacao').width() - 110)) / 110) * 110;

                console.log(add++); console.log($('#apresentacao').width());
                $('#caixa' + divID).offset({ top: raiz.top, left: raiz.left });//define a posição de origem da nova caixa
                //faz a animação até a posição correta, define a posição como estática, cria a ligação qua aponta para o próximo elemento e desabilita os botões.
                $('#caixa' + divID).animate({ top: destinoTopo, left: destinoEsquerdo }, 1000, function () {
                    $('#caixa' + divID++).css({ "position": "static" });
                    //$('#apresentacao').append('<div class="comeco"></div>');
                    $('.comeco').show("slow");
                    //Atualiza os detalhes só depois da animação.
                    if (listaE.getTamanho() == 1) {
                        atualizaDetalhes(listaE.getTamanho(), $('#valor').val(), $('#valor').val(), null);
                    } else {
                        atualizaDetalhes(listaE.getTamanho(), null, $('#valor').val(), null);
                    }
                    ligaBTN();
                    setUpVisualizacao();
                    setUpVisualizacao();
                });
            } else {
                alert("Apenas números inteiros são permitidos.");
            }
        }
    });

    $('#rmv').click(function () {
        var removido;
        if (listaE.getTamanho() != 0) {
            desligaBTN();
            removido = listaE.remover(1);
            limpaDiv(removido.getId());
        }
        if (listaE.getTamanho() != 0) {
            atualizaDetalhes(listaE.getTamanho(), listaE.buscaElemento(1).getConteudo(), listaE.buscaElemento(listaE.getTamanho()).getConteudo(), removido.getConteudo());
        } else {
            atualizaDetalhes(0, "***", "***", removido.getConteudo());
        }
    });


    $('#visualizacao').change(function () {
        setUpVisualizacao();
    });
});





var No = function (conteudo, proximo, id) {
    this.id = id;
    this.conteudo = conteudo;
    this.proximo = proximo;
}


No.prototype.getId = function () {
    return this.id;
}

No.prototype.getConteudo = function () {
    return this.conteudo;
}

No.prototype.getProximo = function () {
    return this.proximo;
}

No.prototype.setProximo = function (proximo) {
    this.proximo = proximo;
}


var Lista = function () {
    this.cabeca = null;
    this.tamanho = 0;
}


Lista.prototype.getTamanho = function () {
    return this.tamanho;
}

Lista.prototype.vazia = function () {
    return (this.tamanho == 0);
}

Lista.prototype.buscaElemento = function (posicao) {
    var auxNo = this.cabeca;
    var cont = 1;
    if (this.vazia() || posicao < 1 || posicao > this.tamanho) {
        return null;
    }
    while (cont < posicao) {
        auxNo = auxNo.getProximo();
        cont++;
    }
    return auxNo;
}

Lista.prototype.inserir = function (posicao, conteudo, id) {
    var novoNo = new No(conteudo, null, id);
    if (posicao == 1) {//insere no começo da lista
        novoNo.setProximo(this.cabeca);
        this.cabeca = novoNo;
    } else if (posicao == this.tamanho + 1) {//insere no fim da lista
        var auxNo = this.cabeca;
        while (auxNo.getProximo() != null) {
            auxNo = auxNo.getProximo();
        }
        auxNo.setProximo(novoNo);
    } else {//insere no meio da lista
        var cont = 1;
        var auxNo = this.cabeca;
        while (cont < posicao - 1) {
            auxNo = auxNo.getProximo();
            cont++;
        }
        novoNo.setProximo(auxNo.getProximo());
        auxNo.setProximo(novoNo);
    }
    this.tamanho++;
}

Lista.prototype.remover = function (posicao) {
    var removido = this.cabeca;;
    if (posicao == 1) { //remove no inicio da lista
        this.cabeca = removido.getProximo();
    } else { //remove em outro lugar da lista
        var anterior = this.cabeca;
        var cont = 1;
        while (cont < posicao - 1) {
            anterior = anterior.getProximo();
            cont++;
        }
        removido = anterior.getProximo();
        anterior.setProximo(removido.getProximo());
    }
    this.tamanho--;
    return removido;
}




function atualizaDetalhes(tamanho, inicio, fim, removido) {
    $('#tamanho').html(" " + tamanho + " ");
    if (removido != null) {
        $('#lblremovido')[0].innerHTML = ' ' + removido + ' ';
    }
    if (inicio != null) {
        $('#cabeca').html(" " + inicio + " ");
    }
    if (fim != null) {
        $('#cauda').html(" " + fim + " ");
    }
}

function ligaBTN() {
    $('#add').prop('disabled', false);
    $('#rmv').prop('disabled', false);
}

function desligaBTN() {
    $('#add').prop('disabled', true);
    $('#rmv').prop('disabled', true);
}

function limpaDiv(id) {
    $('#caixa' + id).hide("slow", function () {
        $('#caixa' + id).remove();
        ligaBTN();

        setUpVisualizacao();
        setUpVisualizacao();
    });
}




function isBlurEnabled() {
    return $('#visualizacao').prop('checked');
}

function setUpVisualizacao() {
    var selector = "#apresentacao > div > .caixa";
    if (isBlurEnabled()) {
        $('#cauda').addClass('caixa_blur');
        $(selector).addClass('caixa_blur');
        $(selector + ':eq(0)').removeClass('caixa_blur');
    }
    else {
        $(selector).removeClass('caixa_blur');
        $('#cauda').removeClass('caixa_blur');
    }
}