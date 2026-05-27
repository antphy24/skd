// ================================================
// CONFIGURATION
// ================================================
const SUPABASE_URL = window.SUPABASE_CONFIG.URL;
const SUPABASE_ANON_KEY = window.SUPABASE_CONFIG.ANON_KEY;

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ================================================
// GLOBAL STATE
// ================================================
let currentUser = null;
let currentUserProfile = null;
let authMode = "login";
let currentQuizKey = "";
let currentQuizList = [];
let userHistory = [];
let current = 0;
let score = 0;
let timerInterval = null;
let timerEndTime = 0;
let quizMode = "test";
let userSelections = [];
let answeredQuestions = [];
let flaggedQuestions = [];

// ================================================
// UTILITIES
// ================================================
function shuffle(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function switchView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    const target = document.getElementById(viewId);
    if (target) target.classList.remove('hidden');
}

function resetQuizState() {
    current = 0;
    score = 0;
    userSelections = new Array(currentQuizList.length).fill(null);
    answeredQuestions = new Array(currentQuizList.length).fill(false);
    flaggedQuestions = [];
    userHistory = [];
}

function toggleFlag() {
    if (quizMode !== "test") return;

    const index = current;
    const flagIndex = flaggedQuestions.indexOf(index);

    if (flagIndex === -1) {
        flaggedQuestions.push(index);
    } else {
        flaggedQuestions.splice(flagIndex, 1);
    }

    updateFlagUI();
}

function updateFlagUI() {
    const flagBtn = document.getElementById('flag-btn');
    const flagCount = document.getElementById('flag-count');

    if (!flagBtn || !flagCount) return;

    const isFlagged = flaggedQuestions.includes(current);
    flagBtn.style.opacity = isFlagged ? "1" : "0.4";
    flagBtn.style.color = isFlagged ? "#f59e0b" : "inherit";
    flagCount.textContent = flaggedQuestions.length;
}

// Flagged Questions Summary in Submit Modal
function updateFlaggedSummaryInModal() {
    const countEl = document.getElementById('flagged-count-modal');
    const summaryBox = document.getElementById('flagged-summary');

    if (!countEl || !summaryBox) return;

    const count = flaggedQuestions.length;
    countEl.textContent = count;

    if (count > 0) {
        summaryBox.classList.remove('hidden');
    } else {
        summaryBox.classList.add('hidden');
    }
}

// Enhanced Submit Modal Handler
function showSubmitModal() {
    updateFlaggedSummaryInModal();
    document.getElementById("submit-modal").classList.remove("hidden");
}

// Full Question Navigator
function showQuestionNavigator() {
    const container = document.getElementById('full-question-grid');
    if (!container) return;

    container.innerHTML = "";

    for (let i = 0; i < currentQuizList.length; i++) {
        const item = document.createElement('div');
        item.className = 'question-item';
        item.textContent = i + 1;

        if (answeredQuestions[i]) item.classList.add('answered');
        if (flaggedQuestions.includes(i)) item.classList.add('flagged');
        if (i === current) item.classList.add('current');

        item.onclick = () => {
            current = i;
            closeQuestionNav();
            loadQuestion();
        };

        container.appendChild(item);
    }

    document.getElementById('question-nav-modal').classList.remove('hidden');
}

function closeQuestionNav() {
    document.getElementById('question-nav-modal').classList.add('hidden');
}

// Dark Mode Handler
function initDarkMode() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) {
        console.warn("Theme toggle button not found");
        return;
    }

    const html = document.documentElement;
    const savedTheme = localStorage.getItem('theme');

    // Apply saved preference or system preference
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        html.classList.add('dark');
        toggleBtn.textContent = '☀️';
    } else {
        toggleBtn.textContent = '🌙';
    }

    // Toggle handler
    toggleBtn.addEventListener('click', () => {
        html.classList.toggle('dark');
        const isDark = html.classList.contains('dark');

        toggleBtn.textContent = isDark ? '☀️' : '🌙';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

// ================================================
// STORAGE
// ================================================
function getStats(key) {
    try {
        const data = localStorage.getItem(`quiz_${key}`);
        if (data) {
            const parsed = JSON.parse(data);
            if (parsed?.attempts) return parsed;
        }
    } catch (e) {
        console.error("localStorage error:", e);
    }
    return { highscore: 0, attempts: [] };
}

function saveResult(key, scoreValue) {
    const stats = getStats(key);
    if (scoreValue > stats.highscore) stats.highscore = scoreValue;
    stats.attempts.unshift({ score: scoreValue, date: new Date().toLocaleDateString() });
    localStorage.setItem(`quiz_${key}`, JSON.stringify(stats));
}

// ================================================
// AUTHENTICATION
// ================================================
async function initializeAuthSession() {
    try {
        const { data: { user } } = await _supabase.auth.getUser();
        currentUser = user;

        if (currentUser) {
            const { data: profile } = await _supabase
                .from('profiles')
                .select('is_premium')
                .eq('id', currentUser.id)
                .single();

            currentUserProfile = profile || { is_premium: false };
            updateAuthUI(true);
        } else {
            currentUserProfile = null;
            updateAuthUI(false);
        }
    } catch (err) {
        console.error("Auth init error:", err);
        updateAuthUI(false);
    }
    showMenu();
}

function updateAuthUI(isLoggedIn) {
    const displaySpan = document.getElementById("user-display");
    const actionsDiv = document.getElementById("auth-actions");
    if (!displaySpan || !actionsDiv) return;

    if (isLoggedIn && currentUser) {
        const tier = currentUserProfile?.is_premium ? "Premium" : "Free Tier";
        displaySpan.innerText = `${currentUser.email} (${tier})`;
        actionsDiv.innerHTML = `<button class="secondary-btn sm" onclick="handleLogout()">Logout</button>`;
    } else {
        displaySpan.innerText = "Guest / Free Mode";
        actionsDiv.innerHTML = `
            <button class="primary-btn sm" onclick="triggerAuthModal('login')">Log In</button>
            <button class="secondary-btn sm" onclick="triggerAuthModal('signup')">Sign Up</button>
        `;
    }
}

function triggerAuthModal(mode) {
    authMode = mode;
    document.getElementById("auth-modal-title").innerText = mode === "login" ? "Sign In" : "Create Account";
    document.getElementById("auth-primary-btn").innerText = mode === "login" ? "Sign In" : "Register";
    document.getElementById("auth-switch-btn").innerText = mode === "login" ?
        "Don't have an account? Sign Up" : "Already have an account? Log In";

    const modal = document.getElementById("auth-modal");
    modal.classList.remove("hidden");
    modal.style.display = "flex";
}

async function handleLogout() {
    await _supabase.auth.signOut();
    currentUser = null;
    currentUserProfile = null;
    updateAuthUI(false);
    showMenu();
}

// ================================================
// MENU
// ================================================
function showMenu() {
    switchView('menu-screen');
    clearInterval(timerInterval);

    const container = document.getElementById("menu-categories");
    if (!container) return;
    container.innerHTML = "";

    const modules = [
        { key: "twk", title: "Tes Wawasan Kebangsaan (TWK)" },
        { key: "tiu", title: "Tes Inteligensia Umum (TIU)" },
        { key: "tkp", title: "Tes Karakteristik Pribadi (TKP)" }
    ];

    modules.forEach(m => {
        const stats = getStats(m.key);
        const card = document.createElement("div");
        card.className = "menu-card";

        let attemptsHTML = stats.attempts.slice(0, 2)
            .map(a => `<li>${a.score} (${a.date})</li>`).join('');
        if (!attemptsHTML) attemptsHTML = "<li>No attempts yet</li>";

        card.innerHTML = `
            <h4>${m.title}</h4>
            <div class="highscore-badge">High Score: ${stats.highscore}</div>
            <div class="history-box">
                <p>Recent Attempts:</p>
                <ul>${attemptsHTML}</ul>
            </div>
            <button class="primary-btn sm" onclick="startQuiz('${m.key}', '${m.title}')">Start Module</button>
        `;
        container.appendChild(card);
    });
}

function startQuiz(key, title) {
    currentQuizKey = key;
    document.getElementById("modal-quiz-title").innerText = title;
    switchView('mode-modal');
}

// ================================================
// MAIN QUIZ LOGIC
// ================================================
async function confirmMode(modeSelection) {
    quizMode = modeSelection;
    switchView('quiz-screen');

    document.getElementById("question").innerHTML = "Memuat soal dari Supabase...";
    document.getElementById("options").innerHTML = "";

    try {
        const [questionsRes, profileRes] = await Promise.all([
            _supabase
                .from('questions')
                .select('id, module_type, topic, is_hots, question_text, options, explanation')
                .eq('module_type', currentQuizKey)
                .range(0, 149),

            currentUser
                ? _supabase.from('profiles').select('is_premium').eq('id', currentUser.id).single()
                : Promise.resolve({ data: { is_premium: false } })
        ]);

        if (questionsRes.error) throw questionsRes.error;

        const rawQuestions = questionsRes.data || [];
        const isPremium = profileRes.data?.is_premium || false;

        currentUserProfile = { is_premium: isPremium };

        if (rawQuestions.length === 0) {
            document.getElementById("question").innerHTML = "Tidak ada soal tersedia untuk akun Anda.";
            return;
        }

        const shuffledPool = shuffle(structuredClone(rawQuestions));
        const targetLimit = isPremium ? 20 : 5;
        currentQuizList = shuffledPool.slice(0, targetLimit);

        currentQuizList.forEach(q => {
            if (q.options && Array.isArray(q.options)) {
                q._fixedShuffledOptions = shuffle([...q.options]);
            }
        });

        resetQuizState();

        if (quizMode === "test") {
            runModuleClock();
        } else {
            document.getElementById("timer").innerText = "Practice Mode";
        }

        loadQuestion();

    } catch (err) {
        console.error("Quiz loading error:", err);
        document.getElementById("question").innerHTML = "Gagal memuat soal. Periksa koneksi internet.";
    }
}

// ================================================
// TIMER (Improved)
// ================================================
function runModuleClock() {
    clearInterval(timerInterval);
    const duration = currentQuizList.length * 55;
    timerEndTime = Date.now() + duration * 1000;
    updateTimerDisplay();

    timerInterval = setInterval(() => {
        updateTimerDisplay();
        const timeLeft = Math.floor((timerEndTime - Date.now()) / 1000);

        if (timeLeft <= 120) document.getElementById("timer").classList.add("danger");
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert("Waktu habis! Ujian diserahkan otomatis.");
            processFinalSubmission();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const timerEl = document.getElementById("timer");
    if (!timerEl || quizMode !== "test") return;

    const timeLeft = Math.max(0, Math.floor((timerEndTime - Date.now()) / 1000));
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    timerEl.innerText = `⏱ ${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// ================================================
// QUESTION RENDERING
// ================================================
function renderMath(element) {
    if (typeof renderMathInElement === "function") {
        renderMathInElement(element, {
            delimiters: [
                { left: '$$', right: '$$', display: true },
                { left: '$', right: '$', display: false }
            ],
            throwOnError: false
        });
    }
}

function loadQuestion() {
    const qData = currentQuizList[current];
    if (!qData) return;

    const optionsDiv = document.getElementById("options");
    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");

    prevBtn.disabled = current === 0;
    nextBtn.innerText = (current === currentQuizList.length - 1)
        ? (quizMode === "test" ? "Submit Exam" : "Finish Review")
        : "Next Question";

    nextBtn.disabled = (quizMode === "learning" && !answeredQuestions[current]);

    document.getElementById("question").innerHTML = qData.question_text.replace(/\n/g, "<br>");
    if (qData.is_hots) {
        document.getElementById("question").innerHTML = `<span class="badge hots-badge">HOTS</span><br>` +
            document.getElementById("question").innerHTML;
    }

    document.getElementById("progressText").innerText = `Question ${current + 1} / ${currentQuizList.length}`;
    document.getElementById("progressBar").style.width = `${((current + 1) / currentQuizList.length) * 100}%`;
    document.getElementById("score").innerText = quizMode === "learning" ? `Score: ${score}` : "Score: hidden";

    optionsDiv.innerHTML = "";

    qData._fixedShuffledOptions.forEach(optObj => {
        const btn = document.createElement("button");
        btn.className = "option-btn";
        btn.innerHTML = optObj.text;

        if (userSelections[current] === optObj.text) btn.classList.add("selected");

        if (quizMode === "learning" && answeredQuestions[current]) {
            btn.disabled = true;
            if (optObj.points === 5) btn.classList.add("correct");
            if (userSelections[current] === optObj.text && optObj.points < 5) {
                btn.classList.add("incorrect");
            }
        }

        btn.onclick = () => selectOption(optObj, btn);
        optionsDiv.appendChild(btn);
    });

    if (quizMode === "learning" && answeredQuestions[current]) {
        showLearningFeedback(qData);
    }

    renderMath(document.getElementById("question"));
    document.querySelectorAll(".option-btn").forEach(btn => renderMath(btn));
    updateFlagUI();
}

function selectOption(selectedOptObj, clickedBtn) {
    const qData = currentQuizList[current];
    const allBtns = document.querySelectorAll(".option-btn");
    allBtns.forEach(b => b.classList.remove("selected"));

    if (quizMode === "test") {
        userSelections[current] = selectedOptObj.text;
        clickedBtn.classList.add("selected");

        localStorage.setItem(`crash_recovery_${currentQuizKey}`, JSON.stringify({
            current,
            selections: userSelections,
            timeLeft: Math.floor((timerEndTime - Date.now()) / 1000)
        }));
    } else {
        if (answeredQuestions[current]) return;

        userSelections[current] = selectedOptObj.text;
        answeredQuestions[current] = true;

        allBtns.forEach(b => {
            b.disabled = true;
            const matching = qData.options.find(o => o.text === b.innerHTML);
            if (matching?.points === 5) b.classList.add("correct");
        });

        score += selectedOptObj.points || 0;
        document.getElementById("score").innerText = `Score: ${score}`;

        if (selectedOptObj.points < 5 && currentQuizKey !== "tkp") {
            clickedBtn.classList.add("incorrect");
        }

        showLearningFeedback(qData);
        document.getElementById("nextBtn").disabled = false;
    }
}

// ================================================
// FEEDBACK & REVIEW
// ================================================
function showLearningFeedback(qData) {
    const feedbackArea = document.getElementById("feedback");
    const feedbackText = document.getElementById("feedback-text");
    if (!feedbackArea || !feedbackText) return;

    const selectedText = userSelections[current];
    const chosenOption = qData.options.find(o => o.text === selectedText);
    const pointsEarned = chosenOption ? chosenOption.points : 0;

    if (currentQuizKey === "tkp") {
        feedbackText.innerHTML = `<strong>Poin Nilai: ${pointsEarned}</strong>`;
    } else {
        feedbackText.innerHTML = pointsEarned === 5 ? "<strong>Benar!</strong>" : "<strong>Salah</strong>";
    }

    document.getElementById("explanation").innerHTML = qData.explanation.replace(/\n/g, "<br>");
    feedbackArea.classList.remove("hidden");
    renderMath(feedbackArea);
}

function generateReviewDOM() {
    const container = document.getElementById("review-container");
    if (!container) return;
    container.innerHTML = "";

    userHistory.forEach((item, index) => {
        const row = document.createElement("div");
        row.className = `review-item ${item.status}`;
        row.innerHTML = `
            <p class="review-q"><strong>#${index + 1}: ${item.question.replace(/\n/g, "<br>")}</strong></p>
            <p>Your answer: <span class="badge ${item.status}">${item.selected}</span></p>
            ${item.status === 'incorrect' ? `<p>Correct: <span class="badge correct">${item.correct}</span></p>` : ''}
            <p class="review-exp"> ${item.explanation.replace(/\n/g, "<br>")}</p>
        `;
        container.appendChild(row);
    });

    renderMath(container);
}

// ================================================
// SUBMISSION & NAVIGATION
// ================================================
function processFinalSubmission() {
    clearInterval(timerInterval);
    closeSubmitModal();
    localStorage.removeItem(`crash_recovery_${currentQuizKey}`);

    score = 0;
    userHistory = [];

    currentQuizList.forEach((qData, index) => {
        const selectedText = userSelections[index];
        const chosenOption = qData.options.find(o => o.text === selectedText);
        const pointsEarned = chosenOption ? chosenOption.points : 0;

        score += pointsEarned;

        const optimalOption = qData.options.find(o => o.points === 5);
        const correctText = optimalOption ? optimalOption.text : "";

        userHistory.push({
            question: qData.question_text,
            selected: selectedText ? `${selectedText} (+${pointsEarned} Poin)` : "[Unanswered]",
            correct: currentQuizKey === "tkp" ? "Skala 1-5" : correctText,
            explanation: qData.explanation,
            status: (pointsEarned === 5) ? 'correct' :
                ((currentQuizKey === 'tkp' && pointsEarned > 0) ? 'correct' : 'incorrect')
        });
    });

    saveResult(currentQuizKey, score);

    document.getElementById("final-score").innerText = score;
    document.getElementById("quiz-title-summary").innerText = `${currentQuizKey.toUpperCase()} Selesai`;

    generateReviewDOM();
    document.getElementById("review-section").classList.add("hidden");
    switchView('results-screen');
}

function handleNextBtnClick() {
    if (current < currentQuizList.length - 1) {
        current++;
        loadQuestion();
    } else {
        if (quizMode === "test") {
            showSubmitModal();
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

// ================================================
// BOOTSTRAP
// ================================================
document.addEventListener('DOMContentLoaded', () => {
    // Navigation buttons
    document.getElementById("nextBtn").onclick = handleNextBtnClick;
    document.getElementById("prevBtn").onclick = handlePrevBtnClick;

    const quitBtn = document.getElementById("quit-btn");
    if (quitBtn) {
        quitBtn.onclick = () => {
            if (confirm("Keluar dari ujian ini?")) showMenu();
        };
    }

    const reviewToggle = document.getElementById("review-toggle-btn");
    if (reviewToggle) {
        reviewToggle.onclick = () => {
            document.getElementById("review-section").classList.toggle("hidden");
        };
    }

    const flagBtn = document.getElementById('flag-btn');
    if (flagBtn) {
        flagBtn.onclick = toggleFlag;
    }

    const navBtn = document.getElementById('nav-btn');
    if (navBtn) navBtn.onclick = showQuestionNavigator;

    // Auth modal handler
    const authActionBtn = document.getElementById("auth-primary-btn");
    if (authActionBtn) {
        authActionBtn.onclick = async () => {
            const email = document.getElementById("auth-email").value.trim();
            const password = document.getElementById("auth-password").value.trim();

            if (!email || !password) {
                alert("Email dan password harus diisi.");
                return;
            }

            if (authMode === "signup") {
                const { error } = await _supabase.auth.signUp({ email, password });
                if (error) alert(`Gagal mendaftar: ${error.message}`);
                else {
                    alert("Pendaftaran berhasil!");
                    document.getElementById("auth-modal").classList.add("hidden");
                    await initializeAuthSession();
                }
            } else {
                const { error } = await _supabase.auth.signInWithPassword({ email, password });
                if (error) alert(`Gagal masuk: ${error.message}`);
                else {
                    document.getElementById("auth-modal").classList.add("hidden");
                    await initializeAuthSession();
                }
            }
        };
    }

    initializeAuthSession();
    initDarkMode();
});