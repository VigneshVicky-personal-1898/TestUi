// AI-ASSISTED: Cursor
// PROMPT: Add Test Runner nav entry for Selenium/Playwright execution
// ACCEPTED-BY: vignesh
import DashboardIcon from '@mui/icons-material/Dashboard'
import PeopleIcon from '@mui/icons-material/People'
import InventoryIcon from '@mui/icons-material/Inventory'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import DynamicFormIcon from '@mui/icons-material/DynamicForm'
import WidgetsIcon from '@mui/icons-material/Widgets'
import TableChartIcon from '@mui/icons-material/TableChart'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import SchemaIcon from '@mui/icons-material/Schema'
import AssessmentIcon from '@mui/icons-material/Assessment'
import SettingsIcon from '@mui/icons-material/Settings'
import NotificationsIcon from '@mui/icons-material/Notifications'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import FolderIcon from '@mui/icons-material/Folder'
import StorefrontIcon from '@mui/icons-material/Storefront'
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck'
import ErrorIcon from '@mui/icons-material/Error'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import BugReportIcon from '@mui/icons-material/BugReport'
import SecurityIcon from '@mui/icons-material/Security'
import ApiIcon from '@mui/icons-material/Api'
import StorageIcon from '@mui/icons-material/Storage'
import ExtensionIcon from '@mui/icons-material/Extension'
import SpeedIcon from '@mui/icons-material/Speed'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import SearchIcon from '@mui/icons-material/Search'
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew'
import BarChartIcon from '@mui/icons-material/BarChart'
import BrushIcon from '@mui/icons-material/Brush'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DownloadIcon from '@mui/icons-material/Download'
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined'
import ScienceIcon from '@mui/icons-material/Science'
import LiveTvIcon from '@mui/icons-material/LiveTv'
import GridOnIcon from '@mui/icons-material/GridOn'
import PostAddIcon from '@mui/icons-material/PostAdd'

/** Core product-style modules */
export const MODULE_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', navId: 'nav-link-dashboard', icon: DashboardIcon, permission: 'dashboard' },
  { label: 'Users', path: '/users', navId: 'nav-link-users', icon: PeopleIcon, permission: 'users' },
  { label: 'Products', path: '/products', navId: 'nav-link-products', icon: InventoryIcon, permission: 'products' },
  { label: 'Orders', path: '/orders', navId: 'nav-link-orders', icon: ShoppingCartIcon, permission: 'orders' },
  { label: 'Forms', path: '/forms', navId: 'nav-link-forms', icon: DynamicFormIcon, permission: 'forms' },
  { label: 'Tables', path: '/tables', navId: 'nav-link-tables', icon: TableChartIcon, permission: 'dashboard' },
  { label: 'Tree View', path: '/tree', navId: 'nav-link-tree', icon: AccountTreeIcon, permission: 'files' },
  { label: 'Workflow', path: '/workflow', navId: 'nav-link-workflow', icon: SchemaIcon, permission: 'workflow' },
  { label: 'Reports', path: '/reports', navId: 'nav-link-reports', icon: AssessmentIcon, permission: 'reports' },
  { label: 'Notifications', path: '/notifications', navId: 'nav-link-notifications', icon: NotificationsIcon, permission: 'dashboard' },
  { label: 'Calendar', path: '/calendar', navId: 'nav-link-calendar', icon: CalendarMonthIcon, permission: 'calendar' },
  { label: 'File Manager', path: '/files', navId: 'nav-link-files', icon: FolderIcon, permission: 'files' },
  { label: 'E-Commerce', path: '/ecommerce', navId: 'nav-link-ecommerce', icon: StorefrontIcon, permission: 'ecommerce' },
  { label: 'Search', path: '/search', navId: 'nav-link-search', icon: SearchIcon, permission: 'dashboard' },
  { label: 'Settings', path: '/settings', navId: 'nav-link-settings', icon: SettingsIcon, permission: 'dashboard' },
]

/** Interview / advanced automation practice modules */
export const ADVANCED_MODULE_ITEMS = [
  { label: 'Live Dashboard', path: '/dashboard-live', navId: 'nav-link-dashboard-live', icon: LiveTvIcon, permission: 'dashboard' },
  { label: 'Forms Advanced', path: '/forms-advanced', navId: 'nav-link-forms-advanced', icon: PostAddIcon, permission: 'forms' },
  { label: 'Advanced UI', path: '/advanced', navId: 'nav-link-advanced', icon: WidgetsIcon, permission: 'forms' },
  { label: 'Enterprise Tables', path: '/enterprise-tables', navId: 'nav-link-enterprise-tables', icon: GridOnIcon, permission: 'dashboard' },
  { label: 'Charts Gallery', path: '/charts', navId: 'nav-link-charts', icon: BarChartIcon, permission: 'dashboard' },
  { label: 'Canvas Lab', path: '/canvas', navId: 'nav-link-canvas', icon: BrushIcon, permission: 'dashboard' },
  { label: 'Uploads', path: '/uploads', navId: 'nav-link-uploads', icon: CloudUploadIcon, permission: 'files' },
  { label: 'Downloads', path: '/downloads', navId: 'nav-link-downloads', icon: DownloadIcon, permission: 'files' },
  { label: 'Auth Advanced', path: '/auth-advanced', navId: 'nav-link-auth-advanced', icon: SecurityIcon, permission: 'dashboard' },
  { label: 'API Simulation', path: '/api-sim', navId: 'nav-link-api-sim', icon: ApiIcon, permission: 'dashboard' },
  { label: 'Storage', path: '/storage', navId: 'nav-link-storage', icon: StorageIcon, permission: 'dashboard' },
  { label: 'Browser APIs', path: '/browser-apis', navId: 'nav-link-browser-apis', icon: ExtensionIcon, permission: 'dashboard' },
  { label: 'Admin', path: '/admin', navId: 'nav-link-admin', icon: AdminPanelSettingsIcon, permission: 'users' },
  { label: 'Accessibility', path: '/a11y', navId: 'nav-link-a11y', icon: AccessibilityNewIcon, permission: 'dashboard' },
  { label: 'Performance', path: '/performance', navId: 'nav-link-performance', icon: SpeedIcon, permission: 'dashboard' },
  { label: 'Network Sim', path: '/network', navId: 'nav-link-network', icon: NetworkCheckIcon, permission: 'dashboard' },
  { label: 'Error Pages', path: '/errors', navId: 'nav-link-errors', icon: ErrorIcon, permission: 'dashboard' },
  { label: 'AI Playground', path: '/ai', navId: 'nav-link-ai', icon: SmartToyIcon, permission: 'ai' },
  { label: 'Test Runner', path: '/test-runner', navId: 'nav-link-test-runner', icon: PlayCircleOutlinedIcon, permission: 'dashboard' },
  { label: 'Automation Lab', path: '/automation', navId: 'nav-link-automation', icon: BugReportIcon, permission: 'dashboard' },
  { label: 'Playground 100+', path: '/playground', navId: 'nav-link-playground', icon: ScienceIcon, permission: 'dashboard' },
]

/** Flat list for any callers that still expect NAV_ITEMS */
export const NAV_ITEMS = [...MODULE_ITEMS, ...ADVANCED_MODULE_ITEMS]

export const I18N = {
  en: {
    dashboard: 'Dashboard',
    welcome: 'Welcome back',
    logout: 'Logout',
    search: 'Search...',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
  },
  es: {
    dashboard: 'Panel',
    welcome: 'Bienvenido',
    logout: 'Cerrar sesión',
    search: 'Buscar...',
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    add: 'Añadir',
  },
  fr: {
    dashboard: 'Tableau de bord',
    welcome: 'Bon retour',
    logout: 'Déconnexion',
    search: 'Rechercher...',
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    add: 'Ajouter',
  },
}
