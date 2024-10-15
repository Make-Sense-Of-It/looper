import React, {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
} from "react";

interface LocalStorageContextType {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  selectedCompany: string | null;
  setSelectedCompany: (company: string | null) => void;
  selectedModel: string | null;
  setSelectedModel: (model: string | null) => void;
  prompt: string;
  setPrompt: (prompt: string) => void;
}

const LocalStorageContext = createContext<LocalStorageContextType | undefined>(
  undefined
);

export const LocalStorageProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');

  const getItem = useCallback((key: string) => {
    return localStorage.getItem(key);
  }, []);

  const setItem = useCallback((key: string, value: string) => {
    localStorage.setItem(key, value);
  }, []);

  const removeItem = useCallback((key: string) => {
    localStorage.removeItem(key);
  }, []);

  useEffect(() => {
    const storedCompany = localStorage.getItem("selectedCompany");
    const storedModel = localStorage.getItem("selectedModel");
    const storedPrompt = localStorage.getItem("prompt");
    if (storedCompany) setSelectedCompany(storedCompany);
    if (storedModel) setSelectedModel(storedModel);
    if (storedPrompt) setPrompt(storedPrompt);
  }, []);

  useEffect(() => {
    if (selectedCompany)
      localStorage.setItem("selectedCompany", selectedCompany);
    else localStorage.removeItem("selectedCompany");
  }, [selectedCompany]);

  useEffect(() => {
    if (selectedModel) localStorage.setItem("selectedModel", selectedModel);
    else localStorage.removeItem("selectedModel");
  }, [selectedModel]);

  useEffect(() => {
    localStorage.setItem("prompt", prompt);
  }, [prompt]);

  return (
    <LocalStorageContext.Provider
      value={{
        getItem,
        setItem,
        removeItem,
        selectedCompany,
        setSelectedCompany,
        selectedModel,
        setSelectedModel,
        prompt,
        setPrompt,
      }}
    >
      {children}
    </LocalStorageContext.Provider>
  );
};

export const useLocalStorage = (): LocalStorageContextType => {
  const context = useContext(LocalStorageContext);
  if (!context) {
    throw new Error(
      "useLocalStorage must be used within a LocalStorageProvider"
    );
  }
  return context;
};