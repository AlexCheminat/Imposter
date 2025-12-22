const handleRefresh = async () => {
    if (!database || !lobbyId || isRefreshing) return;
    
    setIsRefreshing(true);
    
    const { ref, set } = database;
    const wordRef = ref(database.db, `lobbies/${lobbyId}/currentWord`);
    const imposterRef = ref(database.db, `lobbies/${lobbyId}/imposterId`);
    
    // Generate new random word
    const randomWordData = getRandomWord(['animals', 'food', 'objects', 'countries', 'jobs', 'sports', 'celebrities', 'brands']);
    
    // Select random starting player
    const randomPlayerIndex = Math.floor(Math.random() * players.length);
    const randomPlayer = players[randomPlayerIndex];
    
    // Select random imposter (different from starting player if possible)
    let randomImposterIndex;
    if (players.length > 1) {
      do {
        randomImposterIndex = Math.floor(Math.random() * players.length);
      } while (randomImposterIndex === randomPlayerIndex && players.length > 1);
    } else {
      randomImposterIndex = 0;
    }
    const randomImposter = players[randomImposterIndex];
    
    // Update both word and imposter in Firebase
    await set(wordRef, {
      word: randomWordData.word,
      hint: randomWordData.hint,
      category: randomWordData.category,
      startingPlayer: randomPlayer ? randomPlayer.username : null,
      generatedAt: Date.now()
    });
    
    await set(imposterRef, randomImposter ? randomImposter.id : null);
  };