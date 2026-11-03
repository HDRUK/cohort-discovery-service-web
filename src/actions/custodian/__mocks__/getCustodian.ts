import { Custodian } from "@/types/api";
import { randNumber, randUuid, randCompanyName } from "@ngneat/falso";

const getCustodian = (): Custodian => ({
  id: randNumber({ min: 1, max: 1000 }),
  pid: randUuid(),
  name: randCompanyName(),
  external_custodian_id: randNumber({ min: 100, max: 10000 }),
  external_custodian_name: randCompanyName(),
  created_at: "2025-01-01 00:00:00",
  updated_at: "2025-01-01 00:00:00",
});

export default getCustodian;
