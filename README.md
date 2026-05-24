# Solar Voyager

3D 웹 환경에서 태양계를 관측하고, Voyager Mode로 우주를 직접 여행하듯 탐색할 수 있는 인터랙티브 태양계 탐험 웹앱입니다.

Solar Voyager는 단순히 행성이 도는 모습을 보여주는 모델이라기보다, 관측자와 여행자 사이의 감각을 실험하는 개인 웹 프로젝트입니다. 과학적인 구조를 바탕으로 하되, 화면의 분위기는 deep cosmic / mystic UI 감성을 조금 섞어 차갑고 조용한 우주 탐험 도구처럼 느껴지도록 만들었습니다.

## 프로젝트 동기

예전부터 3D 웹 구현을 해보고 싶었지만, WebGL과 3D 좌표계, 카메라 조작, 렌더링 최적화는 막연히 어렵게 느껴졌습니다. 이 프로젝트는 그런 막연함을 줄이기 위해 시작한 실험입니다.

직접 모든 코드를 처음부터 손으로 외워서 작성하기보다는, 아이디어를 정리하고 화면의 방향을 설계한 뒤 AI의 도움을 받아 구현을 확장하는 방식으로 진행했습니다. 만들고 싶었던 감각은 단순했습니다. "우주를 직접 여행해보고 싶다." Solar Voyager는 그 감각을 브라우저 안에서 조금이라도 만져보기 위한 시도입니다.

## 주요 기능

- 3D 태양계 시각화
- 태양, 8개 행성, 일부 위성/천체 표시
- 행성 궤도선 표시
- 별 배경과 소행성대 느낌의 particle field
- Observatory Mode / 관측 모드
- Voyager Mode / 자유 비행 모드
- 마우스/키보드 기반 우주 탐색
- 주요 UI 패널 접기/열기
- 한국어/영어 UI 전환
- 행성 정보 패널 / Planet Dossier
- 시간 시뮬레이션, 일시정지, 초기화
- 속도 슬라이더와 직접 숫자 입력
- `days/s`, `hours/s`, `minutes/s` 단위 선택
- 태양 bloom/glow 및 우주 배경 품질 설정
- 행성 라벨 glyph 표시
- Voyager Mode 진입 시 ESC 안내 표시

## 현재 제한 사항과 정확도 안내

Solar Voyager는 교육, 시각화, 탐험 경험을 위한 인터랙티브 모델입니다. 실제 우주 항법 도구나 정밀 천문 계산 프로그램이 아닙니다.

- 모든 거리, 크기, 궤도는 화면에서 탐색하기 쉽도록 압축 또는 보정되어 있습니다.
- 행성의 위치와 궤도는 시각적 이해와 조작감을 우선해 표현됩니다.
- 현재 배포 버전의 Real Alignment 관련 버튼은 `정렬 준비중` / `Align Soon` 상태로 비활성화되어 있습니다.
- 실제 JPL Horizons 데이터가 항상 연결된 상태가 아닙니다.
- 실제 천체력 기반 정렬은 향후 proxy/API 연결 후 확장할 예정입니다.
- 현재 구현은 "실제 우주 시뮬레이터"라기보다 "인터랙티브 태양계 탐험 웹앱"에 가깝습니다.

## 기술 스택

- React
- Vite
- JavaScript
- CSS
- Three.js
- React Three Fiber
- Drei
- React Three Postprocessing / postprocessing
- i18next / react-i18next
- ESLint

## 실행 방법

의존성을 설치합니다.

```bash
npm install
```

개발 서버를 실행합니다.

```bash
npm run dev
```

프로덕션 빌드를 생성합니다.

```bash
npm run build
```

빌드 결과를 로컬에서 확인합니다.

```bash
npm run preview
```

## 조작 방법

### Observatory Mode / 관측 모드

- 마우스 드래그: 태양계 관측 시점 회전
- 마우스 휠: 줌 인 / 줌 아웃
- 오른쪽 마우스 또는 middle drag: pan
- `Sun` / `태양`: 태양 중심 관측으로 복귀

### Voyager Mode / 자유 비행 모드

- `W` / `ArrowUp`: 앞으로 이동
- `S` / `ArrowDown`: 뒤로 이동
- `A` / `ArrowLeft`: 왼쪽 이동
- `D` / `ArrowRight`: 오른쪽 이동
- `Q`: 아래로 이동
- `E`: 위로 이동
- `Shift`: boost
- `Space`: brake
- `ESC`: 커서 해제 및 Voyager Mode 일시정지/종료 흐름

## 프로젝트 구조

```text
src/
  components/
    scene/        # 3D Canvas, 조명, 별 배경, 후처리
    bodies/       # 태양, 행성, 위성, 궤도, 라벨, particle field
    ui/           # 패널, 툴바, TimeControls, InfoPanel, Voyager HUD
  hooks/          # 선택 상태, 시간, 카메라 이동, 조작 모드
  data/           # 행성/천체 데이터, 상수, texture manifest
  i18n/           # 한국어/영어 UI 문구
  services/       # 향후 천체력 데이터 연동을 위한 서비스 레이어
  utils/          # 스케일 변환, 궤도 계산, 포맷터
```

## Roadmap

- JPL Horizons proxy 연동
- 실제 천체력 기반 정렬
- Real Ephemeris Playback
- 더 많은 위성, 왜행성, 소행성, 카이퍼벨트 확장
- 행성 텍스처와 재질 표현 고도화
- 렌더링 성능 최적화
- 모바일/저사양 환경 최적화
- 접근성 개선

## 제작 노트

이 프로젝트는 개발자가 되기 위한 정답 같은 프로젝트라기보다, AI 시대에 아이디어를 어떻게 실제 화면으로 끌어낼 수 있는지 실험한 기록입니다. 직접 모든 코드를 외워서 쓰기보다는, 구조를 정리하고 방향을 잡고, AI의 도움을 받아 구현을 반복하면서 완성도를 높였습니다.

중요했던 것은 "3D를 완벽히 아는 사람만 3D 웹을 만들 수 있다"는 생각에서 벗어나는 일이었습니다. Solar Voyager는 그 과정에서 나온 개인 창작 프로젝트이자, 관측과 여행 사이의 감각을 브라우저 위에 옮겨보려는 작은 실험입니다.

## 주의 사항

Solar Voyager는 NASA, JPL 또는 기타 기관의 공식 프로젝트가 아닙니다. JPL Horizons는 향후 실제 천체력 데이터 연동 대상으로 언급되며, 현재 README의 설명은 공식 보증이나 공식 데이터 제공을 의미하지 않습니다.

현재 프로젝트의 우선순위는 정밀 천문 계산보다 화면에서 이해 가능한 태양계 탐험 경험입니다.
