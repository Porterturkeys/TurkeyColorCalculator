let soundEnabled = true; // Initialize sound state
const soundToggle = document.getElementById('soundToggle');
const volumeSlider = document.getElementById('volumeSlider');

// Function to synchronize button text and slider state
function updateSoundButton() {
    const volume = parseFloat(volumeSlider.value);
    soundEnabled = volume > 0; // Update mute state based on slider value
    soundToggle.textContent = soundEnabled ? 'Mute Sounds' : 'Enable Sounds';
}

// Toggle mute state when button is clicked
soundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled; // Toggle mute state
    volumeSlider.value = soundEnabled ? 1 : 0; // Update slider
    updateSoundButton(); // Update button text
    applyVolumeToAllSounds();
});

// Update button and apply volume when slider is adjusted
volumeSlider.addEventListener('input', () => {
    updateSoundButton();
    applyVolumeToAllSounds();
    localStorage.setItem('soundVolume', volumeSlider.value); // Save volume to localStorage
});

// Function to set the volume of all audio elements
function applyVolumeToAllSounds() {
    const volume = parseFloat(volumeSlider.value);
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
        audio.volume = volume; // Set volume globally
    });
}

// Play sound function (maintains your existing logic)
function playSound(soundId) {
    if (!soundEnabled) return; // Skip playback if muted
    const sound = document.getElementById(soundId);
    if (sound) {
        sound.volume = parseFloat(volumeSlider.value);
        sound.currentTime = 0;
        sound.play().catch(error => console.log('Sound play error:', error));
    }
}

// Restore saved volume on page load
window.addEventListener('DOMContentLoaded', function () {
    const savedVolume = localStorage.getItem('soundVolume');
    if (savedVolume !== null) {
        volumeSlider.value = savedVolume;
        updateSoundButton();
        applyVolumeToAllSounds();
    }
});

// Play sounds for specific events
document.querySelector('button[onclick="calculateOffspring()"]').addEventListener('click', () => playSound('calSound'));
document.querySelector('button[onclick="resetCalculator()"]').addEventListener('click', () => playSound('resetSound'));
document.getElementById('returnToTop').addEventListener('click', () => playSound('returntopSound'));

// Add click sound to allele selection dropdowns
function addClickSoundToAlleles() {
    const alleleSelects = document.querySelectorAll('.genotype-selection select');
    alleleSelects.forEach(select => {
        select.addEventListener('change', () => playSound('alleleClickSound'));
    });
}
document.addEventListener('DOMContentLoaded', addClickSoundToAlleles);


function playSound(soundId) {
    const sound = document.getElementById(soundId);
    if (sound) {
        sound.currentTime = 0; // Reset to start for replayability
        sound.play().catch(error => console.log('Sound play error:', error)); // Log errors (e.g., browser restrictions)
    }
}

// Add sound to the "Calculate Offspring" button
document.querySelector('button[onclick="calculateOffspring()"]').addEventListener('click', () => {
    playSound('clickSound');
});
