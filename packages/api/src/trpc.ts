/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */
import { initTRPC, type inferAsyncReturnType } from "@trpc/server";
import { type NextRequest } from "next/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { db } from "@boilerplate/db";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_API_URL as string;
const supabaseKey = process.env.EXPO_PUBLIC_API_KEY as string;

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 */

interface CreateContextOptions {
  headers: Headers;
}

/**
 * This helper generates the "internals" for a tRPC context. If you need to use it, you can export
 * it from here.
 *
 * Examples of things you may need it for:
 * - testing, so we don't have to mock Next.js' req/res
 * - tRPC's `createSSGHelpers`, where we don't have req/res
 *
 * @see https://create.t3.gg/en/usage/trpc#-serverapitrpcts
 */
export const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    headers: opts.headers,
    db,
  };
};

/**
 * This is the actual context you will use in your router. It will be used to process every request
 * that goes through your tRPC endpoint.
 *
 * @see https://trpc.io/docs/context
 */
export const createTRPCContext = async (opts: { req: NextRequest }) => {
  // If the session is invalid, return a context with no session
  return createInnerTRPCContext({
    // @ts-expect-error - we're not using req/res
    headers: opts.req.headers,
  });
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export type Context = inferAsyncReturnType<typeof createTRPCContext>;

/**
 * Retrieves the JWT token from the request context.
 * If there is no authorization header, it checks for the token in the cookie.
 * If the token is found, it returns the token value.
 * @param ctx - The request context.
 * @param projectName - The name of the project.
 * @returns The JWT token.
 */
const getJWT = (ctx: Context, projectName: string) => {
  // if there is no authorization header (for mobile requests) we proceed with the cookie check (for browser requests)

  if (!ctx.headers.get("authorization")) {
    const cookieHeader = ctx.headers.get("cookie") || "";

    // Parse the cookie header into an object
    const cookieList = Object.fromEntries(
      cookieHeader.split("; ").map((cookie) => {
        const [name, value] = cookie.split("=");
        return [name, decodeURIComponent(value || "")];
      })
    );

    let supabaseAuthToken =
      cookieList && cookieList[`sb-${projectName}-auth-token`]?.split('"')[1];

    if (!supabaseAuthToken) {
      supabaseAuthToken = cookieList && cookieList[`sb-tmp-auth-token`];
    }

    return supabaseAuthToken;
  } else {
    const jwt = ctx.headers.get("authorization") as string;
    return jwt.split(" ")[1];
  }
};

const isAuthed = t.middleware(async ({ ctx, next }) => {
  const token = getJWT(ctx, "uqeuviffqlciaymxnpwg");

  const { data } = await supabase.auth.getUser(token);

  if (!data.user) {
    throw new Error("Not authorized | User not found");
  }

  return next({
    ctx: {
      session: data,
    },
  });
});

/*
// This function check if the user have specific privileges based on the role

const isPrivileged = t.middleware(async ({ ctx, next }) => {
  // You can find the Project-id in the Supabase dashboard
  const token = getJWT(ctx, "evprmsgrfzkaomzxqbco");

  const { data } = await supabase.auth.getUser(token);

  if (!data.user) {
    throw new Error("Not authorized | User not found");
  }

  const email = data.user.email;

  const user = await db.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("Not authorized");
  }

  if (user.role !== "admin" && user.role !== "editor") {
    throw new Error("Not authorized");
  }

  return next({
    ctx: {
      session: data,
      supabase: supabase,
    },
  });
});
*/

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure;

/**
 * Protected (authenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It guarantees
 * that a user querying is authorized, and you can access user session data.
 */
export const protectedProcedure = t.procedure.use(isAuthed);

/**
 * Privileged procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It guarantees
 * that a user querying is authorized and has specific privileges.
 */
// export const privilegedProcedure = t.procedure.use(isPrivileged);
