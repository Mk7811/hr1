import {describe,expect,it} from "vitest"; import {leaveDays,overtimeAmountCents} from "../../lib/calculations";
describe("calculations",()=>{it("counts inclusive leave days",()=>expect(leaveDays(new Date("2026-01-01"),new Date("2026-01-03"))).toBe(3));it("calculates overtime in cents",()=>expect(overtimeAmountCents(120000,2)).toBe(1250));});
