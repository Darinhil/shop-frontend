<template>
  <div class="checkout-view min-h-screen bg-slate-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-slate-800 mb-8">Checkout</h1>

      <LoadingSpinner v-if="loading" />

      <div v-else-if="items.length === 0" class="card p-12 text-center">
        <svg class="w-24 h-24 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
        <h3 class="text-xl font-semibold text-slate-800 mb-2">Your cart is empty</h3>
        <p class="text-slate-600 mb-6">Add items to your cart before checkout.</p>
        <router-link to="/products" class="btn-primary">
          Browse Products
        </router-link>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Shipping & Payment Form -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Shipping Information -->
          <div class="card p-6">
            <h2 class="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              Shipping Information
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">Full Name *</label>
                <Input
                  v-model="form.full_name"
                  type="text"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">Email *</label>
                <Input
                  v-model="form.email"
                  type="email"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">Phone *</label>
                <Input
                  v-model="form.phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">Address *</label>
                <Input
                  v-model="form.address"
                  type="text"
                  placeholder="Enter your street address"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">City *</label>
                <Input
                  v-model="form.city"
                  type="text"
                  placeholder="City"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">State *</label>
                <Input
                  v-model="form.state"
                  type="text"
                  placeholder="State"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">Postal Code *</label>
                <Input
                  v-model="form.postal_code"
                  type="text"
                  placeholder="Postal code"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">Country *</label>
                <Input
                  v-model="form.country"
                  type="text"
                  placeholder="Country"
                  required
                />
              </div>
            </div>

            <div class="mt-4">
              <label class="block text-sm font-semibold text-slate-700 mb-2">Order Notes (Optional)</label>
              <textarea
                v-model="form.notes"
                rows="3"
                placeholder="Any special instructions for your order"
                class="input-field resize-none"
              ></textarea>
            </div>
          </div>

          <!-- Payment Method -->
          <div class="card p-6">
            <h2 class="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
              </svg>
              Payment Method
            </h2>

            <div class="space-y-3">
              <label class="flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-300" :class="form.payment_method === 'card' ? 'border-primary-500 bg-primary-50' : 'border-slate-200 hover:border-slate-300'">
                <input type="radio" v-model="form.payment_method" value="card" class="w-4 h-4 text-primary-600">
                <div class="flex items-center gap-2">
                  <svg class="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                  </svg>
                  <span class="font-medium">Credit / Debit Card</span>
                </div>
              </label>

              <label class="flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-300" :class="form.payment_method === 'paypal' ? 'border-primary-500 bg-primary-50' : 'border-slate-200 hover:border-slate-300'">
                <input type="radio" v-model="form.payment_method" value="paypal" class="w-4 h-4 text-primary-600">
                <div class="flex items-center gap-2">
                  <svg class="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.447 6.797H9.63a.781.781 0 0 0-.771.655l-.74 4.722-.237 1.504a.641.641 0 0 1-.633.541H4.3a.641.641 0 0 1-.633-.74l.916-5.835a.641.641 0 0 1 .633-.541h2.66c2.6 0 4.615-.543 5.735-1.81 1.01-1.15 1.304-2.42 1.012-4.287-.023-.143-.047-.288-.077-.437-.983-5.05-4.349-6.797-8.447-6.797H5.998a.781.781 0 0 0-.771.655l-.74 4.722-.237 1.504z"/>
                  </svg>
                  <span class="font-medium">PayPal</span>
                </div>
              </label>

              <label class="flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-300" :class="form.payment_method === 'cod' ? 'border-primary-500 bg-primary-50' : 'border-slate-200 hover:border-slate-300'">
                <input type="radio" v-model="form.payment_method" value="cod" class="w-4 h-4 text-primary-600">
                <div class="flex items-center gap-2">
                  <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                  <span class="font-medium">Cash on Delivery</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="card p-6 sticky top-24">
            <h2 class="text-xl font-bold text-slate-800 mb-6">Order Summary</h2>
            
            <div class="space-y-4 max-h-64 overflow-y-auto mb-6">
              <div
                v-for="item in items"
                :key="item.id"
                class="flex gap-3 pb-4 border-b border-slate-100 last:border-0"
              >
                <div class="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100">
                  <img
                    :src="item.product_image || defaultImage"
                    :alt="item.product_name"
                    class="w-full h-full object-cover"
                  >
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-medium text-slate-800 text-sm truncate">{{ item.product_name }}</p>
                  <p class="text-xs text-slate-500">Qty: {{ item.quantity }}</p>
                  <p class="font-bold text-primary-600">${{ formatPrice(item.price * item.quantity) }}</p>
                </div>
              </div>
            </div>

            <div class="space-y-4 mb-6 pt-4 border-t border-slate-200">
              <div class="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span class="font-semibold">${{ formatPrice(cartTotal) }}</span>
              </div>
              
              <div class="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span class="font-semibold">{{ shipping === 0 ? 'FREE' : '$' + formatPrice(shipping) }}</span>
              </div>
              
              <div class="flex justify-between text-slate-600">
                <span>Tax</span>
                <span class="font-semibold">${{ formatPrice(tax) }}</span>
              </div>
              
              <div class="border-t border-slate-200 pt-4">
                <div class="flex justify-between text-lg font-bold text-slate-800">
                  <span>Total</span>
                  <span>${{ formatPrice(finalTotal) }}</span>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              :loading="submitting"
              loading-text="Processing..."
              full-width
            >
              Place Order
            </Button>

            <p v-if="error" class="mt-4 text-sm text-red-600 text-center">{{ error }}</p>

            <p class="mt-4 text-xs text-slate-500 text-center">
              By placing this order, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';
import { useAuthStore } from '../stores/auth';
import { useToast } from '../composables/useToast';
import api from '../api/axios';
import Input from '../components/Input.vue';
import Button from '../components/Button.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';

const router = useRouter();
const cartStore = useCartStore();
const authStore = useAuthStore();
const { success, error: toastError } = useToast();

const items = ref([]);
const loading = ref(true);
const submitting = ref(false);
const error = ref('');
const shipping = ref(9.99);
const tax = ref(0);

const defaultImage = 'https://via.placeholder.com/100x100?text=Product';

const formatPrice = (value) => {
  const price = Number(value);
  return Number.isFinite(price) ? price.toFixed(2) : '0.00';
};

const form = ref({
  full_name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  postal_code: '',
  country: '',
  notes: '',
  payment_method: 'card'
});

const cartTotal = computed(() => items.value.reduce((total, item) => total + (item.price * item.quantity), 0));
const finalTotal = computed(() => cartTotal.value + shipping.value + tax.value);

const fetchCart = async () => {
  loading.value = true;
  try {
    await cartStore.fetchCart();
    items.value = cartStore.items;
    
    // Pre-fill form with user data if available
    if (authStore.user) {
      form.value.full_name = authStore.user.name || '';
      form.value.email = authStore.user.email || '';
    }
  } catch (err) {
    console.error('Error fetching cart:', err);
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async () => {
  submitting.value = true;
  error.value = '';

  try {
    const payload = {
      ...form.value,
      items: items.value.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity
      })),
      subtotal: cartTotal.value,
      shipping_cost: shipping.value,
      tax: tax.value,
      total_amount: finalTotal.value
    };

    const response = await api.post('/orders', payload);
    
    cartStore.items = [];
    
    success('Order placed successfully!');
    router.push({ name: 'Orders', query: { order: response.data.order_id } });
  } catch (err) {
    console.error('Error placing order:', err);
    error.value = err.response?.data?.message || 'Failed to place order. Please try again.';
    toastError('Failed to place order. Please try again.');
  } finally {
    submitting.value = false;
  }
};

onMounted(() => {
  fetchCart();
});
</script>

<style scoped>
.checkout-view {
  padding-top: 2rem;
}
</style>
