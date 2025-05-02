declare global {
    interface Window {
      voiceflow: any;  // You can specify a more specific type if needed, or use `any`
    }
  }
  
  // This will ensure the file is treated as a module.
export {};
