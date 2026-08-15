// 檢查 data.js 的資料結構是否完整。
// 用法：node check-data.js
// 任何一項不完整就以失敗狀態結束，GitHub Actions 會據此亮紅燈。

global.window = {};
require("./data.js");

const data = window.DASHBOARD_DATA;
const problems = [];

if (!data) {
  console.error("找不到 DASHBOARD_DATA，data.js 可能沒有正確設定資料。");
  process.exit(1);
}

const sections = data.sections || [];
if (sections.length === 0) {
  problems.push("sections 是空的，找不到任何區塊資料。");
}

sections.forEach((section) => {
  const sectionName = section.title || section.id || "（沒有名稱的區塊）";

  (section.groups || []).forEach((group) => {
    const groupName = group.title || group.no || "（沒有名稱的段落）";

    (group.points || []).forEach((point, pi) => {
      const where =
        sectionName + " ／ " + groupName + " 的第 " + (pi + 1) + " 塊技能磚";

      if (!point.text) {
        problems.push(where + " 缺少 text（名稱）。");
      }
      if (!point.desc) {
        problems.push(where + " 缺少 desc（說明）。");
      }
      if (typeof point.done !== "boolean") {
        problems.push(where + " 的 done（完成狀態）需為 true 或 false。");
      }
    });
  });
});

if (problems.length > 0) {
  console.error("結構檢查沒有通過，共 " + problems.length + " 個問題：");
  problems.forEach((p) => console.error("・" + p));
  process.exit(1);
}

console.log("結構檢查通過。");
