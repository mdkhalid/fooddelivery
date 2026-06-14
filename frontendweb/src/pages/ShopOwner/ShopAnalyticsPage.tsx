import { BarChart3, TrendingUp, Clock, Info } from 'lucide-react'
import { cn } from '@/utils/cn'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import AnalyticsChart from './components/AnalyticsChart'

const popularItems = [
  { name: 'Grilled Chicken', orders: 89 },
  { name: 'Spring Rolls', orders: 76 },
  { name: 'Pasta Carbonara', orders: 65 },
  { name: 'Chocolate Cake', orders: 52 },
  { name: 'Garlic Bread', orders: 41 },
]

const hourlyData = [
  { label: '8am', value: 2 }, { label: '9am', value: 5 }, { label: '10am', value: 8 },
  { label: '11am', value: 15 }, { label: '12pm', value: 32 }, { label: '1pm', value: 28 },
  { label: '2pm', value: 12 }, { label: '3pm', value: 8 }, { label: '4pm', value: 6 },
  { label: '5pm', value: 18 }, { label: '6pm', value: 35 }, { label: '7pm', value: 30 },
  { label: '8pm', value: 20 }, { label: '9pm', value: 10 },
]

const aovData = [
  { label: 'Mon', value: 22.50 }, { label: 'Tue', value: 24.80 }, { label: 'Wed', value: 21.20 },
  { label: 'Thu', value: 26.10 }, { label: 'Fri', value: 28.40 }, { label: 'Sat', value: 30.20 },
  { label: 'Sun', value: 25.60 },
]

const heatmapDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const heatmapHours = ['10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21']
const heatmapValues = [
  [2,5,15,28,12,8,6,18,35,30,20,10],
  [3,6,14,25,10,7,5,16,32,28,18,8],
  [2,4,12,22,9,6,4,14,28,24,16,7],
  [4,7,16,30,14,9,7,20,38,32,22,11],
  [5,8,18,35,16,10,8,22,40,35,25,12],
  [6,10,20,38,18,12,10,25,42,38,28,14],
  [4,8,16,30,14,10,8,20,35,30,22,10],
]

function getHeatColor(value: number, max: number): string {
  const ratio = value / max
  if (ratio > 0.8) return 'bg-orange-500'
  if (ratio > 0.6) return 'bg-orange-400'
  if (ratio > 0.4) return 'bg-orange-300'
  if (ratio > 0.2) return 'bg-orange-200'
  return 'bg-orange-50'
}

export default function ShopAnalyticsPage() {
  const maxHeat = Math.max(...heatmapValues.flat())

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Analytics</h2>
        <p className="text-sm text-gray-500 mt-1">Insights into your restaurant performance</p>
      </div>

      {/* Data Collection Notice */}
      <Card className="border-blue-200 bg-blue-50">
        <div className="flex items-center gap-3">
          <Info className="w-5 h-5 text-blue-600 shrink-0" />
          <div>
            <p className="text-sm font-medium text-blue-800">Collecting data</p>
            <p className="text-sm text-blue-600">More detailed analytics will be available after 7 days of order data.</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Popular Items */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-gray-400" />
            <h3 className="font-semibold text-gray-900">Most Popular Items</h3>
          </div>
          <div className="space-y-3">
            {popularItems.map((item, i) => (
              <div key={item.name} className="flex items-center gap-3">
                <span className="text-xs font-medium text-gray-400 w-4">{i + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.name}</span>
                    <span className="text-xs text-gray-500">{item.orders} orders</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-orange-400 to-red-400 h-2 rounded-full"
                      style={{ width: `${popularItems[0] ? (item.orders / popularItems[0].orders) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Average Order Value Trend */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-gray-400" />
            <h3 className="font-semibold text-gray-900">Avg. Order Value</h3>
          </div>
          <AnalyticsChart data={aovData} type="line" />
        </Card>
      </div>

      {/* Peak Hours */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-gray-400" />
          <h3 className="font-semibold text-gray-900">Peak Hours</h3>
          <Badge variant="warning" size="sm">12pm-1pm, 6pm-7pm</Badge>
        </div>
        <AnalyticsChart data={hourlyData} type="bar" />
      </Card>

      {/* Orders Heatmap */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <h3 className="font-semibold text-gray-900">Orders by Time & Day</h3>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            <div className="flex items-center gap-1 mb-1">
              <div className="w-10" />
              {heatmapHours.map((h) => (
                <div key={h} className="flex-1 text-center text-xs text-gray-400">{h}</div>
              ))}
            </div>
            {heatmapDays.map((day, di) => (
              <div key={day} className="flex items-center gap-1">
                <div className="w-10 text-xs text-gray-500 font-medium">{day}</div>
                {heatmapValues[di]?.map((val, hi) => (
                  <div
                    key={`${day}-${hi}`}
                    className={cn(
                      'flex-1 aspect-square rounded-sm transition-colors',
                      getHeatColor(val, maxHeat)
                    )}
                    title={`${day} ${heatmapHours[hi]}:00 — ${val} orders`}
                  />
                ))}
              </div>
            ))}
            <div className="flex items-center gap-2 mt-3 justify-end">
              <span className="text-xs text-gray-400">Less</span>
              <div className="flex gap-0.5">
                {['bg-orange-50', 'bg-orange-200', 'bg-orange-300', 'bg-orange-400', 'bg-orange-500'].map((c) => (
                  <div key={c} className={cn('w-4 h-4 rounded-sm', c)} />
                ))}
              </div>
              <span className="text-xs text-gray-400">More</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
