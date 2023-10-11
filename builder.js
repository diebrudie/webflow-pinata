require("esbuild")
    .build({
        entryPoints: ["global-project-bbet.ts"],
        bundle: true,
        minify: true,
        sourcemap: true,
        target: "es2015",        
        outfile: "dist/global-project-bbet.min.js",                
    })
    .catch(() => process.exit(1))