<template>
  <div class="profile-view min-h-screen bg-slate-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-slate-800 mb-8">My Profile</h1>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Sidebar -->
        <div class="lg:col-span-1">
          <div class="card p-6">
            <div class="text-center mb-6">
              <div class="w-24 h-24 mx-auto bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center mb-4">
                <span class="text-3xl font-bold text-white">{{ userInitials }}</span>
              </div>
              <h3 class="text-lg font-semibold text-slate-800">{{ profileForm.name || 'User' }}</h3>
              <p class="text-sm text-slate-500">{{ profileForm.email || '' }}</p>
            </div>

            <nav class="space-y-2">
              <button
                @click="activeTab = 'profile'"
                class="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300"
                :class="activeTab === 'profile' ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:bg-slate-100'"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                Profile Information
              </button>
              <button
                @click="activeTab = 'password'"
                class="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300"
                :class="activeTab === 'password' ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:bg-slate-100'"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                Change Password
              </button>
            </nav>

            <div class="mt-6 pt-6 border-t border-slate-200">
              <button
                @click="handleLogout"
                class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="lg:col-span-2">
          <!-- Profile Information Tab -->
          <div v-if="activeTab === 'profile'" class="card p-6">
            <h2 class="text-xl font-bold text-slate-800 mb-6">Profile Information</h2>
            
            <form @submit.prevent="handleProfileUpdate" class="space-y-6">
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                <Input
                  v-model="profileForm.name"
                  type="text"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                <Input
                  v-model="profileForm.email"
                  type="email"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                :loading="loading"
                loading-text="Updating..."
              >
                Update Profile
              </Button>


              <div v-if="success" class="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl text-sm">
                {{ success }}
              </div>
              
              <div v-if="error" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                {{ error }}
              </div>
            </form>
          </div>

          <!-- Change Password Tab -->
          <div v-if="activeTab === 'password'" class="card p-6">
            <h2 class="text-xl font-bold text-slate-800 mb-6">Change Password</h2>
            
            <form @submit.prevent="handlePasswordUpdate" class="space-y-6">
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">Current Password</label>
                <Input
                  v-model="passwordForm.current_password"
                  type="password"
                  placeholder="Enter your current password"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">New Password</label>
                <Input
                  v-model="passwordForm.new_password"
                  type="password"
                  placeholder="Enter your new password"
                  required
                  minlength="8"
                />
                <p class="text-xs text-slate-500 mt-1">Must be at least 8 characters</p>
              </div>

              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">Confirm New Password</label>
                <Input
                  v-model="passwordForm.new_password_confirmation"
                  type="password"
                  placeholder="Confirm your new password"
                  required
                  :error="passwordMismatch ? 'Passwords do not match' : ''"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                :loading="loading"
                loading-text="Updating..."
              >
                Change Password
              </Button>

              <div v-if="success" class="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl text-sm">
                {{ success }}
              </div>
              
              <div v-if="error" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                {{ error }}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useToast } from '../composables/useToast';
import Input from '../components/Input.vue';
import Button from '../components/Button.vue';

const router = useRouter();
const authStore = useAuthStore();
const { success: toastSuccess, error: toastError } = useToast();

const activeTab = ref('profile');
const loading = ref(false);
const success = ref('');
const error = ref('');

const profileForm = ref({
  name: '',
  email: ''
});

const passwordForm = ref({
  current_password: '',
  new_password: '',
  new_password_confirmation: ''
});

const userInitials = computed(() => {
  const name = profileForm.value.name || 'User';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
});

const passwordMismatch = computed(() => {
  return passwordForm.value.new_password && passwordForm.value.new_password_confirmation && 
         passwordForm.value.new_password !== passwordForm.value.new_password_confirmation;
});

const loadUserProfile = async () => {
  try {
    await authStore.fetchProfile();
    if (authStore.user) {
      profileForm.value.name = authStore.user.name || '';
      profileForm.value.email = authStore.user.email || '';
    }
  } catch (err) {
    console.error('Error loading profile:', err);
  }
};

const handleProfileUpdate = async () => {
  loading.value = true;
  success.value = '';
  error.value = '';

  try {
    await authStore.updateProfile(profileForm.value);
    success.value = 'Profile updated successfully!';
    toastSuccess('Profile updated successfully!');
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to update profile';
    toastError('Failed to update profile');
  } finally {
    loading.value = false;
  }
};

const handlePasswordUpdate = async () => {
  loading.value = true;
  success.value = '';
  error.value = '';

  if (passwordForm.value.new_password !== passwordForm.value.new_password_confirmation) {
    error.value = 'New passwords do not match.';
    loading.value = false;
    return;
  }

  try {
    await authStore.updatePassword(passwordForm.value);
    success.value = 'Password changed successfully!';
    toastSuccess('Password changed successfully!');
    passwordForm.value = {
      current_password: '',
      new_password: '',
      new_password_confirmation: ''
    };
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to change password';
    toastError('Failed to change password');
  } finally {
    loading.value = false;
  }
};

const handleLogout = async () => {
  try {
    await authStore.logoutUser();
    router.push({ name: 'Login' });
  } catch (err) {
    console.error('Error logging out:', err);
  }
};

onMounted(() => {
  loadUserProfile();
});
</script>

<style scoped>
.profile-view {
  padding-top: 2rem;
}
</style>
