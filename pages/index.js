import React, { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import Head from 'next/head';

export default function DrumMachine() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [bpm, setBpm] = useState(120);
  const [pattern, setPattern] = useState({
    kick: Array(16).fill(false),
    snare: Array(16).fill(false),
    hihat: Array(16).fill(false),
    openhat: Array(16).fill(false),
    crash: Array(16).fill(false),
    perc: Array(16).fill(false)
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const [pressedPads, setPressedPads] = useState({});

  const synthsRef = useRef({});
  const sequenceRef = useRef(null);

  const drumSounds = {
    kick: { freq: 60, color: 'bg-red-500', key: 'Q', name: 'キック' },
    snare: { freq: 200, color: 'bg-blue-500', key: 'W', name: 'スネア' },
    hihat: { freq: 8000, color: 'bg-yellow-500', key: 'E', name: 'ハイハット' },
    openhat: { freq: 6000, color: 'bg-green-500', key: 'R', name: 'オープンハット' },
    crash: { freq: 4000, color: 'bg-purple-500', key: 'T', name: 'クラッシュ' },
    perc: { freq: 800, color: 'bg-pink-500', key: 'Y', name: 'パーカッション' }
  };

  const initializeAudio = async () => {
    if (isInitialized) return;
    
    try {
      await Tone.start();
      
      synthsRef.current.kick = new Tone.MembraneSynth({
        pitchDecay: 0.05,
        octaves: 2,
        oscillator: { type: 'sine' },
        envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.4 }
      }).toDestination();

      synthsRef.current.snare = new Tone.NoiseSynth({
        noise: { type: 'white' },
        envelope: { attack: 0.001, decay: 0.13, sustain: 0, release: 0.03 }
      }).toDestination();

      synthsRef.current.hihat = new Tone.MetalSynth({
        frequency: 200,
        envelope: { attack: 0.001, decay: 0.1, release: 0.01 },
        harmonicity: 5.1,
        modulationIndex: 32,
        resonance: 4000,
        octaves: 1.5
      }).toDestination();

      synthsRef.current.openhat = new Tone.MetalSynth({
        frequency: 200,
        envelope: { attack: 0.001, decay: 0.3, release: 0.03 },
        harmonicity: 5.1,
        modulationIndex: 32,
        resonance: 4000,
        octaves: 1.5
      }).toDestination();

      synthsRef.current.crash = new Tone.MetalSynth({
        frequency: 150,
        envelope: { attack: 0.001, decay: 1, release: 3 },
        harmonicity: 5.1,
        modulationIndex: 64,
        resonance: 4000,
        octaves: 1.5
      }).toDestination();

      synthsRef.current.perc = new Tone.Synth({
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.001, decay: 0.1, sustain: 0.01, release: 0.1 }
      }).toDestination();

      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  };

  const playDrum = (drumType) => {
    if (!isInitialized) return;
    
    setPressedPads(prev => ({ ...prev, [drumType]: true }));
    setTimeout(() => {
      setPressedPads(prev => ({ ...prev, [drumType]: false }));
    }, 100);

    const synth = synthsRef.current[drumType];
    if (!synth) return;

    const now = Tone.now();
    
    switch (drumType) {
      case 'kick':
        synth.triggerAttackRelease('C1', '8n', now);
        break;
      case 'snare':
        synth.triggerAttackRelease('8n', now);
        break;
      case 'hihat':
        synth.triggerAttackRelease('C4', '32n', now);
        break;
      case 'openhat':
        synth.triggerAttackRelease('C4', '4n', now);
        break;
      case 'crash':
        synth.triggerAttackRelease('C3', '2n', now);
        break;
      case 'perc':
        synth.triggerAttackRelease('C4', '16n', now);
        break;
    }
  };

  const toggleStep = (drumType, stepIndex) => {
    setPattern(prev => ({
      ...prev,
      [drumType]: prev[drumType].map((step, index) => 
        index === stepIndex ? !step : step
      )
    }));
  };

  const startSequencer = () => {
    if (!isInitialized) return;
    
    if (sequenceRef.current) {
      sequenceRef.current.dispose();
    }

    sequenceRef.current = new Tone.Sequence((time, step) => {
      setCurrentStep(step);
      
      Object.keys(pattern).forEach(drumType => {
        if (pattern[drumType][step]) {
          const synth = synthsRef.current[drumType];
          if (synth) {
            switch (drumType) {
              case 'kick':
                synth.triggerAttackRelease('C1', '8n', time);
                break;
              case 'snare':
                synth.triggerAttackRelease('8n', time);
                break;
              case 'hihat':
                synth.triggerAttackRelease('C4', '32n', time);
                break;
              case 'openhat':
                synth.triggerAttackRelease('C4', '4n', time);
                break;
              case 'crash':
                synth.triggerAttackRelease('C3', '2n', time);
                break;
              case 'perc':
                synth.triggerAttackRelease('C4', '16n', time);
                break;
            }
          }
        }
      });
    }, Array.from({length: 16}, (_, i) => i), '16n');

    sequenceRef.current.start(0);
    Tone.Transport.start();
    setIsPlaying(true);
  };

  const stopSequencer = () => {
    if (sequenceRef.current) {
      sequenceRef.current.stop();
    }
    Tone.Transport.stop();
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const clearPattern = () => {
    setPattern({
      kick: Array(16).fill(false),
      snare: Array(16).fill(false),
      hihat: Array(16).fill(false),
      openhat: Array(16).fill(false),
      crash: Array(16).fill(false),
      perc: Array(16).fill(false)
    });
  };

  const randomPattern = () => {
    setPattern({
      kick: Array(16).fill(false).map(() => Math.random() > 0.7),
      snare: Array(16).fill(false).map(() => Math.random() > 0.75),
      hihat: Array(16).fill(false).map(() => Math.random() > 0.5),
      openhat: Array(16).fill(false).map(() => Math.random() > 0.85),
      crash: Array(16).fill(false).map(() => Math.random() > 0.9),
      perc: Array(16).fill(false).map(() => Math.random() > 0.8)
    });
  };

  useEffect(() => {
    Tone.Transport.bpm.value = bpm;
  }, [bpm]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      const key = e.key.toUpperCase();
      const drumType = Object.keys(drumSounds).find(drum => drumSounds[drum].key === key);
      if (drumType && !e.repeat) {
        playDrum(drumType);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isInitialized]);

  useEffect(() => {
    return () => {
      if (sequenceRef.current) {
        sequenceRef.current.dispose();
      }
    };
  }, []);

  return (
    <>
      <Head>
        <title>🥁 ビートマシン - 新しいリズムを作ろう！</title>
        <meta name="description" content="Webブラウザで使えるインタラクティブなドラムマシン。リアルタイムでビートを作成しよう！" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-6 md:mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            🥁 ビートマシン 🎵
          </h1>
          
          {!isInitialized && (
            <div className="text-center mb-8">
              <button
                onClick={initializeAudio}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg text-lg md:text-xl font-bold transition-all duration-200 transform hover:scale-105"
              >
                🎧 オーディオエンジンを開始
              </button>
              <p className="text-gray-300 mt-2 text-sm md:text-base">クリックして音声を有効にし、ビート作りを始めましょう！</p>
            </div>
          )}

          {isInitialized && (
            <>
              {/* ドラムパッド */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
                {Object.entries(drumSounds).map(([drumType, config]) => (
                  <button
                    key={drumType}
                    onClick={() => playDrum(drumType)}
                    className={`${config.color} ${pressedPads[drumType] ? 'scale-95 brightness-125' : 'hover:scale-105'} 
                               text-white p-4 md:p-6 rounded-xl text-lg md:text-xl font-bold transition-all duration-100 
                               shadow-lg hover:shadow-xl active:scale-95`}
                  >
                    {config.name}
                    <div className="text-xs md:text-sm mt-1 opacity-75">{config.key}キーを押す</div>
                  </button>
                ))}
              </div>

              {/* コントロールパネル */}
              <div className="bg-gray-800 rounded-xl p-4 md:p-6 mb-4 md:mb-6">
                <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mb-4">
                  <button
                    onClick={isPlaying ? stopSequencer : startSequencer}
                    className={`${isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} 
                               text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold transition-all duration-200 text-sm md:text-base`}
                  >
                    {isPlaying ? '⏹️ 停止' : '▶️ 再生'}
                  </button>
                  
                  <button
                    onClick={clearPattern}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold transition-all duration-200 text-sm md:text-base"
                  >
                    🗑️ クリア
                  </button>
                  
                  <button
                    onClick={randomPattern}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold transition-all duration-200 text-sm md:text-base"
                  >
                    🎲 ランダム
                  </button>
                  
                  <div className="flex items-center gap-2">
                    <label className="text-white font-bold text-sm md:text-base">テンポ:</label>
                    <input
                      type="range"
                      min="80"
                      max="180"
                      value={bpm}
                      onChange={(e) => setBpm(parseInt(e.target.value))}
                      className="w-20 md:w-24"
                    />
                    <span className="text-white font-bold w-10 md:w-12 text-sm md:text-base">{bpm}</span>
                  </div>
                </div>
              </div>

              {/* ステップシーケンサー */}
              <div className="bg-gray-800 rounded-xl p-4 md:p-6">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-4 text-center">ステップシーケンサー</h2>
                
                {Object.entries(drumSounds).map(([drumType, config]) => (
                  <div key={drumType} className="mb-3 md:mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`${config.color} w-3 h-3 md:w-4 md:h-4 rounded`}></div>
                      <span className="text-white font-bold w-16 md:w-20 text-sm md:text-base">{config.name}</span>
                      <div className="grid grid-cols-16 gap-1 flex-1">
                        {pattern[drumType].map((active, stepIndex) => (
                          <button
                            key={stepIndex}
                            onClick={() => toggleStep(drumType, stepIndex)}
                            className={`w-6 h-6 md:w-8 md:h-8 rounded transition-all duration-100 ${
                              active 
                                ? config.color 
                                : stepIndex === currentStep && isPlaying
                                  ? 'bg-yellow-400'
                                  : 'bg-gray-600 hover:bg-gray-500'
                            } ${stepIndex === currentStep && isPlaying ? 'ring-1 md:ring-2 ring-yellow-400' : ''}`}
                          >
                            {stepIndex === currentStep && isPlaying && (
                              <div className="w-full h-full bg-yellow-400 rounded animate-pulse opacity-50"></div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-4 md:mt-6 text-gray-400 text-sm md:text-base">
                <p>Q、W、E、R、T、Yキーでドラムを演奏できます</p>
                <p>ステップシーケンサーのボタンをクリックしてパターンを作成しましょう</p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
