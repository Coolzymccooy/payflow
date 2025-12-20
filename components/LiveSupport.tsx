
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { Mic, MicOff, Volume2, X, Bot, Loader2, Waves, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const LiveSupport: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
        stopSession();
    };
  }, []);

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const startSession = async () => {
    setError(null);
    setIsConnecting(true);
    
    // Rule: New GoogleGenAI instance right before call
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("BROWSER_UNSUPPORTED");
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      inputContextRef.current = new AudioContext({ sampleRate: 16000 });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } } },
          systemInstruction: 'You are the Payflow OS Voice Assistant. Technical, elite, and helpful. You analyze global treasury, payroll health, and settlement velocity. Keep responses brief and executive.'
        },
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setIsConnecting(false);
            if (!inputContextRef.current || !streamRef.current) return;
            
            const source = inputContextRef.current.createMediaStreamSource(streamRef.current);
            const processor = inputContextRef.current.createScriptProcessor(4096, 1, 1);
            
            processor.onaudioprocess = (e) => {
              // Note: We check sessionRef later to avoid stale closures
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) int16[i] = inputData[i] * 32768;
              
              const binary = String.fromCharCode(...new Uint8Array(int16.buffer));
              const base64 = btoa(binary);

              sessionPromise.then(s => {
                s.sendRealtimeInput({ 
                    media: { 
                        data: base64, 
                        mimeType: 'audio/pcm;rate=16000' 
                    } 
                });
              });
            };
            
            source.connect(processor);
            processor.connect(inputContextRef.current.destination);
          },
          onmessage: async (msg) => {
            const audioData = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData && audioContextRef.current) {
              const buffer = await decodeAudioData(decode(audioData), audioContextRef.current, 24000, 1);
              const source = audioContextRef.current.createBufferSource();
              source.buffer = buffer;
              source.connect(audioContextRef.current.destination);
              const startTime = Math.max(nextStartTimeRef.current, audioContextRef.current.currentTime);
              source.start(startTime);
              nextStartTimeRef.current = startTime + buffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }
          },
          onerror: (e) => {
            console.error("Voice Oracle Error:", e);
            setError("LINK_FAILED: Connection interrupted by peer.");
            stopSession();
          },
          onclose: () => stopSession()
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (e: any) {
      console.error("Uplink failed:", e);
      setIsConnecting(false);
      if (e.name === 'NotAllowedError') {
        setError("PERMISSIONS_DENIED: Microphone access is required for voice commands.");
      } else {
        setError("HARDWARE_FAULT: Audio subsystem initialization failed.");
      }
    }
  };

  const stopSession = () => {
    sessionRef.current?.close();
    sourcesRef.current.forEach(s => { try { s.stop(); } catch(e){} });
    sourcesRef.current.clear();
    
    streamRef.current?.getTracks().forEach(t => t.stop());
    inputContextRef.current?.close();
    audioContextRef.current?.close();
    
    setIsActive(false);
    setIsConnecting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[300] w-80 bg-brand-950 border border-brand-800 rounded-sm shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4">
      <div className="p-4 border-b border-brand-800 flex justify-between items-center bg-brand-900/50">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-action-500" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Payflow Oracle Live</span>
        </div>
        <button onClick={onClose} className="text-brand-500 hover:text-white transition-colors">
            <X className="w-4 h-4" />
        </button>
      </div>

      {error ? (
        <div className="p-8 text-center space-y-6 animate-in fade-in">
             <div className="w-16 h-16 bg-rose-500/20 rounded-full flex items-center justify-center text-rose-500 border border-rose-500/30 mx-auto">
                <ShieldAlert className="w-8 h-8" />
             </div>
             <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-tight">Security Handshake Blocked</h3>
                <p className="text-[9px] text-brand-500 font-mono mt-1 uppercase leading-relaxed">{error}</p>
             </div>
             <button 
                onClick={startSession}
                className="w-full py-3 bg-brand-900 text-white font-bold uppercase text-[10px] tracking-widest rounded-sm hover:bg-brand-800 transition-all border border-brand-800"
             >
                Re-Initialize Uplink
             </button>
        </div>
      ) : (
        <div className="p-8 text-center space-y-6">
            <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
                {isActive ? (
                    <>
                        <div className="absolute inset-0 rounded-full border-2 border-action-500/20 animate-ping"></div>
                        <div className="flex items-center justify-center gap-1.5 h-12 w-full px-4">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div 
                                    key={i} 
                                    className="w-1.5 bg-action-500 rounded-full animate-pulse" 
                                    style={{ 
                                        height: `${30 + Math.random() * 70}%`, 
                                        animationDelay: `${i * 0.15}s`,
                                        animationDuration: '0.6s'
                                    }}
                                ></div>
                            ))}
                        </div>
                    </>
                ) : isConnecting ? (
                    <div className="flex flex-col items-center">
                        <Loader2 className="w-10 h-10 text-action-500 animate-spin" />
                        <span className="text-[8px] font-mono text-brand-500 mt-2 uppercase">TUNNELING...</span>
                    </div>
                ) : (
                    <div className="w-full h-full rounded-full border-2 border-brand-800 flex items-center justify-center group-hover:border-brand-600 transition-colors">
                        <Mic className="w-8 h-8 text-brand-700" />
                    </div>
                )}
            </div>

            <div className="space-y-1">
                <h3 className="text-sm font-bold text-white uppercase tracking-tight">
                    {isActive ? 'Listening for Intent...' : isConnecting ? 'Establishing Protocol...' : 'Voice Command Offline'}
                </h3>
                <p className="text-[10px] text-brand-500 font-mono uppercase tracking-wider">
                    {isActive ? 'AES-256 Audio Tunnel Active' : 'Microphone access required'}
                </p>
            </div>

            <button 
                onClick={isActive ? stopSession : startSession} 
                disabled={isConnecting} 
                className={`w-full py-4 rounded-sm font-black uppercase text-[11px] tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-3 ${isActive ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-action-500 hover:bg-action-600 text-white'} disabled:opacity-50`}
            >
                {isConnecting ? (
                    <>SYNCING RAILS...</>
                ) : isActive ? (
                    <><MicOff className="w-4 h-4" /> Terminate Session</>
                ) : (
                    <><Mic className="w-4 h-4" /> Initialize Oracle</>
                )}
            </button>
            
            <div className="pt-4 border-t border-brand-900 flex justify-center gap-4 opacity-40 grayscale">
                <span className="text-[8px] font-black tracking-tighter">GEMINI_2.5_FLASH</span>
                <span className="text-[8px] font-black tracking-tighter">HSM_SECURE</span>
            </div>
        </div>
      )}
    </div>
  );
};
