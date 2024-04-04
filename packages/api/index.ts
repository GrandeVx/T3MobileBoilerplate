import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "./src/root";

export type { AppRouter } from "./src/root";
export { appRouter } from "./src/root";

type RouterInputs = inferRouterInputs<AppRouter>;
type RouterOutputs = inferRouterOutputs<AppRouter>;

export { createTRPCContext } from "./src/trpc";
export type { Context } from "./src/trpc";
export { transformer } from "./trasformer"
export type { RouterInputs , RouterOutputs};
