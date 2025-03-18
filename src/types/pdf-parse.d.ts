/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "pdf-parse" {
  function parse(
    dataBuffer: Buffer,
    options?: any
  ): Promise<{
    numpages: number;
    numrender: number;
    info: any;
    metadata: any;
    text: string;
    version: string;
  }>;
  export = parse;
}
