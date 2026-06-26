<template>
  <div class="home-view">
    <!-- Hero Banner -->
    <section class="relative bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 overflow-hidden">
      <div class="absolute inset-0 bg-black/20"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div class="text-center md:text-left md:max-w-2xl">
          <h1 class="text-4xl md:text-6xl font-bold text-white mb-6 animate-slide-up">
            Discover Your Perfect Style
          </h1>
          <p class="text-xl text-white/90 mb-8 animate-slide-up" style="animation-delay: 0.1s">
            Explore our curated collection of premium products. Quality meets affordability.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 animate-slide-up" style="animation-delay: 0.2s">
            <router-link to="/products" class="btn-primary text-center">
              Shop Now
            </router-link>
            <router-link to="/categories" class="btn-secondary text-center">
              Browse Categories
            </router-link>
          </div>
        </div>
      </div>
      <div class="absolute bottom-0 right-0 w-1/2 h-full hidden lg:block">
        <div class="absolute inset-0 bg-gradient-to-l from-transparent to-primary-600/50"></div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-slate-800 mb-4">Shop by Category</h2>
          <p class="text-slate-600 max-w-2xl mx-auto">Browse our wide selection of categories to find exactly what you're looking for.</p>
        </div>
        
        <LoadingSpinner v-if="loadingCategories" />
        
        <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <div
            v-for="category in categories"
            :key="category.id"
            @click="navigateToCategory(category.id)"
            class="group cursor-pointer"
          >
            <div class="relative aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <img
                :src="category.image || defaultCategoryImage"
                :alt="category.name"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div class="absolute bottom-4 left-4 right-4">
                <h3 class="text-white font-semibold text-lg">{{ category.name }}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products Section -->
    <section class="py-16 bg-slate-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-slate-800 mb-4">Featured Products</h2>
          <p class="text-slate-600 max-w-2xl mx-auto">Handpicked products just for you. Discover our best sellers and new arrivals.</p>
        </div>
        
        <LoadingSpinner v-if="loadingProducts" />
        
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProductCard
            v-for="product in featuredProducts"
            :key="product.id"
            :product="product"
          />
        </div>
        
        <div class="text-center mt-12">
          <router-link to="/products" class="btn-primary">
            View All Products
          </router-link>
        </div>
      </div>
    </section>

    <!-- Promotional Banner -->
    <section class="py-16 bg-gradient-to-r from-accent-500 to-accent-600">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row items-center justify-between gap-8">
          <div class="text-center md:text-left">
            <h2 class="text-3xl font-bold text-white mb-4">Special Offer: 20% Off</h2>
            <p class="text-white/90 text-lg mb-6">Use code SAVE20 at checkout. Limited time only!</p>
          </div>
          <router-link to="/products" class="btn-secondary bg-white text-accent-600 hover:bg-slate-100 border-none">
            Shop Sale
          </router-link>
        </div>
      </div>
    </section>

    <!-- New Arrivals Section -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-slate-800 mb-4">New Arrivals</h2>
          <p class="text-slate-600 max-w-2xl mx-auto">Be the first to discover our latest additions to the collection.</p>
        </div>
        
        <LoadingSpinner v-if="loadingNewArrivals" />
        
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProductCard
            v-for="product in newArrivals"
            :key="product.id"
            :product="product"
          />
        </div>
      </div>
    </section>

    <!-- Newsletter Section -->
    <section class="py-16 bg-slate-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-2xl mx-auto">
          <h2 class="text-3xl font-bold text-white mb-4">Stay Updated</h2>
          <p class="text-slate-400 mb-8">Subscribe to our newsletter for exclusive offers, new arrivals, and style inspiration.</p>
          <form @submit.prevent="subscribeNewsletter" class="flex gap-4">
            <input
              v-model="email"
              type="email"
              placeholder="Enter your email"
              class="flex-1 px-6 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button type="submit" class="btn-primary">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from '../composables/useToast';
import ProductCard from '../components/ProductCard.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';

const router = useRouter();
const { success, error: toastError } = useToast();

const categories = ref([]);
const featuredProducts = ref([]);
const newArrivals = ref([]);
const loadingCategories = ref(false);
const loadingProducts = ref(false);
const loadingNewArrivals = ref(false);
const email = ref('');

const defaultCategoryImage = 'https://via.placeholder.com/400x400?text=Category';

const fetchCategories = async () => {
  loadingCategories.value = true;
  try {
    const response = await fetch('/api/categories');
    const data = await response.json();
    categories.value = data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Use mock data if API fails
    categories.value = [
      { id: 1, name: 'Electronics', image: 'https://via.placeholder.com/400x400?text=Electronics' },
      { id: 2, name: 'Clothing', image: 'https://via.placeholder.com/400x400?text=Clothing' },
      { id: 3, name: 'Home', image: 'https://via.placeholder.com/400x400?text=Home' },
      { id: 4, name: 'Sports', image: 'https://via.placeholder.com/400x400?text=Sports' },
      { id: 5, name: 'Books', image: 'https://via.placeholder.com/400x400?text=Books' },
      { id: 6, name: 'Beauty', image: 'https://via.placeholder.com/400x400?text=Beauty' },
    ];
  } finally {
    loadingCategories.value = false;
  }
};

const fetchFeaturedProducts = async () => {
  loadingProducts.value = true;
  try {
    const response = await fetch('/api/products?featured=1');
    const data = await response.json();
    featuredProducts.value = data.data || data || [];
  } catch (error) {
    console.error('Error fetching featured products:', error);
    // Use mock data if API fails
    featuredProducts.value = [
      { id: 1, name: 'Premium Wireless Headphones', price: 299.99, discount: 15, featured: true, rating: 4.8, reviews_count: 124, category: { name: 'Electronics' } },
      { id: 2, name: 'Smart Watch Pro', price: 199.99, discount: 10, featured: true, rating: 4.6, reviews_count: 89, category: { name: 'Electronics' } },
      { id: 3, name: 'Designer Leather Bag', price: 159.99, discount: 20, featured: true, rating: 4.9, reviews_count: 256, category: { name: 'Clothing' } },
      { id: 4, name: 'Running Shoes Elite', price: 129.99, discount: 0, featured: true, rating: 4.7, reviews_count: 178, category: { name: 'Sports' } },
    ];
  } finally {
    loadingProducts.value = false;
  }
};

const fetchNewArrivals = async () => {
  loadingNewArrivals.value = true;
  try {
    const response = await fetch('/api/products');
    const data = await response.json();
    newArrivals.value = (data.data || data || []).slice(0, 4);
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    // Use mock data if API fails
    newArrivals.value = [
      { id: 5, name: 'Portable Speaker', price: 79.99, discount: 0, featured: false, rating: 4.5, reviews_count: 67, category: { name: 'Electronics' } },
      { id: 6, name: 'Yoga Mat Premium', price: 49.99, discount: 25, featured: false, rating: 4.8, reviews_count: 145, category: { name: 'Sports' } },
      { id: 7, name: 'Skincare Set', price: 89.99, discount: 0, featured: false, rating: 4.6, reviews_count: 92, category: { name: 'Beauty' } },
      { id: 8, name: 'Coffee Table Book', price: 39.99, discount: 10, featured: false, rating: 4.4, reviews_count: 34, category: { name: 'Books' } },
    ];
  } finally {
    loadingNewArrivals.value = false;
  }
};

const navigateToCategory = (categoryId) => {
  router.push({ name: 'Products', query: { category: categoryId } });
};

const subscribeNewsletter = () => {
  if (email.value) {
    success('Thank you for subscribing!');
    email.value = '';
  } else {
    toastError('Please enter your email address');
  }
};

onMounted(() => {
  fetchCategories();
  fetchFeaturedProducts();
  fetchNewArrivals();
});
</script>

<style scoped>
.home-view {
  min-height: 100vh;
}
</style>
