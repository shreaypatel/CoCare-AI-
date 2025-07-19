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
import { useToast } from "@/hooks/use-toast";
import childAvatar from "@/assets/child-avatar.png";
import CoCareLogo from "@/components/CoCareLogo";
import { ColorMatchGame } from "@/components/games/ColorMatchGame";
import { MemoryGame } from "@/components/games/MemoryGame";
import { ShapePuzzleGame } from "@/components/games/ShapePuzzleGame";

const ChildDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [stimulationLevel, setStimulationLevel] = useState(5);
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [currentCoins, setCurrentCoins] = useState(75);
  const [moodCoinsEarned, setMoodCoinsEarned] = useState(false);
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
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => {
                  // For now, show a toast - could be replaced with settings modal later
                  toast({
                    title: "Settings",
                    description: "Settings panel coming soon!"
                  });
                }}
              >
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

          {/* Calming Games */}
          <Card className="mb-4">
            <CardContent>
              <h3 className="text-xl mb-2">🧠 Calming Games & Brain Benefits</h3>
              <div className="space-y-4">
                <div className="bg-pink-100 p-3 rounded-xl shadow">
                  <h4 className="text-lg font-semibold text-purple-700">🎨 Coloring Game</h4>
                  <p className="text-gray-700">Let your creativity flow by coloring animals, nature, or abstract shapes!</p>
                  <p className="text-sm mt-1 text-gray-600"><strong>Brain Activation:</strong> Calms the amygdala (emotion center), stimulates the prefrontal cortex (focus & decision-making).</p>
                  <Button className="mt-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl">Start Coloring</Button>
                </div>

                <div className="bg-yellow-100 p-3 rounded-xl shadow">
                  <h4 className="text-lg font-semibold text-yellow-700">🧩 Puzzle Matching</h4>
                  <p className="text-gray-700">Match shapes, animals, or faces! Great for relaxing & pattern recognition.</p>
                  <p className="text-sm mt-1 text-gray-600"><strong>Brain Activation:</strong> Engages the hippocampus (memory), promotes dopamine release (motivation/reward).</p>
                  <Button className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl">Play Puzzle</Button>
                </div>

                <div className="bg-green-100 p-3 rounded-xl shadow">
                  <h4 className="text-lg font-semibold text-green-700">🌬️ Deep Breathing Game</h4>
                  <p className="text-gray-700">Follow the circle to breathe in... and out. Feel your body relax as you slow down.</p>
                  <p className="text-sm mt-1 text-gray-600"><strong>Brain Activation:</strong> Calms the parasympathetic nervous system, reduces cortisol, regulates emotional responses.</p>
                  <Button className="mt-2 bg-green-500 hover:bg-green-600 text-white rounded-xl">Start Breathing</Button>
                </div>

                <div className="bg-blue-100 p-3 rounded-xl shadow">
                  <h4 className="text-lg font-semibold text-blue-700">🎧 Sound Mixer</h4>
                  <p className="text-gray-700">Mix your own relaxing sounds: rain, ocean, white noise, and melodies!</p>
                  <p className="text-sm mt-1 text-gray-600"><strong>Brain Activation:</strong> Activates the auditory cortex and reduces limbic overactivity (linked to stress).</p>
                  <Button className="mt-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl">Try Sound Mixer</Button>
                </div>
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