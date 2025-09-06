# 📚 API Documentation

## 🌐 Base URL
```
Production: https://agri-gear-manager.vercel.app
Development: http://localhost:3000
```

## 🔐 Authentication

All API requests require authentication via Supabase JWT tokens.

### Headers
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

## 📊 Endpoints

### 🔧 Equipment Management

#### Get All Equipment
```http
GET /api/equipment
```

**Query Parameters:**
- `search` (string, optional): Search by equipment name
- `category` (string, optional): Filter by category
- `condition` (string, optional): Filter by condition
- `status` (string, optional): Filter by status

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Traktor Kubota L3301",
      "brand": "Kubota",
      "model": "L3301",
      "purchase_year": 2023,
      "condition": "Baik",
      "category": "Alat Berat",
      "status": "Tersedia",
      "photo_urls": ["https://..."],
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "count": 10
}
```

#### Get Equipment by ID
```http
GET /api/equipment/{id}
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "name": "Traktor Kubota L3301",
    "brand": "Kubota",
    "model": "L3301",
    "purchase_year": 2023,
    "condition": "Baik",
    "category": "Alat Berat",
    "status": "Tersedia",
    "photo_urls": ["https://..."],
    "created_at": "2024-01-01T00:00:00Z",
    "spare_parts": [...],
    "costs": [...],
    "maintenance_history": [...]
  }
}
```

#### Create Equipment
```http
POST /api/equipment
```

**Request Body:**
```json
{
  "name": "Traktor Kubota L3301",
  "brand": "Kubota",
  "model": "L3301",
  "purchase_year": 2023,
  "condition": "Baik",
  "category": "Alat Berat"
}
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "name": "Traktor Kubota L3301",
    "created_at": "2024-01-01T00:00:00Z"
  },
  "message": "Equipment created successfully"
}
```

#### Update Equipment
```http
PUT /api/equipment/{id}
```

**Request Body:** Same as create, all fields optional

#### Delete Equipment
```http
DELETE /api/equipment/{id}
```

**Response:**
```json
{
  "message": "Equipment deleted successfully"
}
```

### 📦 Borrowing Requests

#### Get All Requests
```http
GET /api/borrowing-requests
```

**Query Parameters:**
- `status` (string, optional): Filter by status
- `user_id` (string, optional): Filter by user
- `equipment_id` (string, optional): Filter by equipment

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "equipment_id": "uuid",
      "start_date": "2024-01-01",
      "end_date": "2024-01-07",
      "purpose": "Pengolahan tanah",
      "status": "Tertunda",
      "created_at": "2024-01-01T00:00:00Z",
      "user": {
        "full_name": "John Doe",
        "email": "john@example.com"
      },
      "equipment": {
        "name": "Traktor Kubota L3301",
        "category": "Alat Berat"
      }
    }
  ]
}
```

#### Create Borrowing Request
```http
POST /api/borrowing-requests
```

**Request Body:**
```json
{
  "equipment_id": "uuid",
  "start_date": "2024-01-01",
  "end_date": "2024-01-07",
  "purpose": "Pengolahan tanah"
}
```

#### Update Request Status
```http
PATCH /api/borrowing-requests/{id}/status
```

**Request Body:**
```json
{
  "status": "Disetujui", // or "Ditolak", "Dikembalikan"
  "admin_notes": "Optional admin notes"
}
```

### 🔧 Maintenance Schedules

#### Get All Schedules
```http
GET /api/maintenance-schedules
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "equipment_id": "uuid",
      "due_date": "2024-01-15",
      "description": "Servis rutin bulanan",
      "status": "Dijadwalkan",
      "created_at": "2024-01-01T00:00:00Z",
      "equipment": {
        "name": "Traktor Kubota L3301"
      }
    }
  ]
}
```

#### Create Maintenance Schedule
```http
POST /api/maintenance-schedules
```

**Request Body:**
```json
{
  "equipment_id": "uuid",
  "due_date": "2024-01-15",
  "description": "Servis rutin bulanan"
}
```

#### Update Schedule Status
```http
PATCH /api/maintenance-schedules/{id}/status
```

**Request Body:**
```json
{
  "status": "Selesai", // or "Dibatalkan"
  "completion_notes": "Optional completion notes"
}
```

### 🔩 Spare Parts

#### Get Spare Parts by Equipment
```http
GET /api/equipment/{equipment_id}/spare-parts
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "equipment_id": "uuid",
      "name": "Filter Oli",
      "specification": "15208-65F0C",
      "stock": 5,
      "stock_threshold": 2,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Create Spare Part
```http
POST /api/spare-parts
```

**Request Body:**
```json
{
  "equipment_id": "uuid",
  "name": "Filter Oli",
  "specification": "15208-65F0C",
  "stock": 5,
  "stock_threshold": 2
}
```

#### Update Spare Part Stock
```http
PATCH /api/spare-parts/{id}/stock
```

**Request Body:**
```json
{
  "quantity": 3, // positive to add, negative to subtract
  "notes": "Optional notes for stock change"
}
```

### 💰 Cost Management

#### Get Costs by Equipment
```http
GET /api/equipment/{equipment_id}/costs
```

**Query Parameters:**
- `cost_type` (string, optional): Filter by cost type
- `start_date` (string, optional): Filter from date
- `end_date` (string, optional): Filter to date

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "equipment_id": "uuid",
      "description": "Ganti oli mesin",
      "cost_type": "Maintenance",
      "amount": 150000,
      "date": "2024-01-01",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total_amount": 150000
}
```

#### Create Cost Entry
```http
POST /api/costs
```

**Request Body:**
```json
{
  "equipment_id": "uuid",
  "description": "Ganti oli mesin",
  "cost_type": "Maintenance",
  "amount": 150000,
  "date": "2024-01-01"
}
```

### 👥 User Management

#### Get All Users (Admin only)
```http
GET /api/users
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "full_name": "John Doe",
      "email": "john@example.com",
      "role": "member",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Update User Role (Admin only)
```http
PATCH /api/users/{id}/role
```

**Request Body:**
```json
{
  "role": "admin" // or "member"
}
```

### 📊 Analytics & Reports

#### Get Dashboard Statistics
```http
GET /api/analytics/dashboard
```

**Response:**
```json
{
  "data": {
    "total_equipment": 25,
    "borrowed_equipment": 8,
    "available_equipment": 15,
    "maintenance_equipment": 2,
    "pending_requests": 5,
    "upcoming_maintenance": 3,
    "total_users": 12,
    "popular_equipment": [
      {
        "name": "Traktor Kubota L3301",
        "usage_count": 15
      }
    ],
    "recent_activities": [...]
  }
}
```

#### Export Data
```http
GET /api/export/{type}
```

**Path Parameters:**
- `type`: `equipment` | `borrowing` | `maintenance` | `costs`

**Query Parameters:**
- `format`: `excel` | `pdf`
- `start_date` (optional): Filter from date
- `end_date` (optional): Filter to date

**Response:** File download

## 🚫 Error Responses

### Error Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "name",
      "issue": "Name is required"
    }
  }
}
```

### Common Error Codes
- `VALIDATION_ERROR` (400): Invalid input data
- `UNAUTHORIZED` (401): Authentication required
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `CONFLICT` (409): Resource conflict
- `INTERNAL_ERROR` (500): Server error

## 📝 Rate Limiting

- **General APIs**: 100 requests per minute per user
- **Export APIs**: 10 requests per minute per user
- **Upload APIs**: 20 requests per minute per user

## 🔒 Permissions

### Admin Permissions
- ✅ All CRUD operations on equipment
- ✅ Approve/reject borrowing requests
- ✅ Manage maintenance schedules
- ✅ User management
- ✅ Access all analytics
- ✅ Export all data

### Member Permissions
- ✅ View equipment catalog
- ✅ Create borrowing requests
- ✅ View own borrowing history
- ✅ Basic dashboard statistics
- ❌ Cannot modify equipment
- ❌ Cannot access user management

## 📚 SDKs & Examples

### JavaScript/TypeScript
```javascript
// Using Supabase client
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'your-project-url',
  'your-anon-key'
)

// Get equipment
const { data, error } = await supabase
  .from('equipment')
  .select('*')
  .eq('status', 'Tersedia')
```

### cURL Examples
```bash
# Get equipment
curl -X GET "https://agri-gear-manager.vercel.app/api/equipment" \
  -H "Authorization: Bearer your-jwt-token"

# Create borrowing request
curl -X POST "https://agri-gear-manager.vercel.app/api/borrowing-requests" \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "equipment_id": "uuid",
    "start_date": "2024-01-01",
    "end_date": "2024-01-07",
    "purpose": "Pengolahan tanah"
  }'
```

## 📞 Support

For API support, please contact:
- 📧 **Email**: [api-support@agri-gear-manager.com](mailto:api-support@agri-gear-manager.com)
- 📚 **Documentation**: [GitHub Wiki](https://github.com/nopianpdlh/agri-gear-manager/wiki)
- 🐛 **Issues**: [GitHub Issues](https://github.com/nopianpdlh/agri-gear-manager/issues)
