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
let currentPopupCallback = null;

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

// Submit Modal Summary Helpers
function updateSubmitSummaryInModal() {
    const totalEl = document.getElementById('submit-total-count');
    const unansweredEl = document.getElementById('submit-unanswered-count');
    const flaggedEl = document.getElementById('submit-flagged-count-modal');
    const reviewHint = document.getElementById('submit-review-hint');

    if (!totalEl || !unansweredEl || !flaggedEl || !reviewHint) return;

    const total = currentQuizList.length;
    const unanswered = userSelections.filter(answer => !answer).length;
    const flagged = flaggedQuestions.length;

    totalEl.textContent = total;
    unansweredEl.textContent = unanswered;
    flaggedEl.textContent = flagged;
    reviewHint.classList.toggle('hidden', flagged === 0);
}

// Enhanced Submit Modal Handler
function showSubmitModal() {
    updateSubmitSummaryInModal();
    document.getElementById("submit-modal").classList.remove("hidden");
}

// Slide-in Grid Navigator
function showQuestionPanel() {
    const panel = document.getElementById('question-nav-panel');
    const container = document.getElementById('slide-question-grid');
    const answeredCountEl = document.getElementById('panel-answered-count');
    const flaggedCountEl = document.getElementById('panel-flagged-count');
    const remainingCountEl = document.getElementById('panel-remaining-count');

    if (!panel || !container) return;

    const answeredCount = answeredQuestions.filter(Boolean).length;
    const flaggedCount = flaggedQuestions.length;
    const remainingCount = Math.max(0, currentQuizList.length - answeredCount);

    if (answeredCountEl) answeredCountEl.textContent = `Terjawab ${answeredCount}`;
    if (flaggedCountEl) flaggedCountEl.textContent = `Ragu-Ragu ${flaggedCount}`;
    if (remainingCountEl) remainingCountEl.textContent = `Tersisa ${remainingCount}`;

    container.innerHTML = "";

    for (let i = 0; i < currentQuizList.length; i++) {
        const item = document.createElement('div');
        item.className = 'question-item';
        item.textContent = i + 1;

        // Always show the box
        if (answeredQuestions[i]) item.classList.add('answered');
        if (flaggedQuestions.includes(i)) item.classList.add('flagged');
        if (i === current) item.classList.add('current');

        item.onclick = () => {
            current = i;
            closeQuestionPanel();
            loadQuestion();
        };

        container.appendChild(item);
    }

    panel.classList.add('open');
}

function closeQuestionPanel() {
    const panel = document.getElementById('question-nav-panel');
    if (panel) panel.classList.remove('open');
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

function handleDoubtClick() {
    if (quizMode !== "test") return;

    toggleFlag();           // Reuse your existing flag function
    loadQuestion();         // Refresh UI
}

// Update bottom navigation buttons state
function updateBottomNavigation() {
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const doubtBtn = document.getElementById("doubtBtn");

    if (prevBtn) {
        prevBtn.disabled = (current === 0);
    }

    if (nextBtn) {
        nextBtn.innerText = (current === currentQuizList.length - 1)
            ? (quizMode === "test" ? "Submit Ujian" : "Selesai")
            : "Lanjut →";
    }

    if (doubtBtn) {
        doubtBtn.style.opacity = flaggedQuestions.includes(current) ? "1" : "0.85";
    }
}

// Custom Popup System

function showCustomPopup(title, message, buttons) {
    const popup = document.getElementById('custom-popup');
    const titleEl = document.getElementById('popup-title');
    const messageEl = document.getElementById('popup-message');
    const btnContainer = document.getElementById('popup-buttons');

    if (!popup || !titleEl || !messageEl || !btnContainer) return;

    titleEl.innerText = title;
    messageEl.innerText = message;
    btnContainer.innerHTML = "";

    buttons.forEach(btn => {
        const button = document.createElement('button');
        button.className = `popup-btn ${btn.type || 'secondary'}`;
        button.innerText = btn.text;

        button.onclick = () => {
            closeCustomPopup();
            if (btn.callback) btn.callback();
        };

        btnContainer.appendChild(button);
    });

    popup.classList.remove('hidden');
}

function closeCustomPopup() {
    const popup = document.getElementById('custom-popup');
    if (popup) popup.classList.add('hidden');
}

// Helper functions to replace alert and confirm
function showConfirm(message, onConfirm, onCancel = null) {
    showCustomPopup("Konfirmasi", message, [
        { text: "Batal", type: "secondary", callback: onCancel || (() => { }) },
        { text: "Ya", type: "primary", callback: onConfirm }
    ]);
}

function showAlert(message, onClose = null) {
    showCustomPopup("Info", message, [
        { text: "OK", type: "primary", callback: onClose || (() => { }) }
    ]);
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
        const tier = currentUserProfile?.is_premium ? "Premium" : "Free";
        displaySpan.innerText = `${currentUser.email.split('@')[0]} (${tier})`;
        actionsDiv.innerHTML = `<button class="secondary-btn sm" onclick="handleLogout()" style="padding: 6px 12px; font-size: 0.9rem;">Logout</button>`;
    } else {
        displaySpan.innerText = "Guest Mode";
        actionsDiv.innerHTML = `
            <button class="primary-btn sm" onclick="triggerAuthModal('login')" style="padding: 6px 12px; font-size: 0.9rem;">Login</button>
        `;
    }
}

function triggerAuthModal(mode) {
    authMode = mode;
    document.getElementById("auth-modal-title").innerText = mode === "login" ? "Masuk" : "Daftar Akun";
    document.getElementById("auth-primary-btn").innerText = mode === "login" ? "Masuk" : "Daftar";
    document.getElementById("auth-switch-btn").innerText = mode === "login" ?
        "Belum punya akun? Daftar" : "Sudah punya akun? Masuk";

    const modal = document.getElementById("auth-modal");
    if (!modal) return;
    modal.classList.remove("hidden");
    modal.style.display = "flex";
}

function closeAuthModal() {
    const modal = document.getElementById("auth-modal");
    if (!modal) return;
    modal.classList.add("hidden");
    modal.style.display = "none";
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
        card.className = `menu-card menu-card--${m.key}`;

        let attemptsHTML = stats.attempts.slice(0, 2)
            .map(a => `<li>${a.score} (${a.date})</li>`).join('');
        if (!attemptsHTML) attemptsHTML = "<li>No attempts yet</li>";

        card.innerHTML = `
            <div class="menu-card-top">
                <span class="menu-module-pill">${m.key.toUpperCase()}</span>
            </div>
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

    document.getElementById("question").innerHTML = "Memuat soal...";
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
            document.getElementById("question").innerHTML = "Tidak ada soal tersedia.";
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
            const timerEl = document.getElementById("timer");
            if (timerEl) timerEl.innerText = "";
        }

        // Set module title and theme metadata
        const titleEl = document.getElementById("quiz-module-title");
        const quizScreen = document.getElementById("quiz-screen");
        const modeBadge = document.getElementById("quiz-mode-badge");

        if (titleEl) titleEl.innerText = currentQuizKey.toUpperCase();
        if (quizScreen) {
            quizScreen.dataset.module = currentQuizKey;
            quizScreen.dataset.mode = quizMode;
        }
        if (modeBadge) {
            modeBadge.innerText = quizMode === "test" ? "Timed Test" : "Practice Mode";
        }

        loadQuestion();

    } catch (err) {
        console.error("Quiz load error:", err);
        document.getElementById("question").innerHTML = "Gagal memuat soal.<br><small>Periksa koneksi atau coba lagi nanti.</small>";
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
            showAlert("Waktu habis! Ujian diserahkan otomatis.");
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

    // Update progress
    document.getElementById("progressText").innerText = `Soal ${current + 1} / ${currentQuizList.length}`;
    document.getElementById("progressBar").style.width = `${((current + 1) / currentQuizList.length) * 100}%`;
    const questionIndexChip = document.getElementById("question-index-chip");
    if (questionIndexChip) questionIndexChip.innerText = `${current + 1} / ${currentQuizList.length}`;
    //document.getElementById("score").innerText = quizMode === "learning" ? `Score: ${score}` : "Score: hidden";

    // Render question
    document.getElementById("question").innerHTML = qData.question_text.replace(/\n/g, "<br>");
    if (qData.is_hots) {
        document.getElementById("question").innerHTML = `<span class="badge hots-badge">HOTS</span><br>` +
            document.getElementById("question").innerHTML;
    }

    // Reset feedback
    const feedbackArea = document.getElementById("feedback");
    if (feedbackArea) {
        feedbackArea.classList.add("hidden");
        feedbackArea.classList.remove("success", "error", "info");
        feedbackArea.removeAttribute("data-status");
    }

    // Render options
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

    // Show feedback in Learning Mode
    if (quizMode === "learning" && answeredQuestions[current]) {
        showLearningFeedback(qData);
    }

    // Render math
    renderMath(document.getElementById("question"));
    document.querySelectorAll(".option-btn").forEach(btn => renderMath(btn));

    // Update UI States
    updateFlagUI();
    updateBottomNavigation();
}

function selectOption(selectedOptObj, clickedBtn) {
    const qData = currentQuizList[current];
    const allBtns = document.querySelectorAll(".option-btn");
    allBtns.forEach(b => b.classList.remove("selected"));

    if (quizMode === "test") {
        userSelections[current] = selectedOptObj.text;
        clickedBtn.classList.add("selected");
        answeredQuestions[current] = true;

        localStorage.setItem(`crash_recovery_${currentQuizKey}`, JSON.stringify({
            current,
            selections: userSelections,
            timeLeft: Math.floor((timerEndTime - Date.now()) / 1000)
        }));

    } else {
        // LEARNING MODE
        if (answeredQuestions[current]) return;

        userSelections[current] = selectedOptObj.text;
        answeredQuestions[current] = true;

        // Highlight correct and selected
        allBtns.forEach(b => {
            b.disabled = true;
            const matching = qData.options.find(o => o.text === b.innerHTML);
            if (matching && matching.points === 5) {
                b.classList.add("correct");
            }
            if (b.innerHTML === selectedOptObj.text) {
                b.classList.add("selected");
            }
        });

        score += selectedOptObj.points || 0;
        const scoreEl = document.getElementById("score");
        if (scoreEl) scoreEl.innerText = `Score: ${score}`;

        // Show feedback
        showLearningFeedback(qData);
    }

    updateFlagUI();
}

// ================================================
// FEEDBACK & REVIEW
// ================================================
function showLearningFeedback(qData) {
    const feedbackArea = document.getElementById("feedback");
    const feedbackText = document.getElementById("feedback-text");
    const explanationEl = document.getElementById("explanation");

    if (!feedbackArea || !feedbackText || !explanationEl) return;

    const selectedText = userSelections[current];
    const chosenOption = qData.options.find(o => o.text === selectedText);
    const pointsEarned = chosenOption ? chosenOption.points : 0;

    if (currentQuizKey === "tkp") {
        feedbackText.innerHTML = `<strong>Poin: ${pointsEarned}</strong>`;
        feedbackArea.classList.add("info");
        feedbackArea.dataset.status = "info";
    } else if (pointsEarned === 5) {
        feedbackText.innerHTML = "<strong>✅ Benar!</strong>";
        feedbackArea.classList.add("success");
        feedbackArea.dataset.status = "success";
    } else {
        feedbackText.innerHTML = "<strong>❌ Salah</strong>";
        feedbackArea.classList.add("error");
        feedbackArea.dataset.status = "error";
    }

    explanationEl.innerHTML = (qData.explanation || "Tidak ada penjelasan tersedia.").replace(/\n/g, "<br>");

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
    updateResultsSummary();
    document.getElementById("review-section").classList.add("hidden");
    switchView('results-screen');
}

function updateResultsSummary() {
    const correctCount = document.getElementById('results-correct-count');
    const unansweredCount = document.getElementById('results-unanswered-count');
    const performanceText = document.getElementById('results-performance-text');

    if (!correctCount || !unansweredCount || !performanceText) return;

    const total = currentQuizList.length;
    const answered = userSelections.filter(answer => answer !== null && answer !== undefined).length;
    const correctAnswers = userHistory.filter(item => item.status === 'correct').length;
    const unanswered = total - answered;
    const flagged = flaggedQuestions.length;

    correctCount.textContent = `${correctAnswers} / ${total}`;
    unansweredCount.textContent = unanswered;

    const baseMessage = `Anda menyelesaikan ${total} soal dengan ${correctAnswers} jawaban benar.`;
    const flagMessage = flagged > 0 ? ` ${flagged} soal ditandai untuk review.` : '';
    performanceText.textContent = `${baseMessage}${flagMessage}`;
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
    // Bottom Navigation Bindings
    document.getElementById("prevBtn").onclick = handlePrevBtnClick;
    document.getElementById("nextBtn").onclick = handleNextBtnClick;
    document.getElementById("doubtBtn").onclick = handleDoubtClick;

    const quitBtn = document.getElementById("quit-btn");
    if (quitBtn) {
        quitBtn.onclick = () => {
            showConfirm("Keluar dari ujian ini?", () => showMenu());
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
    if (navBtn) navBtn.onclick = showQuestionPanel;

    const quizScreen = document.getElementById('quiz-screen');
    const navPanel = document.getElementById('question-nav-panel');
    if (quizScreen && navPanel) {
        quizScreen.addEventListener('click', (event) => {
            if (!navPanel.classList.contains('open')) return;
            if (event.target.closest('#nav-btn')) return;
            closeQuestionPanel();
        });
    }

    // Auth modal handler
    const authActionBtn = document.getElementById("auth-primary-btn");
    if (authActionBtn) {
        authActionBtn.onclick = async () => {
            const email = document.getElementById("auth-email").value.trim();
            const password = document.getElementById("auth-password").value.trim();

            if (!email || !password) {
                showAlert("Email dan password harus diisi.");
                return;
            }

            if (authMode === "signup") {
                const { error } = await _supabase.auth.signUp({ email, password });
                if (error) showAlert(`Gagal mendaftar: ${error.message}`);
                else {
                    showAlert("Pendaftaran berhasil!");
                    closeAuthModal();
                    await initializeAuthSession();
                }
            } else {
                const { error } = await _supabase.auth.signInWithPassword({ email, password });
                if (error) showAlert(`Gagal masuk: ${error.message}`);
                else {
                    closeAuthModal();
                    await initializeAuthSession();
                }
            }
        };
    }

    const authSwitchBtn = document.getElementById("auth-switch-btn");
    if (authSwitchBtn) {
        authSwitchBtn.onclick = () => {
            authMode = authMode === "login" ? "signup" : "login";
            triggerAuthModal(authMode);
        };
    }

    const authCloseBtn = document.getElementById("auth-close-btn");
    if (authCloseBtn) {
        authCloseBtn.onclick = closeAuthModal;
    }

    const authModal = document.getElementById("auth-modal");
    if (authModal) {
        authModal.addEventListener("click", (event) => {
            if (event.target === authModal) closeAuthModal();
        });
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeAuthModal();
    });

    initializeAuthSession();
    initDarkMode();
});
