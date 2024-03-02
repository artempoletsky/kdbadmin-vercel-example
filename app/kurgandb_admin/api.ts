import z from "zod";


const ZExapleCustomMethod = z.object({
  arg: z.string(),
});
type AExapleCustomMethod = z.infer<typeof ZExapleCustomMethod>;


async function exampleCustomMethod({ arg }: AExapleCustomMethod) {
  return arg.split("").reverse().join("");
}

export type FExapleCustomMethod = typeof exampleCustomMethod;
//////////////////////////////////////////////////////////////////////////


export const customRules = {
  exampleCustomMethod: ZExapleCustomMethod,
};

export const customAPI = {
  exampleCustomMethod,
}