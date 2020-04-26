# 소개
특정 사이트의 영상을 내려 받는 용도의 프로그램입니다. 훼이크를 위해 프로그램의 이름은 인젝터로 지었습니다.

1. 크롬 확장 프로그램 ```Tampermonkey```를 다운로드 받은 후, 새로운 유저 스크립트를 만들고 ```lib/DownloadTSList.user.js```의 내용을 붙여 넣으십시오.

2. Windows 용 ```ffmpeg```와 ```aria2```가 필요합니다. 환경 변수 PATH에 실행 파일이 위치한 경로를 지정해주시기 바랍니다.

설치 여부는 아래와 같이 확인할 수 있습니다.

```bat
C:\Users\U>where ffmpeg
C:\Program Files\ImageMagick-7.0.7-Q16\ffmpeg.exe
C:\ffmpeg-20200131-62d92a8-win64-static\bin\ffmpeg.exe

C:\Users\U>where aria2c
C:\aria2-1.35.0-win-64bit-build1\aria2c.exe
```

그리고 최신 ```Node.js```를 설치해야 합니다. 설치한 직후, 이 프로젝트를 복제(clone)해주세요. 그리고 루트 폴더까지 이동한 후 다음과 같은 명령을 호출해주세요.

```
npm install
```

이렇게 하면 필요한 모든 라이브러리가 설치됩니다. 단독(Standard Alone) 프로그램으로 빌드하려면, Webpack을 사용하여 번들링을 해야 하기 때문에 먼저 ```build.bat``` 파일을 실행해야 합니다. 그 후, ```makeExeFile.bat``` 파일을 실행하면 ```bin``` 폴더에 다운로더가 생성됩니다. 

2. 영상이 시작된 직후, ```p``` 키를 누르면 텍스트 파일이 다운로드 됩니다.

3. ```lib``` 폴더로 파일을 복사하고 명령 프롬프트에서 아래와 같이 적어야 합니다. 단독 프로그램으로 빌드하였을 경우, (```node index.js``` 부분을 프로그램 명으로 대체해야 합니다)

```cmd
node index.js tslist.txt PRODUCT_NAME
```

마지막으로 다운로드가 완료된 파일은 ```mklink /d``` 옵션을 이용하여 바로가기 링크를 만들면 파일을 쉽게 옮길 수 있습니다.

서버와 네트워크 상태에 따라 가끔 일부 TS(Transport Stream) 파일이 다운로드가 되지 않을 수도 있습니다.

누락으로 인해 동영상 인코딩 작업이 시작되지 않았을 경우에는 다음과 같이 ```--export``` 옵션을 주고 인코딩을 다시 시작할 수 있습니다.

```cmd
node index.js tslist.txt PRODUCT_NAME --export
```