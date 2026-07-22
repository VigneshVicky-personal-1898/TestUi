// AI-ASSISTED: Cursor
// PROMPT: Mock seed data for users, products, orders, notifications, files, workflows
// ACCEPTED-BY: vignesh

export const DEMO_USERS = [
  { id: '1', email: 'admin@gmail.com', password: 'admin@123', name: 'Admin User', role: 'admin', department: 'IT', status: 'active', avatar: '', phone: '+1-555-0101', createdAt: '2024-01-15' },
  { id: '2', email: 'manager@testui.com', password: 'Manager@123', name: 'Sarah Manager', role: 'manager', department: 'Sales', status: 'active', avatar: '', phone: '+1-555-0102', createdAt: '2024-02-20' },
  { id: '3', email: 'employee@testui.com', password: 'Employee@123', name: 'John Employee', role: 'employee', department: 'Engineering', status: 'active', avatar: '', phone: '+1-555-0103', createdAt: '2024-03-10' },
  { id: '4', email: 'viewer@testui.com', password: 'Viewer@123', name: 'Jane Viewer', role: 'viewer', department: 'Support', status: 'active', avatar: '', phone: '+1-555-0104', createdAt: '2024-04-05' },
]

export const ROLES = ['admin', 'manager', 'employee', 'viewer']

export const ROLE_PERMISSIONS = {
  admin: ['*'],
  manager: ['dashboard', 'users:read', 'users:write', 'products', 'orders', 'reports', 'workflow', 'calendar', 'files', 'ecommerce', 'ai'],
  employee: ['dashboard', 'products:read', 'orders', 'forms', 'calendar', 'files:read', 'ecommerce', 'ai'],
  viewer: ['dashboard', 'products:read', 'orders:read', 'reports:read'],
}

const firstNames = ['Alice', 'Bob', 'Carol', 'David', 'Emma', 'Frank', 'Grace', 'Henry', 'Iris', 'Jack', 'Karen', 'Leo', 'Mia', 'Noah', 'Olivia', 'Paul', 'Quinn', 'Rachel', 'Sam', 'Tina']
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez']
const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Support', 'Operations', 'Legal']
const statuses = ['active', 'inactive', 'pending', 'suspended']

export function generateUsers(count = 57) {
  return Array.from({ length: count }, (_, i) => ({
    id: String(i + 10),
    name: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
    email: `user${i + 1}@testui.com`,
    role: ROLES[i % ROLES.length],
    department: departments[i % departments.length],
    status: statuses[i % statuses.length],
    phone: `+1-555-${String(1000 + i).padStart(4, '0')}`,
    createdAt: `2024-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
  }))
}

export const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Toys', 'Beauty', 'Automotive']

const productNames = [
  'Wireless Headphones', 'Smart Watch', 'Laptop Stand', 'USB-C Hub', 'Mechanical Keyboard',
  'Ergonomic Mouse', 'Monitor Arm', 'Webcam HD', 'Desk Lamp', 'Phone Case',
  'Bluetooth Speaker', 'Power Bank', 'Tablet Sleeve', 'Cable Organizer', 'Gaming Chair',
]

export function generateProducts(count = 48) {
  return Array.from({ length: count }, (_, i) => ({
    id: String(i + 1),
    name: `${productNames[i % productNames.length]} ${i + 1}`,
    sku: `SKU-${1000 + i}`,
    category: CATEGORIES[i % CATEGORIES.length],
    price: Number((19.99 + (i % 20) * 15.5).toFixed(2)),
    stock: (i * 7) % 200,
    status: i % 5 === 0 ? 'out_of_stock' : i % 3 === 0 ? 'draft' : 'active',
    image: `https://picsum.photos/seed/prod${i}/200/200`,
    description: `High quality ${productNames[i % productNames.length].toLowerCase()} for everyday use.`,
    tags: [CATEGORIES[i % CATEGORIES.length], i % 2 === 0 ? 'featured' : 'new'],
    createdAt: `2024-${String((i % 12) + 1).padStart(2, '0')}-15`,
  }))
}

const orderStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']

export function generateOrders(count = 42) {
  return Array.from({ length: count }, (_, i) => ({
    id: `ORD-${2024000 + i}`,
    customer: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
    email: `customer${i + 1}@email.com`,
    total: Number((49.99 + (i % 15) * 32.5).toFixed(2)),
    status: orderStatuses[i % orderStatuses.length],
    items: [
      { id: 1, name: productNames[i % productNames.length], qty: (i % 3) + 1, price: 29.99 },
      { id: 2, name: productNames[(i + 1) % productNames.length], qty: 1, price: 49.99 },
    ],
    timeline: [
      { status: 'pending', date: `2024-06-${String((i % 20) + 1).padStart(2, '0')} 09:00`, note: 'Order placed' },
      { status: 'processing', date: `2024-06-${String((i % 20) + 1).padStart(2, '0')} 11:30`, note: 'Payment confirmed' },
      ...(i % 3 !== 0 ? [{ status: 'shipped', date: `2024-06-${String((i % 20) + 2).padStart(2, '0')} 14:00`, note: 'Dispatched via FedEx' }] : []),
      ...(i % 4 === 0 ? [{ status: 'delivered', date: `2024-06-${String((i % 20) + 4).padStart(2, '0')} 16:00`, note: 'Delivered to customer' }] : []),
    ],
    createdAt: `2024-06-${String((i % 28) + 1).padStart(2, '0')}`,
    shippingAddress: `${100 + i} Main St, City ${i % 10}, ST ${10000 + i}`,
  }))
}

export function generateNotifications(count = 30) {
  const types = ['info', 'success', 'warning', 'error']
  const titles = [
    'New order received', 'User registered', 'Stock low alert', 'Payment processed',
    'System update', 'Report ready', 'Approval needed', 'File uploaded',
  ]
  return Array.from({ length: count }, (_, i) => ({
    id: String(i + 1),
    title: titles[i % titles.length],
    message: `Notification detail for ${titles[i % titles.length].toLowerCase()} #${i + 1}`,
    type: types[i % types.length],
    read: i > 8,
    createdAt: new Date(Date.now() - i * 3600000).toISOString(),
  }))
}

export function generateActivity(count = 20) {
  const actions = ['created user', 'updated product', 'placed order', 'exported report', 'changed settings', 'uploaded file']
  return Array.from({ length: count }, (_, i) => ({
    id: String(i + 1),
    user: firstNames[i % firstNames.length],
    action: actions[i % actions.length],
    target: `#${1000 + i}`,
    timestamp: new Date(Date.now() - i * 1800000).toISOString(),
  }))
}

export const FILE_TREE = [
  {
    id: 'root-docs',
    name: 'Documents',
    type: 'folder',
    children: [
      { id: 'doc-1', name: 'Q1 Report.pdf', type: 'file', size: '2.4 MB', modified: '2024-06-01' },
      { id: 'doc-2', name: 'Budget.xlsx', type: 'file', size: '1.1 MB', modified: '2024-06-05' },
      {
        id: 'root-contracts',
        name: 'Contracts',
        type: 'folder',
        children: [
          { id: 'doc-3', name: 'Vendor Agreement.pdf', type: 'file', size: '890 KB', modified: '2024-05-20' },
          { id: 'doc-4', name: 'NDA.docx', type: 'file', size: '120 KB', modified: '2024-05-15' },
        ],
      },
    ],
  },
  {
    id: 'root-images',
    name: 'Images',
    type: 'folder',
    children: [
      { id: 'img-1', name: 'logo.png', type: 'file', size: '45 KB', modified: '2024-04-10' },
      { id: 'img-2', name: 'banner.jpg', type: 'file', size: '320 KB', modified: '2024-04-12' },
    ],
  },
  {
    id: 'root-projects',
    name: 'Projects',
    type: 'folder',
    children: [
      {
        id: 'proj-alpha',
        name: 'Project Alpha',
        type: 'folder',
        children: [
          { id: 'pa-1', name: 'spec.md', type: 'file', size: '18 KB', modified: '2024-06-10' },
          { id: 'pa-2', name: 'design.fig', type: 'file', size: '5.2 MB', modified: '2024-06-11' },
        ],
      },
    ],
  },
]

export const WORKFLOWS = [
  { id: 'wf-1', name: 'Leave Approval', status: 'active', nodes: 5, updatedAt: '2024-06-01' },
  { id: 'wf-2', name: 'Purchase Request', status: 'active', nodes: 7, updatedAt: '2024-06-05' },
  { id: 'wf-3', name: 'Employee Onboarding', status: 'draft', nodes: 9, updatedAt: '2024-06-10' },
  { id: 'wf-4', name: 'Expense Reimbursement', status: 'active', nodes: 4, updatedAt: '2024-05-28' },
]

export const CALENDAR_EVENTS = [
  { id: '1', title: 'Team Standup', start: '2026-07-21T09:00:00', end: '2026-07-21T09:30:00', color: '#1976d2' },
  { id: '2', title: 'Product Demo', start: '2026-07-22T14:00:00', end: '2026-07-22T15:00:00', color: '#2e7d32' },
  { id: '3', title: 'Sprint Planning', start: '2026-07-23T10:00:00', end: '2026-07-23T12:00:00', color: '#ed6c02' },
  { id: '4', title: 'Client Meeting', start: '2026-07-24T11:00:00', end: '2026-07-24T12:00:00', color: '#9c27b0' },
  { id: '5', title: 'All Hands', start: '2026-07-25T16:00:00', end: '2026-07-25T17:00:00', color: '#d32f2f' },
]

export const ECOM_PRODUCTS = generateProducts(12).map((p) => ({
  ...p,
  rating: 3 + (Number(p.id) % 3),
  reviews: 10 + Number(p.id) * 3,
}))

export const KPI_DATA = [
  { label: 'Total Revenue', value: '$128,450', change: '+12.5%', trend: 'up' },
  { label: 'Active Users', value: '3,842', change: '+8.2%', trend: 'up' },
  { label: 'Orders', value: '1,256', change: '-2.1%', trend: 'down' },
  { label: 'Conversion', value: '3.24%', change: '+0.4%', trend: 'up' },
]

export const CHART_SALES = [
  { month: 'Jan', sales: 4000, orders: 240, users: 180 },
  { month: 'Feb', sales: 3000, orders: 198, users: 210 },
  { month: 'Mar', sales: 5000, orders: 320, users: 250 },
  { month: 'Apr', sales: 4780, orders: 290, users: 280 },
  { month: 'May', sales: 5890, orders: 380, users: 310 },
  { month: 'Jun', sales: 6390, orders: 410, users: 340 },
  { month: 'Jul', sales: 7200, orders: 450, users: 380 },
]

export const SUGGESTIONS = [
  'Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape', 'Honeydew',
  'Iceberg', 'Jackfruit', 'Kiwi', 'Lemon', 'Mango', 'Nectarine', 'Orange', 'Papaya',
  'Quince', 'Raspberry', 'Strawberry', 'Tangerine', 'Ugli', 'Vanilla', 'Watermelon',
]
