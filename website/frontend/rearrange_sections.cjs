const fs = require('fs');
let code = fs.readFileSync('src/components/LandingPage.tsx', 'utf-8');

// The markers
const m_status = '{/* Live Machine Status */}';
const m_prod = '{/* Production Info Section */}';
const m_footer = '{/* Professional Footer */}';

// Currently the order is:
// 1. (Everything before Live Machine Status)
// 2. m_status -> ... -> m_prod (Status & FAQ block)
// 3. m_prod -> ... -> m_footer (Production block)
// 4. m_footer -> End

const p1 = code.indexOf(m_status);
const p2 = code.indexOf(m_prod);
const p3 = code.indexOf(m_footer);

if (p1 !== -1 && p2 !== -1 && p3 !== -1) {
    const part1 = code.substring(0, p1); // Up to Leaderboard end
    const partStatusAndFaq = code.substring(p1, p2); // Status and FAQ
    const partProd = code.substring(p2, p3); // Production (Integrasi IoT)
    const partFooter = code.substring(p3); // Footer to end

    // Reorder: part1 + partProd + partStatusAndFaq + partFooter
    const newCode = part1 + partProd + partStatusAndFaq + partFooter;
    fs.writeFileSync('src/components/LandingPage.tsx', newCode);
    console.log("Sections rearranged successfully!");
} else {
    console.log("Failed to find section markers.");
}
