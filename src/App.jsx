import { useState, useRef, useEffect } from 'react';
import { Camera, UserCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [username, setUsername] = useState('');
  const [cameraError, setCameraError] = useState(null);
  const [triangles, setTriangles] = useState([]);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Generate random triangles with staggered delays
  useEffect(() => {
    const generateTriangles = () => {
      const newTriangles = [];
      for (let i = 0; i < 15; i++) {
        newTriangles.push({
          id: i,
          left: Math.random() * 100,
          size: Math.random() * 30 + 20,
          duration: Math.random() * 8 + 12,
          delay: i * 2.5, // Spread out the start times
          opacity: Math.random() * 0.25 + 0.1
        });
      }
      setTriangles(newTriangles);
    };
    generateTriangles();
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
      alert('Please take a photo first!');
      return;
    }
    if (!username.trim()) {
      alert('Please enter a username!');
      return;
    }
    
    console.log('Registering:', { username, photo: capturedImage });
    alert(`Welcome, ${username}! 🎉`);
  };

  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';
    
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
      
      <div style={{ minHeight: '100vh', width: '100vw', backgroundColor: '#bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', margin: 0, boxSizing: 'border-box', position: 'fixed', top: 0, left: 0, overflow: 'hidden' }}>
        
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
              borderBottom: `${triangle.size * 1.732}px solid rgba(147, 197, 253, ${triangle.opacity})`,
              animation: `float-down ${triangle.duration}s linear ${triangle.delay}s infinite`,
              pointerEvents: 'none'
            }}
          />
        ))}
        
        <div style={{ width: '100%', maxWidth: '28rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', position: 'relative', zIndex: 10 }}>
        
          {/* Camera/Photo Circle */}
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <div 
              style={{
                width: '225px',
                height: '225px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '10px solid #38475eff',
                backgroundColor: '#93c5fd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
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
                <div className="text-center text-gray-700 px-8">
                  <UserCircle2 size={80} className="mx-auto mb-4 opacity-50" />
                  <p className="text-sm">
                    {cameraError ? `Error: ${cameraError}` : 'Camera loading...'}
                  </p>
                  {cameraError && (
                    <button 
                      onClick={startCamera}
                      className="mt-4 px-4 py-2 bg-blue-400 border-2 border-gray-800 rounded text-sm"
                    >
                      Retry
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {/* Take Photo Button */}
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            {capturedImage ? (
              <button
                onClick={retakePhoto}
                style={{
                  padding: '1rem 5rem',
                  backgroundColor: '#93c5fd',
                  border: '4px solid #38475eff',
                  borderRadius: '9999px',
                  fontWeight: 'bold',
                  fontSize: '1.125rem',
                  color: '#38475eff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  minWidth: '190px'
                }}
              >
                Retake Photo
              </button>
            ) : (
              <button
                onClick={takePhoto}
                disabled={!stream}
                style={{
                  padding: '1rem 5rem',
                  backgroundColor: '#93c5fd',
                  border: '4px solid #38475eff',
                  borderRadius: '9999px',
                  fontWeight: 'bold',
                  fontSize: '1.125rem',
                  color: '#38475eff',
                  cursor: stream ? 'pointer' : 'not-allowed',
                  opacity: stream ? 1 : 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  minWidth: '190px'
                }}
              >
                <Camera size={24} />
                Take Photo
              </button>
            )}
          </div>

          {/* Username Input */}
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username..."
              style={{
                width: '300px',
                height: '70px',
                padding: '1.5rem',
                backgroundColor: '#93c5fd',
                border: '4px solid #38475eff',
                textAlign: 'center',
                fontSize: '1.125rem',
                fontWeight: '500',
                color: '#38475eff',
                outline: 'none'
              }}
            />
          </div>

          {/* Let's Go Button */}
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%', paddingTop: '1rem' }}>
            <button
              onClick={handleSubmit}
              style={{
                padding: '1rem 5rem',
                backgroundColor: '#93c5fd',
                border: '4px solid #38475eff',
                borderRadius: '9999px',
                fontWeight: 'bold',
                fontSize: '1.25rem',
                color: '#38475eff',
                cursor: 'pointer',
                minWidth: '340px'
              }}
            >
              Let's Go !!!
            </button>
          </div>
        </div>
      </div>
    </>
  );
}