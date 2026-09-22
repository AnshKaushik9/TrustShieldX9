import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { ShieldCheck, Activity, Settings, ExternalLink } from "lucide-react";
import "../style.css";

function Popup() {
  const [autoScan, setAutoScan] = useState(true);
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    chrome.storage.sync.get(["autoScan", "notifications"], (result) => {
      if (typeof result.autoScan === 'boolean') setAutoScan(result.autoScan);
      if (typeof result.notifications === 'boolean') setNotifications(result.notifications);
    });
  }, []);

  const toggleAutoScan = () => {
    const newVal = !autoScan;
    setAutoScan(newVal);
    chrome.storage.sync.set({ autoScan: newVal });
  };

  const toggleNotifications = () => {
    const newVal = !notifications;
    setNotifications(newVal);
    chrome.storage.sync.set({ notifications: newVal });
  };

  const openDashboard = () => {
    const dashboardUrl = import.meta.env.VITE_DASHBOARD_URL || "http://localhost:3000";
    chrome.tabs.create({ url: `${dashboardUrl}/live-web-guardian` });
  };

  return (
    <div className="p-5">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
        <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-wide">TrustShield AI</h1>
          <p className="text-xs text-slate-400">Live Web Guardian is active.</p>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div 
          onClick={toggleAutoScan}
          className="flex justify-between items-center bg-[#1C1F26] p-3 rounded-lg border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors"
        >
          <span className="text-sm font-medium flex items-center">
            <Activity className={`w-4 h-4 mr-2 ${autoScan ? 'text-emerald-400' : 'text-slate-500'}`} /> Auto-Scan
          </span>
          <div className={`w-8 h-4 rounded-full relative transition-colors ${autoScan ? 'bg-emerald-500' : 'bg-slate-700'}`}>
            <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${autoScan ? 'right-1' : 'left-1'}`}></div>
          </div>
        </div>
        
        <div 
          onClick={toggleNotifications}
          className="flex justify-between items-center bg-[#1C1F26] p-3 rounded-lg border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors"
        >
          <span className="text-sm font-medium flex items-center">
            <Settings className={`w-4 h-4 mr-2 ${notifications ? 'text-slate-400' : 'text-slate-500'}`} /> Notifications
          </span>
          <div className={`w-8 h-4 rounded-full relative transition-colors ${notifications ? 'bg-emerald-500' : 'bg-slate-700'}`}>
            <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${notifications ? 'right-1' : 'left-1'}`}></div>
          </div>
        </div>
      </div>

      <button 
        onClick={openDashboard}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded flex items-center justify-center gap-2 transition-colors"
      >
        <ExternalLink className="w-4 h-4" /> Open Dashboard
      </button>
    </div>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(<Popup />);
