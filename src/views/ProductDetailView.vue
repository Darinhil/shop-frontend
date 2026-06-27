<template>
  <div class="product-detail min-h-screen bg-slate-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-sm text-slate-600 mb-8">
        <router-link to="/" class="hover:text-primary-600">Home</router-link>
        <span>/</span>
        <router-link to="/products" class="hover:text-primary-600">Products</router-link>
        <span>/</span>
        <span class="text-slate-800 font-medium">{{ product?.name || 'Loading...' }}</span>
      </nav>

      <LoadingSpinner v-if="loading" />

      <div v-else-if="product" class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Product Images -->
        <div class="space-y-4">
          <div class="card p-4">
            <div class="aspect-square rounded-xl overflow-hidden bg-slate-100">
              <img
                :src="currentImage || defaultImage"
                :alt="product.name"
                class="w-full h-full object-cover"
              >
            </div>
          </div>
          
          <!-- Thumbnail Gallery -->
          <div class="flex gap-3 overflow-x-auto pb-2">
            <div
              v-for="(image, index) in productImages"
              :key="index"
              @click="currentImage = image"
              class="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-300"
              :class="currentImage === image ? 'border-primary-500' : 'border-transparent hover:border-slate-300'"
            >
              <img :src="image" :alt="`${product.name} - ${index + 1}`" class="w-full h-full object-cover">
            </div>
          </div>
        </div>

        <!-- Product Info -->
        <div class="space-y-6">
          <div>
            <p class="text-sm text-slate-500 mb-2">{{ product.category?.name || 'Uncategorized' }}</p>
            <h1 class="text-3xl font-bold text-slate-800 mb-4">{{ product.name }}</h1>
            
            <!-- Rating -->
            <div class="flex items-center gap-2 mb-4">
              <div class="flex items-center">
                <svg v-for="i in 5" :key="i" class="w-5 h-5" :class="i <= Math.floor(product.rating || 4.5) ? 'text-amber-400' : 'text-slate-300'" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.618l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </div>
              <span class="text-slate-600">{{ product.rating || 4.5 }} ({{ product.reviews_count || 0 }} reviews)</span>
            </div>

            <!-- Price -->
            <div class="flex items-center gap-3 mb-6">
              <span class="text-3xl font-bold text-primary-600">${{ discountedPrice }}</span>
              <span v-if="hasDiscount" class="text-xl text-slate-400 line-through">${{ originalPrice }}</span>
              <span v-if="hasDiscount" class="badge badge-danger">-{{ formattedDiscount }}%</span>
            </div>

            <!-- Stock Status -->
            <div class="flex items-center gap-2 mb-6">
              <span class="w-3 h-3 rounded-full" :class="inStock ? 'bg-green-500' : 'bg-red-500'"></span>
              <span class="text-sm font-medium" :class="inStock ? 'text-green-600' : 'text-red-600'">
                {{ inStock ? 'In Stock' : 'Out of Stock' }}
              </span>
            </div>

            <!-- Description -->
            <p class="text-slate-600 leading-relaxed mb-6">{{ product.description || 'No description available.' }}</p>
          </div>

          <!-- Product Variants -->
          <div v-if="hasVariants" class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">Color</label>
              <div class="flex gap-2">
                <button
                  v-for="color in colors"
                  :key="color"
                  @click="selectedColor = color"
                  class="w-10 h-10 rounded-full border-2 transition-all duration-300"
                  :class="selectedColor === color ? 'border-primary-500 scale-110' : 'border-transparent hover:border-slate-300'"
                  :style="{ backgroundColor: color }"
                />
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">Size</label>
              <div class="flex gap-2">
                <button
                  v-for="size in sizes"
                  :key="size"
                  @click="selectedSize = size"
                  class="px-4 py-2 rounded-lg border-2 transition-all duration-300 font-medium"
                  :class="selectedSize === size ? 'border-primary-500 bg-primary-50 text-primary-600' : 'border-slate-200 hover:border-slate-300'"
                >
                  {{ size }}
                </button>
              </div>
            </div>
          </div>

          <!-- Quantity Selector -->
          <div class="flex items-center gap-4">
            <label class="text-sm font-semibold text-slate-700">Quantity:</label>
            <div class="flex items-center gap-2">
              <button
                @click="decreaseQuantity"
                :disabled="quantity <= 1"
                class="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                </svg>
              </button>
              <input
                type="number"
                v-model.number="quantity"
                min="1"
                :max="product.stock || 999"
                class="w-20 text-center input-field"
              >
              <button
                @click="increaseQuantity"
                :disabled="quantity >= (product.stock || 999)"
                class="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-4">
            <button
              @click="addToCart"
              :disabled="!inStock"
              class="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              Add to Cart
            </button>
            <button
              @click="addToWishlist"
              class="w-14 h-14 rounded-xl border-2 flex items-center justify-center transition-all duration-300"
              :class="isInWishlist ? 'border-red-500 text-red-500 bg-red-50' : 'border-slate-200 text-slate-400 hover:border-red-500 hover:text-red-500'"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </button>
          </div>

          <!-- Product Features -->
          <div class="grid grid-cols-2 gap-4 pt-6 border-t border-slate-200">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <span class="text-sm text-slate-600">Free Shipping</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
              </div>
              <span class="text-sm text-slate-600">30-Day Returns</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <span class="text-sm text-slate-600">Secure Payment</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <span class="text-sm text-slate-600">24/7 Support</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Reviews Section -->
      <div v-if="product" class="mt-16 card p-8">
        <h2 class="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <svg class="w-6 h-6 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.618l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
          Customer Reviews
        </h2>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Reviews Summary -->
          <div class="lg:col-span-1 bg-slate-50 p-6 rounded-2xl flex flex-col justify-center items-center text-center">
            <p class="text-5xl font-extrabold text-slate-800 mb-2">{{ product.rating || '0.0' }}</p>
            <div class="flex items-center gap-1 mb-2">
              <svg v-for="i in 5" :key="i" class="w-6 h-6" :class="i <= Math.round(product.rating || 0) ? 'text-amber-400' : 'text-slate-300'" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.618l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            </div>
            <p class="text-sm text-slate-500 font-medium">Based on {{ product.reviews_count || 0 }} reviews</p>
          </div>

          <!-- Reviews List / Form -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Review Form -->
            <div v-if="authStore.isAuthenticated && !userHasReviewed" class="bg-slate-50 p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 class="text-lg font-bold text-slate-800 mb-4">Write a Review</h3>
              <form @submit.prevent="submitReview" class="space-y-4">
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-2">Rating</label>
                  <div class="flex items-center gap-1">
                    <button
                      v-for="star in 5"
                      :key="star"
                      type="button"
                      @click="newReview.rating = star"
                      class="text-3xl transition-transform hover:scale-110 focus:outline-none"
                      :class="star <= newReview.rating ? 'text-amber-400' : 'text-slate-300'"
                    >
                      ★
                    </button>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-2">Comment</label>
                  <textarea
                    v-model="newReview.comment"
                    rows="3"
                    placeholder="Share your thoughts about this product..."
                    required
                    class="input-field resize-none bg-white"
                  ></textarea>
                </div>
                <button type="submit" class="btn-primary py-2.5 px-5 text-sm" :disabled="submittingReview">
                  {{ submittingReview ? 'Submitting...' : 'Submit Review' }}
                </button>
              </form>
            </div>
            <div v-else-if="!authStore.isAuthenticated" class="bg-slate-50 p-6 rounded-2xl text-center">
              <p class="text-slate-600 text-sm">Please <router-link to="/login" class="text-primary-600 hover:underline font-semibold">login</router-link> to write a review.</p>
            </div>

            <!-- List of Reviews -->
            <div v-if="reviews.length > 0" class="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              <div v-for="rev in reviews" :key="rev.id" class="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                <div class="flex items-center justify-between gap-4 mb-2">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">
                      {{ getInitials(rev.user_name) }}
                    </div>
                    <span class="font-semibold text-slate-800 text-sm">{{ rev.user_name }}</span>
                  </div>
                  <span class="text-xs text-slate-400">{{ formatDate(rev.created_at) }}</span>
                </div>
                <div class="flex items-center gap-1 mb-2">
                  <svg v-for="i in 5" :key="i" class="w-4 h-4" :class="i <= rev.rating ? 'text-amber-400' : 'text-slate-200'" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.618l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                </div>
                <p class="text-slate-600 text-sm">{{ rev.comment }}</p>
              </div>
            </div>
            <div v-else class="text-center py-6 text-slate-500 text-sm">
              No reviews yet. Be the first to review this product!
            </div>
          </div>
        </div>
      </div>

      <!-- Related Products -->
      <div v-if="relatedProducts.length > 0" class="mt-16">
        <h2 class="text-2xl font-bold text-slate-800 mb-8">Related Products</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProductCard
            v-for="relatedProduct in relatedProducts"
            :key="relatedProduct.id"
            :product="relatedProduct"
          />
        </div>
      </div>

      <!-- Error State -->
      <div v-if="error" class="card p-12 text-center">
        <svg class="w-24 h-24 mx-auto text-red-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>
        <h3 class="text-xl font-semibold text-slate-800 mb-2">Product Not Found</h3>
        <p class="text-slate-600 mb-4">{{ error }}</p>
        <router-link to="/products" class="btn-primary">
          Browse Products
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';
import { useWishlistStore } from '../stores/wishlist';
import { useAuthStore } from '../stores/auth';
import { useToast } from '../composables/useToast';
import api from '../api/axios';
import ProductCard from '../components/ProductCard.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const wishlistStore = useWishlistStore();
const authStore = useAuthStore();
const { success, error: toastError } = useToast();

const product = ref(null);
const relatedProducts = ref([]);
const loading = ref(true);
const error = ref(null);
const quantity = ref(1);
const currentImage = ref('');
const selectedColor = ref('');
const selectedSize = ref('');

const reviews = ref([]);
const submittingReview = ref(false);
const newReview = ref({ rating: 5, comment: '' });

const defaultImage = 'https://via.placeholder.com/600x600?text=Product';
const colors = ['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00'];
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const productImages = computed(() => {
  if (product.value?.images && product.value.images.length > 0) {
    return product.value.images;
  }
  return [product.value?.image || defaultImage];
});

const formatPrice = (value) => {
  const price = Number(value);
  return Number.isFinite(price) ? price.toFixed(2) : '0.00';
};

const formatDiscount = (value) => {
  const discount = Number(value);
  if (!Number.isFinite(discount)) return '0';
  return discount.toFixed(2).replace(/\.?0+$/, '');
};

const productPrice = computed(() => Number(product.value?.price) || 0);

const discountPercent = computed(() => Number(product.value?.discount) || 0);

const hasDiscount = computed(() => discountPercent.value > 0);

const formattedDiscount = computed(() => formatDiscount(discountPercent.value));

const originalPrice = computed(() => formatPrice(productPrice.value));

const discountedPrice = computed(() => {
  if (!hasDiscount.value) {
    return originalPrice.value;
  }

  return formatPrice(productPrice.value * (1 - discountPercent.value / 100));
});

const inStock = computed(() => {
  return (product.value?.stock || 0) > 0;
});

const hasVariants = computed(() => {
  return product.value?.has_variants || false;
});

const isInWishlist = computed(() => {
  return wishlistStore.isInWishlist(parseInt(route.params.id));
});

const userHasReviewed = computed(() => {
  if (!authStore.isAuthenticated || !authStore.user) return false;
  return reviews.value.some(r => r.user_name === authStore.user.name);
});

const fetchReviews = async () => {
  try {
    const response = await fetch(`/api/products/${route.params.id}/reviews`);
    const data = await response.json();
    reviews.value = data || [];
  } catch (err) {
    console.error('Error fetching reviews:', err);
  }
};

const submitReview = async () => {
  if (newReview.value.rating < 1 || newReview.value.rating > 5) {
    toastError('Please select a rating between 1 and 5 stars');
    return;
  }
  if (!newReview.value.comment.trim()) {
    toastError('Please write a comment');
    return;
  }

  submittingReview.value = true;
  try {
    const response = await api.post(`/products/${route.params.id}/reviews`, {
      rating: newReview.value.rating,
      comment: newReview.value.comment
    });
    
    // Add the new review to the list
    reviews.value.unshift({
      id: response.data.id,
      rating: response.data.rating,
      comment: response.data.comment,
      user_name: response.data.user_name || authStore.user.name,
      created_at: response.data.created_at || new Date().toISOString()
    });

    // Update product rating and reviews count locally
    const totalRatingSum = (product.value.rating || 0) * (product.value.reviews_count || 0) + newReview.value.rating;
    product.value.reviews_count = (product.value.reviews_count || 0) + 1;
    product.value.rating = parseFloat((totalRatingSum / product.value.reviews_count).toFixed(1));

    success('Review submitted successfully!');
    newReview.value = { rating: 5, comment: '' };
  } catch (err) {
    console.error('Error submitting review:', err);
    toastError(err.response?.data?.message || 'Failed to submit review');
  } finally {
    submittingReview.value = false;
  }
};

const getInitials = (name) => {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const fetchProduct = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await fetch(`/api/products/${route.params.id}`);
    const data = await response.json();
    product.value = data;
    currentImage.value = data.image || defaultImage;
    
    // Fetch related products from same category
    if (data.category_id) {
      const relatedResponse = await fetch(`/api/products?category=${data.category_id}`);
      const relatedData = await relatedResponse.json();
      relatedProducts.value = (relatedData.data || relatedData || [])
        .filter(p => p.id !== data.id)
        .slice(0, 4);
    }
  } catch (err) {
    console.error('Error fetching product:', err);
    error.value = 'Failed to load product. Please try again.';
    // Use mock data if API fails
    product.value = {
      id: 1,
      name: 'Premium Wireless Headphones',
      price: 299.99,
      discount: 15,
      stock: 50,
      rating: 4.8,
      reviews_count: 124,
      description: 'Experience premium sound quality with our wireless headphones. Featuring active noise cancellation, 30-hour battery life, and comfortable over-ear design.',
      category: { name: 'Electronics' },
      image: 'https://via.placeholder.com/600x600?text=Headphones',
      has_varants: true
    };
    currentImage.value = defaultImage;
    relatedProducts.value = [
      { id: 2, name: 'Smart Watch Pro', price: 199.99, discount: 10, rating: 4.6, reviews_count: 89, category: { name: 'Electronics' } },
      { id: 3, name: 'Portable Speaker', price: 79.99, discount: 0, rating: 4.5, reviews_count: 67, category: { name: 'Electronics' } },
    ];
  } finally {
    loading.value = false;
  }
};

const increaseQuantity = () => {
  if (quantity.value < (product.value?.stock || 999)) {
    quantity.value++;
  }
};

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

const addToCart = async () => {
  if (!authStore.isAuthenticated) {
    toastError('Please login to add items to cart');
    router.push({ name: 'Login' });
    return;
  }

  try {
    await cartStore.addToCart(product.value.id, quantity.value);
    success(`${quantity.value} item(s) added to cart!`);
  } catch (err) {
    console.error('Error adding to cart:', err);
    toastError('Failed to add to cart. Please try again.');
  }
};

const addToWishlist = async () => {
  if (!authStore.isAuthenticated) {
    toastError('Please login to add items to wishlist');
    router.push({ name: 'Login' });
    return;
  }

  try {
    if (isInWishlist.value) {
      await wishlistStore.removeFromWishlist(product.value.id);
      success('Removed from wishlist');
    } else {
      await wishlistStore.addToWishlist(product.value.id);
      success('Added to wishlist!');
    }
  } catch (err) {
    console.error('Error updating wishlist:', err);
    toastError('Failed to update wishlist. Please try again.');
  }
};

watch(() => route.params.id, (newId) => {
  if (newId) {
    fetchProduct();
    fetchReviews();
  }
});

onMounted(() => {
  fetchProduct();
  fetchReviews();
});
</script>

<style scoped>
.product-detail {
  padding-top: 2rem;
}
</style>
