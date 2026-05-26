let currentQuizKey = "";
let currentQuizList = []; // This is our active question playlist
let userHistory = []; // Tracks user selections for the final review panel

let current = 0;
let score = 0;
let timerInterval;

// STATE TRACKERS
let quizMode = "test"; 
let totalSecondsLeft = 0; 
let userSelections = [];    // Stores the string text of the user's chosen options: [ "A", "C", null, "B" ]
let answeredQuestions = []; // Stores boolean locks for Learning Mode: [ true, false, true ]

// 1. UTILITIES: Shuffling
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 2. VIEW SWITCHER
function switchView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    document.getElementById(viewId).classList.remove('hidden');
}

// 3. STORAGE SYSTEMS
function getStats(key) {
    try {
        const data = localStorage.getItem(`quiz_${key}`);
        if (data) {
            const parsed = JSON.parse(data);
            if (parsed && Array.isArray(parsed.attempts)) {
                return parsed;
            }
        }
    } catch (e) {
        console.error("Error reading localStorage:", e);
    }
    return { highscore: 0, attempts: [] };
}

function saveResult(key, scoreValue) {
    const stats = getStats(key);
    if (scoreValue > stats.highscore) stats.highscore = scoreValue;
    stats.attempts.unshift({ score: scoreValue, date: new Date().toLocaleDateString() });
    localStorage.setItem(`quiz_${key}`, JSON.stringify(stats));
}

// 4. MAIN MENU RENDER
function showMenu() {
    switchView('menu-screen');
    clearInterval(timerInterval);
    const container = document.getElementById("menu-categories");
    container.innerHTML = "";

    if (!window.quizData || Object.keys(window.quizData).length === 0) {
        container.innerHTML = "<p style='padding:20px; text-align:center;'>No quiz modules found. Please check your questions.js file.</p>";
        return;
    }

    Object.keys(window.quizData).forEach(key => {
        const module = window.quizData[key];
        const stats = getStats(key);
        const moduleLimit = module.limit || 20;
        
        const card = document.createElement("div");
        card.className = "menu-card";
        
        let attemptsHTML = stats.attempts.slice(0, 2).map(a => `<li>${a.score}/${moduleLimit} (${a.date})</li>`).join('');
        if (!attemptsHTML) attemptsHTML = "<li>No attempts yet</li>";

        card.innerHTML = `
            <h4>${module.title}</h4>
            <div class="highscore-badge">🏆 High Score: ${stats.highscore}/${moduleLimit}</div>
            <div class="history-box">
                <p>Recent Attempts:</p>
                <ul>${attemptsHTML}</ul>
            </div>
            <button class="primary-btn sm" onclick="startQuiz('${key}')">Start Module</button>
        `;
        container.appendChild(card);
    });
}

// 5. QUIZ CORE MANAGEMENT
function startQuiz(key) {
    currentQuizKey = key;
    document.getElementById("modal-quiz-title").innerText = window.quizData[key].title;
    switchView('mode-modal');
}

function confirmMode(modeSelection) {
    quizMode = modeSelection;
    
    const module = window.quizData[currentQuizKey];
    const rawQuestions = module.questions;
    const targetLimit = module.limit || 20; 
    
    currentQuizList = shuffle([...rawQuestions]).slice(0, targetLimit);
    
    // Lock option layout ordering permanently for this session loop run
    currentQuizList.forEach(qData => {
        qData._fixedShuffledOptions = shuffle([...qData.options]);
    });
    
    current = 0;
    score = 0;
    userHistory = [];
    
    userSelections = new Array(currentQuizList.length).fill(null);
    answeredQuestions = new Array(currentQuizList.length).fill(false);
    
    if (quizMode === "test") {
        const durationMinutes = module.timeLimit || 30; 
        totalSecondsLeft = durationMinutes * 60;
        runModuleClock(); 
    } else {
        document.getElementById("timer").innerText = "📖 Practice";
        document.getElementById("timer").classList.remove("danger");
    }
    
    switchView('quiz-screen');
    loadQuestion();
}

function renderMath(element) {
    if (typeof renderMathInElement === "function") {
        renderMathInElement(element, {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false}
            ],
            throwOnError: false
        });
    }
}

function loadQuestion() {
    const qData = currentQuizList[current];
    const optionsDiv = document.getElementById("options");
    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");
    const feedback = document.getElementById("feedback");

    // Manage Navigation States Cleanly
    prevBtn.disabled = (current === 0);
    
    if (current === currentQuizList.length - 1) {
        nextBtn.innerText = quizMode === "test" ? "Submit Exam" : "Finish Review";
    } else {
        nextBtn.innerText = "Next Question";
    }
    
    nextBtn.disabled = (quizMode === "learning" && !answeredQuestions[current]);

    // Setup Text Headers
    document.getElementById("question").innerHTML = qData.q.replace(/\n/g, "<br>");
    document.getElementById("progressText").innerText = `Question ${current + 1} / ${currentQuizList.length}`;
    document.getElementById("progressBar").style.width = `${((current + 1) / currentQuizList.length) * 100}%`;
    document.getElementById("score").innerText = quizMode === "learning" ? `Score: ${score}` : "Score: hidden";

    optionsDiv.innerHTML = "";
    
    qData._fixedShuffledOptions.forEach(opt => {
        const btn = document.createElement("button");
        btn.className = "option-btn";
        btn.innerHTML = opt;
        
        if (userSelections[current] === opt) {
            btn.classList.add("selected");
        }

        if (quizMode === "learning" && answeredQuestions[current]) {
            btn.disabled = true;
            if (opt === qData.answer) btn.classList.add("correct");
            if (userSelections[current] === opt && opt !== qData.answer) btn.classList.add("incorrect");
        }

        btn.onclick = () => selectOption(opt, btn);
        optionsDiv.appendChild(btn);
    });

    if (quizMode === "learning" && answeredQuestions[current]) {
        showLearningFeedback(qData);
    } else {
        feedback.classList.add("hidden");
    }

    renderMath(document.getElementById("quiz-screen"));
}

function selectOption(selectedOption, clickedBtn) {
    const qData = currentQuizList[current];
    const allBtns = document.querySelectorAll(".option-btn");

    allBtns.forEach(b => b.classList.remove("selected"));

    if (quizMode === "test") {
        userSelections[current] = selectedOption;
        clickedBtn.classList.add("selected");
    } else {
        if (answeredQuestions[current]) return; 
        
        userSelections[current] = selectedOption;
        answeredQuestions[current] = true;
        
        allBtns.forEach(b => {
            b.disabled = true;
            if (b.innerHTML === qData.answer) b.classList.add("correct");
        });

        if (selectedOption === qData.answer) {
            score++;
            document.getElementById("score").innerText = `Score: ${score}`;
        } else {
            clickedBtn.classList.add("incorrect");
        }

        showLearningFeedback(qData);
        document.getElementById("nextBtn").disabled = false;
    }
}

function showLearningFeedback(qData) {
    const feedbackArea = document.getElementById("feedback");
    const feedbackText = document.getElementById("feedback-text");
    
    if (userSelections[current] === qData.answer) {
        feedbackText.innerHTML = "<strong>✅ Correct!</strong>";
    } else {
        feedbackText.innerHTML = "<strong>❌ Incorrect</strong>";
    }
    
    document.getElementById("explanation").innerHTML = qData.explanation.replace(/\n/g, "<br>");
    feedbackArea.classList.remove("hidden");
    renderMath(feedbackArea);
}

// 6. TERMINAL SYSTEM & EVALUATION COMPILER
function processFinalSubmission() {
    clearInterval(timerInterval);
    closeSubmitModal();
    
    score = 0;
    userHistory = [];

    currentQuizList.forEach((qData, index) => {
        const selected = userSelections[index];
        const isCorrect = (selected === qData.answer);
        
        if (isCorrect) score++;

        userHistory.push({
            question: qData.q,
            selected: selected ? selected : "[Unanswered / Left Blank]",
            correct: qData.answer,
            explanation: qData.explanation,
            status: isCorrect ? 'correct' : 'incorrect'
        });
    });

    saveResult(currentQuizKey, score);
    
    document.getElementById("final-score").innerText = `${score} / ${currentQuizList.length}`;
    document.getElementById("quiz-title-summary").innerText = window.quizData[currentQuizKey].title;
    
    // Automatically generate item cards inside the breakdown layout panel
    generateReviewDOM();
    
    document.getElementById("review-section").classList.add("hidden"); 
    switchView('results-screen');
}

function generateReviewDOM() {
    const container = document.getElementById("review-container");
    container.innerHTML = "";

    userHistory.forEach((item, index) => {
        const row = document.createElement("div");
        row.className = `review-item ${item.status}`;
        row.innerHTML = `
            <p class="review-q"><strong>#${index + 1}: ${item.question.replace(/\n/g, "<br>")}</strong></p>
            <p>Your answer: <span class="badge ${item.status}">${item.selected}</span></p>
            ${item.status === 'incorrect' ? `<p>Correct selection: <span class="badge correct">${item.correct}</span></p>` : ''}
            <p class="review-exp">💡 ${item.explanation.replace(/\n/g, "<br>")}</p>
        `;
        container.appendChild(row);
    });
    
    renderMath(container);
}

// 7. NAVIGATION ENGINE & ACTIONS (Combined & Sanitized to stop double-skipping)
function handleNextBtnClick() {
    if (current < currentQuizList.length - 1) {
        current++;
        loadQuestion();
    } else {
        if (quizMode === "test") {
            // Open the elegant markup popup wrapper card
            document.getElementById("submit-modal").classList.remove("hidden");
        } else {
            processFinalSubmission();
        }
    }
}

function handlePrevBtnClick() {
    if (current > 0) {
        current--;
        loadQuestion();
    }
}

function closeSubmitModal() {
    const modal = document.getElementById("submit-modal");
    if (modal) modal.classList.add("hidden");
}

function runModuleClock() {
    clearInterval(timerInterval);
    updateTimerDisplay();

    timerInterval = setInterval(() => {
        totalSecondsLeft--;
        updateTimerDisplay();

        if (totalSecondsLeft <= 120) {
            document.getElementById("timer").classList.add("danger");
        }
        
        if (totalSecondsLeft <= 0) {
            clearInterval(timerInterval);
            alert("Time is up! Submitting your answers automatically.");
            processFinalSubmission();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const timerDisplay = document.getElementById("timer");
    if (quizMode !== "test") return;

    const mins = Math.floor(totalSecondsLeft / 60);
    const secs = totalSecondsLeft % 60;
    
    const displayMins = mins < 10 ? "0" + mins : mins;
    const displaySecs = secs < 10 ? "0" + secs : secs;

    timerDisplay.innerText = `⏱️ ${displayMins}:${displaySecs}`;
}

// Boot System Configuration
window.onload = () => {
    // Single explicit bindings to guarantee one-time step navigation executions
    document.getElementById("nextBtn").onclick = handleNextBtnClick;
    document.getElementById("prevBtn").onclick = handlePrevBtnClick;
    
    // Explicit setup for peripheral controls
    const quitBtn = document.getElementById("quit-btn");
    if(quitBtn) {
        quitBtn.onclick = () => {
            if(confirm("Are you sure you want to quit this run?")) showMenu();
        };
    }

    const reviewToggle = document.getElementById("review-toggle-btn");
    if(reviewToggle) {
        reviewToggle.onclick = () => {
            generateReviewDOM();
            document.getElementById("review-section").classList.toggle("hidden");
        };
    }
    
    showMenu();
};
