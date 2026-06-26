import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../api/axios';
import { useToast } from '../composables/useToast';

export const useWishlistStore = defineStore('wishlist', () => {
  const items = ref([]);
  const loading = ref(false);
  const { success, error: toastError } = useToast();

  const normalizeWishlistItem = (item) => {
    const product = item.product || {};
    const productId = Number(item.product_id ?? product.id ?? item.id);
    const price = Number(item.product_price ?? item.price ?? product.price ?? 0);

    return {
      ...item,
      product_id: productId,
      product_name: item.product_name ?? product.name ?? 'Unnamed product',
      product_price: Number.isFinite(price) ? price : 0,
      product_image: item.product_image ?? product.image ?? '',
      category_name: item.category_name ?? product.category?.name ?? null
    };
  };

  const fetchWishlist = async () => {
    loading.value = true;
    try {
      const response = await api.get('/wishlist');
      items.value = (response.data || []).map(normalizeWishlistItem);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      loading.value = false;
    }
  };

  const addToWishlist = async (productId) => {
    try {
      const response = await api.post('/wishlist', {
        product_id: productId
      });
      
      // Check if already in wishlist to avoid duplicates
      if (!items.value.some(item => item.product_id === productId)) {
        items.value.push(normalizeWishlistItem(response.data));
      }
      
      success('Added to wishlist!');
      return response.data;
    } catch (error) {
      toastError(error.response?.data?.message || 'Failed to add to wishlist. Please login first.');
      throw error;
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await api.delete(`/wishlist/${productId}`);
      items.value = items.value.filter(item => item.product_id !== productId);
      success('Removed from wishlist');
    } catch (error) {
      toastError(error.response?.data?.message || 'Failed to remove from wishlist.');
      throw error;
    }
  };

  const clearWishlist = async () => {
    try {
      await api.delete('/wishlist');
      items.value = [];
      success('Wishlist cleared');
    } catch (error) {
      toastError(error.response?.data?.message || 'Failed to clear wishlist.');
      throw error;
    }
  };

  const isInWishlist = (productId) => {
    return items.value.some(item => item.product_id === productId);
  };

  const moveToCart = async (productId, cartStore) => {
    try {
      await cartStore.addToCart(productId, 1);
      await removeFromWishlist(productId);
      success('Moved to cart!');
    } catch (error) {
      toastError('Failed to move to cart.');
      throw error;
    }
  };

  return {
    items,
    loading,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    moveToCart
  };
});
