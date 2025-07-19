import { useState, useRef, useCallback } from 'react';

export interface ActivitySession {
  activity: 'Play' | 'Rest' | 'Hyper' | 'Idle' | 'Sleep';
  startTime: Date;
  endTime?: Date;
  confidence: number;
}

export interface CareLog {
  child: string;
  activity: string;
  startTime: string;
  endTime: string;
  duration: string;
  outcome: 'Positive' | 'Neutral' | 'Concerning';
  description: string;
}

const ACTIVITY_MIN_DURATION = 5000; // 5 seconds minimum
const ACTIVITY_CONFIDENCE_THRESHOLD = 0.7;

export const useActivityDetection = (childName: string = 'Child') => {
  const [currentSession, setCurrentSession] = useState<ActivitySession | null>(null);
  const [activityHistory, setActivityHistory] = useState<ActivitySession[]>([]);
  const [generatedLogs, setGeneratedLogs] = useState<CareLog[]>([]);
  const lastActivityRef = useRef<string>('');
  const sessionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const detectActivity = useCallback((landmarks: any[]): { activity: string; confidence: number } => {
    if (!landmarks || landmarks.length === 0) {
      return { activity: 'Idle', confidence: 0.5 };
    }

    const pose = landmarks[0];
    const leftShoulder = pose[11];
    const rightShoulder = pose[12];
    const leftElbow = pose[13];
    const rightElbow = pose[14];
    const leftWrist = pose[15];
    const rightWrist = pose[16];
    const leftHip = pose[23];
    const rightHip = pose[24];
    const nose = pose[0];

    // Calculate movement indicators
    const shoulderMidpoint = { y: (leftShoulder.y + rightShoulder.y) / 2 };
    const hipMidpoint = { y: (leftHip.y + rightHip.y) / 2 };
    
    // Check if lying down (shoulders and hips close to same level)
    const isLyingDown = Math.abs(shoulderMidpoint.y - hipMidpoint.y) < 0.1 && shoulderMidpoint.y > 0.6;
    
    // Check arm movement (arms raised or extended)
    const leftArmActive = leftWrist.y < leftShoulder.y - 0.1;
    const rightArmActive = rightWrist.y < rightShoulder.y - 0.1;
    const bothArmsActive = leftArmActive && rightArmActive;
    
    // Check for high energy movement (jumping, fast motion)
    const highActivity = (nose.y < 0.3) || bothArmsActive;
    
    // Activity classification
    if (isLyingDown) {
      return { activity: 'Rest', confidence: 0.9 };
    }
    
    if (highActivity && bothArmsActive) {
      return { activity: 'Hyper', confidence: 0.85 };
    }
    
    if (leftArmActive || rightArmActive) {
      return { activity: 'Play', confidence: 0.8 };
    }
    
    return { activity: 'Idle', confidence: 0.7 };
  }, []);

  const generateLogDescription = useCallback(async (session: ActivitySession): Promise<string> => {
    const duration = session.endTime ? 
      Math.round((session.endTime.getTime() - session.startTime.getTime()) / 1000 / 60) : 0;
    
    const prompts = {
      Play: `${childName} was active and engaged in play for ${duration} minutes. Generate a brief caregiver log.`,
      Rest: `${childName} rested quietly for ${duration} minutes. Generate a brief caregiver log.`,
      Hyper: `${childName} showed high energy activity for ${duration} minutes. Generate a brief caregiver log.`,
      Idle: `${childName} was calm and still for ${duration} minutes. Generate a brief caregiver log.`,
      Sleep: `${childName} was sleeping for ${duration} minutes. Generate a brief caregiver log.`
    };

    // Simple template-based generation for now (could be replaced with GPT API)
    const templates = {
      Play: `${childName} was actively playing and moving around energetically.`,
      Rest: `${childName} had a quiet rest period and remained calm.`,
      Hyper: `${childName} displayed high energy levels with lots of movement.`,
      Idle: `${childName} was sitting quietly and appeared content.`,
      Sleep: `${childName} was resting peacefully during sleep time.`
    };

    return templates[session.activity] || `${childName} was engaged in ${session.activity.toLowerCase()} activity.`;
  }, [childName]);

  const endCurrentSession = useCallback(async () => {
    if (!currentSession) return;

    const endTime = new Date();
    const duration = endTime.getTime() - currentSession.startTime.getTime();

    // Only log activities that last more than minimum duration
    if (duration >= ACTIVITY_MIN_DURATION) {
      const completedSession = { ...currentSession, endTime };
      
      setActivityHistory(prev => [...prev, completedSession]);

      // Generate care log
      const description = await generateLogDescription(completedSession);
      const durationMinutes = Math.round(duration / 1000 / 60);
      
      const outcome: 'Positive' | 'Neutral' | 'Concerning' = 
        completedSession.activity === 'Play' ? 'Positive' :
        completedSession.activity === 'Hyper' ? 'Concerning' : 'Neutral';

      const careLog: CareLog = {
        child: childName,
        activity: completedSession.activity,
        startTime: completedSession.startTime.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        endTime: endTime.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        duration: `${durationMinutes} min`,
        outcome,
        description
      };

      setGeneratedLogs(prev => [...prev, careLog]);
    }

    setCurrentSession(null);
  }, [currentSession, generateLogDescription, childName]);

  const processPoseData = useCallback((landmarks: any[]) => {
    const detection = detectActivity(landmarks);
    
    // Clear any existing timeout
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
    }

    // If activity changed significantly
    if (detection.activity !== lastActivityRef.current && detection.confidence >= ACTIVITY_CONFIDENCE_THRESHOLD) {
      // End current session if exists
      if (currentSession) {
        endCurrentSession();
      }

      // Start new session
      setCurrentSession({
        activity: detection.activity as any,
        startTime: new Date(),
        confidence: detection.confidence
      });

      lastActivityRef.current = detection.activity;
    }

    // Set timeout to end session if no new poses detected
    sessionTimeoutRef.current = setTimeout(() => {
      if (currentSession) {
        endCurrentSession();
      }
    }, 10000); // 10 seconds of no activity ends session

  }, [detectActivity, currentSession, endCurrentSession]);

  return {
    currentSession,
    activityHistory,
    generatedLogs,
    processPoseData,
    clearLogs: () => setGeneratedLogs([])
  };
};