// Genera out/VoidDeck-v<versión>.zip para instalar desde Decky (Ajustes → Desarrollador → instalar desde ZIP).
// El zip contiene la carpeta VoidDeck/ en la raíz. Sin dependencias: deflate de node:zlib.
import { execSync } from "node:child_process";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { crc32, deflateRawSync } from "node:zlib";
import { stagePlugin } from "./bundle.mjs";
import { root } from "./deck.mjs";

const { version } = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));

function listFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? listFiles(path) : [path];
  });
}

/** Zip mínimo (deflate, sin cifrado ni zip64): suficiente para un plugin de unos cientos de KB. */
function zip(entries) {
  const locals = [];
  const centrals = [];
  let offset = 0;
  // Fecha fija (1 ene 2020): el zip no cambia si el contenido no cambia.
  const time = 0;
  const date = ((2020 - 1980) << 9) | (1 << 5) | 1;
  for (const { name, data } of entries) {
    const nameBuf = Buffer.from(name, "utf8");
    const packed = deflateRawSync(data, { level: 9 });
    const crc = crc32(data);
    const header = (sig, extra) => {
      const b = Buffer.alloc(extra);
      b.writeUInt32LE(sig, 0);
      return b;
    };
    const local = header(0x04034b50, 30);
    local.writeUInt16LE(20, 4); // versión necesaria
    local.writeUInt16LE(0x0800, 6); // nombres en UTF-8
    local.writeUInt16LE(8, 8); // deflate
    local.writeUInt16LE(time, 10);
    local.writeUInt16LE(date, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(packed.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(nameBuf.length, 26);
    locals.push(local, nameBuf, packed);

    const central = header(0x02014b50, 46);
    central.writeUInt16LE(0x031e, 4); // creado en Unix, versión 3.0
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x0800, 8);
    central.writeUInt16LE(8, 10);
    central.writeUInt16LE(time, 12);
    central.writeUInt16LE(date, 14);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(packed.length, 20);
    central.writeUInt32LE(data.length, 24);
    central.writeUInt16LE(nameBuf.length, 28);
    central.writeUInt32LE((0o100644 << 16) >>> 0, 38); // permisos rw-r--r--
    central.writeUInt32LE(offset, 42);
    centrals.push(central, nameBuf);
    offset += local.length + nameBuf.length + packed.length;
  }
  const centralSize = centrals.reduce((n, b) => n + b.length, 0);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(centralSize, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...locals, ...centrals, end]);
}

execSync("pnpm build", { stdio: "inherit", cwd: root });
const staged = stagePlugin();
const base = join(staged, "..");
const entries = listFiles(staged)
  .sort()
  .map((path) => ({ name: relative(base, path).split(sep).join("/"), data: readFileSync(path) }));
const file = join(root, "out", `VoidDeck-v${version}.zip`);
writeFileSync(file, zip(entries));
console.log(`✓ ${relative(root, file)} (${entries.length} archivos)`);
