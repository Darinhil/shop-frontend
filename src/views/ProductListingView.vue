<template>
  <div class="product-listing min-h-screen bg-slate-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-slate-800 mb-2">All Products</h1>
        <p class="text-slate-600">Discover our complete collection of premium products</p>
      </div>

      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Filters Sidebar -->
        <div class="lg:w-64 flex-shrink-0">
          <div class="card p-6 sticky top-24">
            <h2 class="text-lg font-semibold text-slate-800 mb-4">Filters</h2>
            
            <!-- Category Filter -->
            <div class="mb-6">
              <label class="block text-sm font-semibold text-slate-700 mb-2">Category</label>
              <select v-model="selectedCategory" @change="applyFilters" class="input-field">
                <option value="">All Categories</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>

            <!-- Price Range Filter -->
            <div class="mb-6">
              <label class="block text-sm font-semibold text-slate-700 mb-2">Price Range</label>
              <div class="flex items-center gap-2">
                <input
                  type="number"
                  v-model="minPrice"
                  placeholder="Min"
                  @change="applyFilters"
                  class="input-field flex-1"
                >
                <span class="text-slate-400">-</span>
                <input
                  type="number"
                  v-model="maxPrice"
                  placeholder="Max"
                  @change="applyFilters"
                  class="input-field flex-1"
                >
              </div>
            </div>

            <!-- Sort By -->
            <div class="mb-6">
              <label class="block text-sm font-semibold text-slate-700 mb-2">Sort By</label>
              <select v-model="sortBy" @change="applyFilters" class="input-field">
                <option value="name_asc">Name (A-Z)</option>
                <option value="name_desc">Name (Z-A)</option>
                <option value="price_asc">Price (Low to High)</option>
                <option value="price_desc">Price (High to Low)</option>
                <option value="newest">Newest</option>
              </select>
            </div>

            <button @click="resetFilters" class="btn-secondary w-full">
              Reset Filters
            </button>
          </div>
        </div>

        <!-- Products Grid -->
        <div class="flex-1">
          <!-- Search Bar -->
          <div class="mb-6">
            <div class="relative">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Search products..."
                @input="debouncedSearch"
                class="input-field pl-12"
              >
              <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>

          <!-- Results Count -->
          <div class="mb-4 text-slate-600">
            <span v-if="!loading">{{ pagination.total }} products found</span>
          </div>

          <!-- Loading State -->
          <LoadingSpinner v-if="loading" />

          <!-- Products Grid -->
          <div v-else-if="products.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProductCard
              v-for="product in products"
              :key="product.id"
              :product="product"
            />
          </div>

          <!-- Empty State -->
          <div v-else class="card p-12 text-center">
            <svg class="w-24 h-24 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 class="text-xl font-semibold text-slate-800 mb-2">No products found</h3>
            <p class="text-slate-600 mb-4">Try adjusting your filters or search terms</p>
            <button @click="resetFilters" class="btn-primary">
              Clear Filters
            </button>
          </div>

          <!-- Pagination -->
          <div v-if="pagination.last_page > 1" class="flex justify-center items-center gap-4 mt-8">
            <button
              :disabled="pagination.current_page === 1"
              @click="changePage(pagination.current_page - 1)"
              class="btn-secondary"
              :class="{ 'opacity-50 cursor-not-allowed': pagination.current_page === 1 }"
            >
              Previous
            </button>
            
            <div class="flex gap-2">
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="changePage(page)"
                class="w-10 h-10 rounded-lg font-medium transition-all duration-300"
                :class="page === pagination.current_page ? 'bg-primary-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-100'"
              >
                {{ page }}
              </button>
            </div>
            
            <button
              :disabled="pagination.current_page === pagination.last_page"
              @click="changePage(pagination.current_page + 1)"
              class="btn-secondary"
              :class="{ 'opacity-50 cursor-not-allowed': pagination.current_page === pagination.last_page }"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useCartStore } from '../stores/cart';
import { useToast } from '../composables/useToast';
import ProductCard from '../components/ProductCard.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';

const router = useRouter();
const route = useRoute();
const cartStore = useCartStore();
const { success, error: toastError } = useToast();

const products = ref([]);
const categories = ref([]);
const loading = ref(true);
const selectedCategory = ref('');
const minPrice = ref('');
const maxPrice = ref('');
const searchQuery = ref('');
const sortBy = ref('newest');
const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 12,
  total: 0
});

let searchTimeout = null;

const visiblePages = computed(() => {
  const pages = [];
  const current = pagination.value.current_page;
  const last = pagination.value.last_page;
  
  if (last <= 7) {
    for (let i = 1; i <= last; i++) {
      pages.push(i);
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push('...');
      pages.push(last);
    } else if (current >= last - 3) {
      pages.push(1);
      pages.push('...');
      for (let i = last - 4; i <= last; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push('...');
      for (let i = current - 1; i <= current + 1; i++) pages.push(i);
      pages.push('...');
      pages.push(last);
    }
  }
  
  return pages;
});

const fetchCategories = async () => {
  try {
    const response = await fetch('/api/categories');
    const data = await response.json();
    categories.value = data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Use mock data if API fails
    categories.value = [
      { id: 1, name: 'Electronics' },
      { id: 2, name: 'Clothing' },
      { id: 3, name: 'Home' },
      { id: 4, name: 'Sports' },
      { id: 5, name: 'Books' },
      { id: 6, name: 'Beauty' },
    ];
  }
};

const fetchProducts = async () => {
  loading.value = true;
  try {
    const params = new URLSearchParams({
      page: pagination.value.current_page,
      per_page: pagination.value.per_page,
      sort: sortBy.value
    });

    if (selectedCategory.value) params.append('category', selectedCategory.value);
    if (minPrice.value) params.append('min_price', minPrice.value);
    if (maxPrice.value) params.append('max_price', maxPrice.value);
    if (searchQuery.value) params.append('search', searchQuery.value);

    const response = await fetch(`/api/products?${params}`);
    const data = await response.json();
    
    products.value = data.data || data || [];
    pagination.value = {
      current_page: data.current_page || 1,
      last_page: data.last_page || 1,
      per_page: data.per_page || 12,
      total: data.total || 0
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    // Use mock data if API fails
    products.value = [
      { id: 1, name: 'Premium Wireless Headphones', price: 299.99, discount: 15, featured: true, rating: 4.8, reviews_count: 124, category: { name: 'Electronics' } },
      { id: 2, name: 'Smart Watch Pro', price: 199.99, discount: 10, featured: true, rating: 4.6, reviews_count: 89, category: { name: 'Electronics' } },
      { id: 3, name: 'Designer Leather Bag', price: 159.99, discount: 20, featured: true, rating: 4.9, reviews_count: 256, category: { name: 'Clothing' } },
      { id: 4, name: 'Running Shoes Elite', price: 129.99, discount: 0, featured: true, rating: 4.7, reviews_count: 178, category: { name: 'Sports' } },
      { id: 5, name: 'Portable Speaker', price: 79.99, discount: 0, featured: false, rating: 4.5, reviews_count: 67, category: { name: 'Electronics' } },
      { id: 6, name: 'Yoga Mat Premium', price: 49.99, discount: 25, featured: false, rating: 4.8, reviews_count: 145, category: { name: 'Sports' } },
    ];
    pagination.value.total = 6;
  } finally {
    loading.value = false;
  }
};

const applyFilters = () => {
  pagination.value.current_page = 1;
  fetchProducts();
};

const resetFilters = () => {
  selectedCategory.value = '';
  minPrice.value = '';
  maxPrice.value = '';
  searchQuery.value = '';
  sortBy.value = 'newest';
  pagination.value.current_page = 1;
  fetchProducts();
};

const debouncedSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    applyFilters();
  }, 500);
};

const changePage = (page) => {
  if (page === '...' || page === pagination.value.current_page) return;
  pagination.value.current_page = page;
  fetchProducts();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Watch for route query changes
watch(() => route.query.category, (newCategory) => {
  if (newCategory) {
    selectedCategory.value = newCategory;
    applyFilters();
  }
});

onMounted(() => {
  fetchCategories();
  if (route.query.category) {
    selectedCategory.value = route.query.category;
  }
  fetchProducts();
});
</script>

<style scoped>
.product-listing {
  padding-top: 2rem;
}
</style>
