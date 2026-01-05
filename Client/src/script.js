// ===== State Management =====
const state = {
    botRunning: false,
    meetJoined: false,
    vcJoined: false,
    meetLink: '',
    discordVC: '',
};

// ===== DOM Elements =====
const elements = {
    meetLink: document.getElementById('meetLink'),
    discordVC: document.getElementById('discordVC'),
    joinMeetBtn: document.getElementById('joinMeetBtn'),
    joinVCBtn: document.getElementById('joinVCBtn'),
    startBtn: document.getElementById('startBtn'),
    stopBtn: document.getElementById('stopBtn'),
    restartBtn: document.getElementById('restartBtn'),
    disconnectBtn: document.getElementById('disconnectBtn'),
    ttsMessage: document.getElementById('ttsMessage'),
    sendTTSBtn: document.getElementById('sendTTSBtn'),
    logsContainer: document.getElementById('logsContainer'),
    clearLogsBtn: document.getElementById('clearLogsBtn'),
    statusDot: document.querySelector('.status-dot'),
    statusText: document.querySelector('.status-text'),
};

// ===== Logging System =====
function addLog(message, type = 'info') {
    const time = new Date().toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        // second: '2-digit',
    });

    const date = new Date().toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
    });

    const levelLabel = {
        'success': 'SUCCESS',
        'error': 'ERROR',
        'info': 'INFO',
        'warning': 'WARN'
    }[type] || 'LOG';

    const logEntry = document.createElement('div');
    logEntry.className = `log-entry log-${type}`;
    logEntry.innerHTML = `
        <span class="log-level">${levelLabel}</span>
        <span class="log-timestamp"> ${time}</span>
        <span class="log-message">${escapeHtml(message)}</span>
    `;

    elements.logsContainer.appendChild(logEntry);
    elements.logsContainer.scrollTop = elements.logsContainer.scrollHeight;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== Bot Control Functions =====
function joinMeet() {
    const link = elements.meetLink.value.trim();

    if (!link) {
        addLog('Error: Please enter a Google Meet link', 'error');
        return;
    }

    if (!isValidUrl(link)) {
        addLog('Error: Invalid URL format', 'error');
        return;
    }

    state.meetLink = link;
    state.meetJoined = true;
    addLog(`Bot is joining Google Meet`, 'info');
    
    setTimeout(() => {
        addLog('Successfully joined Google Meet', 'success');
        updateUIState();
    }, 1500);
}

function joinVC() {
    const vc = elements.discordVC.value.trim();

    if (!vc) {
        addLog('Error: Please enter a Discord channel ID or URL', 'error');
        return;
    }

    state.discordVC = vc;
    state.vcJoined = true;
    addLog(`Bot is connecting to Discord Voice Channel: ${vc}`, 'info');
    
    setTimeout(() => {
        addLog('✓ Successfully joined Discord Voice Channel', 'success');
        updateUIState();
    }, 1500);
}

function startBot() {
    if (!state.meetJoined || !state.vcJoined) {
        addLog('Error: Please configure both Google Meet and Discord VC before starting', 'error');
        return;
    }

    if (state.botRunning) {
        addLog('Warning: Bot is already running', 'warning');
        return;
    }

    state.botRunning = true;
    addLog('Bot is starting...', 'info');
    
    setTimeout(() => {
        addLog('Bot started successfully. Ready to process TTS commands.', 'success');
        updateUIState();
        updateStatusIndicator();
    }, 1000);
}

function stopBot() {
    if (!state.botRunning) {
        addLog('Warning: Bot is not running', 'warning');
        return;
    }

    state.botRunning = false;
    addLog('Bot is stopping...', 'info');
    
    setTimeout(() => {
        addLog('Bot stopped successfully', 'success');
        updateUIState();
        updateStatusIndicator();
    }, 800);
}

function restartBot() {
    if (!state.botRunning) {
        addLog('Warning: Bot is not running. Starting instead...', 'warning');
        startBot();
        return;
    }

    addLog('Bot is restarting...', 'info');
    state.botRunning = false;
    
    setTimeout(() => {
        state.botRunning = true;
        addLog('✓ Bot restarted successfully', 'success');
        updateUIState();
        updateStatusIndicator();
    }, 1200);
}

function disconnectAll() {
    if (!state.meetJoined && !state.vcJoined && !state.botRunning) {
        addLog('Warning: Nothing to disconnect', 'warning');
        return;
    }

    addLog('Disconnecting from all services...', 'info');
    
    setTimeout(() => {
        state.botRunning = false;
        state.meetJoined = false;
        state.vcJoined = false;
        state.meetLink = '';
        state.discordVC = '';
        
        elements.meetLink.value = '';
        elements.discordVC.value = '';
        
        addLog('Successfully disconnected from all services', 'success');
        updateUIState();
        updateStatusIndicator();
    }, 1000);
}

function sendTTSCommand() {
    const message = elements.ttsMessage.value.trim();

    if (!message) {
        addLog('Error: Please enter a message', 'error');
        return;
    }

    if (!state.botRunning) {
        addLog('Error: Bot is not running. Start the bot first.', 'error');
        return;
    }

    addLog(`TTS Command sent: "${message}"`, 'info');
    elements.ttsMessage.value = '';
    
    setTimeout(() => {
        addLog(`TTS message processed and sent to voice channel`, 'success');
    }, 800);
}

// ===== Utility Functions =====
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

function updateUIState() {
    // Update button states based on current state
    elements.joinMeetBtn.disabled = !elements.meetLink.value.trim();
    elements.joinVCBtn.disabled = !elements.discordVC.value.trim();
    elements.startBtn.disabled = !state.meetJoined || !state.vcJoined || state.botRunning;
    elements.stopBtn.disabled = !state.botRunning;
    elements.restartBtn.disabled = !state.botRunning;
    elements.disconnectBtn.disabled = !state.meetJoined && !state.vcJoined && !state.botRunning;
    elements.sendTTSBtn.disabled = !state.botRunning;
}

function updateStatusIndicator() {
    if (state.botRunning) {
        elements.statusDot.classList.add('active');
        elements.statusText.textContent = 'Active';
    } else {
        elements.statusDot.classList.remove('active');
        elements.statusText.textContent = 'Disconnected';
    }
}

// ===== Event Listeners =====
elements.joinMeetBtn.addEventListener('click', joinMeet);
elements.joinVCBtn.addEventListener('click', joinVC);
elements.startBtn.addEventListener('click', startBot);
elements.stopBtn.addEventListener('click', stopBot);
elements.restartBtn.addEventListener('click', restartBot);
elements.disconnectBtn.addEventListener('click', disconnectAll);
elements.sendTTSBtn.addEventListener('click', sendTTSCommand);
elements.clearLogsBtn.addEventListener('click', () => {
    elements.logsContainer.innerHTML = '<div class="log-entry log-info"><span class="log-time">[' + new Date().toLocaleTimeString('en-US', {hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit'}) + ']</span><span class="log-message">Logs cleared</span></div>';
    addLog('Logs have been cleared', 'info');
});

// Allow Enter key to send TTS command
elements.ttsMessage.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendTTSCommand();
    }
});

// Input validation
elements.meetLink.addEventListener('input', updateUIState);
elements.discordVC.addEventListener('input', updateUIState);
elements.ttsMessage.addEventListener('input', () => {
    elements.sendTTSBtn.disabled = !elements.ttsMessage.value.trim() || !state.botRunning;
});

// Initialize UI state
updateUIState();
