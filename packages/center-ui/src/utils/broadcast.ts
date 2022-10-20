const bc = new BroadcastChannel('broadcast')

const actions = {
  reload() {
    window.location.reload()
  }
}

bc.addEventListener('message', (ev) => {
  if (ev.data in actions) {
    const key = ev.data as keyof typeof actions
    actions[key]()
  }
})

export function post(msg: keyof typeof actions) {
  bc.postMessage(msg)
  actions[msg]()
}
