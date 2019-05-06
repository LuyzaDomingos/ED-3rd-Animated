$(document).ready(function () {
    var interval
    var maxListSize = 4;
    var listaE = new Lista();
    var raiz;
    var divID = 0;
    var processadorPai;
    var procBusy = false;
    $('#btn_start').change(function() {
        if (!$('#btn_start').prop('checked')){
            interval = setInterval(function(){
                if (!listaE.vazia() && !procBusy){
                    procBusy=true;
                    var passo = 28;
                    var removido = listaE.remover(1);
                    var fim = $('#processador').offset();
                    raiz = $('#pro'+removido.id).offset();
                    $('#pro'+removido.id).animate({left: fim.left-raiz.left }, 1400)
                                        .delay(200)
                                        .animate({left: fim.left-raiz.left+passo }, 200)
                                        .delay(200)
                                        .animate({left: fim.left-raiz.left+2*passo }, 200)
                                        .delay(2000)
                                        .hide(400, function(){
                                            procBusy=false;
                                            console.log(procBusy);
                    });
                }
                if (listaE.getTamanho()<maxListSize) {
                    var seg = Date.now()%10;
                    processadorPai = FazProcesso(seg);
                    listaE.inserir((listaE.getTamanho()+1), "O conteudo não importa nesse caso", divID);
                    $('#proList').append('<div id="pro'+divID+'"class="processo">'+
                                            '<div><span id="nome_pai">APP-'+processadorPai+'</span></div>'+
                                            '<div class="row">'+
                                                '<div class="col-1"><span id="prioridade">'+seg+'</span></div>'+
                                                '<div class="col-'+((seg%5)*2+1)+'" style="background-color: green"></div>'+
                                            '</div>'+
                                        '</div>');
                    raiz = $('#app'+processadorPai).offset();
                    $('#pro'+divID).offset({ top: raiz.top+40, left: raiz.left+80});
                    $('#pro'+divID).delay(1000).animate({ top: 0, left: 0 }, (processadorPai==1 ? 1000 : 1500), function () {
                        divID++;
                    });
                }
            }, 2600);
        }else{
            clearInterval(interval);
        }
    });
});

var sorteio = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1];
function FazProcesso(seg){
    var resultado = sorteio[seg];
    sorteio[seg] = (++resultado)%2; 
    return resultado;
}
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