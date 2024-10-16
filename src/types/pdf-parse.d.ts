/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "pdf-parse" {
  function pdf(dataBuffer: Buffer, options?: any): Promise<any>;
  export = pdf;
}
