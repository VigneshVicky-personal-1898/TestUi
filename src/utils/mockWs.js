// AI-ASSISTED: Cursor
// PROMPT: Fake WebSocket bus for live dashboard and notification updates
// ACCEPTED-BY: vignesh

const listeners = new Set()
let timer = null
let tick = 0

export function subscribeMockWs(fn) {
  listeners.add(fn)
  if (!timer) {
    timer = setInterval(() => {
      tick += 1
      const payload = {
        type: tick % 3 === 0 ? 'notification' : 'metric',
        tick,
        ts: new Date().toISOString(),
        metrics: {
          revenue: 120000 + Math.floor(Math.random() * 8000),
          orders: 1100 + Math.floor(Math.random() * 80),
          users: 3700 + Math.floor(Math.random() * 120),
          conversion: Number((2.8 + Math.random()).toFixed(2)),
        },
        notification: {
          id: `ws-${Date.now()}`,
          title: ['New order', 'Stock alert', 'User signed up', 'Payment received'][tick % 4],
          message: `Realtime update #${tick}`,
          type: ['info', 'warning', 'success', 'info'][tick % 4],
        },
      }
      listeners.forEach((l) => l(payload))
    }, 2500)
  }
  return () => {
    listeners.delete(fn)
    if (listeners.size === 0 && timer) {
      clearInterval(timer)
      timer = null
    }
  }
}

export function pushMockWs(payload) {
  listeners.forEach((l) => l(payload))
}
