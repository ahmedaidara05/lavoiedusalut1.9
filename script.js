document.addEventListener('DOMContentLoaded', () => {
    // Sécurité
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('copy', e => e.preventDefault());
    document.addEventListener('cut', e => e.preventDefault());
    document.addEventListener('dragstart', e => e.preventDefault());
    document.addEventListener('keydown', e => {
        if (e.ctrlKey && (e.key === 'p' || e.key === 's' || e.key === 'c')) {
            e.preventDefault();
        }
    });

    // Variables globales
    let currentChapter = null;
    let currentLanguage = localStorage.getItem('language') || 'fr';
    let fontSize = parseInt(localStorage.getItem('fontSize')) || 16;
    let isDarkMode = localStorage.getItem('theme') === 'dark';
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    let lastPage = 'home';
    let isSpeaking = false;
    let currentSpeech = null;
    let autoScrollInterval = null;

    // Chargement du contenu
    fetch('content.json')
        .then(response => response.json())
        .then(data => {
            chapters = data.chapters;
            populateTOC();
            updateFavorites();
        });

    // Navigation
    window.navigateTo = function(page) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById(page).classList.add('active');
        lastPage = page === 'settings' ? lastPage : page;
        if (page.startsWith('chapter')) {
            currentChapter = page;
            loadChapter();
        }
    };

    window.navigateBack = function() {
        navigateTo(lastPage);
    };

    // Sommaire
    function populateTOC() {
        const chapterList = document.getElementById('chapter-list');
        chapters.forEach((chapter, index) => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="#" onclick="navigateTo('chapter${index + 1}')">${chapter.title[currentLanguage]}</a>`;
            chapterList.appendChild(li);
        });
    }

    // Lecture
    function loadChapter() {
        const chapterIndex = parseInt(currentChapter.replace('chapter', '')) - 1;
        const chapter = chapters[chapterIndex];
        document.getElementById('chapter-title').textContent = chapter.title[currentLanguage];
        document.getElementById('chapter-content').innerHTML = chapter.content[currentLanguage];
        document.getElementById('favorite-toggle').innerHTML = favorites.includes(currentChapter) ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
        updateFontSize();
        updateLanguage();
    }

    // Mode sombre
    const themeToggle = document.getElementById('theme-toggle');
    const settingsTheme = document.getElementById('settings-theme');
    if (isDarkMode) {
        document.body.classList.add('light');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        settingsTheme.checked = true;
    }
    themeToggle.addEventListener('click', toggleTheme);
    settingsTheme.addEventListener('change', toggleTheme);

    function toggleTheme() {
        isDarkMode = !isDarkMode;
        document.body.classList.toggle('light', isDarkMode);
        themeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        settingsTheme.checked = isDarkMode;
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }

    // Langue
    const languageSelect = document.getElementById('language-select');
    const settingsLanguage = document.getElementById('settings-language');
    languageSelect.value = currentLanguage;
    settingsLanguage.value = currentLanguage;
    languageSelect.addEventListener('change', () => {
        currentLanguage = languageSelect.value;
        settingsLanguage.value = currentLanguage;
        updateLanguage();
    });
    settingsLanguage.addEventListener('change', () => {
        currentLanguage = settingsLanguage.value;
        languageSelect.value = currentLanguage;
        updateLanguage();
    });

    function updateLanguage() {
        localStorage.setItem('language', currentLanguage);
        if (currentChapter) loadChapter();
        populateTOC();
        updateFavorites();
    }

    // Zoom
    const fontSizeInput = document.getElementById('font-size');
    const settingsFontSize = document.getElementById('settings-font-size');
    const fontSizeValue = document.getElementById('font-size-value');
    fontSizeInput.value = fontSize;
    settingsFontSize.value = fontSize;
    fontSizeValue.textContent = `${fontSize}px`;
    fontSizeInput.addEventListener('input', () => {
        fontSize = parseInt(fontSizeInput.value);
        settingsFontSize.value = fontSize;
        fontSizeValue.textContent = `${fontSize}px`;
        updateFontSize();
        localStorage.setItem('fontSize', fontSize);
    });
    settingsFontSize.addEventListener('input', () => {
        fontSize = parseInt(settingsFontSize.value);
        fontSizeInput.value = fontSize;
        fontSizeValue.textContent = `${fontSize}px`;
        updateFontSize();
        localStorage.setItem('fontSize', fontSize);
    });

    function updateFontSize() {
        document.getElementById('chapter-content').style.fontSize = `${fontSize}px`;
    }

    // Lecture vocale
    const voiceSelect = document.getElementById('voice-select');
    const voiceToggle = document.getElementById('voice-toggle');
    let voices = [];
    function populateVoices() {
        voices = speechSynthesis.getVoices();
        voiceSelect.innerHTML = '';
        const availableVoices = voices.filter(v => ['fr-FR', 'en-US', 'ar-SA'].includes(v.lang)).slice(0, 4);
        availableVoices.forEach((voice, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `${voice.name} (${voice.lang})`;
            voiceSelect.appendChild(option);
        });
    }
    speechSynthesis.onvoiceschanged = populateVoices;
    populateVoices();

    voiceToggle.addEventListener('click', () => {
        if (isSpeaking) {
            speechSynthesis.cancel();
            isSpeaking = false;
            voiceToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
        } else {
            const text = document.getElementById('chapter-content').textContent;
            currentSpeech = new SpeechSynthesisUtterance(text);
            currentSpeech.voice = voices[parseInt(voiceSelect.value)];
            currentSpeech.lang = currentLanguage;
            speechSynthesis.speak(currentSpeech);
            isSpeaking = true;
            voiceToggle.innerHTML = '<i class="fas fa-pause"></i>';
        }
    });

    // Défilement automatique
    const autoScroll = document.getElementById('auto-scroll');
    autoScroll.addEventListener('click', () => {
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
            autoScrollInterval = null;
            autoScroll.innerHTML = '<i class="fas fa-arrows-alt-v"></i>';
        } else {
            let direction = 1;
            autoScrollInterval = setInterval(() => {
                window.scrollBy(0, direction * 2);
                if (window.scrollY >= document.body.scrollHeight - window.innerHeight || window.scrollY <= 0) {
                    direction *= -1;
                }
            }, 50);
            autoScroll.innerHTML = '<i class="fas fa-pause"></i>';
        }
    });

    // Favoris
    const favoriteToggle = document.getElementById('favorite-toggle');
    favoriteToggle.addEventListener('click', () => {
        if (favorites.includes(currentChapter)) {
            favorites = favorites.filter(f => f !== currentChapter);
            favoriteToggle.innerHTML = '<i class="far fa-heart"></i>';
        } else {
            favorites.push(currentChapter);
            favoriteToggle.innerHTML = '<i class="fas fa-heart"></i>';
        }
        localStorage.setItem('favorites', JSON.stringify(favorites));
        updateFavorites();
    });

    function updateFavorites() {
        const favoritesList = document.getElementById('favorites-list');
        favoritesList.innerHTML = '';
        favorites.forEach(chapter => {
            const chapterIndex = parseInt(chapter.replace('chapter', '')) - 1;
            const li = document.createElement('li');
            li.innerHTML = `<a href="#" onclick="navigateTo('${chapter}')">${chapters[chapterIndex].title[currentLanguage]}</a>`;
            favoritesList.appendChild(li);
        });
    }

    // Authentification (simulée)
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const signOut = document.getElementById('sign-out');
    const authForms = document.getElementById('auth-forms');
    const userInfo = document.getElementById('user-info');
    const userName = document.getElementById('user-name');
    const userPhoto = document.getElementById('user-photo');
    const authError = document.getElementById('auth-error');

    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        authForms.style.display = 'none';
        userInfo.style.display = 'block';
        userName.textContent = document.getElementById('login-email').value.split('@')[0];
        userPhoto.src = 'default-user.png';
    });

    signupForm.addEventListener('submit', e => {
        e.preventDefault();
        authForms.style.display = 'none';
        userInfo.style.display = 'block';
        userName.textContent = document.getElementById('signup-name').value;
        userPhoto.src = 'default-user.png';
    });

    signOut.addEventListener('click', () => {
        authForms.style.display = 'block';
        userInfo.style.display = 'none';
        userName.textContent = 'Invité';
        userPhoto.src = 'default-user.png';
    });
});
