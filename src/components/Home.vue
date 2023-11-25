<script lang="ts">
import { useAuthStore } from "../store";
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  setup() {

    const authStore = useAuthStore();
    const token = authStore.$state.bearerToken;
    const isDeleteModalOpen = ref(false);
    let productToDeleteId = null;
    const router = useRouter();
    const products = ref([]);

    const doFetchProduct = async () => {
      try { 
        const response = await axios.get('/api/products', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
        );
        products.value = response.data.products;

      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    const editProduct = (productId) => {
      router.push({ name: 'productAdd', params: { id: productId } });
    };

    onMounted(async () => {
      await authStore.getUser();
      doFetchProduct();
    });

    const openDeleteModal = (productId) => {
      productToDeleteId = productId;
      isDeleteModalOpen.value = true;
    };

    const confirmDelete = async () => {
      if (productToDeleteId) {
        const response = await axios.delete('/api/products/' + productToDeleteId, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        isDeleteModalOpen.value = false;
        doFetchProduct();
      }
    };

    const cancelDelete = () => {
      // Close the modal without deletion
      isDeleteModalOpen.value = false;
    };


    return {
      authStore,
      products,
      editProduct,
      // deleteProduct,
      isDeleteModalOpen,
      openDeleteModal,
      confirmDelete,
      cancelDelete,
    };

  }
};


</script>
<template>
  <div class="max-w-7xl mx-auto">
    <div v-if="authStore.user">
      <h1>{{ authStore.user.name }}</h1>
      <p>{{ authStore.user.email }}</p>

      <div v-if="isDeleteModalOpen" class="modal">
        <div class="modal-content">
          <p>Are you sure you want to delete this product?</p>
          <button @click="confirmDelete"
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring focus:border-blue-300 mr-4">Yes</button>
          <button @click="cancelDelete"
            class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 focus:outline-none focus:ring focus:border-blue-300">No</button>
        </div>
      </div>


      <table class="min-w-full">
        <thead>
          <tr>
            <th
              class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              ID</th>
            <th
              class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Ref</th>
            <th
              class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Name</th>
            <th
              class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Description</th>
            <th
              class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Price</th>
            <th
              class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Qty</th>
            <th
              class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Created By</th>
            <th
              class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="product in products" :key="product['id']">
            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">{{ product['id'] }}</td>
            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">{{ product['ref'] }}</td>
            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">{{ product['name'] }}</td>
            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">{{ product['description'] }}</td>
            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">{{ product['price'] }}</td>
            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">{{ product['qty'] }}</td>
            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">{{ product['created_by'] }}</td>
            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              <span class="cursor-pointer" @click="editProduct(product['id'])">
                <!-- Edit icon (replace fa-pencil-alt with the appropriate FontAwesome icon class) -->
                <font-awesome-icon :icon="['fas', 'pencil']" class="mr-2" />
              </span>
              <span class="cursor-pointer py-5" @click="openDeleteModal(product['id'])">
                <!-- Delete icon (replace fa-trash-alt with the appropriate FontAwesome icon class) -->
                <font-awesome-icon :icon="['fas', 'trash']" />
              </span>
            </td>
          </tr>
        </tbody>
      </table>




    </div>
    <div v-else>
      <h1>Go and login</h1>
    </div>
  </div>
</template>





<style>
/* Add styles for the modal as needed */
.modal {
  /* Styles for the overlay/background */
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  /* Styles for the modal content */
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}
</style>

