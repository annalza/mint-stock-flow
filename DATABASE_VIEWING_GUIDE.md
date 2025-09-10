# Database Viewing Guide - HTTM ERP System

## How to View and Monitor Database Changes

### 1. Access Supabase Dashboard
- Visit: https://supabase.com/dashboard/project/qiazkluyvucsgrztceda
- Login with your Supabase account

### 2. View Tables and Data

#### Table Editor
- Navigate to: https://supabase.com/dashboard/project/qiazkluyvucsgrztceda/editor
- You'll see all your tables under the `httm` schema:
  - `httm.items` - Inventory items
  - `httm.recipes` - Recipe definitions
  - `httm.recipe_items` - Recipe ingredients
  - `httm.procurements` - Procurement requests

#### SQL Editor
- Navigate to: https://supabase.com/dashboard/project/qiazkluyvucsgrztceda/sql/new
- Run custom queries to view data:

```sql
-- View all items
SELECT * FROM httm.items ORDER BY created_at DESC;

-- View all procurement requests with status
SELECT * FROM httm.procurements ORDER BY created_at DESC;

-- View recipe details with ingredients
SELECT r.name as recipe_name, i.name as ingredient, ri.quantity, ri.unit
FROM httm.recipes r
JOIN httm.recipe_items ri ON r.id = ri.recipe_id
JOIN httm.items i ON ri.item_id = i.id
ORDER BY r.name, ri.quantity DESC;
```

### 3. Monitor Real-time Changes

#### Database Logs
- Navigate to: https://supabase.com/dashboard/project/qiazkluyvucsgrztceda/logs/postgres-logs
- Monitor all database activity and changes

#### Real-time Subscriptions
You can add real-time monitoring to your frontend:

```typescript
// Example: Monitor inventory changes
const subscription = supabase
  .channel('inventory-changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'httm',
      table: 'items'
    },
    (payload) => {
      console.log('Inventory change:', payload);
    }
  )
  .subscribe();
```

### 4. Database Schema Information

#### Auto-Generated Item Codes
- Item codes are automatically generated using the format `ITM001`, `ITM002`, etc.
- The `httm.generate_item_code()` function ensures uniqueness

#### Key Features Implemented
1. **Unique Item Codes**: Auto-generated and unique
2. **Stock Management**: Issue/Receive with user input dialogs
3. **Edit Functionality**: Full item editing capability
4. **Admin Approval**: Procurement requests require admin approval
5. **Status Tracking**: Pending, Approved, Rejected statuses

### 5. Testing Changes

1. **Add New Item**: Check if code auto-generates
2. **Issue/Receive Stock**: Test the input dialogs
3. **Edit Items**: Verify all fields can be updated
4. **Submit Procurement**: Test the approval workflow
5. **Admin Actions**: Test approve/reject functionality

### 6. Data Backup & Export

#### Export Data
```sql
-- Export items to CSV
COPY (SELECT * FROM httm.items) TO '/tmp/items.csv' WITH CSV HEADER;

-- Export procurement requests
COPY (SELECT * FROM httm.procurements) TO '/tmp/procurements.csv' WITH CSV HEADER;
```

### 7. Performance Monitoring

#### Database Performance
- Navigate to: https://supabase.com/dashboard/project/qiazkluyvucsgrztceda/reports/database
- Monitor query performance and database usage

#### API Logs
- Navigate to: https://supabase.com/dashboard/project/qiazkluyvucsgrztceda/logs/api-logs
- Track all API calls and responses

### 8. Security & Access

#### Row Level Security (RLS)
All tables have RLS enabled with public access policies for this demo.
For production, implement user-specific policies:

```sql
-- Example user-specific policy
CREATE POLICY "Users can only see their own data"
ON httm.procurements
FOR ALL
USING (auth.uid() = user_id);
```

---

**Important**: Changes made in the frontend will be reflected in the database immediately. Use the Supabase dashboard to verify all CRUD operations are working correctly.