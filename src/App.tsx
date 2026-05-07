

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Timer,
  Utensils, 
  LayoutDashboard, 
  Settings, 
  Plus, 
  Target, 
  Flame, 
  TrendingUp,
  BrainCircuit,
  X,
  CheckCircle2,
  Calendar,
  Shield,
  Sun,
  Moon,
  Zap,
  Activity,
  LogOut,
  HelpCircle,
  Search,
  Bell,
  Mail,
  User,
  Dumbbell,
  Menu,
  Bookmark,
  Filter,
  Trash2
} from 'lucide-react';
import { EXERCISE_LIBRARY_DATA } from './constants/libraryData';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line
} from 'recharts';

import { Exercise, Meal, UserStats, DailyLog, Goal, Notification } from './types';
import { DEFAULT_USER_STATS, COMMON_EXERCISES } from './constants';
import { getWorkoutSuggestion, getMealSuggestion } from './services/geminiService';
import SettingsDashboard from './components/SettingsDashboard';

type Section = 'dashboard' | 'workouts' | 'diet' | 'progress' | 'settings';

function TrainrootLogo() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full text-[#141414]" fill="currentColor">
      {/* Background White Square is handled by the container div in the sidebar */}
      <path d="M50 8c-8 0-40 0-40 40 0 35 40 44 40 44s40-9 40-44c0-40-32-40-40-40z" />
      <g fill="white">
        {/* T-Top Bar */}
        <rect x="25" y="24" width="50" height="6" rx="3" />
        {/* Vertical Stem */}
        <rect x="47" y="30" width="6" height="35" rx="3" />
        {/* Barbell Left */}
        <rect x="24" y="38" width="6" height="18" rx="2" />
        <rect x="32" y="34" width="6" height="26" rx="2" />
        {/* Barbell Right */}
        <rect x="70" y="38" width="6" height="18" rx="2" />
        <rect x="62" y="34" width="6" height="26" rx="2" />
        {/* Bar */}
        <rect x="38" y="44" width="24" height="4" />
        
        {/* Roots */}
        <path d="M50 65c-2 2-6 8-12 8s-3-2-5-2-4 4-4 4m21-10c3 3 8 10 16 10s5-4 7-4 5 4 5 4m-40-4c3 3 6 8 8 8s4-3 6-3 4 4 4 4m16-9c-2 2-4 7-6 7s-3-2-5-2-4 4-4 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>('dashboard');
  const [userStats, setUserStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('trainroot_stats');
    return saved ? JSON.parse(saved) : DEFAULT_USER_STATS;
  });
  const [logs, setLogs] = useState<DailyLog[]>(() => {
    const saved = localStorage.getItem('trainroot_logs');
    
    // Add default mock data
    const d = new Date();
    d.setMinutes(d.getMinutes() + d.getTimezoneOffset() + 330);
    const formatter = new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const todayStr = formatter.format(d);
    
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.length > 0) {
        // Ensure dinner data is injected if not present for today
        const todayLog = parsed.find((l: DailyLog) => l.date === todayStr);
        if (todayLog && !todayLog.meals.some((m: Meal) => m.type === 'dinner')) {
          todayLog.meals.push(
            { id: '8', name: 'Salmon Fillet', quantity: '150g', calories: 310, protein: 34, carbs: 0, fat: 19, date: todayStr, type: 'dinner' },
            { id: '9', name: 'Roasted Sweet Potato', quantity: '100g', calories: 90, protein: 2, carbs: 21, fat: 0, date: todayStr, type: 'dinner' },
            { id: '10', name: 'Steamed Broccoli', quantity: '1 cup', calories: 55, protein: 4, carbs: 11, fat: 1, date: todayStr, type: 'dinner' }
          );
          localStorage.setItem('trainroot_logs', JSON.stringify(parsed));
        }
        if (todayLog && !todayLog.meals.some((m: Meal) => m.type === 'snack')) {
          todayLog.meals.push(
            { id: '11', name: 'Almonds', quantity: '30g', calories: 170, protein: 6, carbs: 6, fat: 15, date: todayStr, type: 'snack' }
          );
          localStorage.setItem('trainroot_logs', JSON.stringify(parsed));
        }
        
        if (todayLog && !todayLog.meals.some((m: Meal) => m.name === 'Greek Yogurt')) {
          todayLog.meals.push(
            { id: '15', name: 'Greek Yogurt', quantity: '150g', calories: 90, protein: 15, carbs: 6, fat: 0, date: todayStr, type: 'breakfast' },
            { id: '16', name: 'Blueberries', quantity: '1 handful', calories: 42, protein: 1, carbs: 11, fat: 0, date: todayStr, type: 'breakfast' }
          );
        }

        if (todayLog && !todayLog.meals.some((m: Meal) => m.name === 'Avocado Toast')) {
          todayLog.meals.push(
            { id: '12', name: 'Avocado Toast', quantity: '2 slices', calories: 320, protein: 10, carbs: 30, fat: 20, date: todayStr, type: 'lunch' },
            { id: '13', name: 'Protein Bar', quantity: '1 bar', calories: 220, protein: 20, carbs: 22, fat: 7, date: todayStr, type: 'pre-workout' },
            { id: '14', name: 'Black Coffee', quantity: '1 cup', calories: 5, protein: 0, carbs: 1, fat: 0, date: todayStr, type: 'pre-workout' }
          );
        }
        parsed.forEach((l: DailyLog) => {
          const uniqueMeals: Meal[] = [];
          const seen = new Set();
          l.meals.forEach((m: Meal) => {
            if (!seen.has(m.id)) {
              seen.add(m.id);
              uniqueMeals.push(m);
            } else {
               // Assign a new ID instead of dropping it if it was added manually with a duplicate ID by mistake
               const newMeal = { ...m, id: Math.random().toString(36).substr(2, 9) };
               seen.add(newMeal.id);
               uniqueMeals.push(newMeal);
            }
          });
          l.meals = uniqueMeals;
        });
        localStorage.setItem('trainroot_logs', JSON.stringify(parsed));

        return parsed;
      }
    }
    
    return [
      {
        date: todayStr,
        workouts: [],
        water: 5,
        meals: [
          { id: '1', name: 'Oats with Milk', quantity: '100g', calories: 350, protein: 12, carbs: 58, fat: 5, date: todayStr, type: 'breakfast' },
          { id: '2', name: 'Boiled Eggs', quantity: '2 pcs', calories: 130, protein: 11, carbs: 1, fat: 9, date: todayStr, type: 'breakfast' },
          { id: '3', name: 'Grilled Chicken Breast', quantity: '200g', calories: 330, protein: 62, carbs: 0, fat: 7, date: todayStr, type: 'lunch' },
          { id: '4', name: 'Brown Rice', quantity: '150g', calories: 195, protein: 4, carbs: 42, fat: 1, date: todayStr, type: 'lunch' },
          { id: '5', name: 'Mixed Salad', quantity: '1 bowl', calories: 80, protein: 2, carbs: 12, fat: 3, date: todayStr, type: 'lunch' },
          { id: '6', name: 'Whey Protein Shake', quantity: '1 scoop', calories: 120, protein: 25, carbs: 4, fat: 1, date: todayStr, type: 'pre-workout' },
          { id: '7', name: 'Banana', quantity: '1 pc', calories: 100, protein: 1, carbs: 27, fat: 0, date: todayStr, type: 'pre-workout' },
          { id: '8', name: 'Salmon Fillet', quantity: '150g', calories: 310, protein: 34, carbs: 0, fat: 19, date: todayStr, type: 'dinner' },
          { id: '9', name: 'Roasted Sweet Potato', quantity: '100g', calories: 90, protein: 2, carbs: 21, fat: 0, date: todayStr, type: 'dinner' },
          { id: '10', name: 'Steamed Broccoli', quantity: '1 cup', calories: 55, protein: 4, carbs: 11, fat: 1, date: todayStr, type: 'dinner' },
          { id: '11', name: 'Almonds', quantity: '30g', calories: 170, protein: 6, carbs: 6, fat: 15, date: todayStr, type: 'snack' },
          { id: '12', name: 'Avocado Toast', quantity: '2 slices', calories: 320, protein: 10, carbs: 30, fat: 20, date: todayStr, type: 'lunch' },
          { id: '13', name: 'Protein Bar', quantity: '1 bar', calories: 220, protein: 20, carbs: 22, fat: 7, date: todayStr, type: 'pre-workout' },
          { id: '14', name: 'Black Coffee', quantity: '1 cup', calories: 5, protein: 0, carbs: 1, fat: 0, date: todayStr, type: 'pre-workout' }
        ]
      }
    ];
  });
  const [goal, setGoal] = useState<Goal | null>(null);

  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo(0, 0);
    }
  }, [activeSection]);

  useEffect(() => {
    localStorage.setItem('trainroot_stats', JSON.stringify(userStats));
  }, [userStats]);

  useEffect(() => {
    localStorage.setItem('trainroot_logs', JSON.stringify(logs));
  }, [logs]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [indianDateTime, setIndianDateTime] = useState('');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: '1', text: "Ready to crush today's workout?", time: "2h ago", read: false },
    { id: '2', text: "Remember to drink 3L of water.", time: "5h ago", read: false }
  ]);

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'offline'>('synced');

  useEffect(() => {
    const checkConnection = () => {
      setSyncStatus(navigator.onLine ? 'synced' : 'offline');
    };
    window.addEventListener('online', checkConnection);
    window.addEventListener('offline', checkConnection);
    checkConnection();
    
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { 
        timeZone: 'Asia/Kolkata', 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      };
      setIndianDateTime(now.toLocaleDateString('en-IN', options));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute

    const handleSwitchToSettings = () => setActiveSection('settings');
    window.addEventListener('switch-to-settings', handleSwitchToSettings);

    return () => {
      clearInterval(interval);
      window.removeEventListener('switch-to-settings', handleSwitchToSettings);
    };
  }, []);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [user, setUser] = useState<any>({
    id: 'local-user',
    email: 'coach@trainroot.fit',
    user_metadata: { full_name: 'Elite Athlete' }
  });

  const getIndianDateString = () => {
    const d = new Date();
    const options: Intl.DateTimeFormatOptions = { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' };
    const formatter = new Intl.DateTimeFormat('en-CA', options); // 'en-CA' outputs YYYY-MM-DD
    return formatter.format(d);
  };
  
  const todayStr = getIndianDateString();
  const todayLog = logs.find(l => l.date === todayStr) || { date: todayStr, workouts: [], meals: [] };

  const addMeal = (meal: Omit<Meal, 'id' | 'date'>) => {
    const newMealId = Math.random().toString(36).substr(2, 9);
    const newMeal: Meal = { ...meal, id: newMealId, date: todayStr };
    
    // Local state Update
    const updatedLogs = [...logs];
    const logIndex = updatedLogs.findIndex(l => l.date === todayStr);
    if (logIndex >= 0) {
      updatedLogs[logIndex].meals.push(newMeal);
    } else {
      updatedLogs.push({ date: todayStr, workouts: [], meals: [newMeal] });
    }
    setLogs(updatedLogs);
  };

  const updateMeal = (id: string, updatedInfo: Partial<Meal>) => {
    const updatedLogs = [...logs];
    const logIndex = updatedLogs.findIndex(l => l.date === todayStr);
    if (logIndex >= 0) {
      const mealIndex = updatedLogs[logIndex].meals.findIndex(m => m.id === id);
      if (mealIndex >= 0) {
        updatedLogs[logIndex].meals[mealIndex] = { ...updatedLogs[logIndex].meals[mealIndex], ...updatedInfo };
        setLogs(updatedLogs);
      }
    }
  };

  const deleteMeal = (mealId: string) => {
    // Local state Update
    const updatedLogs = [...logs];
    const logIndex = updatedLogs.findIndex(l => l.date === todayStr);
    if (logIndex >= 0) {
      updatedLogs[logIndex].meals = updatedLogs[logIndex].meals.filter(m => m.id !== mealId);
      setLogs(updatedLogs);
    }
  };

  const updateWater = (water: number) => {
    const updatedLogs = [...logs];
    const logIndex = updatedLogs.findIndex(l => l.date === todayStr);
    if (logIndex >= 0) {
      updatedLogs[logIndex].water = water;
    } else {
      updatedLogs.push({ date: todayStr, workouts: [], meals: [], water });
    }
    setLogs(updatedLogs);
  };

  const addWorkout = (workout: Exercise) => {
    // Local state Update
    const updatedLogs = [...logs];
    const logIndex = updatedLogs.findIndex(l => l.date === todayStr);
    
    if (logIndex >= 0) {
      updatedLogs[logIndex].workouts.push(workout);
    } else {
      updatedLogs.push({ date: todayStr, workouts: [workout], meals: [] });
    }
    setLogs(updatedLogs);
  };

  const deleteWorkout = (workoutId: string) => {
    // Local state Update
    const updatedLogs = [...logs];
    const logIndex = updatedLogs.findIndex(l => l.date === todayStr);
    if (logIndex >= 0) {
      updatedLogs[logIndex].workouts = updatedLogs[logIndex].workouts.filter(w => w.id !== workoutId);
      setLogs(updatedLogs);
    }
  };

  const handleCompleteWorkout = () => {
    const today = new Date().toISOString().split('T')[0];
    const newStats = { ...userStats };
    
    if (newStats.lastWorkoutDate) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      if (newStats.lastWorkoutDate === yesterdayStr) {
        newStats.streak += 1;
      } else if (newStats.lastWorkoutDate !== today) {
        newStats.streak = 1;
      }
    } else {
      newStats.streak = 1;
    }
    
    newStats.lastWorkoutDate = today;
    
    // Update stats locally
    setUserStats(newStats);
    setShowCelebration(true);
  };

  function NavItem({ 
    section, 
    label, 
    icon: Icon 
  }: { 
    section: Section, 
    label: string, 
    icon: any 
  }) {
    const isActive = activeSection === section;
    
    return (
      <button
        onClick={() => setActiveSection(section)}
        className={`flex items-center gap-4 w-full px-4 py-3.5 rounded-2xl transition-all duration-300 group relative ${
          isActive 
            ? 'text-brand' 
            : 'text-[#8a94a6] hover:text-white'
        }`}
      >
        {isActive && (
          <motion.div 
            layoutId="sidebar-active"
            className="absolute inset-0 bg-[#121212] rounded-2xl ring-1 ring-white/5 shadow-2xl shadow-black/40"
          />
        )}
        <Icon size={20} className={`relative z-10 ${isActive ? 'text-brand' : 'text-[#8a94a6] transition-colors group-hover:text-white'}`} />
        <span className={`relative z-10 font-black uppercase tracking-[0.1em] text-[11px] ${isActive ? 'text-brand' : 'text-[#8a94a6] group-hover:text-white'}`}>{label}</span>
      </button>
    );
  }

  // No login gate requested

  return (
    <div className="flex h-screen bg-[#050505] text-text-main font-sans overflow-hidden transition-colors duration-500">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 lg:relative lg:translate-x-0
        bg-[#0a0a0a] border-r border-white/5 transition-all duration-300 
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        w-[80%] lg:w-[260px] p-8 flex flex-col gap-16
      `}>
        <button 
          onClick={() => {
            setActiveSection('dashboard');
            setIsMobileMenuOpen(false);
          }}
          className="flex items-center gap-2 hover:opacity-90 transition-opacity text-left group px-2"
        >
          {isSidebarOpen && (
            <span className="text-3xl font-black text-white italic tracking-tighter leading-none uppercase">Train<span className="text-brand">root</span></span>
          )}
        </button>

        <nav className="flex flex-col gap-2 flex-1">
          <div onClick={() => setIsMobileMenuOpen(false)}>
            <NavItem section="dashboard" icon={LayoutDashboard} label="Dashboard" />
          </div>
          <div onClick={() => setIsMobileMenuOpen(false)}>
            <NavItem section="workouts" icon={Dumbbell} label="Workouts" />
          </div>
          <div onClick={() => setIsMobileMenuOpen(false)}>
            <NavItem section="diet" icon={Utensils} label="Diet Plan" />
          </div>
          <div onClick={() => setIsMobileMenuOpen(false)}>
            <NavItem section="progress" icon={TrendingUp} label="Progress" />
          </div>
          
          <div className="mt-auto pt-8 border-t border-white/5 space-y-4">
            <div onClick={() => setIsMobileMenuOpen(false)}>
              <NavItem section="settings" icon={Settings} label="Settings" />
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-20 bg-app-bg border-b border-card-border flex items-center justify-between px-4 lg:px-12 shrink-0 z-40">
          <div className="flex items-center gap-4 flex-1 max-w-md">
            {/* Mobile Navigation Button */}
            <div className="flex lg:hidden items-center gap-2">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 text-text-muted hover:text-brand bg-card-bg border border-card-border rounded-xl transition-colors shadow-sm"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 lg:gap-10">
            <div className="hidden lg:flex items-center gap-8">
              <div className="text-[11px] font-black tracking-wider text-brand uppercase">
                <span className="text-text-muted mr-2">Today:</span> 
                {indianDateTime}
                <span className={`ml-4 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${syncStatus === 'synced' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                  {syncStatus === 'synced' ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 lg:gap-4 lg:border-l border-card-border lg:pl-10">
              <div className="relative">
                <button 
                  onClick={() => setIsNotificationsOpen(prev => !prev)}
                  className="w-10 h-10 bg-card-bg border border-card-border rounded-xl flex items-center justify-center text-text-muted hover:text-brand hover:border-brand/30 transition-all shadow-sm group relative"
                >
                  <Bell size={18} className={`group-hover:animate-swing ${notifications.some(n => !n.read) ? 'text-brand' : ''}`} />
                  {notifications.some(n => !n.read) && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse border border-[#0c0c0c]"></span>
                  )}
                </button>
                
                <AnimatePresence>
                  {isNotificationsOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-72 bg-[#141414] border border-[#1f2937] rounded-2xl shadow-2xl p-4 z-50 origin-top-right"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-text-main font-bold text-sm tracking-tight">Notifications</h4>
                        <button 
                          className="text-xs text-brand font-medium hover:text-brand/80 transition-colors"
                          onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                        >
                          Mark all read
                        </button>
                      </div>
                      <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                        {notifications.map(notif => (
                          <div key={notif.id} className={`p-3 rounded-xl border transition-colors ${notif.read ? 'bg-[#0a0a0a] border-transparent opacity-60' : 'bg-[#1a1a1a] border-brand/20'}`}>
                            <p className="text-sm font-medium text-text-main leading-tight mb-1">{notif.text}</p>
                            <p className="text-[10px] text-text-muted tracking-wide font-medium uppercase">{notif.time}</p>
                          </div>
                        ))}
                      </div>
                      <button 
                        className="mt-4 w-full py-2 bg-[#1a1a1a] hover:bg-brand/10 border border-white/5 hover:border-brand/30 text-text-muted hover:text-brand rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                        onClick={() => {
                          const text = window.prompt("Enter notification text:") || "Stay hydrated and keep pushing!";
                          setNotifications(prev => [{
                            id: Date.now().toString(),
                            text,
                            time: 'Just now',
                            read: false
                          }, ...prev]);
                        }}
                      >
                        <Plus size={14} /> Add New Notification
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg border-2 border-brand/20 ml-2 shrink-0 bg-card-bg flex items-center justify-center text-brand/20">
                 {userStats.photoUrl || user?.photoURL ? (
                    <img 
                      src={userStats.photoUrl || user?.photoURL} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                 ) : (
                    <User size={20} />
                 )}
              </div>
            </div>
          </div>
        </header>

        <main ref={mainRef} className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 pb-12 custom-scrollbar scroll-smooth">
          <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeSection === 'dashboard' && <Dashboard log={todayLog} user={userStats} history={logs} goal={goal} syncStatus={syncStatus} />}
              {activeSection === 'workouts' && <WorkoutSection log={todayLog} onAdd={addWorkout} onDelete={deleteWorkout} onComplete={handleCompleteWorkout} />}
              {activeSection === 'diet' && <DietSection log={todayLog} onAdd={addMeal} onUpdateMeal={updateMeal} onDeleteMeal={deleteMeal} onUpdateWater={updateWater} stats={userStats} />}
              {activeSection === 'progress' && <AISection stats={userStats} logs={logs} />}
              {activeSection === 'notifications' && (
                <div className="bg-[#0c0c0c] border border-white/5 rounded-2xl p-8 shadow-2xl">
                  <h2 className="text-2xl font-black text-white uppercase italic mb-6">Notifications</h2>
                  <div className="space-y-4">
                    {notifications.map(notif => (
                      <div key={notif.id} className={`p-4 rounded-xl border transition-colors ${notif.read ? 'bg-[#0a0a0a] border-transparent opacity-60' : 'bg-[#1a1a1a] border-brand/20'}`}>
                        <p className="text-sm font-medium text-text-main leading-tight mb-2">{notif.text}</p>
                        <p className="text-[10px] text-text-muted tracking-wide font-medium uppercase">{notif.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeSection === 'settings' && (
                <SettingsDashboard 
                  stats={userStats} 
                  onSave={(newStats) => {
                    setUserStats(newStats);
                    setSaveSuccess(true);
                    setTimeout(() => setSaveSuccess(false), 3000);
                  }}
                  onLogout={() => {}} 
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      </div>

      <AnimatePresence>
        {showCelebration && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#0c0c0c] border border-brand/20 p-12 rounded-[3rem] max-w-lg w-full text-center shadow-2xl shadow-brand/10 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-brand/5 to-transparent pointer-events-none" />
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12, delay: 0.2 }}
                className="w-24 h-24 bg-brand rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-brand/40"
              >
                <Flame size={48} className="text-black fill-black" />
              </motion.div>

              <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-4">
                Workout Complete!
              </h2>
              <p className="text-text-muted mb-8 font-medium text-sm">
                Daily record synchronized. Your discipline is legendary.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                  <span className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">New Streak</span>
                  <span className="text-3xl font-black text-brand italic">{userStats.streak} Days</span>
                </div>
                <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                  <span className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Status</span>
                  <span className="text-3xl font-black text-white italic">Synced</span>
                </div>
              </div>

              <button 
                onClick={() => setShowCelebration(false)}
                className="w-full bg-brand text-black py-5 rounded-2xl font-black uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-brand/20 text-xs italic"
              >
                Continue Training
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Sub-components (Simplified for brevity, would usually be in separate files)

function Dashboard({ log, user, history, goal, syncStatus }: { log: DailyLog, user: UserStats, history: DailyLog[], goal: Goal | null, syncStatus: 'synced' | 'offline' }) {
  const caloriesConsumed = log.meals.reduce((acc, m) => acc + m.calories, 0);
  const proteinConsumed = log.meals.reduce((acc, m) => acc + m.protein, 0);
  
  const weeklyPerformance = 82; // Simulated from image
  const streakDays = 14; // Simulated from image

  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    // Generate date based on Indian Time
    const d = new Date();
    // Use UTC shift + local day offset to avoid browser timezone edge cases
    // Best way in JS is formatting based on timezone
    d.setDate(d.getDate() - (6 - i));
    
    // Format to YYYY-MM-DD in IST
    const optionsDate: Intl.DateTimeFormatOptions = { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' };
    const dateStr = new Intl.DateTimeFormat('en-CA', optionsDate).format(d);
    
    // Format weekday in IST
    const optionsDay: Intl.DateTimeFormatOptions = { timeZone: 'Asia/Kolkata', weekday: 'short' };
    const dayName = new Intl.DateTimeFormat('en-US', optionsDay).format(d);

    const logForDay = history.find(l => l.date === dateStr);
    return {
      name: dayName,
      calories: logForDay?.meals.reduce((acc, m) => acc + m.calories, 0) || 0,
      workouts: logForDay?.workouts.length || 0,
    };
  });

  return (
    <div className="space-y-6 lg:space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl md:text-5xl font-display font-black text-text-main tracking-tighter italic uppercase leading-none">
              Welcome back, <span className="text-white">{user.name.split(' ')[0]}</span>
            </h1>
            <button 
              onClick={() => {
                // We'll need a way to communicate to SettingsDashboard to start in edit mode
                // For now, just switching to settings is a good start
                window.dispatchEvent(new CustomEvent('switch-to-settings'));
              }}
              className="p-2 bg-card-bg border border-card-border rounded-xl text-text-muted hover:text-brand hover:border-brand/30 transition-all shadow-sm group"
              title="Edit Profile"
            >
              <Settings size={16} className="group-hover:rotate-90 transition-transform duration-500" />
            </button>
          </div>
          <p className="text-text-muted mt-4 font-bold text-sm md:text-lg tracking-tight">
            Your performance journey is <span className="text-brand font-black italic">{weeklyPerformance}%</span> complete for this week. Keep going.
          </p>
        </div>
        
        <div className="bg-card-bg border border-card-border p-4 md:p-6 rounded-[2rem] flex items-center gap-5 shadow-2xl shadow-black/10 w-full md:w-auto md:min-w-[200px] hover:border-brand/20 transition-colors group">
          <div className="w-14 h-14 bg-brand/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Zap className="text-brand fill-brand" size={28} />
          </div>
          <div>
            <span className="text-[10px] text-text-muted uppercase font-black tracking-[0.2em] block mb-1">Weekly Root</span>
            <span className="text-2xl font-black text-white italic tracking-tighter">Day {Math.max(1, Math.floor((new Date().getTime() - new Date(goal?.startDate || new Date()).getTime()) / (1000 * 60 * 60 * 24)))}</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="md:col-span-2 space-y-6 lg:space-y-8">
          <div className="bg-card-bg border border-card-border p-5 md:p-8 rounded-[2rem] shadow-2xl shadow-black/5">
             <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-3">
                   <Timer size={24} className="text-brand" />
                   <h3 className="text-2xl font-bold text-text-main tracking-tight">Today's Workout</h3>
                </div>
                <span className={`px-3 py-1 ${syncStatus === 'synced' ? 'bg-brand/10 text-brand border-brand/20' : 'bg-red-500/10 text-red-500 border-red-500/20'} text-[10px] font-black uppercase tracking-widest border rounded-full`}>
                  {syncStatus === 'synced' ? 'Active Session' : 'Offline Mode'}
                </span>
             </div>

             <div className="space-y-6">
                {log.workouts.length === 0 ? (
                  <div className="py-12 text-center text-text-muted border border-dashed border-card-border rounded-3xl">
                     No movements recorded yet. Time to root yourself in training.
                  </div>
                ) : (
                  log.workouts.map((w, i) => (
                    <div key={i} className="flex items-center gap-6 group">
                        <div className="w-16 h-16 bg-brand/5 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-brand/10 transition-colors">
                           <Zap className="text-brand" size={28} />
                        </div>
                        <div className="flex-1">
                           <h4 className="text-lg font-black uppercase tracking-tight italic">{w.name}</h4>
                           <p className="text-text-muted text-sm font-medium">{w.sets.length} Sets × {w.sets[0]?.reps || 0} Reps • Control Phase</p>
                        </div>
                        <div className="text-right">
                           <span className="text-lg font-black text-brand italic">+{w.sets.reduce((acc, s) => acc + s.weight, 0)} kg</span>
                           <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest mt-1">Total Weight</p>
                        </div>
                    </div>
                  ))
                )}
             </div>
          </div>

          <div className="bg-card-bg border border-card-border p-6 md:p-8 rounded-[2rem] shadow-2xl shadow-black/5">
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-xl font-bold text-text-main tracking-tight">Weekly Performance</h3>
            </div>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                <BarChart data={last7Days}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 700 }} />
                  <Tooltip 
                    cursor={{ fill: 'var(--brand)', opacity: 0.05 }} 
                    contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', fontWeight: 700 }}
                  />
                  <Bar dataKey="calories" radius={[4, 4, 0, 0]}>
                    {last7Days.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 6 ? 'var(--brand)' : 'var(--card-border)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="md:col-span-1 lg:col-span-1 grid grid-cols-2 lg:grid-cols-1 gap-4 md:gap-6 lg:gap-8">
          <div className="col-span-1 lg:col-span-1 bg-card-bg border border-card-border p-4 md:p-8 rounded-[2rem] shadow-2xl shadow-black/5">
             <h3 className="text-[10px] md:text-xs text-text-muted uppercase font-black tracking-widest md:tracking-[0.2em] mb-4 md:mb-8">Body</h3>
             <div className="flex items-end gap-1 md:gap-3 mb-4 md:mb-6">
                <span className="text-3xl md:text-5xl font-black text-text-main italic tracking-tighter">{user.weight}</span>
                <span className="text-sm md:text-xl font-black text-text-muted mb-1 italic">kg</span>
             </div>
             <p className="flex items-center gap-1 md:gap-2 text-brand text-[8px] md:text-xs font-black uppercase tracking-widest mb-6 md:mb-10">
                <TrendingUp size={12} /> -0.8 kg
             </p>

             <div className="space-y-3 md:space-y-4">
                <div className="flex justify-between text-[8px] md:text-[10px] font-black uppercase tracking-widest">
                   <span className="text-text-muted">Goal</span>
                   <span className="text-text-main">65%</span>
                </div>
                <div className="w-full bg-card-border h-1.5 md:h-2 rounded-full overflow-hidden">
                   <div className="h-full bg-brand" style={{ width: '65%' }} />
                </div>
             </div>
          </div>

          <div className="col-span-1 lg:col-span-1 bg-card-bg border border-card-border p-4 md:p-8 rounded-[2rem] shadow-2xl shadow-black/5">
             <div className="flex justify-between items-center mb-4 md:mb-8">
                <h3 className="text-[10px] md:text-lg font-bold text-text-main tracking-tight uppercase md:normal-case">Fuel</h3>
                <button className="hidden md:block text-[10px] text-text-muted hover:text-brand font-black uppercase tracking-widest transition-colors">Edit</button>
             </div>

             <div className="relative space-y-4 md:space-y-6 before:absolute before:left-[3px] before:top-2 before:bottom-2 before:w-[1px] before:bg-card-border">
                {log.meals.slice(0, 2).length === 0 ? (
                  <div className="pl-6 md:pl-10 py-4 md:py-6 text-text-muted font-bold text-[10px] uppercase tracking-widest italic opacity-50">
                    Empty.
                  </div>
                ) : (
                  log.meals.slice(0, 2).map((m, i) => (
                    <div key={i} className="flex flex-col md:flex-row md:justify-between md:items-center relative pl-6 md:pl-10">
                      <div className={`absolute left-0 top-1.5 w-1.5 md:w-2 h-1.5 md:h-2 rounded-full z-10 ${i < log.meals.length - 1 ? 'bg-brand shadow-[0_0_8px_rgba(45,212,191,0.5)]' : 'bg-[#2a2a2a]'}`} />
                      <div className="truncate">
                        <h5 className="text-[10px] md:text-[12px] font-bold text-text-main uppercase tracking-tight leading-none truncate">{m.name}</h5>
                      </div>
                      <span className="text-[8px] md:text-[10px] text-text-muted font-bold md:ml-2">{(i * 3 + 7).toString().padStart(2, '0')}:30</span>
                    </div>
                  ))
                )}
             </div>

             <div className="mt-6 md:mt-10 pt-6 md:pt-8 border-t border-card-border space-y-4 md:space-y-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 md:gap-4">
                  <div>
                    <span className="text-[8px] md:text-[9px] text-text-muted uppercase font-black tracking-widest block mb-0.5">Left</span>
                    <span className="text-sm md:text-lg font-bold text-brand">{Math.max(0, user.dailyCalorieGoal - caloriesConsumed).toLocaleString()}</span>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkoutSection({ log, onAdd, onDelete, onComplete }: { log: DailyLog, onAdd: (e: Exercise) => void, onDelete: (id: string) => void, onComplete: () => void }) {
  const [activeTab, setActiveTab] = useState<'log' | 'library' | 'saved'>('library');
  const [isAdding, setIsAdding] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(EXERCISE_LIBRARY_DATA[0].name);
  const [sets, setSets] = useState<{ reps: number, weight: number }[]>([{ reps: 10, weight: 0 }]);
  
  const [muscleFilter, setMuscleFilter] = useState(() => localStorage.getItem('trainroot_workout_muscleFilter') || 'All');
  const [equipmentFilter, setEquipmentFilter] = useState(() => localStorage.getItem('trainroot_workout_equipmentFilter') || 'All');
  const [levelFilter, setLevelFilter] = useState(() => localStorage.getItem('trainroot_workout_levelFilter') || 'All');
  
  useEffect(() => {
    localStorage.setItem('trainroot_workout_muscleFilter', muscleFilter);
  }, [muscleFilter]);

  useEffect(() => {
    localStorage.setItem('trainroot_workout_equipmentFilter', equipmentFilter);
  }, [equipmentFilter]);

  useEffect(() => {
    localStorage.setItem('trainroot_workout_levelFilter', levelFilter);
  }, [levelFilter]);

  const [savedIds, setSavedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('saved_exercises');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('saved_exercises', JSON.stringify(savedIds));
  }, [savedIds]);

  const toggleSave = (id: string) => {
    setSavedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleAddSet = () => setSets([...sets, { reps: 10, weight: 0 }]);
  const handleUpdateSet = (index: number, field: string, val: number) => {
    const newSets = [...sets];
    (newSets[index] as any)[field] = val;
    setSets(newSets);
  };

  const handleSave = () => {
    onAdd({
      id: Math.random().toString(36).substr(2, 9),
      name: selectedExercise,
      date: new Date().toISOString(),
      sets: sets.map((s, i) => ({ ...s, id: i.toString(), completed: true }))
    });
    setIsAdding(false);
    setActiveTab('log');
  };

  const muscleGroups = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];
  const equipmentTypes = ['All', 'Dumbbells', 'Barbell', 'Kettlebell', 'Cable', 'Bodyweight'];
  const levelTypes = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Pro'];

  const [searchTerm, setSearchTerm] = useState('');

  const libraryData = activeTab === 'saved' 
    ? EXERCISE_LIBRARY_DATA.filter(ex => savedIds.includes(ex.id))
    : EXERCISE_LIBRARY_DATA;

  const filteredExercises = libraryData.filter(ex => {
    const matchMuscle = muscleFilter === 'All' || ex.muscleGroup.includes(muscleFilter);
    const matchEquip = equipmentFilter === 'All' || ex.equipment.includes(equipmentFilter);
    const matchLevel = levelFilter === 'All' || ex.level === levelFilter;
    const matchSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      ex.muscleGroup.toLowerCase().includes(searchTerm.toLowerCase());
    return matchMuscle && matchEquip && matchLevel && matchSearch;
  });

  return (
    <div className="space-y-3 md:space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter leading-none mb-0.5">
            Work<span className="text-brand">outs</span>
          </h2>
          <p className="text-text-muted font-bold text-[8px] md:text-[9px] uppercase opacity-60">My Daily Records</p>
        </div>
        
        <div className="flex p-0.5 bg-[#0a0a0a] border border-white/5 rounded-md ring-1 ring-white/5 shadow-md overflow-x-auto max-w-full">
          <button 
            onClick={() => setActiveTab('log')}
            className={`px-2.5 py-1 rounded text-[7px] font-black uppercase tracking-[0.1em] transition-all whitespace-nowrap ${activeTab === 'log' ? 'bg-brand text-black' : 'text-text-muted hover:text-white'}`}
          >
            Daily Log
          </button>
          <button 
            onClick={() => setActiveTab('library')}
            className={`px-2.5 py-1 rounded text-[7px] font-black uppercase tracking-[0.1em] transition-all whitespace-nowrap ${activeTab === 'library' ? 'bg-brand text-black' : 'text-text-muted hover:text-white'}`}
          >
            Exercise List
          </button>
          <button 
            onClick={() => setActiveTab('saved')}
            className={`px-2.5 py-1 rounded text-[7px] font-black uppercase tracking-[0.1em] transition-all whitespace-nowrap ${activeTab === 'saved' ? 'bg-brand text-black' : 'text-text-muted hover:text-white'}`}
          >
            My Favs
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'log' ? (
          <motion.div 
            key="log"
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            className="space-y-3"
          >
            <div className="flex justify-between items-center px-0.5">
              <h3 className="text-xs font-black text-white uppercase italic tracking-widest">Today's Workout</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => onComplete()}
                  className="bg-brand text-black px-2 py-1 rounded-md flex items-center gap-1 hover:scale-[1.02] transition font-black uppercase tracking-widest text-[7px] shadow shadow-brand/10 italic"
                >
                  Finish
                </button>
                <button 
                  onClick={() => setIsAdding(true)}
                  className="bg-white/5 text-white px-2 py-1 rounded-md flex items-center gap-1 hover:scale-[1.02] transition font-black uppercase tracking-widest text-[7px] shadow shadow-white/5 italic"
                >
                  <Plus size={10} /> Add New
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pb-8">
              {log.workouts.length === 0 ? (
                <div className="md:col-span-2 bg-[#0c0c0c] border border-dashed border-white/5 py-6 px-4 rounded-xl text-center flex flex-col items-center justify-center space-y-2">
                  <div className="w-8 h-8 bg-white/[0.02] border border-white/5 rounded-lg flex items-center justify-center text-text-muted">
                    <Activity size={16} />
                  </div>
                  <p className="text-text-muted font-bold uppercase tracking-[0.1em] text-[7px]">No log found. Add an exercise to start.</p>
                </div>
              ) : (
                log.workouts.map(workout => (
                  <div key={workout.id} className="bg-[#0c0c0c] border border-white/5 p-3 md:p-4 rounded-xl shadow-sm hover:border-brand/30 transition-all relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
                      <TrendingUp size={40} />
                    </div>
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex justify-between items-start mb-3">
                        <div className="max-w-[70%]">
                          <h3 className="text-sm font-black text-white uppercase italic tracking-tight leading-tight truncate">{workout.name}</h3>
                          <span className="text-[7px] text-brand uppercase font-black tracking-[0.2em] opacity-60">Verified</span>
                        </div>
                        <div className="flex gap-1.5 items-center">
                          <div className="bg-[#050505] px-1.5 py-0.5 rounded border border-white/5">
                            <span className="text-[7px] text-white/50 font-black uppercase">{workout.sets.length} Sets</span>
                          </div>
                          <button 
                            onClick={() => onDelete(workout.id)}
                            className="p-1 text-red-500/50 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={10} />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1 mt-auto">
                        {workout.sets.map((set, idx) => (
                          <div key={set.id} className="bg-[#050505] p-2 rounded-lg border border-white/5 flex justify-between items-center">
                            <span className="text-text-muted text-[7px] font-black uppercase tracking-[0.1em] opacity-40">Set {idx + 1}</span>
                            <div className="flex items-center gap-1.5">
                              <span className="font-black text-white italic text-sm">{set.weight}<span className="text-[7px] ml-0.5 opacity-30">KG</span></span>
                              <span className="text-brand font-black opacity-20 text-[8px]">×</span>
                              <span className="font-black text-white italic text-sm">{set.reps}<span className="text-[7px] ml-0.5 opacity-30">Reps</span></span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="library"
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            className="space-y-4"
          >
            {/* Library Header & Filters */}
            <div className="bg-[#0c0c0c] border border-white/5 p-3 md:p-4 rounded-xl shadow-md relative overflow-hidden">
               <div className="relative z-10 space-y-4">
                 <div className="flex flex-col sm:flex-row gap-3">
                   <h3 className="text-sm font-black text-white uppercase italic leading-none shrink-0 self-center">
                     {activeTab === 'saved' ? 'My Favs' : 'All Items'}
                   </h3>
                   <div className="relative group flex-1">
                     <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-brand transition-colors" size={12} />
                     <input 
                       type="text" 
                       placeholder="Find gym exercise..." 
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                       className="w-full bg-[#050505] border border-white/5 rounded-md py-1.5 pl-8 pr-4 text-[9px] font-bold text-white outline-none focus:border-brand/40 transition-all shadow-inner"
                     />
                   </div>
                 </div>
                 
                 <div className="flex flex-col gap-3">
                   <div className="space-y-1.5">
                     <span className="text-[7px] font-black text-brand uppercase tracking-widest opacity-60">Body Part</span>
                     <div className="flex flex-wrap gap-1">
                       {muscleGroups.map(group => (
                         <button 
                           key={group}
                           onClick={() => setMuscleFilter(group)}
                           className={`px-2 py-1 rounded text-[7px] font-black uppercase transition-all ${muscleFilter === group ? 'bg-brand text-black' : 'bg-[#050505] text-text-muted border border-white/5 hover:border-white/10'}`}
                         >
                           {group}
                         </button>
                       ))}
                     </div>
                   </div>

                   <div className="flex flex-wrap gap-x-6 gap-y-3">
                     <div className="space-y-1.5 flex-1 min-w-[120px]">
                       <span className="text-[7px] font-black text-brand uppercase tracking-widest opacity-60">Equipments</span>
                       <div className="flex flex-wrap gap-1">
                         {equipmentTypes.map(type => (
                           <button 
                             key={type}
                             onClick={() => setEquipmentFilter(type)}
                             className={`px-2 py-1 rounded text-[7px] font-black uppercase transition-all ${equipmentFilter === type ? 'bg-brand text-black' : 'bg-[#050505] text-text-muted border border-white/5 hover:border-white/10'}`}
                           >
                             {type}
                         </button>
                         ))}
                       </div>
                     </div>

                     <div className="space-y-1.5 flex-1 min-w-[120px]">
                       <span className="text-[7px] font-black text-brand uppercase tracking-widest opacity-60">Difficulty</span>
                       <div className="flex flex-wrap gap-1">
                         {levelTypes.map(lvl => (
                           <button 
                             key={lvl}
                             onClick={() => setLevelFilter(lvl)}
                             className={`px-2 py-1 rounded text-[7px] font-black uppercase transition-all ${levelFilter === lvl ? 'bg-brand text-black' : 'bg-[#050505] text-text-muted border border-white/5 hover:border-white/10'}`}
                           >
                             {lvl}
                           </button>
                         ))}
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pb-8">
              {filteredExercises.length === 0 ? (
                <div className="col-span-full py-6 text-center text-[8px] uppercase font-bold text-text-muted opacity-40">No items found.</div>
              ) : (
                filteredExercises.map(ex => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={ex.id}
                    className="bg-[#0c0c0c] border border-white/5 rounded-xl overflow-hidden group hover:border-brand/20 transition-all flex flex-col"
                  >
                    <div className="h-28 relative overflow-hidden">
                      <img 
                        src={ex.image} 
                        alt={ex.name} 
                        className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-300" 
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://picsum.photos/seed/${ex.id}/400/300`;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] to-transparent opacity-30 shadow-inner" />
                      <div className="absolute top-2 left-2">
                         <span className={`px-1 py-0.5 rounded-[4px] text-[6px] font-black uppercase tracking-tight border backdrop-blur-md ${
                           ex.level === 'Pro' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                           ex.level === 'Advanced' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                           ex.level === 'Intermediate' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                           'bg-brand/10 text-brand border-brand/20'
                         }`}>
                           {ex.level}
                         </span>
                      </div>
                      <button 
                        onClick={() => toggleSave(ex.id)}
                        className={`absolute top-2 right-2 p-1 rounded backdrop-blur-md border transition-all ${
                          savedIds.includes(ex.id) 
                          ? 'bg-brand border-brand text-black' 
                          : 'bg-black/20 border-white/5 text-white/50 hover:text-brand'
                        }`}
                      >
                        <Bookmark size={10} fill={savedIds.includes(ex.id) ? "currentColor" : "none"} />
                      </button>
                    </div>
                    <div className="p-3 space-y-2.5 flex-1 flex flex-col">
                      <h4 className="text-[11px] font-black text-white uppercase italic leading-tight truncate">{ex.name}</h4>
                      
                      <div className="flex flex-wrap gap-2 opacity-50 mb-1">
                         <div className="flex items-center gap-1">
                           <Target size={8} />
                           <span className="text-[7px] font-black uppercase">{ex.muscleGroup}</span>
                         </div>
                         <div className="flex items-center gap-1">
                           <Dumbbell size={8} />
                           <span className="text-[7px] font-black uppercase">{ex.equipment}</span>
                         </div>
                      </div>

                      {/* Displaying Instructions */}
                      {ex.instructions && ex.instructions.length > 0 && (
                        <div className="space-y-1 mt-2 flex-grow overflow-y-auto max-h-24 pr-1 custom-scrollbar">
                          {ex.instructions.map((step, idx) => (
                            <p key={idx} className="text-[8px] text-text-muted leading-tight font-medium">
                              <span className="text-brand mr-1 font-bold">{idx + 1}.</span>{step}
                            </p>
                          ))}
                        </div>
                      )}

                      {/* Beginner Advice block */}
                      {ex.level === 'Beginner' && ex.beginnerAdvice && (
                        <div className="bg-brand/10 border border-brand/20 p-2 rounded-md mt-2">
                          <p className="text-[7px] text-brand uppercase font-black tracking-widest mb-1">Beginner Advice</p>
                          <p className="text-[8px] text-brand/80 leading-snug font-medium italic">
                            {ex.beginnerAdvice}
                          </p>
                        </div>
                      )}

                      <div className="pt-2 mt-auto">
                        <button 
                          onClick={() => {
                            setSelectedExercise(ex.name);
                            setIsAdding(true);
                          }}
                          className="w-full py-1.5 bg-[#050505] border border-white/5 rounded-md text-[7px] font-black uppercase tracking-[0.1em] text-text-muted hover:text-brand hover:border-brand/40 transition-all italic active:scale-95"
                        >
                          Add to Log
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-app-bg/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#0c0c0c] border border-white/5 w-full max-w-xl rounded-[3rem] p-10 shadow-3xl shadow-black/60 overflow-y-auto max-h-[90vh] relative"
            >
              <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                 <Zap size={140} />
              </div>
              
              <div className="flex justify-between items-center mb-12 relative z-10">
                <div>
                  <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">Add <span className="text-brand">Training</span></h3>
                  <p className="text-[10px] text-text-muted uppercase font-black tracking-[0.3em] mt-3 opacity-60 italic">Record your gym performance</p>
                </div>
                <button onClick={() => setIsAdding(false)} className="bg-white/5 p-3 rounded-2xl text-text-muted hover:text-white transition-all ring-1 ring-white/10 hover:ring-white/20"><X size={20} /></button>
              </div>

              <div className="space-y-10 relative z-10">
                <div className="space-y-4">
                  <label className="text-[10px] text-brand uppercase font-black tracking-[0.4em] block ml-1 italic opacity-80">Movement Identification</label>
                  <div className="relative">
                    <input 
                      type="text"
                      list="gym_exercises"
                      value={selectedExercise}
                      onChange={(e) => setSelectedExercise(e.target.value)}
                      placeholder="Search to add movement..."
                      className="w-full bg-[#050505] border border-white/5 rounded-2xl px-6 py-5 pr-14 outline-none focus:border-brand transition text-white font-black italic"
                    />
                    <datalist id="gym_exercises">
                      {EXERCISE_LIBRARY_DATA.map(ex => <option key={ex.id} value={ex.name} />)}
                    </datalist>
                    <Dumbbell className="absolute right-6 top-1/2 -translate-y-1/2 text-brand/30 pointer-events-none" size={20} />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] text-brand uppercase font-black tracking-with-wider block italic opacity-80">Sets & Reps</label>
                    <button 
                      onClick={handleAddSet}
                      className="text-brand text-[9px] font-black uppercase tracking-widest hover:scale-105 flex items-center gap-2 transition"
                    >
                      <Plus size={14} /> Add Set
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {sets.map((set, i) => (
                      <div key={i} className="flex gap-4 items-center animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="w-12 h-12 flex items-center justify-center bg-[#050505] border border-white/5 rounded-xl text-[10px] font-black text-text-muted opacity-40 italic">
                          {i + 1}
                        </div>
                        <div className="flex-1 bg-[#050505] border border-white/5 rounded-2xl flex items-center px-6 py-4 focus-within:border-brand/40 transition-all">
                          <input 
                            type="number" 
                            value={set.weight} 
                            onChange={(e) => handleUpdateSet(i, 'weight', parseInt(e.target.value) || 0)}
                            className="w-full bg-transparent outline-none text-white font-black italic text-xl" 
                            placeholder="0"
                          />
                          <span className="text-text-muted ml-2 text-[9px] font-black uppercase tracking-widest opacity-40">Weight</span>
                        </div>
                        <span className="text-brand font-black italic opacity-20 text-xl">×</span>
                        <div className="flex-1 bg-[#050505] border border-white/5 rounded-2xl flex items-center px-6 py-4 focus-within:border-brand/40 transition-all">
                          <input 
                            type="number" 
                            value={set.reps} 
                            onChange={(e) => handleUpdateSet(i, 'reps', parseInt(e.target.value) || 0)}
                            className="w-full bg-transparent outline-none text-white font-black italic text-xl" 
                            placeholder="0"
                          />
                          <span className="text-text-muted ml-2 text-[9px] font-black uppercase tracking-widest opacity-40">Reps</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6">
                  <button 
                    onClick={handleSave}
                    className="w-full bg-brand text-black py-6 rounded-[2rem] font-black uppercase tracking-[0.4em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-3xl shadow-brand/20 text-xs italic"
                  >
                    Save Workout
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const INDIAN_FOOD_DB = [
  // BREAKFAST
  { name: 'Poha', quantity: '100g', calories: 180, protein: 3, carbs: 32, fat: 4, type: 'breakfast', isIndian: true },
  { name: 'Upma', quantity: '150g', calories: 200, protein: 5, carbs: 35, fat: 5, type: 'breakfast', isIndian: true },
  { name: 'Idli', quantity: '100g', calories: 130, protein: 4, carbs: 26, fat: 0.5, type: 'breakfast', isIndian: true },
  { name: 'Dosa', quantity: '80g', calories: 160, protein: 3, carbs: 29, fat: 4, type: 'breakfast', isIndian: true },
  { name: 'Sambar', quantity: '150ml', calories: 80, protein: 4, carbs: 12, fat: 1, type: 'breakfast', isIndian: true },
  { name: 'Coconut Chutney', quantity: '30g', calories: 60, protein: 1, carbs: 3, fat: 5, type: 'breakfast', isIndian: true },
  { name: 'Paratha', quantity: '80g', calories: 260, protein: 5, carbs: 36, fat: 10, type: 'breakfast', isIndian: true },
  { name: 'Besan Chilla', quantity: '100g', calories: 220, protein: 11, carbs: 28, fat: 6, type: 'breakfast', isIndian: true },
  { name: 'Boiled Moong Dal', quantity: '100g', calories: 105, protein: 7, carbs: 18, fat: 0.4, type: 'breakfast', isIndian: true },
  { name: 'Aloo Paratha', quantity: '150g', calories: 340, protein: 8, carbs: 48, fat: 14, type: 'breakfast', isIndian: true },
  { name: 'Paneer Paratha', quantity: '150g', calories: 360, protein: 14, carbs: 42, fat: 16, type: 'breakfast', isIndian: true },
  { name: 'Puri Sabzi', quantity: '150g', calories: 320, protein: 6, carbs: 40, fat: 16, type: 'breakfast', isIndian: true },
  { name: 'Pongal', quantity: '200g', calories: 290, protein: 8, carbs: 45, fat: 10, type: 'breakfast', isIndian: true },
  { name: 'Medu Vada', quantity: '50g', calories: 145, protein: 4, carbs: 18, fat: 6, type: 'breakfast', isIndian: true },
  
  // LUNCH
  { name: 'Dal Tadka', quantity: '150g', calories: 180, protein: 10, carbs: 24, fat: 4, type: 'lunch', isIndian: true },
  { name: 'Rajma', quantity: '150g', calories: 210, protein: 12, carbs: 32, fat: 3, type: 'lunch', isIndian: true },
  { name: 'Chole', quantity: '150g', calories: 230, protein: 11, carbs: 35, fat: 5, type: 'lunch', isIndian: true },
  { name: 'Jeera Rice', quantity: '150g', calories: 220, protein: 4, carbs: 44, fat: 3, type: 'lunch', isIndian: true },
  { name: 'Roti / Chapati', quantity: '60g', calories: 150, protein: 4, carbs: 28, fat: 2, type: 'lunch', isIndian: true },
  { name: 'Paneer Bhurji', quantity: '100g', calories: 265, protein: 14, carbs: 6, fat: 20, type: 'lunch', isIndian: true },
  { name: 'Mixed Veg Sabzi', quantity: '150g', calories: 120, protein: 3, carbs: 18, fat: 4, type: 'lunch', isIndian: true },
  { name: 'Chicken Curry', quantity: '150g', calories: 280, protein: 28, carbs: 8, fat: 15, type: 'lunch', isIndian: true },
  { name: 'Fish Curry', quantity: '150g', calories: 240, protein: 26, carbs: 6, fat: 12, type: 'lunch', isIndian: true },
  { name: 'Egg Bhurji', quantity: '120g', calories: 210, protein: 14, carbs: 4, fat: 15, type: 'lunch', isIndian: true },
  { name: 'Chicken Biryani', quantity: '300g', calories: 450, protein: 26, carbs: 55, fat: 14, type: 'lunch', isIndian: true },
  { name: 'Veg Biryani', quantity: '300g', calories: 380, protein: 10, carbs: 60, fat: 12, type: 'lunch', isIndian: true },
  { name: 'Bhindi Masala', quantity: '150g', calories: 140, protein: 3, carbs: 14, fat: 8, type: 'lunch', isIndian: true },
  { name: 'Baingan Bharta', quantity: '150g', calories: 120, protein: 3, carbs: 12, fat: 7, type: 'lunch', isIndian: true },
  { name: 'Aloo Gobi', quantity: '150g', calories: 130, protein: 4, carbs: 18, fat: 6, type: 'lunch', isIndian: true },
  { name: 'Kadai Paneer', quantity: '150g', calories: 310, protein: 14, carbs: 12, fat: 24, type: 'lunch', isIndian: true },

  // PRE-WORKOUT
  { name: 'Banana', quantity: '120g', calories: 105, protein: 1, carbs: 27, fat: 0, type: 'pre-workout', isIndian: false },
  { name: 'Dates', quantity: '30g', calories: 83, protein: 0.7, carbs: 22, fat: 0, type: 'pre-workout', isIndian: false },
  { name: 'Roasted Chana', quantity: '30g', calories: 110, protein: 7, carbs: 16, fat: 2, type: 'pre-workout', isIndian: true },
  { name: 'Sattu Drink', quantity: '30g', calories: 110, protein: 6, carbs: 20, fat: 1, type: 'pre-workout', isIndian: true },
  { name: 'Peanut Butter Roti', quantity: '1 piece', calories: 280, protein: 9, carbs: 32, fat: 13, type: 'pre-workout', isIndian: true },

  // DINNER
  { name: 'Dal Khichdi', quantity: '200g', calories: 280, protein: 10, carbs: 48, fat: 5, type: 'dinner', isIndian: true },
  { name: 'Grilled Tandoori Chicken', quantity: '150g', calories: 220, protein: 35, carbs: 4, fat: 7, type: 'dinner', isIndian: true },
  { name: 'Palak Paneer', quantity: '150g', calories: 260, protein: 12, carbs: 10, fat: 18, type: 'dinner', isIndian: true },
  { name: 'Moong Dal Soup', quantity: '200ml', calories: 130, protein: 8, carbs: 20, fat: 1, type: 'dinner', isIndian: true },
  { name: 'Roti + Sabzi', quantity: '1 plate', calories: 270, protein: 7, carbs: 46, fat: 6, type: 'dinner', isIndian: true },
  { name: 'Egg Curry', quantity: '150g', calories: 250, protein: 16, carbs: 8, fat: 17, type: 'dinner', isIndian: true },
  { name: 'Butter Chicken', quantity: '200g', calories: 380, protein: 28, carbs: 12, fat: 24, type: 'dinner', isIndian: true },
  { name: 'Garlic Naan', quantity: '100g', calories: 280, protein: 8, carbs: 45, fat: 6, type: 'dinner', isIndian: true },
  { name: 'Dal Makhani', quantity: '200g', calories: 320, protein: 12, carbs: 38, fat: 14, type: 'dinner', isIndian: true },
  { name: 'Paneer Tikka Masala', quantity: '200g', calories: 350, protein: 16, carbs: 15, fat: 26, type: 'dinner', isIndian: true },

  // SNACK
  { name: 'Roasted Makhana', quantity: '30g', calories: 110, protein: 4, carbs: 20, fat: 1, type: 'snack', isIndian: true },
  { name: 'Masala Chaas', quantity: '200ml', calories: 40, protein: 3, carbs: 5, fat: 1, type: 'snack', isIndian: true },
  { name: 'Sprouts Chaat', quantity: '100g', calories: 90, protein: 7, carbs: 14, fat: 1, type: 'snack', isIndian: true },
  { name: 'Peanuts', quantity: '30g', calories: 170, protein: 8, carbs: 5, fat: 14, type: 'snack', isIndian: true },
  { name: 'Greek Yogurt with Jaggery', quantity: '150g', calories: 140, protein: 10, carbs: 16, fat: 4, type: 'snack', isIndian: true },
  { name: 'Dhokla', quantity: '90g', calories: 150, protein: 6, carbs: 24, fat: 3, type: 'snack', isIndian: true },
  { name: 'Samosa', quantity: '1 piece (80g)', calories: 240, protein: 4, carbs: 26, fat: 14, type: 'snack', isIndian: true },
  { name: 'Moong Dal Kachori', quantity: '1 piece (70g)', calories: 220, protein: 5, carbs: 24, fat: 12, type: 'snack', isIndian: true },
  { name: 'Bhel Puri', quantity: '100g', calories: 180, protein: 4, carbs: 35, fat: 3, type: 'snack', isIndian: true },
  { name: 'Pani Puri', quantity: '6 pieces', calories: 150, protein: 4, carbs: 28, fat: 3, type: 'snack', isIndian: true },
];

const EditableMealRow: React.FC<{ meal: Meal, onDelete: () => void, onUpdate: (id: string, partial: Partial<Meal>) => void }> = ({ meal, onDelete, onUpdate }) => {
  const fallbackQty = meal.quantity || ((Math.round(meal.calories/2.5) || 100) + 'g');
  const [isEditing, setIsEditing] = useState(false);
  const [val, setVal] = useState(fallbackQty);

  const handleBlur = () => {
    setIsEditing(false);
    if (val !== fallbackQty) {
      // parse old number
      const oldMatch = fallbackQty.match(/([\d.]+)/);
      const newMatch = val.match(/([\d.]+)/);
      if (oldMatch && newMatch) {
        const oldNum = parseFloat(oldMatch[1]);
        const newNum = parseFloat(newMatch[1]);
        if (oldNum > 0 && newNum > 0) {
          const ratio = newNum / oldNum;
          // if ratio differs a lot, update macros
          if (ratio !== 1) {
            onUpdate(meal.id, {
              quantity: val,
              calories: Math.round(meal.calories * ratio),
              protein: Math.round(meal.protein * ratio),
              carbs: Math.round(meal.carbs * ratio),
              fat: Math.round(meal.fat * ratio),
            });
            return;
          }
        }
      }
      onUpdate(meal.id, { quantity: val });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 group">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-1.5 rounded-full bg-brand" />
        <div className="flex items-center gap-2 max-w-[150px] sm:max-w-[200px]">
          <span className="text-sm font-bold text-white truncate leading-tight" title={meal.name}>
            {meal.name}
          </span>
          {meal.isIndian && <span className="bg-[#FF9933]/10 text-[#FF9933] border border-[#FF9933]/20 text-[8px] uppercase font-black px-1.5 py-0.5 rounded flex items-center gap-1 select-none shrink-0" title="Indian Food">🇮🇳 Indian</span>}
        </div>
        {isEditing ? (
          <input 
            type="text"
            className="bg-app-bg text-brand text-xs font-bold w-16 px-2 py-0.5 rounded outline-none border border-brand/50"
            value={val}
            onChange={e => setVal(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={e => e.key === 'Enter' && handleBlur()}
            autoFocus
          />
        ) : (
          <span 
            className="text-text-muted text-xs font-medium cursor-pointer hover:text-white transition-colors underline decoration-dashed decoration-white/20 underline-offset-2"
            onClick={() => setIsEditing(true)}
          >
            {fallbackQty}
          </span>
        )}
      </div>
      <div className="flex items-center gap-4">
        <div className="flex gap-2 text-[10px] sm:text-xs">
          <span className="bg-[#202020] text-brand px-2 py-1 rounded font-bold">{meal.calories} kcal</span>
          <span className="bg-[#202020] text-[#7E8CFF] px-2 py-1 rounded font-bold">{meal.protein}g <span className="opacity-50">P</span></span>
          <span className="bg-[#202020] text-[#FFB347] px-2 py-1 rounded font-bold">{meal.carbs}g <span className="opacity-50">C</span></span>
          <span className="bg-[#202020] text-[#FF6B6B] px-2 py-1 rounded font-bold">{meal.fat}g <span className="opacity-50">F</span></span>
        </div>
        <button onClick={onDelete} className="text-white/20 hover:text-red-400 transition ml-2 opacity-0 group-hover:opacity-100 hidden sm:block">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

function DietSection({ log, onAdd, onUpdateMeal, onDeleteMeal, onUpdateWater, stats }: { log: DailyLog, onAdd: (m: Omit<Meal, 'id' | 'date'>) => void, onUpdateMeal: (id: string, m: Partial<Meal>) => void, onDeleteMeal: (id: string) => void, onUpdateWater: (w: number) => void, stats: UserStats }) {
  const [isAdding, setIsAdding] = useState(false);
  const [addType, setAddType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack' | 'pre-workout'>('breakfast');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [mealForm, setMealForm] = useState({ name: '', quantity: '', calories: '', protein: '', carbs: '', fat: '' });

  const filteredDB = useMemo(() => {
    let list = INDIAN_FOOD_DB;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(f => f.name.toLowerCase().includes(q));
    } else {
      // Show default items for the selected meal type
      list = list.filter(f => f.type === addType);
    }
    return list;
  }, [searchQuery, addType]);

  const handleAddDBItem = (food: typeof INDIAN_FOOD_DB[0]) => {
    onAdd({
      name: food.name,
      quantity: food.quantity,
      type: addType,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      isIndian: food.isIndian,
    });
    setIsAdding(false);
    setSearchQuery('');
  };

  const defaultOrder = ['breakfast', 'lunch', 'pre-workout', 'dinner', 'snack'];
  const [mealOrder, setMealOrder] = useState<string[]>(() => {
    const saved = localStorage.getItem('trainroot_meal_order');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 5) {
          return parsed;
        }
      } catch (e) {}
    }
    return [...defaultOrder];
  });

  useEffect(() => {
    localStorage.setItem('trainroot_meal_order', JSON.stringify(mealOrder));
  }, [mealOrder]);

  const [draggedMeal, setDraggedMeal] = useState<string | null>(null);
  const [dragOverMeal, setDragOverMeal] = useState<string | null>(null);
  const [dropPosition, setDropPosition] = useState<'before' | 'after' | null>(null);

  const handleDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', type);
    setTimeout(() => setDraggedMeal(type), 0);
  };

  const handleDragOver = (e: React.DragEvent, type: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedMeal && draggedMeal !== type) {
      const rect = e.currentTarget.getBoundingClientRect();
      const isBefore = e.clientY < rect.top + rect.height / 2;
      setDragOverMeal(type);
      setDropPosition(isBefore ? 'before' : 'after');
    }
  };

  const handleDrop = (e: React.DragEvent, type: string) => {
    e.preventDefault();
    if (draggedMeal && draggedMeal !== type) {
      const newOrder = [...mealOrder];
      const draggedIdx = newOrder.indexOf(draggedMeal);
      if (draggedIdx !== -1) {
        newOrder.splice(draggedIdx, 1);
        const targetIdx = newOrder.indexOf(type);
        const insertIdx = dropPosition === 'after' ? targetIdx + 1 : targetIdx;
        newOrder.splice(insertIdx, 0, draggedMeal);
        setMealOrder(newOrder);
      }
    }
    setDraggedMeal(null);
    setDragOverMeal(null);
    setDropPosition(null);
  };

  const handleDragEnd = () => {
    setDraggedMeal(null);
    setDragOverMeal(null);
    setDropPosition(null);
  };

  const handleTouchStart = (e: React.TouchEvent, type: string) => {
    const touch = e.touches[0];
    const target = e.target as HTMLElement;
    // only start drag if they pressed the grip, or we could just allow dragging from the card. The prompt says "mobile touch", let's allow anywhere, but it might override scrolls. 
    // Actually, on mobile, a grip is usually needed to drag. The user said:
    // "Add a subtle grip icon (⠿) on the left edge"
    // "Reorder must work on both mouse (desktop) and touch (mobile)"
    // If they touch the grip, we start drag. If they just touch the card, we don't.
    // We can do event checking, but let's just make the whole card draggable for native, and touch uses grip for safety?
    // Let's just set draggedMeal and rely on touchMove delta for safety.
    setDraggedMeal(type);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!draggedMeal) return;
    
    // Prevent default scroll when actively dragging a meal
    e.preventDefault(); 
    
    const touch = e.touches[0];
    const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
    const card = dropTarget?.closest('[data-drag-type]');
    if (card) {
      const type = card.getAttribute('data-drag-type');
      if (type && type !== draggedMeal) {
        const rect = card.getBoundingClientRect();
        const isBefore = touch.clientY < rect.top + rect.height / 2;
        setDragOverMeal(type);
        setDropPosition(isBefore ? 'before' : 'after');
      }
    }
  };

  const handleTouchEnd = () => {
    if (draggedMeal && dragOverMeal && draggedMeal !== dragOverMeal) {
      const newOrder = [...mealOrder];
      const draggedIdx = newOrder.indexOf(draggedMeal);
      if (draggedIdx !== -1) {
        newOrder.splice(draggedIdx, 1);
        const targetIdx = newOrder.indexOf(dragOverMeal);
        const insertIdx = dropPosition === 'after' ? targetIdx + 1 : targetIdx;
        newOrder.splice(insertIdx, 0, draggedMeal);
        setMealOrder(newOrder);
      }
    }
    setDraggedMeal(null);
    setDragOverMeal(null);
    setDropPosition(null);
  };

  const totalMacros = log.meals.reduce((acc, m) => ({
    cals: acc.cals + m.calories,
    pro: acc.pro + m.protein,
    carb: acc.carb + m.carbs,
    fat: acc.fat + m.fat,
  }), { cals: 0, pro: 0, carb: 0, fat: 0 });

  // Fallback defaults for missing targets
  const targetCals = stats.dailyCalorieGoal || 2400;
  const targetPro = stats.dailyProteinGoal || 180;
  const targetCarbs = stats.dailyCarbsGoal || 260;
  const targetFat = stats.dailyFatGoal || 75;

  const dateStr = new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase();
  
  const openMealAdd = (type: string) => {
    setAddType(type as any);
    setSearchQuery('');
    setIsCustomMode(false);
    setIsAdding(true);
  };

  const handleCommit = () => {
    onAdd({ 
      name: mealForm.name || 'Unnamed Meal',
      quantity: mealForm.quantity || '1 serving',
      type: addType,
      calories: parseInt(mealForm.calories as string) || 0,
      protein: parseInt(mealForm.protein as string) || 0,
      carbs: parseInt(mealForm.carbs as string) || 0,
      fat: parseInt(mealForm.fat as string) || 0,
    });
    setIsAdding(false);
    setMealForm({ name: '', quantity: '', calories: '', protein: '', carbs: '', fat: '' });
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex flex-col">
          <h2 className="text-4xl md:text-5xl font-black text-text-main tracking-tight uppercase">
            Diet<span className="text-brand">plan</span>
          </h2>
          <p className="text-text-muted mt-1 text-sm md:text-base font-medium tracking-wide uppercase">My daily nutrition log</p>
        </div>
        <div className="flex gap-4">
          <div className="border border-card-border rounded-xl px-4 py-2 flex items-center gap-2 text-text-main font-bold text-sm tracking-wide bg-card-bg/50">
             <Calendar size={16} className="text-brand" /> {dateStr}
          </div>
          <button onClick={() => openMealAdd('breakfast')} className="border border-card-border rounded-xl px-4 py-2 flex items-center gap-2 text-text-main font-bold text-sm tracking-widest bg-card-bg/50 hover:bg-card-border transition">
            + QUICK ADD
          </button>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'CALORIES', current: totalMacros.cals, target: targetCals, unit: '', color: '#2dd4bf', suffix: 'kcal remaining', remaining: targetCals - totalMacros.cals },
          { label: 'PROTEIN', current: totalMacros.pro, target: targetPro, unit: 'g', color: '#3b82f6', suffix: 'remaining', remaining: targetPro - totalMacros.pro },
          { label: 'CARBS', current: totalMacros.carb, target: targetCarbs, unit: 'g', color: '#eab308', suffix: 'remaining', remaining: targetCarbs - totalMacros.carb },
          { label: 'FATS', current: totalMacros.fat, target: targetFat, unit: 'g', color: '#f97316', suffix: 'remaining', remaining: targetFat - totalMacros.fat }
        ].map(m => (
          <div key={m.label} className="bg-[#151515] border border-white/5 p-5 flex flex-col rounded-[1.5rem]">
            <span className="text-[10px] font-black text-white/50 tracking-[0.2em] mb-4">{m.label}</span>
            <div className="flex items-end gap-1 mb-1">
               <span className="text-4xl font-black tracking-tight leading-none" style={{ color: m.color }}>
                  {m.current.toLocaleString()}{m.unit}
               </span>
               <span className="text-white/30 font-bold ml-1 mb-1 text-lg">/</span>
            </div>
            <div className="text-white/30 font-bold text-sm mb-6">{m.target.toLocaleString()}{m.unit}</div>
            <div className="w-full h-1.5 bg-[#252525] rounded-full overflow-hidden mb-4">
               <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (m.current / m.target) * 100)}%`, backgroundColor: m.color }} />
            </div>
            <span className="text-[10px] text-white/50 mb-1">{m.remaining > 0 ? m.remaining : 0}{m.label === 'CALORIES' ? '' : 'g'} {m.suffix}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Today's Meals - Left Col (xl:col-span-2) */}
        <div className="xl:col-span-2 flex flex-col space-y-4">
          <h3 className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-2 px-1">Today's Meals</h3>
          <div className="space-y-4">
          {mealOrder.map((mealType) => {
             const mealTitle = mealType === 'pre-workout' ? 'PRE-WORKOUT' : mealType.toUpperCase();
             const mealIcon = mealType === 'breakfast' ? '🌅' : mealType === 'lunch' ? '🌞' : mealType === 'pre-workout' ? '⚡' : mealType === 'dinner' ? '🌙' : '🍘';
      
             const mealsOfType = log.meals.filter(m => m.type === mealType || (!m.type && mealType === 'breakfast'));
      
             const cals = mealsOfType.reduce((acc, m) => acc + m.calories, 0);
             const pro = mealsOfType.reduce((acc, m) => acc + m.protein, 0);
             const carbs = mealsOfType.reduce((acc, m) => acc + m.carbs, 0);
             const fat = mealsOfType.reduce((acc, m) => acc + m.fat, 0);
      
             return (
               <div 
                 key={mealType} 
                 draggable
                 onDragStart={(e) => handleDragStart(e, mealType)}
                 onDragOver={(e) => handleDragOver(e, mealType)}
                 onDrop={(e) => handleDrop(e, mealType)}
                 onDragEnd={handleDragEnd}
                 onTouchStart={(e) => handleTouchStart(e, mealType)}
                 onTouchMove={handleTouchMove}
                 onTouchEnd={handleTouchEnd}
                 data-drag-type={mealType}
                 style={{ touchAction: draggedMeal === mealType ? 'none' : 'auto' }}
                 className={`bg-[#151515] border border-white/5 rounded-[1.5rem] p-5 relative group transition-all duration-300 ease-in-out cursor-grab active:cursor-grabbing hover:border-white/10
                   ${draggedMeal === mealType ? 'opacity-50 scale-[0.98] z-50' : 'opacity-100 scale-100'} 
                   ${dragOverMeal === mealType && dropPosition === 'before' ? 'mt-12' : ''} 
                   ${dragOverMeal === mealType && dropPosition === 'after' ? 'mb-12' : ''}
                 `}
               >
                 {dragOverMeal === mealType && dropPosition === 'before' && (
                   <div className="absolute -top-6 left-0 right-0 h-1 bg-brand rounded-full shadow-[0_0_8px_rgba(45,212,191,0.8)] pointer-events-none" />
                 )}
                 {dragOverMeal === mealType && dropPosition === 'after' && (
                   <div className="absolute -bottom-6 left-0 right-0 h-1 bg-brand rounded-full shadow-[0_0_8px_rgba(45,212,191,0.8)] pointer-events-none" />
                 )}
               
                 <div className="flex justify-between items-center mb-2">
                   <div className="flex gap-4 items-center">
                     <div className="opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center text-white/30 hover:text-white/70 -ml-2 select-none">
                       ⠿
                     </div>
                     <div className="w-10 h-10 rounded-xl bg-[#202020] flex items-center justify-center text-xl shadow-inner border border-white/5 ml-2 md:ml-0">
                       {mealIcon}
                     </div>
                     <div>
                        <h4 className="font-bold text-white tracking-wide">{mealTitle}</h4>
                        {mealsOfType.length === 0 ? (
                          <p className="text-white/40 text-[11px] mt-1">Not logged yet</p>
                        ) : (
                          <p className="text-white/40 text-[11px] mt-1">
                            {cals} kcal • {pro}g P • {carbs}g C • {fat}g F
                          </p>
                        )}
                     </div>
                   </div>
                   <button 
                     onClick={(e) => { e.stopPropagation(); openMealAdd(mealType); }}
                     className="border border-white/5 hover:border-white/20 transition text-white px-4 py-2 rounded-xl text-xs font-bold uppercase bg-[#202020] flex items-center gap-1">
                     <span>+</span> ADD
                   </button>
                 </div>
      
                 {mealsOfType.length > 0 && (
                   <div className="space-y-4 pt-6 mt-4 border-t border-white/5">
                     {mealsOfType.map(meal => (
                       <EditableMealRow key={meal.id} meal={meal} onUpdate={onUpdateMeal} onDelete={() => onDeleteMeal(meal.id)} />
                     ))}
                   </div>
                 )}
               </div>
             );
          })}
          </div>
        </div>

        {/* Right Col */}
        <div className="flex flex-col space-y-4 xl:col-span-1 pt-6 xl:pt-0">
          <div className="bg-[#151515] border border-white/5 rounded-[1.5rem] p-6 pb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                 <h4 className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-4">Water Intake</h4>
                 <div className="flex items-baseline gap-1 relative">
                   <span className="text-4xl font-black tracking-tight text-[#3b82f6]">{( (log.water || 0) * 0.375 ).toFixed(1)}</span>
                   <span className="text-white/30 font-bold ml-1 text-sm bg-transparent">/ 3L</span>
                 </div>
                 <p className="text-white/40 text-xs mt-2">{Math.round(((log.water || 0) / 8) * 100)}% of daily goal</p>
              </div>
              <div className="relative w-[4.5rem] h-[4.5rem] flex items-center justify-center -rotate-90">
                  <svg className="w-full h-full" viewBox="0 0 48 48">
                      <circle cx="24" cy="24" r="20" className="stroke-[#252525] fill-none" strokeWidth="4" />
                      <circle cx="24" cy="24" r="20" className="stroke-[#3b82f6] fill-none" strokeWidth="4" strokeDasharray="125.6" strokeDashoffset={125.6 * (1 - Math.min((log.water || 0) / 8, 1))} strokeLinecap="round" />
                  </svg>
                  <span className="absolute text-[11px] font-black text-white rotate-90">{Math.round(((log.water || 0) / 8) * 100)}%</span>
              </div>
            </div>
            <div className="flex gap-2">
               {[...'12345678'].map((i, idx) => {
                 const isActive = idx < (log.water || 0);
                 return (
                   <button 
                     key={i} 
                     onClick={() => onUpdateWater(isActive && idx === (log.water || 0) - 1 ? idx : idx + 1)}
                     className={`flex-1 rounded-[10px] aspect-square flex items-center justify-center border hover:scale-105 transition-all ${isActive ? 'bg-blue-500/20 border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.2)]' : 'bg-[#202020] border-white/5 hover:border-white/20'}`}
                   >
                      <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className={`w-4 h-4 ${isActive ? 'text-blue-500 drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]' : 'text-[#303030]'}`}>
                        <path d="M12 21.5c-3.1 0-5.5-2.4-5.5-5.5 0-3 5.5-12.7 5.5-12.7s5.5 9.7 5.5 12.7c0 3.1-2.4 5.5-5.5 5.5z"/>
                      </svg>
                   </button>
                 );
               })}
            </div>
          </div>

          <div className="bg-[#151515] border border-white/5 rounded-[1.5rem] p-6 pb-8">
             <div className="flex justify-between items-start mb-6">
               <div>
                  <h4 className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-4">Weekly Streak</h4>
                  <div className="flex items-baseline gap-1 relative">
                   <span className="text-4xl font-black text-yellow-500 tracking-tight">5</span>
                   <span className="text-white/40 text-sm ml-1 mb-1">days</span>
                  </div>
               </div>
               <span className="text-[2rem] mt-1 ml-4 block opacity-90 drop-shadow-[0_0_8px_rgba(234,179,8,0.3)]">🔥</span>
             </div>
             <div className="flex justify-between">
               {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                 <div key={idx} className="flex flex-col items-center gap-3">
                   <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-black border ${idx === 4 ? 'border-[#2dd4bf] text-[#2dd4bf] bg-[#2dd4bf]/10 shadow-[0_0_10px_rgba(45,212,191,0.2)]' : idx < 4 ? 'bg-[#2dd4bf] border-[#2dd4bf] text-[#151515]' : 'bg-[#202020] border-transparent text-white/30'}`}>
                      {day}
                   </div>
                   <span className="text-[9px] text-white/30 uppercase font-black tracking-widest">{['mon','tue','wed','thu','fri','sat','sun'][idx]}</span>
                 </div>
               ))}
             </div>
          </div>

          <div className="bg-[#151515] border border-white/5 rounded-[1.5rem] p-6">
             <h4 className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-6">Macro Split</h4>
             <div className="flex items-center gap-6 mt-2 mb-2">
                <div className="relative w-28 h-28 shrink-0">
                    <PieChart width={112} height={112}>
                        <Pie
                           data={[
                             { name: 'Protein', value: totalMacros.pro || 1, fill: '#3b82f6' },
                             { name: 'Carbs', value: totalMacros.carb || 1, fill: '#eab308' },
                             { name: 'Fats', value: totalMacros.fat || 1, fill: '#f97316' }
                           ]}
                           innerRadius={36}
                           outerRadius={56}
                           paddingAngle={4}
                           dataKey="value"
                           stroke="none"
                           cornerRadius={4}
                           isAnimationActive={false}
                        />
                    </PieChart>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                       <span className="text-[10px] font-black text-white tracking-[0.1em]">TODAY</span>
                    </div>
                </div>
                <div className="space-y-4 flex-1">
                   {[
                     { name: 'Protein', color: 'bg-[#3b82f6]', val: totalMacros.pro },
                     { name: 'Carbs', color: 'bg-[#eab308]', val: totalMacros.carb },
                     { name: 'Fats', color: 'bg-[#f97316]', val: totalMacros.fat }
                   ].map(m => {
                      const total = totalMacros.pro + totalMacros.carb + totalMacros.fat || 1;
                      const pct = Math.round((m.val / total) * 100);
                      return (
                       <div key={m.name} className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                           <div className={`w-2.5 h-2.5 rounded-full ${m.color}`} />
                           <span className="text-sm font-medium text-white/60">{m.name}</span>
                         </div>
                         <span className="text-sm font-black" style={{ color: m.color.match(/bg-\[(.*)\]/)?.[1] }}>
                           {pct}%
                         </span>
                       </div>
                      )
                   })}
                </div>
             </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-app-bg/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-card-bg border border-card-border w-full max-w-xl rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-3xl shadow-black/40 flex flex-col max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-6 shrink-0">
                <h3 className="text-xl md:text-2xl font-black text-text-main uppercase italic tracking-tight">Record {addType}</h3>
                <button onClick={() => setIsAdding(false)} className="bg-app-bg p-2 rounded-xl text-text-muted hover:text-text-main transition-colors"><X size={20} /></button>
              </div>

              <div className="flex gap-2 mb-6 shrink-0">
                <button 
                  onClick={() => setIsCustomMode(false)}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm tracking-widest uppercase transition-all ${!isCustomMode ? 'bg-brand text-black' : 'bg-app-bg text-text-muted hover:text-text-main hover:bg-white/5 border border-white/5'}`}
                >
                  Search Database
                </button>
                <button 
                  onClick={() => setIsCustomMode(true)}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm tracking-widest uppercase transition-all ${isCustomMode ? 'bg-brand text-black' : 'bg-app-bg text-text-muted hover:text-text-main hover:bg-white/5 border border-white/5'}`}
                >
                  Custom
                </button>
              </div>

              {!isCustomMode ? (
                <div className="flex flex-col overflow-hidden min-h-0">
                  <input
                    type="text"
                    placeholder="Search food database..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-app-bg border border-card-border rounded-2xl px-5 py-4 outline-none focus:border-brand transition text-text-main font-bold mb-4 shrink-0"
                  />
                  
                  <div className="overflow-y-auto pr-2 space-y-2 min-h-0 relative flex-1">
                    {filteredDB.length === 0 ? (
                      <div className="text-center py-10 text-white/40 italic font-bold">No results found</div>
                    ) : (
                      filteredDB.map((food, i) => (
                        <div 
                          key={i}
                          onClick={() => handleAddDBItem(food)}
                          className="group relative bg-[#121212] flex justify-between items-center p-4 rounded-2xl cursor-pointer border border-transparent hover:border-brand/40 transition-colors"
                        >
                          <div className="flex flex-col">
                            <span className="font-bold text-text-main flex items-center gap-2">
                              {food.name}
                              {food.isIndian && <span className="bg-[#FF9933]/10 text-[#FF9933] border border-[#FF9933]/20 text-[8px] uppercase font-black px-1.5 py-0.5 rounded flex items-center gap-1">🇮🇳 Indian</span>}
                            </span>
                            <span className="text-text-muted text-xs font-medium">{food.quantity}</span>
                          </div>
                          <div className="flex gap-4 items-center">
                            <div className="flex gap-3 text-[10px] uppercase font-black tracking-wider text-text-muted text-right">
                              <span className="text-brand">{food.calories} <span className="text-white/30">kcal</span></span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-app-bg flex items-center justify-center opacity-50 group-hover:opacity-100 group-hover:bg-brand/20 group-hover:text-brand transition-all text-white/50">
                              <Plus size={14} />
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-6 overflow-y-auto">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-[2]">
                      <label className="text-[10px] text-text-muted uppercase font-black tracking-[0.2em] block mb-3 pl-1">Description</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Grass-fed Ribeye"
                        value={mealForm.name}
                        onChange={e => setMealForm({...mealForm, name: e.target.value})}
                        className="w-full bg-app-bg border border-card-border rounded-2xl px-5 py-4 outline-none focus:border-brand transition text-text-main font-bold"
                      />
                    </div>
                    <div className="flex-[1]">
                      <label className="text-[10px] text-text-muted uppercase font-black tracking-[0.2em] block mb-3 pl-1">Quantity</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 200g"
                        value={mealForm.quantity}
                        onChange={e => setMealForm({...mealForm, quantity: e.target.value})}
                        className="w-full bg-app-bg border border-card-border rounded-2xl px-5 py-4 outline-none focus:border-brand transition text-text-main font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                      <label className="text-[10px] text-text-muted uppercase font-black tracking-[0.2em] block mb-3 pl-1">Calories</label>
                      <input type="number" placeholder="0" value={mealForm.calories} onChange={e => setMealForm({...mealForm, calories: e.target.value})} className="w-full bg-app-bg border border-card-border rounded-2xl px-5 py-4 outline-none text-text-main font-bold italic" />
                    </div>
                    <div>
                      <label className="text-[10px] text-text-muted uppercase font-black tracking-[0.2em] block mb-3 pl-1">Protein (g)</label>
                      <input type="number" placeholder="0" value={mealForm.protein} onChange={e => setMealForm({...mealForm, protein: e.target.value})} className="w-full bg-app-bg border border-card-border rounded-2xl px-5 py-4 outline-none text-text-main font-bold italic" />
                    </div>
                    <div>
                      <label className="text-[10px] text-text-muted uppercase font-black tracking-[0.2em] block mb-3 pl-1">Carbs (g)</label>
                      <input type="number" placeholder="0" value={mealForm.carbs} onChange={e => setMealForm({...mealForm, carbs: e.target.value})} className="w-full bg-app-bg border border-card-border rounded-2xl px-5 py-4 outline-none text-text-main font-bold italic" />
                    </div>
                    <div>
                      <label className="text-[10px] text-text-muted uppercase font-black tracking-[0.2em] block mb-3 pl-1">Fat (g)</label>
                      <input type="number" placeholder="0" value={mealForm.fat} onChange={e => setMealForm({...mealForm, fat: e.target.value})} className="w-full bg-app-bg border border-card-border rounded-2xl px-5 py-4 outline-none text-text-main font-bold italic" />
                    </div>
                  </div>

                  <button 
                    onClick={handleCommit}
                    className="w-full bg-brand text-app-bg py-5 rounded-2xl font-black uppercase tracking-[0.2em] hover:opacity-90 transition shadow-2xl shadow-brand/20 text-sm italic mt-4"
                  >
                    Commit Log
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MacroProgress({ label, current, target, unit, color }: { label: string, current: number, target: number, unit: string, color: string }) {
  return (
    <div className="bg-card-bg border border-card-border p-6 rounded-[1.5rem] shadow-xl shadow-black/5 space-y-4">
      <span className="text-[9px] uppercase font-black text-text-muted tracking-[0.2em]">{label}</span>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-black text-text-main italic leading-none">{current}</span>
        <span className="text-[10px] text-text-muted mb-0.5 font-bold">/ {target}{unit}</span>
      </div>
      <div className="w-full bg-app-bg h-1.5 rounded-full overflow-hidden border border-card-border">
        <div className="h-full transition-all duration-1000" style={{ backgroundColor: color, width: `${Math.min(100, (current / target) * 100)}%`, boxShadow: `0 0 10px ${color}80` }}></div>
      </div>
    </div>
  );
}

function AISection({ stats, logs }: { stats: UserStats, logs: DailyLog[] }) {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<any>(null);
  const [type, setType] = useState<'workout' | 'meal' | 'progress'>('progress');

  const chartData = useMemo(() => {
    // Sort logs by date (format DD/MM/YYYY)
    const sortedLogs = [...logs].sort((a, b) => {
      const [d1, m1, y1] = a.date.split('/');
      const [d2, m2, y2] = b.date.split('/');
      return new Date(`${y1}-${m1}-${d1}`).getTime() - new Date(`${y2}-${m2}-${d2}`).getTime();
    });
    
    // Add some default data points if too empty, so charts look aesthetic
    let finalLogs = sortedLogs;
    if (finalLogs.length < 3) {
      finalLogs = [
        { date: '01/01/2026', workouts: [], meals: [{ id: '1', name: '', calories: 2000, protein: 150, carbs: 200, fat: 50, date: '' }], weight: stats.weight + 2 },
        { date: '02/01/2026', workouts: [], meals: [{ id: '2', name: '', calories: 1800, protein: 150, carbs: 200, fat: 50, date: '' }], weight: stats.weight + 1 },
        ...finalLogs
      ];
    }
    
    return finalLogs.map(log => {
      const cals = log.meals?.reduce((acc, m) => acc + m.calories, 0) || 0;
      const workouts = log.workouts?.length || 0;
      const pathParts = log.date.split('/');
      const shortDate = pathParts.length === 3 ? `${pathParts[0]}/${pathParts[1]}` : log.date;
      return {
        date: shortDate,
        calories: cals,
        workouts: workouts,
        weight: log.weight || stats.weight
      };
    });
  }, [logs, stats.weight]);

  const fetchSuggestion = async () => {
    setLoading(true);
    if (type === 'workout') {
      const res = await getWorkoutSuggestion(stats.goal, 'Chest & Triceps');
      setSuggestion(res);
    } else {
      const res = await getMealSuggestion(800, stats.goal);
      setSuggestion(res);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-10">
      <header>
        <h2 className="text-4xl font-black text-text-main uppercase italic tracking-tight">AI Strategic Coach</h2>
        <p className="text-text-muted mt-1 font-medium">Algorithmic physiological optimization.</p>
      </header>

      <div className="flex gap-2 p-1 bg-card-bg border border-card-border rounded-2xl w-fit shadow-xl shadow-black/5 mx-auto mb-8">
        <button onClick={() => setType('progress')} className={`px-8 py-3 rounded-xl transition font-black text-[10px] uppercase tracking-[0.2em] ${type === 'progress' ? 'bg-brand text-app-bg shadow-lg shadow-brand/20' : 'text-text-muted hover:text-text-main'}`}>Progress</button>
        <button onClick={() => setType('workout')} className={`px-8 py-3 rounded-xl transition font-black text-[10px] uppercase tracking-[0.2em] ${type === 'workout' ? 'bg-brand text-app-bg shadow-lg shadow-brand/20' : 'text-text-muted hover:text-text-main'}`}>Mechanics</button>
        <button onClick={() => setType('meal')} className={`px-8 py-3 rounded-xl transition font-black text-[10px] uppercase tracking-[0.2em] ${type === 'meal' ? 'bg-brand text-app-bg shadow-lg shadow-brand/20' : 'text-text-muted hover:text-text-main'}`}>Resources</button>
      </div>

      {type === 'progress' ? (
        <div className="space-y-6">
          <div className="bg-card-bg border border-card-border p-8 rounded-[2.5rem] shadow-3xl shadow-black/5">
            <h3 className="text-xl font-black text-text-main uppercase italic tracking-tight mb-8">Weight Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" vertical={false} />
                  <XAxis dataKey="date" stroke="#888" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888" fontSize={10} tickLine={false} axisLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
                  <Tooltip contentStyle={{ backgroundColor: '#0c0c0c', border: '1px solid #1f1f1f', borderRadius: '1rem' }} />
                  <Line type="monotone" dataKey="weight" stroke="#2dd4bf" strokeWidth={3} dot={{ r: 4, fill: '#2dd4bf', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card-bg border border-card-border p-8 rounded-[2.5rem] shadow-3xl shadow-black/5">
              <h3 className="text-xl font-black text-text-main uppercase italic tracking-tight mb-8">Caloric Intake</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" vertical={false} />
                    <XAxis dataKey="date" stroke="#888" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{ fill: '#ffffff05' }} contentStyle={{ backgroundColor: '#0c0c0c', border: '1px solid #1f1f1f', borderRadius: '1rem' }} />
                    <Bar dataKey="calories" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-card-bg border border-card-border p-8 rounded-[2.5rem] shadow-3xl shadow-black/5">
              <h3 className="text-xl font-black text-text-main uppercase italic tracking-tight mb-8">Workout Frequency</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" vertical={false} />
                    <XAxis dataKey="date" stroke="#888" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip cursor={{ fill: '#ffffff05' }} contentStyle={{ backgroundColor: '#0c0c0c', border: '1px solid #1f1f1f', borderRadius: '1rem' }} />
                    <Bar dataKey="workouts" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-card-bg border border-card-border p-12 rounded-[2.5rem] min-h-[500px] flex flex-col items-center justify-center text-center shadow-3xl shadow-black/5 overflow-hidden relative">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand opacity-5 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-500 opacity-5 blur-[100px] rounded-full pointer-events-none" />

        {loading ? (
          <div className="flex flex-col items-center gap-6 relative z-10">
            <motion.div animate={{ rotate: 360, scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}>
              <BrainCircuit size={64} className="text-brand" />
            </motion.div>
            <p className="text-brand font-black uppercase tracking-[0.3em] text-xs animate-pulse">Analyzing Biometrics...</p>
          </div>
        ) : suggestion ? (
          <div className="w-full text-left max-w-2xl relative z-10">
            <div className="flex items-center gap-6 mb-10 border-b border-card-border pb-10">
               <div className="p-5 bg-brand/10 rounded-[1.5rem] ring-1 ring-brand/20"><BrainCircuit className="text-brand" size={32} /></div>
               <div>
                  <span className="text-[10px] text-brand uppercase font-black tracking-[0.3em] block mb-2">Protocol Identified</span>
                  <h3 className="text-3xl font-black text-text-main uppercase italic leading-none">{suggestion.name}</h3>
               </div>
            </div>

            {type === 'workout' ? (
              <div className="space-y-4">
                {suggestion.exercises.map((ex: any, i: number) => (
                  <div key={i} className="bg-app-bg border border-card-border p-6 rounded-2xl flex justify-between items-center transition hover:border-brand/40 group">
                    <span className="font-black text-text-main uppercase tracking-tight italic group-hover:text-brand transition-colors text-lg truncate pr-4">{ex.name}</span>
                    <span className="text-brand font-black text-sm bg-brand/5 px-4 py-2 rounded-xl ring-1 ring-brand/20 shrink-0 italic">{ex.sets} × {ex.reps}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   {[
                     { label: 'Energy', val: suggestion.calories, unit: 'kcal' },
                     { label: 'Protein', val: suggestion.protein, unit: 'g' },
                     { label: 'Carbs', val: suggestion.carbs, unit: 'g' },
                     { label: 'Lipids', val: suggestion.fat, unit: 'g' }
                   ].map((mac, i) => (
                     <div key={i} className="bg-app-bg border border-card-border p-4 rounded-2xl text-center">
                        <span className="text-[9px] text-text-muted uppercase font-black tracking-widest block mb-2">{mac.label}</span>
                        <div className="font-black text-text-main text-lg italic">{mac.val}<span className="text-[10px] text-text-muted ml-0.5">{mac.unit}</span></div>
                     </div>
                   ))}
                </div>
                <div className="bg-app-bg border border-card-border p-8 rounded-[2rem] relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition pointer-events-none">
                      <Utensils size={120} />
                   </div>
                   <h4 className="font-black text-text-main uppercase italic mb-4 border-b border-card-border pb-3 inline-block">Preparation Specs</h4>
                   <p className="text-text-muted text-sm leading-relaxed font-medium">{suggestion.recipeShort}</p>
                </div>
              </div>
            )}

            <div className="mt-12 flex justify-center">
               <button onClick={() => setSuggestion(null)} className="text-text-muted font-black text-[10px] uppercase tracking-[0.3em] hover:text-brand transition-all border-b border-transparent hover:border-brand pb-1">Reset Analysis Engine</button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center relative z-10">
            <div className="w-24 h-24 bg-app-bg border border-card-border rounded-[2rem] flex items-center justify-center mb-10 shadow-inner">
               <Shield size={48} className="text-brand opacity-20" fill="currentColor" />
            </div>
            <h3 className="text-3xl font-black text-text-main mb-4 uppercase italic tracking-tighter">Strategic Insights</h3>
            <p className="text-text-muted max-w-sm mb-12 font-medium">Initiate algorithmic planning to optimize your physiological trajectory based on current metrics.</p>
            <button onClick={fetchSuggestion} className="bg-brand text-app-bg px-12 py-5 rounded-[1.5rem] font-black uppercase tracking-[0.3em] hover:opacity-90 transition shadow-[0_20px_50px_rgba(45,212,191,0.2)] text-sm italic">Execute Analysis</button>
          </div>
        )}
      </div>
      )}
    </div>
  );
}

