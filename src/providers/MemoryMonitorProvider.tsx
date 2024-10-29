// providers/MemoryMonitorProvider.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

interface ExtendedPerformance extends Performance {
  memory?: MemoryInfo;
}

declare const performance: ExtendedPerformance;

interface MemoryStats {
  timestamp: number;
  label: string;
  used: string;
  total: string;
  limit: string;
  diff?: string;
}

interface MemoryMonitorContextType {
  memoryStats: MemoryStats[];
  logMemoryUsage: (label: string) => void;
  clearStats: () => void;
}

const MemoryMonitorContext = createContext<
  MemoryMonitorContextType | undefined
>(undefined);

const formatMemory = (bytes: number): string => {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
};

export const MemoryMonitorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [memoryStats, setMemoryStats] = useState<MemoryStats[]>([]);
  const [lastMemoryUsage, setLastMemoryUsage] = useState<number | undefined>(
    undefined
  );

  const logMemoryUsage = useCallback(
    (label: string) => {
      if (!performance.memory) return;

      const currentMemory = performance.memory;
      const stat: MemoryStats = {
        timestamp: Date.now(),
        label,
        used: formatMemory(currentMemory.usedJSHeapSize),
        total: formatMemory(currentMemory.totalJSHeapSize),
        limit: formatMemory(currentMemory.jsHeapSizeLimit),
      };

      if (lastMemoryUsage !== undefined) {
        const diff = currentMemory.usedJSHeapSize - lastMemoryUsage;
        stat.diff = `${diff > 0 ? "+" : ""}${formatMemory(diff)}`;
      }

      setLastMemoryUsage(currentMemory.usedJSHeapSize);
      setMemoryStats((prev) => [...prev.slice(-19), stat]); // Keep last 20 entries
    },
    [lastMemoryUsage]
  );

  const clearStats = useCallback(() => {
    setMemoryStats([]);
    setLastMemoryUsage(undefined);
  }, []);

  // Monitor significant memory changes
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_TRACK_MEMORY !== "true") return;

    let lastCheck = performance.memory?.usedJSHeapSize;
    let timeoutId: NodeJS.Timeout;

    const checkMemory = () => {
      if (performance.memory && lastCheck) {
        const currentMemory = performance.memory.usedJSHeapSize;
        const diff = Math.abs(currentMemory - lastCheck);

        // Log if memory changed by more than 5MB
        if (diff > 5 * 1024 * 1024) {
          logMemoryUsage("Significant memory change");
          lastCheck = currentMemory;
        }
      }
      timeoutId = setTimeout(checkMemory, 5000); // Check every 5 seconds
    };

    timeoutId = setTimeout(checkMemory, 5000);

    return () => clearTimeout(timeoutId);
  }, [logMemoryUsage]);

  const value = {
    memoryStats,
    logMemoryUsage,
    clearStats,
  };

  return (
    <MemoryMonitorContext.Provider value={value}>
      {children}
      {process.env.NEXT_PUBLIC_TRACK_MEMORY === "true" && (
        <MemoryMonitorDisplay />
      )}
    </MemoryMonitorContext.Provider>
  );
};

// Custom hook to use the memory monitor
export const useMemoryMonitor = () => {
  const context = useContext(MemoryMonitorContext);
  if (context === undefined) {
    throw new Error(
      "useMemoryMonitor must be used within a MemoryMonitorProvider"
    );
  }
  return context;
};

// Memory Monitor Display Component
const MemoryMonitorDisplay: React.FC = () => {
  const { memoryStats, clearStats } = useMemoryMonitor();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!performance.memory) {
    return null;
  }

  return (
    <div
      className="absolute bottom-10 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
      style={{ maxWidth: "400px", maxHeight: isCollapsed ? "40px" : "400px" }}
    >
      <div className="flex items-center justify-between p-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <h4 className="text-sm font-medium text-gray-700">Memory Monitor</h4>
        <div className="flex gap-2">
          <button
            onClick={clearStats}
            className="text-xs px-2 py-1 text-gray-600 hover:text-gray-800"
          >
            Clear
          </button>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-xs px-2 py-1 text-gray-600 hover:text-gray-800"
          >
            {isCollapsed ? "Show" : "Hide"}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="overflow-auto p-2" style={{ maxHeight: "360px" }}>
          <div className="space-y-2">
            {memoryStats.map((stat) => (
              <div
                key={stat.timestamp}
                className="text-xs border-b border-gray-100 pb-1"
              >
                <div className="flex justify-between text-gray-600">
                  <span>{new Date(stat.timestamp).toLocaleTimeString()}</span>
                  <span>{stat.label}</span>
                </div>
                <div className="text-gray-800">
                  Used: {stat.used}
                  {stat.diff && (
                    <span
                      className={
                        stat.diff.includes("+")
                          ? "text-red-500"
                          : "text-green-500"
                      }
                    >
                      {" "}
                      ({stat.diff})
                    </span>
                  )}
                </div>
                <div className="text-gray-600">
                  Total: {stat.total} / Limit: {stat.limit}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
