// RTL Design Engineer Tools
document.addEventListener('DOMContentLoaded', function() {
    initializeTools();
});

function initializeTools() {
    // Initialize Number Converter
    initializeNumberConverter();
    
    // Initialize Frequency/Period Converter
    initializeFrequencyConverter();
    
    // Initialize Clock Domain Crossing Calculator
    initializeClockDomainCalculator();
    
    // Initialize Wire Length Calculator
    initializeWireLengthCalculator();
    
    // Initialize Power Calculator
    initializePowerCalculator();
    
    // Initialize Timing Calculator
    initializeTimingCalculator();
}

// Number Converter Tool
function initializeNumberConverter() {
    const binaryInput = document.getElementById('binary');
    const decimalInput = document.getElementById('decimal');
    const hexInput = document.getElementById('hexadecimal');
    
    let updating = false;
    
    binaryInput.addEventListener('input', function() {
        if (updating) return;
        updating = true;
        
        const value = this.value.trim();
        if (value && /^[01]+$/.test(value)) {
            const decimal = parseInt(value, 2);
            const hex = decimal.toString(16).toUpperCase();
            
            decimalInput.value = decimal;
            hexInput.value = hex;
            
            validateInput(this, true);
        } else if (value) {
            validateInput(this, false);
        } else {
            clearInputs();
            validateInput(this, null);
        }
        updating = false;
    });
    
    decimalInput.addEventListener('input', function() {
        if (updating) return;
        updating = true;
        
        const value = this.value.trim();
        if (value && /^\d+$/.test(value)) {
            const decimal = parseInt(value);
            const binary = decimal.toString(2);
            const hex = decimal.toString(16).toUpperCase();
            
            binaryInput.value = binary;
            hexInput.value = hex;
            
            validateInput(this, true);
        } else if (value) {
            validateInput(this, false);
        } else {
            clearInputs();
            validateInput(this, null);
        }
        updating = false;
    });
    
    hexInput.addEventListener('input', function() {
        if (updating) return;
        updating = true;
        
        const value = this.value.trim();
        if (value && /^[0-9A-Fa-f]+$/.test(value)) {
            const decimal = parseInt(value, 16);
            const binary = decimal.toString(2);
            
            binaryInput.value = binary;
            decimalInput.value = decimal;
            
            validateInput(this, true);
        } else if (value) {
            validateInput(this, false);
        } else {
            clearInputs();
            validateInput(this, null);
        }
        updating = false;
    });
    
    function clearInputs() {
        binaryInput.value = '';
        decimalInput.value = '';
        hexInput.value = '';
    }
    
    function validateInput(input, isValid) {
        input.classList.remove('error', 'success');
        if (isValid === true) {
            input.classList.add('success');
        } else if (isValid === false) {
            input.classList.add('error');
        }
    }
}

// Frequency/Period Converter Tool
function initializeFrequencyConverter() {
    const frequencyInput = document.getElementById('frequency');
    const periodInput = document.getElementById('period');
    const freqUnitSelect = document.getElementById('freqUnit');
    const periodUnitSelect = document.getElementById('periodUnit');
    
    let updating = false;
    
    function convertFrequencyToPeriod() {
        if (updating) return;
        updating = true;
        
        const freq = parseFloat(frequencyInput.value);
        const freqUnit = freqUnitSelect.value;
        
        if (freq && freq > 0) {
            // Convert frequency to base Hz
            let freqHz = freq;
            switch(freqUnit) {
                case 'kHz': freqHz = freq * 1000; break;
                case 'MHz': freqHz = freq * 1000000; break;
                case 'GHz': freqHz = freq * 1000000000; break;
            }
            
            const periodSeconds = 1 / freqHz;
            
            // Convert to appropriate period unit
            let periodValue, periodUnit;
            if (periodSeconds >= 1) {
                periodValue = periodSeconds;
                periodUnit = 's';
            } else if (periodSeconds >= 0.001) {
                periodValue = periodSeconds * 1000;
                periodUnit = 'ms';
            } else if (periodSeconds >= 0.000001) {
                periodValue = periodSeconds * 1000000;
                periodUnit = 'μs';
            } else if (periodSeconds >= 0.000000001) {
                periodValue = periodSeconds * 1000000000;
                periodUnit = 'ns';
            } else {
                periodValue = periodSeconds * 1000000000000;
                periodUnit = 'ps';
            }
            
            periodInput.value = periodValue.toFixed(6);
            periodUnitSelect.value = periodUnit;
        }
        updating = false;
    }
    
    function convertPeriodToFrequency() {
        if (updating) return;
        updating = true;
        
        const period = parseFloat(periodInput.value);
        const periodUnit = periodUnitSelect.value;
        
        if (period && period > 0) {
            // Convert period to base seconds
            let periodSeconds = period;
            switch(periodUnit) {
                case 'ms': periodSeconds = period / 1000; break;
                case 'μs': periodSeconds = period / 1000000; break;
                case 'ns': periodSeconds = period / 1000000000; break;
                case 'ps': periodSeconds = period / 1000000000000; break;
            }
            
            const freqHz = 1 / periodSeconds;
            
            // Convert to appropriate frequency unit
            let freqValue, freqUnit;
            if (freqHz >= 1000000000) {
                freqValue = freqHz / 1000000000;
                freqUnit = 'GHz';
            } else if (freqHz >= 1000000) {
                freqValue = freqHz / 1000000;
                freqUnit = 'MHz';
            } else if (freqHz >= 1000) {
                freqValue = freqHz / 1000;
                freqUnit = 'kHz';
            } else {
                freqValue = freqHz;
                freqUnit = 'Hz';
            }
            
            frequencyInput.value = freqValue.toFixed(6);
            freqUnitSelect.value = freqUnit;
        }
        updating = false;
    }
    
    frequencyInput.addEventListener('input', convertFrequencyToPeriod);
    freqUnitSelect.addEventListener('change', convertFrequencyToPeriod);
    periodInput.addEventListener('input', convertPeriodToFrequency);
    periodUnitSelect.addEventListener('change', convertPeriodToFrequency);
}

// Clock Domain Crossing Calculator
function initializeClockDomainCalculator() {
    const sourceClockInput = document.getElementById('sourceClock');
    const destClockInput = document.getElementById('destClock');
    const fifoDepthResult = document.getElementById('fifoDepth');
    
    function calculateFIFODepth() {
        const sourceFreq = parseFloat(sourceClockInput.value);
        const destFreq = parseFloat(destClockInput.value);
        
        if (sourceFreq && destFreq && sourceFreq > 0 && destFreq > 0) {
            // Simple FIFO depth calculation
            // This is a basic formula - real designs may need more complex calculations
            const ratio = Math.max(sourceFreq / destFreq, destFreq / sourceFreq);
            const depth = Math.ceil(ratio * 2) + 2; // Add some margin
            
            fifoDepthResult.textContent = depth.toString();
        } else {
            fifoDepthResult.textContent = '-';
        }
    }
    
    sourceClockInput.addEventListener('input', calculateFIFODepth);
    destClockInput.addEventListener('input', calculateFIFODepth);
}

// Wire Length Calculator
function initializeWireLengthCalculator() {
    const wireDelayInput = document.getElementById('wireDelay');
    const wireCapacitanceInput = document.getElementById('wireCapacitance');
    const wireLengthResult = document.getElementById('wireLength');
    
    function calculateWireLength() {
        const delay = parseFloat(wireDelayInput.value);
        const capacitance = parseFloat(wireCapacitanceInput.value);
        
        if (delay && capacitance && delay > 0 && capacitance > 0) {
            // Simple wire length estimation based on delay and capacitance
            // This is a simplified model - real designs need more complex calculations
            const length = (delay / capacitance) * 0.1; // Rough estimation factor
            
            wireLengthResult.textContent = length.toFixed(2);
    } else {
            wireLengthResult.textContent = '-';
        }
    }
    
    wireDelayInput.addEventListener('input', calculateWireLength);
    wireCapacitanceInput.addEventListener('input', calculateWireLength);
}

// Power Calculator
function initializePowerCalculator() {
    const voltageInput = document.getElementById('voltage');
    const currentInput = document.getElementById('current');
    const powerResult = document.getElementById('power');
    
    function calculatePower() {
        const voltage = parseFloat(voltageInput.value);
        const current = parseFloat(currentInput.value);
        
        if (voltage && current) {
            const power = voltage * current; // Power in mW
            powerResult.textContent = power.toFixed(2);
        } else {
            powerResult.textContent = '-';
        }
    }
    
    voltageInput.addEventListener('input', calculatePower);
    currentInput.addEventListener('input', calculatePower);
}

// Timing Calculator
function initializeTimingCalculator() {
    const clockPeriodInput = document.getElementById('clockPeriod');
    const comboDelayInput = document.getElementById('comboDelay');
    const maxSetupTimeResult = document.getElementById('maxSetupTime');
    
    function calculateSetupTime() {
        const clockPeriod = parseFloat(clockPeriodInput.value);
        const comboDelay = parseFloat(comboDelayInput.value);
        
        if (clockPeriod && comboDelay && clockPeriod > 0 && comboDelay > 0) {
            // Basic setup time calculation
            // Max setup time = Clock period - Combinational delay - Clock-to-Q delay (assumed 0.5ns)
            const clockToQ = 0.5; // Assumed value
            const maxSetup = clockPeriod - comboDelay - clockToQ;
            
            if (maxSetup > 0) {
                maxSetupTimeResult.textContent = maxSetup.toFixed(2);
            } else {
                maxSetupTimeResult.textContent = 'Timing Violation!';
                maxSetupTimeResult.style.color = '#F44336';
            }
        } else {
            maxSetupTimeResult.textContent = '-';
            maxSetupTimeResult.style.color = '#1565C0';
        }
    }
    
    clockPeriodInput.addEventListener('input', calculateSetupTime);
    comboDelayInput.addEventListener('input', calculateSetupTime);
}

// Add some utility functions
function formatNumber(num, decimals = 2) {
    if (num === 0) return '0';
    if (num < 0.01) return num.toExponential(decimals);
    return num.toFixed(decimals);
}

function convertUnit(value, fromUnit, toUnit) {
    const units = {
        'Hz': 1,
        'kHz': 1000,
        'MHz': 1000000,
        'GHz': 1000000000,
        's': 1,
        'ms': 0.001,
        'μs': 0.000001,
        'ns': 0.000000001,
        'ps': 0.000000000001
    };
    
    const baseValue = value * units[fromUnit];
    return baseValue / units[toUnit];
}
