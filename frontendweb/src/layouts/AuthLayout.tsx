import { Outlet } from 'react-router-dom'
import { Flame } from 'lucide-react'

export function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Brand (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-orange-500 via-red-500 to-pink-500">
        {/* Decorative shapes */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-32 right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-yellow-400/20 rounded-full blur-xl" />

          {/* Floating food emojis */}
          <div className="absolute top-[15%] left-[15%] text-5xl animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>🍕</div>
          <div className="absolute top-[25%] right-[20%] text-4xl animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '2.5s' }}>🍔</div>
          <div className="absolute bottom-[30%] left-[25%] text-5xl animate-bounce" style={{ animationDelay: '1s', animationDuration: '3.5s' }}>🍜</div>
          <div className="absolute bottom-[20%] right-[15%] text-4xl animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '2.8s' }}>🍣</div>
          <div className="absolute top-[55%] left-[10%] text-3xl animate-bounce" style={{ animationDelay: '0.8s', animationDuration: '3.2s' }}>🥗</div>
          <div className="absolute top-[10%] right-[10%] text-3xl animate-bounce" style={{ animationDelay: '1.2s', animationDuration: '2.6s' }}>🌮</div>

          {/* Decorative circles */}
          <div className="absolute bottom-[10%] left-[40%] w-20 h-20 border-2 border-white/20 rounded-full" />
          <div className="absolute top-[40%] right-[30%] w-12 h-12 border-2 border-white/20 rounded-full" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-center text-white">
          <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-8 shadow-2xl">
            <Flame className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">FoodDash</h1>
          <p className="text-xl text-white/90 max-w-sm leading-relaxed">
            Delicious food, delivered to you
          </p>
          <div className="mt-12 flex items-center gap-3 text-sm text-white/70">
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-xs font-semibold"
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <span>10k+ happy customers</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {/* Mobile gradient header */}
        <div className="lg:hidden relative overflow-hidden bg-gradient-to-br from-orange-500 to-red-500 px-6 py-8 text-center">
          <div className="absolute inset-0">
            <div className="absolute top-4 right-8 text-3xl animate-bounce" style={{ animationDuration: '2.5s' }}>🍕</div>
            <div className="absolute bottom-2 left-6 text-2xl animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3s' }}>🍔</div>
          </div>
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4">
              <Flame className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">FoodDash</h1>
            <p className="text-sm text-white/80 mt-1">Delicious food, delivered to you</p>
          </div>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
