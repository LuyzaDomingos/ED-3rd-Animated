//Definição da classe Nó.
var No = function(conteudo, proximo, id) {
    this.id = id;
    this.conteudo = conteudo;
    this.proximo = proximo;
}

No.prototype.getId = function() {
    return this.id;
}

No.prototype.getConteudo = function() {
    return this.conteudo;
}

No.prototype.getProximo = function() {
    return this.proximo;
}

No.prototype.setProximo = function(proximo) {
    this.proximo = proximo;
}

//Definição da classe Lista Simplesmente Encadeada;
var Lista = function() {
    this.cabeca = null;
    this.tamanho = 0;
}

Lista.prototype.getTamanho = function() {
    return this.tamanho;
}

Lista.prototype.vazia = function() {
    return (this.tamanho == 0);
}

Lista.prototype.buscaElemento = function(posicao){
    var auxNo = this.cabeca;
    var cont = 1;
    if (this.vazia() || posicao<1 || posicao>this.tamanho){
        return null;
    }
    while(cont < posicao){
        auxNo = auxNo.getProximo();
        cont++;
    }
    return auxNo;
}

Lista.prototype.buscaPosicao = function(dado){
    var auxNo = this.cabeca;
    var cont = 1;
    while (auxNo != null){
        if (auxNo.getConteudo() == dado){
            return auxNo;
        }
        auxNo = auxNo.getProximo();
        cont++;
    }
    return null;
}

Lista.prototype.inserir = function(posicao, conteudo, id) {
    var novoNo = new No(conteudo, null, id);
    if(posicao == 1){//insere no começo da lista
        novoNo.setProximo(this.cabeca);
        this.cabeca = novoNo;
    }else if(posicao == this.tamanho+1){//insere no fim da lista
        var auxNo = this.cabeca;
        while(auxNo.getProximo() != null){
            auxNo = auxNo.getProximo();
        }
        auxNo.setProximo(novoNo);
    }else{//insere no meio da lista
        var cont=1;
        var auxNo = this.cabeca;
        while(cont < posicao-1){
            auxNo = auxNo.getProximo();
            cont++;
        }
        novoNo.setProximo(auxNo.getProximo());
        auxNo.setProximo(novoNo);
    }
    this.tamanho++;
}

Lista.prototype.remover = function(posicao){
    var removido = this.cabeca;;
    if (posicao == 1){ //remove no inicio da lista
        this.cabeca = removido.getProximo();
    }else{ //remove em outro lugar da lista
        var anterior = this.cabeca;
        var cont = 1;
        while(cont <posicao-1){
            anterior = anterior.getProximo();
            cont++;
        }
        removido = anterior.getProximo();
        anterior.setProximo(removido.getProximo());
    }
    this.tamanho--;
    return removido;
}

$(document).ready(function() {

    var listaE = new Lista();
    var divID = 0;
    var raiz;
    var add;
    var elemento;

    function ligaBTN(){
        $('#add').prop('disabled', false);
        $('#rmv').prop('disabled', false);
        $('#src_val').prop('disabled', false);
        $('#src_pos').prop('disabled', false);
    }

    function desligaBTN(){
        $('#add').prop('disabled', true);
        $('#rmv').prop('disabled', true);
        $('#src_val').prop('disabled', true);
        $('#src_pos').prop('disabled', true);
    }

    function atualizaDetalhes(tamanho, inicio, fim){
        $('#tamanho').html(" "+tamanho+" ");
        if(inicio!=null){
            $('#cabeca').html(" "+inicio+" ");
        }
        if(fim!=null){
            $('#cauda').html(" "+fim+" ");
        }
    }

    function limpaDiv(id){
        $('#caixa'+id).hide("slow", function(){
            $('#caixa'+id).remove();
            ligaBTN();
        });
    }

    $('.comeco3').show("slow");

    $('#add').click(function() {
        if (listaE.getTamanho()>=100) {
            alert("Nem todo mundo é de ferro! Cansei por enquanto, que tal uma pausa?\n");
            $('#add').prop('disabled', true);
        }else{
            add = listaE.getTamanho();
            if (/^\d+$/.test($('#valor').val())){//verifica se a entrada é um número.
                raiz = $('#entrada').offset();
                if ($('#posicao').val()==""){
                    desligaBTN();//desabilita os botões para que duas animação não aconteçam ao mesmo tempo.                        
                    listaE.inserir((listaE.getTamanho()+1), $('#valor').val(), divID);//posição, div:valor e id Adiciona ao fim da lista
                    $('#apresentacao').append('<div id="caixa'+divID+'" class="animate float-left" style="position: absolute;"><div class="caixa float-left"><input type="text" value="'+$('#valor').val()+'" disabled></div><div class="comeco"></div></div>');//cria uma nova caixa para a simulação

                    destinoTopo=80*parseInt((add*110)/($('#apresentacao').width()-110));
                    destinoEsquerdo=parseInt(((add*110)%($('#apresentacao').width()-110))/110)*110;
                    
                    $('#caixa'+divID).offset({top: raiz.top, left: raiz.left});//define a posição de origem da nova caixa
                    //faz a animação até a posição correta, define a posição como estática, cria a ligação qua aponta para o próximo elemento e desabilita os botões.
                    $('#caixa'+divID).animate({top: destinoTopo, left: destinoEsquerdo}, 1000, function(){
                        $('#caixa'+divID++).css({"position": "static"});
                        //$('#apresentacao').append('<div class="comeco"></div>');
                        $('.comeco').show("slow");
                        //Atualiza os detalhes só depois da animação.
                        if(listaE.getTamanho() == 1){
                            atualizaDetalhes(listaE.getTamanho(), $('#valor').val(), $('#valor').val());
                        }else{
                            atualizaDetalhes(listaE.getTamanho(), null, $('#valor').val());
                        }
                        ligaBTN();
                    });
                }else{
                    if (/^\d+$/.test($('#posicao').val())){//verifica se a entrada é um número.
                        if (($('#posicao').val()>listaE.getTamanho()+1) || ($('#posicao').val()<1)){
                            alert("Aparentemente a posição fornecida não é válida.\n");
                            ligaBTN();
                        }else{
                            desligaBTN();//desabilita os botões para que duas animação não aconteçam ao mesmo tempo.
                            if($('#posicao').val()==listaE.getTamanho()+1){//adiciona no fim
                                
                                //vê se a linha tá preenchida e quebra a geração de novas animais a baixo.
                                listaE.inserir($('#posicao').val(), $('#valor').val(), divID);//posição, div:valor e id Adiciona ao fim da lista
                                $('#apresentacao').append('<div id="caixa'+divID+'" class="animate float-left" style="position: absolute;"><div class="caixa float-left"><input type="text" value="'+$('#valor').val()+'" disabled></div><div class="comeco"></div></div>');//cria uma nova caixa para a simulação
                            }else{
                                var anterior = listaE.buscaElemento($('#posicao').val());
                                add = $('#posicao').val()-1;
                                listaE.inserir($('#posicao').val(), $('#valor').val(), divID);//posição, div:valor e id Adiciona ao fim da lista
                                $('#caixa'+anterior.getId()).before('<div id="caixa'+divID+'" class="animate float-left" style="position: absolute;"><div class="caixa float-left"><input type="text" value="'+$('#valor').val()+'" disabled></div><div class="comeco"></div></div>');//cria uma nova caixa para a simulação
                            }
                            destinoTopo=80*parseInt((add*110)/($('#apresentacao').width()-110));
                            destinoEsquerdo=parseInt(((add*110)%($('#apresentacao').width()-110))/110)*110;
                            $('#caixa'+divID).offset({top: raiz.top, left: raiz.left});//define a posição de origem da nova caixa   
                            //faz a animação até a posição correta, define a posição como estatica, cia a ligação qua aponta para o próximo elemento e desabilita os botões.
                            $('#caixa'+divID).animate({top: destinoTopo, left: destinoEsquerdo}, 1000, function(){
                                $('#caixa'+divID++).css({"position": "static"});
                                $('.comeco').show("slow");
                                if(listaE.getTamanho() == 1){
                                    atualizaDetalhes(listaE.getTamanho(), $('#valor').val(), $('#valor').val());
                                }else if($('#posicao').val()==1){
                                    atualizaDetalhes(listaE.getTamanho(), $('#valor').val(), null);
                                }else if($('#posicao').val()==listaE.getTamanho()){
                                    atualizaDetalhes(listaE.getTamanho(), null, $('#valor').val());
                                }else{
                                    atualizaDetalhes(listaE.getTamanho(), null, null);
                                }
                                ligaBTN();
                            }); 
                        }
                    }else{
                        alert("Aparentemente a posição fornecida não é válida.\n");
                    }
                }
            }else{
                alert("Apenas números inteiros são permitidos.\n");
            }
        }
    });

    $('#rmv').click(function() {
        var removido;
        desligaBTN();
        if($('#posicao').val()=="" && listaE.getTamanho()!=0){
            removido = listaE.remover(1);
            limpaDiv(removido.getId());
        }else{
            if (/^\d+$/.test($('#posicao').val())){//verifica se a entrada é um número.
                if($('#posicao').val()>listaE.getTamanho() || $('#posicao').val()==0){
                    alert("Não foi possível remover!\nAparentemente a posição passada não é válida.\n");
                    ligaBTN();
                    atualizaDetalhes(listaE.getTamanho(), );
                }else{
                    removido = listaE.remover($('#posicao').val());
                    limpaDiv(removido.getId());
                }
            }else{
                alert("Não foi possível remover!\nAparentemente a posição passada não é válida.\n");
                ligaBTN();
            }
        }
        if (listaE.getTamanho()!=0) {
            atualizaDetalhes(listaE.getTamanho(), listaE.buscaElemento(1).getConteudo(), listaE.buscaElemento(listaE.getTamanho()).getConteudo());
        }else{
            atualizaDetalhes(0, "***", "***");
        }
    });

    $('#src_pos').click(function(){
        desligaBTN();
        var posicao = $('#posicao').val();
        if (/^\d+$/.test(posicao)){
            elemento = listaE.buscaElemento(posicao);
            if (elemento!=null){
                $('.animate').css({"opacity": 0.3});
                $('#caixa'+elemento.getId()+' .caixa').addClass("shadow border-2 rounded");
                $('#caixa'+elemento.getId()).animate({opacity: 1}, 1500);
            }else{
                alert("Não foi possível localizar algum elemento!\nAparentemente a posição passada não é válida.\n");
                ligaBTN();
            }
        }else{
            alert("Apenas números inteiros são permitidos.\n");
            ligaBTN();
        }
    });

    $('#src_val').click(function(){
        desligaBTN();
        var valor = $('#valor').val();
        if (/^\d+$/.test(valor)){
            elemento = listaE.buscaPosicao(valor);
            if (elemento!=null){
                $('.animate').css({"opacity": 0.3});
                $('#caixa'+elemento.getId()+' .caixa').addClass("shadow border-2 rounded");
                $('#caixa'+elemento.getId()).animate({opacity: 1}, 1500);
            }else{
                alert("Não localizamos elementos que corresponda com o valor informado!\n");
                ligaBTN();
            }
        }else{
            alert("Apenas números inteiros são permitidos.\n");
            ligaBTN();
        }
    });

    $('#posicao').focus(function(){
        $('.caixa').removeClass("shadow border-2 rounded");
        $('.animate').css({"opacity": 1});
        ligaBTN();
    });

    $('#valor').focus(function(){
        $('.caixa').removeClass("shadow border-2 rounded");
        $('.animate').css({"opacity": 1});
        ligaBTN();
    });
});