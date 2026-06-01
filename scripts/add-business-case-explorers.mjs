import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appDir = path.join(__dirname, "../src/app/math-applied");
const dirs = fs.readdirSync(appDir).filter((d) => {
  const p = path.join(appDir, d, "page.tsx");
  return fs.existsSync(p);
});

for (const slug of dirs) {
  const filePath = path.join(appDir, slug, "page.tsx");
  let content = fs.readFileSync(filePath, "utf8");

  if (content.includes("BusinessCaseExplorer")) {
    continue;
  }

  content = content.replace(
    /import RatesVsCountsStaffingReview from "@\/components\/RatesVsCountsStaffingReview";\n/,
    "",
  );
  content = content.replace(
    /import DeliveryPerformanceViz from "@\/components\/DeliveryPerformanceViz";\n/,
    "",
  );
  content = content.replace(/\s*<RatesVsCountsStaffingReview \/>\n/, "\n");
  content = content.replace(/\s*<DeliveryPerformanceViz \/>\n/, "\n");

  const importLine = `import BusinessCaseExplorer from "@/components/BusinessCaseExplorer";\n`;
  const componentLine = `\n          <BusinessCaseExplorer slug="${slug}" />\n`;

  const firstImportEnd = content.indexOf("\n", content.indexOf("import "));
  content =
    content.slice(0, firstImportEnd + 1) + importLine + content.slice(firstImportEnd + 1);

  const appHeading = content.indexOf("A simple application");
  if (appHeading !== -1) {
    const afterHeading = content.indexOf("</h2>", appHeading);
    const firstParaEnd = content.indexOf("</p>", afterHeading);
    if (firstParaEnd !== -1) {
      const insertAt = firstParaEnd + 4;
      content = content.slice(0, insertAt) + componentLine + content.slice(insertAt);
    }
  } else {
    const relatedIdx = content.indexOf("<RelatedPosts");
    const block = `
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            A simple application: try the levers
          </h2>
          <p>
            Move the sliders to see how the business readout changes before you act on the headline
            number.
          </p>${componentLine}
`;
    if (relatedIdx !== -1) {
      content = content.slice(0, relatedIdx) + block + "\n        " + content.slice(relatedIdx);
    }
  }

  fs.writeFileSync(filePath, content);
  console.log("Updated", slug);
}
