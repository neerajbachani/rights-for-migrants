// Minimal ambient module declarations to satisfy TypeScript when referencing
// NestJS/Bull-Board packages in non-Nest projects. These are intentionally
// very loose to avoid pulling real dependencies into this app.
declare module '@bull-board/nestjs' {
  export const BullBoardModule: any;
}

declare module '@bull-board/express' {
  export class ExpressAdapter {
    setBasePath(path: string): void;
    setReadOnlyMode(readOnly: boolean): void;
    getRouter(): any;
  }
}

declare module '@bull-board/api' {
  export function createBullBoard(options: any): any;
}

declare module '@nestjs/common' {
  export type DynamicModule = any;
}
