import type { Dictionary } from "../../dictionaries";
import { core } from "./core";
import { common } from "./common";
import { commit } from "./commit";
import { evolve } from "./evolve";
import { books } from "./books";
import { community } from "./community";
import { engage } from "./engage";
import { admin } from "./admin";

export const fr: Dictionary = { ...core, common, commit, evolve, books, community, engage, admin };
