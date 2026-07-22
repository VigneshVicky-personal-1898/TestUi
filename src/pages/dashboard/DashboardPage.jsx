// AI-ASSISTED: Cursor
// PROMPT: Clean Soft UI Dashboard KPI cards with teal accents
// ACCEPTED-BY: vignesh
import { useSelector } from 'react-redux'
import {
  Box, Grid, Card, CardContent, Typography, Table, TableBody, TableCell,
  TableHead, TableRow, Chip, List, ListItem, ListItemText, Avatar, Stack, useTheme,
} from '@mui/material'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell,
} from 'recharts'
import { PageHeader } from '../../components/common/PageHeader'
import { KPI_DATA, CHART_SALES, generateActivity } from '../../data/mockData'
import { aid, dyn } from '../../utils/automation'

const PIE_COLORS = ['#0d9488', '#0284c7', '#16a34a', '#ca8a04', '#7c3aed']
const KPI_ICONS = [
  PeopleAltOutlinedIcon,
  ShoppingCartOutlinedIcon,
  AttachMoneyOutlinedIcon,
  Inventory2OutlinedIcon,
]
const activity = generateActivity(8)

export default function DashboardPage() {
  const theme = useTheme()
  const orders = useSelector((s) => s.data.orders).slice(0, 5)
  const users = useSelector((s) => s.data.users)
  const insetSm = theme.customShadows?.neuInsetSm
  const pieData = [
    { name: 'Active', value: users.filter((u) => u.status === 'active').length },
    { name: 'Inactive', value: users.filter((u) => u.status === 'inactive').length },
    { name: 'Pending', value: users.filter((u) => u.status === 'pending').length },
    { name: 'Suspended', value: users.filter((u) => u.status === 'suspended').length },
  ]
  const gridStroke = theme.palette.mode === 'light' ? 'rgba(55,65,81,0.1)' : 'rgba(255,255,255,0.1)'

  return (
    <Box {...aid('dashboard-page')}>
      <PageHeader pageId="dashboard" title="Dashboard" subtitle="Overview of key metrics and recent activity" breadcrumbs={['Dashboard']} />

      <Grid container spacing={2} sx={{ mb: 3 }} {...aid('kpi-cards')}>
        {KPI_DATA.map((kpi, idx) => {
          const Icon = KPI_ICONS[idx % KPI_ICONS.length]
          return (
            <Grid key={kpi.label} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card {...aid(dyn('kpi', kpi.label))} sx={{ height: '100%' }}>
                <CardContent sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      display: 'grid',
                      placeItems: 'center',
                      color: 'primary.main',
                      boxShadow: insetSm,
                      flexShrink: 0,
                    }}
                  >
                    <Icon fontSize="small" />
                  </Box>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>{kpi.label}</Typography>
                    <Typography variant="h4" fontWeight={700} sx={{ my: 0.25, lineHeight: 1.15 }}>{kpi.value}</Typography>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      {kpi.trend === 'up' ? <TrendingUpIcon color="success" fontSize="small" /> : <TrendingDownIcon color="error" fontSize="small" />}
                      <Typography variant="caption" color={kpi.trend === 'up' ? 'success.main' : 'error.main'} fontWeight={650}>
                        {kpi.change} vs last month
                      </Typography>
                    </Stack>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card {...aid('sales-chart-card')}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>Sales Overview</Typography>
              <Box sx={{ height: 280 }} {...aid('sales-line-chart')}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={CHART_SALES}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                    <XAxis dataKey="month" stroke={theme.palette.text.secondary} />
                    <YAxis stroke={theme.palette.text.secondary} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="sales" stroke="#0d9488" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="orders" stroke="#0284c7" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card {...aid('users-pie-card')} sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>User Status</Typography>
              <Box sx={{ height: 240 }} {...aid('users-pie-chart')}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card {...aid('bar-chart-card')}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>Monthly Users</Typography>
              <Box sx={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={CHART_SALES}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                    <XAxis dataKey="month" stroke={theme.palette.text.secondary} />
                    <YAxis stroke={theme.palette.text.secondary} />
                    <Tooltip />
                    <Bar dataKey="users" fill="#0d9488" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card {...aid('recent-orders-card')}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>Recent Orders</Typography>
              <Table size="small" {...aid('recent-orders-table')}>
                <TableHead>
                  <TableRow>
                    <TableCell>Order</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((o) => (
                    <TableRow key={o.id} hover {...aid(dyn('order-row', o.id))}>
                      <TableCell>{o.id}</TableCell>
                      <TableCell>{o.customer}</TableCell>
                      <TableCell>
                        <Chip label={o.status} size="small" color={o.status === 'delivered' ? 'success' : 'default'} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card {...aid('recent-activity-card')}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>Recent Activity</Typography>
              <List dense {...aid('activity-list')}>
                {activity.map((a) => (
                  <ListItem key={a.id} {...aid(dyn('activity', a.id))} sx={{ px: 0 }}>
                    <Avatar sx={{ width: 28, height: 28, mr: 1.5, fontSize: 12, bgcolor: 'primary.main', fontWeight: 700 }}>
                      {a.user[0]}
                    </Avatar>
                    <ListItemText
                      primary={`${a.user} ${a.action} ${a.target}`}
                      secondary={new Date(a.timestamp).toLocaleString()}
                      primaryTypographyProps={{ variant: 'body2', fontWeight: 550 }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
