# Frontend Integration Guide for LinkVentory

## 🔗 Backend API Endpoints

Your backend provides these endpoints:

### Authentication
- `POST /signup` - Register new user
- `POST /login` - Login user
- `GET /me` - Get current user info
- `GET /stats` - Get dashboard stats (user + counts)

### Categories
- `GET /categories` - Get all user categories
- `POST /categories` - Create new category
- `PUT /categories/{id}` - Update category
- `DELETE /categories/{id}` - Delete category

### Links
- `GET /links` - Get all user links
- `GET /links?category_id={id}` - Get links filtered by category
- `GET /links/category/{id}` - Get links by category
- `POST /links` - Create new link
- `PATCH /links/{id}` - Update link
- `DELETE /links/{id}` - Delete link

## 🎯 Frontend Changes Needed

### 1. Replace Dummy Data in Dashboard

**Current (dummy):**
```javascript
// Welcome Fatima (hardcoded)
// 5 categories (fake)
// 12 links (fake)
```

**New (API-driven):**
```javascript
import { loadDashboardData } from './api.js';

const dashboard = await loadDashboardData();

// Update UI with real data:
document.querySelector('.welcome').textContent = `Welcome ${dashboard.user.name}`;
document.querySelector('.categories-count').textContent = dashboard.totalCategories;
document.querySelector('.links-count').textContent = dashboard.totalLinks;
```

### 2. Add Authentication Flow

**Login Page:**
```javascript
import { authAPI } from './api.js';

const handleLogin = async (email, password) => {
    try {
        await authAPI.login(email, password);
        window.location.href = '/dashboard';
    } catch (error) {
        showError('Invalid credentials');
    }
};
```

**Protected Routes:**
```javascript
import { isAuthenticated } from './api.js';

// Check auth on page load
if (!isAuthenticated()) {
    window.location.href = '/login';
}
```

### 3. Dynamic Categories List

**Replace static categories with:**
```javascript
import { categoriesAPI } from './api.js';

const loadCategories = async () => {
    const categories = await categoriesAPI.getAll();
    const categoriesList = document.querySelector('.categories-list');
    
    categoriesList.innerHTML = categories.map(cat => `
        <div class="category-item" data-id="${cat.id}">
            <span>${cat.name}</span>
            <button onclick="editCategory('${cat.id}')">Edit</button>
            <button onclick="deleteCategory('${cat.id}')">Delete</button>
        </div>
    `).join('');
};
```

### 4. Dynamic Links List

**Replace static links with:**
```javascript
import { linksAPI } from './api.js';

const loadLinks = async (categoryId = null) => {
    const links = categoryId 
        ? await linksAPI.getByCategory(categoryId)
        : await linksAPI.getAll();
    
    const linksList = document.querySelector('.links-list');
    
    linksList.innerHTML = links.map(link => `
        <div class="link-item" data-id="${link.id}">
            <a href="${link.url}" target="_blank">${link.title}</a>
            <p>${link.note}</p>
            <button onclick="editLink('${link.id}')">Edit</button>
            <button onclick="deleteLink('${link.id}')">Delete</button>
        </div>
    `).join('');
};
```

### 5. Add New Link Functionality

```javascript
import { linksAPI } from './api.js';

const handleAddLink = async (linkData) => {
    try {
        await linksAPI.create({
            url: linkData.url,
            title: linkData.title,
            note: linkData.note,
            category_id: linkData.categoryId
        });
        
        // Refresh links list
        await loadLinks();
        showSuccess('Link added successfully!');
    } catch (error) {
        showError('Failed to add link');
    }
};
```

### 6. Edit/Delete Functionality

```javascript
// Edit link
const editLink = async (linkId, newData) => {
    try {
        await linksAPI.update(linkId, newData);
        await loadLinks();
        showSuccess('Link updated!');
    } catch (error) {
        showError('Failed to update link');
    }
};

// Delete link
const deleteLink = async (linkId) => {
    if (confirm('Are you sure you want to delete this link?')) {
        try {
            await linksAPI.delete(linkId);
            await loadLinks();
            showSuccess('Link deleted!');
        } catch (error) {
            showError('Failed to delete link');
        }
    }
};
```

## 🚀 Deployment Steps

1. **Deploy Backend to Railway**
   - Set environment variables
   - Get deployment URL (e.g., `https://linkventory-backend.railway.app`)

2. **Update Frontend**
   - Replace `YOUR_BACKEND_URL` in `frontend-integration.js`
   - Implement the API calls in your frontend
   - Deploy updated frontend to Cloudflare Pages

3. **Test Integration**
   - Login/signup flow
   - Dashboard data loading
   - CRUD operations for links/categories

## 📝 Quick Implementation Checklist

- [ ] Deploy backend to Railway
- [ ] Update API_BASE_URL in frontend
- [ ] Replace hardcoded "Welcome Fatima" with API data
- [ ] Replace dummy category/link counts with real data
- [ ] Implement login/signup forms
- [ ] Add authentication checks
- [ ] Replace static links/categories with API calls
- [ ] Implement add/edit/delete functionality
- [ ] Test everything end-to-end

Would you like me to help with any specific part of this integration?
