// ignition/modules/MarkToken.ts

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DEFAULT_INITIAL_SUPPLY = 1_000_000n * 10n ** 18n;

const ZuruTokenModule = buildModule("ZuruTokenModule", (m) => {
  const initialSupply = m.getParameter("initialSupply", DEFAULT_INITIAL_SUPPLY);

  const zuruToken = m.contract("ZuruToken", [initialSupply]);

  return { zuruToken };
});

export default ZuruTokenModule;
