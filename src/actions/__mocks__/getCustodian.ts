import { Custodian } from "@/types/api";
import { randNumber, randUuid, randCompanyName } from "@ngneat/falso";

const getCustodian = (): Custodian => ({
  id: randNumber({ min: 1, max: 1000 }),
  pid: randUuid(),
  name: randCompanyName(),
  gateway_team_id: randNumber({ min: 100, max: 10000 }),
  gateway_team_name: randCompanyName(),
});

export default getCustodian;
