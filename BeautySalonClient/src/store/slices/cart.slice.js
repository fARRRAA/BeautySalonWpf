import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CartApiService } from '../../api/CartApiService';

const cartApi = new CartApiService();

export const fetchUserCart = createAsyncThunk(
  'cart/fetchUserCart',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await cartApi.getUserCart(userId);
      return response; 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

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

export const increaseProductCount = createAsyncThunk(
  'cart/increaseProductCount',
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const response = await cartApi.increaseProductCount(userId, productId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const decreaseProductCount = createAsyncThunk(
  'cart/decreaseProductCount',
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const response = await cartApi.decreaseProductCount(userId, productId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const response = await cartApi.removeFromCart(userId, productId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const clearUserCart = createAsyncThunk(
  'cart/clearUserCart',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await cartApi.clearCart(userId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  userId: null,
  status: 'idle', 
  error: null
};


const mapCartItems = (cartItems) => {
  if (!Array.isArray(cartItems)) return [];
  
  return cartItems.map(item => ({
    id: item.productId,
    name: item.product.name,
    price: item.product.price,
    count: item.count,
    description: item.product.typeProducts?.name || '',
    image: item.product.photo || '',
    inStock: item.product.inStock || 0,
    typeId: item.product.typeId
  }));
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
      .addCase(fetchUserCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserCart.fulfilled, (state, action) => {
        state.status = 'succeeded';

        if (Array.isArray(action.payload)) {
          state.items = mapCartItems(action.payload);
          if (action.payload.length > 0) {
            state.userId = action.payload[0].userId;
          }
        } else if (action.payload && action.payload.items) {
          state.items = action.payload.items || [];
          state.userId = action.payload.id;
        } else {
          state.items = [];
          state.userId = null;
        }
      })
      .addCase(fetchUserCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(addToCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (Array.isArray(action.payload)) {
          state.items = mapCartItems(action.payload);
          if (action.payload.length > 0) {
            state.userId = action.payload[0].userId;
          }
        } else if (action.payload && action.payload.items) {
          state.items = action.payload.items || [];
          state.userId = action.payload.id;
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(increaseProductCount.pending, (state) => {
      })
      .addCase(increaseProductCount.fulfilled, (state, action) => {
        if (Array.isArray(action.payload)) {
          state.items = mapCartItems(action.payload);
          if (action.payload.length > 0) {
            state.userId = action.payload[0].userId;
          }
        } else if (action.payload && action.payload.items) {
          state.items = action.payload.items || [];
        }
      })
      .addCase(increaseProductCount.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(decreaseProductCount.pending, (state) => {
      })
      .addCase(decreaseProductCount.fulfilled, (state, action) => {
        if (Array.isArray(action.payload)) {
          state.items = mapCartItems(action.payload);
          if (action.payload.length > 0) {
            state.userId = action.payload[0].userId;
          }
        } else if (action.payload && action.payload.items) {
          state.items = action.payload.items || [];
        }
      })
      .addCase(decreaseProductCount.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(removeFromCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (Array.isArray(action.payload)) {
          state.items = mapCartItems(action.payload);
          if (action.payload.length > 0) {
            state.userId = action.payload[0].userId;
          }
        } else if (action.payload && action.payload.items) {
          state.items = action.payload.items || [];
        }
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      .addCase(clearUserCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(clearUserCart.fulfilled, (state) => {
        state.status = 'succeeded';
        state.items = [];
      })
      .addCase(clearUserCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { clearCart } = cartSlice.actions;
export const { reducer } = cartSlice; 