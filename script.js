if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(() => {
        console.log('Service Worker registered');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const homePage = document.getElementById('homePage');
    const indexPage = document.getElementById('indexPage');
    const readingPage = document.getElementById('readingPage');
    const settingsPanel = document.getElementById('settingsPanel');
    const favoritesPage = document.getElementById('favoritesPage');
    const textContent = document.getElementById('textContent');
    const chapTitle = document.getElementById('chapTitle');
    const themeSelect = document.getElementById('themeSelect');
    const fontSelect = document.getElementById('fontSelect');
    const fontSize = document.getElementById('fontSize');
    const favoritesList = document.getElementById('favoritesList');
    let favorites = [];

    // Contenu des 44 chapitres
    const chapterContents = {
        1: "Contenu du Chapitre 1 : Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
        2: "Contenu du Chapitre 2 : Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
        3: "Contenu du Chapitre 3 : Ut enim ad minim veniam, quis nostrud exercitation ullamco...",
        4: "Contenu du Chapitre 4 : Duis aute irure dolor in reprehenderit in voluptate velit...",
        5: "Contenu du Chapitre 5 : Excepteur sint occaecat cupidatat non proident, sunt in culpa...",
        6: "Contenu du Chapitre 6 : Nemo enim ipsam voluptatem quia voluptas sit aspernatur...",
        7: "Contenu du Chapitre 7 : At vero eos et accusamus et iusto odio dignissimos...",
        8: "Contenu du Chapitre 8 : Qui blanditiis praesentium voluptatum deleniti atque corrupti...",
        9: "Contenu du Chapitre 9 : Quis autem vel eum iure reprehenderit qui in ea voluptate...",
        10: "Contenu du Chapitre 10 : Neque porro quisquam est, qui dolorem ipsum quia dolor...",
        11: "Contenu du Chapitre 11 : Nam libero tempore, cum soluta nobis est eligendi optio...",
        12: "Contenu du Chapitre 12 : Consectetur adipiscing elit, sed do eiusmod tempor incididunt...",
        13: "Contenu du Chapitre 13 : Ut labore et dolore magna aliqua, ut enim ad minim veniam...",
        14: "Contenu du Chapitre 14 : Quis nostrud exercitation ullamco laboris nisi ut aliquip...",
        15: "Contenu du Chapitre 15 : Ex ea commodo consequat, quis aut dolor reprehenderit...",
        16: "Contenu du Chapitre 16 : Voluptate velit esse cillum dolore eu fugiat nulla pariatur...",
        17: "Contenu du Chapitre 17 : Occaecat cupidatat non proident, sunt in culpa qui officia...",
        18: "Contenu du Chapitre 18 : Deserunt mollit anim id est laborum, sed ut perspiciatis...",
        19: "Contenu du Chapitre 19 : Unde omnis iste natus error sit voluptatem accusantium...",
        20: "Contenu du Chapitre 20 : Doloremque laudantium, totam rem aperiam, eaque ipsa quae...",
        21: "Contenu du Chapitre 21 : Ab illo inventore veritatis et quasi architecto beatae...",
        22: "Contenu du Chapitre 22 : Vitae dicta sunt explicabo, nemo enim ipsam voluptatem...",
        23: "Contenu du Chapitre 23 : Quia voluptas sit aspernatur aut odit aut fugit, sed quia...",
        24: "Contenu du Chapitre 24 : Consequuntur magni dolores eos qui ratione voluptatem...",
        25: "Contenu du Chapitre 25 : Sequi nesciunt, neque porro quisquam est qui dolorem ipsum...",
        26: "Contenu du Chapitre 26 : Quia dolor sit amet, consectetur adipiscing elit, sed do...",
        27: "Contenu du Chapitre 27 : Eiusmod tempor incididunt ut labore et dolore magna aliqua...",
        28: "Contenu du Chapitre 28 : Ut enim ad minim veniam, quis nostrud exercitation ullamco...",
        29: "Contenu du Chapitre 29 : Laboris nisi ut aliquip ex ea commodo consequat, quis aut...",
        30: "Contenu du Chapitre 30 : Dolor reprehenderit in voluptate velit esse cillum dolore...",
        31: "Contenu du Chapitre 31 : Eu fugiat nulla pariatur, excepteur sint occaecat cupidatat...",
        32: "Contenu du Chapitre 32 : Non proident, sunt in culpa qui officia deserunt mollit...",
        33: "Contenu du Chapitre 33 : Anim id est laborum, sed ut perspiciatis unde omnis...",
        34: "Contenu du Chapitre 34 : Iste natus error sit voluptatem accusantium doloremque...",
        35: "Contenu du Chapitre 35 : Laudantium, totam rem aperiam, eaque ipsa quae ab illo...",
        36: "Contenu du Chapitre 36 : Inventore veritatis et quasi architecto beatae vitae dicta...",
        37: "Contenu du Chapitre 37 : Sunt explicabo, nemo enim ipsam voluptatem quia voluptas...",
        38: "Contenu du Chapitre 38 : Sit aspernatur aut odit aut fugit, sed quia consequuntur...",
        39: "Contenu du Chapitre 39 : Magni dolores eos qui ratione voluptatem sequi nesciunt...",
        40: "Contenu du Chapitre 40 : Neque porro quisquam est, qui dolorem ipsum quia dolor...",
        41: "Contenu du Chapitre 41 : Sit amet, consectetur adipiscing elit, sed do eiusmod...",
        42: "Contenu du Chapitre 42 : Tempor incididunt ut labore et dolore magna aliqua, ut enim...",
        43: "Contenu du Chapitre 43 : Ad minim veniam, quis nostrud exercitation ullamco laboris...",
        44: "Contenu du Chapitre 44 : Nisi ut aliquip ex ea commodo consequat, quis aut dolor..."
    };

    // Navigation
    document.querySelector('.start-btn').addEventListener('click', () => {
        homePage.style.display = 'none';
        indexPage.style.display = 'block';
    });

    document.querySelectorAll('.index-page li').forEach(li => {
        li.addEventListener('click', () => {
            const chapNum = li.getAttribute('data-chap');
            textContent.innerHTML = chapterContents[chapNum];
            chapTitle.textContent = `Chapitre ${chapNum}`;
            indexPage.style.display = 'none';
            readingPage.style.display = 'block';
        });
    });

    document.querySelector('.close-btn').addEventListener('click', () => {
        if (indexPage.style.display !== 'none') {
            indexPage.style.display = 'none';
            homePage.style.display = 'block';
        } else if (settingsPanel.style.display !== 'none') {
            settingsPanel.style.display = 'none';
            readingPage.style.display = 'block';
        } else if (favoritesPage.style.display !== 'none') {
            favoritesPage.style.display = 'none';
            readingPage.style.display = 'block';
        }
    });

    // Paramètres
    document.querySelector('.settings-btn').addEventListener('click', () => {
        readingPage.style.display = 'none';
        settingsPanel.style.display = 'block';
    });

    themeSelect.addEventListener('change', (e) => {
        document.body.className = e.target.value === 'dark' ? 'dark' : '';
    });

    fontSelect.addEventListener('change', (e) => {
        textContent.style.fontFamily = e.target.value;
    });

    fontSize.addEventListener('input', (e) => {
        textContent.style.fontSize = `${e.target.value}px`;
    });

    // Favoris
    document.querySelector('.favorite-btn').addEventListener('click', () => {
        const chapNum = chapTitle.textContent.replace('Chapitre ', '');
        if (!favorites.includes(chapNum)) {
            favorites.push(chapNum);
            updateFavorites();
        }
    });

    function updateFavorites() {
        favoritesList.innerHTML = '';
        favorites.forEach(chap => {
            const li = document.createElement('li');
            li.textContent = `Chapitre ${chap}`;
            li.addEventListener('click', () => {
                textContent.innerHTML = chapterContents[chap];
                chapTitle.textContent = `Chapitre ${chap}`;
                favoritesPage.style.display = 'none';
                readingPage.style.display = 'block';
            });
            favoritesList.appendChild(li);
        });
    }

    // Assistant IA (placeholder pour API Gemini)
    document.querySelector('.ai-btn').addEventListener('click', () => {
        alert('Assistant IA : Posez une question sur le livre (API Gemini à intégrer)');
    });

    // Sécurité
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey || e.key === 'PrintScreen') {
            e.preventDefault();
        }
    });

    document.addEventListener('contextmenu', (e) => e.preventDefault());
});

// Service Worker (sw.js) - À créer séparément pour le cache hors connexion
