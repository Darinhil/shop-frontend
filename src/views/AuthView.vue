<template>
  <div class="auth-view min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center gap-3 mb-4">
          <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
          </div>
          <span class="text-3xl font-bold text-white">ShopHub</span>
        </div>
        <p class="text-white/80">Welcome back! Please login to continue.</p>
      </div>

      <!-- Auth Card -->
      <div class="card p-8">
        <!-- Tabs -->
        <div class="flex mb-8 bg-slate-100 rounded-xl p-1">
          <button
            @click="isLogin = true"
            class="flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300"
            :class="isLogin ? 'bg-white text-primary-600 shadow-md' : 'text-slate-600 hover:text-slate-800'"
          >
            Login
          </button>
          <button
            @click="isLogin = false"
            class="flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300"
            :class="!isLogin ? 'bg-white text-primary-600 shadow-md' : 'text-slate-600 hover:text-slate-800'"
          >
            Register
          </button>
        </div>

        <!-- Login Form -->
        <form v-if="isLogin" @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
            <Input
              v-model="loginForm.email"
              type="email"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Password</label>
            <Input
              v-model="loginForm.password"
              type="password"
              placeholder="Enter your password"
              required
            />
          </div>

          <div class="flex items-center justify-between">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" v-model="rememberMe" class="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500">
              <span class="text-sm text-slate-600">Remember me</span>
            </label>
            <a href="#" class="text-sm text-primary-600 hover:text-primary-700 font-medium">Forgot password?</a>
          </div>

          <Button
            type="submit"
            variant="primary"
            :loading="loading"
            loading-text="Logging in..."
            full-width
          >
            Sign In
          </Button>

          <div v-if="error" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
            {{ error }}
          </div>
        </form>

        <!-- Register Form -->
        <form v-else @submit.prevent="handleRegister" class="space-y-6">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
            <Input
              v-model="registerForm.name"
              type="text"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
            <Input
              v-model="registerForm.email"
              type="email"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Password</label>
            <Input
              v-model="registerForm.password"
              type="password"
              placeholder="Create a password"
              required
              minlength="8"
            />
            <p class="text-xs text-slate-500 mt-1">Must be at least 8 characters</p>
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Confirm Password</label>
            <Input
              v-model="registerForm.password_confirmation"
              type="password"
              placeholder="Confirm your password"
              required
              :error="passwordMismatch ? 'Passwords do not match' : ''"
            />
          </div>

          <div class="flex items-start gap-2">
            <input type="checkbox" v-model="agreeToTerms" required class="w-4 h-4 mt-1 rounded border-slate-300 text-primary-600 focus:ring-primary-500">
            <span class="text-sm text-slate-600">I agree to the <a href="#" class="text-primary-600 hover:text-primary-700">Terms of Service</a> and <a href="#" class="text-primary-600 hover:text-primary-700">Privacy Policy</a></span>
          </div>

          <Button
            type="submit"
            variant="primary"
            :loading="loading"
            loading-text="Creating account..."
            full-width
          >
            Create Account
          </Button>

          <div v-if="error" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
            {{ error }}
          </div>
          
          <div v-if="successMessage" class="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl text-sm">
            {{ successMessage }}
          </div>
        </form>

        <!-- Social Login -->
        <div class="mt-8">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-slate-200"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 bg-white text-slate-500">Or continue with</span>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-2 gap-4">
            <button type="button" class="flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
              <svg class="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span class="text-sm font-medium text-slate-700">Google</span>
            </button>
            <button type="button" class="flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span class="text-sm font-medium text-slate-700">Facebook</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Back to Home -->
      <div class="text-center mt-6">
        <router-link to="/" class="text-white/80 hover:text-white text-sm font-medium">
          <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Home
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import Input from '../components/Input.vue';
import Button from '../components/Button.vue';

const router = useRouter();
const authStore = useAuthStore();

const isLogin = ref(true);
const loading = ref(false);
const error = ref('');
const successMessage = ref('');
const rememberMe = ref(false);
const agreeToTerms = ref(false);

const loginForm = ref({
  email: '',
  password: ''
});

const registerForm = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
});

const passwordMismatch = computed(() => {
  return registerForm.value.password && registerForm.value.password_confirmation && 
         registerForm.value.password !== registerForm.value.password_confirmation;
});

const handleLogin = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    await authStore.loginUser(loginForm.value);
    router.push({ name: 'Home' });
  } catch (err) {
    error.value = err.response?.data?.message || 'Login failed. Please check your credentials and try again.';
  } finally {
    loading.value = false;
  }
};

const handleRegister = async () => {
  loading.value = true;
  error.value = '';
  successMessage.value = '';

  if (registerForm.value.password !== registerForm.value.password_confirmation) {
    error.value = 'Passwords do not match.';
    loading.value = false;
    return;
  }

  try {
    await authStore.registerUser(registerForm.value);
    registerForm.value = {
      name: '',
      email: '',
      password: '',
      password_confirmation: ''
    };
    agreeToTerms.value = false;
    router.push({ name: 'Home' });
  } catch (err) {
    error.value = err.response?.data?.message || 'Registration failed. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.auth-view {
  padding: 2rem 1rem;
}
</style>
