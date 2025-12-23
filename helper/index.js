// Take the choice from frontend Drop Down menue [easy,med,hard,mix]
const choice = "replace it with the element's value"
let url = ''


const playButton = document.querySelector('#play button'); 

playButton.addEventListener('click', () => {
    audio.muted = false;
    audio.volume = 0.15
    audio.play().then(() => {
        console.log("Audio playing successfully.");
    }).catch(error => {
        console.log("Playback failed:", error);
    });


});


// Api url
let mix = 'https://opentdb.com/api.php?amount=10'
let easy = 'https://opentdb.com/api.php?amount=10&difficulty=easy'
let med = 'https://opentdb.com/api.php?amount=10&difficulty=medium'
let hard = 'https://opentdb.com/api.php?amount=10&difficulty=hard'


// changing the url depending on the selected option 

switch (choice) {
    case "easy":
        url = easy
        break;
    case "medium":
        url = med
        break;
    case "hard":
        url = hard
        break
    default:
        url = mix
        break;
}

// the arrays where I will destructure; I plan to use map()/for each in future
let typeL = []
let diff = []
let categoryL = []
let questionL = []
let cAns = [] // correct answer array
let iAns = [] //incorrect answer array

getData()

let pages = document.getElementsByClassName('page')









// FUNCTIONS

async function getData() {
    try {
        let response = await fetch(url)
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`)
        }
        let data = await response.json()

        des(data.results)


        populateUI();

        // start quiz
        enableStartButton();
        enableGameLogic();

    } catch (error) {
        console.log(error);
    }
}


function des(res) {
    for (let i = 0; i < res.length; i++) {
        // Destructure properties from each question object
        let {
            difficulty,
            category,
            type,
            question,
            correct_answer,
            incorrect_answers
        } = res[i];


        typeL.push(type)
        diff.push(difficulty)
        categoryL.push(category)
        questionL.push(question)
        cAns.push(correct_answer)
        iAns.push(incorrect_answers)


    }
}

function populateUI() {
    let pages = document.getElementsByClassName('page');

    for (let i = 0; i < pages.length; i++) {
        let page = pages[i];



        let metadataDiv = page.children[1];
        let optionsDiv = page.children[2];

        metadataDiv.querySelector('h1').innerHTML = questionL[i];
        metadataDiv.querySelector('h4').innerHTML = categoryL[i];

        let spans = metadataDiv.querySelectorAll('span');
        spans[0].innerText = `Q${i + 1}`;
        spans[1].innerText = diff[i];


        let allOptions = [...iAns[i], cAns[i]];
        allOptions.sort(() => Math.random() - 0.5);

        let optionTags = optionsDiv.querySelectorAll('h5');

        for (let j = 0; j < optionTags.length; j++) {
            if (allOptions[j]) {
                optionTags[j].innerHTML = allOptions[j];
                optionTags[j].style.display = 'block';


                if (allOptions[j] === cAns[i]) {
                    optionTags[j].dataset.isCorrect = "true";
                } else {
                    optionTags[j].dataset.isCorrect = "false";
                }
            } else {

                optionTags[j].style.display = 'none';
            }
        }
    }
}


function enableStartButton() {
    const startBtn = document.querySelector('#play button');

    startBtn.addEventListener('click', () => {
        document.getElementById('play').style.display = 'none';


        document.getElementById('page1').style.display = 'flex';
    });
}



let currentScore = 0;


const pointSystem = {
    'easy': 1,
    'medium': 2,
    'hard': 4
};

function enableGameLogic() {
    let pages = document.getElementsByClassName('page');

    for (let i = 0; i < pages.length; i++) {
        let page = pages[i];
        let options = page.querySelectorAll('h5');
        let submitBtn = page.querySelector('button');


        options.forEach(opt => {
            opt.addEventListener('click', function () {

                options.forEach(o => o.classList.remove('selected'));


                this.classList.add('selected');
            });
        });


        submitBtn.addEventListener('click', function () {

            let selected = page.querySelector('h5.selected');

            if (!selected) {
                alert("Please select an answer.");
                return;
            }


            let isCorrect = selected.dataset.isCorrect === "true";

            if (isCorrect) {

                let difficulty = diff[i];
                let points = pointSystem[difficulty] || 0;
                currentScore += points;
            }

            // 4. Transition
            page.style.display = 'none'; // Hide current

            if (i < pages.length - 1) {

                pages[i + 1].style.display = 'flex';
            } else {

                showResults();
            }
        });
    }
}

function showResults() {

    let playScreen = document.getElementById('play');


    playScreen.innerHTML = `
        <img src="./assets/web gfx/focus.jpeg" alt="Score">
        <h1>Quiz Completed!</h1>
        <h3>Your Final Score:</h3>
        <h1 style="font-size: 4rem; color: #cb7b3e; margin: 20px 0;">${currentScore}</h1>
        <button onclick="location.reload()">Play Again</button>
    `;

    playScreen.style.display = 'flex';
}