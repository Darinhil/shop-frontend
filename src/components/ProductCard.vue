<template>
  <div class="card group cursor-pointer overflow-hidden" @click="goToProduct">
    <div class="relative aspect-square overflow-hidden">
      <img
        :src="product.image || defaultImage"
        :alt="product.name"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div class="absolute top-3 left-3 flex gap-2">
        <span v-if="hasDiscount" class="badge badge-danger">-{{ formattedDiscount }}%</span>
        <span v-if="product.featured" class="badge badge-accent">Featured</span>
      </div>
      <button
        @click.stop="toggleWishlist"
        class="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-300 transform hover:scale-110"
        :class="{ 'text-red-500': isInWishlist, 'text-slate-400': !isInWishlist }"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </button>
      <div class="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          @click.stop="addToCart"
          class="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-xl font-semibold shadow-lg transition-all duration-300 transform hover:-translate-y-1"
        >
          Add to Cart
        </button>
      </div>
    </div>
    <div class="p-4">
      <p class="text-sm text-slate-500 mb-1">{{ product.category?.name || 'Category' }}</p>
      <h3 class="font-semibold text-slate-800 mb-2 line-clamp-2 h-12">{{ product.name }}</h3>
      <div class="flex items-center gap-2 mb-2">
        <div class="flex items-center">
          <svg class="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.618l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
          <span class="text-sm text-slate-600 ml-1">{{ product.rating || 4.5 }}</span>
        </div>
        <span class="text-xs text-slate-400">({{ product.reviews_count || 0 }})</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-xl font-bold text-primary-600">${{ discountedPrice }}</span>
        <span v-if="hasDiscount" class="text-sm text-slate-400 line-through">${{ originalPrice }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useWishlistStore } from '../stores/wishlist'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

const defaultImage = 'https://via.placeholder.com/400x400?text=Product'

const formatPrice = (value) => {
  const price = Number(value)
  return Number.isFinite(price) ? price.toFixed(1) : '0.00'
}

const formatDiscount = (value) => {
  const discount = Number(value)
  if (!Number.isFinite(discount)) return '0'
  return discount.toFixed(2).replace(/\.?0+$/, '')
}

const productPrice = computed(() => Number(props.product.price) || 0)

const discountPercent = computed(() => Number(props.product.discount) || 0)

const hasDiscount = computed(() => discountPercent.value > 0)

const formattedDiscount = computed(() => formatDiscount(discountPercent.value))

const originalPrice = computed(() => formatPrice(productPrice.value))

const discountedPrice = computed(() => {
  if (!hasDiscount.value) {
    return originalPrice.value
  }

  return formatPrice(productPrice.value * (1 - discountPercent.value / 100))
})

const isInWishlist = computed(() => {
  return wishlistStore.isInWishlist(props.product.id)
})

const goToProduct = () => {
  router.push(`/products/${props.product.id}`)
}

const addToCart = async () => {
  await cartStore.addToCart(props.product.id)
}


const toggleWishlist = () => {
  if (isInWishlist.value) {
    wishlistStore.removeFromWishlist(props.product.id)
  } else {
    wishlistStore.addToWishlist(props.product.id)
  }
}
</script>
