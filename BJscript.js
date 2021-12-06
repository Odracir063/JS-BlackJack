let BJGame = {
    'you':{'scoreSpan': '#youResult','div': '#you','score': 0},
    'dealer':{'scoreSpan': '#dealerResult','div': '#dealer','score': 0},
    'cards': ['2','3','4','5','6','7','8','9','10','J','Q','K','A'],
    'cardMap':{'2': 2,'3': 3,'4': 4,'5': 5,'6': 6,'7': 7,'8': 8,'9': 9,'10': 10,'J': 10,'Q': 10,'K': 10,'A': [1,11]},
    'stand': false,
    'turnsOver': false,
}

const YOU = BJGame['you'];
const DEALER = BJGame['dealer'];

const hitSound = new Audio('sounds/swish.m4a');
const winSound = new Audio('sounds/cash.mp3');
const loseSound = new Audio('sounds/aww.mp3');

let Losses = 0;
let Draws = 0;
let Wins = 0;

document.querySelector('#BJHitBtn').addEventListener('click', BJHit);

document.querySelector('#BJDealBtn').addEventListener('click', deal);

document.querySelector('#BJStandBtn').addEventListener('click', dealerLogic);

function BJHit(){

    if(BJGame['stand'] === false){
        let card = randomCard();
        showCard(card, YOU);
        updateScore(card, YOU);
        showScore(YOU);

        if (YOU['score']>21){
            let WINNER = winner(YOU['score'], DEALER['score']);
            results(WINNER);

            BJGame['turnsOver'] = true;
        }
    }
}

function randomCard(){
    let randomNumber = Math.floor(Math.random() * 13);

    let cardChosen = BJGame['cards'][randomNumber];

    return cardChosen;
}

function showCard(card, activePlayer){

    if(activePlayer['score']<=21){
        let cardImage = document.createElement('img');

        cardImage.src = 'images/'+ card +'.png';
        document.querySelector(activePlayer['div']).appendChild(cardImage);

        hitSound.play();
    }
    
}


function updateScore(card, activePlayer){

    if(card === 'A'){

        if(activePlayer['score']+ BJGame['cardMap'][card][1]<=21){
            activePlayer['score'] += BJGame['cardMap'][card][1];
        }else{
            activePlayer['score'] += BJGame['cardMap'][card][0];
        }

    }else{
        activePlayer['score'] += BJGame['cardMap'][card];
    }
}

function showScore(activePlayer){

    if(activePlayer['score']>21){

        document.querySelector(activePlayer['scoreSpan']).textContent = 'BUSTED!';

        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
    }else{
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }
}

function deal(){

   

    if (BJGame['turnsOver']===true){

        document.querySelector('#BJResult').textContent = "Let's Play";
        document.querySelector('#BJResult').style.color = 'black';

        let yourImages = document.querySelector('#you').querySelectorAll('img');

        for(let i = 0; i < yourImages.length; i++){

            yourImages[i].remove();

        }

        let dealerImages = document.querySelector('#dealer').querySelectorAll('img');

        for(let i = 0; i < dealerImages.length; i++){

            dealerImages[i].remove();

        }

        YOU['score'] = 0;
        DEALER['score'] = 0;

        document.querySelector('#youResult').textContent = 0;
        document.querySelector('#dealerResult').textContent = 0;

        document.querySelector(YOU['scoreSpan']).style.color = 'white';
        document.querySelector(DEALER['scoreSpan']).style.color = 'white';

        BJGame['stand'] = false;
        BJGame['turnsOver'] = false;
    }
    
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve,ms));
}

async function dealerLogic(){

    BJGame['stand'] = true;

    while(DEALER['score']<16 && BJGame['stand']===true){

        let card = randomCard();
        showCard(card, DEALER);
        updateScore(card, DEALER);
        showScore(DEALER);
        await sleep(900);
    }

    if(BJGame['turnsOver']===false){

        
        if (DEALER['score']>15){

            let WINNER = winner(YOU['score'], DEALER['score']);
            results(WINNER);

            BJGame['turnsOver'] = true;

        }
    }
}

function winner(youScore, dealerScore){

    let winner = '';

    if (youScore<=21){
        if(youScore > dealerScore || dealerScore > 21){
            winner = 'you';
          

        }else if (youScore < dealerScore){
            winner = 'dealer';
           

        } else if (youScore === dealerScore){
            winner = 'draw';
            
        }
    }else if(youScore>21 && dealerScore <= 21){
        winner = 'dealer';
    
    }else if (youScore > 21 && dealerScore > 21){
        winner = 'draw';
        
    }

    return winner;
 
}

function results(finalResult){

    let message, color;

    switch(finalResult){
        case 'dealer':
            Losses++;
            message = 'You Lost!';
            color = 'red';
            document.querySelector('#losses').textContent = Losses;
            document.querySelector('#BJResult').textContent = message;
            document.querySelector('#BJResult').style.color = color;
            loseSound.play();
            break;
        case 'you': 
            Wins++;
            message = 'You Won!';
            color = 'green';
            document.querySelector('#wins').textContent = Wins;
            document.querySelector('#BJResult').textContent = message;
            document.querySelector('#BJResult').style.color = color;
            winSound.play();
            break;

        case 'draw': 
            Draws++;
            message = 'You Drew!';
            color = 'gold';
            document.querySelector('#draws').textContent = Draws;
            document.querySelector('#BJResult').textContent = message;
            document.querySelector('#BJResult').style.color = color;
            break;
    }
}


