<template>
  <div class="cart-view min-h-screen bg-slate-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-slate-800 mb-8">Shopping Cart</h1>

      <LoadingSpinner v-if="loading" />

      <div v-else-if="items.length === 0" class="card p-12 text-center">
        <svg class="w-24 h-24 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
        <h3 class="text-xl font-semibold text-slate-800 mb-2">Your cart is empty</h3>
        <p class="text-slate-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
        <router-link to="/products" class="btn-primary">
          Browse Products
        </router-link>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Cart Items -->
        <div class="lg:col-span-2 space-y-4">
          <div
            v-for="item in items"
            :key="item.id"
            class="card p-4 flex gap-4"
          >
            <div class="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100">
              <img
                :src="item.product_image || defaultImage"
                :alt="item.product_name"
                class="w-full h-full object-cover"
              >
            </div>
            
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-slate-800 mb-1 truncate">{{ item.product_name }}</h3>
              <p class="text-sm text-slate-500 mb-2">{{ item.category || 'Product' }}</p>
              <p class="text-lg font-bold text-primary-600">${{ formatPrice(item.price) }}</p>
            </div>

            <div class="flex flex-col items-end gap-2">
              <div class="flex items-center gap-2">
                <button
                  @click="decreaseQuantity(item)"
                  :disabled="item.quantity <= 1"
                  class="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                  </svg>
                </button>
                <span class="w-12 text-center font-semibold">{{ item.quantity }}</span>
                <button
                  @click="increaseQuantity(item)"
                  class="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                </button>
              </div>
              
              <button
                @click="removeFromCart(item.product_id)"
                class="text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                Remove
              </button>
            </div>

            <div class="text-right">
              <p class="text-lg font-bold text-slate-800">${{ formatPrice(item.price * item.quantity) }}</p>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="card p-6 sticky top-24">
            <h2 class="text-xl font-bold text-slate-800 mb-6">Order Summary</h2>
            
            <div class="space-y-4 mb-6">
              <div class="flex justify-between text-slate-600">
                <span>Subtotal ({{ cartCount }} items)</span>
                <span class="font-semibold">${{ formatPrice(cartTotal) }}</span>
              </div>
              
              <div class="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span class="font-semibold">{{ shipping === 0 ? 'FREE' : '$' + formatPrice(shipping) }}</span>
              </div>
              
              <div v-if="discount > 0" class="flex justify-between text-green-600">
                <span>Discount</span>
                <span class="font-semibold">-${{ formatPrice(discount) }}</span>
              </div>
              
              <div class="border-t border-slate-200 pt-4">
                <div class="flex justify-between text-lg font-bold text-slate-800">
                  <span>Total</span>
                  <span>${{ formatPrice(finalTotal) }}</span>
                </div>
              </div>
            </div>

            <!-- Promo Code -->
            <div class="mb-6">
              <label class="block text-sm font-semibold text-slate-700 mb-2">Promo Code</label>
              <div class="flex gap-2">
                <input
                  v-model="promoCode"
                  type="text"
                  placeholder="Enter code"
                  class="flex-1 input-field"
                >
                <button
                  @click="applyPromoCode"
                  class="btn-secondary px-4"
                >
                  Apply
                </button>
              </div>
            </div>

            <router-link to="/checkout" class="btn-primary w-full block text-center">
              Proceed to Checkout
            </router-link>

            <router-link to="/products" class="block text-center mt-4 text-primary-600 hover:text-primary-700 font-medium">
              Continue Shopping
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useCartStore } from '../stores/cart';
import { useToast } from '../composables/useToast';
import LoadingSpinner from '../components/LoadingSpinner.vue';

const cartStore = useCartStore();
const { success, error: toastError } = useToast();

const items = ref([]);
const loading = ref(true);
const shipping = ref(9.99);
const discount = ref(0);
const promoCode = ref('');

const defaultImage = 'https://via.placeholder.com/100x100?text=Product';

const formatPrice = (value) => {
  const price = Number(value);
  return Number.isFinite(price) ? price.toFixed(2) : '0.00';
};

const cartCount = computed(() => items.value.reduce((total, item) => total + item.quantity, 0));
const cartTotal = computed(() => items.value.reduce((total, item) => total + (item.price * item.quantity), 0));
const finalTotal = computed(() => Math.max(0, cartTotal.value + shipping.value - discount.value));

const fetchCart = async () => {
  loading.value = true;
  try {
    await cartStore.fetchCart();
    items.value = cartStore.items;
  } catch (err) {
    console.error('Error fetching cart:', err);
    // Use mock data if API fails
    items.value = [
      { id: 1, product_id: 1, product_name: 'Premium Wireless Headphones', product_image: 'https://via.placeholder.com/100x100?text=Headphones', price: 299.99, quantity: 1, category: 'Electronics' },
      { id: 2, product_id: 2, product_name: 'Smart Watch Pro', product_image: 'https://via.placeholder.com/100x100?text=Watch', price: 199.99, quantity: 2, category: 'Electronics' },
    ];
  } finally {
    loading.value = false;
  }
};

const increaseQuantity = async (item) => {
  try {
    await cartStore.updateQuantity(item.product_id, item.quantity + 1);
    items.value = cartStore.items;
    success('Quantity updated');
  } catch (err) {
    console.error('Error updating quantity:', err);
    toastError('Failed to update quantity');
  }
};

const decreaseQuantity = async (item) => {
  if (item.quantity > 1) {
    try {
      await cartStore.updateQuantity(item.product_id, item.quantity - 1);
      items.value = cartStore.items;
      success('Quantity updated');
    } catch (err) {
      console.error('Error updating quantity:', err);
      toastError('Failed to update quantity');
    }
  }
};

const removeFromCart = async (productId) => {
  try {
    await cartStore.removeFromCart(productId);
    items.value = cartStore.items;
    success('Item removed from cart');
  } catch (err) {
    console.error('Error removing from cart:', err);
    toastError('Failed to remove item');
  }
};

const applyPromoCode = () => {
  if (promoCode.value.toUpperCase() === 'SAVE20') {
    discount.value = cartTotal.value * 0.2;
    success('Promo code applied! 20% discount.');
  } else if (promoCode.value.toUpperCase() === 'FREE') {
    shipping.value = 0;
    success('Free shipping applied!');
  } else {
    toastError('Invalid promo code');
  }
};

onMounted(() => {
  fetchCart();
});
</script>

<style scoped>
.cart-view {
  padding-top: 2rem;
}
</style>
