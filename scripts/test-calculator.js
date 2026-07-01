import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Helper to create a mock element
let mockElements = {};
function createMockElement(id, tagName = 'div', extra = {}) {
    const el = {
        id,
        tagName,
        textContent: '',
        value: '',
        innerHTML: '',
        innerText: '',
        style: {},
        listeners: {},
        addEventListener: (event, cb) => {
            el.listeners[event] = el.listeners[event] || [];
            el.listeners[event].push(cb);
        },
        dispatchEvent: (event) => {
            if (el.listeners[event]) {
                el.listeners[event].forEach(cb => cb());
            }
        },
        ...extra
    };
    mockElements[id] = el;
    return el;
}

// Global Document Mock
const eventListeners = {};
global.document = {
    addEventListener: (event, cb) => {
        eventListeners[event] = eventListeners[event] || [];
        eventListeners[event].push(cb);
    },
    getElementById: (id) => {
        if (mockElements[id]) return mockElements[id];
        return null;
    },
    querySelectorAll: (sel) => {
        return [];
    }
};

global.window = {
    location: { href: '' },
    dataLayer: []
};

// ============================================
// PART 1: B2B TAX SIMULATOR TESTS
// ============================================
const taxPath = path.join(__dirname, '..', 'src', 'pages', 'fiscalite-passer-regime-reel-micro-foncier.astro');
if (!fs.existsSync(taxPath)) {
    console.error(`❌ ERROR: Source file not found at ${taxPath}`);
    process.exit(1);
}
const taxContent = fs.readFileSync(taxPath, 'utf8');
const taxScriptMatch = taxContent.match(/<script is:inline>([\s\S]*?)<\/script>/);
if (!taxScriptMatch) {
    console.error('❌ ERROR: Client-side <script> block not found in Tax page.');
    process.exit(1);
}
let taxScriptCode = taxScriptMatch[1] + "\nglobal.runTaxCalculation = runTaxCalculation;";

// Instantiate tax elements
const rentInput = createMockElement('tax-rent-input', 'input', { value: '12000' });
const expenseInput = createMockElement('tax-expenses-input', 'input', { value: '2500' });
const microAbatementDisplay = createMockElement('tax-micro-abatement');
const realDeductionDisplay = createMockElement('tax-real-deduction');
const microNetDisplay = createMockElement('tax-micro-net');
const realNetDisplay = createMockElement('tax-real-net');
const verdictBox = createMockElement('tax-verdict-box');
const verdictTitle = createMockElement('tax-verdict-title');
const verdictDesc = createMockElement('tax-verdict-desc');

try {
    const runTaxCalculator = new Function(taxScriptCode);
    runTaxCalculator();

    // Trigger DOMContentLoaded
    if (eventListeners['DOMContentLoaded']) {
        eventListeners['DOMContentLoaded'].forEach(cb => cb());
    }

    console.log('🧪 Starting Automated E2E Mock DOM Tests for B2B Calculators...\n');
    console.log('=== RUNNING TAX SIMULATOR TESTS ===');
    console.log('Test 1: Verifying default state (12,000€ rent, 2,500€ expenses)...');
    
    if (microAbatementDisplay.innerHTML.replace(/\s/g, '') !== '3600€(30%forfait)') {
        throw new Error(`Abatement mismatch: '${microAbatementDisplay.innerHTML}'`);
    }
    if (realNetDisplay.innerHTML.replace(/\s/g, '') !== '9500€') {
        throw new Error(`Real net mismatch: ${realNetDisplay.innerHTML}`);
    }
    console.log('✅ Test 1 Passed.');

    console.log('Test 2: Setting expenses to 5,000€ (Régime Réel)...');
    expenseInput.value = '5000';
    global.runTaxCalculation();
    if (!verdictTitle.innerHTML.includes('Régime Réel')) {
        throw new Error(`Verdict mismatch: ${verdictTitle.innerHTML}`);
    }
    console.log('✅ Test 2 Passed.');
} catch (err) {
    console.error('\n❌ TAX TEST SUITE FAILED:');
    console.error(err.stack || err.message);
    process.exit(1);
}

// ============================================
// PART 2: B2B SALARY SIMULATOR TESTS
// ============================================
const salaryPath = path.join(__dirname, '..', 'src', 'pages', 'simulateur-loyer-salaire.astro');
if (!fs.existsSync(salaryPath)) {
    console.error(`❌ ERROR: Source file not found at ${salaryPath}`);
    process.exit(1);
}
const salaryContent = fs.readFileSync(salaryPath, 'utf8');
const salaryScriptMatch = salaryContent.match(/<script is:inline>([\s\S]*?)<\/script>/);
if (!salaryScriptMatch) {
    console.error('❌ ERROR: Client-side <script> block not found in Salary page.');
    process.exit(1);
}
let salaryScriptCode = salaryScriptMatch[1] + "\nglobal.calculateRent = calculateRent;\nglobal.calculateSalary = calculateSalary;";

// Reset elements mock
mockElements = {};
const salaryInput = createMockElement('salaryInput', 'input', { value: '3000' });
const rentInputEl = createMockElement('rentInput', 'input', { value: '1000' });
const rentResult = createMockElement('rentResult');
const salaryResult = createMockElement('salaryResult');

try {
    console.log('\n=== RUNNING SALARY-RENT SIMULATOR TESTS ===');
    const runSalaryCalculator = new Function(salaryScriptCode);
    runSalaryCalculator();

    console.log('Test 3: Je connais mon salaire (3,000€ net)...');
    global.calculateRent();
    if (rentResult.innerText.replace(/\s/g, '') !== '1000€') {
        throw new Error(`Max rent mismatch: should be 1000 €, got '${rentResult.innerText}'`);
    }
    console.log('✅ Test 3 Passed.');

    console.log('Test 4: Je connais le loyer (1,200€ CC)...');
    rentInputEl.value = '1200';
    global.calculateSalary();
    if (salaryResult.innerText.replace(/\s/g, '') !== '3600€') {
        throw new Error(`Min salary mismatch: should be 3600 €, got '${salaryResult.innerText}'`);
    }
    console.log('✅ Test 4 Passed.');

    console.log('\n🎉 ALL B2B CALCULATOR E2E TESTS PASSED! Mathematics and UI states are correct.');
    process.exit(0);
} catch (err) {
    console.error('\n❌ SALARY TEST SUITE FAILED:');
    console.error(err.stack || err.message);
    process.exit(1);
}
