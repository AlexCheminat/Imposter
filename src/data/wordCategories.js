export const wordCategories = {
  animals: [
    { word: 'chat', hint: 'animal domestique' },
    { word: 'chien', hint: 'meilleur ami' },
    { word: 'éléphant', hint: 'grande trompe' },
    { word: 'poisson', hint: 'nage dans l\'eau' }
  ],
  
  food: [
    { word: 'pomme', hint: 'fruit rouge' },
    { word: 'fromage', hint: 'produit laitier' },
    { word: 'pain', hint: 'boulangerie' },
    { word: 'chocolat', hint: 'dessert sucré' }
  ],
  
  objects: [
    { word: 'table', hint: 'meuble plat' },
    { word: 'chaise', hint: 'pour s\'asseoir' }
  ]
};

// Get a random word from specific categories
export function getRandomWord(categories = ['animals', 'food', 'objects']) {
  const allWords = [];
  
  categories.forEach(category => {
    if (wordCategories[category]) {
      wordCategories[category].forEach(item => {
        allWords.push({ ...item, category });
      });
    }
  });
  
  if (allWords.length === 0) {
    return { word: 'pomme', hint: 'fruit', category: 'food' };
  }
  
  return allWords[Math.floor(Math.random() * allWords.length)];
}