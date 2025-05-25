const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

let voices = [];
let currentUtterance = null;
let isSpeaking = false;

function updateNavbarVisibility() {
    const homeSection = document.querySelector('#home');
    const topNavbar = document.querySelector('.top-navbar');
    const bottomNavbar = document.querySelector('.bottom-navbar');
    
    if (homeSection.classList.contains('active')) {
        topNavbar.style.display = 'none';
        bottomNavbar.style.display = 'none';
    } else {
        topNavbar.style.display = 'flex';
        bottomNavbar.style.display = 'flex';
    }
}

function showSection(sectionId) {
    document.querySelectorAll('section').forEach(section => {
        section.classList.remove('active');
    });
    document.querySelector(sectionId).classList.add('active');
    updateNavbarVisibility();
    window.scrollTo(0, 0);
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const themeIcon = document.querySelector('#theme-toggle .icon');
    themeIcon.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}

function loadVoices() {
    voices = speechSynthesis.getVoices();
    const voiceSelect = document.getElementById('voice-select');
    voiceSelect.innerHTML = '';
    voices.forEach((voice, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${voice.name} (${voice.lang})`;
        voiceSelect.appendChild(option);
    });
}

function toggleVoice() {
    const voiceButton = document.getElementById('voice-toggle');
    const voiceSelect = document.getElementById('voice-select');
    
    if (!isSpeaking) {
        const selectedVoiceIndex = voiceSelect.value;
        const textToRead = document.querySelector('section.active .content[data-lang="fr"]').textContent;
        
        currentUtterance = new SpeechSynthesisUtterance(textToRead);
        currentUtterance.voice = voices[selectedVoiceIndex];
        currentUtterance.lang = 'fr-FR';
        currentUtterance.onend = () => {
            isSpeaking = false;
            voiceButton.querySelector('.icon').textContent = '🔊';
        };
        
        speechSynthesis.speak(currentUtterance);
        isSpeaking = true;
        voiceButton.querySelector('.icon').textContent = '⏸';
    } else {
        speechSynthesis.cancel();
        isSpeaking = false;
        voiceButton.querySelector('.icon').textContent = '🔊';
    }
}

function toggleLanguage() {
    const currentLang = document.querySelector('.content:not([style*="display: none"])').dataset.lang;
    const nextLang = currentLang === 'fr' ? 'en' : currentLang === 'en' ? 'ar' : 'fr';
    
    document.querySelectorAll('.content').forEach(content => {
        content.style.display = content.dataset.lang === nextLang ? 'block' : 'none';
    });
}

function toggleFavorite(chapterId) {
    const favoriteIcon = document.querySelector(`.favorite[data-chapter="${chapterId}"]`);
    const user = auth.currentUser;
    
    if (user) {
        const favoriteRef = db.collection('users').doc(user.uid).collection('favorites').doc(chapterId);
        favoriteIcon.classList.toggle('active');
        
        if (favoriteIcon.classList.contains('active')) {
            favoriteRef.set({ timestamp: firebase.firestore.FieldValue.serverTimestamp() });
        } else {
            favoriteRef.delete();
        }
    } else {
        alert('Veuillez vous connecter pour ajouter des favoris.');
    }
}

function loadFavorites() {
    const user = auth.currentUser;
    if (user) {
        db.collection('users').doc(user.uid).collection('favorites').get().then(snapshot => {
            snapshot.forEach(doc => {
                const chapterId = doc.id;
                const favoriteIcon = document.querySelector(`.favorite[data-chapter="${chapterId}"]`);
                if (favoriteIcon) favoriteIcon.classList.add('active');
            });
        });
    }
}

function navigateChapters() {
    document.querySelectorAll('.prev-btn, .next-btn').forEach(button => {
        button.addEventListener('click', () => {
            const currentSection = document.querySelector('section.active');
            const allSections = Array.from(document.querySelectorAll('section.chapter'));
            const currentIndex = allSections.indexOf(currentSection);
            
            if (button.classList.contains('prev-btn') && currentIndex > 0) {
                showSection(`#${allSections[currentIndex - 1].id}`);
            } else if (button.classList.contains('next-btn') && currentIndex < allSections.length - 1) {
                showSection(`#${allSections[currentIndex + 1].id}`);
            }
            
            const prevBtn = currentSection.querySelector('.prev-btn');
            const nextBtn = currentSection.querySelector('.next-btn');
            if (prevBtn) prevBtn.disabled = currentIndex === 0;
            if (nextBtn) nextBtn.disabled = currentIndex === allSections.length - 1;
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.querySelector('#theme-toggle .icon').textContent = '☀️';
    }

    document.querySelectorAll('.close-btn').forEach(button => {
        button.addEventListener('click', () => showSection('#home'));
    });

    document.querySelectorAll('#chapter-list a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showSection(link.getAttribute('href'));
        });
    });

    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    document.getElementById('voice-toggle').addEventListener('click', toggleVoice);
    document.getElementById('language-toggle').addEventListener('click', toggleLanguage);

    speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();

    document.querySelectorAll('.favorite').forEach(favorite => {
        favorite.addEventListener('click', () => toggleFavorite(favorite.dataset.chapter));
    });

    auth.onAuthStateChanged(user => {
        if (user) {
            loadFavorites();
        }
    });

    navigateChapters();
    updateNavbarVisibility();
});
