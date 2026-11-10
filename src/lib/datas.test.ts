import { describe, it, expect } from "vitest";
import { agruparPorDia, rotuloDoDia } from "./datas";

describe("datas", () => {
  const hoje = new Date(2026, 10, 10, 14, 0); // terça
  it("rotula hoje, amanhã e dia da semana", () => {
    expect(rotuloDoDia(new Date(2026, 10, 10, 20), hoje)).toBe("Hoje");
    expect(rotuloDoDia(new Date(2026, 10, 11, 8), hoje)).toBe("Amanhã");
    expect(rotuloDoDia(new Date(2026, 10, 12, 8), hoje)).toBe("Quinta-feira");
  });
  it("agrupa por dia em ordem", () => {
    const g = agruparPorDia(
      [
        { data_hora: new Date(2026, 10, 11, 9).toISOString() },
        { data_hora: new Date(2026, 10, 10, 18).toISOString() },
        { data_hora: new Date(2026, 10, 10, 15).toISOString() },
      ],
      hoje,
    );
    expect(g.map((x) => x.rotulo)).toEqual(["Hoje", "Amanhã"]);
    expect(g[0]?.itens).toHaveLength(2);
  });
});
