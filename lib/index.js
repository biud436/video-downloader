const fs = require('fs-extra');
const cp = require('child_process');
const path = require('path');
const readline = require('readline');
const argv = require('minimist')(process.argv.slice(2));
const config = require("./config");
const Aria2c = require("./aria2c");

var mainPath = process.cwd().replace( /\\/g, '/' );

//! 명령줄 인수
const args = process.argv.slice(2);

if(!args[1] || args[1] === "") {
    console.warn("node index.js tslist.txt TMP-000");
    return;
}

// ! 품번
let productName = args[1] || "TMP-000";
let outputPath = `${mainPath}/.tmp-avgle~${productName}`.replace( /\\/g, '/' );

// .ts 파일의 리스트가 여기에 담기게 된다.
let output = [];
let outputRaw;
let isValidCygwin = false;

/**
 * 문자열을 특정 문자열을 기준으로 잘라냅니다.
 */
String.prototype.splitOnLast = function (e) {
    var t = this.lastIndexOf(e) + 1;
    return 0 > t ? this : this.substr(t);
};

class Utils {
    constructor() {
        this._isError = false;
    }

    processLine(line) {
        const filename = line.splitOnLast("/");
        output.push(line);
        output.push(`  dir=${outputPath}`);
        output.push(`  out=${filename}`);
    }

    /**
     * concat.list 파일을 생성합니다.
     */
    createConcatList() {

        var tslist = fs.readdirSync(outputPath.replace( /\\/g, '/' ));
        var matched = /seg-([0-9]+)-v1-a1.ts/i;
        var list = [];
        var max = 0;
        var data = "";
        var found = false;

        tslist.forEach(e => {
            if(matched.exec(e)) {
                var n = Number(RegExp.$1);
                if(n > max) {
                    max = n;
                }
            }
        });

        if(max > 0) {
            found = true;
        }

        if(found) {

            for(var i = 1; i <= max; i++) {
                if(fs.existsSync(path.join(outputPath, `seg-${i}-v1-a1.ts`))) {
                    list.push(`file seg-${i}-v1-a1.ts`);
                }
            }
    
            data = list.join("\n");
            if(fs.existsSync(outputPath)) {
                fs.writeFileSync(path.join(outputPath, "concat.list").replace( /\\/g, '/' ), data , "utf8");  
                return true;
            }      

        }

        return false;

    }

    removeFiles() {
        const files = {
            input: path.join(mainPath, "input.txt").replace( /\\/g, '/' ),
            log: path.join(mainPath, "log.txt").replace( /\\/g, '/' ),
            tslist: path.join(mainPath, "tslist.txt").replace( /\\/g, '/' ),
        };

        if(fs.existsSync(files.input)) fs.removeSync(files.input);
        if(fs.existsSync(files.log) && !this._isError) fs.removeSync(files.log);
        if(fs.existsSync(files.tslist)) fs.removeSync(files.tslist);        
    }

    removeFolders() {
        fs.remove(outputPath).then(()=>{
            console.log(`${outputPath} 폴더를 제거하였습니다.`);
            console.log(`동영상 파일 인코딩이 완료되었습니다.`);
        }).catch(() => {
            console.log(`${outputPath} 폴더 삭제에 실패하였습니다.`);
        });        
    }

    /**
     * 윈도우즈의 기본 커맨드 라인에서 ffmpeg를 사용하여 동영상을 변환합니다.
     */
    encodingVideoWindows() {
        if(!this.createConcatList()) {
            throw new Error("concat.list 생성에 실패하였습니다.");
        }

        let ffmpeg = cp.exec(
            `ffmpeg -f concat -i concat.list -bsf:a aac_adtstoasc -c copy ../${productName}.mp4 -loglevel error`,
            {
                cwd: outputPath, // Current working directory of the child process.
                encoding: 'utf8',
                shell: true, // if true, runs command inside of a shell.
            },   
            function(err, stdout, stderr) {
                if(err) {
                    console.log(err);
                    return;
                }
                console.log(`it has completed to convert *.ts -> ${productName}.mp4`);
            }                    
        );    
        
        ffmpeg.stdout.on("data", function(c) {
            console.log(c);
        });

        ffmpeg.on("exit", (code, signal) => {
            this.removeFiles();
            if(args[2] !== "remain") this.removeFolders();
        });
        
        process.on('beforeExit', () => ffmpeg.kill());
    }

    /**
     * 시그윈을 사용하여 동영상을 변환합니다.
     */
    encodingVideoCygwin() {

        var shPath = path.join(mainPath, "run.sh").replace( /\\/g, '/' );

        if(!fs.existsSync(config.cygwinPath)) {
            console.log(`cygwin이 설치되어있지 않습니다.`);
        }

        let ffmpeg = cp.exec(
            `${config.cygwinPath} -c '${shPath} ${productName}'`.replace( /'/g, "\'" ),
            {
                cwd: outputPath, // Current working directory of the child process.
                encoding: 'utf8',
                shell: true, // if true, runs command inside of a shell.
            }, 
            function(err, stdout, stderr) {
                if(err) {
                    console.log(err);
                    return;
                }
                console.log(`it has completed to convert *.ts -> ${productName}.mp4`);
            }                    
        );
        
        ffmpeg.stdout.on("data", function(c) {
            console.log(c);
        });

        ffmpeg.on("exit", (code, signal) => {
            this.removeFiles();
            this.removeFolders();
        });
        
        process.on('beforeExit', () => ffmpeg.kill());

    }

    convertForCommand() {
        console.log(`오류가 발생하여 FFMPEG 작업을 생략합니다.`);
        console.log(`오류 코드 및 시그널 => ${code}, ${signal}`);

        this.removeFiles();

        if(fs.existsSync(outputPath)) {
            let tsjoiner = cp.exec(`copy /b *.ts ..\\${productName}.ts`, {
                cwd: outputPath, // Current working directory of the child process.
                encoding: 'utf8',
                shell: true, // if true, runs command inside of a shell.
            },
            (err, stdout, stderr) => {
                if(err) console.warn(err);                            
            });
            tsjoiner.on('exit', (code, signal) => {
                console.log(`동영상 파일 작업이 완료되었습니다.`);
                this.removeFolders();
            });
        }        
    }

    startDownloadFromM3U8() {

        // Header
        let header = {
            referrer : argv.referrer,
            userAgent : config.userAgent,
            inputFile : argv.inputFile,
            logFile : `${mainPath}/${config.logFile}`,
        };

        // Create Aria2c
        let aria2cProcess = new Aria2c(header, (err, stdout, stderr) => {
            if(err) {
                console.log(err);
                this._isError = true;
                return;
            }
        });
            
        aria2cProcess.onExit((code, signal) => {

            console.log(`[리턴 코드 : ${code}]FFMPEG 작업을 시작합니다.`);
        
            if(isValidCygwin) {
                this.encodingVideoCygwin();
            } else {
                this.encodingVideoWindows();
            }

            this._isError = false;

        });
        
        aria2cProcess.pendingTerminate();        
    }

    loadTsList() {

        const filePath = args[0] || "tslist.txt";

        if(!fs.existsSync(filePath)) {      
            throw new Error(`${filePath} 파일이 없습니다.`);
        }

        if(fs.lstatSync(filePath).isDirectory()) {
            throw new Error(`${filePath}은 제대로된 파일 주소가 아닙니다.`);
        }

        const fileStream = fs.createReadStream(filePath, 'utf8');
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity,
        });

        rl.on('line', this.processLine.bind(this));

        rl.on('close', () => {
            // Join all of lines from the text file.
            outputRaw = output.join("\r\n");

            // Create Input file
            fs.writeFileSync(config.inputFile, outputRaw, "utf8");
    
            // Header
            let header = {
                referrer : config.referrer,
                userAgent : config.userAgent,
                inputFile : `${config.inputFile}`,
                logFile : `${mainPath}/${config.logFile}`,
            };
    
            // Create Aria2c
            let aria2cProcess = new Aria2c(header, (err, stdout, stderr) => {
                if(err) {
                    console.log(err);
                    this._isError = true;
                    return;
                }
            });
                
            aria2cProcess.onExit((code, signal) => {

                console.log(`[리턴 코드 : ${code}]FFMPEG 작업을 시작합니다.`);
            
                if(isValidCygwin) {
                    this.encodingVideoCygwin();
                } else {
                    this.encodingVideoWindows();
                }

                this._isError = false;

            });
           
            aria2cProcess.pendingTerminate();
        });              
        
    }

}

let utils = new Utils();
if(argv.concat) {
    utils.createConcatList();
} else if(argv.export) {
    utils.encodingVideoWindows();
} else if(argv.m3u8) { // node index.js tslist.txt XXX-010 --mu38 
    utils.startDownloadFromM3U8();
} else {
    utils.loadTsList();
}