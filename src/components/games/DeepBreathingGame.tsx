import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Play, Pause } from "lucide-react";

interface DeepBreathingGameProps {
  onClose: () => void;
  onWin: (score: number) => void;
}

export const DeepBreathingGame = ({ onClose, onWin }: DeepBreathingGameProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathCount, setBreathCount] = useState(0);
  const [timer, setTimer] = useState(4);
  const [totalTime, setTotalTime] = useState(0);

  const phaseTimings = {
    inhale: 4,
    hold: 4,
    exhale: 6
  };

  const targetBreaths = 5;

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            // Move to next phase
            if (phase === 'inhale') {
              setPhase('hold');
              return phaseTimings.hold;
            } else if (phase === 'hold') {
              setPhase('exhale');
              return phaseTimings.exhale;
            } else {
              // Completed one breath cycle
              setBreathCount((count) => count + 1);
              setPhase('inhale');
              return phaseTimings.inhale;
            }
          }
          return prev - 1;
        });

        setTotalTime((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, phase]);

  useEffect(() => {
    if (breathCount >= targetBreaths) {
      setIsPlaying(false);
      // Calculate score based on completion
      const score = breathCount * 20 + Math.max(0, 100 - totalTime);
      setTimeout(() => onWin(score), 1000);
    }
  }, [breathCount, targetBreaths, totalTime, onWin]);

  const getPhaseInstruction = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe in slowly...';
      case 'hold':
        return 'Hold your breath...';
      case 'exhale':
        return 'Breathe out slowly...';
    }
  };

  const getCircleSize = () => {
    if (phase === 'inhale') {
      return 'w-32 h-32 md:w-40 md:h-40';
    } else if (phase === 'hold') {
      return 'w-32 h-32 md:w-40 md:h-40';
    } else {
      return 'w-20 h-20 md:w-24 md:h-24';
    }
  };

  const getCircleColor = () => {
    switch (phase) {
      case 'inhale':
        return 'bg-blue-400';
      case 'hold':
        return 'bg-purple-400';
      case 'exhale':
        return 'bg-green-400';
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white shadow-xl">
      <CardContent className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">🌬️ Deep Breathing</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div 
              className={`rounded-full transition-all duration-1000 ease-in-out ${getCircleSize()} ${getCircleColor()} flex items-center justify-center shadow-lg`}
            >
              <span className="text-white font-bold text-lg">
                {timer}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-700">
              {getPhaseInstruction()}
            </h3>
            <p className="text-gray-600">
              Breath {breathCount} of {targetBreaths}
            </p>
          </div>

          {breathCount >= targetBreaths ? (
            <div className="space-y-4">
              <div className="text-green-600 font-bold text-lg">
                🎉 Great job! You completed the breathing exercise!
              </div>
              <p className="text-sm text-gray-600">
                Time: {Math.floor(totalTime / 60)}:{(totalTime % 60).toString().padStart(2, '0')}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {!isPlaying ? (
                <Button
                  onClick={() => setIsPlaying(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white w-full"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Breathing Exercise
                </Button>
              ) : (
                <Button
                  onClick={() => setIsPlaying(false)}
                  className="bg-orange-500 hover:bg-orange-600 text-white w-full"
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
              )}

              <div className="text-sm text-gray-600 space-y-1">
                <p>• Inhale for 4 seconds</p>
                <p>• Hold for 4 seconds</p>
                <p>• Exhale for 6 seconds</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};