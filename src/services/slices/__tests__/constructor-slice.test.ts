
import { describe, expect, it } from '@jest/globals';
import reducer, {
  addIngredient,
  removeIngredient,
  removeIngredientAll,
  moveIngredient
} from '../constructor-slice';
import type { TIngredient, TConstructorIngredient } from '@utils-types';

const bun: TIngredient = {
  _id: 'bun-1',
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
};

const filling: TIngredient = {
  _id: 'filling-1',
  name: 'Тестовая начинка',
  type: 'main',
  proteins: 15,
  fat: 8,
  carbohydrates: 12,
  calories: 180,
  price: 150,
  image: 'filling.png',
  image_large: 'filling-large.png',
  image_mobile: 'filling-mobile.png'
};

const createConstructorIngredient = (
  ingredient: TIngredient,
  id: string
): TConstructorIngredient => ({
  ...ingredient,
  id
});

describe('burgerConstructor reducer', () => {
  it('возвращает начальное состояние для неизвестного экшена', () => {
    expect(reducer(undefined, { type: 'UNKNOWN' })).toEqual({
      bun: null,
      ingredients: []
    });
  });

  it('добавляет булку в конструктор', () => {
    const result = reducer(undefined, addIngredient(bun));

    expect(result.bun).toMatchObject(bun);
    expect(result.bun?.id).toEqual(expect.any(String));
    expect(result.ingredients).toEqual([]);
  });

  it('заменяет ранее добавленную булку новой', () => {
    const firstBun = createConstructorIngredient(bun, 'bun-old');
    const state = { bun: firstBun, ingredients: [] };

    const result = reducer(state, addIngredient({
      ...bun,
      _id: 'bun-2',
      name: 'Другая булка'
    }));

    expect(result.bun?._id).toBe('bun-2');
    expect(result.bun?.name).toBe('Другая булка');
  });

  it('добавляет начинку в список ингредиентов', () => {
    const result = reducer(undefined, addIngredient(filling));

    expect(result.bun).toBeNull();
    expect(result.ingredients).toHaveLength(1);
    expect(result.ingredients[0]).toMatchObject(filling);
    expect(result.ingredients[0].id).toEqual(expect.any(String));
  });

  it('удаляет начинку по id', () => {
    const first = createConstructorIngredient(filling, 'filling-1');
    const second = createConstructorIngredient(
      { ...filling, _id: 'filling-2', name: 'Вторая начинка' },
      'filling-2'
    );
    const state = { bun: null, ingredients: [first, second] };

    const result = reducer(state, removeIngredient('filling-1'));

    expect(result.ingredients).toEqual([second]);
  });

  it('очищает булку и список ингредиентов', () => {
    const state = {
      bun: createConstructorIngredient(bun, 'bun-1'),
      ingredients: [
        createConstructorIngredient(filling, 'filling-1')
      ]
    };

    const result = reducer(state, removeIngredientAll());

    expect(result).toEqual({
      bun: null,
      ingredients: []
    });
  });

  it('перемещает начинку вверх', () => {
    const first = createConstructorIngredient(filling, 'first');
    const second = createConstructorIngredient(
      { ...filling, _id: 'second-ingredient', name: 'Вторая начинка' },
      'second'
    );
    const state = { bun: null, ingredients: [first, second] };

    const result = reducer(
      state,
      moveIngredient({ id: 'second', direction: 'up' })
    );

    expect(result.ingredients.map((item) => item.id)).toEqual([
      'second',
      'first'
    ]);
  });

  it('перемещает начинку вниз', () => {
    const first = createConstructorIngredient(filling, 'first');
    const second = createConstructorIngredient(
      { ...filling, _id: 'second-ingredient', name: 'Вторая начинка' },
      'second'
    );
    const state = { bun: null, ingredients: [first, second] };

    const result = reducer(
      state,
      moveIngredient({ id: 'first', direction: 'down' })
    );

    expect(result.ingredients.map((item) => item.id)).toEqual([
      'second',
      'first'
    ]);
  });

  it('не меняет список, если ингредиент не найден', () => {
    const state = {
      bun: null,
      ingredients: [
        createConstructorIngredient(filling, 'first')
      ]
    };

    const result = reducer(
      state,
      moveIngredient({ id: 'missing', direction: 'up' })
    );

    expect(result.ingredients.map((item) => item.id)).toEqual(['first']);
  });

  it('не перемещает первый ингредиент выше начала списка', () => {
    const first = createConstructorIngredient(filling, 'first');
    const second = createConstructorIngredient(
      { ...filling, _id: 'second-ingredient', name: 'Вторая начинка' },
      'second'
    );
    const state = { bun: null, ingredients: [first, second] };

    const result = reducer(
      state,
      moveIngredient({ id: 'first', direction: 'up' })
    );

    expect(result.ingredients.map((item) => item.id)).toEqual([
      'first',
      'second'
    ]);
  });

  it('не перемещает последний ингредиент ниже конца списка', () => {
    const first = createConstructorIngredient(filling, 'first');
    const second = createConstructorIngredient(
      { ...filling, _id: 'second-ingredient', name: 'Вторая начинка' },
      'second'
    );
    const state = { bun: null, ingredients: [first, second] };

    const result = reducer(
      state,
      moveIngredient({ id: 'second', direction: 'down' })
    );

    expect(result.ingredients.map((item) => item.id)).toEqual([
      'first',
      'second'
    ]);
  });
});
