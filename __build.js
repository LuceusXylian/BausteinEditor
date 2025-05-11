import { compile } from 'npm:sass';
import { writeFileSync } from "node:fs";
import * as esbuild from "https://deno.land/x/esbuild@v0.25.2/mod.js";


await esbuild.build({
	plugins: [],
	entryPoints: ["src/baustein_editor.ts"],
	outfile: "out/baustein_editor.js",
	bundle: true,
	platform: "browser",
	format: "iife",
	target: "esnext",
	minify: false,
	sourcemap: true,
	treeShaking: true,
	globalName: "BausteinEditorBundle",
});
await esbuild.stop();
console.log("JS compiled and saved to \"out/baustein_editor.js\"");


const result = compile('scss/baustein_editor.scss');
writeFileSync('out/baustein_editor.css', result.css);
console.log('CSS compiled and saved to \"out/baustein_editor.css\"');
