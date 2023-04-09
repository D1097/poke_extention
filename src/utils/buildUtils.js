"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Builder = void 0;
const chokidar = __importStar(require("chokidar"));
const esbuild_1 = require("esbuild");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const distDir = (targetBrowser) => {
    switch (targetBrowser) {
        case 'firefox':
            return 'dist-firefox';
        case 'chrome':
            return 'dist-chrome';
    }
};
const distPath = (relPath, targetBrowser) => path_1.default.join(distDir(targetBrowser), relPath);
const makeManifestFile = (targetBrowser) => __awaiter(void 0, void 0, void 0, function* () {
    const baseManifestJson = JSON.parse(yield fs_1.promises.readFile('manifest.json', 'utf8'));
    if (targetBrowser === 'firefox') {
        const firefoxJson = JSON.parse(yield fs_1.promises.readFile('firefox.json', 'utf8'));
        const manifestJson = Object.assign(Object.assign({}, baseManifestJson), firefoxJson);
        fs_1.promises.writeFile(distPath('manifest.json', targetBrowser), JSON.stringify(manifestJson, null, 1));
    }
    else {
        fs_1.promises.copyFile('manifest.json', distPath('manifest.json', targetBrowser));
    }
});
class Builder {
    constructor(option) {
        this.watchFlag = option.watchFlag;
        this.devFlag = option.devFlag;
        this.chromeFlag = option.chromeFlag;
        this.firefoxFlag = option.firefoxFlag;
        this.buildFiles = [];
        this.staticFiles = [];
        this.staticDirs = [];
    }
    addBuildFile(file) {
        this.buildFiles.push(file);
    }
    addStaticFile(file) {
        this.staticFiles.push(file);
    }
    addStaticDir(dir) {
        this.staticDirs.push(dir);
    }
    watchOption(targetBrowser) {
        return this.watchFlag
            ? {
                onRebuild: (error, result) => {
                    if (error)
                        console.error(`watch build failed for ${targetBrowser}: `, error);
                    else
                        console.log(`watch build succeeded for ${targetBrowser}:`, result);
                },
            }
            : false;
    }
    copyStaticFile(file, targetBrowser) {
        return __awaiter(this, void 0, void 0, function* () {
            yield fs_1.promises.mkdir(distPath(path_1.default.dirname(file), targetBrowser), {
                recursive: true,
            });
            if (this.watchFlag) {
                chokidar.watch(file).on('all', (event, path) => {
                    console.log(event, path);
                    fs_1.promises.copyFile(path, distPath(file, targetBrowser));
                });
            }
            else {
                fs_1.promises.copyFile(file, distPath(file, targetBrowser));
            }
        });
    }
    copyStaticDir(dir, targetBrowser) {
        return __awaiter(this, void 0, void 0, function* () {
            yield fs_1.promises.mkdir(distPath(dir, targetBrowser), {
                recursive: true,
            });
            if (this.watchFlag) {
                chokidar.watch(path_1.default.join(dir, '*')).on('all', (event, filepath) => {
                    console.log(event, filepath);
                    fs_1.promises.copyFile(filepath, distPath(path_1.default.join(dir, path_1.default.basename(filepath)), targetBrowser));
                });
            }
            else {
                fs_1.promises.cp(dir, distPath(dir, targetBrowser), { recursive: true });
            }
        });
    }
    makeManifestFileAndWatch(targetBrowser) {
        if (this.watchFlag) {
            chokidar
                .watch(['manifest.json', 'firefox.json'])
                .on('all', (event, path) => {
                console.log(event, path);
                makeManifestFile(targetBrowser);
            });
        }
        else {
            makeManifestFile(targetBrowser);
        }
    }
    buildForBrowser(targetBrowser) {
        this.buildFiles.forEach((file) => {
            (0, esbuild_1.build)({
                entryPoints: [file],
                bundle: true,
                outdir: distPath(path_1.default.dirname(file), targetBrowser),
                watch: this.watchOption(targetBrowser),
                sourcemap: this.devFlag ? 'inline' : false,
            });
        });
        this.staticFiles.forEach((file) => {
            this.copyStaticFile(file, targetBrowser);
        });
        this.staticDirs.forEach((dir) => {
            this.copyStaticDir(dir, targetBrowser);
        });
        this.makeManifestFileAndWatch(targetBrowser);
    }
    build() {
        if (this.chromeFlag) {
            const browser = 'chrome';
            this.buildForBrowser(browser);
        }
        if (this.firefoxFlag) {
            const browser = 'firefox';
            this.buildForBrowser(browser);
        }
    }
}
exports.Builder = Builder;
