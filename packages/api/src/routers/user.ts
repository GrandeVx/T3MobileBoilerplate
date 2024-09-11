import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
export const userRouter = createTRPCRouter({
  addUser: publicProcedure
    .input(z.object({ email: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.user.create({
        data: {
          email: input.email,
        },
      });
    }),

  getUser: protectedProcedure.input(z.object({})).query(({ ctx }) => {
    return ctx.db.user.findUnique({
      where: {
        email: ctx.session.user.email,
      },
    });
  }),

  deleteUserAccount: protectedProcedure.mutation(({ ctx }) => {
    return ctx.db.user.delete({
      where: {
        email: ctx.session.user.email,
      },
    });
  }),

  UpdateUser: protectedProcedure
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
        phoneNumber: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.user.update({
        where: {
          email: ctx.session.user.email,
        },
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          phone: input.phoneNumber,
        },
      });
    }),
});
