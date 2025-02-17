import { initContract } from "@ts-rest/core";
import { fooContract } from "./foo/foo.contract";
import { publicAssetContract } from "./publicAssets/publicAssets.contract";

const tsRestContract = initContract();

export const appApiContract = tsRestContract.router({
  foo: fooContract,
  assets: publicAssetContract,
});

/** FOO **/
export * from "./foo/foo.contract";

/** ASSETS **/
export * from "./publicAssets/publicAssets.contract";

/** ERROR **/
export * from "./error/error.model";
