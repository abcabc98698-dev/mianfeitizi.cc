import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import Layout from './Layout.vue'
import HomeHero from './components/HomeHero.vue'
import TopicMap from './components/TopicMap.vue'
import ZeroResult from './components/ZeroResult.vue'
import PartnerCard from './components/PartnerCard.vue'
import ArticleMeta from './components/ArticleMeta.vue'
import PlanExplorer from './components/PlanExplorer.vue'
import GuideGrid from './components/GuideGrid.vue'
import AirportLibrary from './components/AirportLibrary.vue'
import AirportProfile from './components/AirportProfile.vue'
import AirportLogo from './components/AirportLogo.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('HomeHero', HomeHero)
    app.component('TopicMap', TopicMap)
    app.component('ZeroResult', ZeroResult)
    app.component('PartnerCard', PartnerCard)
    app.component('ArticleMeta', ArticleMeta)
    app.component('PlanExplorer', PlanExplorer)
    app.component('GuideGrid', GuideGrid)
    app.component('AirportLibrary', AirportLibrary)
    app.component('AirportProfile', AirportProfile)
    app.component('AirportLogo', AirportLogo)
  },
} satisfies Theme
