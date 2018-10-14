$(document).ready(function() {
    setupModalDialog();
    setupTree();
    updateScreen();
});

function setupTree()
{
    console.log("Standard Tree");
    setupModalMenu();
    $('#addroot').click(function() {
        showModalDialog(function(value) {
            if (/^\d+$/.test(value))
            {
                addRoot(value);
            }
            else
            {
                alert("Valor inválido!");
            }
        }, null);
    });
}

function updateScreen()
{
    $('#addroot').prop('disabled', $(".treenode").length != 0);
    $('#lblraiz')[0].innerHTML = ' ' + (getSize() != 0 ? getRootValue() : "*") + ' ';
    $('#tamanho')[0].innerHTML = ' ' + getSize() + ' ';
    $('#altura')[0].innerHTML = ' ' + getTreeHeight() + ' ';
}



function childFactory(value, espclass)
{
    return '<li class="li_node' + (espclass != null ? (" " + espclass) : "" ) +
        '"><div class="treenode disablednode">' + value + '</div><ul></ul></li>';
}

function getSelectorUL(selector)
{
    if (selector.hasClass("treenode"))
        return selector.siblings();
    else if (selector.hasClass("li_node"))
        return selector.children().last();
    else
        return selector;
}

function addChild(selector, value, espclass)
{
    getSelectorUL(selector).append(childFactory(value, espclass));
    enableNode();
    updateScreen();
}


function addRoot(value)
{
    addChild($("#treecontainer"), value, "treeroot ")
}

function getSize()
{
    return $("#treecontainer div.treenode").length;
}

function getSubHeight(sub)
{
    console.log("old and problematic");
    sub = getSelectorUL(sub).parent();
    
    return jQuery.makeArray(sub.find(".treenode")).reduce(function(acc, el){
        var l = $(el).parents().filter(".li_node").length;
        return l > acc ? l : acc;
    }, 0) - sub.parent().parents().filter(".li_node").length;
}

function getTreeHeight()
{
    return getSubHeight($(".treeroot"));
}

function getRootValue()
{
    return getNodeValue($(".treeroot").eq(0));
}

function getNodeValue(node)
{
    return getSelectorUL(node).siblings().text();
}

var selectedNode;
function enableNode()
{
    $('.disablednode').first().click(function(arg){
        selectedNode = $(this);
        $("#contextmenucontainer").show(300);
    });
    $('.disablednode').removeClass('disablednode');
}



function setupModalMenu()
{

    $('#menu_add').click(function() {
        $('#contextmenucontainer').hide(300);
        showModalDialog(function(value) {
            if (/^\d+$/.test(value))
            {
                addChild(selectedNode.siblings(), value);
            }
            else
            {
                alert("Valor inválido!");
            }
        }, null);
    });

    $('#menu_edit').click(function() {
        $('#contextmenucontainer').hide(300);
        showModalDialog(function(value) {
            if (/^\d+$/.test(value))
            {
                selectedNode[0].innerHTML = value;
                updateScreen();
            }
            else
            {
                alert("Valor inválido!");
            }
        }, null, selectedNode[0].innerHTML, "Editar");
    });

    $('#menu_rem').click(function() {
        $('#contextmenucontainer').hide(300);
        selectedNode.parent().remove();
        updateScreen();
    });

    $('#menu_abort').click(function() {
        $('#contextmenucontainer').hide(300);
    });
}




function setupModalDialog()
{
    $("body").append(`<style>
                        .inputdialog {
                            top: 0px;
                            left: 0px;
                            width: 100%;
                            height: 100%;
                            background:#3A3A3A;
                            position:absolute;
                            display: none;
                            z-index: 2000;
                        }
                        
                        .inputdialogintern {
                            min-width: 300px;
                            max-width: 500px;
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            color: white;
                        }
                        
                        .inputdialogintern .buttons{
                            text-align: right;
                            margin-top: 10px;
                        }
                    </style>
                    <div id="inputdialog" class="inputdialog col-12">
                        <div class="inputdialogintern">
                            <h5>Insira o valor desejado abaixo:</h5>
                            <div>
                                <input class="col-12 text-center" type="text" id="dvalor" name="dvalor" title="Valor" placeholder="Valor">
                            </div>
                            <div class="buttons">
                                <button type="button" class="btn btn-info btn-sm" id="dadd">Adicionar</button>
                                <button type="button" class="btn btn-danger btn-sm" id="drmv">Cancelar</button>
                            </div>
                        </div>
                    </div>`);
    $("#drmv").click(function() {
        if (mcancfunc != null)
        {
            mcancfunc();
        }
        $("#inputdialog").hide(500);
    });
    $("#dadd").click(function() {
        if (mokfunc != null)
        {
            var fc = mokfunc($('#dvalor').val());
            if (fc != undefined && fc == true)
            {
                return;
            }
        }
        $("#inputdialog").hide(500);
    });
    $('#dvalor').keyup(function(e){
        if(e.keyCode == 13)
        {
            $("#dadd").click();
        }
        else if (e.keyCode == 27)
        {
            $("#drmv").click();
        }
    });
}

var mokfunc, mcancfunc;
function showModalDialog(okFunction, canceledFunction, defaultvalue, okbtntext)
{
    mokfunc = okFunction;
    mcancfunc = canceledFunction;
    $("#dadd")[0].innerHTML = (okbtntext != null ? okbtntext : "Adicionar");
    $("#inputdialog").show(500);
    $('#dvalor').val(defaultvalue == null ? "" : defaultvalue);
    $('#dvalor').focus();
}