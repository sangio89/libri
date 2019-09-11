
function createInput(bookId, bookTitle, bookAuthor, bookPrice){
    if (!bookId) {
        bookId = 0;
        bookTitle = "";
        bookAuthor = "";
        bookPrice = "";
    }
    var newBookInput = '<style>#nuovoLibro{padding: 5px;border: 0.5px solid black;}</style>'
    +'<strong> Inserisci nuovo libro</strong>'+
    '<input type="text" style="display: none;" id="newBookId" value='+ bookId + ' />'+
    '</br>Titolo:   <input type="text" id="newBookTitle" value="'+ bookTitle +'" /> <br/> Autore: '+
    '<input type="text" id="newBookAuthor" value="'+ bookAuthor +'"/> <br/> Prezzo:  <input type="text" id="newBookPrice" value="'+ bookPrice +'"/>'+
    '</br><button id="saveNewBook" onclick="newBookAlert();">Salva</button>'+
    '<button id="backButton" onclick="hideNewBookForm();">Indietro</button>';
    document.getElementById("nuovoLibro").innerHTML = newBookInput;
    $('#buttonNewBook').hide();
    $('#nuovoLibro').show();
    
}

function newBookAlert() {
    var id = document.getElementById("newBookId").value;
    var titolo = document.getElementById("newBookTitle").value;
    var autore = document.getElementById("newBookAuthor").value;
    var prezzo = document.getElementById("newBookPrice").value;

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
        document.getElementById("bookAlert").innerHTML = "<style>#bookAlert{padding: 5px;border: 0.5px solid red;}</style>Hai inserito un nuovo libro";
                         
        }
    });
    hideNewBookForm();
    refreshList();
    //il problema sembra essere che ogni tanto usi delle funzioni ordinate (hideNewBook) e ogni tanto fai a mano hide e show, quindi si incasina. infatti
    //delle volte non aggiorna e poi ne carica due insieme quello è strano...cq il concetto sembra sia passato xk funziona tutto.
    //poi diventa questione di pratica, aggiungi la possibilita di cancellare libri e magari un tasto "modifica" che ti apre la form di inserimento ma 
    //sta volta precompilata coi valori del libro che stai modificando, in quel caso dovrai "aggiornare" il record anziche crearlo.
    //provo, sta cosa dei bottoni mi fa andare in bestia vabbe dai, chiudo e decido cosa fare. lmk
    }
    
function hideNewBookForm() {
    $("#nuovoLibro").hide();
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
    var libri = response.data; //questa non ricordo bene cosa faccia, la sto prendendo per buona,
    $.each (libri, aggiornaTabellaLibriConLibro); //qui? cicla?si, $.each è una funzione di jQuery, asp
    //per ogni "libri" lancia aggioranTabellaLibri.
    
}

function aggiornaTabellaLibriConLibro(index, libro, autore, prezzo) {
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
    //debugger;
    $("#listaLibri tbody").append("<tr><td id ="+id+" style='display: none' value='"+id+"'></td><td value="+ titolo +">" + 
    titolo + "</td><td>" + autore + "</td><td>" + prezzo + " euro</td>"+
    "<td><button id='deleteButton' onclick=deleteBook(event)>Cancella</button></td>"+
    '<td><button id=\'editButton\' onclick="createInput(' + id + ' , \'' + titolo + '\' , \'' + autore + '\' , ' + prezzo + '  )">Modifica</button></td></tr>')
    
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
            document.getElementById("bookDeleted").innerHTML = "<style>#bookDeleted{padding: 5px;border: 0.5px solid red;}</style>Hai cancellato " + titolo;
            }
    });

    //se lanci refreshList qua, tu stai dicendo:
    //hey server, cancella la riga 1
    //io mi ricarco (ma senza aspettare che tu l'abbia cancellata
}

function primoCaricamento() {                
    $.ajax({
        url: "http://localhost:8888/libro", //url da chiamare
        dataType: 'json', //tipo di risposta che mi aspetto (un json)
        success: aggiornaTabellaLibriConLibriPresiDalServer //cosa me ne faccio del json? lo passo (come oggetto JS) ad una funzione, quale? aggiornaTabellaLibriConLibriPresiDalServer
    });
}

function refreshList() {
    $("#listaLibri tbody").empty();
    primoCaricamento();
}


$(document).ready(primoCaricamento);