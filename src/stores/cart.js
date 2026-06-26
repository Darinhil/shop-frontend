import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../api/axios';
import { useToast } from '../composables/useToast';

export const useCartStore = defineStore('cart', () => {
  const items = ref([]);
  const loading = ref(false);
  const { success, error: toastError } = useToast();

  const cartCount = computed(() => items.value.reduce((total, item) => total + item.quantity, 0));
  const cartTotal = computed(() => items.value.reduce((total, item) => total + (item.price * item.quantity), 0));

  const fetchCart = async () => {
    loading.value = true;
    try {
      const response = await api.get('/cart');
      items.value = response.data;
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      loading.value = false;
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const response = await api.post('/cart', {
        product_id: productId,
        quantity: quantity
      });
      
      // Update local state with response
      const existingItemIndex = items.value.findIndex(item => item.product_id === productId);
      if (existingItemIndex !== -1) {
        items.value[existingItemIndex].quantity = response.data.quantity;
      } else {
        items.value.push(response.data);
      }
      
      success('Added to cart!');
      return response.data;
    } catch (error) {
      toastError(error.response?.data?.message || 'Failed to add to cart. Please login first.');
      throw error;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const response = await api.put(`/cart/${productId}`, {
        quantity: quantity
      });
      
      const itemIndex = items.value.findIndex(item => item.product_id === productId);
      if (itemIndex !== -1) {
        if (quantity === 0) {
          items.value.splice(itemIndex, 1);
        } else {
          items.value[itemIndex].quantity = response.data.quantity;
        }
      }
      
      return response.data;
    } catch (error) {
      toastError(error.response?.data?.message || 'Failed to update quantity.');
      throw error;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await api.delete(`/cart/${productId}`);
      items.value = items.value.filter(item => item.product_id !== productId);
      success('Item removed from cart');
    } catch (error) {
      toastError(error.response?.data?.message || 'Failed to remove item.');
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart');
      items.value = [];
      success('Cart cleared');
    } catch (error) {
      toastError(error.response?.data?.message || 'Failed to clear cart.');
      throw error;
    }
  };

  return {
    items,
    loading,
    cartCount,
    cartTotal,
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart
  };
});
