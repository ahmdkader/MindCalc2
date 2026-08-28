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
    explainMode: false,
    lastCalculation: null,
    solveYourself: {
        active: false,
        steps: [],
        currentStepIndex: 0,
        a: null,
        b: null,
        op: null
    },
    training: {
        active: false,
        questions: [],
        currentIndex: 0,
        score: 0,
        solveStepByStep: false,
        currentSteps: [],
        currentStepIndex: 0,
        userAnswers: [],
        finalAnswerEntered: false
    }
};

// ==================== Translations ====================
const translations = {
    en: {
        tagline: 'Calculate it... Understand it',
        menu: 'Menu',
        history: 'History',
        trainYourself: 'Train Yourself',
        solveItYourself: 'Solve It Yourself',
        settings: 'Settings',
        quickCalculations: 'Quick Calculations',
        explainMethod: 'Explain Method',
        step: 'Step',
        exit: 'Exit',
        stepByStepSolution: 'Step-by-Step Solution',
        check: 'Check',
        next: 'Next',
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
        startSolving: 'Start Solving',
        submit: 'Submit',
        nextQuestion: 'Next Question',
        trainingComplete: 'Training Complete!',
        trainAgain: 'Train Again',
        backToCalculator: 'Back to Calculator',
        backToSettings: 'Back to Settings',
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
        finalAnswer: 'Final Answer: {a} {op} {b} = ?',
        installApp: 'Install MindCalc on your device?',
        install: 'Install'
    },
    ar: {
        tagline: 'احسبها... وافهمها',
        menu: 'القائمة',
        history: 'السجل',
        trainYourself: 'تدرب بنفسك',
        solveItYourself: 'حلها بنفسك',
        settings: 'الإعدادات',
        quickCalculations: 'الحسابات السريعة',
        explainMethod: 'اشرح الطريقة',
        step: 'الخطوة',
        exit: 'خروج',
        stepByStepSolution: 'الحل خطوة بخطوة',
        check: 'تحقق',
        next: 'التالي',
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
        startSolving: 'ابدأ الحل',
        submit: 'إرسال',
        nextQuestion: 'السؤال التالي',
        trainingComplete: 'اكتمل التدريب!',
        trainAgain: 'تدرب مرة أخرى',
        backToCalculator: 'العودة للآلة الحاسبة',
        backToSettings: 'العودة للإعدادات',
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
        finalAnswer: 'الإجابة النهائية: {a} {op} {b} = ؟',
        installApp: 'تثبيت MindCalc على جهازك؟',
        install: 'تثبيت'
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
    
    document.documentElement.lang = state.settings.language;
    document.documentElement.dir = state.settings.language === 'ar' ? 'rtl' : 'ltr';
    
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
    installPrompt: document.getElementById('installPrompt'),
    installBtn: document.getElementById('installBtn'),
    dismissInstall: document.getElementById('dismissInstall'),
    
    // Pages
    calculatorPage: document.getElementById('calculatorPage'),
    solveYourselfPage: document.getElementById('solveYourselfPage'),
    trainingPage: document.getElementById('trainingPage'),
    historyPage: document.getElementById('historyPage'),
    settingsPage: document.getElementById('settingsPage'),
    
    // Calculator
    calcExpression: document.getElementById('calcExpression'),
    calcResult: document.getElementById('calcResult'),
    stepsContainer: document.getElementById('stepsContainer'),
    stepsList: document.getElementById('stepsList'),
    
    // Solve Yourself Page
    solveNum1: document.getElementById('solveNum1'),
    solveNum2: document.getElementById('solveNum2'),
    solveOp: document.getElementById('solveOp'),
    solveStartBtn: document.getElementById('solveStartBtn'),
    solveModeIndicator: document.getElementById('solveModeIndicator'),
    solveStepNum: document.getElementById('solveStepNum'),
    solveExitBtn: document.getElementById('solveExitBtn'),
    solveStepsContainer: document.getElementById('solveStepsContainer'),
    solveStepsList: document.getElementById('solveStepsList'),
    solveUserStepInput: document.getElementById('solveUserStepInput'),
    solveStepInstruction: document.getElementById('solveStepInstruction'),
    solveStepAnswerInput: document.getElementById('solveStepAnswerInput'),
    solveCheckStepBtn: document.getElementById('solveCheckStepBtn'),
    
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
    trainingAnswer: document.getElementById('trainingAnswer'),
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

function generateDivisionBreakdown(a, b, withAnswers = false) {
    const steps = [];
    const result = Math.floor(a / b);
    
    // Find "round" parts of 'a' that are divisible by b
    let part1 = 0;
    let part2 = 0;
    
    for (let i = Math.floor(a / 10) * 10; i >= 0; i -= 10) {
        if (i % b === 0 && i <= a) {
            part1 = i;
            part2 = a - i;
            break;
        }
    }
    
    if (part1 === 0) {
        part1 = b * Math.floor(a / b);
        part2 = a - part1;
        if (part2 === 0 && part1 > b) {
            part1 = b * Math.floor((a / b) / 2);
            part2 = a - part1;
        }
    }
    
    if (part1 === 0 || part2 === 0) {
        part1 = b;
        part2 = a - b;
    }
    
    const q1 = Math.floor(part1 / b);
    const q2 = Math.floor(part2 / b);
    
    steps.push({
        question: t('stepDivBreakA', { a, part1, part2 }),
        answer: null,
        display: `${a} = ${part1} + ${part2}`,
        isInfo: true
    });
    
    steps.push({
        question: t('stepDivPart1', { part1, b }),
        answer: q1,
        display: `${part1} ÷ ${b} = ${withAnswers ? q1 : '?'}`
    });
    
    steps.push({
        question: t('stepDivPart2', { part2, b }),
        answer: q2,
        display: `${part2} ÷ ${b} = ${withAnswers ? q2 : '?'}`
    });
    
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
        case 'divide': return b !== 0 ? a / b : 0;
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
    state.explainMode = false;
    state.lastCalculation = null;
    elements.stepsContainer.classList.add('hidden');
    elements.explainBtn.classList.remove('active');
    elements.explainBtn.classList.add('hidden');
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
        state.result = formatResult(result);
    }
    state.operator = op;
    state.waitingForOperand = true;
    state.expression = `${state.previousValue} ${getOpSymbol(op)}`;
    updateDisplay();
}

function formatResult(value) {
    // Handle floating point precision issues
    const formatted = parseFloat(value.toFixed(10));
    // Remove trailing zeros after decimal
    return formatted.toString();
}

function performCalculation() {
    playSound('click');
    if (state.operator === null || state.waitingForOperand) return;
    
    const currentValue = parseFloat(state.result);
    const result = calculate(state.previousValue, currentValue, state.operator);
    const formattedResult = formatResult(result);
    
    const historyItem = {
        expression: `${state.previousValue} ${getOpSymbol(state.operator)} ${currentValue}`,
        result: formattedResult,
        timestamp: new Date().toISOString()
    };
    state.history.unshift(historyItem);
    if (state.history.length > 50) state.history.pop();
    localStorage.setItem('mindcalc_history', JSON.stringify(state.history));
    
    state.expression = `${state.previousValue} ${getOpSymbol(state.operator)} ${currentValue} =`;
    state.result = formattedResult;
    
    state.lastCalculation = {
        a: state.previousValue,
        b: currentValue,
        op: state.operator,
        result: formattedResult
    };
    
    elements.explainBtn.classList.remove('hidden');
    elements.stepsContainer.classList.add('hidden');
    
    if (state.explainMode) {
        showExplainBreakdown();
    }
    
    state.previousValue = null;
    state.operator = null;
    state.waitingForOperand = true;
    updateDisplay();
}

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
    document.querySelector('.steps-title').textContent = t('stepByStepSolution');
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
    state.result = formatResult(value / 100);
    updateDisplay();
}

// ==================== Solve It Yourself Page ====================

function startSolveYourself() {
    const a = parseFloat(elements.solveNum1.value);
    const b = parseFloat(elements.solveNum2.value);
    const op = elements.solveOp.value;
    
    if (isNaN(a) || isNaN(b)) {
        alert(t('enterNumbers'));
        return;
    }
    
    state.solveYourself.a = a;
    state.solveYourself.b = b;
    state.solveYourself.op = op;
    state.solveYourself.steps = generateBreakdown(a, b, op, false);
    state.solveYourself.currentStepIndex = 0;
    state.solveYourself.active = true;
    
    elements.solveModeIndicator.classList.remove('hidden');
    elements.solveStepsContainer.classList.remove('hidden');
    elements.solveUserStepInput.classList.remove('hidden');
    
    showSolveYourselfStep();
}

function showSolveYourselfStep() {
    if (state.solveYourself.currentStepIndex >= state.solveYourself.steps.length) {
        elements.solveStepInstruction.textContent = t('allStepsCompleted') + ' ' + formatResult(calculate(state.solveYourself.a, state.solveYourself.b, state.solveYourself.op));
        elements.solveStepAnswerInput.classList.add('hidden');
        elements.solveCheckStepBtn.classList.add('hidden');
        return;
    }
    
    const step = state.solveYourself.steps[state.solveYourself.currentStepIndex];
    elements.solveStepNum.textContent = state.solveYourself.currentStepIndex + 1;
    elements.solveStepInstruction.textContent = step.question;
    elements.solveStepAnswerInput.value = '';
    
    elements.solveStepsList.innerHTML = '';
    for (let i = 0; i < state.solveYourself.currentStepIndex; i++) {
        const s = state.solveYourself.steps[i];
        const stepEl = document.createElement('div');
        stepEl.className = 'step-item completed';
        stepEl.innerHTML = `
            <div class="step-number">${i + 1}</div>
            <div class="step-content">${s.display.replace('?', s.answer)}</div>
        `;
        elements.solveStepsList.appendChild(stepEl);
    }
    
    if (step.isInfo) {
        elements.solveStepAnswerInput.classList.add('hidden');
        elements.solveCheckStepBtn.classList.remove('hidden');
        elements.solveCheckStepBtn.textContent = t('next');
    } else {
        elements.solveStepAnswerInput.classList.remove('hidden');
        elements.solveCheckStepBtn.classList.remove('hidden');
        elements.solveCheckStepBtn.textContent = t('check');
        elements.solveStepAnswerInput.focus();
    }
    
    const currentEl = document.createElement('div');
    currentEl.className = 'step-item current';
    currentEl.innerHTML = `
        <div class="step-number">${state.solveYourself.currentStepIndex + 1}</div>
        <div class="step-content">${step.display}</div>
    `;
    elements.solveStepsList.appendChild(currentEl);
}

function checkSolveYourselfStep() {
    const step = state.solveYourself.steps[state.solveYourself.currentStepIndex];
    
    if (step.isInfo) {
        playSound('click');
        state.solveYourself.currentStepIndex++;
        showSolveYourselfStep();
        return;
    }
    
    const userAnswer = parseFloat(elements.solveStepAnswerInput.value);
    const correctAnswer = step.answer;
    
    if (userAnswer === correctAnswer) {
        playSound('success');
        state.solveYourself.currentStepIndex++;
        showSolveYourselfStep();
    } else {
        playSound('error');
        elements.solveStepAnswerInput.style.borderColor = 'var(--error)';
        setTimeout(() => {
            elements.solveStepAnswerInput.style.borderColor = '';
        }, 500);
        const feedback = document.createElement('div');
        feedback.className = 'step-feedback error';
        feedback.textContent = t('wrong') + ' ' + correctAnswer;
        feedback.style.cssText = 'color: var(--error); font-weight: 700; margin-top: 8px; text-align: center;';
        const existing = elements.solveUserStepInput.querySelector('.step-feedback');
        if (existing) existing.remove();
        elements.solveUserStepInput.appendChild(feedback);
        setTimeout(() => feedback.remove(), 2000);
    }
}

function exitSolveYourself() {
    state.solveYourself.active = false;
    state.solveYourself.steps = [];
    state.solveYourself.currentStepIndex = 0;
    elements.solveModeIndicator.classList.add('hidden');
    elements.solveStepsContainer.classList.add('hidden');
    elements.solveUserStepInput.classList.add('hidden');
    elements.solveStepsList.innerHTML = '';
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
    state.training.finalAnswerEntered = false;
    
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
    state.training.finalAnswerEntered = false;
    
    if (state.training.solveStepByStep) {
        state.training.currentSteps = generateBreakdown(q.a, q.b, q.op, false);
        state.training.currentStepIndex = 0;
        elements.trainingSteps.classList.remove('hidden');
        elements.trainingAnswer.classList.add('hidden');
        showTrainingStep();
    } else {
        elements.trainingSteps.classList.add('hidden');
        elements.trainingAnswer.classList.remove('hidden');
        elements.trainAnswerInput.focus();
    }
}

function showTrainingStep() {
    if (state.training.currentStepIndex >= state.training.currentSteps.length) {
        elements.trainUserStepInput.classList.add('hidden');
        elements.trainingAnswer.classList.remove('hidden');
        elements.trainAnswerInput.focus();
        return;
    }
    
    const step = state.training.currentSteps[state.training.currentStepIndex];
    elements.trainStepInstruction.textContent = step.question;
    elements.trainStepAnswer.value = '';
    elements.trainUserStepInput.classList.remove('hidden');
    elements.trainingAnswer.classList.add('hidden');
    
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
    
    if (step.isInfo) {
        elements.trainStepAnswer.classList.add('hidden');
        elements.trainCheckStep.classList.remove('hidden');
        elements.trainCheckStep.textContent = t('next');
    } else {
        elements.trainStepAnswer.classList.remove('hidden');
        elements.trainCheckStep.classList.remove('hidden');
        elements.trainCheckStep.textContent = t('check');
    }
    
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
    if (state.training.finalAnswerEntered) return;
    state.training.finalAnswerEntered = true;
    
    const q = state.training.questions[state.training.currentIndex];
    const userAnswer = parseFloat(elements.trainAnswerInput.value);
    
    elements.trainAnswerInput.disabled = true;
    elements.submitAnswer.disabled = true;
    state.training.userAnswers[state.training.currentIndex] = userAnswer;
    
    if (userAnswer === q.answer) {
        playSound('success');
        state.training.score++;
    } else {
        playSound('error');
    }
    
    // Show breakdown with correct steps
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
    elements.solveYourselfPage.classList.add('hidden');
    elements.trainingPage.classList.add('hidden');
    elements.historyPage.classList.add('hidden');
    elements.settingsPage.classList.add('hidden');
    
    switch(pageName) {
        case 'calculator':
            elements.calculatorPage.classList.remove('hidden');
            break;
        case 'solveYourself':
            elements.solveYourselfPage.classList.remove('hidden');
            break;
        case 'training':
            elements.trainingPage.classList.remove('hidden');
            elements.trainingSetup.classList.remove('hidden');
            elements.trainingSession.classList.add('hidden');
            elements.trainingResults.classList.add('hidden');
            break;
        case 'training-setup':
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

// ==================== PWA Install ====================
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    elements.installPrompt.classList.remove('hidden');
});

elements.installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
        elements.installPrompt.classList.add('hidden');
    }
    deferredPrompt = null;
});

elements.dismissInstall.addEventListener('click', () => {
    elements.installPrompt.classList.add('hidden');
});

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
document.querySelectorAll('.back-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        playSound('click');
        const backTarget = btn.dataset.back;
        if (backTarget === 'training-setup') {
            showPage('training');
        } else {
            showPage('calculator');
        }
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
        if (state.lastCalculation) {
            showExplainBreakdown();
        }
    } else {
        elements.explainBtn.classList.remove('active');
        elements.stepsContainer.classList.add('hidden');
    }
});

// Solve Yourself Page
elements.solveStartBtn.addEventListener('click', startSolveYourself);
elements.solveCheckStepBtn.addEventListener('click', checkSolveYourselfStep);
elements.solveStepAnswerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkSolveYourselfStep();
});
elements.solveExitBtn.addEventListener('click', exitSolveYourself);

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

// ==================== Service Worker ====================
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
}

// ==================== Initialization ====================

applySettings();
updateDisplay();
