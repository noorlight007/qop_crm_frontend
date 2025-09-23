import NextAuth from "next-auth";
import { authoption } from "./authOption";

const handler = NextAuth(authoption);

export const GET = handler;
export const POST = handler;
