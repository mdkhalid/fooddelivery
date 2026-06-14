import { MapPin } from 'lucide-react'
import SearchBar from './SearchBar'

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-surface-50 via-white to-brand-50/30">
      <div className="absolute inset-0 bg-mesh-gradient opacity-60" />

      <div className="absolute top-10 left-[10%] h-64 w-64 rounded-full bg-brand-200/20 blur-3xl animate-float" />
      <div className="absolute bottom-0 right-[15%] h-48 w-48 rounded-full bg-accent/10 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-100/15 blur-2xl animate-pulse-soft" />

      <div className="absolute top-20 right-[8%] text-6xl opacity-10 select-none animate-bounce-gentle">🍕</div>
      <div className="absolute bottom-16 left-[12%] text-5xl opacity-10 select-none animate-bounce-gentle" style={{ animationDelay: '1s' }}>🍣</div>
      <div className="absolute top-32 left-[25%] text-4xl opacity-8 select-none animate-bounce-gentle" style={{ animationDelay: '2s' }}>🍔</div>

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <div className="text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-medium text-surface-600 shadow-glass backdrop-blur-sm border border-white/30 animate-fade-in">
            <MapPin className="h-4 w-4 text-brand-500" />
            <span>Delivering happiness to your doorstep</span>
          </div>

          <h1 className="mx-auto max-w-4xl font-display text-4xl font-bold tracking-tight text-surface-900 sm:text-5xl lg:text-6xl animate-slide-up">
            Hungry?{' '}
            <span className="bg-gradient-brand bg-clip-text text-transparent">
              We've got you covered.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-surface-500 sm:text-xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Order from the best restaurants near you.
            <br className="hidden sm:block" />
            Fast delivery, fresh food, incredible taste.
          </p>

          <div className="mx-auto mt-10 max-w-2xl animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <SearchBar />
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-surface-400 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Free delivery on first order
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              500+ restaurants
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Real-time tracking
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
