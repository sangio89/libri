
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

function saveBook() {
    var id = $("#bookId").val();
    var titolo = $("#bookTitle").val();
    var autore = $("#bookAuthor").val();
    var prezzo = $("#bookPrice").val();

    $.ajax({
        type : "POST",  
        url  : "http://localhost:8888/salvalibro",  
        data : { 
            id : id,
            titolo : titolo, 
            autore : autore, 
            prezzo : prezzo
        }, 
        success: function(res){
            $("#messageBox").show();
            $("#messageBox").text("Hai inserito " + titolo);
            setTimeout(hideMessageBox, 3000);
            refreshList();
        }    
    });
    hideBookForm();
    //il problema sembra essere che ogni tanto usi delle funzioni ordinate (hideNewBook) e ogni tanto fai a mano hide e show, quindi si incasina. infatti
    //delle volte non aggiorna e poi ne carica due insieme quello è strano...cq il concetto sembra sia passato xk funziona tutto.
    //poi diventa questione di pratica, aggiungi la possibilita di cancellare libri e magari un tasto "modifica" che ti apre la form di inserimento ma 
    //sta volta precompilata coi valori del libro che stai modificando, in quel caso dovrai "aggiornare" il record anziche crearlo.
    //provo, sta cosa dei bottoni mi fa andare in bestia vabbe dai, chiudo e decido cosa fare. lmk
    }
    
function hideBookForm() {
    $("#manageBook").hide();
    $('#buttonNewBook').show();
    }

function hideAlert() {
    $("#bookAlert").hide();
    $("#buttonNewBook").show();
}

//tanto e' vero che poi ci cicli sopra, 

function aggiornaTabellaLibriConLibriPresiDalServer(response) {
    //a questo punto ti trovi qui ed hai response = {data: [{titolo: 'guido', autore:'g.s.', prezzo:19}, {titolo:'cane contro cane', autore: 'umb', prezzo: 2}]}
    //quindi prendi data e lo salvi in una variabile (libri) e, sapendo che è un array, ci cicli sopra per lanciare la funzione aggiorna...
    var libri = response.data;
    maxPageNumber = response.maxPageNumber;
    $.each (libri, aggiungiLibroATabella); //qui? cicla?si, $.each è una funzione di jQuery
    //per ogni "libri" lancia aggioranTabellaLibri.
    $("#pageNumber").text(globalPageNumber);
    $("#maxPageNumber").text(maxPageNumber);
    
}

function aggiungiLibroATabella(index, libro, autore, prezzo) {
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
    titolo + "</td><td>" + autore + "</td><td>" + prezzo + " euro</td>"+
    "<td><button id='deleteButton' onclick=deleteBook(event)>Cancella</button></td>"+
    '<td><button id=\'editButton\' onclick="showForm(' + id + ' , \'' + titolo + '\' , \'' + autore + '\' , ' + prezzo + '  )">Modifica</button></td></tr>')
    
}

function deleteBook(event) {
    
    var id =$($(event.target).parent().parent().children()[0]).attr('value');
    //ok, da capire c'è solo la differenza fra 
    //accedere ad unn oggetto del DOM
    //accedere ad un oggeto del DOM tramite jQuery
    //se devi accedere poi al suo parent o ad un suo attributo, devi usare jQuery
    //quindi metti il suo selettore fra $(selettore),
    //se per ottenere il selettore devi usare jquery allora inizi ad avere le cascate di $($(....))
    //piu che altro, lanci un comando jq sull'output di un comando jquery
    
    $.ajax({
        type : "POST",  
        url  : "http://localhost:8888/cancellalibro",  
        data : { 
            id : id
        }, 
        success: function(res) {
            
            var titolo = $($(event.target).parent().parent().children()[1]).text();
            refreshList();
            $("#messageBox").show();
            $("#messageBox").text("Hai cancellato " + titolo);
            setTimeout(hideMessageBox, 3000);
            }
    });

    //se lanci refreshList qua, tu stai dicendo:
    //hey server, cancella la riga 1
    //io mi ricarco (ma senza aspettare che tu l'abbia cancellata
}

function aggiornaTabellaLibri(pageNumber) {                
    var filterTitle = $("#filterTitle").val();
    var filterAuthor = $("#filterAuthor").val();
    
    $.ajax({        //jquery.ajax(): Esegue una richiesta HTTP asincrona (Ajax).
        type : "POST",
        url: "http://localhost:8888/libro",
        data: {
            titolo : filterTitle,
            autore : filterAuthor,
            pageNumber : pageNumber
        } , //url da chiamare
        dataType: 'json', //tipo di risposta che mi aspetto (un json)
        success: aggiornaContenutoTabella //cosa me ne faccio del json? lo passo (come oggetto JS) ad una funzione, quale? aggiornaTabellaLibriConLibriPresiDalServer
    });
}

function aggiornaContenutoTabella(response) {
    $("#listaLibri tbody").empty();
    aggiornaTabellaLibriConLibriPresiDalServer(response)
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



globalPageNumber = 1;

$(document).ready(aggiornaTabellaLibri(globalPageNumber));

function nextPage() {
    if (globalPageNumber < maxPageNumber) {
        globalPageNumber++;
        refreshList(); 
    }
}
function previousPage() {
    if (globalPageNumber == maxPageNumber) {
        globalPageNumber--;
        refreshList();
    }
} 