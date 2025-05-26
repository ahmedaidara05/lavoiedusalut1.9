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
    const arabicText = document.getElementById('arabicText');
    const textContent = document.getElementById('textContent');
    const suraTitle = document.getElementById('suraTitle');
    const languageSelect = document.getElementById('languageSelect');
    const themeSelect = document.getElementById('themeSelect');
    const fontSelect = document.getElementById('fontSelect');
    const fontSize = document.getElementById('fontSize');
    const favoritesList = document.getElementById('favoritesList');
    const searchBar = document.getElementById('searchBar');
    let favorites = [];
    let currentSura = 1;

    // Contenu des 44 sourates en arabe, anglais et français
    const suraContents = {
        1: {
            ar: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ<br>ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ",
            en: "In the name of Allah, the Most Gracious, the Most Merciful<br>Praise be to Allah, the Lord of all the worlds",
            fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux<br>Louange à Allah, Seigneur des mondes"
        },
        2: {
            ar: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ<br>ذَٰلِكَ ٱلْكِتَٰبُ لَا رَيْبَ ۖ فِيهِ هُدًى لِّلْمُتَّقِينَ",
            en: "In the name of Allah, the Most Gracious, the Most Merciful<br>This is the Book about which there is no doubt, a guidance for those conscious of Allah",
            fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux<br>Ceci est le Livre au sujet duquel il n'y a aucun doute, un guide pour les pieux"
        },
        3: {
            ar: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ<br>الم ۝ ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ",
            en: "In the name of Allah, the Most Gracious, the Most Merciful<br>Alif Lam Mim. Allah, there is no deity except Him, the Ever-Living, the Sustainer of existence",
            fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux<br>Alif Lam Mim. Allah, il n'y a de divinité sauf Lui, le Vivant, le Subsistant"
        },
        4: {
            ar: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ<br>يَٰٓأَيُّهَا ٱلنَّاسُ ٱتَّقُوا۟ رَبَّكُمُ ٱلَّذِى خَلَقَكُم",
            en: "In the name of Allah, the Most Gracious, the Most Merciful<br>O mankind, fear your Lord, who created you from one soul...",
            fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux<br>Ô hommes, craignez votre Seigneur qui vous a créés d'une seule âme..."
        },
        5: {
            ar: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ<br>يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوٓا۟ أَوْفُوا۟ بِٱلْعُقُودِ",
            en: "In the name of Allah, the Most Gracious, the Most Merciful<br>O you who have believed, fulfill [all] contracts...",
            fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux<br>Ô vous qui avez cru, remplissez les contrats..."
        },
        6: {
            ar: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ<br>ٱلْحَمْدُ لِلَّهِ ٱلَّذِى خَلَقَ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضَ",
            en: "In the name of Allah, the Most Gracious, the Most Merciful<br>Praise be to Allah, who created the heavens and the earth...",
            fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux<br>Louange à Allah, qui a créé les cieux et la terre..."
        },
        7: {
            ar: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ<br>ٱلْمِيمْ ۚ صَدَقَ ٱللَّهُ ٱلْعَزِيزُ ٱلْحَكِيمُ",
            en: "In the name of Allah, the Most Gracious, the Most Merciful<br>Alif Lam Mim Sad. Allah has spoken the truth, the Exalted in Might, the Wise...",
            fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux<br>Alif Lam Mim Sad. Allah a dit la vérité, le Tout-Puissant, le Sage..."
        },
        8: {
            ar: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ<br>يَٰٓأَيُّهَا ٱلنَّبِىُّ ٱتَّقِ ٱللَّهَ",
            en: "In the name of Allah, the Most Gracious, the Most Merciful<br>O Prophet, fear Allah...",
            fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux<br>Ô Prophète, crains Allah..."
        },
        9: {
            ar: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ<br>بَرَاءَةٌ مِّنَ ٱللَّهِ وَرَسُولِهِ",
            en: "In the name of Allah, the Most Gracious, the Most Merciful<br>Freedom from obligation from Allah and His Messenger...",
            fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux<br>Dissociation d'Allah et de Son Messager..."
        },
        10: {
            ar: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ<br>ٱلْحَمْدُ لِلَّهِ ٱلَّذِىٓ أَنزَلَ عَلَىٰ عَبْدِهِ ٱلْكِتَٰبَ",
            en: "In the name of Allah, the Most Gracious, the Most Merciful<br>Praise be to Allah, who has sent down to His servant the Book...",
            fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux<br>Louange à Allah, qui a fait descendre sur Son serviteur le Livre..."
        },
        11: {
            ar: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ<br>ٱلر ۚ كِتَٰبٌ أُنزِلَ إِلَيْكَ",
            en: "In the name of Allah, the Most Gracious, the Most Merciful<br>Alif Lam Ra. A Book which is revealed unto you...",
            fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux<br>Alif Lam Ra. Un Livre qui t'a été révélé..."
        },
        12: {
            ar: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ<br>ٱلر ۚ تِلْكَ آيَٰتُ ٱلْكِتَٰبِ ٱلْمُبِينِ",
            en: "In the name of Allah, the Most Gracious, the Most Merciful<br>Alif Lam Ra. These are the verses of the clear Book...",
            fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux<br>Alif Lam Ra. Ce sont les versets du Livre clair..."
        },
        13: {
            ar: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ<br>ٱلْمِيمْ ۚ ٱلر ۚ كِتَٰبٌ أُنزِلَ",
            en: "In the name of Allah, the Most Gracious, the Most Merciful<br>Alif Lam Mim Ra. A Book which is revealed...",
            fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux<br>Alif Lam Mim Ra. Un Livre qui est révélé..."
        },
        14: {
            ar: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ<br>ٱلر ۚ كِتَٰبٌ أَنْزَلْنَٰهُ إِلَيْكَ",
            en: "In the name of Allah, the Most Gracious, the Most Merciful<br>Alif Lam Ra. A Book which We have revealed unto you...",
            fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux<br>Alif Lam Ra. Un Livre que Nous t'avons révélé..."
        },
        15: {
            ar: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ<br>ٱلر ۚ تِلْكَ آيَٰتُ ٱلْكِتَٰبِ وَقُرْآنٍ مُّبِينٍ",
            en: "In the name of Allah, the Most Gracious, the Most Merciful<br>Alif Lam Ra. These are the verses of the Book and a clear Qur'an...",
            fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux<br>Alif Lam Ra. Ce sont les versets du Livre et un Coran clair..."
        },
        16: {
            ar: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ<br>ٱلْحَمْدُ لِلَّهِ ٱلَّذِى خَلَقَ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضَ",
            en: "In the name of Allah, the Most Gracious, the Most Merciful<br>Praise be to Allah, who created the heavens and the earth...",
            fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux<br>Louange à Allah, qui a créé les cieux et la terre..."
        },
        17: {
            ar: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ<br>سُبْحَٰنَ ٱلَّذِىٓ أَسْرَىٰ بِعَبْدِهِ",
            en: "In the name of Allah, the Most Gracious, the Most Merciful<br>Glorified is He who took His servant by night...",
            fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux<br>Glorifié soit Celui qui a conduit Son serviteur..."
        },
        18: {
            ar: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ<br>ٱلْحَمْدُ لِلَّهِ ٱلَّذِىٓ أَنْزَلَ عَلَىٰ عَبْدِهِ ٱلْكِتَٰبَ",
            en: "In the name of Allah, the Most Gracious, the Most Merciful<br>Praise be to Allah, who has sent down to His servant the Book...",
            fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux<br>Louange à Allah, qui a fait descendre sur Son serviteur le Livre..."
        },
        19: {
            ar: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ<br>كَهْيَعَصٓ ۚ ذِكْرُ رَحْمَتِ رَبِّكَ",
            en: "In the name of Allah, the Most Gracious, the Most Merciful<br>Kaf Ha Ya Ain Sad. A mention of the mercy of your Lord...",
            fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux<br>Kaf Ha Ya Ain Sad. Un rappel de la miséricorde de ton Seigneur..."
        },
        20: {
            ar: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ<br>طٰهٓ ۚ مَآ أَنزَلْنَا عَلَيْكَ ٱلْقُرْءَانَ",
            en: "In the name of Allah, the Most Gracious, the Most Merciful<br>Ta Ha. We have not sent down to you the Qur'an...",
            fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux<br>Ta Ha. Nous ne t'avons pas fait descendre le Coran..."
        },
        21: {
            ar: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ<br>ٱقْتَرَبَ لِلنَّاسِ حِسَابُهُمْ",
            en: "In the name of Allah, the Most Gracious, the Most Merciful<br>[The time of] their account has approached for mankind...",
            fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux<br>Le compte des hommes s'est approché..."
        },
        22: {
            ar: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ<br>يَٰٓأَيُّهَا ٱلنَّاسُ ٱتَّقُوا۟ رَبَّكُمْ",
            en: "In the name of Allah, the Most Gracious, the Most Merciful<br>O mankind, fear your Lord...",
            fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux<br>Ô hommes, craignez votre Seigneur..."
        },
        23: {
            ar: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ<br>قَدْ أَفْلَحَ ٱلْمُؤْمِنُونَ",
            en: "In the name of Allah, the Most Gracious, the Most Merciful<br>Certainly will the believers have succeeded...",
            fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux<br>Les croyants ont certes réussi..."
        },
        24: {
            ar: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ<br>سُورَةٌ أَنزَلْنَٰهَا",
            en: "In the name of Allah, the Most Gracious, the Most Merciful<br>[This is] a surah which We have sent down...",
            fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux<br>[Ceci est] une sourate que Nous avons fait descendre..."
        },
        25: {
            ar: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ<br>تَبَارَكَ ٱلَّذِى نَزَّلَ ٱلْفُرْقَانَ",
            en: "In the name of Allah, the Most Gracious, the Most Merciful<br>Blessed is He who sent down the Criterion...",
            fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux<br>Béni soit Celui qui a fait descendre le Discernement..."
        },
        26: {
            ar: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ<br>طٰسٓمٓ ۚ تِلْكَ آيَٰتُ ٱلْقُرْءَانِ",
            en: "In the name of Allah, the Most Gracious, the Most Merciful<br>Ta Sin Mim. These are the verses of the clear Book...",
            fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux<br>Ta Sin Mim. Ce sont les versets du Coran clair..."
        },
        27: {
            ar: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ<br>طٰسٓ ۚ تِلْكَ آيَٰتُ ٱلْقُرْءَانِ",
            en: "In the name of Allah, the Most Gracious, the Most Merciful<br>Ta Sin. These are the verses of the Qur'an...",
            fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux<br>Ta Sin. Ce sont les versets du Coran..."
        },
        28: {
            ar: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ<br>طٰسٓمٓ ۚ تِلْكَ آيَٰتُ ٱلْكِتَٰبِ ٱلْمُبِينِ",
            en: "In the name of Allah, the Most Gracious, the Most Merciful<br>Ta Sin Mim. These are the verses of the clear Book...",
            fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux<br>Ta Sin Mim. Ce sont les versets du Livre clair..."
        },
        29: {
            ar: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ<br>الم ۚ أَحَسِبَ ٱلنَّاسُ",
            en: "In the name of Allah, the Most Gracious, the Most Merciful<br>Alif Lam Mim. Do the people think...",
            fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux<br>Alif Lam Mim. Les gens pensent-ils..."
        },
        30: {
            ar: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ<br>الم ۚ غُلِبَتِ ٱلرُّومُ",
            en: "In the name of Allah, the Most Gracious, the Most Merciful<br>Alif Lam Mim. The Romans have been defeated...",
            fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux<br>Alif Lam Mim. Les Romains ont été vaincus..."
        },
        31: {
            ar: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ<br>الم ۚ تِلْكَ آيَٰتُ ٱلْكِتَٰبِ ٱلْحَكِيمِ",
            en: "In the name of Allah, the Most Gracious, the Most Merciful<br>Alif Lam Mim. These are the verses of the wise Book...",
            fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux<br>Alif Lam Mim. Ce sont les versets du Livre sage..."
        },
        32: {
            ar: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ<br>الم ۚ تَنْزِيلُ ٱلْكِتَٰبِ",
            en: "In the name of Allah, the Most Gracious, the Most Merciful<br>Alif Lam Mim. The revelation of the Book...",
            fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux<br>Alif Lam Mim. La révélation du Livre..."
        },
        33: {
            ar: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ<br>يَٰٓأَيُّهَا ٱلنَّبِىُّ ٱتَّقِ ٱللَّهَ",
            en: "In the name of Allah, the Most Gracious, the Most Merciful<br>O Prophet, fear Allah...",
            fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux<br>Ô Prophète, crains Allah..."
        },
        34: {
            ar: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ<br>ٱلْحَمْدُ لِلَّهِ ٱلَّذِى لَهُۥ مَا فِى ٱلسَّمَٰوَٰتِ",
            en: "In the name of Allah, the Most Gracious, the Most Merciful<br>Praise be to Allah, to whom belongs whatever is in the heavens...",
            fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux<br>Louange à Allah, à qui appartient ce qui est dans les cieux..."
        },
        35: {
            ar: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ<br>ٱلْحَمْدُ لِلَّهِ فَاطِرِ ٱلسَّمَٰوَٰتِ",
            en: "In the name of Allah, the Most Gracious, the Most Merciful<br>Praise be to Allah, Creator of the heavens...",
            fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux<br>Louange à Allah, Créateur des cieux..."
        },
        36: {
            ar: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ<br>يٰسٓ ۚ وَٱلْقُرْءَانِ ٱلْحَكِيمِ",
            en: "In the name of Allah, the Most Gracious, the Most Merciful<br>Ya Sin. By the wise Qur'an...",
            fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux<br>Ya Sin. Par le Coran sage..."
        },
        37: {
            ar: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ<br>وَٱلصَّٰفَّاتِ صَفًّا",
            en: "In the name of Allah, the Most Gracious, the Most Merciful<br>By those [angels] lined up in rows...",
            fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux<br>Par ceux qui sont rangés en rangs..."
        },
        38: {
            ar: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ<br>صٓ ۚ وَٱلْقُرْءَانِ ذِى ٱلذِّكْرِ",
            en: "In the name of Allah, the Most Gracious, the Most Merciful<br>Sad. By the Qur'an containing reminder...",
            fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux<br>Sad. Par le Coran porteur de rappel..."
        },
        39: {
            ar: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ<br>ٱلْحَمْدُ لِلَّهِ ٱلَّذِىٓ أَنزَلَ عَلَىٰ عَبْدِهِ",
            en: "In the name of Allah, the Most Gracious, the Most Merciful<br>Praise be to Allah, who has sent down upon His servant...",
            fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux<br>Louange à Allah, qui a fait descendre sur Son serviteur..."
        },
        40: {
            ar: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ<br>حم ۚ تَنزِيلُ ٱلْكِتَٰبِ مِنَ ٱللَّهِ",
            en: "In the name of Allah, the Most Gracious, the Most Merciful<br>Ha Mim. The revelation of the Book is from Allah...",
            fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux<br>Ha Mim. La révélation du Livre vient d'Allah..."
        },
        41: {
            ar: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ<br>حم ۚ عَسَقَ ۚ كِتَٰبٌ فُصِّلَتْ",
            en: "In the name of Allah, the Most Gracious, the Most Merciful<br>Ha Mim. Ha Mim. A Book whose verses are detailed...",
            fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux<br>Ha Mim. Ha Mim. Un Livre dont les versets sont détaillés..."
        },
        42: {
            ar: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ<br>حم ۚ عَسَقَ ۚ عَسْقَ",
            en: "In the name of Allah, the Most Gracious, the Most Merciful<br>Ha Mim. Ha Mim. Ha Mim Ain Sin Qaf...",
            fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux<br>Ha Mim. Ha Mim. Ha Mim Ain Sin Qaf..."
        },
        43: {
            ar: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ<br>حم ۚ وَٱلْكِتَٰبِ ٱلْمُبِينِ",
            en: "In the name of Allah, the Most Gracious, the Most Merciful<br>Ha Mim. By the clear Book...",
            fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux<br>Ha Mim. Par le Livre clair..."
        },
        44: {
            ar: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ<br>حم ۚ وَٱلْكِتَٰبِ ٱلْمُبِينِ",
            en: "In the name of Allah, the Most Gracious, the Most Merciful<br>Ha Mim. By the clear Book...",
            fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux<br>Ha Mim. Par le Livre clair..."
        }
    };

    // Navigation
    document.querySelector('.start-btn').addEventListener('click', () => {
        homePage.style.display = 'none';
        indexPage.style.display = 'block';
    });

    document.querySelectorAll('.index-page li').forEach(li => {
        li.addEventListener('click', () => {
            currentSura = li.getAttribute('data-sura');
            updateContent();
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

    languageSelect.addEventListener('change', (e) => {
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
        arabicText.style.fontSize = `${e.target.value}px`;
        textContent.style.fontSize = `${e.target.value}px`;
    });

    // Mode clair/sombre
    document.querySelector('.theme-toggle').addEventListener('click', () => {
        const currentTheme = document.body.className === 'dark' ? 'light' : 'dark';
        themeSelect.value = currentTheme;
        document.body.className = currentTheme === 'dark' ? 'dark' : '';
    });

    // Favoris
    document.querySelector('.favorite-btn').addEventListener('click', () => {
        if (!favorites.includes(currentSura)) {
            favorites.push(currentSura);
            updateFavorites();
        }
    });

    function updateFavorites() {
        favoritesList.innerHTML = '';
        favorites.forEach(sura => {
            const li = document.createElement('li');
            li.textContent = `Surat ${sura}`;
            li.addEventListener('click', () => {
                currentSura = sura;
                updateContent();
                favoritesPage.style.display = 'none';
                readingPage.style.display = 'block';
            });
            favoritesList.appendChild(li);
        });
    }

    // Personnalisation
    document.querySelector('.customize-btn').addEventListener('click', () => {
        document.getElementById('customizePanel').style.display = 
            document.getElementById('customizePanel').style.display === 'none' ? 'flex' : 'none';
    });

    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('readingContent').style.backgroundColor = btn.getAttribute('data-color');
        });
    });

    // Assistant IA
    document.querySelector('.ai-btn').addEventListener('click', () => {
        alert('Assistant IA : Posez une question sur le livre (API Gemini à intégrer)');
    });

    // Recherche
    searchBar.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const content = languageSelect.value === 'ar' ? arabicText.innerHTML : textContent.innerHTML;
        const words = content.split(/<br>/).join(' ').split(' ');
        const matches = [];
        words.forEach((word, index) => {
            if (word.toLowerCase().includes(searchTerm)) {
                matches.push({ word, index });
            }
        });
        console.log(matches); // Pour débogage
        // Implémentation de la navigation manuelle pour l'instant (à améliorer avec surbrillance)
        if (matches.length > 0) {
            alert(`Occurrences trouvées : ${matches.length}. Cliquez pour naviguer.`);
            matches[0].index; // Placeholder pour navigation
        }
    });

    function updateContent() {
        const content = suraContents[currentSura][languageSelect.value];
        suraTitle.textContent = `Surat ${currentSura}`;
        if (languageSelect.value === 'ar') {
            arabicText.innerHTML = content;
            textContent.style.display = 'none';
            arabicText.style.display = 'block';
        } else {
            textContent.innerHTML = content;
            arabicText.style.display = 'none';
            textContent.style.display = 'block';
        }
    }

    // Sécurité
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey || e.key === 'PrintScreen') {
            e.preventDefault();
        }
    });

    document.addEventListener('contextmenu', (e) => e.preventDefault());
});
