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
