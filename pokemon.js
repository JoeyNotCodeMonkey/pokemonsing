var startTime;

var sounds = [];
var current = 0;
const loopNum = 3;

var pokemons = [
    "mew", "charmander", "vulpix", "eevee", 
    "pikachu", "meowth", "jigglypuff", "oddish", 
    "lickitung", "onix", "squirtle", "psyduck", 
    "magikarp", "dragonite", "bulbasaur", "diglett"
];

var asciis = [
    49 /*1*/, 50 /*2*/, 51 /*3*/, 52 /*4*/,
    81 /*Q*/, 87 /*W*/, 69 /*E*/, 82 /*R*/,
    65 /*A*/, 83 /*S*/, 68 /*D*/, 70 /*F*/, 
    90 /*Z*/, 88 /*X*/, 67 /*C*/, 86 /*V*/
];

$(document).ready(function(){
    renderGrid();

	const BPM = 136;
	const denominator = 60 * 1000 / (BPM * 2); //time length per 8th notes
	var locked = false;

    /* Load loops */
    for (var i = 0; i < loopNum; i++) {
        var sound = new Howl({
            src: ['src/loop/loop' + i + '.wav'],
            preload: true,
            loop: true
        });
        sounds[i] = sound;
    }

    /* Load voices */
    var audioMap = {};
    for (i = 0; i < pokemons.length; i++) {
        var path = "src/voice/" + pokemons[i] + ".wav";
        var snd = new Howl({
            src: [path],
            preload: true
        });
        audioMap[pokemons[i]] = snd;
    }

    /* Build keyMap */
    var keyMap = {};
    for (i = 0; i < pokemons.length; i++) {
        keyMap[asciis[i]] = pokemons[i];
    }


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

        var snd = audioMap[pokemon];

        locked = true;
        setTimeout(function(){play(snd);}, waitTime);
    }

    function play(snd) {
        snd.play();
	    locked = false;
	}

    $(document).keydown(function(e) {
        e.preventDefault();
        var keyCode = e.which;

        if (keyCode == 37) {
            previous();
        } else if (keyCode == 39) {
            next();
        }

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
    startTime = $.now();
    sounds[current].play();
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
    sounds[current].stop();
    $('#grid').hide();
    $('#homeBtn').hide();
    $('#home').show();
}

function next() {
    moveCursor(1);
}

function previous() {
    moveCursor(-1);
}

function moveCursor(num) {
    var currentLoop = sounds[current];
    currentLoop.fade(1, 0, 500);
    setTimeout(function(){
        currentLoop.stop();
    }, 500);

    startTime = $.now();
    current = ((current + num) < 0 ? (loopNum - 1) : (current + num)) % loopNum;
    
    sounds[current].fade(0, 1, 500);
    sounds[current].play();
}
