import { createSlice, nanoid } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TIngredient, TConstructorIngredient } from '@utils-types';

type TConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

export const initialState: TConstructorState = {
  bun: null,
  ingredients: [],
};

const constructorSlice = createSlice({
  name: 'constructorBurger',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare(ingredient: TIngredient) {
        return { payload: { ...ingredient, id: nanoid() } };
      },
    },
    removeIngredient(state, action: PayloadAction<string>) {
      state.ingredients = state.ingredients.filter((item) => item.id !== action.payload);
    },
    removeIngredientAll(state) {
      state.bun = null;
      state.ingredients = [];
    },
    moveIngredient(
      state,
      action: PayloadAction<{ id: string; direction: 'up' | 'down' }>
    ) {
      const { id, direction } = action.payload;
      const index = state.ingredients.findIndex((item) => item.id === id);
      if (index === -1) return;

      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= state.ingredients.length) return;

      [state.ingredients[index], state.ingredients[targetIndex]] = [
        state.ingredients[targetIndex],
        state.ingredients[index],
      ];
    },
  },
});

export const { addIngredient, removeIngredient, removeIngredientAll, moveIngredient } =
  constructorSlice.actions;

export const selectConstructor = (state: {
  constructorBurger: TConstructorState;
}): TConstructorState => state.constructorBurger;

export const selectBun = (state: {
  constructorBurger: TConstructorState;
}): TConstructorIngredient | null => state.constructorBurger.bun;

export const selectConstructorIngredients = (state: {
  constructorBurger: TConstructorState;
}): TConstructorIngredient[] => state.constructorBurger.ingredients;

export default constructorSlice.reducer;
