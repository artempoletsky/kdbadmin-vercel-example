import { GlobalScope } from "@artempoletsky/kurgandb";

export const myPlugin = {
  npm: ["is-odd"],
  install: async function (scope: GlobalScope) {
    const isOdd = scope.$.require("is-odd");
    return {
      isOdd(number: number): boolean {
        return isOdd(number);
      },
      myMethod() {
        return scope.db.versionString;
      }
    }
  }
}

export type Plugins = {
  myPlugin: Awaited<ReturnType<typeof myPlugin.install>>;
}