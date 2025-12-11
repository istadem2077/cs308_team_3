# Sabanci University Pharmacy - Features Guide

## Authentication System

### Login Page
- Email and password authentication
- Clean, professional design with university branding
- Error handling for invalid credentials
- Switch to register page option

### Register Page
- Comprehensive registration form with:
  - **Personal Information**: Name, Age, Gender, Phone
  - **Account Information**: Email, Password (with confirmation)
  - **Delivery Address** (Turkey only):
    - City (dropdown with all Turkish cities)
    - Province/District
    - Postcode
    - Address Line
- Form validation
- Password strength requirements (minimum 6 characters)
- Auto-populate delivery information for checkout

### Session Management
- Persistent login using localStorage
- Automatic logout functionality
- User session maintained across page refreshes

## Main Features

### Price Filtering
Located under the category filters on the main page:
- **Default**: Products in original order
- **Cheapest First**: Sort from lowest to highest price
- **Most Expensive First**: Sort from highest to lowest price
- Real-time filtering without page reload
- Product count display

### My Account Page
Accessible via the user icon in the header, includes:

#### View/Edit Personal Information:
- Full Name
- Age
- Gender (Male/Female/Other)

#### Contact Information:
- Email address
- Phone number

#### Delivery Address:
- City (Turkish cities only)
- Province/District
- Postcode
- Address Line
- Complete formatted address preview

#### Features:
- Toggle edit mode with "Edit Profile" button
- Save/Cancel options when editing
- Real-time validation
- Success/error notifications
- Data persists in localStorage (or database when connected)

## User Experience Flow

### New User Journey:
1. **Register** → Fill out comprehensive registration form
2. **Auto-login** → Immediately logged in after registration
3. **Browse Products** → View pharmacy products with filters
4. **Add to Cart** → Select items for purchase
5. **Checkout** → Personal info auto-filled from profile
6. **Order Complete** → Confirmation and order tracking

### Returning User Journey:
1. **Login** → Enter credentials
2. **Browse/Shop** → Persistent cart and preferences
3. **My Account** → Update profile/address anytime
4. **Quick Checkout** → Saved information speeds up ordering

## Header Navigation

The header displays (when logged in):
- **University Logo & Name**
- **Search Bar** - Search products in real-time
- **User Name Button** - Quick access to My Account
- **Shopping Cart** - With item count badge
- **Logout Button** - Red icon for easy sign out

## Product Features

### Filtering & Sorting:
- Category-based filtering
- Search by product name
- Price sorting (low to high, high to low)
- Multiple filters can be combined

### Product Information:
- Product images
- Name and category
- Price in Turkish Lira (₺)
- Stock availability
- Prescription requirement indicator

## Delivery System

### Address Management:
- Turkey-only delivery
- Complete address with:
  - City selection from all 81 Turkish cities
  - Province/District
  - Postcode
  - Detailed address line
- Campus dormitory selection for students
- Room number for precise delivery

### Checkout Process:
1. Delivery information (pre-filled from user profile)
2. Order review
3. Prescription upload (if required)
4. Order confirmation

## Security Features

- Password encryption (when connected to real backend)
- Secure session management
- Input validation on all forms
- Protected routes (must be logged in)
- Secure prescription upload handling

## Mock Data vs. Real Implementation

Currently using mock data for demonstration:
- Mock authentication (stores in localStorage)
- Mock user profiles
- Mock product database
- Mock order processing

To connect to real backend:
1. Update API endpoints in `/services/api.ts`
2. Update auth endpoints in `/services/auth.ts`
3. Replace localStorage with secure token management
4. Connect to real database

## User Profile Fields

```typescript
{
  id: string,
  name: string,
  email: string,
  age: number,
  gender: 'male' | 'female' | 'other',
  phone: string,
  address: {
    city: string,           // Turkish city
    province: string,       // District/Province
    postcode: string,       // Postal code
    addressLine: string     // Detailed address
  }
}
```

## How to Use

### For Users:
1. **First Time**: Click "Register here" → Fill form → Start shopping
2. **Returning**: Enter email/password → Click "Sign In"
3. **Update Profile**: Click your name in header → Edit Profile → Make changes → Save
4. **Filter Products**: 
   - Use category buttons to filter by type
   - Use price sort buttons to order by price
   - Use search bar for specific items
5. **Shop**: Add items → View cart → Checkout (auto-filled info) → Confirm

### For Developers:
- All authentication logic in `/services/auth.ts`
- User profile management in `/components/MyAccount.tsx`
- Login UI in `/components/Login.tsx`
- Registration UI in `/components/Register.tsx`
- Main app logic with auth flow in `/App.tsx`
- Price filtering implemented in App.tsx sorting logic

## Turkish Cities Included

All 81 Turkish provinces are available in the city dropdown:
- Major cities: Istanbul, Ankara, Izmir, Bursa, Antalya
- All other provinces from Adana to Zonguldak
- Easy dropdown selection during registration and profile editing

## Future Enhancements

Potential additions:
- Email verification
- Password reset functionality
- Order history page
- Favorites/Wishlist
- Multiple delivery addresses
- Real-time order tracking
- Push notifications
- Payment gateway integration
- Prescription verification system
