# Laravel Working Flow

## Backend which Needs to be Done

### 1. Users
- Fields: **Name, Email, Phone, Password**
- Authentication & authorization

### 2. Services
- CRUD operations for services
- Service categories (optional)
- Status (Active/Inactive)

### 3. Projects
- Project details (title, description, image, status)
- Relation with services (optional)
- CRUD operations

### 4. Members
- Member profile (Name, Position, Image, Social Links)
- Team grouping (optional)
- CRUD operations

### 5. FAQs
- Question
- Answer
- Status (Published/Draft)

### 6. Career
- Job title
- Description
- Requirements
- Application form (optional)
- Status

### 7. Contacts
- Contact form submissions (Name, Email, Phone, Message)
- Admin panel view & reply option

### 8. Settings
- Site information (Logo, Title, Description, Footer text)
- Social media links
- Contact info
- SEO settings

---

 **Next Steps**  
1. Create Laravel models, migrations, and controllers for each module.  
2. Use resource routes (`Route::resource`) for CRUD where applicable.  
3. Implement authentication (Laravel Breeze/Jetstream).  
4. Create Admin Panel for managing data.  
5. Use validation rules for forms.  
6. Add soft deletes and timestamps for important models.  
