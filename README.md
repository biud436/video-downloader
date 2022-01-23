# 소개

특정 사이트의 영상을 고속으로 내려 받는 용도의 프로그램입니다. 크롬 확장 프로그램을 사용하면 쉽게 영상을 내려받을 수 있는 시대입니다. 하지만 `100Mbps 네트워크 환경`에서는 2GB 이상의 파일을 내려 받을 때 속도가 굉장히 느리고, 또한 HLS 다운로드 특성상, ts 파일의 목록이 나열되어있는 m3u8 파일이 암호화되어있는 경우, 크롬 확장 프로그램으로도 영상을 내려받을 수가 없습니다. 이런 경우에는 이 프로그램을 사용하면 쉽게 영상을 내려받을 수 있으며 또한 100Mbps 네트워크 환경에서도 빠른 속도로 영상을 받을 수 있습니다. 기본적으로 쓰레드 풀을 이용하여 가용 CPU를 최대한 활용해 동시 분할 다운로드를 하기 때문에
3GB 이상의 영상의 다운로드 속도가 3분 이상이 걸리지 않습니다. 분할 다운로드를 하려면 해당 웹의 영상 서버가 TS 파일을 지원해야 합니다.

개인적인 용도로 쓰고 있기 때문에 GUI 버전은 없습니다. 추후 계획은 크롬 확장 API를 사용하여 네트워크로 요청되는 파일을 감시하고, 소켓 통신을 통해 본 유틸과 통신을 하여 유튜브 등 다른 사이트도 지원해볼 예정 중에 있습니다. 그러나 이것은 어려운 작업이므로 이를 위한 구체적인 개발 계획은 아직 없습니다.

# Windows

1. 크롬 확장 프로그램 `Tampermonkey`를 다운로드 받은 후, 새로운 유저 스크립트를 만들고 `lib/DownloadTSList.user.js`의 내용을 붙여 넣으십시오.

2. Windows 용 `ffmpeg`와 `aria2`가 필요합니다. 환경 변수 PATH에 실행 파일이 위치한 경로를 지정해주시기 바랍니다.

설치 여부는 아래와 같이 확인할 수 있습니다.

```bat
C:\Users\U>where ffmpeg
C:\Program Files\ImageMagick-7.0.7-Q16\ffmpeg.exe
C:\ffmpeg-20200131-62d92a8-win64-static\bin\ffmpeg.exe

C:\Users\U>where aria2c
C:\aria2-1.35.0-win-64bit-build1\aria2c.exe
```

그리고 최신 `Node.js`를 설치해야 합니다. 설치한 직후, 이 프로젝트를 복제(clone)해주세요. 그리고 루트 폴더까지 이동한 후 다음과 같은 명령을 호출해주세요.

```
yarn install
```

이렇게 하면 필요한 모든 라이브러리가 설치됩니다.

2. 영상이 시작된 직후, `p` 키를 누르면 텍스트 파일이 다운로드 됩니다.

3. `lib` 폴더로 파일을 복사하고 명령 프롬프트에서 아래와 같이 적어야 합니다.

```cmd
yarn start tslist.txt PRODUCT_NAME
```

마지막으로 다운로드가 완료된 파일은 `mklink /d` 옵션을 이용하여 바로가기 링크를 만들면 파일을 쉽게 옮길 수 있습니다.

서버와 네트워크 상태에 따라 가끔 일부 TS(Transport Stream) 파일이 다운로드가 되지 않을 수도 있습니다.

누락으로 인해 동영상 인코딩 작업이 시작되지 않았을 경우에는 다음과 같이 `--export` 옵션을 주고 인코딩을 다시 시작할 수 있습니다.

```cmd
yarn start tslist.txt PRODUCT_NAME --export
```

# macOS Monterey

`brew`로 다음 패키지를 설치하고 터미널을 재실행하세요.

```sh
brew install node
brew install yarn
brew install aria2
brew install ffmpeg
```

깃을 이용하여 저장소를 복제한 후, 터미널에서 다음 명령을 실행하세요.

```sh
yarn install
```

실행 방법은 동일합니다.

```bash
yarn start tslist.txt PRODUCT_NAME
```
