import { useState, useEffect } from 'react';
import { Home } from 'lucide-react';

const categories = [
  { id: 'animals', emoji: '🐾', name: 'Animaux' },
  { id: 'food', emoji: '🍎', name: 'Nourriture' },
  { id: 'objects', emoji: '🔧', name: 'Objets' },
  { id: 'countries', emoji: '🌍', name: 'Pays' },
  { id: 'jobs', emoji: '💼', name: 'Métiers' },
  { id: 'sports', emoji: '⚽', name: 'Sports' },
  { id: 'celebrities', emoji: '⭐', name: 'Célébrités' },
  { id: 'brands', emoji: '🏷️', name: 'Marques' },
  { id: 'empty', emoji: '🫙', name: 'Vide' }
];

export default function CategorySettings({ onBack, database, lobbyId }) {
  const [selectedCategories, setSelectedCategories] = useState(new Set(['animals', 'food', 'objects']));
  const [triangles, setTriangles] = useState([]);

  // Generate animated triangles
  useEffect(() => {
    const generateTriangles = () => {
      const newTriangles = [];
      for (let i = 0; i < 8; i++) {
        newTriangles.push({
          id: i,
          left: Math.random() * 100,
          size: Math.random() * 30 + 20,
          duration: Math.random() * 8 + 12,
          delay: i * 2.5 - 20,
          opacity: Math.random() * 0.25
        });
      }
      setTriangles(newTriangles);
    };
    generateTriangles();

    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'auto';
  }, []);

  // Load selected categories from Firebase
  useEffect(() => {
    if (!database || !lobbyId) return;

    const { ref, onValue } = database;
    const categoriesRef = ref(database.db, `lobbies/${lobbyId}/selectedCategories`);

    const unsubscribe = onValue(categoriesRef, (snapshot) => {
      const data = snapshot.val();
      if (data && Array.isArray(data)) {
        setSelectedCategories(new Set(data));
      }
    });

    return () => unsubscribe();
  }, [database, lobbyId]);

  const toggleCategory = async (categoryId) => {
    const newSelected = new Set(selectedCategories);
    
    if (newSelected.has(categoryId)) {
      // Don't allow deselecting if it's the last one
      if (newSelected.size === 1) {
        alert('Vous devez sélectionner au moins une catégorie!');
        return;
      }
      newSelected.delete(categoryId);
    } else {
      newSelected.add(categoryId);
    }
    
    setSelectedCategories(newSelected);

    // Save to Firebase
    if (database && lobbyId) {
      const { ref, set } = database;
      const categoriesRef = ref(database.db, `lobbies/${lobbyId}/selectedCategories`);
      await set(categoriesRef, Array.from(newSelected));
    }
  };

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          overflow-x: hidden !important;
          width: 100% !important;
        }
        @keyframes float-down {
          0% {
            transform: translateY(-100px) rotate(0deg);
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
          }
        }
      `}</style>
      
      <div style={{ 
        minHeight: '100vh', 
        width: '100vw', 
        background: 'linear-gradient(to bottom, #a8a8a8ff, #686868ff)', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        padding: '2rem', 
        paddingBottom: '100px', 
        margin: 0, 
        boxSizing: 'border-box', 
        position: 'relative' 
      }}>
        
        {/* Animated Triangles Background */}
        {triangles.map(triangle => (
          <div
            key={triangle.id}
            style={{
              position: 'absolute',
              left: `${triangle.left}%`,
              top: '-100px',
              width: 0,
              height: 0,
              borderLeft: `${triangle.size}px solid transparent`,
              borderRight: `${triangle.size}px solid transparent`,
              borderBottom: `${triangle.size * 1.732}px solid rgba(153, 255, 153, ${triangle.opacity})`,
              animation: `float-down ${triangle.duration}s linear ${triangle.delay}s infinite`,
              pointerEvents: 'none'
            }}
          />
        ))}

        {/* Home Icon */}
        <button
          onClick={onBack}
          style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.5rem',
            backgroundColor: '#b3b3b3ff',
            border: '3px solid #6f6f6fff',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 20
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#c9c9c9ff'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#b3b3b3ff'}
        >
          <Home size={30} color="#6f6f6fff" />
        </button>

        {/* Title */}
        <div style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#6f6f6fff',
          marginTop: '1rem',
          marginBottom: '2rem',
          textAlign: 'center',
          zIndex: 10
        }}>
          Choisir les catégories
        </div>

        {/* Category Grid */}
        <div style={{
          width: '100%',
          maxWidth: '600px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.5rem',
          position: 'relative',
          zIndex: 10
        }}>
          {categories.map(category => {
            const isSelected = selectedCategories.has(category.id);
            
            return (
              <div
                key={category.id}
                onClick={() => toggleCategory(category.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.75rem',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  transform: isSelected ? 'scale(1)' : 'scale(0.95)',
                  opacity: isSelected ? 1 : 0.5
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = isSelected ? 'scale(1)' : 'scale(0.95)';
                }}
              >
                {/* Emoji Box */}
                <div style={{
                  width: '120px',
                  height: '120px',
                  backgroundColor: '#b3b3b3ff',
                  border: `4px solid ${isSelected ? '#74a887ff' : '#6f6f6fff'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '3.5rem',
                  borderRadius: '8px',
                  boxShadow: isSelected ? '0 4px 12px rgba(116, 168, 135, 0.3)' : 'none'
                }}>
                  {category.emoji}
                </div>

                {/* Category Name */}
                <div style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: isSelected ? '#74a887ff' : '#6f6f6fff',
                  textAlign: 'center'
                }}>
                  {category.name}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Count */}
        <div style={{
          marginTop: '2rem',
          padding: '1rem 2rem',
          backgroundColor: '#b3b3b3ff',
          border: '3px solid #6f6f6fff',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: '600',
          color: '#6f6f6fff',
          zIndex: 10
        }}>
          {selectedCategories.size} catégorie{selectedCategories.size > 1 ? 's' : ''} sélectionnée{selectedCategories.size > 1 ? 's' : ''}
        </div>
      </div>
    </>
  );
}