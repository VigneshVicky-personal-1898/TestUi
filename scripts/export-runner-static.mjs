#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
 buildCatalog,
 buildStructureDiagram,
 getFramework,
 listFrameworks,
 readProjectSource,
 ROOT,
} from '../server/runner/catalog.js'


const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(ROOT, 'public/runner-static')


function ensureDir(dir) {
 fs.mkdirSync(dir, { recursive: true })
}


function writeJson(file, data) {
 ensureDir(path.dirname(file))
 fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
}


function copySourceFiles(frameworkId) {
 const fw = getFramework(frameworkId)
 if (!fw) return { suites: 0, java: 0 }
 const catalog = buildCatalog(frameworkId)
 const filesRoot = path.join(OUT, frameworkId, 'files')
 let suites = 0
 let java = 0


 const writeOne = (type, relativePath) => {
   const result = readProjectSource(frameworkId, type, relativePath)
   if (result.error) return
   const dest = path.join(filesRoot, relativePath)
   ensureDir(path.dirname(dest))
   fs.writeFileSync(dest, result.content, 'utf8')
   if (type === 'suite') suites += 1
   else java += 1
 }


 for (const s of [...(catalog.applicationSuites || []), ...(catalog.moduleSuites || [])]) {
   writeOne('suite', s.relativePath)
 }
 for (const list of Object.values(catalog.packages || {})) {
   for (const cls of list || []) {
     if (cls.sourcePath) writeOne('java', cls.sourcePath)
   }
 }


 return { suites, java, projectDir: path.relative(ROOT, fw.dir) }
}


function main() {
 ensureDir(OUT)
 const frameworks = []
 for (const fw of listFrameworks().filter((f) => f.exists)) {
   const catalog = buildCatalog(fw.id)
   const structure = buildStructureDiagram(fw.id)
   writeJson(path.join(OUT, fw.id, 'catalog.json'), catalog)
   writeJson(path.join(OUT, fw.id, 'structure.json'), structure)
   const copied = copySourceFiles(fw.id)
   frameworks.push({
     id: fw.id,
     label: fw.label,
     suites: (catalog.applicationSuites?.length || 0) + (catalog.moduleSuites?.length || 0),
     packages: Object.keys(catalog.packages || {}).length,
     copiedSuites: copied.suites,
     copiedJava: copied.java,
   })
   console.log(`[export] ${fw.id}: suites=${frameworks.at(-1).suites} javaFiles=${copied.java}`)
 }


 writeJson(path.join(OUT, 'manifest.json'), {
   generatedAt: new Date().toISOString(),
   mode: 'static',
   frameworks,
   note: 'Browse-only snapshot for offline / GitHub Pages. Live folder scan needs npm run dev.',
 })
 console.log(`[export] wrote ${path.relative(ROOT, OUT)}`)
}


main()



