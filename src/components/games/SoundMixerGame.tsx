import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { X, Volume2, VolumeX } from "lucide-react";

interface SoundMixerGameProps {
  onClose: () => void;
  onWin: (score: number) => void;
}

export const SoundMixerGame = ({ onClose, onWin }: SoundMixerGameProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playTime, setPlayTime] = useState(0);
  const [soundLevels, setSoundLevels] = useState({
    rain: 50,
    ocean: 30,
    forest: 20,
    whitenoise: 0
  });

  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
  const timerRef = useRef<NodeJS.Timeout>();

  const sounds = [
    { id: 'rain', name: '🌧️ Rain', emoji: '🌧️', color: 'bg-blue-100' },
    { id: 'ocean', name: '🌊 Ocean Waves', emoji: '🌊', color: 'bg-cyan-100' },
    { id: 'forest', name: '🌲 Forest Birds', emoji: '🌲', color: 'bg-green-100' },
    { id: 'whitenoise', name: '⚪ White Noise', emoji: '⚪', color: 'bg-gray-100' }
  ];

  useEffect(() => {
    // Create audio context for each sound (we'll simulate this with oscillators)
    sounds.forEach(sound => {
      // In a real app, you'd load actual audio files here
      // For demo purposes, we'll create a simple audio simulation
    });

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setPlayTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying]);

  const handleVolumeChange = (soundId: string, value: number[]) => {
    setSoundLevels(prev => ({
      ...prev,
      [soundId]: value[0]
    }));
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const resetMix = () => {
    setSoundLevels({
      rain: 0,
      ocean: 0,
      forest: 0,
      whitenoise: 0
    });
  };

  const handleComplete = () => {
    setIsPlaying(false);
    
    // Calculate score based on mix creativity and time spent
    const totalVolume = Object.values(soundLevels).reduce((sum, level) => sum + level, 0);
    const diversity = Object.values(soundLevels).filter(level => level > 0).length;
    const timeBonus = Math.min(playTime * 2, 100);
    
    const score = (diversity * 25) + (totalVolume / 4) + timeBonus;
    
    setTimeout(() => onWin(Math.round(score)), 500);
  };

  const getTotalVolume = () => {
    return Object.values(soundLevels).reduce((sum, level) => sum + level, 0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="w-full max-w-lg mx-auto bg-white shadow-xl">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">🎧 Sound Mixer</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-gray-700">
              Mix Your Perfect Soundscape
            </h3>
            <p className="text-sm text-gray-600">
              Adjust the volume of different sounds to create a relaxing mix
            </p>
            <div className="text-lg font-mono text-blue-600">
              ⏱️ {formatTime(playTime)}
            </div>
          </div>

          <div className="space-y-4">
            {sounds.map((sound) => (
              <div key={sound.id} className={`p-4 rounded-lg ${sound.color}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{sound.emoji}</span>
                    <span className="font-medium text-gray-700">{sound.name}</span>
                  </div>
                  <span className="text-sm font-mono text-gray-600">
                    {soundLevels[sound.id]}%
                  </span>
                </div>
                <Slider
                  value={[soundLevels[sound.id]]}
                  onValueChange={(value) => handleVolumeChange(sound.id, value)}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            ))}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-700">Total Volume</span>
              <span className="text-sm font-mono text-gray-600">
                {getTotalVolume()}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(getTotalVolume() / 4, 100)}%` }}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={togglePlayback}
              className={`flex-1 ${isPlaying ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
            >
              {isPlaying ? (
                <>
                  <VolumeX className="h-4 w-4 mr-2" />
                  Stop Mix
                </>
              ) : (
                <>
                  <Volume2 className="h-4 w-4 mr-2" />
                  Play Mix
                </>
              )}
            </Button>
            
            <Button
              onClick={resetMix}
              variant="outline"
              className="px-6"
            >
              Reset
            </Button>
          </div>

          {playTime >= 30 && (
            <Button
              onClick={handleComplete}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white"
            >
              ✨ Complete Mix & Earn Coins!
            </Button>
          )}

          {playTime < 30 && getTotalVolume() > 0 && (
            <p className="text-center text-sm text-gray-600">
              Mix for {30 - playTime} more seconds to earn coins!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};