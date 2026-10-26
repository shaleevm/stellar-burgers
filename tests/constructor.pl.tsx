import { expect, test } from '@playwright/test';

test.describe('Конструктор бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      notFound: 'abort',
    });

    await page.routeFromHAR('tests/hars/user.har', {
      url: '**/api/auth/user',
      notFound: 'abort',
    });

    await page.routeFromHAR('tests/hars/order.har', {
      url: '**/api/orders',
      notFound: 'abort',
    });
  });

  test('добавление ингредиента из списка в конструктор', async ({ page }) => {
    await page.goto('/');

    const burgerConstructor = page.locator('section[class*="burger_constructor"]');

    const ingredientCard = page.locator('li').filter({ hasText: 'Тестовая начинка' });

    await expect(
      burgerConstructor.getByText('Тестовая начинка', { exact: true })
    ).toHaveCount(0);

    await ingredientCard.getByRole('button', { name: 'Добавить' }).click();

    await expect(
      burgerConstructor.getByText('Тестовая начинка', { exact: true })
    ).toHaveCount(1);
  });

  test('открытие и закрытие модального окна ингредиента', async ({ page }) => {
    await page.goto('/');

    const ingredientCard = page.locator('li').filter({ hasText: 'Тестовая начинка' });

    await ingredientCard.getByRole('link').click();

    const modal = page.locator('#modals');

    await expect(modal.getByRole('heading', { name: 'Тестовая начинка' })).toBeVisible();

    await modal.getByRole('button', { name: 'Закрыть' }).click();

    await expect(modal.getByRole('heading', { name: 'Тестовая начинка' })).toBeHidden();
  });

  test('модальное окно показывает данные выбранного ингредиента', async ({ page }) => {
    await page.goto('/');

    const ingredientCard = page.locator('li').filter({ hasText: 'Тестовая начинка' });

    await ingredientCard.getByRole('link').click();

    const modal = page.locator('#modals');

    await expect(modal.getByRole('heading', { name: 'Тестовая начинка' })).toBeVisible();

    const calories = modal.locator('li').filter({
      hasText: 'Калории, ккал',
    });
    await expect(calories).toContainText('180');

    const proteins = modal.locator('li').filter({
      hasText: 'Белки, г',
    });
    await expect(proteins).toContainText('15');

    const fat = modal.locator('li').filter({
      hasText: 'Жиры, г',
    });
    await expect(fat).toContainText('8');

    const carbohydrates = modal.locator('li').filter({
      hasText: 'Углеводы, г',
    });
    await expect(carbohydrates).toContainText('12');
  });

  test('закрытие модального окна ингредиента по оверлею', async ({ page }) => {
    await page.goto('/');

    const ingredientCard = page.locator('li').filter({ hasText: 'Тестовая начинка' });

    await ingredientCard.getByRole('link').click();

    const modal = page.locator('#modals');

    await expect(modal.getByRole('heading', { name: 'Тестовая начинка' })).toBeVisible();

    /* заменил на более точный поиск по data-testid
      await modal.locator('[class*="overlay"]').click({
      position: { x: 5, y: 5 }
    }); */

    await modal.getByTestId('modal-overlay').click({
      position: { x: 5, y: 5 },
    });

    await expect(modal.getByRole('heading', { name: 'Тестовая начинка' })).toBeHidden();
  });

  test('оформление заказа, показ его номера и очистка конструктора', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'test-refresh-token');
      document.cookie = 'accessToken=test-access-token; path=/; SameSite=Lax';
    });

    await page.goto('/');

    const bunCard = page.locator('li').filter({ hasText: 'Тестовая булка' });

    const fillingCard = page.locator('li').filter({ hasText: 'Тестовая начинка' });

    await bunCard.getByRole('button', { name: 'Добавить' }).click();
    await fillingCard.getByRole('button', { name: 'Добавить' }).click();

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    const modal = page.locator('#modals');

    await expect(modal.getByRole('heading', { name: '12345' })).toBeVisible();

    await modal.getByRole('button', { name: 'Закрыть' }).click();

    await expect(modal.getByRole('heading', { name: '12345' })).toBeHidden();

    const burgerConstructor = page.locator('section[class*="burger_constructor"]');

    await expect(burgerConstructor).toContainText('Выберите булки');
    await expect(burgerConstructor).toContainText('Выберите начинку');
  });
});
