import { db } from '@/db/drizzle';
import { z } from 'zod';
import { parse, subDays } from 'date-fns';
import {
  transactions,
  insertTransactionSchema,
  categories,
  accounts,
} from '@/db/schema';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { createId } from '@paralleldrive/cuid2';
import { and, desc, eq, gte, inArray, lte, sql } from 'drizzle-orm';
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';

const app = new Hono()
  .get(
    '/',
    zValidator(
      'query',
      z.object({
        from: z.string().optional(),
        to: z.string().optional(),
        accountId: z.string().optional(),
      })
    ),
    clerkMiddleware(),
    async c => {
      const auth = getAuth(c);
      const { from, to, accountId } = c.req.valid('query');

      if (!auth?.userId) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const startDate = from
        ? parse(from, 'yyyy-MM-dd', new Date())
        : subDays(new Date(), 30);

      const endDate = to ? parse(to, 'yyyy-MM-dd', new Date()) : new Date();

      const data = await db
        .select({
          id: transactions.id,
          date: transactions.date,
          category: categories.name,
          categoryId: transactions.categoryId,
          payee: transactions.payee,
          amount: transactions.amount,
          notes: transactions.notes,
          account: accounts.name,
          accountId: transactions.accountId,
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .leftJoin(categories, eq(transactions.categoryId, categories.id))
        .where(
          and(
            accountId ? eq(transactions.accountId, accountId) : undefined,
            eq(accounts.userId, auth.userId),
            gte(transactions.date, startDate),
            lte(transactions.date, endDate)
          )
        )
        .orderBy(desc(transactions.date));

      return c.json({ data });
    }
  )
  .get('/:id', clerkMiddleware(), async c => {
    const auth = getAuth(c);
    const id = c.req.param('id');

    if (!auth?.userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const [data] = await db
      .select({
        id: transactions.id,
        date: transactions.date,
        categoryId: transactions.categoryId,
        payee: transactions.payee,
        amount: transactions.amount,
        notes: transactions.notes,
        accountId: transactions.accountId,
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .where(and(eq(accounts.userId, auth.userId), eq(transactions.id, id)));

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
      insertTransactionSchema.omit({
        id: true,
      })
    ),
    async c => {
      const auth = getAuth(c);

      if (!auth?.userId) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const values = c.req.valid('json');

      const [data] = await db
        .insert(transactions)
        .values({
          id: createId(),
          ...values,
        })
        .returning();

      return c.json({ data });
    }
  )
  .post(
    '/create-transactions',
    clerkMiddleware(),
    zValidator('json', z.array(insertTransactionSchema.omit({ id: true }))),
    async c => {
      const auth = getAuth(c);
      const values = c.req.valid('json');

      if (!auth?.userId) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const data = await db
        .insert(transactions)
        .values(
          values.map(value => ({
            id: createId(),
            ...value,
          }))
        )
        .returning();

      return c.json({ data });
    }
  )
  .post(
    '/delete-transactions',
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

      const transactionsToDelete = db.$with('transations_to_delete').as(
        db
          .select({ id: transactions.id })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.accountId, accounts.id))
          .where(
            and(
              inArray(transactions.id, values.ids),
              eq(accounts.userId, auth.userId)
            )
          )
      );

      const data = await db
        .with(transactionsToDelete)
        .delete(transactions)
        .where(
          and(
            inArray(
              transactions.id,
              sql`(select id from ${transactionsToDelete})`
            )
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
      insertTransactionSchema.omit({
        id: true,
      })
    ),
    async c => {
      const auth = getAuth(c);
      const id = c.req.param('id');
      const values = c.req.valid('json');

      if (!auth?.userId) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const transationsToUpdate = db.$with('transations_to_update').as(
        db
          .select({ id: transactions.id })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.accountId, accounts.id))
          .where(and(eq(transactions.id, id), eq(accounts.userId, auth.userId)))
      );

      const [data] = await db
        .with(transationsToUpdate)
        .update(transactions)
        .set(values)
        .where(
          inArray(transactions.id, sql`(select id from ${transationsToUpdate})`)
        )
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

    const transationsToDelete = db.$with('transations_to_delete').as(
      db
        .select({ id: transactions.id })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .where(and(eq(transactions.id, id), eq(accounts.userId, auth.userId)))
    );

    const [data] = await db
      .with(transationsToDelete)
      .delete(transactions)
      .where(
        inArray(transactions.id, sql`(select id from ${transationsToDelete})`)
      )
      .returning({ id: transactions.id });

    if (!data) {
      return c.json({ error: 'Not found' }, 404);
    }

    return c.json({ data });
  });

export default app;
