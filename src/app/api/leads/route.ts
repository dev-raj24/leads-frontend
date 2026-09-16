// route.ts — thin. Just maps the URL to a controller. No logic here.
import { list } from "@/server/controllers/lead.controller";

export const GET = list;
