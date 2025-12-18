import { useState, useRef, useEffect } from 'react';
import { Camera, UserCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [username, setUsername] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        // Ensure video plays
        videoRef.current.play().catch(e => console.error('Play error:', e));
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert(`Could not access camera: ${err.message}. Please check permissions.`);
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      
      const imageData = canvas.toDataURL('image/png');
      setCapturedImage(imageData);
      
      // Stop camera after taking photo
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
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
    
    // Here you would handle the registration
    console.log('Registering:', { username, photo: capturedImage });
    alert(`Welcome, ${username}! 🎉`);
  };

  useEffect(() => {
    startCamera();
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-blue-200 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        
        {/* Camera Circle */}
        <div className="relative">
          <div className="w-72 h-72 mx-auto rounded-full border-4 border-gray-800 overflow-hidden bg-blue-300 flex items-center justify-center">
            {capturedImage ? (
              <img 
                src={capturedImage} 
                alt="Captured" 
                className="w-full h-full object-cover"
              />
            ) : stream ? (
              <video 
                ref={videoRef}
                autoPlay 
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
            ) : (
              <div className="text-center text-gray-700 px-8">
                <UserCircle2 size={80} className="mx-auto mb-4 opacity-50" />
                <p className="text-sm">Camera loading...</p>
              </div>
            )}
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Take Photo Button */}
        <div className="flex justify-center">
          {capturedImage ? (
            <button
              onClick={retakePhoto}
              className="px-16 py-4 bg-blue-300 border-3 border-gray-800 rounded-full font-bold text-lg hover:bg-blue-400 transition-colors"
            >
              Retake Photo
            </button>
          ) : (
            <button
              onClick={takePhoto}
              disabled={!stream}
              className="px-16 py-4 bg-blue-300 border-3 border-gray-800 rounded-full font-bold text-lg hover:bg-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Camera size={24} />
              Take Photo
            </button>
          )}
        </div>

        {/* Username Input */}
        <div className="flex justify-center">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username..."
            className="w-80 px-6 py-6 bg-blue-300 border-3 border-gray-800 text-center text-lg font-medium placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-800"
          />
        </div>

        {/* Let's Go Button */}
        <div className="flex justify-center pt-4">
          <button
            onClick={handleSubmit}
            className="px-20 py-4 bg-blue-300 border-3 border-gray-800 rounded-full font-bold text-xl hover:bg-blue-400 transition-colors"
          >
            Let's Go !!!
          </button>
        </div>
      </div>
    </div>
  );
}