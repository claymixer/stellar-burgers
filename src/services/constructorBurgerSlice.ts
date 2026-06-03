import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';
import { getFetchBurger } from './orderSlice';

type TConstructorPayload = TIngredient | TConstructorIngredient;

type TConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

const constructorBurgerSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredients: {
      reducer: (state, { payload }: PayloadAction<TConstructorPayload>) => {
        if (payload.type === 'bun') {
          state.bun = payload;
        } else {
          state.ingredients.push(payload as TConstructorIngredient);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload:
          ingredient.type === 'bun'
            ? ingredient
            : { ...ingredient, id: uuidv4() }
      })
    },

    moveIngredient: (
      state,
      action: PayloadAction<{ index: number; direction: 'up' | 'down' }>
    ) => {
      const { index, direction } = action.payload;
      const ingredients = [...state.ingredients];
      const newIndex = direction === 'up' ? index - 1 : index + 1;

      if (newIndex < 0 || newIndex >= ingredients.length) {
        return;
      }

      [ingredients[index], ingredients[newIndex]] = [
        ingredients[newIndex],
        ingredients[index]
      ];
      state.ingredients = ingredients;
    },

    removeIngredient: (state, action: PayloadAction<string>) => {
      const indexToRemove = state.ingredients.findIndex(
        (ingredient) => ingredient.id === action.payload
      );

      if (indexToRemove !== -1) {
        state.ingredients.splice(indexToRemove, 1);
      }
    },

    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getFetchBurger.fulfilled, (state) => {
      state.bun = null;
      state.ingredients = [];
    });
  }
});

export const reducerConstructorBurger = constructorBurgerSlice.reducer;
export const {
  addIngredients,
  moveIngredient,
  removeIngredient,
  clearConstructor
} = constructorBurgerSlice.actions;
