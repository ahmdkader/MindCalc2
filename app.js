// ==================== State Management ====================
const state = {
    currentPage: 'calculator',
    expression: '',
    result: '0',
    previousValue: null,
    operator: null,
    waitingForOperand: false,
    history: JSON.parse(localStorage.getItem('mindcalc_history')) || [],
    settings: JSON.parse(localStorage.getItem('mindcalc_settings')) || {
        darkMode: false,
        sound: true,
        showBreakdown: true,
        language: 'en'
    },
    solveMode: false,
    currentSteps: [],
    currentStepIndex: 0,
    training: {
        active: false,
        questions: [],
        currentIndex: 0,
        score: 0,
        solveStepByStep: false,
        currentSteps: [],
        currentStepIndex: 0
    }
};

// ==================== DOM Elements ====================
const elements = {
    app: document.getElementById('app'),
    menuBtn: document.getElementById('menuBtn'),
    menuOverlay: document.getElementById('menuOverlay'),
    closeMenu: document.getElementById('closeMenu'),
    themeBtn: document.getElementById('themeBtn'),
    themeIcon: document.getElementById('themeIcon'),
    
    // Pages
    calculatorPage: document.getElementById('calculatorPage'),
    trainingPage: document.getElementById('trainingPage'),
    historyPage: document.getElementById('historyPage'),
    settingsPage: document.getElementById('settingsPage'),
    
    // Calculator
    calcExpression: document.getElementById('calcExpression'),
    calcResult: document.getElementById('calcResult'),
    stepsContainer: document.getElementById('stepsContainer'),
    stepsList: document.getElementById('stepsList'),
    solveYourselfBtn: document.getElementById('solveYourselfBtn'),
    solveModeIndicator: document.getElementById('solveModeIndicator'),
    currentStepNum: document.getElementById('currentStepNum'),
    exitSolveMode: document.getElementById('exitSolveMode'),
    userStepInput: document.getElementById('userStepInput'),
    stepInstruction: document.getElementById('stepInstruction'),
    stepAnswerInput: document.getElementById('stepAnswerInput'),
    checkStepBtn: document.getElementById('checkStepBtn'),
    
    // Training
    trainingSetup: document.getElementById('trainingSetup'),
    trainingSession: document.getElementById('trainingSession'),
    trainingResults: document.getElementById('trainingResults'),
    trainOperation: document.getElementById('trainOperation'),
    trainDifficulty: document.getElementById('trainDifficulty'),
    trainCount: document.getElementById('trainCount'),
    trainSolveYourself: document.getElementById('trainSolveYourself'),
    startTraining: document.getElementById('startTraining'),
    progressFill: document.getElementById('progressFill'),
    questionCounter: document.getElementById('questionCounter'),
    trainingQuestion: document.getElementById('trainingQuestion'),
    trainingSteps: document.getElementById('trainingSteps'),
    trainStepsList: document.getElementById('trainStepsList'),
    trainUserStepInput: document.getElementById('trainUserStepInput'),
    trainStepInstruction: document.getElementById('trainStepInstruction'),
    trainStepAnswer: document.getElementById('trainStepAnswer'),
    trainCheckStep: document.getElementById('trainCheckStep'),
    trainAnswerInput: document.getElementById('trainAnswerInput'),
    submitAnswer: document.getElementById('submitAnswer'),
    trainFeedback: document.getElementById('trainFeedback'),
    nextQuestion: document.getElementById('nextQuestion'),
    scoreDisplay: document.getElementById('scoreDisplay'),
    trainStats: document.getElementById('trainStats'),
    restartTraining: document.getElementById('restartTraining'),
    
    // History
    historyList: document.getElementById('historyList'),
    clearHistory: document.getElementById('clearHistory'),
    
    // Settings
    darkModeToggle: document.getElementById('darkModeToggle'),
    soundToggle: document.getElementById('soundToggle'),
    breakdownToggle: document.getElementById('breakdownToggle'),
    languageSelect: document.getElementById('languageSelect')
};

// ==================== Sound Effects ====================
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    if (!state.settings.sound) return;
    
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    switch(type) {
        case 'click':
            oscillator.frequency.value = 800;
            gainNode.gain.value = 0.1;
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.05);
            break;
        case 'success':
            oscillator.frequency.value = 600;
            gainNode.gain.value = 0.15;
            oscillator.start();
            oscillator.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
            oscillator.stop(audioCtx.currentTime + 0.15);
            break;
        case 'error':
            oscillator.frequency.value = 200;
            gainNode.gain.value = 0.15;
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.2);
            break;
    }
}

// ==================== Math Logic ====================

/**
 * Check if a number is a "round" number (ends in 0)
 */
function isRoundNumber(n) {
    return n % 10 === 0;
}

/**
 * Check if breakdown is needed for this operation
 * Simple operations like 90+10 don't need breakdown
 */
function needsBreakdown(a, b, op) {
    if (op !== 'add' && op !== 'subtract') return true;
    
    // If both numbers are round (end in 0), no need for breakdown
    if (isRoundNumber(a) && isRoundNumber(b)) return false;
    
    // If one number is single digit and the other is round
    if ((a < 10 && isRoundNumber(b)) || (b < 10 && isRoundNumber(a))) return false;
    
    // If result is obvious (like 90+10=100)
    if (op === 'add' && isRoundNumber(a + b)) return false;
    
    return true;
}

/**
 * Generate breakdown steps for addition
 * Example: 48 + 27
 * Step 1: 48 + 2 = 50 (make it round)
 * Step 2: 50 + 25 = 75 (add the remainder)
 * 
 * Fixed logic: Always add to the first number to make it round
 */
function generateAdditionBreakdown(a, b) {
    const steps = [];
    
    // If first number is already round, just add
    if (isRoundNumber(a)) {
        steps.push({
            text: `Add the numbers: ${a} + ${b} = ${a + b}`,
            answer: a + b
        });
        return steps;
    }
    
    // Calculate how much to add to make 'a' round
    const remainder = a % 10;
    const toRound = remainder === 0 ? 0 : (10 - remainder);
    
    if (toRound > 0 && toRound <= b) {
        // Step 1: Make 'a' round
        const roundedA = a + toRound;
        const remainingB = b - toRound;
        
        steps.push({
            text: `Add ${toRound} to ${a} to make it a round number: ${a} + ${toRound} = ${roundedA}`,
            answer: roundedA,
            highlight: `${roundedA}`
        });
        
        // Step 2: Add the remainder
        if (remainingB > 0) {
            steps.push({
                text: `Now add the remaining ${remainingB}: ${roundedA} + ${remainingB} = ${roundedA + remainingB}`,
                answer: roundedA + remainingB,
                highlight: `${roundedA + remainingB}`
            });
        }
    } else {
        // If toRound > b, just add directly
        steps.push({
            text: `Add the numbers: ${a} + ${b} = ${a + b}`,
            answer: a + b
        });
    }
    
    return steps;
}

/**
 * Generate breakdown steps for subtraction
 * Example: 75 - 27
 * Step 1: 75 - 5 = 70 (make it round going down)
 * Step 2: 70 - 22 = 48 (subtract the remainder)
 */
function generateSubtractionBreakdown(a, b) {
    const steps = [];
    
    // If first number is already round
    if (isRoundNumber(a)) {
        steps.push({
            text: `Subtract: ${a} - ${b} = ${a - b}`,
            answer: a - b
        });
        return steps;
    }
    
    // Calculate how much to subtract to make 'a' round
    const remainder = a % 10;
    
    if (remainder > 0 && remainder <= b) {
        // Step 1: Make 'a' round by subtracting remainder
        const roundedA = a - remainder;
        const remainingB = b - remainder;
        
        steps.push({
            text: `Subtract ${remainder} from ${a} to make it a round number: ${a} - ${remainder} = ${roundedA}`,
            answer: roundedA,
            highlight: `${roundedA}`
        });
        
        // Step 2: Subtract the remainder
        if (remainingB > 0) {
            steps.push({
                text: `Now subtract the remaining ${remainingB}: ${roundedA} - ${remainingB} = ${roundedA - remainingB}`,
                answer: roundedA - remainingB,
                highlight: `${roundedA - remainingB}`
            });
        }
    } else {
        steps.push({
            text: `Subtract: ${a} - ${b} = ${a - b}`,
            answer: a - b
        });
    }
    
    return steps;
}

/**
 * Generate breakdown steps for multiplication
 */
function generateMultiplicationBreakdown(a, b) {
    const steps = [];
    
    // Break down by place value
    const bTens = Math.floor(b / 10) * 10;
    const bOnes = b % 10;
    
    if (bTens > 0) {
        const partial1 = a * (bTens / 10);
        steps.push({
            text: `Multiply ${a} by ${bTens / 10} tens: ${a} × ${bTens / 10} = ${partial1}, so ${a} × ${bTens} = ${partial1 * 10}`,
            answer: partial1 * 10,
            highlight: `${partial1 * 10}`
        });
    }
    
    if (bOnes > 0) {
        const partial2 = a * bOnes;
        steps.push({
            text: `Multiply ${a} by ${bOnes}: ${a} × ${bOnes} = ${partial2}`,
            answer: partial2,
            highlight: `${partial2}`
        });
        
        if (bTens > 0) {
            const total = (a * bTens) + partial2;
            steps.push({
                text: `Add the partial results: ${a * bTens} + ${partial2} = ${total}`,
                answer: total,
                highlight: `${total}`
            });
        }
    }
    
    return steps;
}

/**
 * Generate breakdown steps for division
 */
function generateDivisionBreakdown(a, b) {
    const steps = [];
    const result = Math.floor(a / b);
    const remainder = a % b;
    
    // Find multiples
    let current = 0;
    for (let i = 1; i <= result; i++) {
        const multiple = b * i;
        steps.push({
            text: `${b} × ${i} = ${multiple}`,
            answer: multiple,
            highlight: `${multiple}`
        });
        current = multiple;
    }
    
    if (remainder > 0) {
        steps.push({
            text: `Remainder: ${a} - ${current} = ${remainder}`,
            answer: remainder,
            highlight: `${remainder}`
        });
    }
    
    return steps;
}

/**
 * Generate breakdown steps based on operation
 */
function generateBreakdown(a, b, op) {
    // Check if breakdown is needed
    if (!needsBreakdown(a, b, op)) {
        return [{
            text: `Simple calculation: ${a} ${getOpSymbol(op)} ${b} = ${calculate(a, b, op)}`,
            answer: calculate(a, b, op)
        }];
    }
    
    switch(op) {
        case 'add': return generateAdditionBreakdown(a, b);
        case 'subtract': return generateSubtractionBreakdown(a, b);
        case 'multiply': return generateMultiplicationBreakdown(a, b);
        case 'divide': return generateDivisionBreakdown(a, b);
        default: return [];
    }
}

function getOpSymbol(op) {
    const symbols = { add: '+', subtract: '-', multiply: '×', divide: '÷' };
    return symbols[op] || '+';
}

function calculate(a, b, op) {
    switch(op) {
        case 'add': return a + b;
        case 'subtract': return a - b;
        case 'multiply': return a * b;
        case 'divide': return b !== 0 ? Math.floor(a / b) : 0;
        default: return 0;
    }
}

// ==================== Calculator Logic ====================

function updateDisplay() {
    elements.calcExpression.textContent = state.expression;
    elements.calcResult.textContent = state.result;
}

function clearCalculator() {
    state.expression = '';
    state.result = '0';
    state.previousValue = null;
    state.operator = null;
    state.waitingForOperand = false;
    state.currentSteps = [];
    state.currentStepIndex = 0;
    state.solveMode = false;
    elements.stepsContainer.classList.add('hidden');
    elements.solveYourselfBtn.classList.remove('active');
    elements.solveModeIndicator.classList.add('hidden');
    elements.userStepInput.classList.add('hidden');
    updateDisplay();
}

function inputNumber(num) {
    playSound('click');
    
    if (state.waitingForOperand) {
        state.result = num.toString();
        state.waitingForOperand = false;
    } else {
        state.result = state.result === '0' ? num.toString() : state.result + num;
    }
    updateDisplay();
}

function inputDecimal() {
    playSound('click');
    
    if (state.waitingForOperand) {
        state.result = '0.';
        state.waitingForOperand = false;
    } else if (!state.result.includes('.')) {
        state.result += '.';
    }
    updateDisplay();
}

function inputOperator(op) {
    playSound('click');
    
    const currentValue = parseFloat(state.result);
    
    if (state.previousValue === null) {
        state.previousValue = currentValue;
    } else if (state.operator) {
        const result = calculate(state.previousValue, currentValue, state.operator);
        state.previousValue = result;
        state.result = result.toString();
    }
    
    state.operator = op;
    state.waitingForOperand = true;
    state.expression = `${state.previousValue} ${getOpSymbol(op)}`;
    updateDisplay();
}

function performCalculation() {
    playSound('click');
    
    if (state.operator === null || state.waitingForOperand) return;
    
    const currentValue = parseFloat(state.result);
    const result = calculate(state.previousValue, currentValue, state.operator);
    
    // Save to history
    const historyItem = {
        expression: `${state.previousValue} ${getOpSymbol(state.operator)} ${currentValue}`,
        result: result,
        timestamp: new Date().toISOString()
    };
    state.history.unshift(historyItem);
    if (state.history.length > 50) state.history.pop();
    localStorage.setItem('mindcalc_history', JSON.stringify(state.history));
    
    state.expression = `${state.previousValue} ${getOpSymbol(state.operator)} ${currentValue} =`;
    state.result = result.toString();
    
    // Generate breakdown
    const steps = generateBreakdown(state.previousValue, currentValue, state.operator);
    state.currentSteps = steps;
    
    if (state.settings.showBreakdown || state.solveMode) {
        showBreakdown(steps);
    }
    
    state.previousValue = null;
    state.operator = null;
    state.waitingForOperand = true;
    updateDisplay();
}

function showBreakdown(steps) {
    elements.stepsList.innerHTML = '';
    
    if (state.solveMode) {
        // In solve mode, show steps one by one
        elements.stepsContainer.classList.remove('hidden');
        elements.userStepInput.classList.remove('hidden');
        state.currentStepIndex = 0;
        showNextStep();
    } else {
        // Show all steps at once
        steps.forEach((step, index) => {
            const stepEl = document.createElement('div');
            stepEl.className = 'step-item';
            stepEl.innerHTML = `
                <div class="step-number">${index + 1}</div>
                <div class="step-content">${step.text}</div>
            `;
            elements.stepsList.appendChild(stepEl);
        });
        elements.stepsContainer.classList.remove('hidden');
        elements.userStepInput.classList.add('hidden');
    }
}

function showNextStep() {
    if (state.currentStepIndex >= state.currentSteps.length) {
        // All steps completed
        elements.stepInstruction.textContent = 'All steps completed! Final answer: ' + state.result;
        elements.stepAnswerInput.classList.add('hidden');
        elements.checkStepBtn.classList.add('hidden');
        return;
    }
    
    const step = state.currentSteps[state.currentStepIndex];
    elements.currentStepNum.textContent = state.currentStepIndex + 1;
    elements.stepInstruction.textContent = step.text;
    elements.stepAnswerInput.value = '';
    elements.stepAnswerInput.classList.remove('hidden');
    elements.checkStepBtn.classList.remove('hidden');
    elements.stepAnswerInput.focus();
    
    // Show previous steps
    elements.stepsList.innerHTML = '';
    for (let i = 0; i <= state.currentStepIndex; i++) {
        const s = state.currentSteps[i];
        const stepEl = document.createElement('div');
        stepEl.className = 'step-item' + (i < state.currentStepIndex ? ' completed' : ' current');
        stepEl.innerHTML = `
            <div class="step-number">${i + 1}</div>
            <div class="step-content">${s.text}</div>
        `;
        elements.stepsList.appendChild(stepEl);
    }
}

function checkStepAnswer() {
    const userAnswer = parseFloat(elements.stepAnswerInput.value);
    const correctAnswer = state.currentSteps[state.currentStepIndex].answer;
    
    if (userAnswer === correctAnswer) {
        playSound('success');
        state.currentStepIndex++;
        showNextStep();
    } else {
        playSound('error');
        elements.stepAnswerInput.style.borderColor = 'var(--error)';
        setTimeout(() => {
            elements.stepAnswerInput.style.borderColor = '';
        }, 500);
        alert('Incorrect! Try again.');
    }
}

function backspace() {
    playSound('click');
    
    if (state.result.length > 1) {
        state.result = state.result.slice(0, -1);
    } else {
        state.result = '0';
    }
    updateDisplay();
}

function percent() {
    playSound('click');
    const value = parseFloat(state.result);
    state.result = (value / 100).toString();
    updateDisplay();
}

// ==================== Training Logic ====================

function generateQuestion(operation, difficulty) {
    let a, b, op;
    
    // Determine operation
    if (operation === 'mixed') {
        const ops = ['add', 'subtract', 'multiply'];
        op = ops[Math.floor(Math.random() * ops.length)];
    } else {
        op = operation;
    }
    
    // Generate numbers based on difficulty
    switch(difficulty) {
        case 'easy':
            a = Math.floor(Math.random() * 9) + 1;
            b = Math.floor(Math.random() * 9) + 1;
            break;
        case 'medium':
            a = Math.floor(Math.random() * 90) + 10;
            b = Math.floor(Math.random() * 90) + 10;
            break;
        case 'hard':
            a = Math.floor(Math.random() * 900) + 100;
            b = Math.floor(Math.random() * 90) + 10;
            break;
    }
    
    // Ensure subtraction doesn't go negative
    if (op === 'subtract' && a < b) [a, b] = [b, a];
    
    // Ensure division is clean
    if (op === 'divide') {
        b = Math.floor(Math.random() * 9) + 2;
        a = b * (Math.floor(Math.random() * 10) + 2);
    }
    
    return { a, b, op, answer: calculate(a, b, op) };
}

function startTrainingSession() {
    const operation = elements.trainOperation.value;
    const difficulty = elements.trainDifficulty.value;
    const count = parseInt(elements.trainCount.value);
    const solveStepByStep = elements.trainSolveYourself.checked;
    
    state.training.questions = [];
    for (let i = 0; i < count; i++) {
        state.training.questions.push(generateQuestion(operation, difficulty));
    }
    
    state.training.active = true;
    state.training.currentIndex = 0;
    state.training.score = 0;
    state.training.solveStepByStep = solveStepByStep;
    state.training.currentSteps = [];
    state.training.currentStepIndex = 0;
    
    elements.trainingSetup.classList.add('hidden');
    elements.trainingSession.classList.remove('hidden');
    elements.trainingResults.classList.add('hidden');
    
    showTrainingQuestion();
}

function showTrainingQuestion() {
    const q = state.training.questions[state.training.currentIndex];
    
    elements.progressFill.style.width = `${((state.training.currentIndex) / state.training.questions.length) * 100}%`;
    elements.questionCounter.textContent = `${state.training.currentIndex + 1} / ${state.training.questions.length}`;
    elements.trainingQuestion.textContent = `${q.a} ${getOpSymbol(q.op)} ${q.b} = ?`;
    
    elements.trainFeedback.classList.add('hidden');
    elements.nextQuestion.classList.add('hidden');
    elements.trainAnswerInput.value = '';
    elements.trainAnswerInput.disabled = false;
    elements.submitAnswer.disabled = false;
    
    if (state.training.solveStepByStep) {
        // Generate steps
        state.training.currentSteps = generateBreakdown(q.a, q.b, q.op);
        state.training.currentStepIndex = 0;
        elements.trainingSteps.classList.remove('hidden');
        elements.trainAnswerInput.parentElement.classList.add('hidden');
        showTrainingStep();
    } else {
        elements.trainingSteps.classList.add('hidden');
        elements.trainAnswerInput.parentElement.classList.remove('hidden');
        elements.trainAnswerInput.focus();
    }
}

function showTrainingStep() {
    if (state.training.currentStepIndex >= state.training.currentSteps.length) {
        // All steps done, show final answer input
        elements.trainUserStepInput.classList.add('hidden');
        elements.trainAnswerInput.parentElement.classList.remove('hidden');
        elements.trainAnswerInput.focus();
        return;
    }
    
    const step = state.training.currentSteps[state.training.currentStepIndex];
    elements.trainStepInstruction.textContent = step.text;
    elements.trainStepAnswer.value = '';
    elements.trainUserStepInput.classList.remove('hidden');
    elements.trainAnswerInput.parentElement.classList.add('hidden');
    
    // Show previous steps
    elements.trainStepsList.innerHTML = '';
    for (let i = 0; i <= state.training.currentStepIndex; i++) {
        const s = state.training.currentSteps[i];
        const stepEl = document.createElement('div');
        stepEl.className = 'step-item' + (i < state.training.currentStepIndex ? ' completed' : ' current');
        stepEl.innerHTML = `
            <div class="step-number">${i + 1}</div>
            <div class="step-content">${s.text}</div>
        `;
        elements.trainStepsList.appendChild(stepEl);
    }
    
    elements.trainStepAnswer.focus();
}

function checkTrainingStep() {
    const userAnswer = parseFloat(elements.trainStepAnswer.value);
    const correctAnswer = state.training.currentSteps[state.training.currentStepIndex].answer;
    
    if (userAnswer === correctAnswer) {
        playSound('success');
        state.training.currentStepIndex++;
        showTrainingStep();
    } else {
        playSound('error');
        elements.trainStepAnswer.style.borderColor = 'var(--error)';
        setTimeout(() => {
            elements.trainStepAnswer.style.borderColor = '';
        }, 500);
        alert('Incorrect! Try again.');
    }
}

function submitTrainingAnswer() {
    const q = state.training.questions[state.training.currentIndex];
    const userAnswer = parseFloat(elements.trainAnswerInput.value);
    
    elements.trainAnswerInput.disabled = true;
    elements.submitAnswer.disabled = true;
    
    if (userAnswer === q.answer) {
        playSound('success');
        state.training.score++;
        elements.trainFeedback.textContent = 'Correct! Well done!';
        elements.trainFeedback.className = 'feedback correct';
    } else {
        playSound('error');
        elements.trainFeedback.textContent = `Wrong! The correct answer is ${q.answer}`;
        elements.trainFeedback.className = 'feedback wrong';
    }
    
    elements.trainFeedback.classList.remove('hidden');
    
    if (state.training.currentIndex < state.training.questions.length - 1) {
        elements.nextQuestion.classList.remove('hidden');
    } else {
        setTimeout(showTrainingResults, 1500);
    }
}

function showTrainingResults() {
    elements.trainingSession.classList.add('hidden');
    elements.trainingResults.classList.remove('hidden');
    
    const total = state.training.questions.length;
    const score = state.training.score;
    const percentage = Math.round((score / total) * 100);
    
    elements.scoreDisplay.textContent = `${score}/${total}`;
    elements.trainStats.innerHTML = `
        <div>Accuracy: ${percentage}%</div>
        <div>Correct: ${score}</div>
        <div>Wrong: ${total - score}</div>
    `;
}

// ==================== History Logic ====================

function renderHistory() {
    if (state.history.length === 0) {
        elements.historyList.innerHTML = `
            <div class="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <p>No calculations yet</p>
            </div>
        `;
        elements.clearHistory.classList.add('hidden');
        return;
    }
    
    elements.historyList.innerHTML = state.history.map(item => {
        const date = new Date(item.timestamp);
        const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        return `
            <div class="history-item">
                <div>
                    <div class="history-expr">${item.expression}</div>
                    <div class="history-time">${timeStr}</div>
                </div>
                <div class="history-result">= ${item.result}</div>
            </div>
        `;
    }).join('');
    
    elements.clearHistory.classList.remove('hidden');
}

// ==================== Navigation ====================

function showPage(pageName) {
    state.currentPage = pageName;
    
    // Hide all pages
    elements.calculatorPage.classList.add('hidden');
    elements.trainingPage.classList.add('hidden');
    elements.historyPage.classList.add('hidden');
    elements.settingsPage.classList.add('hidden');
    
    // Show requested page
    switch(pageName) {
        case 'calculator':
            elements.calculatorPage.classList.remove('hidden');
            break;
        case 'training':
            elements.trainingPage.classList.remove('hidden');
            elements.trainingSetup.classList.remove('hidden');
            elements.trainingSession.classList.add('hidden');
            elements.trainingResults.classList.add('hidden');
            break;
        case 'history':
            elements.historyPage.classList.remove('hidden');
            renderHistory();
            break;
        case 'settings':
            elements.settingsPage.classList.remove('hidden');
            break;
    }
    
    elements.menuOverlay.classList.remove('active');
}

// ==================== Settings ====================

function applySettings() {
    // Dark mode
    if (state.settings.darkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
        elements.themeIcon.innerHTML = `
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        `;
    } else {
        document.documentElement.removeAttribute('data-theme');
        elements.themeIcon.innerHTML = `
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        `;
    }
    
    // Update toggles
    elements.darkModeToggle.checked = state.settings.darkMode;
    elements.soundToggle.checked = state.settings.sound;
    elements.breakdownToggle.checked = state.settings.showBreakdown;
    elements.languageSelect.value = state.settings.language;
    
    localStorage.setItem('mindcalc_settings', JSON.stringify(state.settings));
}

// ==================== Event Listeners ====================

// Menu
elements.menuBtn.addEventListener('click', () => {
    playSound('click');
    elements.menuOverlay.classList.add('active');
});

elements.closeMenu.addEventListener('click', () => {
    playSound('click');
    elements.menuOverlay.classList.remove('active');
});

elements.menuOverlay.addEventListener('click', (e) => {
    if (e.target === elements.menuOverlay) {
        elements.menuOverlay.classList.remove('active');
    }
});

// Menu items
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        playSound('click');
        const page = item.dataset.page;
        showPage(page);
    });
});

// Theme toggle
elements.themeBtn.addEventListener('click', () => {
    playSound('click');
    state.settings.darkMode = !state.settings.darkMode;
    applySettings();
});

// Back buttons
document.querySelectorAll('.back-btn, [data-back]').forEach(btn => {
    btn.addEventListener('click', () => {
        playSound('click');
        showPage('calculator');
    });
});

// Calculator keys
document.querySelectorAll('.key').forEach(key => {
    key.addEventListener('click', () => {
        if (key.dataset.number !== undefined) {
            inputNumber(parseInt(key.dataset.number));
        } else if (key.dataset.action === 'decimal') {
            inputDecimal();
        } else if (key.dataset.action === 'clear') {
            clearCalculator();
        } else if (key.dataset.action === 'backspace') {
            backspace();
        } else if (key.dataset.action === 'percent') {
            percent();
        } else if (key.dataset.action === 'equals') {
            performCalculation();
        } else {
            inputOperator(key.dataset.action);
        }
    });
});

// Solve yourself mode
elements.solveYourselfBtn.addEventListener('click', () => {
    playSound('click');
    state.solveMode = !state.solveMode;
    
    if (state.solveMode) {
        elements.solveYourselfBtn.classList.add('active');
        elements.solveModeIndicator.classList.remove('hidden');
        
        // If there's a completed calculation, show steps
        if (state.currentSteps.length > 0) {
            showBreakdown(state.currentSteps);
        }
    } else {
        elements.solveYourselfBtn.classList.remove('active');
        elements.solveModeIndicator.classList.add('hidden');
        elements.userStepInput.classList.add('hidden');
        
        // Show all steps if they exist
        if (state.currentSteps.length > 0 && state.settings.showBreakdown) {
            elements.stepsList.innerHTML = '';
            state.currentSteps.forEach((step, index) => {
                const stepEl = document.createElement('div');
                stepEl.className = 'step-item';
                stepEl.innerHTML = `
                    <div class="step-number">${index + 1}</div>
                    <div class="step-content">${step.text}</div>
                `;
                elements.stepsList.appendChild(stepEl);
            });
        }
    }
});

elements.exitSolveMode.addEventListener('click', () => {
    playSound('click');
    state.solveMode = false;
    elements.solveYourselfBtn.classList.remove('active');
    elements.solveModeIndicator.classList.add('hidden');
    elements.userStepInput.classList.add('hidden');
});

elements.checkStepBtn.addEventListener('click', checkStepAnswer);
elements.stepAnswerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkStepAnswer();
});

// Training
elements.startTraining.addEventListener('click', startTrainingSession);
elements.submitAnswer.addEventListener('click', submitTrainingAnswer);
elements.trainAnswerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') submitTrainingAnswer();
});
elements.nextQuestion.addEventListener('click', () => {
    playSound('click');
    state.training.currentIndex++;
    showTrainingQuestion();
});
elements.restartTraining.addEventListener('click', () => {
    playSound('click');
    elements.trainingSetup.classList.remove('hidden');
    elements.trainingResults.classList.add('hidden');
});

elements.trainCheckStep.addEventListener('click', checkTrainingStep);
elements.trainStepAnswer.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkTrainingStep();
});

// History
elements.clearHistory.addEventListener('click', () => {
    playSound('click');
    if (confirm('Clear all history?')) {
        state.history = [];
        localStorage.removeItem('mindcalc_history');
        renderHistory();
    }
});

// Settings
elements.darkModeToggle.addEventListener('change', (e) => {
    state.settings.darkMode = e.target.checked;
    applySettings();
});

elements.soundToggle.addEventListener('change', (e) => {
    state.settings.sound = e.target.checked;
    applySettings();
});

elements.breakdownToggle.addEventListener('change', (e) => {
    state.settings.showBreakdown = e.target.checked;
    applySettings();
});

elements.languageSelect.addEventListener('change', (e) => {
    state.settings.language = e.target.value;
    applySettings();
    // Note: Full localization would require more implementation
});

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (state.currentPage !== 'calculator') return;
    
    if (e.key >= '0' && e.key <= '9') inputNumber(parseInt(e.key));
    else if (e.key === '.') inputDecimal();
    else if (e.key === '+') inputOperator('add');
    else if (e.key === '-') inputOperator('subtract');
    else if (e.key === '*') inputOperator('multiply');
    else if (e.key === '/') inputOperator('divide');
    else if (e.key === 'Enter' || e.key === '=') performCalculation();
    else if (e.key === 'Escape') clearCalculator();
    else if (e.key === 'Backspace') backspace();
});

// ==================== Initialization ====================

applySettings();
updateDisplay();
