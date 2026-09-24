import React, { useState, useEffect } from 'react';
import { X, Camera, CheckCircle2, Scan, RefreshCw, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RecaptureFaceModal: React.FC = () => {
  const { isRecaptureModalOpen, setIsRecaptureModalOpen, users, selectedUserId, updateUser, addToast } = useApp();

  const user = users.find(u => u.id === selectedUserId);
  const [scanStep, setScanStep] = useState<'calibrating' | 'scanning' | 'complete'>('calibrating');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isRecaptureModalOpen) {
      setScanStep('calibrating');
      setProgress(0);
      return;
    }

    const timer1 = setTimeout(() => {
      setScanStep('scanning');
    }, 900);

    return () => clearTimeout(timer1);
  }, [isRecaptureModalOpen]);

  useEffect(() => {
    if (scanStep !== 'scanning') return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanStep('complete');
          return 100;
        }
        return prev + 10;
      });
    }, 220);

    return () => clearInterval(interval);
  }, [scanStep]);

  if (!isRecaptureModalOpen || !user) return null;

  const handleApplyBiometrics = () => {
    const newRate = +(98.5 + Math.random() * 1.3).toFixed(1);
    updateUser(user.id, {
      biometricStatus: 'Registered',
      biometricMatchRate: newRate,
    });
    addToast({
      title: 'Biometric Profile Recalibrated',
      description: `Facial embeddings registered for ${user.name} with ${newRate}% confidence index.`,
      type: 'success',
    });
    setIsRecaptureModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-md rounded-xl border border-[#263449] bg-[#172033] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#263449] px-6 py-4">
          <div className="flex items-center gap-2">
            <Scan className="h-4 w-4 text-orange-400" />
            <h3 className="text-sm font-semibold text-white">
              Biometric Enrollment Terminal
            </h3>
          </div>
          <button
            onClick={() => setIsRecaptureModalOpen(false)}
            className="rounded p-1 text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Camera Viewport Simulation */}
        <div className="p-6">
          <div className="text-center mb-4">
            <div className="text-xs font-medium text-white">{user.name} ({user.id})</div>
            <div className="text-[11px] text-slate-400">Position face within biometric bounding frame</div>
          </div>

          <div className="relative aspect-square w-full max-w-xs mx-auto overflow-hidden rounded-xl border-2 border-[#263449] bg-[#0B1220] flex items-center justify-center">
            {/* Simulated Live Camera Grid Lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:16px_16px]" />

            {/* Face outline graphic */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`flex h-32 w-32 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  scanStep === 'complete'
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : scanStep === 'scanning'
                    ? 'border-orange-500 bg-orange-500/10'
                    : 'border-slate-600 bg-slate-800/40'
                }`}
              >
                <div
                  className={`flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br ${user.avatarColor} text-2xl font-bold text-white shadow-lg`}
                >
                  {user.initials}
                </div>
              </div>

              {/* Laser Scanning Line Animation */}
              {scanStep === 'scanning' && (
                <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent shadow-[0_0_12px_#f97316] animate-bounce" />
              )}
            </div>

            {/* Framing Corner Accents */}
            <div className="absolute top-3 left-3 h-5 w-5 border-t-2 border-l-2 border-orange-500" />
            <div className="absolute top-3 right-3 h-5 w-5 border-t-2 border-r-2 border-orange-500" />
            <div className="absolute bottom-3 left-3 h-5 w-5 border-b-2 border-l-2 border-orange-500" />
            <div className="absolute bottom-3 right-3 h-5 w-5 border-b-2 border-r-2 border-orange-500" />

            {/* Status floating badge */}
            <div className="absolute bottom-4 inset-x-4 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1 text-[11px] font-mono text-slate-200 backdrop-blur-xs">
                {scanStep === 'calibrating' && 'CALIBRATING DEPTH SENSOR...'}
                {scanStep === 'scanning' && `ANALYZING FACIAL LANDMARKS: ${progress}%`}
                {scanStep === 'complete' && 'LIVENESS VERIFIED: 99.4% MATCH'}
              </span>
            </div>
          </div>

          {/* Progress or Completion state */}
          <div className="mt-4 space-y-2">
            <div className="h-1.5 w-full bg-[#111827] rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Anti-Spoofing: Active</span>
              <span>ISO/IEC 19794-5 Compliant</span>
            </div>
          </div>

          {/* Footer controls */}
          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              onClick={() => setIsRecaptureModalOpen(false)}
              className="rounded-lg border border-[#263449] px-4 py-2 text-xs font-medium text-slate-300 hover:bg-[#1E293B]"
            >
              Cancel
            </button>
            {scanStep === 'complete' ? (
              <button
                onClick={handleApplyBiometrics}
                className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-emerald-700 transition-colors"
              >
                <ShieldCheck className="h-4 w-4" />
                Commit New Template
              </button>
            ) : (
              <button
                disabled
                className="flex items-center gap-2 rounded-lg bg-orange-500/50 px-4 py-2 text-xs font-semibold text-white cursor-not-allowed"
              >
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                Scanning Biometrics...
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
