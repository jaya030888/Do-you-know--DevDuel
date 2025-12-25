const playButton = document.querySelector('#play button');
const videoElement = document.getElementById('startVideo');
const audio = document.getElementById('backgroundMusic');
const splashScreen = document.getElementById('splash');
let user_Choice = ''

// Hide splash screen after 5 seconds
setTimeout(() => {
    splashScreen.classList.add('hide');
}, 5000);

// Show the start screen after splash fades
setTimeout(() => {
    const play = document.getElementById('play');
    if (play) {
        play.classList.add('full-bleed');
        play.style.display = 'flex';
    }
}, 5200);
let choice = '';
let url = ''


let dataReady = false; // Wait until questions are loaded
let queuedStart = false; // If video ends before data loads, queue the quiz start



videoElement.addEventListener('ended', (event) => {
    document.getElementById('main').style.display = 'none';

    // When video finishes, check if questions are ready
    // If they are, start the quiz. If not, we'll start once they load
    if (dataReady) {
        startQuiz();
    } else {
        queuedStart = true;
    }
});


playButton.addEventListener('click', () => {

    // Grab what the user selected: category and difficulty
    const categoryInput = document.querySelector('input[name="category"]:checked');
    const categoryValue = categoryInput ? categoryInput.value : '';

    const levelInput = document.querySelector('input[name="level"]:checked');
    const difficultyValue = levelInput ? levelInput.value : '';

        // If user don't select any category

    if (!categoryValue) {
                alert("Please select an catagory first.");
                return;
            }

        // Start the background music and show the video
    audio.muted = false;
    audio.volume = 0.20;
    document.getElementById('main').style.display = 'flex';
    document.getElementById('play').style.display = 'none';
    videoElement.play();

    audio.play().then(() => {
        console.log("Audio playing successfully.");
    }).catch(error => {
        console.log("Playback failed:", error);
    });
    

    // Build the API request URL with the user's choices
    let dynamicUrl = 'https://opentdb.com/api.php?amount=10';


    if (categoryValue) {
        dynamicUrl += `&category=${categoryValue}`;
    }

    if (difficultyValue) {
        dynamicUrl += `&difficulty=${difficultyValue}`;
    }

    console.log("Final Generated URL:", dynamicUrl);

    // Fetch the questions
    getData(dynamicUrl);
});

// Show level selector only after user chooses a category and handle 'Open' locking
const categoryInputs = document.querySelectorAll('input[name="category"]');
const levelSelect = document.getElementById('level-select');
const levelInputs = document.querySelectorAll('input[name="level"]');

categoryInputs.forEach(inp => {
    inp.addEventListener('change', () => {
        if (!levelSelect) return;
        // Show the difficulty level options
        levelSelect.style.display = 'flex';

        // If the user picks "Open", lock them to easy difficulty only
        if (inp.value === '') {
            levelInputs.forEach(li => {
                if (li.value === 'easy') {
                    li.checked = true;
                    li.disabled = false;
                } else {
                    li.checked = false;
                    li.disabled = true;
                }
            });
        } else {
            // For other categories, let them pick any difficulty
            levelInputs.forEach(li => {
                li.disabled = false;
            });
        }
    });
});

// Set up arrays to hold trivia data
let typeL = []
let diff = []
let categoryL = []
let questionL = []
let cAns = [] // Correct answer for each question
let iAns = [] // Incorrect answers for each question
let pages = document.getElementsByClassName('page')


// ========== HELPER FUNCTIONS ==========

async function getData(URL) {
    try {
        let response = await fetch(URL)
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`)
        }
        let data = await response.json()

        // Extract all question info from the API response
        des(data.results)

        // Populate the HTML with questions and answers
        populateUI();

        // Notify that data is ready; if video already finished, start the quiz
        dataReady = true;
        if (queuedStart) startQuiz();

    } catch (error) {
        // console.log(error);
    }
}

// Pull out individual fields from each question and save them
function des(res) {
    for (let i = 0; i < res.length; i++) {
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

        // Use the page's background image from the HTML
        let pageImg = page.querySelector('img');
        if (pageImg && pageImg.src) {
            page.style.backgroundImage = `url('${pageImg.src}')`;
            pageImg.style.display = 'none';
        }

        // Grab the question text, category, and options areas
        let metadataDiv = page.children[1];
        let optionsDiv = page.children[2];

        // Fill in the question text and category
        metadataDiv.querySelector('h1').innerHTML = questionL[i];
        metadataDiv.querySelector('h4').innerHTML = categoryL[i];

        // Add the question number and difficulty
        let spans = metadataDiv.querySelectorAll('span');
        spans[0].innerText = `Q${i + 1}`;
        spans[1].innerText = diff[i];

        // Mix correct and incorrect answers, then shuffle
        let allOptions = [...iAns[i], cAns[i]];
        allOptions.sort(() => Math.random() - 0.5);

        // Fill each answer button
        let optionTags = optionsDiv.querySelectorAll('h5');
        for (let j = 0; j < optionTags.length; j++) {
            if (allOptions[j]) {
                optionTags[j].innerHTML = allOptions[j];
                optionTags[j].style.display = 'block';

                // Mark which answer is correct for later validation
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
    // Ensure the start button is ready to be clicked
    const startBtn = document.querySelector('#play button');
    if (startBtn) startBtn.disabled = false;
}

let currentScore = 0;

// Points awarded based on difficulty level
const pointSystem = {
    'easy': 1,
    'medium': 2,
    'hard': 4
};

let currentPageIndex = 0;

function enableGameLogic() {
    let pages = document.querySelectorAll('.page');

    // Clear any previous active page state
    pages.forEach(p => p.classList.remove('active'));

    // Helper functions to track which page is visible
    const getActivePage = () => document.querySelector('.page.active');
    const getIndexOf = (el) => Array.from(document.querySelectorAll('.page')).indexOf(el);

    // Add a Next button to each question page
    pages.forEach((page, index) => {
        // Remove any old button to prevent duplicates
        let oldBtn = page.querySelector('button');
        if (oldBtn) oldBtn.remove();

        // Create a container for the button
        let navContainer = document.createElement('div');
        navContainer.style.cssText = "display: flex; gap: 10px; margin-top: auto; width: 100%;";

        // Create the Next/Finish button
        let nextBtn = document.createElement('button');
        nextBtn.innerText = (index === pages.length - 1) ? "Finish Quiz" : "Next Question";
        nextBtn.onclick = () => {
            const active = getActivePage();
            if (!active) return;
            const idxNow = getIndexOf(active);
            const pagesNow = document.querySelectorAll('.page');
            const isLastNow = idxNow === pagesNow.length - 1;

            // Make sure the user picked an answer
            let selected = active.querySelector('h5.selected');
            if (!selected) {
                alert("Please select an answer first.");
                return;
            }

            // Calculate points only on the first submission
            if (!active.dataset.processed) {
                let isCorrect = selected.dataset.isCorrect === "true";
                let options = active.querySelectorAll('h5');
                // Color the correct answer green and wrong answer red
                options.forEach(opt => {
                    if (opt.dataset.isCorrect === "true"){
                        opt.style.backgroundColor = '#90EE90';
                        opt.style.borderColor = '#90EE90';
                    }
                    if (opt === selected && !isCorrect){
                        opt.style.backgroundColor = '#fb7c55ff';
                        opt.style.borderColor = '#fb7c55ff';
                    }
                });

                // Add points if they got it right
                if (isCorrect) {
                    let difficulty = diff[idxNow] || diff[index];
                    let points = pointSystem[difficulty] || 0;
                    currentScore += points;
                }
                active.dataset.processed = "true"; // Prevent double-counting

                // Disable clicking on options after they've answered
                let optsToLock = active.querySelectorAll('h5');
                optsToLock.forEach(o => {
                    o.classList.add('locked');
                    o.setAttribute('aria-disabled', 'true');
                });

                // On the last question, show feedback for a moment before allowing finish
                if (isLastNow) {
                    nextBtn.disabled = true;
                    setTimeout(() => {
                        nextBtn.disabled = false;
                        nextBtn.innerText = "Finish Quiz";
                    }, 900);
                    return;
                }
            }

            // After a brief delay, move to the next question
            if (!isLastNow) {
                nextBtn.disabled = true;
                setTimeout(() => {
                    const newActive = getActivePage();
                    const newIdx = getIndexOf(newActive);
                    changePage(newIdx + 1);
                }, 1500);
            } else {
                // On the final submission, show the results screen
                showResults();
            }
        };

        navContainer.appendChild(nextBtn);
        page.children[2].appendChild(navContainer); // Add to the right-side container

        // Let users select an answer by clicking on options
        let options = page.querySelectorAll('h5');
        options.forEach(opt => {
            opt.addEventListener('click', function () {
                // Once answered, don't allow changing your answer
                if (page.dataset.processed === "true") return;

                // Only let one option be selected at a time
                options.forEach(o => o.classList.remove('selected'));
                this.classList.add('selected');
            });
        });
    });
}

// Switch to the next question page smoothly
function changePage(newIndex) {
    let pages = document.querySelectorAll('.page');

    // Make sure we don't go out of bounds
    if (newIndex < 0 || newIndex >= pages.length) return;

    // Hide all pages completely
    pages.forEach(p => {
        p.classList.remove('active');
        p.style.display = 'none';
    });

    // Show the requested question
    const target = pages[newIndex];
    if (target) {
        target.classList.add('active');
        target.style.display = 'flex';
        currentPageIndex = newIndex;
        // Scroll to the top for mobile users
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Initialize the quiz after the video finishes
function startQuiz() {
    // Hide the video and start screen
    document.getElementById('main').style.display = 'none';
    document.getElementById('play').style.display = 'none';

    // Set up the first question
    enableGameLogic();
    changePage(0);
}

// Display the final results and save progress
function showResults() {
    // Update total XP earned across all quizzes
    let totalXP = localStorage.getItem('userXP') ? parseInt(localStorage.getItem('userXP')) : 0;
    totalXP += currentScore;
    localStorage.setItem('userXP', totalXP);

    // Hide all question pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => p.classList.remove('active'));
    if (pages.length) {
        const lastPage = pages[pages.length - 1];
        lastPage.style.display = 'none';
    }

    // Show the results on the start screen
    let playScreen = document.getElementById('play');
    if (playScreen) {
        playScreen.classList.add('full-bleed');
        playScreen.style.backgroundImage = 'url("./assets/web gfx/focus.jpeg")';
        playScreen.style.display = 'flex';
        playScreen.innerHTML = `
            <div class="play-panel">
                <h1>Session Complete!</h1>
                <h3>Session Score: ${currentScore}</h3>
                <h3 style="color: #6e4627;">Total Lifetime XP: ${totalXP}</h3>
                <button onclick="location.reload()">Study Again</button>
            </div>
        `;
    }
    // Scroll back to top so results are visible
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
