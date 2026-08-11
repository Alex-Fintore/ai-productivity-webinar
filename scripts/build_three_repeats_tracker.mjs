import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const projectRoot = process.cwd();
const outputDir = path.join(projectRoot, "artifacts", "participant-kit");
const qaDir = path.join(projectRoot, "work", "qa", "tracker");
const outputPath = path.join(
  outputDir,
  "neiroseti-specialista-2026-three-repeats-tracker.xlsx",
);

const workbook = Workbook.create();

const colors = {
  ink: "#1D2625",
  muted: "#5D6A68",
  line: "#D8DED9",
  green: "#123C3A",
  orange: "#E7663E",
  gold: "#D4A72C",
  warm: "#F6F1E7",
  paleGreen: "#E5EAE6",
  paleOrange: "#F8E5DE",
  white: "#FFFFFF",
  softRed: "#F7D7D0",
};

function addSheet(name) {
  const sheet = workbook.worksheets.add(name);
  sheet.showGridLines = false;
  return sheet;
}

function setWidths(sheet, widths) {
  widths.forEach((width, index) => {
    sheet.getRangeByIndexes(0, index, 1, 1).format.columnWidth = width;
  });
}

function setTitle(sheet, endColumn, title, subtitle) {
  sheet.getRange(`A1:${endColumn}1`).merge();
  sheet.getRange("A1").values = [[title]];
  sheet.getRange("A1").format = {
    fill: colors.green,
    font: { bold: true, color: colors.white, size: 17 },
    rowHeight: 30,
  };
  sheet.getRange(`A2:${endColumn}2`).merge();
  sheet.getRange("A2").values = [[subtitle]];
  sheet.getRange("A2").format = {
    fill: colors.warm,
    font: { color: colors.ink, size: 10 },
    rowHeight: 34,
    wrapText: true,
  };
  sheet.getRange(`A1:${endColumn}2`).format.borders = {
    preset: "outside",
    style: "thin",
    color: colors.line,
  };
}

function styleSection(range) {
  range.format = {
    fill: colors.orange,
    font: { bold: true, color: colors.white, size: 11 },
    borders: { preset: "outside", style: "thin", color: colors.line },
  };
}

function styleHeader(range) {
  range.format = {
    fill: colors.green,
    font: { bold: true, color: colors.white, size: 10 },
    borders: { preset: "all", style: "thin", color: colors.line },
    wrapText: true,
    verticalAlignment: "center",
  };
}

function styleBody(range, fill = colors.white) {
  range.format = {
    fill,
    font: { color: colors.ink, size: 10 },
    borders: { preset: "all", style: "thin", color: colors.line },
    verticalAlignment: "top",
  };
}

function addListValidation(sheet, range, values) {
  try {
    sheet.getRange(range).dataValidation = {
      rule: { type: "list", values },
    };
  } catch {
    // The workbook stays usable if a viewer ignores list validation.
  }
}

function addTable(sheet, range, tableName) {
  try {
    const table = sheet.tables.add(range, true, tableName);
    table.showFilterButton = true;
    table.showBandedRows = false;
  } catch {
    // Styling and formulas do not depend on the table object.
  }
}

const start = addSheet("Старт");
setTitle(
  start,
  "H",
  "Журнал трёх повторов",
  "Сначала выберите три безопасных повторяемых сценария. Затем фиксируйте полный цикл: работа с ИИ плюс человеческая проверка.",
);
setWidths(start, [8, 34, 14, 18, 17, 20, 19, 25]);

start.getRange("A4:H4").merge();
start.getRange("A4").values = [["Как пользоваться"]];
styleSection(start.getRange("A4:H4"));
start.getRange("A5:H8").values = [
  ["1", "Выберите повторяемую задачу с цифровым входом.", "", "", "", "", "", ""],
  ["2", "Опишите проверяемый результат и безопасные границы.", "", "", "", "", "", ""],
  ["3", "Для каждого сценария выполните три реальных повтора.", "", "", "", "", "", ""],
  ["4", "После третьего повтора примите решение: оставить, изменить или отказаться.", "", "", "", "", "", ""],
];
styleBody(start.getRange("A5:H8"), colors.paleGreen);
start.getRange("B5:H8").merge(true);
start.getRange("B5:H8").format.wrapText = true;

start.getRange("A10:H10").merge();
start.getRange("A10").values = [["Кандидаты на тест"]];
styleSection(start.getRange("A10:H10"));
start.getRange("A11:H11").values = [[
  "№",
  "Повторяемая задача",
  "Раз / месяц",
  "Полный цикл, мин",
  "Цифровой вход?",
  "Результат проверяем?",
  "Цена ошибки",
  "Решение",
]];
styleHeader(start.getRange("A11:H11"));
start.getRange("A12:H16").values = [
  [1, "", "", "", "", "", "", ""],
  [2, "", "", "", "", "", "", ""],
  [3, "", "", "", "", "", "", ""],
  [4, "", "", "", "", "", "", ""],
  [5, "", "", "", "", "", "", ""],
];
styleBody(start.getRange("A12:H16"));
start.getRange("B12:H16").format.wrapText = true;
addListValidation(start, "E12:E16", ["Да", "Нет"]);
addListValidation(start, "F12:F16", ["Да", "Нет"]);
addListValidation(start, "G12:G16", ["Низкая", "Средняя", "Высокая"]);
addListValidation(start, "H12:H16", ["Выбрать", "Позже", "Не брать"]);
addTable(start, "A11:H16", "CandidateTasks");

start.getRange("A18:H18").merge();
start.getRange("A18").values = [["Три выбранных сценария"]];
styleSection(start.getRange("A18:H18"));
start.getRange("A19:H19").values = [[
  "№",
  "Название сценария",
  "Когда запускается",
  "Исходное время, мин",
  "Версия брифа",
  "Как проверяем",
  "Данные очищены?",
  "Примечание",
]];
styleHeader(start.getRange("A19:H19"));
start.getRange("A20:H22").values = [
  [1, "Сценарий 1", "", "", "v1", "", "", ""],
  [2, "Сценарий 2", "", "", "v1", "", "", ""],
  [3, "Сценарий 3", "", "", "v1", "", "", ""],
];
styleBody(start.getRange("A20:H22"), colors.warm);
start.getRange("B20:H22").format.wrapText = true;
addListValidation(start, "G20:G22", ["Да", "Нет", "Не требуется"]);
start.freezePanes.freezeRows(2);

const repeats = addSheet("Повторы");
setTitle(
  repeats,
  "N",
  "Девять реальных повторов",
  "Не измеряйте только скорость генерации. Время с ИИ включает подготовку, итерации, ручную правку и финальную проверку.",
);
setWidths(repeats, [23, 9, 13, 30, 17, 19, 15, 15, 17, 18, 15, 32, 17, 28]);
repeats.getRange("A4:N4").values = [[
  "Сценарий",
  "Повтор",
  "Дата",
  "Пример / вход",
  "Исходное время, мин",
  "С ИИ + проверка, мин",
  "Разница, мин",
  "Изменение, %",
  "Ручная правка, 1–5",
  "Серьёзные ошибки, 0–5",
  "Полезность, 1–5",
  "Что изменили в брифе",
  "Решение",
  "Комментарий",
]];
styleHeader(repeats.getRange("A4:N4"));

const repeatRows = [];
for (let scenario = 0; scenario < 3; scenario += 1) {
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const row = 5 + scenario * 3 + (attempt - 1);
    const startRow = 20 + scenario;
    repeatRows.push([
      `='Старт'!B${startRow}`,
      attempt,
      "",
      "",
      `=IF(A${row}="","",'Старт'!D${startRow})`,
      "",
      `=IF(E${row}="","",IF(F${row}="","",E${row}-F${row}))`,
      `=IF(E${row}="","",IF(F${row}="","",IF(E${row}=0,"",(E${row}-F${row})/E${row})))`,
      "",
      "",
      "",
      "",
      "",
      "",
    ]);
  }
}
repeats.getRange("A5:N13").values = repeatRows;
styleBody(repeats.getRange("A5:N13"));
repeats.getRange("A5:N7").format.fill = colors.paleGreen;
repeats.getRange("A8:N10").format.fill = colors.warm;
repeats.getRange("A11:N13").format.fill = colors.paleOrange;
repeats.getRange("C5:C13").format.numberFormat = "dd.mm.yyyy";
repeats.getRange("E5:G13").format.numberFormat = "0";
repeats.getRange("H5:H13").format.numberFormat = "0.0%";
repeats.getRange("D5:D13").format.wrapText = true;
repeats.getRange("L5:N13").format.wrapText = true;
repeats.getRange("A5:N13").format.rowHeight = 38;
addListValidation(repeats, "I5:I13", ["1", "2", "3", "4", "5"]);
addListValidation(repeats, "J5:J13", ["0", "1", "2", "3", "4", "5"]);
addListValidation(repeats, "K5:K13", ["1", "2", "3", "4", "5"]);
addListValidation(repeats, "M5:M13", ["Оставить", "Изменить", "Отказаться"]);
addTable(repeats, "A4:N13", "RepeatLog");
repeats.freezePanes.freezeRows(4);
repeats.freezePanes.freezeColumns(2);

const summary = addSheet("Итог");
setTitle(
  summary,
  "L",
  "Итог по трём сценариям",
  "Три повтора — минимальная проверка, а не гарантия экономии времени. Итоговое решение остаётся за вами.",
);
setWidths(summary, [23, 11, 18, 20, 18, 17, 18, 19, 17, 22, 18, 32]);
summary.getRange("A4:L4").values = [[
  "Сценарий",
  "Повторов",
  "Исходное время, мин",
  "Среднее с ИИ, мин",
  "Средняя разница, мин",
  "Среднее изменение, %",
  "Средняя правка, 1–5",
  "Серьёзных ошибок",
  "Средняя полезность",
  "Сигнал журнала",
  "Ваше решение",
  "Следующий шаг",
]];
styleHeader(summary.getRange("A4:L4"));

const summaryRows = [];
for (let scenario = 0; scenario < 3; scenario += 1) {
  const row = 5 + scenario;
  const startRow = 20 + scenario;
  const firstRepeatRow = 5 + scenario * 3;
  const lastRepeatRow = firstRepeatRow + 2;
  summaryRows.push([
    `='Старт'!B${startRow}`,
    `=COUNT('Повторы'!F${firstRepeatRow}:F${lastRepeatRow})`,
    `=IF(COUNT('Повторы'!E${firstRepeatRow}:E${lastRepeatRow})=0,"",AVERAGE('Повторы'!E${firstRepeatRow}:E${lastRepeatRow}))`,
    `=IF(COUNT('Повторы'!F${firstRepeatRow}:F${lastRepeatRow})=0,"",AVERAGE('Повторы'!F${firstRepeatRow}:F${lastRepeatRow}))`,
    `=IF(C${row}="","",IF(D${row}="","",C${row}-D${row}))`,
    `=IF(C${row}="","",IF(E${row}="","",IF(C${row}=0,"",E${row}/C${row})))`,
    `=IF(COUNT('Повторы'!I${firstRepeatRow}:I${lastRepeatRow})=0,"",AVERAGE('Повторы'!I${firstRepeatRow}:I${lastRepeatRow}))`,
    `=SUM('Повторы'!J${firstRepeatRow}:J${lastRepeatRow})`,
    `=IF(COUNT('Повторы'!K${firstRepeatRow}:K${lastRepeatRow})=0,"",AVERAGE('Повторы'!K${firstRepeatRow}:K${lastRepeatRow}))`,
    `=IF(B${row}<3,"Нужно 3 повтора",IF(H${row}>0,"Проверить риск",IF(I${row}<4,"Нужна правка",IF(F${row}>0,"Кандидат: оставить","Нужна правка"))))`,
    "",
    "",
  ]);
}
summary.getRange("A5:L7").values = summaryRows;
styleBody(summary.getRange("A5:L7"), colors.warm);
summary.getRange("A5:L7").format.rowHeight = 42;
summary.getRange("C5:E7").format.numberFormat = "0.0";
summary.getRange("F5:F7").format.numberFormat = "0.0%";
summary.getRange("G5:I7").format.numberFormat = "0.0";
summary.getRange("J5:L7").format.wrapText = true;
addListValidation(summary, "K5:K7", ["Оставить", "Изменить", "Отказаться"]);
addTable(summary, "A4:L7", "ScenarioSummary");

summary.getRange("A10:L10").merge();
summary.getRange("A10").values = [["Правило решения"]];
styleSection(summary.getRange("A10:L10"));
summary.getRange("A11:L13").values = [
  ["Оставить", "Три повтора завершены, результат полезен, проверка понятна, серьёзных ошибок нет.", "", "", "", "", "", "", "", "", "", ""],
  ["Изменить", "Польза есть, но нужен другой бриф, источник, инструмент или способ проверки.", "", "", "", "", "", "", "", "", "", ""],
  ["Отказаться", "Полный цикл не стал лучше либо цена ошибки остаётся слишком высокой.", "", "", "", "", "", "", "", "", "", ""],
];
styleBody(summary.getRange("A11:L13"), colors.paleGreen);
summary.getRange("B11:L13").merge(true);
summary.getRange("B11:L13").format.wrapText = true;
summary.freezePanes.freezeRows(4);

const cards = addSheet("Карточки");
setTitle(
  cards,
  "H",
  "Три карточки рабочих процессов",
  "Заполняйте карточку только после трёх повторов. Она должна позволять воспроизвести процесс без устных пояснений.",
);
setWidths(cards, [21, 29, 21, 29, 21, 29, 21, 29]);

const cardFields = [
  ["Название", "Когда запускается"],
  ["Вход", "Ожидаемый результат"],
  ["Инструкция / версия брифа", "Проверка"],
  ["Измерения", "Решение и следующий шаг"],
];

for (let scenario = 0; scenario < 3; scenario += 1) {
  const top = 4 + scenario * 12;
  const startRow = 20 + scenario;
  cards.getRange(`A${top}:H${top}`).merge();
  cards.getRange(`A${top}`).values = [[`='Старт'!B${startRow}`]];
  styleSection(cards.getRange(`A${top}:H${top}`));

  cardFields.forEach((pair, index) => {
    const labelRow = top + 2 + index * 2;
    const inputRow = labelRow + 1;
    cards.getRange(`A${labelRow}:B${labelRow}`).merge();
    cards.getRange(`E${labelRow}:F${labelRow}`).merge();
    cards.getRange(`A${labelRow}`).values = [[pair[0]]];
    cards.getRange(`E${labelRow}`).values = [[pair[1]]];
    cards.getRange(`A${labelRow}:B${labelRow}`).format = {
      fill: colors.green,
      font: { bold: true, color: colors.white },
    };
    cards.getRange(`E${labelRow}:F${labelRow}`).format = {
      fill: colors.green,
      font: { bold: true, color: colors.white },
    };
    cards.getRange(`A${inputRow}:D${inputRow}`).merge();
    cards.getRange(`E${inputRow}:H${inputRow}`).merge();
    styleBody(cards.getRange(`A${inputRow}:D${inputRow}`), colors.warm);
    styleBody(cards.getRange(`E${inputRow}:H${inputRow}`), colors.warm);
    cards.getRange(`A${inputRow}:H${inputRow}`).format.rowHeight = 42;
    cards.getRange(`A${inputRow}:H${inputRow}`).format.wrapText = true;
  });
}

await fs.mkdir(outputDir, { recursive: true });
await fs.mkdir(qaDir, { recursive: true });

for (const sheetName of ["Старт", "Повторы", "Итог", "Карточки"]) {
  const preview = await workbook.render({
    sheetName,
    autoCrop: "all",
    scale: 1,
    format: "png",
  });
  await fs.writeFile(
    path.join(qaDir, `${sheetName.toLowerCase()}.png`),
    new Uint8Array(await preview.arrayBuffer()),
  );
}

const overview = await workbook.inspect({
  kind: "sheet,table",
  maxChars: 12000,
  tableMaxRows: 4,
  tableMaxCols: 14,
});
console.log("INSPECT_OVERVIEW");
console.log(overview.ndjson);

const formulaScan = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 300 },
  summary: "final formula error scan",
});
console.log("FORMULA_ERROR_SCAN");
console.log(formulaScan.ndjson);

const xlsx = await SpreadsheetFile.exportXlsx(workbook);
await xlsx.save(outputPath);
console.log(`SAVED ${outputPath}`);
