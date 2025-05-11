import { compile } from 'sass';
import { writeFileSync } from "node:fs";

const result = compile('scss/baustein_editor.scss');
writeFileSync('out/baustein_editor.css', result.css);
console.log('CSS compiled and saved to out/baustein_editor.css');
