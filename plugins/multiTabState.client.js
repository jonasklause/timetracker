import _ from 'lodash'
import createMultiTabState from 'vuex-multi-tab-state'

export default ({ store }) => {
  const initState = JSON.parse(JSON.stringify(store.state))
  createMultiTabState({
    statesPaths: ['items', 'history', 'settings', 'trash'],
  })(store)
  _.merge(initState, store.state)
  store.replaceState(initState)
}
