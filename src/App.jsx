// AI-ASSISTED: Cursor
// PROMPT: BrowserRouter basename for local (/) and GitHub Pages (/TestUi)
// ACCEPTED-BY: vignesh
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Provider, useSelector } from 'react-redux'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { SnackbarProvider } from 'notistack'
import { store } from './store'
import { createAppTheme } from './theme'
import { getRouterBasename } from './config/appBase'
import { ProtectedRoute } from './components/common/PageHeader'
import AppLayout from './layout/AppLayout'
import LoginPage from './pages/auth/LoginPage'
import { ForgotPasswordPage, OtpPage, MfaPage } from './pages/auth/AuthPages'
import DashboardPage from './pages/dashboard/DashboardPage'
import DashboardLivePage from './pages/dashboard-live/DashboardLivePage'
import UsersPage from './pages/users/UsersPage'
import ProductsPage from './pages/products/ProductsPage'
import OrdersPage from './pages/orders/OrdersPage'
import FormsPage from './pages/forms/FormsPage'
import FormsAdvancedPage from './pages/forms-advanced/FormsAdvancedPage'
import AdvancedPage from './pages/advanced/AdvancedPage'
import TablesPage from './pages/tables/TablesPage'
import EnterpriseTablesPage from './pages/enterprise-tables/EnterpriseTablesPage'
import TreePage from './pages/tree/TreePage'
import WorkflowPage from './pages/workflow/WorkflowPage'
import ReportsPage from './pages/reports/ReportsPage'
import SettingsPage from './pages/settings/SettingsPage'
import NotificationsPage from './pages/notifications/NotificationsPage'
import CalendarPage from './pages/calendar/CalendarPage'
import FilesPage from './pages/files/FilesPage'
import EcommercePage from './pages/ecommerce/EcommercePage'
import NetworkPage from './pages/network/NetworkPage'
import ErrorsPage, { NotFoundPage, ForbiddenPage } from './pages/errors/ErrorsPage'
import AiPage from './pages/ai/AiPage'
import AutomationPage from './pages/automation/AutomationPage'
import PlaygroundPage from './pages/playground/PlaygroundPage'
import AuthAdvancedPage from './pages/auth-advanced/AuthAdvancedPage'
import ApiSimPage from './pages/api-sim/ApiSimPage'
import StoragePage from './pages/storage/StoragePage'
import BrowserApisPage from './pages/browser-apis/BrowserApisPage'
import UploadsPage from './pages/uploads/UploadsPage'
import DownloadsPage from './pages/downloads/DownloadsPage'
import AdminPage from './pages/admin/AdminPage'
import SearchPage from './pages/search/SearchPage'
import A11yPage from './pages/a11y/A11yPage'
import PerformancePage from './pages/performance/PerformancePage'
import ChartsGalleryPage from './pages/charts-gallery/ChartsGalleryPage'
import CanvasLabPage from './pages/canvas-lab/CanvasLabPage'
import TestRunnerPage from './pages/test-runner/TestRunnerPage'


function ThemedApp() {
 const themeMode = useSelector((s) => s.ui.themeMode)
 const theme = createAppTheme(themeMode)
 const basename = getRouterBasename()


 return (
   <ThemeProvider theme={theme}>
     <CssBaseline />
     <SnackbarProvider maxSnack={4} autoHideDuration={3500} data-testid="snackbar-provider" id="snackbar-provider">
       <BrowserRouter basename={basename}>
         <Routes>
           <Route path="/login" element={<LoginPage />} />
           <Route path="/forgot-password" element={<ForgotPasswordPage />} />
           <Route path="/otp" element={<OtpPage />} />
           <Route path="/mfa" element={<MfaPage />} />


           <Route
             element={(
               <ProtectedRoute>
                 <AppLayout />
               </ProtectedRoute>
             )}
           >
             <Route path="/" element={<Navigate to="/dashboard" replace />} />
             <Route path="/dashboard" element={<ProtectedRoute permission="dashboard"><DashboardPage /></ProtectedRoute>} />
             <Route path="/dashboard-live" element={<DashboardLivePage />} />
             <Route path="/users" element={<ProtectedRoute permission="users"><UsersPage /></ProtectedRoute>} />
             <Route path="/products" element={<ProtectedRoute permission="products"><ProductsPage /></ProtectedRoute>} />
             <Route path="/orders" element={<ProtectedRoute permission="orders"><OrdersPage /></ProtectedRoute>} />
             <Route path="/forms" element={<FormsPage />} />
             <Route path="/forms-advanced" element={<FormsAdvancedPage />} />
             <Route path="/advanced" element={<AdvancedPage />} />
             <Route path="/tables" element={<TablesPage />} />
             <Route path="/enterprise-tables" element={<EnterpriseTablesPage />} />
             <Route path="/tree" element={<TreePage />} />
             <Route path="/workflow" element={<ProtectedRoute permission="workflow"><WorkflowPage /></ProtectedRoute>} />
             <Route path="/reports" element={<ProtectedRoute permission="reports"><ReportsPage /></ProtectedRoute>} />
             <Route path="/charts" element={<ChartsGalleryPage />} />
             <Route path="/canvas" element={<CanvasLabPage />} />
             <Route path="/uploads" element={<UploadsPage />} />
             <Route path="/downloads" element={<DownloadsPage />} />
             <Route path="/settings" element={<SettingsPage />} />
             <Route path="/notifications" element={<NotificationsPage />} />
             <Route path="/calendar" element={<ProtectedRoute permission="calendar"><CalendarPage /></ProtectedRoute>} />
             <Route path="/files" element={<ProtectedRoute permission="files"><FilesPage /></ProtectedRoute>} />
             <Route path="/ecommerce/*" element={<ProtectedRoute permission="ecommerce"><EcommercePage /></ProtectedRoute>} />
             <Route path="/auth-advanced" element={<AuthAdvancedPage />} />
             <Route path="/api-sim" element={<ApiSimPage />} />
             <Route path="/storage" element={<StoragePage />} />
             <Route path="/browser-apis" element={<BrowserApisPage />} />
             <Route path="/search" element={<SearchPage />} />
             <Route path="/admin" element={<ProtectedRoute permission="users"><AdminPage /></ProtectedRoute>} />
             <Route path="/a11y" element={<A11yPage />} />
             <Route path="/performance" element={<PerformancePage />} />
             <Route path="/network" element={<NetworkPage />} />
             <Route path="/errors/*" element={<ErrorsPage />} />
             <Route path="/ai" element={<ProtectedRoute permission="ai"><AiPage /></ProtectedRoute>} />
             <Route path="/automation" element={<AutomationPage />} />
             <Route path="/test-runner" element={<TestRunnerPage />} />
             <Route path="/playground" element={<PlaygroundPage />} />
             <Route path="/errors/403" element={<ForbiddenPage />} />
           </Route>


           <Route path="*" element={<NotFoundPage />} />
         </Routes>
       </BrowserRouter>
     </SnackbarProvider>
   </ThemeProvider>
 )
}

export default function App() {
 return (
   <Provider store={store}>
     <ThemedApp />
   </Provider>
 )
}
