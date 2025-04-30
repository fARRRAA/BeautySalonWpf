import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CartApiService } from '../../api/CartApiService';

const cartApi = new CartApiService();

// Асинхронный thunk для загрузки корзины пользователя
export const fetchUserCart = createAsyncThunk(
  'cart/fetchUserCart',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await cartApi.getUserCart(userId);
      console.log('API response:', response);
      return response; // API возвращает массив элементов корзины
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Асинхронный thunk для добавления товара в корзину
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (data, { rejectWithValue }) => {
    try {
      const response = await cartApi.addToCart(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Асинхронный thunk для увеличения количества товара
export const increaseProductCount = createAsyncThunk(
  'cart/increaseProductCount',
  async ({userId, productId}, { rejectWithValue }) => {
    try {
      const response = await cartApi.increaseProductCount(userId, productId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Асинхронный thunk для уменьшения количества товара
export const decreaseProductCount = createAsyncThunk(
  'cart/decreaseProductCount',
  async ({userId, productId}, { rejectWithValue }) => {
    try {
      const response = await cartApi.decreaseProductCount(userId, productId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  userId: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.userId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Обработка fetchUserCart
      .addCase(fetchUserCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        
        // Проверяем, является ли ответ массивом
        if (Array.isArray(action.payload)) {
          state.items = action.payload.map(item => ({
            id: item.productId,
            name: item.product.name,
            price: item.product.price,
            count: item.count,
            description: item.product.typeProducts?.name || '',
            image: item.product.photo || ''
          }));
          
          // Если есть хотя бы один элемент в корзине, берем userId из первого
          if (action.payload.length > 0) {
            state.userId = action.payload[0].userId;
          }
        } else if (action.payload && action.payload.items) {
          // Обработка старого формата ответа, если API вернет его
          state.items = action.payload.items || [];
          state.userId = action.payload.id;
        } else {
          // Если пришел неожиданный формат, просто очищаем корзину
          state.items = [];
          state.userId = null;
        }
      })
      .addCase(fetchUserCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Обработка addToCart
      .addCase(addToCart.fulfilled, (state, action) => {
        // Обработка ответа в зависимости от формата
        if (Array.isArray(action.payload)) {
          state.items = action.payload.map(item => ({
            id: item.productId,
            name: item.product.name,
            price: item.product.price,
            count: item.count,
            description: item.product.typeProducts?.name || '',
            image: item.product.photo || ''
          }));
          
          if (action.payload.length > 0) {
            state.userId = action.payload[0].userId;
          }
        } else if (action.payload && action.payload.items) {
          state.items = action.payload.items || [];
          state.userId = action.payload.id;
        }
      })
      
      // Обработка increaseProductCount и decreaseProductCount
      .addCase(increaseProductCount.fulfilled, (state, action) => {
        // Обработка ответа в зависимости от формата
        if (Array.isArray(action.payload)) {
          state.items = action.payload.map(item => ({
            id: item.productId,
            name: item.product.name,
            price: item.product.price,
            count: item.count,
            description: item.product.typeProducts?.name || '',
            image: item.product.photo || ''
          }));
          
          if (action.payload.length > 0) {
            state.userId = action.payload[0].userId;
          }
        } else if (action.payload && action.payload.items) {
          state.items = action.payload.items || [];
        }
      })
      .addCase(decreaseProductCount.fulfilled, (state, action) => {
        // Обработка ответа в зависимости от формата
        if (Array.isArray(action.payload)) {
          state.items = action.payload.map(item => ({
            id: item.productId,
            name: item.product.name,
            price: item.product.price,
            count: item.count,
            description: item.product.typeProducts?.name || '',
            image: item.product.photo || ''
          }));
          
          if (action.payload.length > 0) {
            state.userId = action.payload[0].userId;
          }
        } else if (action.payload && action.payload.items) {
          state.items = action.payload.items || [];
        }
      });
  }
});

export const { clearCart } = cartSlice.actions;
export const { reducer } = cartSlice; 