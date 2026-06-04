const fs = require('fs');
const path = require('path');

const dir = 'd:\\Freelance Copywriter & SEO Content Strategist';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') || f.endsWith('.html.tmp'));

const regex1 = /<div class="auth-toggle-wrap"[\s\S]*?<\/div>\s*<\/div>/g;
const regex2 = /<div class="flex mt-5 gap-5 w-full px-2">\s*<a href="login\.html"[\s\S]*?<\/div>/g;
const regex3 = /\/\/ ===== AUTH TOGGLE LOGIC =====[\s\S]*?\(\)\);\s*\}\)\(\);/g;
const regex4 = /\/\/ ===== AUTH TOGGLE LOGIC =====[\s\S]*?\(\)\);\s*\}\)\(\);\s*\}\);/g;

for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Some minor variation in regexes might be needed if they are placed differently, let's just make it broad enough
    let newContent = content.replace(/<div class="auth-toggle-wrap"[^>]*>[\s\S]*?<\/div>\s*<\/div>/g, '');
    newContent = newContent.replace(/<div class="flex mt-5 gap-5 w-full px-2">\s*<a href="login\.html"[\s\S]*?<\/div>/g, '');
    newContent = newContent.replace(/\/\/ ===== AUTH TOGGLE LOGIC =====[\s\S]*?\n\s*\n/g, ''); // just replace until an empty line? Actually let's try a specific replace
    newContent = newContent.replace(/\/\/ ===== AUTH TOGGLE LOGIC =====[\s\S]*?\(\)\);\s*/g, '');
    
    // More robust for the script part:
    const authLogicStart = newContent.indexOf('// ===== AUTH TOGGLE LOGIC =====');
    if (authLogicStart !== -1) {
        // find the end of the IIFE: })();
        const authLogicEnd = newContent.indexOf('})();', authLogicStart);
        if (authLogicEnd !== -1) {
            newContent = newContent.substring(0, authLogicStart) + newContent.substring(authLogicEnd + 5);
        }
    }
    
    // Also remove any remaining .auth-toggle-wrap styles in <style>
    newContent = newContent.replace(/\/\* ===== AUTH TOGGLE SWITCH[\s\S]*?\/\* ===== DARK MODE OVERRIDES/g, '/* ===== DARK MODE OVERRIDES');

    if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Updated ${file}`);
    }
}
