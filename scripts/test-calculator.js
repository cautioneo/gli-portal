import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 1. Read the B2B tax simulator page
const filePath = path.join(__dirname, '..', 'src', 'pages', 'fiscalite-passer-regime-reel-micro-foncier.astro');
if (!fs.existsSync(filePath)) {
    console.error(`❌ ERROR: Source file not found at ${filePath}`);
    process.exit(1);
}
const content = fs.readFileSync(filePath, 'utf8');

// 2. Extract the client-side JavaScript block
const scriptMatch = content.match(/<script is:inline>([\s\S]*?)<\/script>/);
if (!scriptMatch) {
    console.error('❌ ERROR: Client-side <script> block not found in Astro page.');
    process.exit(1);
}
const scriptCode = scriptMatch[1] + "\nglobal.runTaxCalculation = runTaxCalculation;";

// 3. Set up the virtual Mock DOM environment
const mockElements = {};
const eventListeners = {};

// Helper to create a mock element
function createMockElement(id, tagName = 'div', extra = {}) {
    const el = {
        id,
        tagName,
        textContent: '',
        value: '',
        innerHTML: '',
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

// Instantiate inputs and output displays
const rentInput = createMockElement('tax-rent-input', 'input', { value: '12000' });
const expenseInput = createMockElement('tax-expenses-input', 'input', { value: '2500' });

const microAbatementDisplay = createMockElement('tax-micro-abatement');
const realDeductionDisplay = createMockElement('tax-real-deduction');
const microNetDisplay = createMockElement('tax-micro-net');
const realNetDisplay = createMockElement('tax-real-net');

const verdictBox = createMockElement('tax-verdict-box');
const verdictTitle = createMockElement('tax-verdict-title');
const verdictDesc = createMockElement('tax-verdict-desc');

// Mock Document and Window
global.document = {
    addEventListener: (event, cb) => {
        eventListeners[event] = eventListeners[event] || [];
        eventListeners[event].push(cb);
    },
    getElementById: (id) => {
        if (mockElements[id]) return mockElements[id];
        return null;
    }
};

global.window = {
    location: { href: '' },
    dataLayer: []
};

// 4. Run the simulator code in our mock DOM
try {
    const runCalculator = new Function(scriptCode);
    runCalculator();

    // Trigger DOMContentLoaded to initialize calculations
    if (eventListeners['DOMContentLoaded']) {
        eventListeners['DOMContentLoaded'].forEach(cb => cb());
    }

    console.log('🧪 Starting Automated E2E Mock DOM Tests for B2B Tax Simulator...\n');

    // TEST 1: Default state check (Rent = 12,000, Expenses = 2,500)
    console.log('Test 1: Verifying default state (12,000€ rent, 2,500€ expenses)...');
    
    if (microAbatementDisplay.innerHTML.replace(/\s/g, '') !== '3600€(30%forfait)') {
        throw new Error(`Abatement should be '3 600 € (30% forfait)', got '${microAbatementDisplay.innerHTML}'`);
    }
    if (realDeductionDisplay.innerHTML.replace(/\s/g, '') !== '2500€(chargesréelles)') {
        throw new Error(`Real deduction should be '2 500 € (charges réelles)', got '${realDeductionDisplay.innerHTML}'`);
    }
    if (microNetDisplay.innerHTML.replace(/\s/g, '') !== '8400€') {
        throw new Error(`Micro net should be 8 400 €, got ${microNetDisplay.innerHTML}`);
    }
    if (realNetDisplay.innerHTML.replace(/\s/g, '') !== '9500€') {
        throw new Error(`Real net should be 9 500 €, got ${realNetDisplay.innerHTML}`);
    }
    if (!verdictTitle.innerHTML.includes('Régime Micro-Foncier')) {
        throw new Error(`Verdict title should recommend Micro-Foncier, got ${verdictTitle.innerHTML}`);
    }
    console.log('✅ Test 1 Passed.');

    // TEST 2: High expenses arbitrage (Rent = 12,000, Expenses = 5,000)
    console.log('\nTest 2: Setting expenses to 5,000€ (optimizes under Régime Réel)...');
    expenseInput.value = '5000';
    global.runTaxCalculation(); // Call the trigger directly

    if (realNetDisplay.innerHTML.replace(/\s/g, '') !== '7000€') {
        throw new Error(`Real net should be 7 000 € (12000 - 5000), got ${realNetDisplay.innerHTML}`);
    }
    if (!verdictTitle.innerHTML.includes('Régime Réel')) {
        throw new Error(`Verdict title should recommend Régime Réel, got ${verdictTitle.innerHTML}`);
    }
    console.log('✅ Test 2 Passed.');

    // TEST 3: Ceiling limit exceeded (Rent = 18,000, Expenses = 2,500)
    console.log('\nTest 3: Exceeding micro-foncier threshold (18,000€ rent)...');
    rentInput.value = '18000';
    global.runTaxCalculation();

    if (!verdictTitle.innerHTML.includes('Passage Obligatoire au Régime Réel')) {
        throw new Error(`Verdict title should show mandatory Régime Réel warning, got ${verdictTitle.innerHTML}`);
    }
    console.log('✅ Test 3 Passed.');

    console.log('\n🎉 ALL B2B TAX SIMULATOR E2E TESTS PASSED! Mathematics and UI states are correct.');
    process.exit(0);

} catch (err) {
    console.error('\n❌ TEST SUITE FAILED:');
    console.error(err.stack || err.message);
    process.exit(1);
}
