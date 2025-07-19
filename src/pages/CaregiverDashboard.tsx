import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  Settings, 
  Edit3, 
  Heart,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowLeft,
  Plus,
  X,
  Calendar,
  BarChart3
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { EditLogDialog } from "@/components/EditLogDialog";
import { NewLogDialog } from "@/components/NewLogDialog";
import CoCareLogo from "@/components/CoCareLogo";

const CaregiverDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedChild, setSelectedChild] = useState("alex");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [newLogDialogOpen, setNewLogDialogOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<any>(null);
  const [behaviorGraphOpen, setBehaviorGraphOpen] = useState(false);
  const [dailyLogsOpen, setDailyLogsOpen] = useState(false);
  const [selectedChildForView, setSelectedChildForView] = useState<any>(null);
  const [timeRange, setTimeRange] = useState("weekly");

  const children = [
    {
      id: "alex",
      name: "Alex Johnson",
      age: 8,
      condition: "Autism Spectrum",
      avatar: "/placeholder.svg",
      status: "active",
      lastUpdate: "2 minutes ago",
      moodScore: 8,
      activityLevel: "high"
    },
    {
      id: "emma",
      name: "Emma Davis",
      age: 6,
      condition: "ADHD",
      avatar: "/placeholder.svg",
      status: "rest",
      lastUpdate: "15 minutes ago",
      moodScore: 7,
      activityLevel: "moderate"
    }
  ];

  const [logs, setLogs] = useState([
    {
      id: 1,
      child: "Alex Johnson",
      activityType: "Educational",
      timeStart: "14:00",
      timeEnd: "14:30",
      outcome: "positive" as const,
      description: "Alex expressed feeling happy after completing puzzle activity. Showed great focus and problem-solving skills.",
      aiSuggestion: "Consider introducing more puzzle-based learning activities",
      status: "pending"
    },
    {
      id: 2,
      child: "Emma Davis", 
      activityType: "Social Interaction",
      timeStart: "13:15",
      timeEnd: "13:45",
      outcome: "positive" as const,
      description: "Emma showed increased focus during story time. Actively participated in group discussion.",
      aiSuggestion: "Story-based learning appears effective for Emma's attention span",
      status: "reviewed"
    },
    {
      id: 3,
      child: "Alex Johnson",
      activityType: "Physical Activity",
      timeStart: "12:00",
      timeEnd: "12:15",
      outcome: "positive" as const,
      description: "Completed physical exercise routine with enthusiasm. Maintained good energy throughout.",
      aiSuggestion: "Physical activities boost Alex's mood - maintain current schedule",
      status: "approved"
    }
  ]);

  // Sample behavior data for graphs
  const behaviorData = {
    weekly: [
      { day: 'Mon', mood: 8, activity: 7, social: 6 },
      { day: 'Tue', mood: 7, activity: 8, social: 7 },
      { day: 'Wed', mood: 9, activity: 6, social: 8 },
      { day: 'Thu', mood: 6, activity: 9, social: 5 },
      { day: 'Fri', mood: 8, activity: 7, social: 7 },
      { day: 'Sat', mood: 9, activity: 8, social: 9 },
      { day: 'Sun', mood: 7, activity: 6, social: 6 },
    ],
    monthly: [
      { period: 'Week 1', mood: 7.5, activity: 7.2, social: 6.8 },
      { period: 'Week 2', mood: 8.1, activity: 7.8, social: 7.2 },
      { period: 'Week 3', mood: 7.8, activity: 8.2, social: 7.5 },
      { period: 'Week 4', mood: 8.3, activity: 7.5, social: 8.1 },
    ],
    yearly: [
      { period: 'Jan', mood: 7.2, activity: 6.8, social: 6.5 },
      { period: 'Feb', mood: 7.5, activity: 7.1, social: 6.9 },
      { period: 'Mar', mood: 7.8, activity: 7.4, social: 7.2 },
      { period: 'Apr', mood: 8.1, activity: 7.7, social: 7.5 },
      { period: 'May', mood: 8.3, activity: 8.0, social: 7.8 },
      { period: 'Jun', mood: 8.5, activity: 8.2, social: 8.1 },
    ]
  };

  const handleEditLog = (log: any) => {
    setEditingLog(log);
    setEditDialogOpen(true);
  };

  const handleSaveLog = (updatedLog: any) => {
    setLogs(logs.map(log => log.id === updatedLog.id ? updatedLog : log));
  };

  const handleCreateLog = (newLogData: any) => {
    const newLog = {
      ...newLogData,
      id: Math.max(...logs.map(l => l.id)) + 1,
      date: new Date().toLocaleDateString()
    };
    setLogs([newLog, ...logs]);
  };

  const handleViewBehaviorGraph = (child: any) => {
    setSelectedChildForView(child);
    setBehaviorGraphOpen(true);
  };

  const handleViewDailyLogs = (child: any) => {
    setSelectedChildForView(child);
    setDailyLogsOpen(true);
  };

  const getChildLogs = (childName: string) => {
    return logs.filter(log => log.child === childName);
  };

  const getOutcomeBadge = (outcome: string) => {
    switch (outcome) {
      case "positive":
        return <Badge className="bg-green-500/20 text-green-700 border-green-300">Positive</Badge>;
      case "negative":
        return <Badge className="bg-red-500/20 text-red-700 border-red-300">Negative</Badge>;
      case "neutral":
        return <Badge className="bg-gray-500/20 text-gray-700 border-gray-300">Neutral</Badge>;
      default:
        return <Badge variant="secondary">{outcome}</Badge>;
    }
  };

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
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Caregiver Dashboard</h1>
                  <p className="text-sm text-muted-foreground">Managing care with insights</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-green-500/20 text-green-700">
                2 Active Children
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
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="logs">Care Logs</TabsTrigger>
            <TabsTrigger value="children">Children</TabsTrigger>
            <TabsTrigger value="behavior">Behavior Management</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Users className="h-8 w-8 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">2</p>
                      <p className="text-sm text-muted-foreground">Active Children</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="text-2xl font-bold">12</p>
                      <p className="text-sm text-muted-foreground">Today's Logs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold">87%</p>
                      <p className="text-sm text-muted-foreground">Positive Moods</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-8 w-8 text-orange-500" />
                    <div>
                      <p className="text-2xl font-bold">3</p>
                      <p className="text-sm text-muted-foreground">Pending Reviews</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {logs.slice(0, 3).map((log) => (
                    <div key={log.id} className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className="font-medium">{log.child}</p>
                          <Badge variant="outline" className="text-xs">{log.activityType}</Badge>
                          {getOutcomeBadge(log.outcome)}
                          <span className="text-sm text-muted-foreground">
                            {log.timeStart} - {log.timeEnd}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{log.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Logs Tab */}
          <TabsContent value="logs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Care Logs & AI Insights
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{logs.length} entries today</Badge>
                    <Button 
                      onClick={() => setNewLogDialogOpen(true)}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      New Log
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {logs.map((log) => (
                    <div key={log.id} className="border border-border/50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="w-3 h-3 bg-primary rounded-full"></div>
                          <div>
                            <p className="font-medium">{log.child}</p>
                            <p className="text-sm text-muted-foreground">
                              {log.timeStart} - {log.timeEnd}
                            </p>
                          </div>
                          <Badge variant="outline">{log.activityType}</Badge>
                          {getOutcomeBadge(log.outcome)}
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleEditLog(log)}>
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <p className="text-sm mb-3">{log.description}</p>
                      
                      <div className="bg-accent/50 rounded-lg p-3 border border-accent/20">
                        <div className="flex items-start gap-2">
                          <div className="w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded flex items-center justify-center text-white text-xs font-bold mt-0.5">
                            AI
                          </div>
                          <div className="flex-1">
                            <p className="text-sm">{log.aiSuggestion}</p>
                            <div className="flex gap-2 mt-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-7 text-xs"
                                onClick={() => {
                                  // Update log status to approved
                                  const updatedLogs = logs.map(l => 
                                    l.id === log.id ? { ...l, status: "approved" } : l
                                  );
                                  setLogs(updatedLogs);
                                  toast({
                                    title: "AI Suggestion Approved",
                                    description: "The suggestion has been marked as approved"
                                  });
                                }}
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-7 text-xs"
                                onClick={() => handleEditLog(log)}
                              >
                                <Edit3 className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Children Tab */}
          <TabsContent value="children" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {children.map((child) => (
                <Card key={child.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={child.avatar}
                          alt={child.name}
                          className="w-16 h-16 rounded-full border-2 border-primary/20"
                        />
                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-background ${
                          child.status === "active" ? "bg-green-500" : "bg-purple-500"
                        }`}></div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{child.name}</h3>
                        <p className="text-sm text-muted-foreground">Age {child.age} • {child.condition}</p>
                        <p className="text-xs text-muted-foreground">Last update: {child.lastUpdate}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{child.moodScore}</div>
                        <div className="text-xs text-muted-foreground">Mood Score</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${
                          child.activityLevel === "high" ? "text-green-500" : "text-blue-500"
                        }`}>
                          {child.activityLevel === "high" ? "HIGH" : "MOD"}
                        </div>
                        <div className="text-xs text-muted-foreground">Activity</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => handleViewBehaviorGraph(child)}
                      >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        View Behavior Graph
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => handleViewDailyLogs(child)}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        View Daily Logs
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Behavior Management Tab */}
          <TabsContent value="behavior">
            <Card className="bg-white shadow-md rounded-xl p-4">
              <CardContent>
                <h3 className="text-2xl font-bold mb-4 text-purple-600">📘 Behavior Management Plan Phases</h3>

                <div className="space-y-6">

                  {/* Phase 1 */}
                  <div>
                    <h4 className="text-xl font-semibold text-gray-700 mb-2">1. Addressing the Problem Behavior</h4>
                    <ul className="list-disc ml-6 text-gray-600 space-y-1">
                      <li>Establish a relationship with the child and their support system.</li>
                      <li>Discuss concerns and explore possible solutions.</li>
                      <li>Apply classroom or routine-based interventions first.</li>
                      <li>If these are unsuccessful, notify appropriate support staff or professionals.</li>
                    </ul>
                  </div>

                  {/* Phase 2 */}
                  <div>
                    <h4 className="text-xl font-semibold text-gray-700 mb-2">2. Understanding the Behavior</h4>
                    <ul className="list-disc ml-6 text-gray-600 space-y-1">
                      <li>Consult with specialists (psychologists, counselors, etc.) as needed.</li>
                      <li>Gather and review data such as observations and behavior checklists.</li>
                      <li>Identify triggers, patterns, and possible causes of behavior.</li>
                    </ul>
                  </div>

                  {/* Phase 3 */}
                  <div>
                    <h4 className="text-xl font-semibold text-gray-700 mb-2">3. Developing a Support Plan</h4>
                    <ul className="list-disc ml-6 text-gray-600 space-y-1">
                      <li>Hold a team meeting to strategize around:
                        <ul className="list-disc ml-6">
                          <li>Environmental factors</li>
                          <li>Functional behavior causes</li>
                        </ul>
                      </li>
                      <li>Create a formal Behavior Support Plan (BSP).</li>
                      <li>Set clear goals and assign roles/responsibilities.</li>
                      <li>Establish a system for ongoing communication.</li>
                    </ul>
                  </div>

                  {/* Phase 4 */}
                  <div>
                    <h4 className="text-xl font-semibold text-gray-700 mb-2">4. Implementing the Support Plan</h4>
                    <ul className="list-disc ml-6 text-gray-600 space-y-1">
                      <li>Adjust routines to support new, positive behaviors.</li>
                      <li>Apply proactive and reactive strategies.</li>
                      <li>Ensure consistent follow-through on goals and communication.</li>
                    </ul>
                  </div>

                  {/* Phase 5 */}
                  <div>
                    <h4 className="text-xl font-semibold text-gray-700 mb-2">5. Monitoring & Evaluation</h4>
                    <ul className="list-disc ml-6 text-gray-600 space-y-1">
                      <li>Track progress and update team regularly.</li>
                      <li>Revise and improve the plan as needed.</li>
                      <li>Celebrate successes and adapt to challenges.</li>
                    </ul>
                  </div>

                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <EditLogDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        log={editingLog}
        onSave={handleSaveLog}
      />
      
      <NewLogDialog
        open={newLogDialogOpen}
        onOpenChange={setNewLogDialogOpen}
        onSave={handleCreateLog}
        children={children.map(child => child.name)}
      />

      {/* Behavior Graph Dialog */}
      <Dialog open={behaviorGraphOpen} onOpenChange={setBehaviorGraphOpen}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Behavior Analytics - {selectedChildForView?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Time Range:</span>
              </div>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100%-3rem)]">
              {/* Mood & Activity Line Chart */}
              <Card className="flex-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Mood & Activity Trends</CardTitle>
                </CardHeader>
                <CardContent className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={behaviorData[timeRange as keyof typeof behaviorData]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey={timeRange === 'weekly' ? 'day' : 'period'} 
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="mood" 
                        stroke="#8884d8" 
                        strokeWidth={2}
                        name="Mood Score"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="activity" 
                        stroke="#82ca9d" 
                        strokeWidth={2}
                        name="Activity Level"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Social Interaction Bar Chart */}
              <Card className="flex-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Social Interaction</CardTitle>
                </CardHeader>
                <CardContent className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={behaviorData[timeRange as keyof typeof behaviorData]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey={timeRange === 'weekly' ? 'day' : 'period'} 
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar 
                        dataKey="social" 
                        fill="#ffc658" 
                        name="Social Score"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              {behaviorData[timeRange as keyof typeof behaviorData].length > 0 && (
                <>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">
                      {(behaviorData[timeRange as keyof typeof behaviorData]
                        .reduce((sum, item) => sum + item.mood, 0) / 
                        behaviorData[timeRange as keyof typeof behaviorData].length).toFixed(1)}
                    </div>
                    <div className="text-sm text-muted-foreground">Avg Mood</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">
                      {(behaviorData[timeRange as keyof typeof behaviorData]
                        .reduce((sum, item) => sum + item.activity, 0) / 
                        behaviorData[timeRange as keyof typeof behaviorData].length).toFixed(1)}
                    </div>
                    <div className="text-sm text-muted-foreground">Avg Activity</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-600">
                      {(behaviorData[timeRange as keyof typeof behaviorData]
                        .reduce((sum, item) => sum + item.social, 0) / 
                        behaviorData[timeRange as keyof typeof behaviorData].length).toFixed(1)}
                    </div>
                    <div className="text-sm text-muted-foreground">Avg Social</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Daily Logs Dialog */}
      <Dialog open={dailyLogsOpen} onOpenChange={setDailyLogsOpen}>
        <DialogContent className="max-w-3xl h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Daily Logs - {selectedChildForView?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto space-y-4">
            {selectedChildForView && getChildLogs(selectedChildForView.name).length > 0 ? (
              getChildLogs(selectedChildForView.name).map((log) => (
                <div key={log.id} className="border border-border/50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <div>
                        <p className="font-medium">{log.activityType}</p>
                        <p className="text-sm text-muted-foreground">
                          {log.timeStart} - {log.timeEnd}
                        </p>
                      </div>
                      {getOutcomeBadge(log.outcome)}
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleEditLog(log)}>
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <p className="text-sm mb-3">{log.description}</p>
                  
                  {log.aiSuggestion && (
                    <div className="bg-accent/50 rounded-lg p-3 border border-accent/20">
                      <div className="flex items-start gap-2">
                        <div className="w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded flex items-center justify-center text-white text-xs font-bold mt-0.5">
                          AI
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">{log.aiSuggestion}</p>
                          <div className="flex gap-2 mt-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-7 text-xs"
                              onClick={() => {
                                const updatedLogs = logs.map(l => 
                                  l.id === log.id ? { ...l, status: "approved" } : l
                                );
                                setLogs(updatedLogs);
                                toast({
                                  title: "AI Suggestion Approved",
                                  description: "The suggestion has been marked as approved"
                                });
                              }}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-7 text-xs"
                              onClick={() => handleEditLog(log)}
                            >
                              <Edit3 className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No logs found</h3>
                <p className="text-muted-foreground mb-4">
                  There are currently no logs recorded for {selectedChildForView?.name} today.
                </p>
                <Button 
                  onClick={() => {
                    setDailyLogsOpen(false);
                    setNewLogDialogOpen(true);
                  }}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Create New Log
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CaregiverDashboard;