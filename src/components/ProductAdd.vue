
<script>
import { ref, onMounted, watch, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useAuthStore } from "../store";

export default {
    setup() {
        const authStore = useAuthStore();
        const token = authStore.$state.bearerToken;
        const router = useRouter();
        let pageTitle = ref(null);
        let isEditMode = false;
        const productId = ref(null);
        const routeId = computed(() => router.currentRoute.value.params.id);
 
        const form = ref({
            name: '',
            description: '',
            price: null,
            qty: null,
        });

        onMounted(async () => {
            
            if(await !authStore.user){ 
                router.push({name:"home"});
            }

            isEditMode = routeId.value ? true : false;
            pageTitle.value = routeId.value ? 'Edit Product' : 'Add Product';
            productId.value = routeId.value;
            if (isEditMode) {
                doLoadProduct();
            }
        });

        const doLoadProduct = async () => {
            try {
                const response = await axios.get('/api/products/' + productId.value, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
                );
                let thisProduct = response.data.product;
                form.value.name = thisProduct['name'];
                form.value.description = thisProduct['description'];
                form.value.price = thisProduct['price'];
                form.value.qty = thisProduct['qty'];
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }

        const formSubmit = async ()  => {
            await authStore.handleProductForm(form.value, isEditMode, productId);
        }
 
        return {
            form,
            pageTitle,
            isEditMode, 
            authStore,
            productId,
            formSubmit
        };
    },

};
</script>
<template>
    <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <!-- Your header content -->
        <h1 class="text-3xl font-extrabold text-gray-900">{{ pageTitle }}</h1>
        <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <form class="space-y-6" @submit.prevent="formSubmit">
                <div class="m-2 p-2 text-green-900 font-semibold bg-green-300 rounded-md" v-if="authStore.status">
                    {{ authStore.status }}
                </div>
                <!-- Name Input -->
                <div>
                    <label for="name" class="block text-sm font-medium leading-5 text-gray-900">Product Name</label>
                    <div class="mt-1 relative rounded-md shadow-sm">
                        <input id="name" name="name" type="text" v-model="form.name" required
                            class="form-input py-2 px-3 block w-full leading-5 rounded-md transition duration-150 ease-in-out sm:text-sm sm:leading-5">
                    </div>
                </div>

                <!-- Description Input -->
                <div>
                    <label for="description" class="block text-sm font-medium leading-5 text-gray-900">Description</label>
                    <div class="mt-1 relative rounded-md shadow-sm">
                        <textarea id="description" name="description" v-model="form.description" rows="3"
                            class="form-input py-2 px-3 block w-full leading-5 rounded-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"></textarea>
                    </div>
                </div>

                <!-- Price Input -->
                <div>
                    <label for="price" class="block text-sm font-medium leading-5 text-gray-900">Price</label>
                    <div class="mt-1 relative rounded-md shadow-sm">
                        <input id="price" name="price" type="number" step="0.01" v-model="form.price" required
                            class="form-input py-2 px-3 block w-full leading-5 rounded-md transition duration-150 ease-in-out sm:text-sm sm:leading-5">
                    </div>
                </div>

                <!-- Quantity Input -->
                <div>
                    <label for="qty" class="block text-sm font-medium leading-5 text-gray-900">Quantity</label>
                    <div class="mt-1 relative rounded-md shadow-sm">
                        <input id="qty" name="qty" type="number" v-model="form.qty" required
                            class="form-input py-2 px-3 block w-full leading-5 rounded-md transition duration-150 ease-in-out sm:text-sm sm:leading-5">
                    </div>
                </div>

                <!-- Submit Button -->
                <div>
                    <button type="submit"
                        class="flex w-full justify-center rounded-md bg-indigo-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:shadow-outline-indigo focus:border-indigo-700 active:bg-indigo-800 transition duration-150 ease-in-out">
                        {{ pageTitle }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
  
  