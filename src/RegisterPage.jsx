import { useState, useRef, useEffect } from 'react';
import { Camera, UserCircle2, RefreshCw, Sparkles } from 'lucide-react';

export default function RegisterPage({ onRegister }) {
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [username, setUsername] = useState('');
  const [cameraError, setCameraError] = useState(null);
  const [particles, setParticles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shake, setShake] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Generate floating particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 30; i++) {
        newParticles.push({
          id: i,
          left: Math.random() * 100,
          size: Math.random() * 6 + 2,
          duration: Math.random() * 15 + 10,
          delay: Math.random() * -20,
          opacity: Math.random() * 0.4 + 0.1
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
    if (isSubmitting) return;
    
    if (!capturedImage) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      alert('Il faut prendre une photo !');
      return;
    }
    if (!username.trim()) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      alert('Veuillez entrer votre nom !');
      return;
    }
    
    setIsSubmitting(true);
    
    if (onRegister) {
      onRegister({
        username: username,
        photo: capturedImage
      });
    }
  };

  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
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
          width: 100% !important;
          max-width: 100% !important;
        }
        #root {
          min-height: 100vh;
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0) rotate(0deg);
          }
          33% {
            transform: translateY(-20px) translateX(10px) rotate(5deg);
          }
          66% {
            transform: translateY(-10px) translateX(-10px) rotate(-5deg);
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
        @keyframes slideInScale {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        @keyframes buttonPress {
          0% { transform: scale(1); }
          50% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes glowPulse {
          0%, 100% { filter: drop-shadow(0 0 10px rgba(167, 139, 250, 0.5)); }
          50% { filter: drop-shadow(0 0 20px rgba(167, 139, 250, 0.8)); }
        }
        .btn-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        .btn-hover::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }
        .btn-hover:hover::before {
          width: 300px;
          height: 300px;
        }
        .btn-hover:hover:not(:disabled) {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
        }
        .btn-hover:active:not(:disabled) {
          animation: buttonPress 0.3s ease;
        }
        .input-focus {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .input-focus:focus {
          transform: scale(1.03);
          box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4);
        }
        .camera-circle {
          animation: float 4s ease-in-out infinite;
          transition: all 0.4s ease;
        }
        .camera-circle:hover {
          transform: scale(1.05);
        }
        .shake {
          animation: shake 0.5s ease;
        }
        .sparkle {
          animation: glowPulse 2s ease-in-out infinite;
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
        boxSizing: 'border-box',
        overflow: 'hidden',
        position: 'relative'
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
        <div 
          className={shake ? 'shake' : ''}
          style={{ 
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
            animation: 'slideInScale 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
          
          {/* Title with sparkle icon */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            marginBottom: '2rem'
          }}>
            <Sparkles size={32} color="white" className="sparkle" />
            <h1 style={{
              textAlign: 'center',
              color: 'white',
              fontSize: '2rem',
              fontWeight: '700',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
              animation: 'fadeInUp 0.8s ease-out 0.2s backwards'
            }}>
              Créer Votre Profil
            </h1>
            <Sparkles size={32} color="white" className="sparkle" style={{ animationDelay: '1s' }} />
          </div>
        
          {/* Camera/Photo Circle */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            width: '100%', 
            marginBottom: '2rem',
            animation: 'fadeInUp 0.8s ease-out 0.3s backwards'
          }}>
            <div 
              className="camera-circle"
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
                boxShadow: capturedImage 
                  ? '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 3px rgba(16, 185, 129, 0.5)'
                  : '0 15px 35px rgba(0, 0, 0, 0.3)',
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
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            width: '100%', 
            marginBottom: '1.5rem',
            animation: 'fadeInUp 0.8s ease-out 0.4s backwards'
          }}>
            {capturedImage ? (
              <button
                onClick={retakePhoto}
                disabled={isSubmitting}
                className="btn-hover"
                style={{
                  padding: '0.875rem 2.5rem',
                  background: isSubmitting 
                    ? 'rgba(255, 255, 255, 0.2)' 
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: '2px solid rgba(255, 255, 255, 0.5)',
                  borderRadius: '25px',
                  fontWeight: '600',
                  fontSize: '1rem',
                  color: 'white',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.5 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: isSubmitting ? 'none' : '0 8px 20px rgba(0, 0, 0, 0.2)'
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
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            width: '100%', 
            marginBottom: '2rem',
            animation: 'fadeInUp 0.8s ease-out 0.5s backwards'
          }}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isSubmitting}
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
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                opacity: isSubmitting ? 0.6 : 1,
                cursor: isSubmitting ? 'not-allowed' : 'text'
              }}
            />
          </div>

          {/* Submit Button */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            width: '100%',
            animation: 'fadeInUp 0.8s ease-out 0.6s backwards'
          }}>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="btn-hover"
              style={{
                width: '100%',
                padding: '1.125rem 2rem',
                background: isSubmitting 
                  ? 'rgba(255, 255, 255, 0.3)' 
                  : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                border: '2px solid rgba(255, 255, 255, 0.5)',
                borderRadius: '25px',
                fontWeight: '700',
                fontSize: '1.125rem',
                color: 'white',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                boxShadow: isSubmitting 
                  ? 'none' 
                  : '0 10px 30px rgba(245, 87, 108, 0.4)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                opacity: isSubmitting ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {isSubmitting ? (
                <>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '3px solid rgba(255, 255, 255, 0.3)',
                    borderTop: '3px solid white',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                  }} />
                  En cours...
                </>
              ) : (
                "C'est Parti ! 🚀"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}