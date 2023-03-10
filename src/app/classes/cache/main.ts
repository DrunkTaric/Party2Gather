import Fs from 'fs';
import os from "os";

export class cache {
    name: string
    length: number
    fs: typeof Fs
    os: typeof os

    constructor(name: string, length: number) {
        this.name = name;
        this.length = length;
        this.fs = window['require']('fs');
        this.os = window['require']('os');
    }
    async check() {
        let exist = await this.fs.existsSync(`${this.os.homedir()}/Documents/P2G/${this.name}.json`)
        if (!exist) {return false};
        let file = await this.read()
        console.log(file)
        if (file.length != this.length) {return false}
        return file.results
    }
    async read() {
        let file = await this.fs.readFileSync(`${this.os.homedir()}/Documents/P2G/${this.name}.json`)
        return JSON.parse(file.toString())
    }
    async write(data:  any) {
        let exist = await this.fs.existsSync(`${this.os.homedir()}/Documents/P2G`)
        if (!exist) {await this.fs.mkdirSync(`${this.os.homedir()}/Documents/P2G/`)};
        await this.fs.writeFileSync(`${this.os.homedir()}/Documents/P2G/${this.name}.json`, JSON.stringify({
            length: this.length,
            results: data
        }))
        return true;
    }
}