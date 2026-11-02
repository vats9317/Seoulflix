import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Film, 
  Tv, 
  ChevronRight, 
  Loader2, 
  X,
  Play
} from 'lucide-react';
import { UserProfile, AuthProvider } from '../types';

interface AuthGateScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
  onContinueAsGuest: () => void;
}

export const AuthGateScreen: React.FC<AuthGateScreenProps> = ({
  onLoginSuccess,
  onContinueAsGuest
}) => {
  const [activeModal, setActiveModal] = useState<'google' | 'email' | 'apple' | null>(null);
  const [loadingProvider, setLoadingProvider] = useState<AuthProvider | null>(null);

  // Email form state
  const [emailMode, setEmailMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('s79845320@gmail.com');
  const [password, setPassword] = useState('korea123');
  const [name, setName] = useState('कोरियाई सिनेमा प्रेमी');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');

  // Google account selector state
  const [selectedGoogleAccount, setSelectedGoogleAccount] = useState('s79845320@gmail.com');
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [showAddGoogleAccount, setShowAddGoogleAccount] = useState(false);

  // Apple account options
  const [appleEmailOption, setAppleEmailOption] = useState<'share' | 'hide'>('share');

  // Handle Google Login
  const handleGoogleLogin = (chosenEmail: string) => {
    setLoadingProvider('google');
    setTimeout(() => {
      const newUser: UserProfile = {
        id: `google_${Date.now()}`,
        name: chosenEmail.split('@')[0],
        email: chosenEmail,
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${chosenEmail}`,
        provider: 'google',
        createdAt: new Date().toISOString()
      };
      setLoadingProvider(null);
      setActiveModal(null);
      onLoginSuccess(newUser);
    }, 700);
  };

  // Handle Email Login / Signup
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setEmailError('कृपया एक वैध ईमेल पता दर्ज करें');
      return;
    }
    if (!password || password.length < 4) {
      setEmailError('पासवर्ड कम से कम 4 अक्षरों का होना चाहिए');
      return;
    }

    setLoadingProvider('email');
    setEmailError('');

    setTimeout(() => {
      const newUser: UserProfile = {
        id: `email_${Date.now()}`,
        name: emailMode === 'signup' && name ? name : email.split('@')[0],
        email: email,
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${email}`,
        provider: 'email',
        createdAt: new Date().toISOString()
      };
      setLoadingProvider(null);
      setActiveModal(null);
      onLoginSuccess(newUser);
    }, 600);
  };

  // Handle Apple Login
  const handleAppleLogin = () => {
    setLoadingProvider('apple');
    setTimeout(() => {
      const appleEmail = appleEmailOption === 'hide' 
        ? `user_${Math.random().toString(36).substring(7)}@privaterelay.appleid.com`
        : 's79845320@icloud.com';

      const newUser: UserProfile = {
        id: `apple_${Date.now()}`,
        name: 'Apple User',
        email: appleEmail,
        avatarUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=apple_cinema',
        provider: 'apple',
        createdAt: new Date().toISOString()
      };
      setLoadingProvider(null);
      setActiveModal(null);
      onLoginSuccess(newUser);
    }, 800);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#08090e] text-white flex flex-col justify-between overflow-x-hidden select-none">
      
      {/* Background Poster Collage with Dark Blur Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#08090e]/85 via-[#08090e]/95 to-[#08090e] z-10" />
        <div className="absolute inset-0 bg-radial from-red-600/10 via-transparent to-transparent z-10" />
        
        {/* Subtle grid of real K-Drama backdrop posters */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 opacity-20 filter blur-[1px] transform -rotate-3 scale-105">
          <img src="https://image.tmdb.org/t/p/w500/1QdXdRYfktUSONkl1oD5gc6Be0s.jpg" alt="Squid Game" className="w-full aspect-[2/3] object-cover rounded-xl" />
          <img src="https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg" alt="Parasite" className="w-full aspect-[2/3] object-cover rounded-xl" />
          <img src="https://image.tmdb.org/t/p/w500/wPtvTLr4iV8bIqL5sBw7x56k9kI.jpg" alt="All of Us Are Dead" className="w-full aspect-[2/3] object-cover rounded-xl" />
          <img src="https://image.tmdb.org/t/p/w500/A70d4nI033L2gN72h1Xvj1eF8Gz.jpg" alt="Queen of Tears" className="w-full aspect-[2/3] object-cover rounded-xl" />
          <img src="https://image.tmdb.org/t/p/w500/b87x2qLg2f7Z1bO8sY8W7Qz1v9p.jpg" alt="Crash Landing on You" className="w-full aspect-[2/3] object-cover rounded-xl" />
          <img src="https://image.tmdb.org/t/p/w500/1p5ujrZ3pWf9v8t6Y3n8V9s4x6d.jpg" alt="Goblin" className="w-full aspect-[2/3] object-cover rounded-xl" />
        </div>
      </div>

      {/* Top Header Bar */}
      <header className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 flex items-center justify-center shadow-lg shadow-red-600/40">
            <span className="text-white font-black text-xl tracking-tight">서울</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white">
                SEOUL<span className="text-red-500">FLIX</span>
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-black bg-red-500/20 text-red-400 border border-red-500/30 rounded uppercase tracking-wider">
                हिंदी
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-medium hidden sm:block">
              कोरियाई ड्रामा और फ़िल्मों का हिंदी महासागर
            </p>
          </div>
        </div>

        {/* Skip to Guest Button in header */}
        <button
          onClick={onContinueAsGuest}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white transition-all cursor-pointer"
        >
          <span>गेस्ट मोड</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* Main Hero & Auth Gate Card */}
      <main className="relative z-20 flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md bg-[#10121d]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 space-y-6">
          
          {/* Card Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>प्रवेश द्वार • साइन इन करें</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              SeoulFlix में लॉगिन करें
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              हज़ारों कोरियन सीरीज़ और फ़िल्में हिंदी डबिंग, HD क्वालिटी और डेटा सेवर के साथ देखने के लिए अपना अकाउंट चुनें।
            </p>
          </div>

          {/* 3 LOGIN OPTIONS BUTTONS */}
          <div className="space-y-3 pt-2">
            
            {/* OPTION 1: GOOGLE ACCOUNT */}
            <button
              onClick={() => setActiveModal('google')}
              disabled={loadingProvider !== null}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white hover:bg-gray-100 text-gray-900 font-bold text-sm shadow-md transition-all hover:scale-[1.01] active:scale-99 cursor-pointer group disabled:opacity-50"
            >
              <div className="flex items-center gap-3.5">
                {/* Official 4-color Google G icon */}
                <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="leading-tight">Google से लॉगिन करें</p>
                  <p className="text-[11px] font-normal text-gray-500">Continue with Google Account</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* OPTION 2: EMAIL ACCOUNT */}
            <button
              onClick={() => setActiveModal('email')}
              disabled={loadingProvider !== null}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#1a1d2d] hover:bg-[#22263a] border border-white/10 hover:border-red-500/50 text-white font-bold text-sm shadow-md transition-all hover:scale-[1.01] active:scale-99 cursor-pointer group disabled:opacity-50"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-6 h-6 rounded-lg bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 flex-shrink-0">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <p className="leading-tight">ईमेल द्वारा लॉगिन करें</p>
                  <p className="text-[11px] font-normal text-gray-400">Continue with Email & Password</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* OPTION 3: APPLE ACCOUNT */}
            <button
              onClick={() => setActiveModal('apple')}
              disabled={loadingProvider !== null}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-black hover:bg-[#151515] border border-white/20 text-white font-bold text-sm shadow-md transition-all hover:scale-[1.01] active:scale-99 cursor-pointer group disabled:opacity-50"
            >
              <div className="flex items-center gap-3.5">
                {/* Official Apple Icon */}
                <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 170 170">
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.85-12-14.44-6.19-9.56-11.06-20.2-14.6-31.91-3.54-11.72-5.31-22.78-5.31-33.19 0-14.78 3.78-26.69 11.35-35.73 7.57-9.04 16.92-13.67 28.05-13.88 4.79 0 10.3 1.34 16.54 4.02 6.24 2.68 10.15 4.08 11.72 4.2 1.9-.32 6.03-1.84 12.39-4.56 6.35-2.72 11.58-3.95 15.68-3.69 11.58.63 21.04 4.88 28.38 12.74-10.13 6.13-15.11 14.54-14.93 25.24.19 8.27 3.33 15.25 9.43 20.93 6.1 5.68 13.38 9.05 21.84 10.11-2.15 6.44-4.72 13.04-7.72 19.8zM119.22 31.86c0-7.14 2.65-13.9 7.95-20.28 5.3-6.38 11.66-10.39 19.08-12.03.43 1.07.65 2.18.65 3.33 0 7.24-2.73 14.16-8.19 20.76-5.46 6.6-11.96 10.59-19.49 11.97v-3.75z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="leading-tight">Apple अकाउंट से लॉगिन करें</p>
                  <p className="text-[11px] font-normal text-gray-400">Sign in with Apple ID</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
            </button>

          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-white/10 w-full" />
            <span className="bg-[#10121d] px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              अथवा
            </span>
          </div>

          {/* Guest / Direct Entry Option */}
          <div className="space-y-3">
            <button
              onClick={onContinueAsGuest}
              className="w-full py-3 px-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 text-red-500 fill-red-500" />
              <span>बिना लॉगिन सीधे शुरू करें (Continue as Guest)</span>
            </button>

            <div className="flex items-center justify-center gap-4 text-[11px] text-gray-400 pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                100% सुरक्षित
              </span>
              <span>•</span>
              <span>कोई कार्ड आवश्यक नहीं</span>
              <span>•</span>
              <span className="text-amber-400">फुल HD हिंदी</span>
            </div>
          </div>

        </div>
      </main>

      {/* Footer Info */}
      <footer className="relative z-20 py-4 text-center text-xs text-gray-400 border-t border-white/5 px-4">
        <span>© {new Date().getFullYear()} SeoulFlix Hindi • कोरियाई ड्रामा और फ़िल्में हिंदी में</span>
      </footer>

      {/* ========================================================================= */}
      {/* MODAL 1: GOOGLE ACCOUNT CHOOSER DIALOG */}
      {/* ========================================================================= */}
      {activeModal === 'google' && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="relative w-full max-w-sm bg-[#161826] border border-white/15 rounded-3xl p-6 shadow-2xl text-white space-y-5">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Google Header */}
            <div className="text-center space-y-1">
              <div className="w-10 h-10 mx-auto rounded-full bg-white flex items-center justify-center shadow-md">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-white pt-2">Google अकाउंट चुनें</h3>
              <p className="text-xs text-gray-400">SeoulFlix पर जारी रखने के लिए</p>
            </div>

            {/* Account List */}
            <div className="space-y-2">
              <button
                onClick={() => handleGoogleLogin(selectedGoogleAccount)}
                disabled={loadingProvider === 'google'}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center font-bold text-xs text-white">
                    {selectedGoogleAccount[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white group-hover:text-red-400 transition-colors">
                      {selectedGoogleAccount}
                    </p>
                    <p className="text-[10px] text-emerald-400 font-medium">सक्रिय Google खाता</p>
                  </div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </button>

              {/* Enter Custom Google Email Toggle */}
              {showAddGoogleAccount ? (
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <input
                    type="email"
                    placeholder="अन्य Google ईमेल लिखें..."
                    value={customGoogleEmail}
                    onChange={(e) => setCustomGoogleEmail(e.target.value)}
                    className="w-full px-3 py-1.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-red-500"
                  />
                  <button
                    onClick={() => {
                      if (customGoogleEmail.includes('@')) {
                        handleGoogleLogin(customGoogleEmail);
                      }
                    }}
                    className="w-full py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold"
                  >
                    इस अकाउंट से लॉगिन करें
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddGoogleAccount(true)}
                  className="w-full py-2 text-center text-xs text-gray-400 hover:text-white transition-colors"
                >
                  + दूसरा Google खाता जोड़ें
                </button>
              )}
            </div>

            {/* Quick Action Button */}
            <button
              onClick={() => handleGoogleLogin(selectedGoogleAccount)}
              disabled={loadingProvider === 'google'}
              className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              {loadingProvider === 'google' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Google से जुड़ रहे हैं...</span>
                </>
              ) : (
                <span>Google से तुरंत लॉगिन करें</span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: EMAIL SIGN IN / SIGN UP FORM */}
      {/* ========================================================================= */}
      {activeModal === 'email' && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="relative w-full max-w-sm bg-[#161826] border border-white/15 rounded-3xl p-6 shadow-2xl text-white space-y-4">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Tabs: Sign In / Create Account */}
            <div className="flex items-center gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => {
                  setEmailMode('signin');
                  setEmailError('');
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  emailMode === 'signin'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                साइन इन (Sign In)
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmailMode('signup');
                  setEmailError('');
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  emailMode === 'signup'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                नया खाता बनाएं
              </button>
            </div>

            {emailError && (
              <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs">
                {emailError}
              </div>
            )}

            <form onSubmit={handleEmailSubmit} className="space-y-3">
              {emailMode === 'signup' && (
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-gray-400">आपका पूरा नाम</label>
                  <div className="relative flex items-center">
                    <User className="w-4 h-4 absolute left-3 text-gray-500" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="उदा. राहुल शर्मा"
                      className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-red-500"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-400">ईमेल पता (Email)</label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 absolute left-3 text-gray-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-400">पासवर्ड (Password)</label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 absolute left-3 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-red-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loadingProvider === 'email'}
                className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all mt-4"
              >
                {loadingProvider === 'email' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>सत्यापन हो रहा है...</span>
                  </>
                ) : (
                  <span>{emailMode === 'signin' ? 'साइन इन करें' : 'नया खाता बनाकर जारी रखें'}</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: APPLE ID SIGN IN DIALOG */}
      {/* ========================================================================= */}
      {activeModal === 'apple' && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="relative w-full max-w-sm bg-[#121214] border border-white/20 rounded-3xl p-6 shadow-2xl text-white space-y-5">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Apple Header */}
            <div className="text-center space-y-1">
              <div className="w-12 h-12 mx-auto rounded-full bg-white/10 flex items-center justify-center">
                <svg className="w-7 h-7 fill-white" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.85-12-14.44-6.19-9.56-11.06-20.2-14.6-31.91-3.54-11.72-5.31-22.78-5.31-33.19 0-14.78 3.78-26.69 11.35-35.73 7.57-9.04 16.92-13.67 28.05-13.88 4.79 0 10.3 1.34 16.54 4.02 6.24 2.68 10.15 4.08 11.72 4.2 1.9-.32 6.03-1.84 12.39-4.56 6.35-2.72 11.58-3.95 15.68-3.69 11.58.63 21.04 4.88 28.38 12.74-10.13 6.13-15.11 14.54-14.93 25.24.19 8.27 3.33 15.25 9.43 20.93 6.1 5.68 13.38 9.05 21.84 10.11-2.15 6.44-4.72 13.04-7.72 19.8zM119.22 31.86c0-7.14 2.65-13.9 7.95-20.28 5.3-6.38 11.66-10.39 19.08-12.03.43 1.07.65 2.18.65 3.33 0 7.24-2.73 14.16-8.19 20.76-5.46 6.6-11.96 10.59-19.49 11.97v-3.75z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-white pt-1">Sign in with Apple</h3>
              <p className="text-xs text-gray-400">SeoulFlix Cinema</p>
            </div>

            {/* Apple ID options */}
            <div className="space-y-3 bg-white/5 p-3.5 rounded-2xl border border-white/10 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-gray-400">Apple ID:</span>
                <span className="text-white font-semibold">s79845320@icloud.com</span>
              </div>

              <div className="space-y-2 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="apple_email"
                    checked={appleEmailOption === 'share'}
                    onChange={() => setAppleEmailOption('share')}
                    className="accent-white"
                  />
                  <span>मेरा ईमेल साझा करें (Share My Email)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="apple_email"
                    checked={appleEmailOption === 'hide'}
                    onChange={() => setAppleEmailOption('hide')}
                    className="accent-white"
                  />
                  <span>मेरा ईमेल छिपाएँ (Hide My Email Relay)</span>
                </label>
              </div>
            </div>

            <button
              onClick={handleAppleLogin}
              disabled={loadingProvider === 'apple'}
              className="w-full py-3 bg-white hover:bg-gray-100 text-black font-black text-xs rounded-2xl shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              {loadingProvider === 'apple' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Face ID / Passcode सत्यापन...</span>
                </>
              ) : (
                <span>Apple ID से जारी रखें</span>
              )}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
