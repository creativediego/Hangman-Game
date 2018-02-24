var Hangman = {
    //the current word randomly taken from the words array
    currentWord: [],

    //the image that corresponds to the word
    currentWordtoImage: [],

    //the current word replaced with underscores
    currentWordPadded: [],

    //used to add margin between word spaces in current word displayed to users
    separator: "<span style='margin: 20px'></span>",

    //all words and their associated image hint
    words: [
        ["Interstellar", "interstellar.jpg"],
        ["Oblivion", "oblivion.jpg"],
        ["The Shawshank Redemption", "shawshank.jpg"],
        ["The Dark Knight Rises", "darkknightrises.jpg"],
        ["Forrest Gump", "forrestgump.jpg"],
        ["The Prestige", "prestige.jpg"],
        ["Fight Club", "fightclub.png"],
        ["Gladiator", "gladiator.jpg"],
        ["Rocky", "rocky.jpg"],
        ["Pacific Rim", "pacificrim.jpg"],
        ["Inception", "inception.jpg"],
        ["Good Will Hunting", "goodwillhunting.jpg"],
        ["Cloud Atlas", "cloudatlas.jpg"],

    ],

    //the letters the user has guessed so far
    guessedLetters: [],

    //the remaining tries the user has
    remainingGuesses: 8,

    //counts the number of times a user has guessed a word
    wins: 0,

    //previous words the user has guessed
    guessedWords: [],


    //used to initialize the game or a new round; resets variables and output text displayed to the user
    //using a callback, checks if the game has already finished. that is, if all words have been guessed
    init: function() {
        if (this.isGameFinished() === false) {
            this.currentWord = [];
            this.currentWordPadded = [];
            this.guessedLetters = [];
            this.remainingGuesses = 8;
            this.setCurrentWord();
            document.querySelector("#guessed-letters").innerHTML = ""
            document.querySelector("#guesses").innerHTML = this.remainingGuesses;
            document.querySelector("#wins").innerHTML = this.wins;

        }


    },

    //used when the user clicks to start a brand new game
    newGame: function() {

        Hangman.init();
        Hangman.wins = 0;
        document.querySelector("#wins").innerHTML = "0"
        Hangman.guessedWords = [];
        document.querySelector("#guessed-words").innerHTML = ""
        document.querySelector("#guessed-letters").innerHTML = ""
        document.querySelector("#playthrough-message").innerHTML = ""
        document.querySelector("#hint").innerHTML = "Movie Hint"

    },

    //Sets currentWord, currentWordPadded, and displays currentWordPadded to the user
    setCurrentWord: function() {

        //Check boolean callback to see if user has already guessed all possible words
        if (this.isGameFinished() === false) {

            //Goal: genrate a random word and its image without repeating a previous random word the user already guessed

            do {
                //Continue to randomize the current word until it's unique and not found in the array of previously guessed words
                this.currentWordtoImage[0] = this.words[Math.floor(Math.random() * this.words.length)]

                //Set the image hint to the image corresponding to the current word 
                this.currentWord[0] = this.currentWordtoImage[0][0];

                //Set the image src to the image variable
                document.querySelector("#image").setAttribute("src", "assets/" + this.currentWordtoImage[0][1]);

                //Check if the random word if found in the array words previously guessed correctly
            } while (this.guessedWords.indexOf(this.currentWord[0]) > -1);


            //Take each character in the current word, and pushes underscores to the CurrentWordPadded

            for (i = 0; i < this.currentWord[0].length; i++) {
                //If the word contains a space, push a space
                if (this.currentWord[0][i] === " ") {

                    this.currentWordPadded.push(" ");
                    //otherwise, push an underscore
                } else {
                    this.currentWordPadded.push("_");

                }

            }

            //Displays the word to the user after some formatting for proper spaces
            this.formatDisplayWord(this.currentWordPadded);
        }
    },
    /*Takes the currentWordPadded as argument and return the word formatted with a separator.
    Reason: The extra white spaces separating multiple words in the output are ignored by HTML, so...
    by taking the extra space and replacing it with the separator variable (which holds a span with a magin),
    we can more distinctly display spaces between words in the output for the user*/
    formatDisplayWord: function(array) {


        return document.querySelector("#word").innerHTML = array.join(" ").replace(/   /g, this.separator);


    },

    //Displays the current letter guesses 
    displayGuesses: function(keyPressed) {

        //Only display if the current key letter if not found in the array of previously guessed letters
        if (this.guessedLetters.indexOf(keyPressed) === -1) {
            this.guessedLetters.push(keyPressed);
            document.querySelector("#guessed-letters").innerHTML = this.guessedLetters;
        }

    },
    //Callback that checks if the code of the key pressed is a letter.
    isKeyLetter: function(keyPressed) {

        if (keyPressed >= 65 && keyPressed <= 90) {

            return true;
        } else {
            return false;
        }

    },

    //Checks if the key the user pressed is a correct guess for the current word
    checkGuess: function(keyPressed) {

        for (i = 0; i < this.currentWord[0].length; i++) {

            //Regex used to check user guesses regardless of case
            if (this.currentWord[0][i].match(new RegExp(keyPressed, "gi"))) {

                //If the guess is a match, replace the underscore at the corresponding index
                //in the currentWordPadded array
                this.currentWordPadded.splice(i, 1, this.currentWord[0][i]);
                this.formatDisplayWord(this.currentWordPadded);




            }


        }

        //If the guess is incorrect, the guess count isn't zero, and the word hasn't been guessed yet
        if (this.currentWord[0].lastIndexOf(keyPressed) === -1 && this.remainingGuesses !== 0 && this.isWordGuessed() === false) {

            //decrement remaining guesses
            this.remainingGuesses--
                //display the decremented number of guesses
                document.querySelector("#guesses").innerHTML = this.remainingGuesses;

        }

    },


    //Used to display modal message whenever the user wins or loses a game
    modalDialog: function(heading, message) {
        let modalMessage = '<div class=modal role=dialog tabindex=-1><div class=modal-dialog role=document><div class=modal-content><div class=modal-header><h5 class=modal-title>' + heading + '</h5><button class=close data-dismiss=modal type=button aria-label=Close><span aria-hidden=true>×</span></button></div><div class="modal-body text-center"><p>' + message + '</div><div class=modal-footer><button class="btn btn-secondary"data-dismiss=modal type=button>Close</button></div></div></div></div>'
        $(modalMessage).modal("show");
    },

    //Callback that hecks if the same is over
    isGameOver: function() {
        //If user has no guesses left
        if (this.remainingGuesses === 0) {



            return true


        } else {
            return false
        }

    },
    //Game over actions
    gameOverActions: function() {

        //If callback return true (user has no guesses left), then...
        if (this.isGameOver()) {

            //Update front end messages
            document.querySelector("#playthrough-message").innerHTML = "Sorry, game over!"
            document.querySelector("#word").innerHTML = this.currentWord;
            this.modalDialog("Game OVER", "Sorry, game over! The word was: " + this.currentWord);
        }

    },
    //Boolean callback that check is the user has guessed the current word
    isWordGuessed: function() {
        //if the string of the current word and the currentWordPadded match
        if (this.currentWord[0] === this.currentWordPadded
            .join("")) {

            return true;

        } else {
            return false;
        }

    },

    //Win action when the user has guessed the current word
    roundWin: function() {

        //If callback returns true and the game hasn't finished yet,
        if (this.isWordGuessed() === true && this.isGameFinished() === false) {

            //Increment wins
            this.wins++;
            this.guessedWords.push(this.currentWord[0]);

            //Update front end messages
            document.querySelector("#wins").innerHTML = this.wins;
            document.querySelector("#playthrough-message").innerHTML = "Great! You guessed: " + this.currentWord;
            document.querySelector("#guessed-words").innerHTML = this.guessedWords;

            //Display a win dialog
            this.modalDialog("You Win!", "<h3>Bravo!</h3> <img class='img-fluid' style='height: 15rem' src='assets/oscar.png'><p>The word was: " + this.currentWord + ".</p>");

            //Initialize a new round
            this.init();

        }
    },

    //Callback that checks if the user has guessed all possible words
    isGameFinished: function() {

        //If the length of the array of all possible words equals the length of the guessed words,
        if (this.guessedWords.length === this.words.length) {

            return true;
        } else {
            return false;
        }

    },

    //Actions if the user has guessed all possible words
    gameFinished: function() {

        //Check if all words have been previously guessed
        if (this.isGameFinished()) {

            //update front end with game finished messages
            document.querySelector("#hint").innerHTML = "And the Oscar goes to... You for finishing the game!"
            document.querySelector("#word").innerHTML = this.currentWord;
            document.querySelector("#image").setAttribute("src", "assets/oscar.png");
            document.querySelector("#image").setAttribute("style", "height: 15rem");

            //reset the guessedWords array in case the user wants to play a brand new game
            this.guessedWords = [];

        }


    },

    UserGuessesLetter: function() {

        document.addEventListener("keyup", function(event) {

            let keyPressed = event.keyCode

            if (Hangman.isKeyLetter(keyPressed) === true && Hangman.isGameOver() === false && Hangman.isGameFinished() === false) {


                keyPressed = event.key
                Hangman.checkGuess(keyPressed);
                Hangman.displayGuesses(keyPressed);
                Hangman.gameOverActions();
                Hangman.roundWin();


            }

            //Check if game is finished
            Hangman.gameFinished();

        })
    }





}


//Intialize a new round
Hangman.init();

//Start a new game on New Game click
document.querySelector("#new").addEventListener("click", Hangman.newGame());

//When the guesses a letter
Hangman.UserGuessesLetter()

// Hangman.UserGuesses();