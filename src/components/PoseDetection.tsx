import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, CameraOff } from 'lucide-react';

interface PoseDetectionProps {
  onPoseDetected: (pose: string, confidence: number) => void;
}

const PoseDetection: React.FC<PoseDetectionProps> = ({ onPoseDetected }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const poseLandmarkerRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const lastVideoTimeRef = useRef(-1);

  useEffect(() => {
    loadPoseLandmarker();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const loadPoseLandmarker = async () => {
    try {
      setIsLoading(true);
      // Import MediaPipe modules
      const { PoseLandmarker, FilesetResolver, DrawingUtils } = await import('@mediapipe/tasks-vision');
      
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
      );
      
      poseLandmarkerRef.current = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
          delegate: "GPU"
        },
        runningMode: "VIDEO",
        numPoses: 1
      });
      
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load pose landmarker:', error);
      setIsLoading(false);
    }
  };

  const analyzePose = (landmarks: any) => {
    if (!landmarks || landmarks.length === 0) return;
    
    const pose = landmarks[0];
    const leftShoulder = pose[11];
    const rightShoulder = pose[12];
    const leftElbow = pose[13];
    const rightElbow = pose[14];
    const leftWrist = pose[15];
    const rightWrist = pose[16];
    const leftHip = pose[23];
    const rightHip = pose[24];
    
    // Calculate angles and positions to determine pose
    const shoulderMidpoint = {
      y: (leftShoulder.y + rightShoulder.y) / 2
    };
    
    const leftArmRaised = leftWrist.y < leftShoulder.y;
    const rightArmRaised = rightWrist.y < rightShoulder.y;
    const bothArmsRaised = leftArmRaised && rightArmRaised;
    
    // Simple pose classification
    let detectedPose = '';
    let confidence = 0.8;
    
    if (bothArmsRaised) {
      detectedPose = 'Jumping Jacks or Celebration';
      confidence = 0.9;
    } else if (leftArmRaised || rightArmRaised) {
      detectedPose = 'Waving or Reaching';
      confidence = 0.85;
    } else {
      detectedPose = 'Standing or Sitting';
      confidence = 0.8;
    }
    
    onPoseDetected(detectedPose, confidence);
  };

  const predictWebcam = async () => {
    if (!videoRef.current || !canvasRef.current || !poseLandmarkerRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    
    if (!canvasCtx) return;
    
    canvas.style.height = "360px";
    video.style.height = "360px";
    canvas.style.width = "480px";
    video.style.width = "480px";
    
    let startTimeMs = performance.now();
    if (lastVideoTimeRef.current !== video.currentTime) {
      lastVideoTimeRef.current = video.currentTime;
      
      const result = await poseLandmarkerRef.current.detectForVideo(video, startTimeMs);
      
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (result.landmarks && result.landmarks.length > 0) {
        const { DrawingUtils } = await import('@mediapipe/tasks-vision');
        const drawingUtils = new DrawingUtils(canvasCtx);
        
        for (const landmark of result.landmarks) {
          drawingUtils.drawLandmarks(landmark, {
            radius: (data: any) => DrawingUtils.lerp(data.from?.z || 0, -0.15, 0.1, 5, 1)
          });
          drawingUtils.drawConnectors(landmark, (await import('@mediapipe/tasks-vision')).PoseLandmarker.POSE_CONNECTIONS);
        }
        
        // Analyze pose and create log
        analyzePose(result.landmarks);
      }
      
      canvasCtx.restore();
    }
    
    if (isActive) {
      window.requestAnimationFrame(predictWebcam);
    }
  };

  const toggleCamera = async () => {
    if (isActive) {
      setIsActive(false);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    } else {
      if (!poseLandmarkerRef.current) {
        console.log("Pose landmarker not loaded yet");
        return;
      }
      
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.addEventListener("loadeddata", predictWebcam);
        }
        
        setIsActive(true);
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Activity Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <video
            ref={videoRef}
            className="w-full max-w-md mx-auto rounded-lg bg-muted"
            autoPlay
            playsInline
            style={{ display: isActive ? 'block' : 'none' }}
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full max-w-md mx-auto rounded-lg"
            style={{ display: isActive ? 'block' : 'none' }}
          />
          {!isActive && (
            <div className="w-full max-w-md mx-auto h-60 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Camera className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Click to start activity tracking</p>
              </div>
            </div>
          )}
        </div>
        
        <Button
          onClick={toggleCamera}
          disabled={isLoading}
          className="w-full"
          variant={isActive ? "destructive" : "default"}
        >
          {isLoading ? (
            "Loading..."
          ) : isActive ? (
            <>
              <CameraOff className="w-4 h-4 mr-2" />
              Stop Tracking
            </>
          ) : (
            <>
              <Camera className="w-4 h-4 mr-2" />
              Start Activity Tracking
            </>
          )}
        </Button>
        
        {isActive && (
          <p className="text-xs text-muted-foreground text-center">
            Activity tracking is active. Move around to log activities automatically!
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default PoseDetection;