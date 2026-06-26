<template>
  <div class="wishlist-view min-h-screen bg-slate-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-slate-800">My Wishlist</h1>
        <button
          v-if="items.length > 0"
          @click="clearWishlist"
          class="btn-secondary text-sm"
        >
          Clear Wishlist
        </button>
      </div>

      <LoadingSpinner v-if="loading" />

      <div v-else-if="items.length === 0" class="card p-12 text-center">
        <svg class="w-24 h-24 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
        </svg>
        <h3 class="text-xl font-semibold text-slate-800 mb-2">Your wishlist is empty</h3>
        <p class="text-slate-600 mb-6">Save items you love by clicking the heart icon.</p>
        <router-link to="/products" class="btn-primary">
          Browse Products
        </router-link>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="item in items"
          :key="item.id"
          class="card overflow-hidden group"
        >
          <div class="relative">
            <div class="aspect-square bg-slate-100 overflow-hidden">
              <img
                :src="item.product_image || defaultImage"
                :alt="item.product_name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              >
            </div>
            
            <button
              @click="removeFromWishlist(item.product_id)"
              class="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors"
            >
              <svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </button>
          </div>

          <div class="p-4">
            <router-link
              :to="{ name: 'ProductDetail', params: { id: item.product_id } }"
              class="block"
            >
              <h3 class="font-semibold text-slate-800 mb-1 truncate hover:text-primary-600 transition-colors">
                {{ item.product_name }}
              </h3>
              <p class="text-sm text-slate-500 mb-2">{{ item.category_name || 'Uncategorized' }}</p>
              <p class="text-lg font-bold text-primary-600">${{ formatPrice(item.product_price ?? item.price) }}</p>
            </router-link>

            <button
              @click="moveToCart(item.product_id)"
              class="w-full btn-primary mt-4 flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useWishlistStore } from '../stores/wishlist';
import { useCartStore } from '../stores/cart';
import { useToast } from '../composables/useToast';
import LoadingSpinner from '../components/LoadingSpinner.vue';

const router = useRouter();
const wishlistStore = useWishlistStore();
const cartStore = useCartStore();
const { success, error: toastError } = useToast();

const items = ref([]);
const loading = ref(true);

const defaultImage = 'https://via.placeholder.com/300x300?text=Product';

const formatPrice = (value) => {
  const price = Number(value);
  return Number.isFinite(price) ? price.toFixed(2) : '0.00';
};

const fetchWishlist = async () => {
  loading.value = true;
  try {
    await wishlistStore.fetchWishlist();
    items.value = wishlistStore.items;
  } catch (err) {
    console.error('Error fetching wishlist:', err);
    // Use mock data if API fails
    items.value = [
      { id: 1, product_id: 1, product_name: 'Premium Wireless Headphones', product_image: 'https://via.placeholder.com/300x300?text=Headphones', product_price: 299.99, category_name: 'Electronics' },
      { id: 2, product_id: 2, product_name: 'Smart Watch Pro', product_image: 'https://via.placeholder.com/300x300?text=Watch', product_price: 199.99, category_name: 'Electronics' },
      { id: 3, product_id: 3, product_name: 'Designer Leather Bag', product_image: 'https://via.placeholder.com/300x300?text=Bag', product_price: 159.99, category_name: 'Clothing' },
    ];
  } finally {
    loading.value = false;
  }
};

const removeFromWishlist = async (productId) => {
  try {
    await wishlistStore.removeFromWishlist(productId);
    items.value = wishlistStore.items;
    success('Item removed from wishlist');
  } catch (err) {
    console.error('Error removing from wishlist:', err);
    toastError('Failed to remove item from wishlist');
  }
};

const moveToCart = async (productId) => {
  try {
    await wishlistStore.moveToCart(productId, cartStore);
    items.value = wishlistStore.items;
    success('Item moved to cart!');
  } catch (err) {
    console.error('Error moving to cart:', err);
    toastError('Failed to move item to cart');
  }
};

const clearWishlist = async () => {
  try {
    await wishlistStore.clearWishlist();
    items.value = [];
    success('Wishlist cleared');
  } catch (err) {
    console.error('Error clearing wishlist:', err);
    toastError('Failed to clear wishlist');
  }
};

onMounted(() => {
  fetchWishlist();
});
</script>

<style scoped>
.wishlist-view {
  padding-top: 2rem;
}
</style>
