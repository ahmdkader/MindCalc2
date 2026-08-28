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
    explainMode: false,
    currentSteps: [],
    currentStepIndex: 0,
    lastCalculation: null,
    training: {
        active: false,
        questions: [],
        currentIndex: 0,
        score: 0,
        solveStepByStep: false,
        currentSteps: [],
        currentStepIndex: 0,
        userAnswers: [],
        stepAnswers: []
    }
};

// ==================== Translations ====================
const translations = {
    en: {
        tagline: 'Calculate it... Understand it',
        menu: 'Menu',
        history: 'History',
        trainYourself: 'Train Yourself',
        settings: 'Settings',
        quickCalculations: 'Quick Calculations',
        explainMethod: 'Explain Method',
        solveItYourself: 'Solve It Yourself',
        solveItYourselfMode: 'Solve It Yourself Mode',
        step: 'Step',
        exit: 'Exit',
        stepByStepSolution: 'Step-by-Step Solution',
        check: 'Check',
        practiceSettings: 'Practice Settings',
        operation: 'Operation',
        addition: 'Addition (+)',
        subtraction: 'Subtraction (-)',
        multiplication: 'Multiplication (×)',
        division: 'Division (÷)',
        mixed: 'Mixed',
        difficulty: 'Difficulty',
        easy: 'Easy (1-2 digits)',
        medium: 'Medium (2 digits)',
        hard: 'Hard (3 digits)',
        numberOfQuestions: 'Number of Questions',
        solveStepByStep: 'Solve step-by-step',
        startTraining: 'Start Training',
        submit: 'Submit',
        nextQuestion: 'Next Question',
        trainingComplete: 'Training Complete!',
        trainAgain: 'Train Again',
        backToCalculator: 'Back to Calculator',
        noCalculationsYet: 'No calculations yet',
        clearHistory: 'Clear History',
        darkMode: 'Dark Mode',
        darkModeDesc: 'Switch between light and dark theme',
        soundEffects: 'Sound Effects',
        soundEffectsDesc: 'Play sounds on button press',
        showBreakdown: 'Show Breakdown',
        showBreakdownDesc: 'Automatically show step-by-step solution',
        language: 'Language',
        languageDesc: 'Choose your preferred language',
        correct: 'Correct! Well done!',
        wrong: 'Wrong! The correct answer is',
        allStepsCompleted: 'All steps completed! Final answer:',
        accuracy: 'Accuracy',
        correctCount: 'Correct',
        wrongCount: 'Wrong',
        stepAddRound: 'Add {toRound} to {a} to make it a round number: {a} + {toRound} = ?',
        stepAddRemaining: 'Now add the remaining {remaining}: {rounded} + {remaining} = ?',
        stepSubRound: 'Subtract {remainder} from {a} to make it a round number: {a} - {remainder} = ?',
        stepSubRemaining: 'Now subtract the remaining {remaining}: {rounded} - {remaining} = ?',
        stepMulTens: 'Multiply {a} by {tens}: {a} × {tens} = ?',
        stepMulOnes: 'Multiply {a} by {ones}: {a} × {ones} = ?',
        stepMulAdd: 'Add the partial results: {partial1} + {partial2} = ?',
        stepDivBreakA: 'Break {a} into easy parts: {part1} + {part2}',
        stepDivPart1: 'Divide {part1} by {b}: {part1} ÷ {b} = ?',
        stepDivPart2: 'Divide {part2} by {b}: {part2} ÷ {b} = ?',
        stepDivAdd: 'Add the partial results: {q1} + {q2} = ?',
        simpleCalculation: 'Simple calculation: {a} {op} {b} = ?',
        finalAnswer: 'Final Answer: {a} {op} {b} = ?'
    },
    ar: {
        tagline: 'احسبها... وافهمها',
        menu: 'القائمة',
        history: 'السجل',
        trainYourself: 'تدرب بنفسك',
        settings: 'الإعدادات',
        quickCalculations: 'الحسابات السريعة',
        explainMethod: 'اشرح الطريقة',
        solveItYourself: 'حلها بنفسك',
        solveItYourselfMode: 'وضع الحل الذاتي',
        step: 'الخطوة',
        exit: 'خروج',
        stepByStepSolution: 'الحل خطوة بخطوة',
        check: 'تحقق',
        practiceSettings: 'إعدادات التدريب',
        operation: 'العملية',
        addition: 'الجمع (+)',
        subtraction: 'الطرح (-)',
        multiplication: 'الضرب (×)',
        division: 'القسمة (÷)',
        mixed: 'مختلط',
        difficulty: 'المستوى',
        easy: 'سهل (1-2 رقم)',
        medium: 'متوسط (2 رقم)',
        hard: 'صعب (3 أرقام)',
        numberOfQuestions: 'عدد الأسئلة',
        solveStepByStep: 'حل خطوة بخطوة',
        startTraining: 'ابدأ التدريب',
        submit: 'إرسال',
        nextQuestion: 'السؤال التالي',
        trainingComplete: 'اكتمل التدريب!',
        trainAgain: 'تدرب مرة أخرى',
        backToCalculator: 'العودة للآلة الحاسبة',
        noCalculationsYet: 'لا توجد عمليات حتى الآن',
        clearHistory: 'مسح السجل',
        darkMode: 'الوضع الليلي',
        darkModeDesc: 'التبديل بين الوضع الفاتح والداكن',
        soundEffects: 'المؤثرات الصوتية',
        soundEffectsDesc: 'تشغيل الأصوات عند الضغط على الأزرار',
        showBreakdown: 'إظهار التفكيك',
        showBreakdownDesc: 'إظهار الحل خطوة بخطوة تلقائياً',
        language: 'اللغة',
        languageDesc: 'اختر لغتك المفضلة',
        correct: 'صحيح! أحسنت!',
        wrong: 'خطأ! الإجابة الصحيحة هي',
        allStepsCompleted: 'اكتملت جميع الخطوات! الإجابة النهائية:',
        accuracy: 'الدقة',
        correctCount: 'صحيح',
        wrongCount: 'خطأ',
        stepAddRound: 'أضف {toRound} إلى {a} لتجعلها رقمًا صحيحًا: {a} + {toRound} = ؟',
        stepAddRemaining: 'الآن أضف الباقي {remaining}: {rounded} + {remaining} = ؟',
        stepSubRound: 'اطرح {remainder} من {a} لتجعلها رقمًا صحيحًا: {a} - {remainder} = ؟',
        stepSubRemaining: 'الآن اطرح الباقي {remaining}: {rounded} - {remaining} = ؟',
        stepMulTens: 'اضرب {a} في {tens}: {a} × {tens} = ؟',
        stepMulOnes: 'اضرب {a} في {ones}: {a} × {ones} = ؟',
        stepMulAdd: 'اجمع النتائج الجزئية: {partial1} + {partial2} = ؟',
        stepDivBreakA: 'قسم {a} إلى أجزاء سهلة: {part1} + {part2}',
        stepDivPart1: 'اقسم {part1} على {b}: {part1} ÷ {b} = ؟',
        stepDivPart2: 'اقسم {part2} على {b}: {part2} ÷ {b} = ؟',
        stepDivAdd: 'اجمع النتائج الجزئية: {q1} + {q2} = ؟',
        simpleCalculation: 'عملية بسيطة: {a} {op} {b} = ؟',
        finalAnswer: 'الإجابة النهائية: {a} {op} {b} = ؟'
    }
};

function t(key, params = {}) {
    const lang = state.settings.language;
    let text = translations[lang]?.[key] || translations['en'][key] || key;
    Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, v);
    });
    return text;
}

function updateLanguage() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (translations[state.settings.language]?.[key]) {
            el.textContent = t(key);
        }
    });
    
    // Update HTML dir and lang
    document.documentElement.lang = state.settings.language;
    document.documentElement.dir = state.settings.language === 'ar' ? 'rtl' : 'ltr';
    
    // Update select options
    const trainOp = document.getElementById('trainOperation');
    if (trainOp) {
        trainOp.options[0].text = t('addition');
        trainOp.options[1].text = t('subtraction');
        trainOp.options[2].text = t('multiplication');
        trainOp.options[3].text = t('division');
        trainOp.options[4].text = t('mixed');
    }
    const trainDiff = document.getElementById('trainDifficulty');
    if (trainDiff) {
        trainDiff.options[0].text = t('easy');
        trainDiff.options[1].text = t('medium');
        trainDiff.options[2].text = t('hard');
    }
}

// ==================== DOM Elements ====================
const elements = {
    app: document.getElementById('app'),
    menuBtn: document.getElementById('menuBtn'),
    menuOverlay: document.getElementById('menuOverlay'),
    closeMenu: document.getElementById('closeMenu'),
    themeBtn: document.getElementById('themeBtn'),
    themeIcon: document.getElementById('themeIcon'),
    explainBtn: document.getElementById('explainBtn'),
    
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
let audioCtx = null;

function getAudioCtx() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
}

function playSound(type) {
    if (!state.settings.sound) return;
    try {
        const ctx = getAudioCtx();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        switch(type) {
            case 'click':
                oscillator.frequency.value = 800;
                gainNode.gain.value = 0.1;
                oscillator.start();
                oscillator.stop(ctx.currentTime + 0.05);
                break;
            case 'success':
                oscillator.frequency.value = 600;
                gainNode.gain.value = 0.15;
                oscillator.start();
                oscillator.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
                oscillator.stop(ctx.currentTime + 0.15);
                break;
            case 'error':
                oscillator.frequency.value = 200;
                gainNode.gain.value = 0.15;
                oscillator.start();
                oscillator.stop(ctx.currentTime + 0.2);
                break;
        }
    } catch(e) {}
}

// ==================== Math Logic ====================

function isRoundNumber(n) {
    return n % 10 === 0;
}

function needsBreakdown(a, b, op) {
    if (op !== 'add' && op !== 'subtract') return true;
    
    if (isRoundNumber(a) && isRoundNumber(b)) return false;
    if ((a < 10 && isRoundNumber(b)) || (b < 10 && isRoundNumber(a))) return false;
    if (op === 'add' && isRoundNumber(a + b)) return false;
    
    return true;
}

/**
 * Generate breakdown steps WITHOUT answers (for solve-yourself mode)
 * Each step has: question (what to calculate), answer (correct answer), type
 */
function generateAdditionBreakdown(a, b, withAnswers = false) {
    const steps = [];
    
    if (isRoundNumber(a)) {
        steps.push({
            question: t('simpleCalculation', { a, b, op: '+' }),
            answer: a + b,
            display: `${a} + ${b} = ${withAnswers ? a + b : '?'}`
        });
        return steps;
    }
    
    const remainder = a % 10;
    const toRound = remainder === 0 ? 0 : (10 - remainder);
    
    if (toRound > 0 && toRound <= b) {
        const roundedA = a + toRound;
        const remainingB = b - toRound;
        
        steps.push({
            question: t('stepAddRound', { toRound, a }),
            answer: roundedA,
            display: `${a} + ${toRound} = ${withAnswers ? roundedA : '?'}`
        });
        
        if (remainingB > 0) {
            steps.push({
                question: t('stepAddRemaining', { remaining: remainingB, rounded: roundedA }),
                answer: roundedA + remainingB,
                display: `${roundedA} + ${remainingB} = ${withAnswers ? roundedA + remainingB : '?'}`
            });
        }
    } else {
        steps.push({
            question: t('simpleCalculation', { a, b, op: '+' }),
            answer: a + b,
            display: `${a} + ${b} = ${withAnswers ? a + b : '?'}`
        });
    }
    
    return steps;
}

function generateSubtractionBreakdown(a, b, withAnswers = false) {
    const steps = [];
    
    if (isRoundNumber(a)) {
        steps.push({
            question: t('simpleCalculation', { a, b, op: '-' }),
            answer: a - b,
            display: `${a} - ${b} = ${withAnswers ? a - b : '?'}`
        });
        return steps;
    }
    
    const remainder = a % 10;
    
    if (remainder > 0 && remainder <= b) {
        const roundedA = a - remainder;
        const remainingB = b - remainder;
        
        steps.push({
            question: t('stepSubRound', { remainder, a }),
            answer: roundedA,
            display: `${a} - ${remainder} = ${withAnswers ? roundedA : '?'}`
        });
        
        if (remainingB > 0) {
            steps.push({
                question: t('stepSubRemaining', { remaining: remainingB, rounded: roundedA }),
                answer: roundedA - remainingB,
                display: `${roundedA} - ${remainingB} = ${withAnswers ? roundedA - remainingB : '?'}`
            });
        }
    } else {
        steps.push({
            question: t('simpleCalculation', { a, b, op: '-' }),
            answer: a - b,
            display: `${a} - ${b} = ${withAnswers ? a - b : '?'}`
        });
    }
    
    return steps;
}

function generateMultiplicationBreakdown(a, b, withAnswers = false) {
    const steps = [];
    
    const bTens = Math.floor(b / 10) * 10;
    const bOnes = b % 10;
    
    if (bTens > 0) {
        const tensVal = bTens / 10;
        const partial1 = a * tensVal;
        steps.push({
            question: t('stepMulTens', { a, tens: tensVal }),
            answer: partial1,
            display: `${a} × ${tensVal} = ${withAnswers ? partial1 : '?'}`
        });
    }
    
    if (bOnes > 0) {
        const partial2 = a * bOnes;
        steps.push({
            question: t('stepMulOnes', { a, ones: bOnes }),
            answer: partial2,
            display: `${a} × ${bOnes} = ${withAnswers ? partial2 : '?'}`
        });
        
        if (bTens > 0) {
            const total = (a * bTens) + partial2;
            steps.push({
                question: t('stepMulAdd', { partial1: a * bTens, partial2 }),
                answer: total,
                display: `${a * bTens} + ${partial2} = ${withAnswers ? total : '?'}`
            });
        }
    }
    
    return steps;
}

/**
 * CORRECTED Division Breakdown
 * Example: 91 ÷ 7 = 13
 * Break 91 into 70 + 21 (both divisible by 7)
 * 70 ÷ 7 = 10
 * 21 ÷ 7 = 3
 * 10 + 3 = 13
 */
function generateDivisionBreakdown(a, b, withAnswers = false) {
    const steps = [];
    const result = Math.floor(a / b);
    const remainder = a % b;
    
    // Find "round" parts of 'a' that are divisible by b
    // Strategy: break 'a' into tens + remainder, where tens is divisible by b
    
    // Find the largest multiple of 10 that is divisible by b and <= a
    let part1 = 0;
    let part2 = 0;
    
    // Try to find a round number (multiple of 10) that is divisible by b
    for (let i = Math.floor(a / 10) * 10; i >= 0; i -= 10) {
        if (i % b === 0 && i <= a) {
            part1 = i;
            part2 = a - i;
            break;
        }
    }
    
    // If no round number found, try multiples of b
    if (part1 === 0) {
        part1 = b * Math.floor(a / b);
        part2 = a - part1;
        // If part2 is 0, try a smaller part1
        if (part2 === 0 && part1 > b) {
            part1 = b * Math.floor((a / b) / 2);
            part2 = a - part1;
        }
    }
    
    // If still no good split, use a simple split
    if (part1 === 0 || part2 === 0) {
        part1 = b;
        part2 = a - b;
    }
    
    const q1 = Math.floor(part1 / b);
    const q2 = Math.floor(part2 / b);
    
    // Step 1: Break a into parts
    steps.push({
        question: t('stepDivBreakA', { a, part1, part2 }),
        answer: null, // informational step
        display: `${a} = ${part1} + ${part2}`,
        isInfo: true
    });
    
    // Step 2: Divide first part
    steps.push({
        question: t('stepDivPart1', { part1, b }),
        answer: q1,
        display: `${part1} ÷ ${b} = ${withAnswers ? q1 : '?'}`
    });
    
    // Step 3: Divide second part
    steps.push({
        question: t('stepDivPart2', { part2, b }),
        answer: q2,
        display: `${part2} ÷ ${b} = ${withAnswers ? q2 : '?'}`
    });
    
    // Step 4: Add the quotients
    steps.push({
        question: t('stepDivAdd', { q1, q2 }),
        answer: result,
        display: `${q1} + ${q2} = ${withAnswers ? result : '?'}`
    });
    
    return steps;
}

function generateBreakdown(a, b, op, withAnswers = false) {
    if (!needsBreakdown(a, b, op)) {
        return [{
            question: t('simpleCalculation', { a, b, op: getOpSymbol(op) }),
            answer: calculate(a, b, op),
            display: `${a} ${getOpSymbol(op)} ${b} = ${withAnswers ? calculate(a, b, op) : '?'}`
        }];
    }
    
    switch(op) {
        case 'add': return generateAdditionBreakdown(a, b, withAnswers);
        case 'subtract': return generateSubtractionBreakdown(a, b, withAnswers);
        case 'multiply': return generateMultiplicationBreakdown(a, b, withAnswers);
        case 'divide': return generateDivisionBreakdown(a, b, withAnswers);
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
    state.explainMode = false;
    state.lastCalculation = null;
    elements.stepsContainer.classList.add('hidden');
    elements.solveYourselfBtn.classList.remove('active');
    elements.explainBtn.classList.remove('active');
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
    
    // Store last calculation for explain/solve modes
    state.lastCalculation = {
        a: state.previousValue,
        b: currentValue,
        op: state.operator,
        result: result
    };
    
    // Generate breakdown steps (without answers for solve mode)
    const steps = generateBreakdown(state.previousValue, currentValue, state.operator, false);
    state.currentSteps = steps;
    
    // Hide steps container by default - only show if explain or solve mode is active
    elements.stepsContainer.classList.add('hidden');
    
    if (state.explainMode) {
        showExplainBreakdown();
    } else if (state.solveMode) {
        showSolveBreakdown();
    }
    
    state.previousValue = null;
    state.operator = null;
    state.waitingForOperand = true;
    updateDisplay();
}

// Show breakdown WITH answers (Explain Method)
function showExplainBreakdown() {
    if (!state.lastCalculation) return;
    
    const { a, b, op } = state.lastCalculation;
    const steps = generateBreakdown(a, b, op, true);
    
    elements.stepsList.innerHTML = '';
    steps.forEach((step, index) => {
        const stepEl = document.createElement('div');
        stepEl.className = 'step-item';
        stepEl.innerHTML = `
            <div class="step-number">${index + 1}</div>
            <div class="step-content">${step.display}</div>
        `;
        elements.stepsList.appendChild(stepEl);
    });
    
    elements.stepsContainer.classList.remove('hidden');
    elements.userStepInput.classList.add('hidden');
    document.querySelector('.steps-title').textContent = t('stepByStepSolution');
}

// Show breakdown WITHOUT answers (Solve It Yourself)
function showSolveBreakdown() {
    if (!state.lastCalculation) return;
    
    const { a, b, op } = state.lastCalculation;
    const steps = generateBreakdown(a, b, op, false);
    state.currentSteps = steps;
    
    elements.stepsContainer.classList.remove('hidden');
    elements.userStepInput.classList.remove('hidden');
    state.currentStepIndex = 0;
    showNextStep();
}

function showNextStep() {
    if (state.currentStepIndex >= state.currentSteps.length) {
        elements.stepInstruction.textContent = t('allStepsCompleted') + ' ' + state.result;
        elements.stepAnswerInput.classList.add('hidden');
        elements.checkStepBtn.classList.add('hidden');
        return;
    }
    
    const step = state.currentSteps[state.currentStepIndex];
    elements.currentStepNum.textContent = state.currentStepIndex + 1;
    elements.stepInstruction.textContent = step.question;
    elements.stepAnswerInput.value = '';
    
    // Show previous completed steps with their answers
    elements.stepsList.innerHTML = '';
    for (let i = 0; i < state.currentStepIndex; i++) {
        const s = state.currentSteps[i];
        const stepEl = document.createElement('div');
        stepEl.className = 'step-item completed';
        stepEl.innerHTML = `
            <div class="step-number">${i + 1}</div>
            <div class="step-content">${s.display.replace('?', s.answer)}</div>
        `;
        elements.stepsList.appendChild(stepEl);
    }
    
    // Handle info steps (no answer needed)
    if (step.isInfo) {
        elements.stepAnswerInput.classList.add('hidden');
        elements.checkStepBtn.classList.remove('hidden');
        elements.checkStepBtn.textContent = state.settings.language === 'ar' ? 'التالي' : 'Next';
        
        const currentEl = document.createElement('div');
        currentEl.className = 'step-item current';
        currentEl.innerHTML = `
            <div class="step-number">${state.currentStepIndex + 1}</div>
            <div class="step-content">${step.display}</div>
        `;
        elements.stepsList.appendChild(currentEl);
        return;
    }
    
    // Normal step with answer input
    elements.stepAnswerInput.classList.remove('hidden');
    elements.checkStepBtn.classList.remove('hidden');
    elements.checkStepBtn.textContent = t('check');
    elements.stepAnswerInput.focus();
    
    // Show current step as pending (without answer)
    const currentEl = document.createElement('div');
    currentEl.className = 'step-item current';
    currentEl.innerHTML = `
        <div class="step-number">${state.currentStepIndex + 1}</div>
        <div class="step-content">${step.display}</div>
    `;
    elements.stepsList.appendChild(currentEl);
}

function checkStepAnswer() {
    const step = state.currentSteps[state.currentStepIndex];
    
    // Info step - just advance
    if (step.isInfo) {
        playSound('click');
        state.currentStepIndex++;
        showNextStep();
        return;
    }
    
    const userAnswer = parseFloat(elements.stepAnswerInput.value);
    const correctAnswer = step.answer;
    
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
        // Show feedback instead of alert
        const feedback = document.createElement('div');
        feedback.className = 'step-feedback error';
        feedback.textContent = t('wrong') + ' ' + correctAnswer;
        feedback.style.cssText = 'color: var(--error); font-weight: 700; margin-top: 8px; text-align: center;';
        const existing = elements.userStepInput.querySelector('.step-feedback');
        if (existing) existing.remove();
        elements.userStepInput.appendChild(feedback);
        setTimeout(() => feedback.remove(), 2000);
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
    
    if (operation === 'mixed') {
        const ops = ['add', 'subtract', 'multiply'];
        op = ops[Math.floor(Math.random() * ops.length)];
    } else {
        op = operation;
    }
    
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
    
    if (op === 'subtract' && a < b) [a, b] = [b, a];
    
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
    state.training.userAnswers = [];
    state.training.stepAnswers = [];
    
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
        state.training.currentSteps = generateBreakdown(q.a, q.b, q.op, false);
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
        elements.trainUserStepInput.classList.add('hidden');
        elements.trainAnswerInput.parentElement.classList.remove('hidden');
        elements.trainAnswerInput.focus();
        return;
    }
    
    const step = state.training.currentSteps[state.training.currentStepIndex];
    elements.trainStepInstruction.textContent = step.question;
    elements.trainStepAnswer.value = '';
    elements.trainUserStepInput.classList.remove('hidden');
    elements.trainAnswerInput.parentElement.classList.add('hidden');
    
    // Show previous completed steps
    elements.trainStepsList.innerHTML = '';
    for (let i = 0; i < state.training.currentStepIndex; i++) {
        const s = state.training.currentSteps[i];
        const stepEl = document.createElement('div');
        stepEl.className = 'step-item completed';
        stepEl.innerHTML = `
            <div class="step-number">${i + 1}</div>
            <div class="step-content">${s.display.replace('?', s.answer)}</div>
        `;
        elements.trainStepsList.appendChild(stepEl);
    }
    
    // Handle info steps (no answer needed)
    if (step.isInfo) {
        elements.trainStepAnswer.classList.add('hidden');
        elements.trainCheckStep.classList.remove('hidden');
        elements.trainCheckStep.textContent = state.settings.language === 'ar' ? 'التالي' : 'Next';
        
        const currentEl = document.createElement('div');
        currentEl.className = 'step-item current';
        currentEl.innerHTML = `
            <div class="step-number">${state.training.currentStepIndex + 1}</div>
            <div class="step-content">${step.display}</div>
        `;
        elements.trainStepsList.appendChild(currentEl);
        return;
    }
    
    // Normal step
    elements.trainStepAnswer.classList.remove('hidden');
    elements.trainCheckStep.classList.remove('hidden');
    elements.trainCheckStep.textContent = t('check');
    
    // Show current step
    const currentEl = document.createElement('div');
    currentEl.className = 'step-item current';
    currentEl.innerHTML = `
        <div class="step-number">${state.training.currentStepIndex + 1}</div>
        <div class="step-content">${step.display}</div>
    `;
    elements.trainStepsList.appendChild(currentEl);
    
    elements.trainStepAnswer.focus();
}

function checkTrainingStep() {
    const step = state.training.currentSteps[state.training.currentStepIndex];
    
    // Info step - just advance
    if (step.isInfo) {
        playSound('click');
        state.training.currentStepIndex++;
        showTrainingStep();
        return;
    }
    
    const userAnswer = parseFloat(elements.trainStepAnswer.value);
    const correctAnswer = step.answer;
    
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
        // Show inline feedback
        const feedback = document.createElement('div');
        feedback.className = 'step-feedback error';
        feedback.textContent = t('wrong') + ' ' + correctAnswer;
        feedback.style.cssText = 'color: var(--error); font-weight: 700; margin-top: 8px; text-align: center;';
        const existing = elements.trainUserStepInput.querySelector('.step-feedback');
        if (existing) existing.remove();
        elements.trainUserStepInput.appendChild(feedback);
        setTimeout(() => feedback.remove(), 2000);
    }
}

function submitTrainingAnswer() {
    const q = state.training.questions[state.training.currentIndex];
    const userAnswer = parseFloat(elements.trainAnswerInput.value);
    
    elements.trainAnswerInput.disabled = true;
    elements.submitAnswer.disabled = true;
    
    // Store user's answer
    state.training.userAnswers[state.training.currentIndex] = userAnswer;
    
    if (userAnswer === q.answer) {
        playSound('success');
        state.training.score++;
    } else {
        playSound('error');
    }
    
    // Show breakdown with correct steps regardless of answer
    const correctSteps = generateBreakdown(q.a, q.b, q.op, true);
    
    elements.trainStepsList.innerHTML = '';
    correctSteps.forEach((step, index) => {
        const stepEl = document.createElement('div');
        stepEl.className = 'step-item';
        stepEl.innerHTML = `
            <div class="step-number">${index + 1}</div>
            <div class="step-content">${step.display}</div>
        `;
        elements.trainStepsList.appendChild(stepEl);
    });
    elements.trainingSteps.classList.remove('hidden');
    elements.trainUserStepInput.classList.add('hidden');
    
    // Show feedback
    if (userAnswer === q.answer) {
        elements.trainFeedback.textContent = t('correct');
        elements.trainFeedback.className = 'feedback correct';
    } else {
        elements.trainFeedback.textContent = `${t('wrong')} ${q.answer}`;
        elements.trainFeedback.className = 'feedback wrong';
    }
    elements.trainFeedback.classList.remove('hidden');
    
    if (state.training.currentIndex < state.training.questions.length - 1) {
        elements.nextQuestion.classList.remove('hidden');
    } else {
        setTimeout(showTrainingResults, 2000);
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
        <div>${t('accuracy')}: ${percentage}%</div>
        <div>${t('correctCount')}: ${score}</div>
        <div>${t('wrongCount')}: ${total - score}</div>
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
                <p>${t('noCalculationsYet')}</p>
            </div>
        `;
        elements.clearHistory.classList.add('hidden');
        return;
    }
    
    elements.historyList.innerHTML = state.history.map(item => {
        const date = new Date(item.timestamp);
        const timeStr = date.toLocaleTimeString(state.settings.language === 'ar' ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' });
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
    
    elements.calculatorPage.classList.add('hidden');
    elements.trainingPage.classList.add('hidden');
    elements.historyPage.classList.add('hidden');
    elements.settingsPage.classList.add('hidden');
    
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
    
    elements.darkModeToggle.checked = state.settings.darkMode;
    elements.soundToggle.checked = state.settings.sound;
    elements.breakdownToggle.checked = state.settings.showBreakdown;
    elements.languageSelect.value = state.settings.language;
    
    updateLanguage();
    
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

// Explain Method button
elements.explainBtn.addEventListener('click', () => {
    playSound('click');
    state.explainMode = !state.explainMode;
    
    if (state.explainMode) {
        elements.explainBtn.classList.add('active');
        elements.solveYourselfBtn.classList.remove('active');
        state.solveMode = false;
        elements.solveModeIndicator.classList.add('hidden');
        elements.userStepInput.classList.add('hidden');
        
        if (state.lastCalculation) {
            showExplainBreakdown();
        }
    } else {
        elements.explainBtn.classList.remove('active');
        elements.stepsContainer.classList.add('hidden');
    }
});

// Solve yourself mode
elements.solveYourselfBtn.addEventListener('click', () => {
    playSound('click');
    state.solveMode = !state.solveMode;
    
    if (state.solveMode) {
        elements.solveYourselfBtn.classList.add('active');
        elements.explainBtn.classList.remove('active');
        state.explainMode = false;
        elements.solveModeIndicator.classList.remove('hidden');
        
        if (state.lastCalculation) {
            showSolveBreakdown();
        }
    } else {
        elements.solveYourselfBtn.classList.remove('active');
        elements.solveModeIndicator.classList.add('hidden');
        elements.userStepInput.classList.add('hidden');
        
        if (state.lastCalculation && state.explainMode) {
            showExplainBreakdown();
        } else {
            elements.stepsContainer.classList.add('hidden');
        }
    }
});

elements.exitSolveMode.addEventListener('click', () => {
    playSound('click');
    state.solveMode = false;
    elements.solveYourselfBtn.classList.remove('active');
    elements.solveModeIndicator.classList.add('hidden');
    elements.userStepInput.classList.add('hidden');
    elements.stepsContainer.classList.add('hidden');
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
    if (confirm(state.settings.language === 'ar' ? 'مسح كل السجل؟' : 'Clear all history?')) {
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
