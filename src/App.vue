<template>
  <div id="app">
    <!-- Navbar -->
    <nav class="bg-white shadow-lg sticky top-0 z-50" v-if="showNavbar">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <router-link to="/" class="flex items-center gap-2 group">
            <div class="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
            </div>
            <span class="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">ShopHub</span>
          </router-link>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center gap-8">
            <router-link to="/" class="text-slate-700 hover:text-primary-600 font-medium transition-colors">Home</router-link>
            <router-link to="/products" class="text-slate-700 hover:text-primary-600 font-medium transition-colors">Products</router-link>
            
            <template v-if="authStore.isAuthenticated">
              <router-link to="/wishlist" class="text-slate-700 hover:text-primary-600 font-medium transition-colors flex items-center gap-1">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
                Wishlist
                <span v-if="wishlistStore.items.length > 0" class="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{{ wishlistStore.items.length }}</span>
              </router-link>
              <router-link to="/cart" class="text-slate-700 hover:text-primary-600 font-medium transition-colors flex items-center gap-1">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                Cart
                <span v-if="cartStore.cartCount > 0" class="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{{ cartStore.cartCount }}</span>
              </router-link>
              <router-link to="/orders" class="text-slate-700 hover:text-primary-600 font-medium transition-colors">Orders</router-link>
              <router-link to="/profile" class="text-slate-700 hover:text-primary-600 font-medium transition-colors">Profile</router-link>
              <button @click="handleLogout" class="text-red-500 hover:text-red-600 font-medium transition-colors">Logout</button>
            </template>
            
            <template v-else>
              <router-link to="/login" class="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-6 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                Login
              </router-link>
            </template>
          </div>

          <!-- Mobile Menu Button -->
          <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden p-2 rounded-lg hover:bg-slate-100">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>

        <!-- Mobile Menu -->
        <div v-if="mobileMenuOpen" class="md:hidden py-4 border-t border-slate-200">
          <div class="flex flex-col gap-4">
            <router-link to="/" class="text-slate-700 hover:text-primary-600 font-medium">Home</router-link>
            <router-link to="/products" class="text-slate-700 hover:text-primary-600 font-medium">Products</router-link>
            
            <template v-if="authStore.isAuthenticated">
              <router-link to="/wishlist" class="text-slate-700 hover:text-primary-600 font-medium">Wishlist</router-link>
              <router-link to="/cart" class="text-slate-700 hover:text-primary-600 font-medium">Cart</router-link>
              <router-link to="/orders" class="text-slate-700 hover:text-primary-600 font-medium">Orders</router-link>
              <router-link to="/profile" class="text-slate-700 hover:text-primary-600 font-medium">Profile</router-link>
              <button @click="handleLogout" class="text-red-500 hover:text-red-600 font-medium text-left">Logout</button>
            </template>
            
            <template v-else>
              <router-link to="/login" class="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-2 rounded-xl font-medium text-center">Login</router-link>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="min-h-screen">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="bg-slate-900 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div class="flex items-center gap-2 mb-4">
              <div class="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
              </div>
              <span class="text-2xl font-bold">ShopHub</span>
            </div>
            <p class="text-slate-400 mb-4">Your one-stop shop for amazing products. Quality, convenience, and satisfaction guaranteed.</p>
            <div class="flex gap-4">
              <a href="#" class="text-slate-400 hover:text-white transition-colors">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" class="text-slate-400 hover:text-white transition-colors">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#" class="text-slate-400 hover:text-white transition-colors">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
            <ul class="space-y-2">
              <li><router-link to="/" class="text-slate-400 hover:text-white transition-colors">Home</router-link></li>
              <li><router-link to="/products" class="text-slate-400 hover:text-white transition-colors">Products</router-link></li>
              <li><router-link to="/categories" class="text-slate-400 hover:text-white transition-colors">Categories</router-link></li>
              <li><router-link to="/about" class="text-slate-400 hover:text-white transition-colors">About Us</router-link></li>
            </ul>
          </div>
          
          <div>
            <h3 class="text-lg font-semibold mb-4">Customer Service</h3>
            <ul class="space-y-2">
              <li><router-link to="/profile" class="text-slate-400 hover:text-white transition-colors">My Account</router-link></li>
              <li><router-link to="/orders" class="text-slate-400 hover:text-white transition-colors">Order History</router-link></li>
              <li><router-link to="/wishlist" class="text-slate-400 hover:text-white transition-colors">Wishlist</router-link></li>
              <li><router-link to="/contact" class="text-slate-400 hover:text-white transition-colors">Contact Us</router-link></li>
            </ul>
          </div>
          
          <div>
            <h3 class="text-lg font-semibold mb-4">Newsletter</h3>
            <p class="text-slate-400 mb-4">Subscribe to get special offers and updates.</p>
            <form class="flex gap-2">
              <input type="email" placeholder="Your email" class="flex-1 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500">
              <button type="submit" class="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 px-4 py-2 rounded-lg font-medium transition-all duration-300">
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div class="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
          <p>&copy; {{ new Date().getFullYear() }} ShopHub. All rights reserved.</p>
        </div>
      </div>
    </footer>

    <!-- Toast Notifications -->
    <div class="fixed top-20 right-4 z-50 flex flex-col gap-2">
      <Toast
        v-for="toast in toasts"
        :key="toast.id"
        :message="toast.message"
        :type="toast.type"
        :duration="toast.duration"
        @close="removeToast(toast.id)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from './stores/auth';
import { useCartStore } from './stores/cart';
import { useWishlistStore } from './stores/wishlist';
import Toast from './components/Toast.vue';
import { useToast } from './composables/useToast';

const route = useRoute();
const authStore = useAuthStore();
const cartStore = useCartStore();
const wishlistStore = useWishlistStore();
const { toasts, removeToast } = useToast();

const mobileMenuOpen = ref(false);

const showNavbar = computed(() => {
  return route.name !== 'Login';
});

const handleLogout = async () => {
  await authStore.logoutUser();
  mobileMenuOpen.value = false;
};

watch(() => authStore.isAuthenticated, (newVal) => {
  if (newVal) {
    cartStore.fetchCart();
    wishlistStore.fetchWishlist();
  } else {
    cartStore.items = [];
    wishlistStore.items = [];
  }
});

onMounted(() => {
  authStore.initAuth();
  
  if (authStore.isAuthenticated) {
    cartStore.fetchCart();
    wishlistStore.fetchWishlist();
  }
});
</script>
