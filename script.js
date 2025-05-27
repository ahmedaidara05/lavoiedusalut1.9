// Configuration et initialisation de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAljojXHODwHjStePWkhthWLRzrw3pUslQ",
    authDomain: "la-voie-du-salut-36409.firebaseapp.com",
    projectId: "la-voie-du-salut-36409",
    storageBucket: "la-voie-du-salut-36409.firebasestorage.app",
    messagingSenderId: "61439310820",
    appId: "1:61439310820:web:52bfe8b862666ac13d25f1",
    measurementId: "G-G9S1ST8K3R"
};

// Initialiser Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Enregistrement du Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(() => {
        console.log('Service Worker registered');
    }).catch(err => console.error('Service Worker registration failed:', err));
}

// Données des sourates intégrées directement (2 premières et dernière pour l'instant)
const suraContents = {
    1: {
        ar: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ<br>ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ ۝ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ۝ مَٰلِكِ يَوْمِ ٱلدِّينِ ۝ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ ۝ صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّالِّينَ<br>هذه السورة تُعرف بـ 'أم الكتاب' وهي السورة الأولى في القرآن الكريم، تتكون من سبع آيات تُقرأ في كل ركعة من الصلاة، مما يجعلها جوهر العبادة اليومية للمسلمين.",
        en: "In the name of Allah, the Most Gracious, the Most Merciful<br>All praise is due to Allah, Lord of the worlds, the Most Gracious, the Most Merciful, Master of the Day of Judgment. You alone we worship, and You alone we ask for help. Guide us to the straight path, the path of those upon whom You have bestowed favor, not of those who have earned Your anger, nor of those who are astray.<br>This surah, known as Al-Fatihah, is the opening chapter of the Quran, consisting of seven verses recited in every unit of prayer, making it the essence of daily Muslim worship and a profound connection to Allah.",
        fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux<br>Louange à Allah, Seigneur des mondes, le Tout Miséricordieux, le Très Miséricordieux, Maître du Jour du Jugement. C’est Toi que nous adorons, et c’est de Toi que nous implorons l’aide. Guide-nous sur le droit chemin, le chemin de ceux que Tu as comblés de bienfaits, non pas celui des réprouvés, ni des égarés.<br>Cette sourate, appelée Al-Fatihah, est le premier chapitre du Coran, composée de sept versets récités dans chaque unité de la prière, constituant l’essence de l’adoration quotidienne des musulmans et un lien profond avec Allah."
    },
    2: {
        ar: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ<br>الم ۝ ذَٰلِكَ ٱلْكِتَٰبُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ ۝ ٱلَّذِينَ يُؤْمِنُونَ بِٱلْغَيْبِ وَيُقِيمُونَ ٱلصَّلَوٰةَ وَمِمَّا رَزَقْنَٰهُمْ يُنفِقُونَ ۝ وَٱلَّذِينَ يُؤْمِنُونَ بِمَآ أُنزِلَ إِلَيْكَ<br>هذه السورة هي الأطول في القرآن، تحتوي على قصص الأنبياء مثل موسى وعيسى، وأحكام شرعية حول الزكاة والصيام، مما يعزز التفكير في الحياة الروحية.",
        en: "In the name of Allah, the Most Gracious, the Most Merciful<br>Alif Lam Mim. This is the Book about which there is no doubt, a guidance for those conscious of Allah, who believe in the unseen, establish prayer, and spend out of what We have provided for them, and who believe in what has been revealed to you.<br>This surah, Al-Baqarah, is the longest in the Quran, containing stories of prophets like Moses and Jesus, along with legal rulings on charity and fasting, encouraging deep reflection on spiritual life and divine guidance.",
        fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux<br>Alif Lam Mim. Ceci est le Livre au sujet duquel il n'y a aucun doute, un guide pour ceux qui craignent Allah, qui croient en l'invisible, accomplissent la prière et dépensent de ce que Nous leur avons attribué.<br>Cette sourate, Al-Baqarah, est la plus longue du Coran, incluant des récits de prophètes comme Moïse et Jésus, ainsi que des lois sur la charité et le jeûne, incitant à une profonde réflexion sur la vie spirituelle et la guidance divine."
    },
    44: {
        ar: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ<br>حٰم ۚ وَٱلْكِتَٰبِ ٱلْمُبِينِ ۝ إِنَّآ أَنزَلْنَٰهُ فِى لَيْلَةٍ مُّبَٰرَكَةٍ ۚ إِنَّا كُنَّا مُنذِرِينَ ۝<br>السورة تذكر بيوم الدخان، وتدعو إلى التوبة، مما يعزز الاستعداد للآخرة ووعي المسؤولية الروحية.",
        en: "In the name of Allah, the Most Gracious, the Most Merciful<br>Ha Mim. By the clear Book. Indeed, We sent it down during a blessed night; indeed, We were to warn.<br>This surah, Ad-Dukhan, recalls the Day of Smoke, calling for repentance, enhancing preparation for the Hereafter and awareness of spiritual responsibility.",
        fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux<br>Ha Mim. Par le Livre clair. En vérité, Nous l’avons fait descendre durant une nuit bénie; Nous étions à avertir.<br>Cette sourate, Ad-Dukhan, rappelle le Jour de la Fumée, appelant à la repentance, renforçant la préparation pour l'au-delà et la conscience de la responsabilité spirituelle."
    }
    // Tu peux ajouter les 42 sourates restantes ici en suivant le même format
};

document.addEventListener('DOMContentLoaded', () => {
    const homePage = document.getElementById('homePage');
    const indexPage = document.getElementById('indexPage');
    const readingPage = document.getElementById('readingPage');
    const settingsPanel = document.getElementById('settingsPanel');
    const favoritesPage = document.getElementById('favoritesPage');
    const notesPage = document.getElementById('notesPage');
    const arabicText = document.getElementById('arabicText');
    const textContent = document.getElementById('textContent');
    const suraTitle = document.getElementById('suraTitle');
    const languageSelect = document.getElementById('languageSelect');
    const themeSelect = document.getElementById('themeSelect');
    const fontSelect = document.getElementById('fontSelect');
    const fontSize = document.getElementById('fontSize');
    const favoritesList = document.getElementById('favoritesList');
    const searchBar = document.getElementById('searchBar');
    const searchResults = document.getElementById('searchResults');
    const customizePanel = document.getElementById('customizePanel');
    const favoritesBtn = document.querySelector('.favorites-btn');
    const voicePlayBtn = document.querySelector('.voice-play-btn');
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    let notes = JSON.parse(localStorage.getItem('notes')) || {};
    let currentSura = 1;
    let isPlaying = false;
    let synth = window.speechSynthesis;
    let currentFontSize = 16;

    // Navigation depuis le sommaire
    document.querySelectorAll('.index-page li').forEach(li => {
        li.addEventListener('click', () => {
            currentSura = parseInt(li.getAttribute('data-sura'));
            updateContent();
            indexPage.style.display = 'none';
            readingPage.style.display = 'block';
            updateFavoritesButton();
        });
    });

    // Bouton retour au sommaire
    document.querySelectorAll('.index-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            readingPage.style.display = 'none';
            indexPage.style.display = 'block';
            customizePanel.style.display = 'none';
        });
    });

    // Navigation entre chapitres
    document.querySelector('.prev-btn').addEventListener('click', () => {
        if (currentSura > 1) {
            currentSura--;
            updateContent();
            updateFavoritesButton();
        }
    });

    document.querySelector('.next-btn').addEventListener('click', () => {
        if (currentSura < Object.keys(suraContents).length) {
            currentSura++;
            updateContent();
            updateFavoritesButton();
        }
    });

    // Paramètres
    document.querySelector('.settings-btn').addEventListener('click', () => {
        readingPage.style.display = 'none';
        settingsPanel.style.display = 'block';
    });

    languageSelect.addEventListener('change', () => {
        updateContent();
    });

    themeSelect.addEventListener('change', (e) => {
        document.body.className = e.target.value === 'dark' ? 'dark' : '';
    });

    fontSelect.addEventListener('change', (e) => {
        arabicText.style.fontFamily = e.target.value;
        textContent.style.fontFamily = e.target.value;
    });

    fontSize.addEventListener('input', (e) => {
        currentFontSize = e.target.value;
        arabicText.style.fontSize = `${currentFontSize}px`;
        textContent.style.fontSize = `${currentFontSize}px`;
    });

    // Favoris
    function updateFavoritesButton() {
        favoritesBtn.textContent = favorites.includes(currentSura) ? '★' : '☆';
    }

    document.querySelector('.favorites-btn').addEventListener('click', () => {
        const index = favorites.indexOf(currentSura);
        if (index === -1) {
            favorites.push(currentSura);
            favoritesBtn.textContent = '★';
        } else {
            favorites.splice(index, 1);
            favoritesBtn.textContent = '☆';
        }
        localStorage.setItem('favorites', JSON.stringify(favorites));
        updateFavorites();
    });

    function updateFavorites() {
        favoritesList.innerHTML = '';
        favorites.forEach(sura => {
            if (suraContents[sura]) {
                const li = document.createElement('li');
                li.innerHTML = `<span class="sura-number">${sura}</span> Surat ${sura}<br>Nombre aya ${suraContents[sura].ar.split('<br>').length - 1} <i class="fas fa-mosque"></i>`;
                li.addEventListener('click', () => {
                    currentSura = sura;
                    updateContent();
                    favoritesPage.style.display = 'none';
                    readingPage.style.display = 'block';
                    updateFavoritesButton();
                });
                favoritesList.appendChild(li);
            }
        });
    }
    updateFavorites();

    // Afficher la page des favoris
    favoritesBtn.addEventListener('click', () => {
        if (favoritesPage.style.display === 'none') {
            favoritesPage.style.display = 'block';
            readingPage.style.display = 'none';
            updateFavorites();
        }
    });

    // Lecture à haute voix
    voicePlayBtn.addEventListener('click', () => {
        if (isPlaying) {
            synth.cancel();
            isPlaying = false;
            voicePlayBtn.innerHTML = '<i class="fas fa-play"></i> Lecture à haute voix';
        } else {
            const textToRead = languageSelect.value === 'ar' ? arabicText.innerText : textContent.innerText;
            if (textToRead) {
                const utterance = new SpeechSynthesisUtterance(textToRead);
                utterance.lang = languageSelect.value === 'ar' ? 'ar-SA' : (languageSelect.value === 'en' ? 'en-US' : 'fr-FR');
                synth.speak(utterance);
                isPlaying = true;
                voicePlayBtn.innerHTML = '<i class="fas fa-pause"></i> Lecture à haute voix';
                utterance.onend = () => {
                    isPlaying = false;
                    voicePlayBtn.innerHTML = '<i class="fas fa-play"></i> Lecture à haute voix';
                };
            }
        }
    });

    // Personnalisation
    document.querySelector('.customize-btn').addEventListener('click', () => {
        customizePanel.style.display = customizePanel.style.display === 'none' ? 'flex' : 'none';
    });

    document.querySelector('.close-customize-btn').addEventListener('click', () => {
        customizePanel.style.display = 'none';
    });

    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const content = document.getElementById('readingContent');
            content.style.backgroundColor = btn.getAttribute('data-color');
            document.body.style.backgroundColor = btn.getAttribute('data-color');
        });
    });

    // Zoom
    document.querySelector('.zoom-in-btn').addEventListener('click', () => {
        currentFontSize = Math.min(currentFontSize + 2, 30);
        arabicText.style.fontSize = `${currentFontSize}px`;
        textContent.style.fontSize = `${currentFontSize}px`;
    });

    document.querySelector('.zoom-out-btn').addEventListener('click', () => {
        currentFontSize = Math.max(currentFontSize - 2, 12);
        arabicText.style.fontSize = `${currentFontSize}px`;
        textContent.style.fontSize = `${currentFontSize}px`;
    });

    // Notes
    document.querySelector('.note-btn').addEventListener('click', () => {
        readingPage.style.display = 'none';
        notesPage.style.display = 'block';
        updateNotes();
    });

    document.querySelector('.add-category-btn').addEventListener('click', () => {
        const categoryName = document.getElementById('newCategory').value.trim();
        if (categoryName) {
            if (!notes[categoryName]) {
                notes[categoryName] = '';
            }
            localStorage.setItem('notes', JSON.stringify(notes));
            updateNotes();
            document.getElementById('newCategory').value = '';
        }
    });

    function updateNotes() {
        const categoriesList = document.getElementById('categoriesList');
        categoriesList.innerHTML = '';
        for (const category in notes) {
            const div = document.createElement('div');
            div.className = 'category';
            div.innerHTML = `
                <h3>${category}</h3>
                <textarea>${notes[category]}</textarea>
            `;
            div.querySelector('textarea').addEventListener('input', (e) => {
                notes[category] = e.target.value;
                localStorage.setItem('notes', JSON.stringify(notes));
            });
            categoriesList.appendChild(div);
        }
    }

    // Assistant IA
    document.querySelector('.ai-btn').addEventListener('click', () => {
        alert('Assistant IA : Posez une question sur le livre (API Gemini à intégrer)');
    });

    // Recherche intelligente
    searchBar.addEventListener('input', (e) => {
        const searchTerm = e.target.value.trim().toLowerCase();
        searchResults.style.display = searchTerm ? 'block' : 'none';
        searchResults.innerHTML = '';

        if (searchTerm) {
            const allText = {};
            for (let sura in suraContents) {
                ['ar', 'en', 'fr'].forEach(lang => {
                    const lines = suraContents[sura][lang].split('<br>');
                    lines.forEach((line, index) => {
                        if (line.toLowerCase().includes(searchTerm)) {
                            if (!allText[sura]) allText[sura] = {};
                            if (!allText[sura][lang]) allText[sura][lang] = [];
                            allText[sura][lang].push({ text: line, lineIndex: index });
                        }
                    });
                });
            }

            for (let sura in allText) {
                for (let lang in allText[sura]) {
                    allText[sura][lang].forEach(result => {
                        const div = document.createElement('div');
                        div.className = 'result-item';
                        div.innerHTML = `<strong>Surat ${sura} (${lang.toUpperCase()})</strong><br>${result.text}`;
                        div.addEventListener('click', () => {
                            currentSura = parseInt(sura);
                            languageSelect.value = lang;
                            updateContent();
                            const targetElement = lang === 'ar' ? arabicText : textContent;
                            const targetLines = (lang === 'ar' ? arabicText.innerHTML : textContent.innerHTML).split('<br>');
                            targetLines[result.lineIndex] = `<span style="background: yellow">${targetLines[result.lineIndex]}</span>`;
                            targetElement.innerHTML = targetLines.join('<br>');
                            targetElement.scrollTop = targetElement.scrollHeight * (result.lineIndex / targetLines.length);
                            searchResults.style.display = 'none';
                            searchBar.value = '';
                        });
                        searchResults.appendChild(div);
                    });
                }
            }
        }
    });

    // Connexion/Inscription
    document.querySelectorAll('.auth-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const username = btn.parentElement.querySelector('input[type="text"]').value;
            const password = btn.parentElement.querySelector('input[type="password"]').value;
            if (btn.textContent === 'Se connecter') {
                auth.signInWithEmailAndPassword(username, password)
                    .then((userCredential) => {
                        alert(`Connexion réussie avec ${username}`);
                    })
                    .catch((error) => {
                        alert('Erreur de connexion : ' + error.message);
                    });
            } else {
                auth.createUserWithEmailAndPassword(username, password)
                    .then((userCredential) => {
                        alert(`Inscription réussie pour ${username}`);
                    })
                    .catch((error) => {
                        alert('Erreur d\'inscription : ' + error.message);
                    });
            }
        });
    });

    function updateContent() {
        const content = suraContents[currentSura] && suraContents[currentSura][languageSelect.value];
        suraTitle.textContent = `Surat ${currentSura}`;
        if (content) {
            const lines = content.split('<br>');
            const bismillahLine = lines[0];
            const rest = lines.slice(1).join('<br>');
            if (languageSelect.value === 'ar') {
                arabicText.innerHTML = `<span class="bismillah">${bismillahLine}</span><br>${rest}`;
                textContent.style.display = 'none';
                arabicText.style.display = 'block';
            } else {
                textContent.innerHTML = `<span class="bismillah">${bismillahLine}</span><br>${rest}`;
                arabicText.style.display = 'none';
                textContent.style.display = 'block';
            }
        } else {
            arabicText.innerHTML = 'Contenu non disponible';
            textContent.innerHTML = 'Content not available';
            arabicText.style.display = 'block';
            textContent.style.display = 'none';
        }
    }

    // Sécurité
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey || e.key === 'PrintScreen') {
            e.preventDefault();
        }
    });

    document.addEventListener('contextmenu', (e) => e.preventDefault());

    // Initialisation
    updateContent();
    updateFavoritesButton();
});
