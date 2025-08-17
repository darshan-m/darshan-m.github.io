// RTL Design Engineer Tools for ARM Cortex CPU Subsystems
document.addEventListener('DOMContentLoaded', function() {
    initializeTools();
});

function initializeTools() {
    // Initialize Number Converter
    initializeNumberConverter();
    
    // Initialize Frequency/Period Converter
    initializeFrequencyConverter();
    
    // Initialize ARM Cortex Clock Domain Calculator
    initializeCortexClockDomainCalculator();
    
    // Initialize AXI Burst Calculator
    initializeAXIBurstCalculator();
    
    // Initialize Bit Field Visualizer
    initializeBitFieldVisualizer();
    
    // Initialize Gray Code Converter
    initializeGrayCodeConverter();
    
    // Initialize Parity Calculator
    initializeParityCalculator();
    
    // Initialize Bus Width Calculator
    initializeBusWidthCalculator();
    
    // Initialize SRAM/ROM Size Calculator
    initializeMemorySizeCalculator();
    
    // Initialize ARM Cortex Cache Calculator
    initializeCortexCacheCalculator();
    
    // Initialize Interrupt Vector Calculator
    initializeInterruptVectorCalculator();
    
    // Initialize DMA Transfer Calculator
    initializeDMATransferCalculator();
    
    // Initialize Power Domain Calculator
    initializePowerDomainCalculator();
    
    // Initialize Memory Map Calculator
    initializeMemoryMapCalculator();
    
    // Initialize Clock Divider Calculator
    initializeClockDividerCalculator();
    
    // Initialize Register Field Calculator
    initializeRegisterFieldCalculator();
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

// ARM Cortex Clock Domain Calculator
function initializeCortexClockDomainCalculator() {
    const cpuFreqInput = document.getElementById('cpuFreq');
    const busFreqInput = document.getElementById('busFreq');
    const fifoDepthResult = document.getElementById('cortexFifoDepth');
    
    function calculateCortexFIFODepth() {
        const cpuFreq = parseFloat(cpuFreqInput.value); // MHz
        const busFreq = parseFloat(busFreqInput.value); // MHz
        
        if (cpuFreq > 0 && busFreq > 0) {
            // ARM Cortex specific FIFO depth calculation
            const ratio = Math.max(cpuFreq / busFreq, busFreq / cpuFreq);
            const depth = Math.ceil(ratio * 4) + 8; // ARM Cortex specific margin
            
            fifoDepthResult.textContent = depth.toString();
        } else {
            fifoDepthResult.textContent = '-';
        }
    }
    
    cpuFreqInput.addEventListener('input', calculateCortexFIFODepth);
    busFreqInput.addEventListener('input', calculateCortexFIFODepth);
}

// AXI Burst Calculator
function initializeAXIBurstCalculator() {
    const burstLengthInput = document.getElementById('burstLength');
    const dataWidthInput = document.getElementById('dataWidth');
    const totalBytesResult = document.getElementById('totalBytes');
    
    function calculateTotalBytes() {
        const burstLength = parseInt(burstLengthInput.value);
        const dataWidth = parseInt(dataWidthInput.value);
        
        if (burstLength > 0 && dataWidth > 0) {
            const totalBytes = (burstLength * dataWidth) / 8;
            totalBytesResult.textContent = totalBytes.toString();
        } else {
            totalBytesResult.textContent = '-';
        }
    }
    
    burstLengthInput.addEventListener('input', calculateTotalBytes);
    dataWidthInput.addEventListener('input', calculateTotalBytes);
}

// Bit Field Visualizer
function initializeBitFieldVisualizer() {
    const valueInput = document.getElementById('bitFieldValue');
    const widthInput = document.getElementById('bitFieldWidth');
    const patternResult = document.getElementById('bitFieldPattern');
    
    function updatePattern() {
        let valueStr = valueInput.value.trim();
        let width = parseInt(widthInput.value);
        
        if (!width || width < 1 || width > 64) {
            patternResult.textContent = '-';
            return;
        }
        
        let value = null;
        if (/^0b[01]+$/i.test(valueStr)) {
            value = parseInt(valueStr.slice(2), 2);
        } else if (/^0x[0-9a-f]+$/i.test(valueStr)) {
            value = parseInt(valueStr, 16);
        } else if (/^[01]+$/.test(valueStr)) {
            value = parseInt(valueStr, 2);
        } else if (/^\d+$/.test(valueStr)) {
            value = parseInt(valueStr, 10);
        }
        
        if (value === null || isNaN(value)) {
            patternResult.textContent = '-';
            return;
        }
        
        let bits = value.toString(2).padStart(width, '0').slice(-width);
        patternResult.innerHTML = bits.split('').map(b => 
            `<span style='color:${b==='1'?'#1976D2':'#888'};font-weight:bold;'>${b}</span>`
        ).join(' ');
    }
    
    valueInput.addEventListener('input', updatePattern);
    widthInput.addEventListener('input', updatePattern);
}

// Gray Code Converter
function initializeGrayCodeConverter() {
    const binInput = document.getElementById('grayBinary');
    const grayInput = document.getElementById('grayGray');
    let updating = false;
    
    binInput.addEventListener('input', function() {
        if (updating) return;
        updating = true;
        
        const val = binInput.value.trim();
        if (/^[01]+$/.test(val)) {
            let n = parseInt(val, 2);
            let gray = n ^ (n >> 1);
            grayInput.value = gray.toString(2).padStart(val.length, '0');
        } else if (!val) {
            grayInput.value = '';
        }
        updating = false;
    });
    
    grayInput.addEventListener('input', function() {
        if (updating) return;
        updating = true;
        
        const val = grayInput.value.trim();
        if (/^[01]+$/.test(val)) {
            let gray = parseInt(val, 2);
            let bin = gray;
            for (let shift = 1; shift < val.length; shift++) {
                bin ^= (gray >> shift);
            }
            binInput.value = bin.toString(2).padStart(val.length, '0');
        } else if (!val) {
            binInput.value = '';
        }
        updating = false;
    });
}

// Parity Calculator
function initializeParityCalculator() {
    const input = document.getElementById('parityInput');
    const evenResult = document.getElementById('evenParity');
    const oddResult = document.getElementById('oddParity');
    
    input.addEventListener('input', function() {
        const val = input.value.trim();
        if (/^[01]+$/.test(val)) {
            const ones = val.split('').filter(b => b === '1').length;
            evenResult.textContent = (ones % 2 === 0) ? '0' : '1';
            oddResult.textContent = (ones % 2 === 1) ? '0' : '1';
        } else {
            evenResult.textContent = '-';
            oddResult.textContent = '-';
        }
    });
}

// Bus Width Calculator
function initializeBusWidthCalculator() {
    const dataRateInput = document.getElementById('busDataRate');
    const freqInput = document.getElementById('busFreq');
    const widthResult = document.getElementById('busWidth');
    
    function updateBusWidth() {
        const dataRate = parseFloat(dataRateInput.value); // Mbps
        const freq = parseFloat(freqInput.value); // MHz
        
        if (dataRate > 0 && freq > 0) {
            const width = Math.ceil((dataRate * 1e6) / (freq * 1e6));
            widthResult.textContent = width;
        } else {
            widthResult.textContent = '-';
        }
    }
    
    dataRateInput.addEventListener('input', updateBusWidth);
    freqInput.addEventListener('input', updateBusWidth);
}

// SRAM/ROM Size Calculator
function initializeMemorySizeCalculator() {
    const addrInput = document.getElementById('memAddrWidth');
    const dataInput = document.getElementById('memDataWidth');
    const bitsResult = document.getElementById('memSizeBits');
    const bytesResult = document.getElementById('memSizeBytes');
    
    function updateMemSize() {
        const addr = parseInt(addrInput.value);
        const data = parseInt(dataInput.value);
        
        if (addr > 0 && data > 0) {
            const totalBits = Math.pow(2, addr) * data;
            const totalBytes = totalBits / 8;
            bitsResult.textContent = totalBits.toLocaleString();
            bytesResult.textContent = totalBytes.toLocaleString();
        } else {
            bitsResult.textContent = '-';
            bytesResult.textContent = '-';
        }
    }
    
    addrInput.addEventListener('input', updateMemSize);
    dataInput.addEventListener('input', updateMemSize);
}

// ARM Cortex Cache Calculator
function initializeCortexCacheCalculator() {
    const cacheSizeInput = document.getElementById('cacheSize');
    const lineSizeInput = document.getElementById('lineSize');
    const cacheLinesResult = document.getElementById('cacheLines');
    
    function calculateCacheLines() {
        const cacheSize = parseFloat(cacheSizeInput.value); // KB
        const lineSize = parseFloat(lineSizeInput.value); // bytes
        
        if (cacheSize > 0 && lineSize > 0) {
            const totalBytes = cacheSize * 1024;
            const lines = totalBytes / lineSize;
            cacheLinesResult.textContent = lines.toLocaleString();
        } else {
            cacheLinesResult.textContent = '-';
        }
    }
    
    cacheSizeInput.addEventListener('input', calculateCacheLines);
    lineSizeInput.addEventListener('input', calculateCacheLines);
}

// Interrupt Vector Calculator
function initializeInterruptVectorCalculator() {
    const baseAddrInput = document.getElementById('baseAddr');
    const vectorOffsetInput = document.getElementById('vectorOffset');
    const vectorAddressResult = document.getElementById('vectorAddress');
    
    function calculateVectorAddress() {
        const baseAddrStr = baseAddrInput.value.trim();
        const vectorOffset = parseInt(vectorOffsetInput.value);
        
        if (baseAddrStr && /^0x[0-9a-fA-F]+$/.test(baseAddrStr) && !isNaN(vectorOffset)) {
            const baseAddr = parseInt(baseAddrStr, 16);
            const vectorAddr = baseAddr + (vectorOffset * 4); // ARM vectors are 4 bytes apart
            vectorAddressResult.textContent = '0x' + vectorAddr.toString(16).toUpperCase();
        } else {
            vectorAddressResult.textContent = '-';
        }
    }
    
    baseAddrInput.addEventListener('input', calculateVectorAddress);
    vectorOffsetInput.addEventListener('input', calculateVectorAddress);
}

// DMA Transfer Calculator
function initializeDMATransferCalculator() {
    const dmaFreqInput = document.getElementById('dmaFreq');
    const transferSizeInput = document.getElementById('transferSize');
    const transferTimeResult = document.getElementById('transferTime');
    
    function calculateTransferTime() {
        const dmaFreq = parseFloat(dmaFreqInput.value); // MHz
        const transferSize = parseFloat(transferSizeInput.value); // bytes
        
        if (dmaFreq > 0 && transferSize > 0) {
            const cyclesPerByte = 1; // Assuming 1 cycle per byte transfer
            const totalCycles = transferSize * cyclesPerByte;
            const transferTime = (totalCycles / dmaFreq) * 1000; // Convert to μs
            transferTimeResult.textContent = transferTime.toFixed(2);
        } else {
            transferTimeResult.textContent = '-';
        }
    }
    
    dmaFreqInput.addEventListener('input', calculateTransferTime);
    transferSizeInput.addEventListener('input', calculateTransferTime);
}

// Power Domain Calculator
function initializePowerDomainCalculator() {
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

// Memory Map Calculator
function initializeMemoryMapCalculator() {
    const startAddrInput = document.getElementById('startAddr');
    const sizeBytesInput = document.getElementById('sizeBytes');
    const endAddressResult = document.getElementById('endAddress');
    
    function calculateEndAddress() {
        const startAddrStr = startAddrInput.value.trim();
        const sizeBytes = parseInt(sizeBytesInput.value);
        
        if (startAddrStr && /^0x[0-9a-fA-F]+$/.test(startAddrStr) && sizeBytes > 0) {
            const startAddr = parseInt(startAddrStr, 16);
            const endAddr = startAddr + sizeBytes - 1; // -1 because start address is inclusive
            endAddressResult.textContent = '0x' + endAddr.toString(16).toUpperCase();
        } else {
            endAddressResult.textContent = '-';
        }
    }
    
    startAddrInput.addEventListener('input', calculateEndAddress);
    sizeBytesInput.addEventListener('input', calculateEndAddress);
}

// Clock Divider Calculator
function initializeClockDividerCalculator() {
    const inputFreqInput = document.getElementById('inputFreq');
    const dividerInput = document.getElementById('divider');
    const outputFreqResult = document.getElementById('outputFreq');
    
    function calculateOutputFreq() {
        const inputFreq = parseFloat(inputFreqInput.value); // MHz
        const divider = parseInt(dividerInput.value);
        
        if (inputFreq > 0 && divider > 0) {
            const outputFreq = inputFreq / divider;
            outputFreqResult.textContent = outputFreq.toFixed(2);
        } else {
            outputFreqResult.textContent = '-';
        }
    }
    
    inputFreqInput.addEventListener('input', calculateOutputFreq);
    dividerInput.addEventListener('input', calculateOutputFreq);
}

// Register Field Calculator
function initializeRegisterFieldCalculator() {
    const fieldStartInput = document.getElementById('fieldStart');
    const fieldWidthInput = document.getElementById('fieldWidth');
    const fieldMaskResult = document.getElementById('fieldMask');
    
    function calculateFieldMask() {
        const fieldStart = parseInt(fieldStartInput.value);
        const fieldWidth = parseInt(fieldWidthInput.value);
        
        if (fieldStart >= 0 && fieldWidth > 0 && fieldStart + fieldWidth <= 32) {
            const mask = ((1 << fieldWidth) - 1) << fieldStart;
            fieldMaskResult.textContent = '0x' + mask.toString(16).toUpperCase();
        } else {
            fieldMaskResult.textContent = '-';
        }
    }
    
    fieldStartInput.addEventListener('input', calculateFieldMask);
    fieldWidthInput.addEventListener('input', calculateFieldMask);
}

// Utility functions
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
