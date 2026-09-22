import React, { useState, useEffect, useRef } from "react";
import { ShieldCheck, ShieldAlert, Activity, PlayCircle } from "lucide-react";

export function Overlay() {
  const [status, setStatus] = useState("Monitoring");
  const [result, setResult] = useState<{ score: number; prediction: string; confidence: number, dataUrl?: string } | null>(null);
  const [lastScan, setLastScan] = useState<Date | null>(null);
  const [awaitingReview, setAwaitingReview] = useState(false);

  const [position, setPosition] = useState<{ left?: number; top?: number; right?: number | string; bottom?: number | string }>({
    right: 24,
    bottom: 24
  });
  const [loaded, setLoaded] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ isDragging: false, startX: 0, startY: 0, initialX: 0, initialY: 0 });

  useEffect(() => {
    chrome.storage.local.get(['overlayPosition'], (result) => {
      if (result.overlayPosition) {
        setPosition(result.overlayPosition);
      }
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current.isDragging || !overlayRef.current) return;
      e.preventDefault();

      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      
      let newX = dragRef.current.initialX + dx;
      let newY = dragRef.current.initialY + dy;

      const width = overlayRef.current.offsetWidth;
      const height = overlayRef.current.offsetHeight;

      newX = Math.max(0, Math.min(newX, window.innerWidth - width));
      newY = Math.max(0, Math.min(newY, window.innerHeight - height));
      
      overlayRef.current.style.left = `${newX}px`;
      overlayRef.current.style.top = `${newY}px`;
      overlayRef.current.style.right = 'auto';
      overlayRef.current.style.bottom = 'auto';
    };

    const handleMouseUp = () => {
      if (!dragRef.current.isDragging || !overlayRef.current) return;
      dragRef.current.isDragging = false;
      
      const newPos = { 
        left: parseInt(overlayRef.current.style.left || '0', 10), 
        top: parseInt(overlayRef.current.style.top || '0', 10) 
      };
      
      setPosition(newPos);
      chrome.storage.local.set({ overlayPosition: newPos });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 || !overlayRef.current) return;
    
    dragRef.current.isDragging = true;
    dragRef.current.startX = e.clientX;
    dragRef.current.startY = e.clientY;
    
    const rect = overlayRef.current.getBoundingClientRect();
    dragRef.current.initialX = rect.left;
    dragRef.current.initialY = rect.top;
  };

  useEffect(() => {
    // Listen for scans triggered by background alarm
    const listener = (msg: { type: string }) => {
      if (msg.type === "TRIGGER_SCAN") {
        analyzeCurrentVideo();
      }
    };
    chrome.runtime.onMessage.addListener(listener);
    return () => {
      chrome.runtime.onMessage.removeListener(listener);
    };
  }, []);

  const analyzeCurrentVideo = async () => {
    const video = document.querySelector("video");
    if (!video) {
      setStatus("No Video Found");
      return;
    }

    setStatus("Analyzing...");
    try {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.8);

      chrome.runtime.sendMessage({ type: "ANALYZE_FRAME", dataUrl }, (response) => {
        if (response?.success && response.result) {
          setResult({
            score: response.result.authenticityScore,
            prediction: response.result.prediction,
            confidence: response.result.confidence,
            dataUrl
          });
          setLastScan(new Date());
          setStatus("Analysis Complete");
          setAwaitingReview(true);
        } else {
          setStatus("Analysis Failed");
        }
      });
    } catch (e: unknown) {
      setStatus("Capture Error");
    }
  };

  const handleReviewChoice = (requiresReview: boolean) => {
    if (!result) return;
    
    // Send to background to be pushed to /sync
    chrome.runtime.sendMessage({
      type: "SAVE_SCAN_RESULT",
      result: {
        authenticityScore: result.score,
        prediction: result.prediction,
        confidence: result.confidence,
        url: window.location.href,
        dataUrl: result.dataUrl
      },
      reviewRequired: requiresReview
    });
    
    setAwaitingReview(false);
    setStatus(requiresReview ? "Pending Review" : "Monitoring");
    if (!requiresReview) {
      setResult(null);
    }
  };

  const isManipulated = result && result.prediction !== "Authentic";

  if (!loaded) return null;

  return (
    <div 
      ref={overlayRef}
      className="fixed z-[2147483647] font-sans"
      style={
        position.left !== undefined 
          ? { left: position.left, top: position.top }
          : { right: position.right, bottom: position.bottom }
      }
    >
      <div className="bg-[#0F1115]/90 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-5 w-80 text-white">
        
        <div 
          className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800 cursor-move select-none"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold tracking-wide">TrustShield Live</h2>
          </div>
          <span className="text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded uppercase">
            {status}
          </span>
        </div>

        {result ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${isManipulated ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                {isManipulated ? <ShieldAlert className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />}
              </div>
              <div>
                <p className={`text-2xl font-bold ${isManipulated ? 'text-red-400' : 'text-emerald-400'}`}>
                  {result.score}%
                </p>
                <p className="text-xs text-slate-400 font-semibold uppercase">{result.prediction}</p>
              </div>
            </div>
            
            <div className="text-xs text-slate-500 flex justify-between">
              <span>Confidence: <strong className="text-slate-300">{result.confidence}%</strong></span>
              <span>{lastScan?.toLocaleTimeString()}</span>
            </div>
          </div>
        ) : (
          <div className="h-20 flex items-center justify-center text-slate-500 text-sm">
            Waiting for video stream...
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-slate-800 flex gap-2">
          {awaitingReview ? (
            <>
              <button 
                onClick={() => handleReviewChoice(false)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold py-2 rounded transition-colors flex items-center justify-center"
              >
                Skip Review
              </button>
              <button 
                onClick={() => handleReviewChoice(true)}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2 rounded transition-colors flex items-center justify-center"
              >
                Review Required
              </button>
            </>
          ) : (
            <button 
              onClick={analyzeCurrentVideo}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2 rounded transition-colors flex items-center justify-center gap-1"
            >
              <PlayCircle className="w-4 h-4" /> Analyze Now
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
