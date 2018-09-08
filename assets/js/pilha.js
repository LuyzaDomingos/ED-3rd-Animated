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
        $('.caixa_topo').remove();
        var oldt = $('.caixa_empilhada:eq(0)');
        oldt.removeClass('caixa_blur');
        oldt.addClass('caixa_topo');
        $('#tamanho')[0].innerHTML = ' ' + getSize() + ' ';
        $('#lbltopo')[0].innerHTML = ' ' + (getSize() == 0 ? '*' : getTop()) + ' ';
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
            push_gr($('#caixa_valor').val());
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