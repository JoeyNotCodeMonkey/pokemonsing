var startTime;
var source;

var pokemons = [
    "mew", "charmander", "vulpix", "eevee", 
    "pikachu", "meowth", "jigglypuff", "oddish", 
    "lickitung", "onix", "squirtle", "psyduck", 
    "magikarp", "dragonite", "bulbasaur", "diglett"
];

var keyMap = {
    49 : "mew", //1
    50 : "charmander", //2
    51 : "vulpix", //3
    52 : "eevee", //4
    81 : "pikachu", //Q
    87 : "meowth", //W
    69 : "jigglypuff", //E
    82 : "oddish", //R
    65 : "lickitung", //A
    83 : "onix", //S
    68 : "squirtle", //D
    70 : "psyduck", //F
    90 : "magikarp", //Z
    88 : "dragonite", //X
    67 : "bulbasaur", //C
    86 : "diglett" //V
};

$(document).ready(function(){
    renderGrid();

	const BPM = 136;
	const denominator = 60 * 1000 / (BPM * 2); //time length per 8th notes
	var locked = false;

    $('.square').on('mousedown', function(e){
        e.preventDefault();
        readyPlay(this.id);
    });

    function readyPlay(pokemon) {
        if (locked) {
            return;
        }

        var currentTime = $.now() - startTime;
        var multi = Math.floor(currentTime / denominator);
        var waitTime = denominator * (multi + 1) - currentTime;

        var path = "src/voice/" + pokemon + ".wav";
        var snd = new Audio(path);
        locked = true;
        setTimeout(function(){play(snd);}, waitTime);
    }

    function play(snd) {
        snd.play();
        snd.currentTime = 0;
	    locked = false;
	}

    $(document).keydown(function(e) {
        e.preventDefault();
        var keyCode = e.which;
        if (!(keyCode in keyMap)) {
            return;
        }

        var id = '#' + keyMap[keyCode];
        $(id).trigger('mousedown');
        $(id).addClass('active');
        setTimeout(function() {
          $(id).removeClass('active');
        }, 90);
    });

});//document.ready() end

function renderGrid() {
    var row = 4;
    var col = 4;

    var table = $('<table>');
    for (var i = 0; i < row; i++) {
        var tr = $('<tr>');
        for (var j = 0; j < col; j++) {
            var td = $('<td>');
            var id = pokemons[col*i+j];
            var button = $('<button>').attr('id', id).addClass('square');
            td.append(button);
            tr.append(td);
        }
        table.append(tr);
    }
    $('#grid').html(table);
}

function startMusic() {
    var url  = 'src/loop/loop.wav';

    /* --- set up web audio --- */
    //create the context
    var context = new AudioContext();
    //...and the source
    source = context.createBufferSource();
    //connect it to the destination so you can hear it.
    source.connect(context.destination);

    /* --- load buffer ---  */
    var request = new XMLHttpRequest();
    //open the request
    request.open('GET', url, true); 
    //webaudio paramaters
    request.responseType = 'arraybuffer';
    //Once the request has completed... do this
    request.onload = function() {
        context.decodeAudioData(request.response, function(response) {
            /* --- play the sound AFTER the buffer loaded --- */
            //set the buffer to the response we just received.
            source.buffer = response;
            //start(0) should play asap.
            startTime = $.now();
            source.start(0);
            source.loop = true;
        }, function () { console.error('The request failed.'); } );
    }
    //Now that the request has been defined, actually make the request. (send it)
    request.send();
}

function startGame() {
    $('#home').slideUp();
    setTimeout(function(){
        $('#grid').fadeIn();
        $('#homeBtn').fadeIn();
        startMusic();
    }, 1000);
    
    
}

function openAbout() {
    $('#home').hide();
    $('#about').show();
}

function back() {
    $('#about').hide();
    $('#home').show();
}

function home() {
    source.stop(0);
    $('#grid').hide();
    $('#homeBtn').hide();
    $('#home').show();
}
