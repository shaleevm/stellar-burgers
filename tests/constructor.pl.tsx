import { expect, test } from '@playwright/test';

test.describe('Конструктор бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      notFound: 'abort'
    });

    await page.routeFromHAR('tests/hars/user.har', {
      url: '**/api/auth/user',
      notFound: 'abort'
    });

    await page.routeFromHAR('tests/hars/order.har', {
      url: '**/api/orders',
      notFound: 'abort'
    });
  });

  test('добавление ингредиента из списка в конструктор', async ({
    page
  }) => {
    await page.goto('/');

    const ingredientCard = page
      .locator('li')
      .filter({ hasText: 'Тестовая начинка' });

    await ingredientCard.getByRole('button', { name: 'Добавить' }).click();

    await expect(
      page.getByText('Тестовая начинка', { exact: true })
    ).toHaveCount(2);
  });

  test('открытие и закрытие модального окна ингредиента', async ({
    page
  }) => {
    await page.goto('/');

    const ingredientCard = page
      .locator('li')
      .filter({ hasText: 'Тестовая начинка' });

    await ingredientCard.getByRole('link').click();

    const modal = page.locator('#modals');

    await expect(
      modal.getByRole('heading', { name: 'Тестовая начинка' })
    ).toBeVisible();

    await modal.getByRole('button', { name: 'Закрыть' }).click();

    await expect(
      modal.getByRole('heading', { name: 'Тестовая начинка' })
    ).toBeHidden();
  });

  test('модальное окно показывает данные выбранного ингредиента', async ({
    page
  }) => {
    await page.goto('/');

    const ingredientCard = page
      .locator('li')
      .filter({ hasText: 'Тестовая начинка' });

    await ingredientCard.getByRole('link').click();

    const modal = page.locator('#modals');

    await expect(
      modal.getByRole('heading', { name: 'Тестовая начинка' })
    ).toBeVisible();

    await expect(modal.getByText('180', { exact: true })).toBeVisible();
    await expect(modal.getByText('15', { exact: true })).toBeVisible();
    await expect(modal.getByText('8', { exact: true })).toBeVisible();
    await expect(modal.getByText('12', { exact: true })).toBeVisible();
  });

  test('закрытие модального окна ингредиента по оверлею', async ({
  page
  }) => {
    await page.goto('/');
    
    const ingredientCard = page
      .locator('li')
      .filter({ hasText: 'Тестовая начинка' });
        
    await ingredientCard.getByRole('link').click();

    const modal = page.locator('#modals');

    await expect(
      modal.getByRole('heading', { name: 'Тестовая начинка' })
    ).toBeVisible();

    await modal.locator('[class*="overlay"]').click({
      position: { x: 5, y: 5 }
    });

    await expect(
      modal.getByRole('heading', { name: 'Тестовая начинка' })
    ).toBeHidden();
  });

  test('оформление заказа, показ его номера и очистка конструктора', async ({
    page
  }) => {
    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'test-refresh-token');
      document.cookie =
        'accessToken=test-access-token; path=/; SameSite=Lax';
    });

    await page.goto('/');

    const bunCard = page
      .locator('li')
      .filter({ hasText: 'Тестовая булка' });

    const fillingCard = page
      .locator('li')
      .filter({ hasText: 'Тестовая начинка' });

    await bunCard.getByRole('button', { name: 'Добавить' }).click();
    await fillingCard.getByRole('button', { name: 'Добавить' }).click();

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    const modal = page.locator('#modals');

    await expect(
      modal.getByRole('heading', { name: '12345' })
    ).toBeVisible();

    await modal.getByRole('button', { name: 'Закрыть' }).click();

    await expect(
      modal.getByRole('heading', { name: '12345' })
      ).toBeHidden();

    await expect(page.getByText('Выберите булки')).toHaveCount(2);
    await expect(page.getByText('Выберите начинку')).toBeVisible();
  });
});

