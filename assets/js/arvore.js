/*
                                                 ,  ,
                                               / \/ \
                                              (/ //_ \_
     .-._                                      \||  .  \
      \  '-._                            _,:__.-"/---\_ \
 ______/___  '.    .--------------------'~-'--.)__( , )\ \
`'--.___  _\  /    |             Here        ,'    \)|\ `\|
     /_.-' _\ \ _:,_          Be Dragons           " ||   (
   .'__ _.' \'-/,`-~`                                |/
       '. ___.> /=,|  Abandon hope all ye who enter  |
        / .-'/_ )  '---------------------------------'
        )'  ( /(/
             \\ "
              '=='

This horrible monstrosity takes a medicare monstrosity and mangles it
into a data structure that can easily be used to create a medicare feed.
It's bloated, confusing, and pretty awful by necessity(for the most part).
*/





$(document).ready(function () {
    setupModalDialog();
    setupTree();
    updateScreen();
    window.onresize = function (event) {
        updateScreen();
    };
});


function setupTree() {
    console.log("Standard Tree");
    setupModalMenu();
    $('#addroot').click(function () {
        showModalDialog(function (value) {
            if (/^\d+$/.test(value)) {
                addRoot(value);
            }
            else {
                alert("Valor inválido!");
            }
        }, null);
    });
}








function setupModalMenu() {

    $('#menu_add').click(function () {
        $('#contextmenucontainer').hide(300);
        showModalDialog(function (value) {
            if (/^\d+$/.test(value)) {
                addChild(selectedNode.siblings(), value);
            }
            else {
                alert("Valor inválido!");
            }
        }, null);
    });

    $('#menu_edit').click(function () {
        $('#contextmenucontainer').hide(300);
        showModalDialog(function (value) {
            if (/^\d+$/.test(value)) {
                selectedNode[0].innerHTML = value;
                updateScreen();
            }
            else {
                alert("Valor inválido!");
            }
        }, null, selectedNode[0].innerHTML, "Editar");
    });

    $('#menu_rem').click(function () {
        $('#contextmenucontainer').hide(300);
        selectedNode.parent().remove();
        updateScreen();
    });

    $('#menu_abort').click(function () {
        $('#contextmenucontainer').hide(300);
    });
}


function setupModalDialog() {
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
    $("#drmv").click(function () {
        if (mcancfunc != null) {
            mcancfunc();
        }
        $("#inputdialog").hide(500);
    });
    $("#dadd").click(function () {
        if (mokfunc != null) {
            var fc = mokfunc($('#dvalor').val());
            if (fc != undefined && fc == true) {
                return;
            }
        }
        $("#inputdialog").hide(500);
    });
    $('#dvalor').keyup(function (e) {
        if (e.keyCode == 13) {
            $("#dadd").click();
        }
        else if (e.keyCode == 27) {
            $("#drmv").click();
        }
    });
}







function getSize() {
    return $("#treecontainer div.treenode").length;
}

function getSubHeight(sub) {
    console.log("old and problematic");
    sub = getSelectorUL(sub).parent();

    return jQuery.makeArray(sub.find(".treenode")).reduce(function (acc, el) {
        var l = $(el).parents().filter(".li_node").length;
        return l > acc ? l : acc;
    }, 0) - sub.parent().parents().filter(".li_node").length;
}

function getTreeHeight() {
    return getSubHeight($(".treeroot"));
}

function getRootValue() {
    return getNodeValue($(".treeroot").eq(0));
}

function getRootNode() {
    return $(".treeroot").eq(0);
}

function getNodeValue(node) {
    return getSelectorUL(node).siblings().text();
}

function getSelectorUL(selector) {
    if (selector.hasClass("treenode"))
        return selector.siblings();
    else if (selector.hasClass("li_node"))
        return selector.children().last();
    else
        return selector;
}

function getSelectorDIV(selector) {
    return getSelectorUL(selector).siblings();
}





function addChild(selector, value, espclass) {
    getSelectorUL(selector).append(childFactory(value, espclass));
    enableNode();
    updateScreen();
}

function addRoot(value) {
    addChild($("#treecontainer"), value, "treeroot ")
}





var selectedNode;
function enableNode() {
    $('.disablednode').first().click(function (arg) {
        selectedNode = $(this);
        $("#contextmenucontainer").show(300);
    });
    $('.disablednode').removeClass('disablednode');
}


function updateScreen() {
    $('#addroot').prop('disabled', $(".treenode").length != 0);
    $('#lblraiz')[0].innerHTML = ' ' + (getSize() != 0 ? getRootValue() : "*") + ' ';
    $('#tamanho')[0].innerHTML = ' ' + getSize() + ' ';
    $('#altura')[0].innerHTML = ' ' + getTreeHeight() + ' ';
    drawTreeLines(getRootNode());
}


var mokfunc, mcancfunc;
function showModalDialog(okFunction, canceledFunction, defaultvalue, okbtntext) {
    mokfunc = okFunction;
    mcancfunc = canceledFunction;
    $("#dadd")[0].innerHTML = (okbtntext != null ? okbtntext : "Adicionar");
    $("#inputdialog").show(500);
    $('#dvalor').val(defaultvalue == null ? "" : defaultvalue);
    $('#dvalor').focus();
}







function childFactory(value, espclass) {
    return '<li class="li_node' + (espclass != null ? (" " + espclass) : "") +
        '"><div class="treenode disablednode">' + value + '</div><ul></ul></li>';
}







function drawTreeLines(node) {
    $(".directline").remove();
    __drawTreeLines(node);
}

function __getTreeLinesDrawer(nodepar, nodechild) {
    connectLine(nodepar, getSelectorDIV(nodechild)[0]);
}

function __drawTreeLines(node) {
    node = getSelectorUL(node);
    var nodediv = getSelectorDIV(node)[0];
    node.children().each(function () {
        __getTreeLinesDrawer(nodediv, $(this));
        __drawTreeLines($(this));
    });
}


// https://stackoverflow.com/questions/8672369/how-to-draw-a-line-between-two-divs

function getOffset(el) {
    var rect = el.getBoundingClientRect();
    return {
        left: rect.left + window.pageXOffset,
        top: rect.top + window.pageYOffset,
        width: rect.width || el.offsetWidth,
        height: rect.height || el.offsetHeight
    };
}

function connectLine(div1, div2) { // draw a line connecting elements
    var thickness = 3;
    var container = $("#treecontainer");
    var containerOffset = container.offset();
    var off1 = getOffset(div1);
    var off2 = getOffset(div2);
    // bottom center
    var x1 = off1.left + (off1.width / 2) - containerOffset.left + 15;
    var y1 = off1.top + off1.height - containerOffset.top + 3;
    // top center
    var x2 = off2.left + (off2.width / 2) - containerOffset.left + 15;
    var y2 = off2.top - containerOffset.top + 3;
    // distance
    var length = Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)));
    // center
    var cx = ((x1 + x2) / 2) - (length / 2);
    var cy = ((y1 + y2) / 2) - (thickness / 2);
    // angle
    var angle = Math.atan2((y1 - y2), (x1 - x2)) * (180 / Math.PI);
    // make hr
    var htmlLine = "<div class=\"directline\" style='padding:0px; margin:0px; line-height:1px; position:absolute; left:" + cx + "px; top:" + cy + "px; width:" + length + "px; -moz-transform:rotate(" + angle + "deg); -webkit-transform:rotate(" + angle + "deg); -o-transform:rotate(" + angle + "deg); -ms-transform:rotate(" + angle + "deg); transform:rotate(" + angle + "deg);'></div>";
    //
    //console.log(htmlLine);
    container.append(htmlLine);
    //document.body.innerHTML += htmlLine;
}