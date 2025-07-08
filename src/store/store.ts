import {createStore} from 'zustand/vanilla';
import {useStore} from 'zustand';
import { toast } from 'sonner';

type State = {
  selectedFile: File | null;
  preview: string | null;
  altTextPrompt: string;
  shortAltText: string;
  longAltText: string;
  isGenerating: boolean;
};

type Action = {
  setSelectedFile: (file: File | null) => void;
  setPreview: (preview: string | null) => void;
  setAltTextPrompt: (prompt: string) => void;
  setShortAltText: (text: string) => void;
  setLongAltText: (text: string) => void;
  setIsGenerating: (generating: boolean) => void;
  handleFileSelect: (file: File) => void;
  handleClearFile: () => void;
  handleReset: () => void;
  handleSave: () => void;
};

export const appStore = createStore<State & Action>((set, get) => ({
  selectedFile: null,
  preview: null,
  altTextPrompt: 'Generate a short and long alt text for the following image',
  shortAltText: '',
  longAltText: '',
  isGenerating: false,
  
  setSelectedFile: (file: File | null) => set({selectedFile: file}),
  setPreview: (preview: string | null) => set({preview}),
  setAltTextPrompt: (altTextPrompt: string) => set({altTextPrompt}),
  setShortAltText: (shortAltText: string) => set({shortAltText}),
  setLongAltText: (longAltText: string) => set({longAltText}),
  setIsGenerating: (isGenerating: boolean) => set({isGenerating}),
  
  handleFileSelect: (file: File) => {
    set({selectedFile: file});
    const reader = new FileReader();
    reader.onload = (e) => {
      set({preview: e.target?.result as string});
    };
    reader.readAsDataURL(file);
  },
  
  handleClearFile: () => {
    set({
      selectedFile: null,
      preview: null,
      shortAltText: '',
      longAltText: ''
    });
  },
  
  handleReset: () => {
    const { handleClearFile } = get();
    handleClearFile();
    set({
      altTextPrompt: ''
    });
  },
  
  handleSave: () => {
    const { selectedFile, shortAltText, longAltText, altTextPrompt, preview, handleReset } = get();
    
    if (!selectedFile || !shortAltText || !longAltText) return;
    
    const savedData = {
      fileName: selectedFile.name,
      fileSize: selectedFile.size,
      altTextPrompt,
      shortAltText,
      longAltText,
      timestamp: new Date().toISOString(),
      imageData: preview // Include image data directly in the saved entry
    };
    
    const existingData = JSON.parse(localStorage.getItem('altTextHistory') || '[]');
    existingData.push(savedData);
    localStorage.setItem('altTextHistory', JSON.stringify(existingData));
    
    // Dispatch custom event to update count
    window.dispatchEvent(new CustomEvent('savedItemsChanged'));
    
    toast.success('Image and alt text saved successfully!');
    
    // Reset the form after successful save
    handleReset();
  }
}));

export const useAppStore = <T>(selector: (state: State & Action) => T) =>
  useStore(appStore, selector);
