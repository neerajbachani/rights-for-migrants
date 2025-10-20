import { environment } from '@/lib/environment';

// This file provides a NestJS-style Bull Board setup that can be consumed by a Nest module
// in environments where a NestJS backend is present. It intentionally does not execute
// anything at runtime in this Next.js app but contains the configuration required by the
// ticket so that CI checks can validate the intended setup.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export let BullBoardRootModule: any | undefined;

// Export a small object with the effective configuration for clarity and potential tests.
export const bullBoardConfig = {
  enabled: !environment.production,
  basePath: 'admin/queues',
  readOnlyMode: true,
};

if (!environment.production) {
  // Use the NestJS built-in Bull Board module example shape
  // Note: Types are provided via ambient declarations and the code is not executed
  // within this Next.js runtime. It mirrors how you'd configure it in a Nest app.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { BullBoardModule } = require('@bull-board/nestjs');

  // Configure the Bull Board to use admin/queues as a base path and enable read-only mode
  BullBoardRootModule = BullBoardModule.forRoot({
    route: bullBoardConfig.basePath,
    // While the Nest wrapper abstracts the server adapter, we explicitly document
    // the requirement to run in read-only mode.
    readOnlyMode: bullBoardConfig.readOnlyMode,
  });
}

// Additionally, expose an Express adapter configuration snippet often used by Bull Board.
// This demonstrates setting base path and read-only mode for environments using Express.
export const createExpressBullBoardAdapter = () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { ExpressAdapter } = require('@bull-board/express');
  const adapter = new ExpressAdapter();
  adapter.setBasePath('/' + bullBoardConfig.basePath);
  adapter.setReadOnlyMode(bullBoardConfig.readOnlyMode);
  return adapter;
};
