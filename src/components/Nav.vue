<script setup>
import { useAuthStore } from "../store";

const authStore = useAuthStore();
</script>
<template>
    <nav class="bg-white border-gray-200 dark:bg-gray-900">
        <div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
            
            <div class="flex items-center space-x-6 rtl:space-x-reverse">
                <router-link :to="{ name: 'home' }"
                    class="text-sm  text-gray-500 dark:text-white hover:underline">Home</router-link>

                <template v-if="!authStore.user">
                    <router-link :to="{ name: 'login' }"
                        class="text-sm  text-gray-500 dark:text-white hover:underline">Login</router-link>
                    <router-link :to="{ name: 'register' }"
                        class="text-sm  text-gray-500 dark:text-white hover:underline">Register</router-link>

                </template>
                <template v-if="authStore.user">
                    <router-link :to="{ name: 'productAdd' }"
                        class="text-sm  text-gray-500 dark:text-white hover:underline">Product Add</router-link>
                     <button @click="authStore.handleLogout" class="
                            text-sm  text-gray-500 dark:text-white hover:underline
                            ">
                        Logout
                    </button>
                </template>

            </div>
        </div>
    </nav>
</template>

 
 