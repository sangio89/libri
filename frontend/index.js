
function aggiornaTabellaLibri(pageNumber, orderColumn) {          
    var filterTitle = $("#filterTitle").val();
    var filterAuthor = $("#filterAuthor").val();
    
    if (globalOrderCriteria) {
        if (globalOrderCriteria == "ASC") {
            globalOrderCriteria = "DESC";
        } else {
            globalOrderCriteria = "ASC";
        }
    } else {
        globalOrderCriteria = 'ASC';
    }
    
    $("#sortIcon").remove();
    $("." + orderColumn).prepend("<img id='sortIcon' src=' " + globalOrderCriteria + ".png' width=12 height=12/>")

    $.post({        //jquery.ajax(): Esegue una richiesta HTTP asincrona (Ajax). post è come ajax ma definisce il parametro type = post.
        url: "http://localhost:8888/libro",
        data: {
            titolo : filterTitle,
            autore : filterAuthor,
            pageNumber : pageNumber,
            orderColumn : orderColumn,
            orderDirection : globalOrderCriteria,
        } ,
        dataType: 'json', //tipo di risposta che mi aspetto (un json)
        success: aggiornaContenutoTabella //cosa me ne faccio del json? lo passo (come oggetto JS) ad una funzione, quale? aggiornaTabellaLibriConLibriPresiDalServer
    });
    

}

function setDesc() {
    $("#asc").hide();
    $("#desc").show();
}

function setAsc() {
    $("#asc").show();
    $("#desc").hide();
}

function saveBook() {
    var id = $("#bookId").val();
    var titolo = $("#bookTitle").val();
    var autore = $("#bookAuthor").val();
    var prezzo = $("#bookPrice").val();

    $.post({
        url  : "http://localhost:8888/salvalibro",
        dataType: 'json',  
        data : { 
            id : id,
            titolo : titolo, 
            autore : autore, 
            prezzo : prezzo
        }, 
        success: function(res){
            var text = "Hai modificato " + titolo;
            if(id == 0) {
                var text = "Hai inserito " + titolo;
            }
            var color = "green";
            if(!res.success){
                text = res.errors;
                color = "red";
            }
            $("#messageBox").show();
            $("#messageBox").text(text);
            $("#messageBox").css({"background-color": color, "border" : color});
            setTimeout(hideMessageBox, 3000);
            refreshList();    
        }    
    });
    hideBookForm();
}

function aggiungiLibroATabella(index, libro, autore, prezzo) {  //foreach jquery
    //qua dentro, come da documentazione, hai index = 1,2,3 a seconda dell'iterazione in cui ti trovi
    //e libro contiene il libro (e.g. {titolo: 'guido', autore:'g.s.', prezzo:19})
    //quindi ti salvi i suoi attributi in variabili i li usi per appendere una <tr>
    //il concetto di "passare una funzione come parametro" è un po' strano, cerco di spiegartelo
    //è come se facessi foreach libri as index => libro {
        //aggiorna..
    var id = libro.id;
    var titolo = libro.title;
    var autore = libro.author;
    var prezzo = libro.price;
    $("#listaLibri tbody").append("<tr><td id ="+id+" style='display: none' value='"+id+"'></td><td value="+ titolo +">" + 
    titolo + "</td><td>" + autore + "</td><td>" + prezzo + " \u20AC</td>"+
    "<td><button id='deleteButton' onclick=deleteBook(event)>Cancella</button></td>"+
    '<td><button id=\'editButton\' onclick="showForm(' + id + ' , \'' + titolo + '\' , \'' + autore + '\' , ' + prezzo + '  )">Modifica</button></td></tr>')   
}

function aggiornaTabellaLibriConLibriPresiDalServer(response) {
    var libri = response.data;

    maxPageNumber = response.maxPageNumber;
    $.each (libri, aggiungiLibroATabella); //qui? cicla?si, $.each è una funzione di jQuery
    //per ogni "libri" lancia aggioranTabellaLibri.
    $("#pageNumber").text(globalPageNumber);
    $("#maxPageNumber").text(maxPageNumber);
    
}

function deleteBook(event) {
    
    var id =$($(event.target).parent().parent().children()[0]).attr('value');
    var text = $($(event.target).parent().parent().children()[1]).text();
    //ok, da capire c'è solo la differenza fra 
    //accedere ad unn oggetto del DOM
    //accedere ad un oggeto del DOM tramite jQuery
    //se devi accedere poi al suo parent o ad un suo attributo, devi usare jQuery
    //quindi metti il suo selettore fra $(selettore),
    //se per ottenere il selettore devi usare jquery allora inizi ad avere le cascate di $($(....))
    //piu che altro, lanci un comando jq sull'output di un comando jquery
    
    $.post({
        url  : "http://localhost:8888/cancellalibro",  
        dataType : 'json',
        data : { 
            id : id
        }, 
        success: function(res) {
            var color = "green";
            if(!res.success){
                text = res.errors;
                color = "red";
            }
            $("#messageBox").show();
            $("#messageBox").text("Hai cancellato " + text);
            $("#messageBox").css({"background-color": color, "border" : color});
            setTimeout(hideMessageBox, 3000);
            refreshList();
            } 
        });

}

function showForm(bookId, bookTitle, bookAuthor, bookPrice){
    if (!bookId) {
        bookId = 0;
        bookTitle = "";
        bookAuthor = "";
        bookPrice = "";
    }
    $("#bookId").val(bookId);
    $("#bookTitle").val(bookTitle);
    $("#bookAuthor").val(bookAuthor);
    $("#bookPrice").val(bookPrice);
    $("#manageBook").show();
    $('#buttonNewBook').hide();
}

function hideMessageBox() {
    $("#messageBox").hide();
}
    
function hideBookForm() {
    $("#manageBook").hide();
    $('#buttonNewBook').show();
    }

function hideAlert() {
    $("#bookAlert").hide();
    $("#buttonNewBook").show();
}

function refreshList() {
    $("#listaLibri tbody").empty();
    $("#filterTitle").val(null);
    $("#filterAuthor").val(null);
    aggiornaTabellaLibri(globalPageNumber);
}

function showSearchMenu() {
    $("#filter").show();
    $("#searchButton").hide();
}

function hideSearchMenu() {
    $("#filter").hide();
    $("#searchButton").show();
}

function aggiornaContenutoTabella(response) {
    $("#listaLibri tbody").empty();
    aggiornaTabellaLibriConLibriPresiDalServer(response)
}

function nextPage() {
    if (globalPageNumber < maxPageNumber) {
        globalPageNumber++;
        refreshList(); 
    }
}
function previousPage() {
    if (globalPageNumber == maxPageNumber && globalPageNumber > 1) {
        globalPageNumber--;
        refreshList();
    }
}

globalPageNumber = 1;
globalOrderCriteria = "";

$(document).ready(aggiornaTabellaLibri(globalPageNumber));