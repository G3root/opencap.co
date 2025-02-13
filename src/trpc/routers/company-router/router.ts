import { createTRPCRouter, protectedProcedure } from "@/trpc/api/trpc";
import { ZodSwitchCompanyMutationSchema } from "./schema";

export const companyRouter = createTRPCRouter({
  switchCompany: protectedProcedure
    .input(ZodSwitchCompanyMutationSchema)
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;

      await db.membership.update({
        where: {
          id: input.id,
        },
        data: {
          lastAccessed: new Date(),
        },
      });
      return { success: true };
    }),
});
