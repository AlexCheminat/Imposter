import { useState, useRef, useEffect } from 'react';
import { Camera, UserCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [username, setUsername] = useState('');
  const [cameraError, setCameraError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

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
      
      // Flip the canvas horizontally to match the mirrored video
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
      context.drawImage(video, 0, 0);
      context.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
      
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
    startCamera();
    
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1f1f1f', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', margin: 0, boxSizing: 'border-box' }}>
      <div style={{ width: '100%', maxWidth: '28rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
        
        {/* Camera/Photo Circle */}
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <div 
            style={{
              width: '288px',
              height: '288px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '10px solid #7eabeaff',
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
              className="px-16 py-4 bg-blue-300 border-4 border-gray-800 rounded-full font-bold text-lg hover:bg-blue-400 transition-colors"
            >
              Retake Photo
            </button>
          ) : (
            <button
              onClick={takePhoto}
              disabled={!stream}
              className="px-16 py-4 bg-blue-300 border-4 border-gray-800 rounded-full font-bold text-lg hover:bg-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
            className="w-80 px-6 py-4 bg-blue-300 border-4 border-gray-800 text-center text-lg font-medium placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-800"
          />
        </div>

        {/* Let's Go Button */}
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', paddingTop: '1rem' }}>
          <button
            onClick={handleSubmit}
            className="px-20 py-4 bg-blue-300 border-4 border-gray-800 rounded-full font-bold text-xl hover:bg-blue-400 transition-colors"
          >
            Let's Go !!!
          </button>
        </div>
      </div>
    </div>
  );
}