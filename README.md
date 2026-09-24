# マッチ棒パズルGI

[遊ぶ](https://manybear-a1.github.io/match-puzzle-gi/)

マッチ棒パズル（の変種）です。マッチ棒そのものを動かす代わりにマッチ棒がくっついている頂点を動かします。
# ルール

## ざっくりとしたルール

このマッチ棒パズルではマッチ棒を直接動かすことはできません。代わりに、マッチ棒と繋がっている白い丸（関節みたいなもの）を動かして操作します。関節の置ける位置は決まっていて、それぞれの位置に関節が一つだけ入ります。関節をドラッグ＆ドロップすることで二つの関節の位置を入れ替えられるので、入れ替えを繰り返してパターンを作ってください。
## ざっくりとしたルール２（わかる人向け）

できる限り少ない数の互換を合成して二つのグラフの間の同型射を構成してください。
## 厳密なルール

画面右半分のマッチ棒で作られているパターンを画面左半分のマッチを使って作ってください。

ただし、通常のマッチ棒パズルのルールに加えて、以下の条件が追加されています。

- 各マッチ棒はちょうど二つの異なる頂点（白丸）と結びついており、また各頂点には結びついているマッチ棒の数が表示されます。また、同じ頂点の組に結びついているマッチ棒は高々一本しか存在しないことが保証されます。

- あなたができる操作は二つの頂点を交換することだけです。具体的には、交換したい頂点のうちの一つを選び、その頂点を左クリックしたのちもう一つの頂点までドラッグして離すことにより交換できます。この交換によって、交換した二つの頂点に結びついているマッチ棒の片側の位置も交換後の位置に移動されます。

- マッチ棒の長さは自動的に調整されます。マッチ棒の頭の向きは無視します。

このパズルは必ず解をもつようにランダムに生成されます。（盤面の生成確率はおそらく等確率ではありません。生成コードは（[ここ](/src/puzzlesolver/puzzlesolver.ts)にあります）このゲームの目標は最小の交換回数で同じパターンを作ることです。

スコアは今のところEasyとNormalにしかありません。EasyとNormalにおいては、スコアは最小の交換回数/あなたが頂点を交換した回数 * 100で計算されます。最大で100点です。
# その他機能
- 難易度設定

  Easy, Normal, Hard, Impossibleの四つ。

  それぞれ盤面のサイズがEasyが2x3頂点、Normalが3x3頂点、Hardが4x4頂点、Impossibleが5x5頂点となっている。

 
- ハイライト機能
  
  マッチ棒の上にポインタをホバーさせることでそのマッチ棒と、マッチ棒に直接繋がっている関節をハイライトできる。

  位置が確定している関節を右クリックすることで固定することができ、固定された関節は青色になる。

  関節の上にポインタをホバーさせることでその関節と、関節に直接繋がっているマッチ棒をハイライトできる。
- 解答機能
  
  EasyとNormal、およびHardとImpossibleの一部の問題では、最短手数の計算表示機能が利用でき、ヒントや解答として利用できる。

  右上の「Show Shortest Solution」を押すことで、最短手数の解答を表示できる。解答表示場面では、「Replay From Start」ボタンを押すことで、最初から順番に解答の手順を表示することができ、またその下のシークバーを動かすことで途中までの解答を表示することができる。問題によっては手順ごとの考え方が表示される場合がある。

  「Show Shortest Solution」の下の「Next Shortest Step」ボタンを押すことで、現在の盤面から始めた最短手数の解答の次の手順をコンピューターに代わりに操作してもらうことができる。

  このパズルに備わっているパズルソルバーは[戦略](./editorial/strategy.md)に基づいて実装されている。

# TODO（やりたいこと）


- 無限に続けられるモード(Infinity)の追加
  
  下からどんどんマッチ棒が出てくるみたいな。

- パズル生成の改良
  
  現在は完全ランダム（各辺が30%で出現する）に生成しているため、盤面ごとの難易度のぶれ幅が大きい。生成後の盤面のシャッフルも改良する必要があるかもしれない。（例えば攪乱順列にするとか）

- 別タイプのパズルを追加する

  グラフの平面埋め込み（あるいは交差が最小となる埋め込み、またはクラトフスキー部分グラフ）を求めるパズル。別のリポジトリの方がいいかもしれない。

  [アルゴリズムの候補1](https://www.uni-konstanz.de/algo/publications/b-lrpt-sub.pdf)

  [候補2](https://mathworld.wolfram.com/GraphCrossingNumber.html)（integer programmingのやつと、Quickcross）

  [参考1](https://mathworld.wolfram.com/PlanarGraph.html),[参考2](https://mathworld.wolfram.com/GraphCrossingNumber.html)

- （自動）テスト
  
  特にアルゴリズム関連のテストが必要。

- チュートリアル
  
  パズルの遊び方の説明を追加する。

- 戦略、アルゴリズム等の解説、証明
  草案は[ここ](./editorial/strategy.md)と[ここ](./editorial/koborebanasi.md)にあります。
[![Deploy](https://github.com/pawap90/phaser3-ts-vite-eslint/actions/workflows/deploy.yml/badge.svg)](https://github.com/pawap90/phaser3-ts-vite-eslint/actions/workflows/deploy.yml)
[![Build](https://github.com/pawap90/phaser3-ts-vite-eslint/actions/workflows/build.yml/badge.svg)](https://github.com/pawap90/phaser3-ts-vite-eslint/actions/workflows/build.yml)

A modern Phaser 3 template: Phaser 3 + TypeScript + Vite + ESLint + GitHub Pages

[![Phaser Version 3.80.1](https://img.shields.io/badge/Phaser%20-%20v3.80.1%20-%20%23404951?labelColor=%2399388c&style=flat-square)](./package.json#L24)
[![TypeScript Version 5.2.2](https://img.shields.io/badge/TypeScript%20-%20v5.2.2%20-%20%23404951?labelColor=%233178c6&style=flat-square)](./package.json#L21)
[![Vite Version 5.3.4](https://img.shields.io/badge/Vite%20-%20v5.3.4%20-%20%23404951?labelColor=%23ffc820&style=flat-square)](./package.json#L20)
[![ESLint Version 8.57.0](https://img.shields.io/badge/ESLint%20-%20v8.57.0%20-%20%23404951?labelColor=%234930bd&style=flat-square)](./package.json#L19)

![A modern phaser 3 tempalte with typescript, vite, eslint, and GitHub pages](https://github.com/user-attachments/assets/3718c0b8-fad6-4dda-9ad1-54bfb496f128)

---

**Table of contents**
- [マッチ棒パズルGI](#マッチ棒パズルgi)
- [ルール](#ルール)
  - [ざっくりとしたルール](#ざっくりとしたルール)
  - [ざっくりとしたルール２（わかる人向け）](#ざっくりとしたルール２わかる人向け)
  - [厳密なルール](#厳密なルール)
- [その他機能](#その他機能)
- [TODO（やりたいこと）](#todoやりたいこと)
- [Dependencies](#dependencies)
- [Quick start](#quick-start)
- [Project structure](#project-structure)
- [TypeScript](#typescript)
- [Vite](#vite)
- [ESLint](#eslint)
- [NPM Scripts](#npm-scripts)
- [GitHub Pages](#github-pages)
  - [Happy coding!](#happy-coding)

# Dependencies
- [Node.js](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/)

# Quick start

1. Get this template: Press over the "Use this template" button. This will allow you to create a new repo with this project's structure on your Github account. Then you can clone it to your local machine.

    Alternatively, you can clone this repo to your machine using the following command.

```sh
git clone https://github.com/pawap90/phaser3-ts-vite-eslint.git
```

2. Install dependencies: Run the following command from the project's root folder:

```sh
npm install
```

3. Start the local development server: 

```sh
npm run dev
```

Go to your browser and navigate to http://localhost:5173. You should see this beauty:

![Acho the pup bouncing around](https://i.imgur.com/bYVcrSr.gif)

# Project structure

```
├── /.github
│   └── /workflows
│           ├── build.yml
│           └── deploy.yml
├── /public
│       ├── acho.png
│       └── ground.png
├── /src
│   ├── /scenes
│   │      ├── game.scene.ts
│   │      └── preloader.scene.ts
│   ├── main.ts
│   └── vite-env.d.ts
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.json
└── vite.config.ts
```

> You can remove the assets within the `public` directory, but I recommend you first run the project once and make sure everything is installed and running properly.

# TypeScript
You can find TypeScript's configuration in `tsconfig.json`. To keep the codebase safe, you'll notice the flag `strict` is set to true. This [enables all strict type checking options](https://www.typescriptlang.org/tsconfig/#strict), like `noImplicitAny` and `alwaysStrict`. Feel free to add your preferred configurations.

# Vite
Vite provides the development server and the production build. 
Learn more about Vite [here](https://vitejs.dev/).

To build your project for development and enjoy live updates, execute:

```sh
npm run dev
```

This will start the server in http://localhost:5173.


To build your project for production:

```sh
npm run build
```

# ESLint
ESLint keeps your codebase clean and consistent while also helping you prevent errors. 

This project comes with a few custom rules already set up in the `eslint.config.js` file. Feel free to update them in your own project.

Check for errors or styling issues using the following command:

```sh
npm run lint
```

This will print the list of problems found. 

Some of the issues can be automatically fixed using:

```sh
npm run lint:fix
```

# NPM Scripts
A brief description of the scripts you'll find in the `package.json`:
- **dev**: Starts the local development server. Use it to test your project during development.
- **prebuild**: Compiles the project and runs the linter. This script will be executed before `build`, and its goal is to find any errors before the production build is created.
- **build**: Generates the production build in a `dist` folder located in the project's root.
- **lint**: Runs the linter and prints any issues found
- **lint:fix**: Runs the linter and executes automatic fixes. It'll also print any issues that couldn't be solved.

# GitHub Pages
This template includes a couple of GitHub Actions workflows:
- `build.yml`: It builds the project, runs the linter and the TypeScript compiler to check for errors. Triggered manually or when a PR is opened targeting the `main` branch.
- `deploy.yml`: This workflow is triggered when a push is made to the `main` branch. It deploys the production build to GitHub Pages.

You can see this template's latest deploy to GitHub Pages here: [pawap90.github.io/phaser3-ts-vite-eslint](https://pawap90.github.io/phaser3-ts-vite-eslint/).

To use the **GitHub Pages** in your own repo, follow these steps:

1. In `vite.config.ts`, update the `base` property with your repo's name:

```diff
export default defineConfig({
-    base: '/phaser3-ts-vite-eslint/'
+    base: '/your-repo-name/'
});
```

2. Enable GitHub Pages in your repo's settings. To find this option, go to your repo's main page, click on the "Settings" tab, and click on "Pages" in the left sidebar.

<!-- no toc -->
## Happy coding! 
