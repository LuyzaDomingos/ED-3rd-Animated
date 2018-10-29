$(document).ready(function () {

    $('#add').click(function () {
        if (/^\d+$/.test($('#caixa_valor').val())) {
            if (localStorage.getItem("disableAnimation") === null) {
                animatePush();
            }
            else {
                stack_push($('#caixa_valor').val());
            }
        }
        else {
            window.alert("Insira um valor válido!");
        }
    });

    $('#rmv').click(function () {
        if (localStorage.getItem("disableAnimation") === null) {
            animatePop();
        }
        else {
            stack_pop();
        }
    });

    $('#visualizacao').change(function () {
        setUpVisualizacao();
    });

    $('#orientacao').change(function () {
        setUpOrientacao();
    });

    setUpOrientacao();
    setUpVisualizacao();
});

function setUpVisualizacao() {
    if (isBlurEnabled()) {
        $('.caixa_empilhada').addClass('caixa_blur');
        $('.caixa_empilhada:eq(0)').removeClass('caixa_blur');
    }
    else {
        $('.caixa_empilhada').removeClass('caixa_blur');
    }
}

function setUpOrientacao() {
    var replaced;
    var newr = (replaced = isVerticalOriented() ? "horiz" : "vert") == "horiz" ? "vert" : "horiz";
    $('.gvpilha').each(function () {
        this.className = this.className.replace(replaced, newr);
    });
}






function stack_push(value) {
    if (getSize() != 0) {
        var oldt = $('.caixa_topo');
        oldt.removeClass('caixa_topo');
        if (isBlurEnabled())
            oldt.addClass('caixa_blur');
    }
    $('#pilha_logica').prepend('<div class="caixa caixa_empilhada caixa_topo" title="Valor"><input type="text" name="valor" placeholder="valor" value="' + value + '" readonly></div>');
    $('#tamanho')[0].innerHTML = ' ' + getSize() + ' ';
    $('#lbltopo')[0].innerHTML = ' ' + (getSize() == 0 ? '*' : getTop()) + ' ';
}

function stack_pop() {
    if (getSize() != 0) {
        $('#lblremovido')[0].innerHTML = ' ' + getTop() + ' ';
        $('.caixa_topo').remove();
        var oldt = $('.caixa_empilhada:eq(0)');
        oldt.removeClass('caixa_blur');
        oldt.addClass('caixa_topo');
        $('#tamanho')[0].innerHTML = ' ' + getSize() + ' ';
        $('#lbltopo')[0].innerHTML = ' ' + (getSize() == 0 ? '*' : getTop()) + ' ';
    }
    else {
        window.alert("Pilha vazia!");
    }
}

function animatePush() {
    desligaBTN();//desabilita os botões para que duas animação não aconteçam ao mesmo tempo.
    var raiz = $('#entrada').offset();
    var destino;
    if (getSize() == 0) {
        destino = $('#pilha_logica').first().offset();
    }
    else {
        destino = $('.caixa_empilhada').first().offset();
    }
    desttop = destino.top - raiz.top;
    destleft = destino.left - raiz.left;
    if (!hasScrollBar()) {
        desttop -= $(".caixa").first().outerHeight();
    }
    //vê se a linha tá preenchida e quebra a geração de novas animais a baixo.
    // if (destino.left + comecowidth + $(".caixa").first().width() >= $("#apresentacaoframe").offset().left + $("#apresentacaoframe").width()) {
    //     desttop += $('.comeco').first().outerHeight();
    //     destleft = $('.comeco').first().offset().left-raiz.left;
    // }
    //listaE.inserir((listaE.getTamanho()+1), $('#valor').val(), divID);//posição, div:valor e id Adiciona ao fim da lista

    //cria uma nova caixa para a simulação
    $('#apresentacao').append('<div id="caixatemp" class="caixa float-left" style="position: absolute;"><input type="text" value="' + $('#valor').val() + '" disabled></div>');
    $('#caixatemp').offset({ top: raiz.top, left: raiz.left });//define a posição de origem da nova caixa

    $('#pilha_logica').prepend('<div id="caixa_virtual" class="caixa" style="height: 0; visibility: hidden;"></div>');
    $('#caixa_virtual').animate({ height: $(".caixa").first().outerHeight() + 'px' }, { duration: 500, queue: false });

    //faz a animação até a posição correta, define a posição como estatica, cia a ligação qua aponta para o próximo elemento e desabilita os botões.
    $('#caixatemp').animate({ 'top': "+=" + desttop + "px", 'left': "+=" + destleft + "px", queue: false }, 500, function () {
        //$('#caixa'+divID++).css({"position": "static"});
        $('#caixatemp').remove();
        $('#caixa_virtual').remove();
        // $('#apresentacaoframe').append('<div class="comeco"></div>');
        // $('.comeco').show("slow");
        // if(listaE.getTamanho() == 1){
        //     atualizaDetalhes(listaE.getTamanho(), $('#valor').val(), $('#valor').val());
        // }else{
        //     atualizaDetalhes(listaE.getTamanho(), null, $('#valor').val());
        // }
        stack_push($('#caixa_valor').val());
        ligaBTN();
    });
}

function animatePop() {
    if (getSize() != 0) {
        $(".caixa_topo").animate({
            height: 0,
            opacity: 0
        }, 'slow', function () {
            stack_pop();
        });
    }
    else {
        stack_pop();
    }
}





function getSize() {
    return $('.caixa_empilhada').length;
}

function getTop() {
    return $('.caixa_topo')[0].getElementsByTagName('input')[0].value;
}




function isBlurEnabled() {
    return $('#visualizacao').prop('checked');
}

function isVerticalOriented() {
    return $('#orientacao').prop('checked');
}

function hasScrollBar() {
    return $(document).height() > $(window).height();
}





function ligaBTN() {
    $('#add').prop('disabled', false);
    $('#rmv').prop('disabled', false);
}

function desligaBTN() {
    $('#add').prop('disabled', true);
    $('#rmv').prop('disabled', true);
}