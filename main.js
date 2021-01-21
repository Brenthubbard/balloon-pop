

//#region  GAME LOGIC AND DATA


// Data  
let clickCount = 0
let height = 120
let width = 100
let inflationRate = 20
let maxsize = 300
let highestPopCount = 0
let currentPopCount = 0
let gamelength = 10000
let clockId = 0
let timeRemaining = 0
let currentPlayer = {}
let currentColor = "blue"
let possibleColors = ["blue", "red", "green", "purple", "pink"]

function startGame () {
    document.getElementById( "game-controls" ).classList.remove( "hidden" )
    document.getElementById( "main-controls" ).classList.add( "hidden" )
    document.getElementById( "scoreboard" ).classList.add( "hidden" )
    startclock()
    setTimeout( stopGame, gamelength )
}

function startclock () {
    timeRemaining = gamelength
    drawClock()
    clockId = setInterval( drawClock, 1000 )
}
function stopClock () {
    clearInterval( clockId )
}

function drawClock () {
    let clickCountElem = document.getElementById( "countdown" )
    clickCountElem.innerText = ( timeRemaining / 1000 ).toString()
    timeRemaining -= 1000
}

function inflate () {
    clickCount++
    height += inflationRate
    width += inflationRate
    checkBalloonPop()
    draw()
}

function checkBalloonPop () {
    if ( height >= maxsize ) {
        console.log( "pop the balloon" )
        let balloonelement = document.getElementById( "balloon" )
        balloonelement.classList.remove( currentColor )
        getRandomColor()
        balloonelement.classList.add( currentColor )

        document.getElementById( "pop-sound" ).play()

        currentPopCount++
        height = 40
        width = 0
    }
}

function getRandomColor () {
    let i = Math.floor( Math.random() * possibleColors.length );
    currentColor = possibleColors[i]
}

function draw () {
    let balloonelement = document.getElementById( "balloon" )
    let clickCountElem = document.getElementById( "click-count" )
    let popCountElem = document.getElementById( "pop-count" )
    let highPopCountElem = document.getElementById( "high-pop-count" )
    let playerNameElem = document.getElementById( "player-name" )
    balloonelement.style.height = height + "px"
    balloonelement.style.width = width + "px"

    clickCountElem.innerText = clickCount.toString()
    popCountElem.innerText = currentPopCount.toString()
    highPopCountElem.innerText = currentPlayer.topScore.toString()

    playerNameElem.innerText = currentPlayer.name
}

function stopGame () {
    console.log( "the game is over" )

    document.getElementById( "main-controls" ).classList.remove( "hidden" )
    document.getElementById( "game-controls" ).classList.remove( "hidden" )
    document.getElementById( "scoreboard" ).classList.add( "hidden" )
    clickCount = 0
    height = 120
    width = 100

    if ( currentPopCount > currentPlayer.topScore ) {
        currentPlayer.topScore = currentPopCount
        saveplayers()
    }
    currentPopCount = 0


    stopClock()
    draw()
    drawScoreboard()
}
// #endregion

let players = []
loadplayers()

function setPlayer ( event ) {
    event.preventDefault()
    let form = event.target

    let playerName = form.playerName.value

    currentPlayer = players.find( player => player.name == playerName )

    if ( !currentPlayer ) {
        currentPlayer = { name: playerName, topScore: 0 }
        players.push( currentPlayer )
        saveplayers()
    }


    form.reset()
    document.getElementById( "game" ).classList.remove( "hidden" )
    form.classList.add( "hidden" )
    draw()
    drawScoreboard()
}
function changePlayer () {
    document.getElementById( "player-form" ).classList.remove( "hidden" )
    document.getElementById( "game" ).classList.add( "hidden" )
}

function saveplayers () {
    window.localStorage.setItem( "players", JSON.stringify( players ) )
}
function loadplayers () {
    let playersData = JSON.parse( window.localStorage.getItem( "players" ) )
    if ( playersData ) {
        players = playersData
    }
}
function drawScoreboard () {
    let template = ""

    players.sort( ( p1, p2 ) => p2.topScore - p1.topScore )
    players.forEach( player => {
        template += `
          <div class="d-flex space-between">
            <span>
                <i class="fa fa-user"></i>
                ${player.name}
            </span>
            <span>score: ${player.topScore} </span>
        </div>
        `
    } )
    document.getElementById( "players" ).innerHTML = template
}

drawScoreboard()