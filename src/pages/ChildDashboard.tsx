import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Smile, 
  Heart, 
  Gamepad2, 
  Star,
  Settings,
  ArrowLeft,
  Zap,
  Trophy,
  Coins,
  Lock
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import childAvatar from "@/assets/child-avatar.png";
import CoCareLogo from "@/components/CoCareLogo";
import PoseDetection from "@/components/PoseDetection";
import { ColorMatchGame } from "@/components/games/ColorMatchGame";
import { MemoryGame } from "@/components/games/MemoryGame";
import { ShapePuzzleGame } from "@/components/games/ShapePuzzleGame";
import { toast } from "@/hooks/use-toast";

// Types for care logs
interface CareLog {
  id: string;
  child: string;
  activity: string;
  startTime: string;
  endTime: string;
  outcome: 'Positive' | 'Neutral' | 'Concerning';
  description: string;
}

const ChildDashboard = () => {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [stimulationLevel, setStimulationLevel] = useState(5);
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [currentCoins, setCurrentCoins] = useState(75);
  const [moodCoinsEarned, setMoodCoinsEarned] = useState(false);
  const [activityLogs, setActivityLogs] = useState<Array<{timestamp: number, activity: string}>>([]);
  const [careLogs, setCareLogs] = useState<CareLog[]>([]);
  const [avatars, setAvatars] = useState([
    { name: "Friendly Cat", icon: "🐱", cost: 0, owned: true, equipped: true },
    { name: "Happy Dog", icon: "🐶", cost: 50, owned: true, equipped: false },
    { name: "Magic Unicorn", icon: "🦄", cost: 100, owned: false, equipped: false },
    { name: "Space Robot", icon: "🤖", cost: 150, owned: false, equipped: false },
    { name: "Rainbow Dragon", icon: "🐉", cost: 200, owned: false, equipped: false }
  ]);

  const moods = [
    { emoji: "😊", label: "Happy", value: "happy" },
    { emoji: "😴", label: "Sleepy", value: "sleepy" },
    { emoji: "🎮", label: "Playful", value: "playful" },
    { emoji: "😌", label: "Calm", value: "calm" },
    { emoji: "😕", label: "Sad", value: "sad" },
    { emoji: "😤", label: "Angry", value: "angry" }
  ];

  const games = [
    { name: "Color Match", icon: "🎨", difficulty: "Easy", unlocked: true, component: "ColorMatchGame", coinReward: 5 },
    { name: "Shape Puzzle", icon: "🧩", difficulty: "Medium", unlocked: true, component: "ShapePuzzleGame", coinReward: 10 },
    { name: "Memory Game", icon: "🧠", difficulty: "Easy", unlocked: true, component: "MemoryGame", coinReward: 5 },
    { name: "Story Builder", icon: "📚", difficulty: "Hard", unlocked: false, component: null, coinReward: 15 }
  ];


  const loginStreak = 7;

  const handleMoodSelection = (moodValue: string) => {
    setSelectedMood(moodValue);
    if (!moodCoinsEarned) {
      setCurrentCoins(currentCoins + 5);
      setMoodCoinsEarned(true);
      toast({
        title: "Coins Earned! 🪙",
        description: "+5 coins for sharing your mood!",
      });
    }
  };

  const handlePoseDetected = (pose: string, confidence: number) => {
    // Only log high-confidence poses and avoid spam
    if (confidence > 0.85) {
      const now = Date.now();
      const recentActivity = activityLogs.find(log => 
        now - log.timestamp < 30000 // 30 seconds
      );
      
      // Only create new log if it's been more than 30 seconds since last activity
      if (!recentActivity) {
        setActivityLogs(prev => [...prev, { timestamp: now, activity: pose }]);
        setCurrentCoins(prev => prev + 2);
        toast({
          title: "Activity Detected! 🏃‍♀️",
          description: `+2 coins for being active! (${pose})`,
        });
      }
    }
  };

  const handleGameWin = (score: number, gameComponent: string) => {
    const game = games.find(g => g.component === gameComponent);
    const baseCoins = game ? game.coinReward : 5;
    const bonusCoins = Math.floor(score / 10);
    const totalCoins = baseCoins + bonusCoins;
    setCurrentCoins(currentCoins + totalCoins);
    setActiveGame(null);
  };

  const handleEquipAvatar = (index: number) => {
    const avatar = avatars[index];
    if (avatar.owned) {
      setAvatars(avatars.map((av, i) => ({
        ...av,
        equipped: i === index
      })));
    }
  };

  const handleBuyAvatar = (index: number) => {
    const avatar = avatars[index];
    if (currentCoins >= avatar.cost && !avatar.owned) {
      setCurrentCoins(currentCoins - avatar.cost);
      setAvatars(avatars.map((av, i) => 
        i === index ? { ...av, owned: true } : av
      ));
    }
  };

  const getEquippedAvatar = () => {
    return avatars.find(av => av.equipped) || avatars[0];
  };

  const renderActiveGame = () => {
    const game = games.find(g => g.component === activeGame);
    switch (activeGame) {
      case "ColorMatchGame":
        return <ColorMatchGame onClose={() => setActiveGame(null)} onWin={(score) => handleGameWin(score, "ColorMatchGame")} />;
      case "MemoryGame":
        return <MemoryGame onClose={() => setActiveGame(null)} onWin={(score) => handleGameWin(score, "MemoryGame")} />;
      case "ShapePuzzleGame":
        return <ShapePuzzleGame onClose={() => setActiveGame(null)} onWin={(score) => handleGameWin(score, "ShapePuzzleGame")} />;
      default:
        return null;
    }
  };

  if (activeGame) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center p-4">
        {renderActiveGame()}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-4">
                <CoCareLogo size="lg" />
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-3 border-primary/30 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-4xl shadow-lg">
                    {getEquippedAvatar().icon}
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Hi Alex!</h1>
                  <p className="text-sm text-muted-foreground">How are you feeling today?</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-orange-500/20 text-orange-700">
                <Coins className="h-3 w-3 mr-1" />
                {currentCoins} coins
              </Badge>
              <Badge variant="secondary" className="bg-green-500/20 text-green-700">
                <Star className="h-3 w-3 mr-1" />
                {loginStreak} day streak
              </Badge>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Mood Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smile className="h-5 w-5 text-primary" />
              How are you feeling?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {moods.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => handleMoodSelection(mood.value)}
                  className={`p-4 rounded-2xl border-2 transition-all hover:scale-105 ${
                    selectedMood === mood.value
                      ? "border-primary bg-primary/10 shadow-lg"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="text-3xl mb-2">{mood.emoji}</div>
                  <div className="text-xs text-muted-foreground">{mood.label}</div>
                </button>
              ))}
            </div>
            {selectedMood && (
              <div className="mt-4 p-3 bg-primary/10 rounded-lg text-center animate-fade-in">
                <p className="text-sm text-primary font-medium">
                  {moodCoinsEarned ? 
                    "Thanks for sharing your feelings! 🪙" : 
                    "Thanks for sharing! You earned 5 coins! 🪙"
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stimulation Level */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-orange-500" />
              Energy Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">Low</span>
                <div className="flex-1">
                  <Progress 
                    value={stimulationLevel * 10} 
                    className="h-3"
                  />
                </div>
                <span className="text-sm text-muted-foreground">High</span>
              </div>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                  <button
                    key={level}
                    onClick={() => setStimulationLevel(level)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      stimulationLevel >= level
                        ? "border-orange-500 bg-orange-500 text-white"
                        : "border-border hover:border-orange-500/50"
                    }`}
                  >
                    <span className="text-xs font-bold">{level}</span>
                  </button>
                ))}
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Tap to show how much energy you have!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Activity Tracker */}
        <PoseDetection 
          childName="Alex"
          onPoseDetected={handlePoseDetected}
          onLogGenerated={(careLog) => {
            // Add smart generated logs to the dashboard
            const newLog: CareLog = {
              id: Date.now().toString(),
              child: careLog.child,
              activity: careLog.activity,
              startTime: careLog.startTime,
              endTime: careLog.endTime,
              outcome: careLog.outcome,
              description: careLog.description
            };
            
            setCareLogs(prev => [newLog, ...prev]);
            
            // Award coins based on activity type and duration
            const durationMinutes = parseInt(careLog.duration) || 1;
            let coinReward = 0;
            
            switch (careLog.activity) {
              case 'Play':
                coinReward = Math.min(20, durationMinutes * 2);
                break;
              case 'Hyper':
                coinReward = Math.min(15, durationMinutes * 1);
                break;
              case 'Rest':
                coinReward = Math.min(10, durationMinutes * 1);
                break;
              default:
                coinReward = 5;
            }
            
            if (coinReward > 0) {
              setCurrentCoins(prev => prev + coinReward);
              toast({
                title: "Activity Completed! 🎯",
                description: `+${coinReward} coins for ${careLog.activity.toLowerCase()} activity!`,
              });
            }
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Games */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gamepad2 className="h-5 w-5 text-green-500" />
                Fun Games
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {games.map((game, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      game.unlocked
                        ? "border-border hover:border-green-500/50 cursor-pointer hover:shadow-md"
                        : "border-muted bg-muted/30 opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{game.unlocked ? game.icon : <Lock className="h-6 w-6 text-muted-foreground" />}</div>
                      <div className="flex-1">
                        <p className="font-medium">{game.name}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-muted-foreground">{game.difficulty}</p>
                          <Badge variant="outline" className="text-xs">
                            +{game.coinReward} coins
                          </Badge>
                        </div>
                      </div>
                      {game.unlocked && (
                        <Button 
                          size="sm" 
                          variant="default"
                          onClick={() => game.component && setActiveGame(game.component)}
                          className="bg-green-500 hover:bg-green-600 text-white"
                        >
                          Play
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Avatar Shop */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-purple-500" />
                Avatar Shop
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {avatars.map((avatar, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      avatar.equipped
                        ? "border-primary bg-primary/10"
                        : avatar.owned
                        ? "border-border hover:border-primary/50 cursor-pointer"
                        : "border-muted"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{avatar.icon}</div>
                      <div className="flex-1">
                        <p className="font-medium">{avatar.name}</p>
                        <div className="flex items-center gap-2">
                          {avatar.cost > 0 && (
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Coins className="h-3 w-3" />
                              {avatar.cost}
                            </span>
                          )}
                          {avatar.equipped && (
                            <Badge variant="secondary" className="text-xs">Equipped</Badge>
                          )}
                          {avatar.owned && !avatar.equipped && (
                            <Badge variant="outline" className="text-xs">Owned</Badge>
                          )}
                        </div>
                      </div>
                      {avatar.equipped ? (
                        <Button size="sm" variant="default" disabled className="bg-primary">
                          ✓ Equipped
                        </Button>
                      ) : avatar.owned ? (
                        <Button size="sm" variant="outline" onClick={() => handleEquipAvatar(index)} className="hover:bg-primary hover:text-white">
                          Equip
                        </Button>
                      ) : avatar.cost <= currentCoins ? (
                        <Button size="sm" variant="default" onClick={() => handleBuyAvatar(index)} className="bg-orange-500 hover:bg-orange-600 text-white">
                          Buy
                        </Button>
                      ) : (
                        <Button size="sm" variant="ghost" disabled className="opacity-50">
                          <Lock className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Daily Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Today's Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">3</div>
                <div className="text-sm text-muted-foreground">Moods Shared</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">2</div>
                <div className="text-sm text-muted-foreground">Games Played</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">{currentCoins}</div>
                <div className="text-sm text-muted-foreground">Total Coins</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-500">7</div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ChildDashboard;