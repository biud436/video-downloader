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

2. 영상이 시작된 직후, ```p``` 키를 누르면 텍스트 파일이 다운로드 됩니다.

3. ```lib``` 폴더로 파일을 복사하고 명령 프롬프트에서 아래와 같이 적어야 합니다.

```cmd
node index.js tslist.txt PRODUCT_NAME
```

해당 사이트의 서버 상태에 따라 가끔 다운로드가 되지 않을 수도 있습니다.

```User-Agent```가 사라지게 되면, 프로그램이 동작하지 않을 수도 있습니다.