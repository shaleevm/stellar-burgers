
import { describe, expect, it } from '@jest/globals';
import reducer, { fetchIngredients } from '../ingredients-slice';
import type { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
    _id: 'ingredient-1',
    name: 'Тестовая булка',
    type: 'bun',
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    calories: 200,
    price: 100,
    image: 'bun.png',
    image_large: 'bun-large.png',
    image_mobile: 'bun-mobile.png'
  },
  {
    _id: 'ingredient-2',
    name: 'Тестовая начинка',
    type: 'main',
    proteins: 15,
    fat: 8,
    carbohydrates: 12,
    calories: 180,
    price: 150,
    image: 'main.png',
    image_large: 'main-large.png',
    image_mobile: 'main-mobile.png'
  }
];

describe('ingredients reducer', () => {
  it('возвращает начальное состояние для неизвестного экшена', () => {
    expect(reducer(undefined, { type: 'UNKNOWN' })).toEqual({
      ingredients: [],
      isIngredientsLoading: false,
      ingredientsError: null
    });
  });

  it('обрабатывает fetchIngredients.pending', () => {
    const state = {
      ingredients: mockIngredients,
      isIngredientsLoading: false,
      ingredientsError: new Error('Предыдущая ошибка')
    };

    const result = reducer(state, fetchIngredients.pending('request-1'));

    expect(result.isIngredientsLoading).toBe(true);
    expect(result.ingredientsError).toBeNull();
    expect(result.ingredients).toEqual(mockIngredients);
  });

  it('обрабатывает fetchIngredients.fulfilled', () => {
    const result = reducer(
      undefined,
      fetchIngredients.fulfilled(mockIngredients, 'request-1')
    );

    expect(result.ingredients).toEqual(mockIngredients);
    expect(result.isIngredientsLoading).toBe(false);
    expect(result.ingredientsError).toBeNull();
  });

  it('обрабатывает fetchIngredients.rejected', () => {
    const result = reducer(
      undefined,
      fetchIngredients.rejected(
        new Error('Ошибка сети'),
        'request-1'
      )
    );

    expect(result.isIngredientsLoading).toBe(false);
    expect(result.ingredientsError).toEqual(new Error('Ошибка сети'));
    expect(result.ingredients).toEqual([]);
  });
});
