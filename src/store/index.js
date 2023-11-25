import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    authUser: null,
    authErrors: [],
    authStatus: null,
    bearerToken: localStorage.getItem("token") || null,
  }),
  getters: {
    user: (state) => state.authUser,
    errors: (state) => state.authErrors,
    status: (state) => state.authStatus,
    bearerToken: (state) => state.bearerToken,
  },
  actions: {
    async getToken() {
      await axios.get("/sanctum/csrf-cookie");
    },
    async getUser() {
      this.authStatus = null;
      await this.getToken();
      const headers = this.$state.bearerToken
        ? { Authorization: `Bearer ${this.$state.bearerToken}` }
        : {};
      try {
        const data = await axios.get("/api/user", { headers });
        this.authUser = data.data;
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Handle the error as needed
      }
    },
    async handleLogin(data) {
      this.authErrors = [];
      this.authStatus = null;
      await this.getToken();

      try {
        const response = await axios.post("/login", {
          email: data.email,
          password: data.password,
        });
        if (response && response.data) {
          const myToken = response.data.token;
          localStorage.setItem("token", myToken);
          console.log(this.$state.bearerToken);
        }
        this.router.push("/");
      } catch (error) {
        console.error(error);
        if (error.response && error.response.status === 422) {
          this.authErrors = error.response.data.errors;
        }
      }
    },
    async handleRegister(data) {
      this.authErrors = [];
      await this.getToken();
      this.authStatus = null;
      try {
        const response = await axios.post("/register", {
          name: data.name,
          email: data.email,
          password: data.password,
          password_confirmation: data.password_confirmation,
        });
        if (response && response.data) {
          const myToken = response.data.token;
          localStorage.setItem("token", myToken);
          console.log(this.$state.bearerToken);
          this.router.push("/");
        }
      } catch (error) {
        if (error.response && error.response.status === 422) {
          this.authErrors = error.response.data.errors;
        }
      }
    },
    async handleLogout() {
      try {
        this.authStatus = null;
        const response = await axios.post("/logout", null, {
          headers: {
            Authorization: `Bearer ${this.$state.bearerToken}`,
          },
        });

        if (response.status === 200) {
          this.$state.authUser = null;
          this.$state.bearerToken = null;
          localStorage.removeItem("token");
          this.router.push("/login");
        } else {
          console.error("Logout failed. Status:", response.status);
        }
      } catch (error) {
        console.error("Logout error:", error);
      }
    },
    async handleForgotPassword(email) {
      this.authErrors = [];
      this.authStatus = null;
      this.getToken();
      try {
        const response = await axios.post("/forgot-password", {
          email: email,
        });
        this.authStatus = response.data.status;
      } catch (error) {
        if (error.response && error.response.status === 422) {
          this.authErrors = error.response.data.errors;
        }
      }
    },
    async handleResetPassword(resetData) {
      this.authErrors = [];
      this.authStatus = null;
      try {
        const response = await axios.post("/reset-password", resetData);
        this.authStatus = response.data.status;
      } catch (error) {
        if (error.response && error.response.status === 422) {
          this.authErrors = error.response.data.errors;
        }
      }
    },
    async handleProductForm(form, isEditMode, productId) {
      console.log(isEditMode);
      this.authStatus = null;
      if (isEditMode && productId && form) {
        const response = await axios.put(
          "/api/products/" + productId.value,
          {
            name: form.name,
            description: form.description,
            price: form.price,
            qty: form.qty,
          },
          {
            headers: {
              Authorization: `Bearer ${this.$state.bearerToken}`,
            },
          }
        );
        this.authStatus = response.data.message;
      } else if (!isEditMode && form) {
        const response = await axios.post(
          "/api/products",
          {
            name: form.name,
            description: form.description,
            price: form.price,
            qty: form.qty,
          },
          {
            headers: {
              Authorization: `Bearer ${this.$state.bearerToken}`,
            },
          }
        );
        console.log(response.data.message);
        this.authStatus = response.data.message;
      } else {
        console.error("Form, form.value, or productId is undefined.");
      }
    },
  },
});
