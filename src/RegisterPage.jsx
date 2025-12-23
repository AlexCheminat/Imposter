import { useState, useRef, useEffect } from 'react';
import { Camera, UserCircle2, RefreshCw } from 'lucide-react';

export default function RegisterPage({ onRegister }) {
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [username, setUsername] = useState('');
  const [cameraError, setCameraError] = useState(null);
  const [particles, setParticles] = useState([]);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Generate floating particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 20; i++) {
        newParticles.push({
          id: i,
          left: Math.random() * 100,
          size: Math.random() * 4 + 2,
          duration: Math.random() * 10 + 15,
          delay: Math.random() * -20,
          opacity: Math.random() * 0.3 + 0.1
        });
      }
      setParticles(newParticles);
    };
    generateParticles();
  }, []);

  const startCamera = async () => {
    try {
      setCameraError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      streamRef.current = mediaStream;
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        try {
          await videoRef.current.play();
        } catch (playErr) {
          console.error('Play error:', playErr);
        }
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setCameraError(err.message);
      alert(`Could not access camera: ${err.message}. Please check permissions.`);
    }
  };

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(e => console.error('Play error:', e));
    }
  }, [stream]);

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
      context.drawImage(video, 0, 0);
      context.setTransform(1, 0, 0, 1, 0, 0);
      
      const imageData = canvas.toDataURL('image/png');
      setCapturedImage(imageData);
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
        setStream(null);
      }
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  const handleSubmit = () => {
    if (!capturedImage) {
      alert('Il faut prendre une photo !');
      return;
    }
    if (!username.trim()) {
      alert('Veuillez entrer votre nom !');
      return;
    }
    
    if (onRegister) {
      onRegister({
        username: username,
        photo: capturedImage
      });
    } else {
      console.log('Registering:', { username, photo: capturedImage });
      alert(`Bienvenue, ${username}! 🎉`);
    }
  };

  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'auto';
    
    startCamera();
    
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

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
          height: 100% !important;
        }
        #root {
          min-height: 100vh;
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }
        @keyframes drift {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(59, 130, 246, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(59, 130, 246, 0.7), 0 0 60px rgba(59, 130, 246, 0.5);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .btn-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
        .btn-hover:active {
          transform: translateY(0);
        }
        .input-focus {
          transition: all 0.3s ease;
        }
        .input-focus:focus {
          transform: scale(1.02);
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
        }
        .input-focus::placeholder {
          color: rgba(255, 255, 255, 0.7);
        }
      `}</style>
      
      <div style={{ 
        minHeight: '100vh', 
        width: '100%', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '2rem', 
        boxSizing: 'border-box'
      }}>
        
        {/* Floating Particles */}
        {particles.map(particle => (
          <div
            key={particle.id}
            style={{
              position: 'absolute',
              left: `${particle.left}%`,
              bottom: '-20px',
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              borderRadius: '50%',
              backgroundColor: `rgba(255, 255, 255, ${particle.opacity})`,
              animation: `drift ${particle.duration}s linear ${particle.delay}s infinite`,
              pointerEvents: 'none'
            }}
          />
        ))}
        
        {/* Glassmorphism Container */}
        <div style={{ 
          width: '100%', 
          maxWidth: '420px', 
          background: 'rgba(255, 255, 255, 0.15)', 
          backdropFilter: 'blur(20px)',
          borderRadius: '30px',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          padding: '3rem 2rem',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
          position: 'relative',
          zIndex: 10,
          animation: 'fadeInUp 0.6s ease-out'
        }}>
          
          {/* Title */}
          <h1 style={{
            textAlign: 'center',
            color: 'white',
            fontSize: '2rem',
            fontWeight: '700',
            marginBottom: '2rem',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
          }}>
            Créer Votre Profil
          </h1>
        
          {/* Camera/Photo Circle */}
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: '2rem' }}>
            <div 
              style={{
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '5px solid rgba(255, 255, 255, 0.5)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.3)',
                animation: 'float 3s ease-in-out infinite',
                position: 'relative'
              }}
            >
              {capturedImage ? (
                <img 
                  src={capturedImage} 
                  alt="Captured" 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              ) : stream ? (
                <video 
                  ref={videoRef}
                  autoPlay 
                  playsInline
                  muted
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: 'scaleX(-1)'
                  }}
                />
              ) : (
                <div style={{ textAlign: 'center', color: 'white', padding: '1.5rem' }}>
                  <UserCircle2 size={60} style={{ margin: '0 auto', opacity: 0.7, marginBottom: '1rem' }} />
                  <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                    {cameraError ? `Erreur: ${cameraError}` : 'Chargement...'}
                  </p>
                  {cameraError && (
                    <button 
                      onClick={startCamera}
                      className="btn-hover"
                      style={{
                        marginTop: '1rem',
                        padding: '0.5rem 1.5rem',
                        background: 'rgba(255, 255, 255, 0.3)',
                        border: '2px solid rgba(255, 255, 255, 0.5)',
                        borderRadius: '20px',
                        color: 'white',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}
                    >
                      Réessayer
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {/* Take Photo Button */}
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: '1.5rem' }}>
            {capturedImage ? (
              <button
                onClick={retakePhoto}
                className="btn-hover"
                style={{
                  padding: '0.875rem 2.5rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: '2px solid rgba(255, 255, 255, 0.5)',
                  borderRadius: '25px',
                  fontWeight: '600',
                  fontSize: '1rem',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)'
                }}
              >
                <RefreshCw size={20} />
                Reprendre
              </button>
            ) : (
              <button
                onClick={takePhoto}
                disabled={!stream}
                className="btn-hover"
                style={{
                  padding: '0.875rem 2.5rem',
                  background: stream ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(255, 255, 255, 0.2)',
                  border: '2px solid rgba(255, 255, 255, 0.5)',
                  borderRadius: '25px',
                  fontWeight: '600',
                  fontSize: '1rem',
                  color: 'white',
                  cursor: stream ? 'pointer' : 'not-allowed',
                  opacity: stream ? 1 : 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: stream ? '0 8px 20px rgba(0, 0, 0, 0.2)' : 'none'
                }}
              >
                <Camera size={20} />
                Prendre Photo
              </button>
            )}
          </div>

          {/* Username Input */}
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: '2rem' }}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Votre nom..."
              className="input-focus"
              style={{
                width: '100%',
                padding: '1rem 1.5rem',
                background: 'rgba(255, 255, 255, 0.2)',
                border: '2px solid rgba(255, 255, 255, 0.4)',
                borderRadius: '20px',
                textAlign: 'center',
                fontSize: '1rem',
                fontWeight: '500',
                color: 'white',
                outline: 'none',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
              }}
            />
          </div>

          {/* Submit Button */}
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <button
              onClick={handleSubmit}
              className="btn-hover"
              style={{
                width: '100%',
                padding: '1.125rem 2rem',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                border: '2px solid rgba(255, 255, 255, 0.5)',
                borderRadius: '25px',
                fontWeight: '700',
                fontSize: '1.125rem',
                color: 'white',
                cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(245, 87, 108, 0.4)',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
            >
              C'est Parti ! 🚀
            </button>
          </div>
        </div>
      </div>
    </>
  );
}