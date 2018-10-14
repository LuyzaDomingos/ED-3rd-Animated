var globalInsertionEnabled = true;

function setupTree()
{
    console.log("AVL Tree");
    $('#addroot').hide();

    $('#add').click(function() {
        globalInsertionEnabled = false;
        disableSearchEffects();
        showModalDialog(function(value) {
            if (/^\d+$/.test(value))
            {
                addAVLChild(value);
            }
            else
            {
                alert("Valor inválido!");
            }
            globalInsertionEnabled = true;
        }, function() { globalInsertionEnabled = true; });
    });

    $('#search').click(function() {
        globalInsertionEnabled = false;
        disableSearchEffects();
        showModalDialog(function(value) {
            if (/^\d+$/.test(value))
            {
                treeSearch(value);
            }
            else
            {
                alert("Valor inválido!");
            }
            globalInsertionEnabled = true;
        }, function() { globalInsertionEnabled = true; }, null, "Pesquisar");
    });

    $(document).keyup(function(e){
        if (globalInsertionEnabled)
        {
            if(e.keyCode == 73)
            {
                $("#add").click();
            }
            else if (e.keyCode == 66)
            {
                $("#search").click();
            }
        }
    });

    $('#fb').change(function() {
        updateFB();
    });
    updateFB();
}





function isFBVisible()
{
    return $('#fb').prop('checked');
}

function updateFB()
{
    if (isFBVisible())
    {
        $('.box_avl_inside').removeClass('invisible');
    }
    else
    {
        $('.box_avl_inside').removeClass('invisible');
        $('.box_avl_inside').addClass('invisible');
    }
}

function isBlankNode(node)
{
    return getSelectorUL(node).parent().hasClass("invisible");
}


function getSubChild(child)
{
    return isBlankNode(child) ? null : getSelectorUL(child);
}

function getRightChild(node)
{
    node = getSelectorUL(node);
    return getSubChild(node.children().last());
}

function getLeftChild(node)
{
    node = getSelectorUL(node);
    return getSubChild(node.children().first());
}

function getAbsRightChild(node)
{
    return getSelectorUL(getSelectorUL(node).children().last());
}

function getAbsLeftChild(node)
{
    return getSelectorUL(getSelectorUL(node).children().first());
}


function getSubHeightOrZero(node)
{
    return node == null ? 0 : getSubHeight(node);
}

function calcAVLNodeWeight(node)
{
    node = getSelectorUL(node);
    return getSubHeightOrZero(getRightChild(node)) - getSubHeightOrZero(getLeftChild(node));
}





function addAVLChild(value)
{
    if (getSize() == 0)
    {
        addRoot(factoryNodesHintBox(value));
        updateWeights($(".treeroot"));
    }
    else
    {
        addAVLChildRecur(parseInt(value), $(".treeroot"));
    }
}


function addAVLChildRecur(value, node)
{
    node = getSelectorUL(node);
    toadd = (value < parseInt(getNodeValue(node)) ? getLeftChild : getRightChild)(node);
    if (toadd != null)
    {
        addAVLChildRecur(value, toadd);
    }
    else
    {
        toadd = getSelectorUL(node.children().eq(value < parseInt(getNodeValue(node)) ? 0 : 1));
        toadd.siblings().html(factoryNodesHintBox(value));
        toadd.parent().removeClass("invisible");
        toadd.html(factoryInvisibleNodes());
        updateWeights(toadd);
    }
}


function updateWeights(node)
{
    //$(".box_avl_inside").removeClass("redtext");
    updateWeights_tail(node, true);
    $(".treeroot").removeClass("treeroot");
    if ($(".tree").children().length > 0)
    {
        $(".tree").children().first().addClass("treeroot");
    }
    updateScreen();
}

function updateWeights_tail(node, balance, descent)
{
    if (node.parents().filter(".li_node").length == 0 && !node.hasClass("li_node") && !isBlankNode(node))
        return;
    node = getSelectorUL(node);
    var weight = calcAVLNodeWeight(node);
    var elem = node.siblings().find(".box_avl_inside");
    if (balance && Math.abs(weight) >= 2)
    {
        //elem.addClass("redtext");
        balanceTree(node);
        return;
    }
    var olde = elem.html();
    elem.html(weight);
    if (descent)
    {
        updateWeights_tail(getAbsLeftChild(node), false, true);
        updateWeights_tail(getAbsRightChild(node), false, true);
    }
    else
    {
        updateWeights_tail(node.parent().parent(), balance);
    }
}





function balanceTree(node)
{
    node = getSelectorUL(node);
    var weight = calcAVLNodeWeight(node);
    if (Math.abs(weight) != 2)
        return;
    
    // Pesando para direita = true; para esquerda = false;
    var rightWeighted = weight > 0;
    var problematicChild = (rightWeighted ? getRightChild : getLeftChild)(node);

    // Caso 1 (true): +*+ = -*- = +  /  Caso 2 (false):  +*- = -*+ = -
    var caso = weight * calcAVLNodeWeight(problematicChild) > 0;

    if (caso) // CASO 1
    {
        (rightWeighted ? rotateToLeft : rotateToRight)(node);
        updateWeights_tail($(".tree").children().first(), false, true);
    }
    else // CASO 2
    {
        (rightWeighted ? rotateToRight : rotateToLeft)(problematicChild);
        (rightWeighted ? rotateToLeft : rotateToRight)(node);
        updateWeights_tail($(".tree").children().first(), false, true);
    }
}

function rotateToLeft(node)
{
    node = getSelectorUL(node);
    console.log("Rotaciona para esquerda o nó " + getNodeValue(node));
    var child = getAbsRightChild(node);
    var t2 = getAbsLeftChild(child);

    var childPar = child.parent().detach();
    var t2Par = t2.parent().detach();
    t2Par.appendTo(node);
    
    node.parent().after(childPar);
    var nodePar = node.parent().detach();
    nodePar.prependTo(child);
}

function rotateToRight(node)
{
    node = getSelectorUL(node);
    console.log("Rotaciona para direita o nó " + getNodeValue(node));
    var child = getAbsLeftChild(node);
    var t2 = getAbsRightChild(child);

    var childPar = child.parent().detach();
    var t2Par = t2.parent().detach();
    t2Par.prependTo(node);
    
    node.parent().after(childPar);
    var nodePar = node.parent().detach();
    nodePar.appendTo(child);
}




function treeSearch(value, node)
{
    if (node === undefined)
    {
        treeSearch(value, $(".treeroot"));
        return;
    }
    node = getSelectorUL(node);
    console.log("searching by " + value + "; current: " + getNodeValue(node));

    $("div.nodemidlight").removeClass("nodemidlight");
    node.siblings().addClass("nodemidlight");
    
    if (getNodeValue(node) == value)
    {
        setTimeout(function(){
            $("div.nodemidlight").removeClass("nodemidlight");
            node.siblings().addClass("nodehighlight");
        }, 750);
    }
    else
    {
        toadd = (value < parseInt(getNodeValue(node)) ? getLeftChild : getRightChild)(node);
        if (toadd != null)
        {
            setTimeout(function(){
                treeSearch(value, toadd);
            }, 750);
        }
        else
        {
            $("div.nodemidlight").removeClass("nodemidlight");
            alert("O valor não existe!");
        }
    }
}

function disableSearchEffects()
{
    $("div.nodemidlight").removeClass("nodemidlight");
    $("div.nodehighlight").removeClass("nodehighlight");
}







function enableNode()
{
    $('.disablednode').removeClass('disablednode');
}

function getNodeValue(node)
{
    var sbstr = getSelectorUL(node).siblings().text();
    return sbstr.substring(0, sbstr.length - getSelectorUL(node).siblings().find(".box_avl_inside").text().length);
}

function factoryNodesHintBox(value)
{
    return '<div class="box_avl_utter">' + value +
    '<div class="box_avl_inside' + (isFBVisible() ? '' : ' invisible') + '">#</div></div>';
}

function factoryInvisibleNodes()
{
    return  '<li class="li_node invisible"><div class="treenode">*</div><ul></ul></li>' +
            '<li class="li_node invisible"><div class="treenode">*</div><ul></ul></li>' ;
}

function childFactory(value, espclass)
{
    return '<li class="li_node' + (espclass != null ? (" " + espclass) : "" ) +
        '"><div class="treenode disablednode">' + value + '</div><ul>' + factoryInvisibleNodes() +
        '</ul></li>';
}

function getSubHeight(sub)
{
    sub = getSelectorUL(sub).parent();
    
    return jQuery.makeArray(sub.find(".treenode")).reduce(function(acc, el){
        var l = $(el).parents().filter("li.li_node.invisible").length == 0 ? $(el).parents().filter(".li_node").length : 0;
        return l > acc ? l : acc;
    }, 0) - sub.parent().parents().filter(".li_node").length;
}

function getSize()
{
    return $("#treecontainer div.treenode").length - $("#treecontainer li.li_node.invisible").length;
}