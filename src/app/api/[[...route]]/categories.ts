import { db } from '@/db/drizzle';
import { z } from 'zod';
import { categories, insertCategorySchema } from '@/db/schema';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { createId } from '@paralleldrive/cuid2';
import { and, eq, inArray } from 'drizzle-orm';
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';

const app = new Hono()
  .get('/', clerkMiddleware(), async c => {
    const auth = getAuth(c);

    if (!auth?.userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const data = await db
      .select({
        id: categories.id,
        name: categories.name,
      })
      .from(categories)
      .where(eq(categories.userId, auth.userId));

    return c.json({ data });
  })
  .get('/:id', clerkMiddleware(), async c => {
    const auth = getAuth(c);
    const id = c.req.param('id');

    if (!auth?.userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const [data] = await db
      .select({
        id: categories.id,
        name: categories.name,
      })
      .from(categories)
      .where(and(eq(categories.userId, auth.userId), eq(categories.id, id)));

    if (!data) {
      return c.json({ error: 'Not Found' }, 404);
    }

    return c.json({ data });
  })
  .post(
    '/',
    clerkMiddleware(),
    zValidator(
      'json',
      insertCategorySchema.pick({
        name: true,
      })
    ),
    async c => {
      const auth = getAuth(c);

      if (!auth?.userId) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const values = c.req.valid('json');
      const [data] = await db
        .insert(categories)
        .values({
          id: createId(),
          userId: auth.userId,
          ...values,
        })
        .returning();

      return c.json({ data });
    }
  )
  .post(
    '/delete-categories',
    clerkMiddleware(),
    zValidator(
      'json',
      z.object({
        ids: z.array(z.string()),
      })
    ),
    async c => {
      const auth = getAuth(c);
      const values = c.req.valid('json');

      if (!auth?.userId) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const data = await db
        .delete(categories)
        .where(
          and(
            eq(categories.userId, auth.userId),
            inArray(categories.id, values.ids)
          )
        )
        .returning({
          id: categories.id,
        });

      return c.json({ data });
    }
  )
  .patch(
    '/:id',
    clerkMiddleware(),
    zValidator(
      'json',
      insertCategorySchema.pick({
        name: true,
      })
    ),
    async c => {
      const auth = getAuth(c);
      const id = c.req.param('id');
      const values = c.req.valid('json');

      if (!auth?.userId) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const [data] = await db
        .update(categories)
        .set(values)
        .where(and(eq(categories.userId, auth.userId), eq(categories.id, id)))
        .returning();

      if (!data) {
        return c.json({ error: 'Not found' }, 404);
      }

      return c.json({ data });
    }
  )
  .delete('/:id', clerkMiddleware(), async c => {
    const auth = getAuth(c);
    const id = c.req.param('id');

    if (!auth?.userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const [data] = await db
      .delete(categories)
      .where(and(eq(categories.userId, auth.userId), eq(categories.id, id)))
      .returning({ id: categories.id });

    if (!data) {
      return c.json({ error: 'Not found' }, 404);
    }

    return c.json({ data });
  });

export default app;
