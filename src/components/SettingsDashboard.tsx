import React, { useState, useRef } from 'react';
import { ChevronDown, Check, Camera, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { UserStats } from '../types';

interface SettingsDashboardProps {
  stats: UserStats;
  onSave?: (stats: UserStats) => void;
  onLogout: () => void;
}

const SettingsDashboard: React.FC<SettingsDashboardProps> = ({ stats, onSave }) => {
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [localStats, setLocalStats] = useState<UserStats>(stats);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const handleEdit = () => setIsEditing(true);
    window.addEventListener('switch-to-settings', handleEdit);
    return () => window.removeEventListener('switch-to-settings', handleEdit);
  }, []);

  React.useEffect(() => {
    setLocalStats(stats);
  }, [stats]);

  const formatGoal = (goal: string) => {
    switch(goal) {
      case 'gain_muscle': return 'Hypertrophy & Muscle Gain';
      case 'lose_weight': return 'Weight Loss & Definition';
      case 'maintain': return 'Operational Maintenance';
      default: return goal || 'Select a Goal';
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave(localStats);
    }
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsEditing(false);
    }, 1000);
  };

  const handlePhotoClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsUploading(true);
        // Simple local preview for photo
        const reader = new FileReader();
        reader.onloadend = () => {
          setLocalStats({ ...localStats, photoUrl: reader.result as string });
          setIsUploading(false);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error handling photo:', error);
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto pt-4 md:pt-10 pb-20">
      <header className="mb-6">
        <h2 className="text-2xl md:text-3xl font-semibold text-white">Profile Setup</h2>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#1c1c1e] rounded-2xl p-6 md:p-8 shadow-2xl"
      >
        <div className="flex items-center gap-5 mb-10">
          <div className={`relative group ${isEditing && !isUploading ? 'cursor-pointer' : ''}`} onClick={handlePhotoClick}>
            <div className={`w-16 h-16 rounded-xl overflow-hidden shrink-0 shadow-md transition-opacity ${isEditing && !isUploading ? 'group-hover:opacity-70' : ''} bg-[#2c2c2e] flex items-center justify-center`}>
              {isUploading ? (
                <Loader2 className="animate-spin text-brand" size={24} />
              ) : (
                <img 
                  src={localStats.photoUrl || "https://picsum.photos/seed/fitness/256/256"} 
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              )}
            </div>
            {isEditing && !isUploading && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <Camera size={24} className="text-white drop-shadow-md" />
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handlePhotoChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
          <div>
            <h3 className="text-[17px] font-medium text-white mb-1">
              {isEditing ? 'Personal Information' : localStats.name || 'Your Name'}
            </h3>
            <p className="text-[13px] text-[#8e8e93]">
              {isEditing ? 'Update your physical metrics for better tracking' : formatGoal(localStats.goal)}
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-[#8e8e93] uppercase tracking-wide">Full Name</label>
            {isEditing ? (
              <input 
                type="text" 
                value={localStats.name}
                onChange={(e) => setLocalStats({ ...localStats, name: e.target.value })}
                className="w-full bg-[#2c2c2e] border border-transparent rounded-[10px] py-3.5 px-4 text-[14px] text-white outline-none focus:border-brand/40 transition-colors"
                autoFocus
              />
            ) : (
              <div className="w-full text-[#e5e5ea] text-[14px] py-1 border border-transparent font-medium">{localStats.name}</div>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-[#8e8e93] uppercase tracking-wide">Account Identity</label>
            <div className="w-full bg-white/[0.02] border border-white/5 rounded-[10px] py-3.5 px-4 text-[14px] text-text-muted/60 font-medium italic">
              {localStats.email || 'Not connected'}
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-[#8e8e93] uppercase tracking-wide">Age</label>
            {isEditing ? (
              <input 
                type="number" 
                value={localStats.age}
                onChange={(e) => setLocalStats({ ...localStats, age: parseInt(e.target.value) || 0 })}
                className="w-full bg-[#2c2c2e] border border-transparent rounded-[10px] py-3.5 px-4 text-[14px] text-[#e5e5ea] outline-none focus:border-brand/40 transition-colors"
              />
            ) : (
              <div className="w-full text-[#e5e5ea] text-[14px] py-1 border border-transparent font-medium">{localStats.age} yrs</div>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-[#8e8e93] uppercase tracking-wide">Weight (KG)</label>
            {isEditing ? (
              <input 
                type="number" 
                value={localStats.weight}
                onChange={(e) => setLocalStats({ ...localStats, weight: parseInt(e.target.value) || 0 })}
                className="w-full bg-[#2c2c2e] border border-transparent rounded-[10px] py-3.5 px-4 text-[14px] text-[#e5e5ea] outline-none focus:border-brand/40 transition-colors"
              />
            ) : (
              <div className="w-full text-[#e5e5ea] text-[14px] py-1 border border-transparent font-medium">{localStats.weight} kg</div>
            )}
          </div>
          
          <div className="col-span-1 md:col-span-2 space-y-2">
            <label className="text-[11px] font-bold text-[#8e8e93] uppercase tracking-wide">Fitness Goal</label>
            {isEditing ? (
              <div className="relative">
                <select 
                  value={localStats.goal}
                  onChange={(e) => setLocalStats({ ...localStats, goal: e.target.value as any })}
                  className="w-full bg-[#2c2c2e] border border-transparent rounded-[10px] py-3.5 px-4 text-[14px] text-[#e5e5ea] outline-none focus:border-brand/40 transition-colors appearance-none cursor-pointer"
                >
                  <option value="gain_muscle">Hypertrophy & Muscle Gain</option>
                  <option value="lose_weight">Weight Loss & Definition</option>
                  <option value="maintain">Operational Maintenance</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8e8e93] pointer-events-none" size={16} />
              </div>
            ) : (
              <div className="w-full text-[#e5e5ea] text-[14px] py-1 border border-transparent font-medium">{formatGoal(localStats.goal)}</div>
            )}
          </div>
          
          <div className="col-span-1 md:col-span-2 pt-3 flex justify-end gap-3">
            {!isEditing ? (
              <button 
                type="button"
                onClick={(e) => { e.preventDefault(); setIsEditing(true); }}
                className="bg-[#2c2c2e] text-white px-6 py-3 rounded-lg font-bold text-[13px] hover:bg-[#3a3a3c] active:scale-95 transition-all flex items-center justify-center min-w-[140px]"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button 
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-[#8e8e93] hover:text-white px-4 py-3 rounded-lg font-bold text-[13px] active:scale-95 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-brand text-[#111] px-6 py-3 rounded-lg font-bold text-[13px] hover:bg-brand/90 active:scale-95 transition-all flex items-center justify-center min-w-[140px]"
                >
                  {saveSuccess ? (
                    <span className="flex items-center gap-2">
                      <Check size={16} />
                      Saved
                    </span>
                  ) : (
                    'Save Profile'
                  )}
                </button>
              </>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default SettingsDashboard;
