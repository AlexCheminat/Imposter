import { useState, useEffect } from 'react';
import { RotateCw, Play } from 'lucide-react';

// Shortened word categories for context limits
const wordCategories = {
  animals: [
    { word: 'Chat', hint: 'Indépendant' }, { word: 'Chien', hint: 'Loyal' }, { word: 'Lion', hint: 'Fierté' },
    { word: 'Éléphant', hint: 'Savane' }, { word: 'Girafe', hint: 'Hauteur' }, { word: 'Tigre', hint: 'Solitaire' }
  ],
  food: [
    { word: 'Pomme', hint: 'Fruit' }, { word: 'Banane', hint: 'Énergie' }, { word: 'Orange', hint: 'Agrume' },
    { word: 'Pain', hint: 'Boulangerie' }, { word: 'Fromage', hint: 'Laitier' }, { word: 'Chocolat', hint: 'Cacao' }
  ],
  objects: [
    { word: 'Table', hint: 'Surface' }, { word: 'Chaise', hint: 'Posture' }, { word: 'Téléphone', hint: 'Communication' },
    { word: 'Ordinateur', hint: 'Traitement' }, { word: 'Stylo', hint: 'Trace' }, { word: 'Livre', hint: 'Chapitre' }
  ],
  countries: [
    { word: 'France', hint: 'Europe' }, { word: 'Italie', hint: 'Péninsule' }, { word: 'Japon', hint: 'Insulaire' },
    { word: 'Brésil', hint: 'Amazonie' }, { word: 'Canada', hint: 'Érable' }, { word: 'Australie', hint: 'Océanie' }
  ],
  jobs: [
    { word: 'Médecin', hint: 'Soins' }, { word: 'Enseignant', hint: 'École' }, { word: 'Ingénieur', hint: 'Technique' },
    { word: 'Cuisinier', hint: 'Recettes' }, { word: 'Policier', hint: 'Sécurité' }, { word: 'Architecte', hint: 'Bâtiment' }
  ],
  sports: [
    { word: 'Football', hint: 'Ballon' }, { word: 'Tennis', hint: 'Raquette' }, { word: 'Natation', hint: 'Eau' },
    { word: 'Basketball', hint: 'Panier' }, { word: 'Cyclisme', hint: 'Vélo' }, { word: 'Ski', hint: 'Neige' }
  ],
  celebrities: [
    { word: 'Brad Pitt', hint: 'Acteur' }, { word: 'Beyoncé', hint: 'Queen' }, { word: 'Messi', hint: 'Argentin' },
    { word: 'Elon Musk', hint: 'Technologie' }, { word: 'Omar Sy', hint: 'Charisme' }, { word: 'Rihanna', hint: 'Barbade' }
  ],
  brands: [
    { word: 'Nike', hint: 'Sport' }, { word: 'Apple', hint: 'Technologie' }, { word: 'Coca-Cola', hint: 'Boisson' },
    { word: 'McDonald\'s', hint: 'Fast food' }, { word: 'Amazon', hint: 'E-commerce' }, { word: 'Tesla', hint: 'Électrique' }
  ]
};

function getRandomWord(categories = ['animals', 'food', 'objects']) {
  const allWords = [];
  categories.forEach(c => {
    if (wordCategories[c]) {
      wordCategories[c].forEach(item => allWords.push({ ...item, category: c }));
    }
  });
  return allWords.length > 0 ? allWords[Math.floor(Math.random() * allWords.length)] : { word: 'Pomme', hint: 'Fruit', category: 'food' };
}

function getRandomWordFromCategory(category) {
  if (!wordCategories[category] || wordCategories[category].length === 0) {
    return { word: 'Pomme', hint: 'Fruit', category: 'food' };
  }
  const words = wordCategories[category];
  const randomWord = words[Math.floor(Math.random() * words.length)];
  return { ...randomWord, category };
}

export default function WordSelectionPage({ players = [], currentUser, onConfirm, lobbyId, database, imposterId }) {
  const [particles, setParticles] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [generatedWord, setGeneratedWord] = useState('');
  const [imposterWord, setImposterWord] = useState('');
  const [hint, setHint] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [startingPlayer, setStartingPlayer] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState(['animals', 'food', 'objects']);
  const [inTheDarkMode, setInTheDarkMode] = useState(false);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [showCover, setShowCover] = useState(true);
  const [lastGeneratedAt, setLastGeneratedAt] = useState(null);
  
  const sortedPlayers = [...players].sort((a, b) => a.joinedAt - b.joinedAt);
  const isFirstPlayer = sortedPlayers.length > 0 && currentUser && sortedPlayers[0].id === currentUser.firebaseId;
  const isImposter = currentUser && imposterId && currentUser.firebaseId === imposterId;

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 20; i++) {
        newParticles.push({
          id: i, left: Math.random() * 100, size: Math.random() * 4 + 2,
          duration: Math.random() * 10 + 15, delay: Math.random() * -20, opacity: Math.random() * 0.3 + 0.1
        });
      }
      setParticles(newParticles);
    };
    generateParticles();
  }, []);

  // Load settings
  useEffect(() => {
    if (!database || !lobbyId) return;
    const { ref, onValue } = database;
    
    const categoriesRef = ref(database.db, `lobbies/${lobbyId}/selectedCategories`);
    const gameModeRef = ref(database.db, `lobbies/${lobbyId}/inTheDarkMode`);

    const unsubCat = onValue(categoriesRef, (s) => {
      const d = s.val();
      if (d && Array.isArray(d) && d.length > 0) setSelectedCategories(d);
      setCategoriesLoaded(true);
    });

    const unsubMode = onValue(gameModeRef, (s) => {
      const d = s.val();
      if (d !== null) setInTheDarkMode(d);
    });

    return () => { unsubCat(); unsubMode(); };
  }, [database, lobbyId]);

  // Generate and sync words
  useEffect(() => {
    if (!database || !lobbyId || !categoriesLoaded) return;
    const { ref, onValue, set } = database;
    const wordRef = ref(database.db, `lobbies/${lobbyId}/currentWord`);

    const unsub = onValue(wordRef, async (s) => {
      const d = s.val();
      if (d && d.word) {
        // Check if the word was refreshed (new timestamp)
        if (d.generatedAt && lastGeneratedAt && d.generatedAt !== lastGeneratedAt) {
          setShowCover(true);
        }
        
        setGeneratedWord(d.word);
        setImposterWord(d.imposterWord || '');
        setHint(d.hint || '');
        setCategory(d.category || '');
        setStartingPlayer(d.startingPlayer || null);
        setLastGeneratedAt(d.generatedAt);
        setLoading(false);
        setIsRefreshing(false);
      } else {
        const mainWord = getRandomWord(selectedCategories);
        
        // Generate a different word for imposter from the SAME category
        let impWord = getRandomWordFromCategory(mainWord.category);
        let attempts = 0;
        while (impWord.word === mainWord.word && attempts < 10) {
          impWord = getRandomWordFromCategory(mainWord.category);
          attempts++;
        }
        
        const randPlayer = players[Math.floor(Math.random() * players.length)];
        const timestamp = Date.now();
        
        await set(wordRef, {
          word: mainWord.word,
          imposterWord: impWord.word,
          hint: mainWord.hint,
          category: mainWord.category,
          startingPlayer: randPlayer ? randPlayer.username : null,
          generatedAt: timestamp
        });
        
        setLastGeneratedAt(timestamp);
      }
    });
    return () => unsub();
  }, [database, lobbyId, players, selectedCategories, categoriesLoaded, lastGeneratedAt]);

  const handleRefresh = async () => {
    if (!database || !lobbyId || isRefreshing) return;
    setIsRefreshing(true);
    
    const { ref, set } = database;
    const wordRef = ref(database.db, `lobbies/${lobbyId}/currentWord`);
    const imposterRef = ref(database.db, `lobbies/${lobbyId}/gameState/imposterId`);
    
    const mainWord = getRandomWord(selectedCategories);
    
    // Generate a different word for imposter from the SAME category
    let impWord = getRandomWordFromCategory(mainWord.category);
    let attempts = 0;
    while (impWord.word === mainWord.word && attempts < 10) {
      impWord = getRandomWordFromCategory(mainWord.category);
      attempts++;
    }
    
    const randPlayer = players[Math.floor(Math.random() * players.length)];
    const randImposter = players[Math.floor(Math.random() * players.length)];
    
    await set(wordRef, {
      word: mainWord.word,
      imposterWord: impWord.word,
      hint: mainWord.hint,
      category: mainWord.category,
      startingPlayer: randPlayer ? randPlayer.username : null,
      generatedAt: Date.now()
    });
    
    await set(imposterRef, randImposter ? randImposter.id : null);
  };

  const handleConfirm = () => {
    if (!selectedPlayer) {
      alert('Vous devez choisir un joueur!');
      return;
    }
    if (onConfirm) onConfirm({ selectedPlayer, word: generatedWord, hint, category });
  };

  const handleReveal = () => setShowCover(false);

  // Display word logic
  const displayWord = (isImposter && inTheDarkMode) ? imposterWord : generatedWord;
  const showHintOnly = isImposter && !inTheDarkMode;

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @keyframes drift {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
        }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.5), 0 0 40px rgba(239, 68, 68, 0.3); }
          50% { box-shadow: 0 0 30px rgba(239, 68, 68, 0.7), 0 0 60px rgba(239, 68, 68, 0.5); }
        }
        @keyframes fadeOut { from { opacity: 1; visibility: visible; } to { opacity: 0; visibility: hidden; } }
        @keyframes scaleUp { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .btn-hover { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .btn-hover:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2); }
        .player-card { transition: all 0.3s ease; }
        .player-card:not(.disabled):hover { transform: translateX(5px); }
        .cover-fade-out { animation: fadeOut 0.5s ease-out forwards; }
      `}</style>
      
      {showCover && (
        <div onClick={handleReveal} className={!showCover ? 'cover-fade-out' : ''}
          style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, cursor: 'pointer'
          }}>
          <div style={{ textAlign: 'center', animation: 'scaleUp 0.6s ease-out', padding: '2rem' }}>
            <div style={{ fontSize: '5rem', marginBottom: '2rem', filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3))' }}>🔒</div>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.25rem', marginBottom: '3rem', maxWidth: '500px', margin: '0 auto 3rem auto' }}>
              👆 Cliquez n'importe où pour révéler
            </p>
          </div>
        </div>
      )}
      
      <div style={{ 
        minHeight: '100vh', width: '100vw', margin: '0',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)', 
        display: 'flex', flexDirection: 'column', alignItems: 'center', 
        padding: '2rem', paddingBottom: '3rem', boxSizing: 'border-box', position: 'relative', overflow: 'hidden'
      }}>
        
        {particles.map(p => (
          <div key={p.id} style={{
            position: 'absolute', left: `${p.left}%`, bottom: '-20px', width: `${p.size}px`, height: `${p.size}px`,
            borderRadius: '50%', backgroundColor: `rgba(255, 255, 255, ${p.opacity})`,
            animation: `drift ${p.duration}s linear ${p.delay}s infinite`, pointerEvents: 'none'
          }} />
        ))}
        
        <div style={{ 
          width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center', 
          gap: '2rem', position: 'relative', zIndex: 10, marginTop: '2rem', animation: 'fadeInUp 0.6s ease-out'
        }}>
        
          <h1 style={{
            textAlign: 'center', color: 'white', fontSize: '2rem', fontWeight: '700',
            textShadow: '0 4px 15px rgba(0, 0, 0, 0.3)', marginBottom: '-1rem'
          }}>
            {showHintOnly ? '👹👺🦹😈🦹🏿🎭 Vous êtes l\'Imposteur!' : '🎯 Votre Mot'}
          </h1>

          <div style={{
            width: '100%', padding: '2.5rem 2rem',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(20px)',
            border: '3px solid rgba(255, 255, 255, 0.4)',
            borderRadius: '30px', textAlign: 'center', fontSize: '2rem', fontWeight: '700', color: 'white',
            minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: '1rem', position: 'relative',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.3)'
          }}>
            {isFirstPlayer && (
              <button onClick={handleRefresh} disabled={isRefreshing || loading} className="btn-hover"
                style={{
                  position: 'absolute', top: '1rem', right: '1rem',
                  background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 255, 255, 0.4)', borderRadius: '50%',
                  width: '45px', height: '45px', cursor: isRefreshing || loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: isRefreshing || loading ? 0.5 : 1, padding: 0
                }}>
                <RotateCw size={22} color="white" strokeWidth={2}
                  style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
              </button>
            )}

            {loading ? (
              <div style={{ fontSize: '1.25rem' }}>Chargement...</div>
            ) : (
              <>
                {showHintOnly ? (
                  <div style={{ 
                    fontSize: '1.125rem', padding: '0.75rem 1.5rem',
                    background: 'rgba(255, 255, 255, 0.15)', borderRadius: '15px', backdropFilter: 'blur(10px)'
                  }}>
                    💡 Indice: {hint}
                  </div>
                ) : (
                  <div style={{ fontSize: '2.5rem', textShadow: '0 2px 8px rgba(0, 0, 0, 0.4)' }}>
                    {displayWord}
                  </div>
                )}
                {startingPlayer && (
                  <div style={{ 
                    fontSize: '1rem', opacity: 0.9, padding: '0.5rem 1rem',
                    background: 'rgba(255, 255, 255, 0.15)', borderRadius: '12px',
                    display: 'flex', alignItems: 'center', gap: '0.5rem'
                  }}>
                    <Play size={18} fill="white" />
                    {startingPlayer} commence
                  </div>
                )}
              </>
            )}
          </div>

          <div style={{
            width: '100%', background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(20px)',
            borderRadius: '30px', border: '2px solid rgba(255, 255, 255, 0.3)',
            padding: '2rem 1.5rem', boxShadow: '0 15px 40px rgba(0, 0, 0, 0.3)'
          }}>
            <h2 style={{
              color: 'white', fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem',
              textAlign: 'center', textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
            }}>
              Qui est l'Imposteur?
            </h2>

            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {players.map((p, i) => {
                const isCurrent = currentUser && p.id === currentUser.firebaseId;
                const isSelected = selectedPlayer && selectedPlayer.id === p.id;
                const cannotSelect = isCurrent;
                
                return (
                  <div key={p.id} onClick={() => !cannotSelect && setSelectedPlayer(p)}
                    className={`player-card ${cannotSelect ? 'disabled' : ''}`}
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: '1rem',
                      cursor: cannotSelect ? 'not-allowed' : 'pointer',
                      padding: '0.5rem', opacity: cannotSelect ? 0.5 : 1
                    }}>
                    <div style={{
                      width: '70px', height: '70px', borderRadius: '50%', overflow: 'hidden',
                      border: isCurrent 
                        ? '3px solid rgba(16, 185, 129, 0.8)'
                        : '3px solid rgba(255, 255, 255, 0.6)',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)', flexShrink: 0,
                      boxShadow: isCurrent 
                        ? '0 0 20px rgba(16, 185, 129, 0.5)'
                        : '0 4px 15px rgba(0, 0, 0, 0.2)'
                    }}>
                      <img src={p.photo} alt={p.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>

                    <div style={{
                      flex: 1, padding: '1rem 1.5rem',
                      background: isCurrent 
                        ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(5, 150, 105, 0.3) 100%)'
                        : 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      border: isSelected 
                        ? '3px solid #ef4444'
                        : (isCurrent 
                          ? '2px solid rgba(16, 185, 129, 0.6)'
                          : '2px solid rgba(255, 255, 255, 0.4)'),
                      borderRadius: '20px', textAlign: 'center', fontSize: '1.125rem', fontWeight: '600', color: 'white',
                      boxShadow: isSelected 
                        ? '0 0 25px rgba(239, 68, 68, 0.6), 0 4px 15px rgba(0, 0, 0, 0.15)'
                        : '0 4px 15px rgba(0, 0, 0, 0.15)',
                      minWidth: '10rem'
                    }}>
                      {p.username}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button onClick={handleConfirm} className="btn-hover"
            style={{
              width: '100%', maxWidth: '400px', padding: '1.25rem 3rem',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              border: '3px solid rgba(255, 255, 255, 0.5)', borderRadius: '25px',
              fontWeight: '700', fontSize: '1.25rem', color: 'white', cursor: 'pointer',
              boxShadow: '0 10px 30px rgba(245, 87, 108, 0.4)',
              textTransform: 'uppercase', letterSpacing: '1px'
            }}>
            Voter 🗳️
          </button>
        </div>
      </div>
    </>
  );
}