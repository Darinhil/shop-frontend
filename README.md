# Shop Frontend - Vue 3 SPA

A standalone Single Page Application (SPA) built with Vue 3, designed to consume a Laravel REST API with Sanctum authentication.

## Tech Stack

- **Framework**: Vue 3 (Composition API with `<script setup>`)
- **Routing**: Vue Router 4 with navigation guards
- **State Management**: Pinia
- **HTTP Client**: Axios with interceptors
- **Build Tool**: Vite

## Features

### Public Views (No Authentication Required)
- **Home** (`/`) - Banner display, categories slider, and featured products grid
- **Products** (`/products`) - Search filters, category navigation, and product grids with pagination
- **Product Detail** (`/products/:id`) - Product specifications, image gallery, and reviews
- **Login/Register** (`/login`) - Authentication form with toggle between login and registration

### Protected Views (Authentication Required)
- **Wishlist** (`/wishlist`) - Manage favorite items, move to cart, clear list
- **Cart** (`/cart`) - Item quantity validation, total calculations, remove items
- **Checkout** (`/checkout`) - Shipping form validation and order submission
- **Order History** (`/orders`) - View historic transactions with status timeline
- **Profile** (`/profile`) - Update account data and change password

## Architecture

### API Integration
- Centralized Axios instance with automatic Bearer token injection
- Request interceptor attaches auth token from localStorage
- Response interceptor handles 401 errors (auto-logout and redirect)

### State Management (Pinia Stores)
- **auth.js** - User authentication, token management, profile updates
- **cart.js** - Cart items, quantity management, total calculations
- **wishlist.js** - Wishlist items, add/remove/move to cart operations

### Route Protection
- Global `beforeEach` navigation guard checks localStorage for auth token
- Protected routes redirect unauthenticated users to login page

## Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Configure API endpoint**:
   - Edit `src/api/axios.js` if your Laravel backend runs on a different port
   - Default: `http://localhost:8000/api`

3. **Start development server**:
```bash
npm run dev
```

4. **Build for production**:
```bash
npm run build
```

5. **Preview production build**:
```bash
npm run preview
```

## API Endpoints Expected

The frontend expects the following Laravel API endpoints:

### Authentication
- `POST /api/login` - User login
- `POST /api/register` - User registration
- `POST /api/logout` - User logout
- `GET /api/user` - Get current user profile
- `PUT /api/user` - Update user profile
- `PUT /api/password` - Change password

### Products
- `GET /api/products` - List products (supports pagination, filtering, search)
- `GET /api/products/:id` - Get product details
- `GET /api/products/:id/reviews` - Get product reviews

### Categories
- `GET /api/categories` - List categories

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item quantity
- `DELETE /api/cart/:id` - Remove item from cart
- `DELETE /api/cart` - Clear cart

### Wishlist
- `GET /api/wishlist` - Get user wishlist
- `POST /api/wishlist` - Add item to wishlist
- `DELETE /api/wishlist/:id` - Remove item from wishlist
- `DELETE /api/wishlist` - Clear wishlist

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user order history

## Project Structure

```
Shop-frontend/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.js
│   ├── App.vue
│   ├── api/
│   │   └── axios.js          # Axios instance with interceptors
│   ├── router/
│   │   └── index.js          # Vue Router configuration with guards
│   ├── stores/
│   │   ├── auth.js           # Authentication state
│   │   ├── cart.js           # Cart state
│   │   └── wishlist.js       # Wishlist state
│   └── views/
│       ├── HomeView.vue
│       ├── ProductListingView.vue
│       ├── ProductDetailView.vue
│       ├── AuthView.vue
│       ├── WishlistView.vue
│       ├── CartView.vue
│       ├── CheckoutView.vue
│       ├── OrderHistoryView.vue
│       └── ProfileView.vue
└── README.md
```

## Advanced Features

### Product Filters & Pagination
- Reactive filter options (price range, category)
- Automatic API requests on filter changes using Vue's `watch`
- Pagination controls with page navigation

### Order Status Timeline
- Visual step indicators (Pending → Processing → Shipped → Delivered)
- Status-based styling and progress visualization

### Cart & Wishlist Synchronization
- All cart/wishlist operations immediately sync with backend
- Local reactive state updates for instant UI feedback
- Automatic token-based authentication for all protected endpoints

## Development Notes

- The app uses localStorage to persist auth tokens (`auth_token`) and user data (`auth_user`)
- Protected routes are defined with `meta: { requiresAuth: true }`
- All API calls automatically include the Authorization header when token exists
- 401 responses automatically clear tokens and redirect to login

## Browser Support

Modern browsers supporting ES6+ and Vue 3:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

MIT
