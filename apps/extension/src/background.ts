const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL || "http://localhost:3000";

let autoScan = true;

// Load settings
chrome.storage.sync.get(["autoScan"], (res) => {
  if (typeof res.autoScan === 'boolean') autoScan = res.autoScan;
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes.autoScan && typeof changes.autoScan.newValue === 'boolean') {
    autoScan = changes.autoScan.newValue;
  }
});

// Periodic Video Scan (if autoScan enabled)
chrome.alarms.create("scan_video", { periodInMinutes: 10 / 60 });
chrome.alarms.create("heartbeat", { periodInMinutes: 0.5 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "scan_video" && autoScan) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { type: "TRIGGER_SCAN" }).catch(() => {});
      }
    });
  } else if (alarm.name === "heartbeat") {
    sendHeartbeat();
  }
});

const sendHeartbeat = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    fetch(`${DASHBOARD_URL}/api/extension/sync`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "HEARTBEAT",
        url: tabs[0]?.url || ""
      })
    }).catch(() => {});
  });
};

// Send immediately on startup
sendHeartbeat();

// Auto-trigger on page load for supported social media
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && autoScan) {
    sendHeartbeat();
    const url = tab.url.toLowerCase();
    if (url.includes("youtube.com") || url.includes("x.com") || url.includes("twitter.com") || url.includes("instagram.com")) {
      chrome.tabs.sendMessage(tabId, { type: "TRIGGER_SCAN" }).catch(() => {});
    }
  }
});

interface ExtensionMessage {
  type: string;
  dataUrl?: string;
  result?: {
    url: string;
    authenticityScore: number;
    confidence: number;
    prediction: string;
    dataUrl?: string;
  };
  reviewRequired?: boolean;
}

// Relay messages to Backend
chrome.runtime.onMessage.addListener((message: ExtensionMessage, sender, sendResponse) => {
  if (message.type === "ANALYZE_FRAME") {
    fetch(`${DASHBOARD_URL}/api/extension/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: message.dataUrl })
    })
    .then(r => r.json())
    .then(result => {
      sendResponse({ success: true, result });
    })
    .catch((err) => {
      sendResponse({ success: false, error: err.message });
    });
    return true; // Keep message channel open for async response
  }
  
  if (message.type === "SAVE_SCAN_RESULT" && message.result) {
    fetch(`${DASHBOARD_URL}/api/extension/sync`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "SCAN_RESULT",
        url: message.result.url,
        authenticityScore: message.result.authenticityScore,
        confidence: message.result.confidence,
        prediction: message.result.prediction,
        reviewRequired: message.reviewRequired,
        thumbnail: message.result.dataUrl // we can pass it to show in queue
      })
    }).catch(() => {});
  }
  
  if (message.type === "HEARTBEAT") {
    sendHeartbeat();
  }
});
