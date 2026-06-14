import { MapPin } from 'lucide-react'

export default function TrackingMap() {
  return (
    <div className="relative h-[250px] w-full overflow-hidden rounded-2xl border border-surface-100 bg-surface-50 md:h-[400px]">
      <div className="flex h-full flex-col items-center justify-center gap-3 text-surface-400">
        <MapPin className="h-10 w-10" />
        <p className="text-sm font-medium">Map will be loaded here</p>
        <p className="text-xs text-surface-300">
          Integrate with Leaflet or Mapbox for live tracking
        </p>
      </div>
    </div>
  )
}
