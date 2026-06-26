<template>
  <div class="order-history-view min-h-screen bg-slate-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-slate-800 mb-8">Order History</h1>

      <LoadingSpinner v-if="loading" />

      <div v-else-if="orders.length === 0" class="card p-12 text-center">
        <svg class="w-24 h-24 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
        </svg>
        <h3 class="text-xl font-semibold text-slate-800 mb-2">No orders yet</h3>
        <p class="text-slate-600 mb-6">You haven't placed any orders. Start shopping now!</p>
        <router-link to="/products" class="btn-primary">
          Start Shopping
        </router-link>
      </div>

      <div v-else class="space-y-6">
        <div
          v-for="order in orders"
          :key="order.id"
          class="card overflow-hidden"
        >
          <!-- Order Header -->
          <div class="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 class="text-lg font-bold text-slate-800">Order #{{ order.id }}</h3>
              <p class="text-sm text-slate-500">{{ formatDate(order.created_at) }}</p>
            </div>
            <div class="flex items-center gap-3">
              <span :class="getStatusBadgeClass(order.status)" class="badge">
                {{ formatStatus(order.status) }}
              </span>
              <button
                @click="toggleOrderDetails(order.id)"
                class="text-primary-600 hover:text-primary-700 font-medium text-sm"
              >
                {{ expandedOrders.includes(order.id) ? 'Hide Details' : 'View Details' }}
              </button>
            </div>
          </div>

          <!-- Order Timeline -->
          <div class="p-6 bg-slate-50">
            <div class="flex items-center justify-between">
              <div class="flex flex-col items-center gap-2" :class="{ 'opacity-100': isStatusReached(order.status, 'pending'), 'opacity-40': !isStatusReached(order.status, 'pending') }">
                <div class="w-10 h-10 rounded-full flex items-center justify-center" :class="isStatusReached(order.status, 'pending') ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-400'">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                </div>
                <span class="text-xs font-medium text-slate-600">Pending</span>
              </div>
              
              <div class="flex-1 h-1 bg-slate-200 mx-2">
                <div class="h-full bg-primary-600 transition-all duration-500" :style="{ width: isStatusReached(order.status, 'processing') ? '100%' : '0%' }"></div>
              </div>
              
              <div class="flex flex-col items-center gap-2" :class="{ 'opacity-100': isStatusReached(order.status, 'processing'), 'opacity-40': !isStatusReached(order.status, 'processing') }">
                <div class="w-10 h-10 rounded-full flex items-center justify-center" :class="isStatusReached(order.status, 'processing') ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-400'">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                  </svg>
                </div>
                <span class="text-xs font-medium text-slate-600">Processing</span>
              </div>
              
              <div class="flex-1 h-1 bg-slate-200 mx-2">
                <div class="h-full bg-primary-600 transition-all duration-500" :style="{ width: isStatusReached(order.status, 'shipped') ? '100%' : '0%' }"></div>
              </div>
              
              <div class="flex flex-col items-center gap-2" :class="{ 'opacity-100': isStatusReached(order.status, 'shipped'), 'opacity-40': !isStatusReached(order.status, 'shipped') }">
                <div class="w-10 h-10 rounded-full flex items-center justify-center" :class="isStatusReached(order.status, 'shipped') ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-400'">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                  </svg>
                </div>
                <span class="text-xs font-medium text-slate-600">Shipped</span>
              </div>
              
              <div class="flex-1 h-1 bg-slate-200 mx-2">
                <div class="h-full bg-primary-600 transition-all duration-500" :style="{ width: isStatusReached(order.status, 'delivered') ? '100%' : '0%' }"></div>
              </div>
              
              <div class="flex flex-col items-center gap-2" :class="{ 'opacity-100': isStatusReached(order.status, 'delivered'), 'opacity-40': !isStatusReached(order.status, 'delivered') }">
                <div class="w-10 h-10 rounded-full flex items-center justify-center" :class="isStatusReached(order.status, 'delivered') ? 'bg-green-600 text-white' : 'bg-slate-200 text-slate-400'">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span class="text-xs font-medium text-slate-600">Delivered</span>
              </div>
            </div>
          </div>

          <!-- Expanded Details -->
          <div v-if="expandedOrders.includes(order.id)" class="p-6 border-t border-slate-200">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- Order Items -->
              <div>
                <h4 class="font-semibold text-slate-800 mb-4">Order Items</h4>
                <div class="space-y-3">
                  <div
                    v-for="item in order.items"
                    :key="item.id"
                    class="flex items-center gap-4 p-3 bg-slate-50 rounded-lg"
                  >
                    <div class="w-16 h-16 bg-slate-200 rounded-lg overflow-hidden">
                      <img
                        :src="item.product_image || defaultImage"
                        :alt="item.product_name"
                        class="w-full h-full object-cover"
                      >
                    </div>
                    <div class="flex-1">
                      <p class="font-medium text-slate-800">{{ item.product_name }}</p>
                      <p class="text-sm text-slate-500">Qty: {{ item.quantity }}</p>
                    </div>
                    <p class="font-bold text-primary-600">${{ (item.price * item.quantity).toFixed(2) }}</p>
                  </div>
                </div>
              </div>

              <!-- Order Summary & Shipping -->
              <div class="space-y-6">
                <div>
                  <h4 class="font-semibold text-slate-800 mb-4">Order Summary</h4>
                  <div class="space-y-2">
                    <div class="flex justify-between text-slate-600">
                      <span>Subtotal</span>
                      <span>${{ (order.subtotal || 0).toFixed(2) }}</span>
                    </div>
                    <div class="flex justify-between text-slate-600">
                      <span>Shipping</span>
                      <span>${{ (order.shipping_cost ||  0).toFixed(2) }}</span>
                    </div>
                    <div class="flex justify-between text-slate-600">
                      <span>Tax</span>
                      <span>${{ (order.tax || 0).toFixed(2) }}</span>
                    </div>
                    <div class="flex justify-between text-lg font-bold text-slate-800 pt-2 border-t border-slate-200">
                      <span>Total</span>
                      <span>${{ (order.total_amount || 0).toFixed(2) }}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="font-semibold text-slate-800 mb-4">Shipping Address</h4>
                  <div class="text-sm text-slate-600 space-y-1">
                    <p class="font-medium text-slate-800">{{ order.full_name }}</p>
                    <p>{{ order.address }}</p>
                    <p>{{ order.city }}, {{ order.state }} {{ order.postal_code }}</p>
                    <p>{{ order.country }}</p>
                    <p>{{ order.phone }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner.vue';

const orders = ref([]);
const loading = ref(true);
const expandedOrders = ref([]);

const defaultImage = 'https://via.placeholder.com/100x100?text=Product';

const fetchOrders = async () => {
  loading.value = true;
  try {
    const response = await api.get('/orders');
    orders.value = response.data || [];
  } catch (err) {
    console.error('Error fetching orders:', err);
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatStatus = (status) => {
  const statusMap = {
    pending: 'Pending',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled'
  };
  return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1);
};

const getStatusBadgeClass = (status) => {
  const classMap = {
    pending: 'badge-warning',
    processing: 'badge-info',
    shipped: 'badge-primary',
    delivered: 'badge-success',
    cancelled: 'badge-danger'
  };
  return classMap[status] || 'badge-secondary';
};

const isStatusReached = (currentStatus, checkStatus) => {
  const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
  const currentIndex = statusOrder.indexOf(currentStatus);
  const checkIndex = statusOrder.indexOf(checkStatus);
  
  if (currentStatus === 'cancelled') return false;
  return checkIndex <= currentIndex;
};

const toggleOrderDetails = (orderId) => {
  const index = expandedOrders.value.indexOf(orderId);
  if (index > -1) {
    expandedOrders.value.splice(index, 1);
  } else {
    expandedOrders.value.push(orderId);
  }
};

onMounted(() => {
  fetchOrders();
});
</script>

<style scoped>
.order-history-view {
  padding-top: 2rem;
}
</style>
