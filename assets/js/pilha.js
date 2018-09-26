function getSize()
{
    return $('.caixa_empilhada').length;
}

function getTop()
{
    return $('.caixa_topo')[0].getElementsByTagName('input')[0].value;
}

function isBlurEnabled()
{
    return $('#visualizacao').prop('checked');
}

function isVerticalOriented()
{
    return $('#orientacao').prop('checked');
}




function push_gr(value)
{
    if (getSize() != 0)
    {
        var oldt = $('.caixa_topo');
        oldt.removeClass('caixa_topo');
        if (isBlurEnabled())
            oldt.addClass('caixa_blur');
    }
    $('#pilha_logica').prepend('<div class="caixa caixa_empilhada caixa_topo" title="Valor"><input type="text" name="valor" placeholder="valor" value="' + value + '" readonly></div>');
    $('#tamanho')[0].innerHTML = ' ' + getSize() + ' ';
    $('#lbltopo')[0].innerHTML = ' ' + (getSize() == 0 ? '*' : getTop()) + ' ';
}

function pop_gr()
{
    if (getSize() != 0)
    {
        $('#lblremovido')[0].innerHTML = ' ' + getTop() + ' ';
        $('.caixa_topo').remove();
        var oldt = $('.caixa_empilhada:eq(0)');
        oldt.removeClass('caixa_blur');
        oldt.addClass('caixa_topo');
        $('#tamanho')[0].innerHTML = ' ' + getSize() + ' ';
        $('#lbltopo')[0].innerHTML = ' ' + (getSize() == 0 ? '*' : getTop()) + ' ';
    }
    else
    {
        window.alert("Pilha vazia!");
    }
}


function setUpVisualizacao()
{
    if (isBlurEnabled())
    {
        $('.caixa_empilhada').addClass('caixa_blur');
        $('.caixa_empilhada:eq(0)').removeClass('caixa_blur');
    }
    else
    {
        $('.caixa_empilhada').removeClass('caixa_blur');
    }
}

function setUpOrientacao()
{
    var replaced;
    var newr = (replaced = isVerticalOriented() ? "horiz" : "vert") == "horiz" ? "vert" : "horiz";
    $('.gvpilha').each(function()
    {
        this.className = this.className.replace(replaced, newr);
    });
}

$(document).ready(function() {

    $('#add').click(function() {
        if (/^\d+$/.test($('#caixa_valor').val()))
        {
            animateInsert();
            //push_gr($('#caixa_valor').val());
        }
        else
        {
            window.alert("Insira um valor válido!");
        }
    });

    $('#rmv').click(function() {
        pop_gr();
    });

    $('#visualizacao').change(function() {
        setUpVisualizacao();
    });

    $('#orientacao').change(function() {
        setUpOrientacao();
    });

    setUpOrientacao();
    setUpVisualizacao();
});




function animateInsert()
{
    desligaBTN();//desabilita os botões para que duas animação não aconteçam ao mesmo tempo.
    var raiz = $('#entrada').offset();
    var destino;
    if (getSize() == 0)
    {
        destino = $('#pilha_logica').first().offset();
    }
    else
    {
        destino = $('.caixa_empilhada').first().offset();
    }
    desttop = destino.top-raiz.top;
    destleft = destino.left-raiz.left;
    //vê se a linha tá preenchida e quebra a geração de novas animais a baixo.
    // if (destino.left + comecowidth + $(".caixa").first().width() >= $("#apresentacaoframe").offset().left + $("#apresentacaoframe").width()) {
    //     desttop += $('.comeco').first().outerHeight();
    //     destleft = $('.comeco').first().offset().left-raiz.left;
    // }
    //listaE.inserir((listaE.getTamanho()+1), $('#valor').val(), divID);//posição, div:valor e id Adiciona ao fim da lista
    $('#apresentacao').append('<div id="caixatemp" class="caixa float-left" style="position: absolute;"><input type="text" value="'+$('#valor').val()+'" disabled></div>');//cria uma nova caixa para a simulação
    $('#caixatemp').offset({top: raiz.top, left: raiz.left});//define a posição de origem da nova caixa   
    //faz a animação até a posição correta, define a posição como estatica, cia a ligação qua aponta para o próximo elemento e desabilita os botões.
    $('#caixatemp').animate({'top': "+=" + desttop + "px", 'left': "+=" + destleft + "px"  }, 500, function(){
        //$('#caixa'+divID++).css({"position": "static"});
        $('#caixatemp').remove();
        // $('#apresentacaoframe').append('<div class="comeco"></div>');
        // $('.comeco').show("slow");
        // if(listaE.getTamanho() == 1){
        //     atualizaDetalhes(listaE.getTamanho(), $('#valor').val(), $('#valor').val());
        // }else{
        //     atualizaDetalhes(listaE.getTamanho(), null, $('#valor').val());
        // }
        push_gr($('#caixa_valor').val());
        ligaBTN();
    });
}
	
function ligaBTN(){
    $('#add').prop('disabled', false);
    $('#rmv').prop('disabled', false);
}

function desligaBTN(){
    $('#add').prop('disabled', true);
    $('#rmv').prop('disabled', true);
}