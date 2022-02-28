'use strict';
// ゲーム中であるか
let isGameOver = true;
let blockX = 4;
let blockY = 0;
let blockOrientation = 0;
let blockType = Math.floor(Math.random() * 7);
let score = 0;
let highestScore = 0;
let timer = 1000;
// ブロックの状態の変数
let blockStatus = [];
let nextBlock = Math.floor(Math.random() * 7);
// document.getElementById()をid()に省略
const id = id => document.getElementById(id);

// --- キャンバスの取得 ---

// ゲーム画面のキャンバスを取得
const gameScreen = id('game');
const canvasGameScreen = gameScreen.getContext('2d');
// 背景のCanvasを取得
const BackGround = id('back');
const canvasBackGround = BackGround.getContext('2d');
// 次のブロックを予告するキャンバスを取得
const showNextBlock = id('next-block');
const canvasNextBlock = showNextBlock.getContext('2d');

// --- 得点 ---
// 得点
const scoreSpan = id('score');
// 最高得点
const highestScoreSpan = id('highest-score');

// --- ボタンを取得 ---
const startBtn = id('start-btn');

// --- 音の読み込み ---
// 回転時の音
const bgm = id('bgm');
// 回転時の音
const rotation = id('rotation');
// 落ちるときの音
const falling = id('falling');
// 落ちて一番下についたときの音
const finishFalling = id('finish_falling');
// 消した時の音
const disappear = id('disappear');
// 4列消した時の音
const fourColumnsDisappear = id('four_columns_disappear');
// ゲームオーバーのときの音
const gameover = id('gameover');

// ブロック
const block = [
  // 紫ブロック
  [
    [
      [0, 0, 0, 0],
      [1, 1, 1, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 1, 0, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    [
        [0, 1, 0, 0],
        [1, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0]
    ]
  ],
  // オレンジブロック
  [
    [
      [0, 0, 0, 0],
      [1, 1, 1, 0],
      [1, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    [
      [1, 0, 0, 0],
      [1, 0, 0, 0],
      [1, 1, 0, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 0, 0, 0],
      [0, 0, 1, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0]
    ],
    [
      [1, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0]
    ]
  ],
  // 赤ブロック1
  [
    [
      [0, 0, 0, 0],
      [1, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 1, 0, 0],
      [1, 1, 0, 0],
      [1, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 0, 0, 0],
      [1, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 1, 0, 0],
      [1, 1, 0, 0],
      [1, 0, 0, 0],
      [0, 0, 0, 0]
    ]
  ],
  // 緑ブロック
  [
    [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [1, 1, 0, 0],
      [0, 0, 0, 0]
    ],
    [
      [1, 0, 0, 0],
      [1, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [1, 1, 0, 0],
      [0, 0, 0, 0]
    ],
    [
      [1, 0, 0, 0],
      [1, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0]
    ]
  ],
  // 赤ブロック2
  [
    [
      [0, 0, 0, 0],
      [1, 1, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 0]
    ],
    [
      [1, 1, 0, 0],
      [1, 0, 0, 0],
      [1, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 0, 0, 0],
      [1, 0, 0, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [1, 1, 0, 0],
      [0, 0, 0, 0]
    ]
  ],
  // 水色ブロック
  [
    [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0]
    ],
    [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0]
    ]
  ],
  // 黄ブロック
  [
    [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0]
    ]
  ],
  // ピンクブロック
  [
    [
      [0, 0, 0, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 0, 0, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0]
    ]
  ],
  // 白ブロック
  [
    [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0]
    ]
  ],
  // グレーブロック
  [
    [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 0, 0, 0],
      [0, 0, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 0]
    ]
  ],
  // 青ブロック
  [
    [
      [0, 1, 1, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0]
    ],
    [
      [0, 0, 0, 0],
      [1, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0]
    ],
    [
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 1, 1, 0]
    ],
    [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 1],
      [0, 0, 0, 0]
    ]
  ],
  // 深緑ブロック
  [
    [
      [0, 0, 0, 0],
      [1, 0, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 1, 0, 0],
      [0, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 0, 0, 0],
      [1, 0, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 1, 0, 0],
      [0, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0]
    ]
  ]
];

// ブロックの色
//                   紫         赤         オレンジ    青緑       緑          水色       黄         ピンク     白          グレー     青          深緑
const blockColor = ['#cc00cc', '#cc0000', '#ffa500', '#2ee6c7', '#00cc00', '#00cccc', '#cccc00', '#ff6e97', '#ffffff', '#777777', '#1344ff', '#006a30'];

function makeNextBlock() {
   nextBlock = Math.floor(Math.random() * blockColor.length);
   canvasNextBlock.clearRect(0, 0, 79, 79);
   printBlock(canvasNextBlock, 0, 0, 0, nextBlock);
}

function check(bx, by, muki, shurui) {
  let p = block[shurui][muki];
  for (let n = 0; n < 4; n++) {
      for (let m = 0; m < 4; m++) {
          if (p[n][m] == 1) {
              // ブロックを描画する位置が空欄かどうかを調べる
              // Xが範囲外のところには動かせない
              if ((bx + m < 0) || (bx + m > 11)) {
                  return false;
              }
              // Yが範囲外のところには動かせない
              if ((by + n < 0) || (by + n > 21)) {
                  return false;
              }
              // 空欄ではない場合は動かせない
              if (blockStatus[by + n][bx + m] != 100) {
                  return false;
              }
          }
      }
  }
          return true;
}

function fallBelow() {
  // 下に移動する
  // 現在の座標と向きを保存
  let beforeBlockX = blockX;
  let beforeBlockY = blockY;
  let beforeBlockOrientation = blockOrientation;

  // 消す
  erase(canvasGameScreen, blockX, blockY, blockOrientation, blockType);

  // 移動
  blockY += 1;

  // 音を出す
  falling.play();

  // 移動できるかどうかを確認する
  let result = check(blockX, blockY, blockOrientation, blockType);
  if (result) {
      // 移動できる
      // 新しい位置に描く
      printBlock(canvasGameScreen, blockX, blockY, blockOrientation, blockType);
  } else {
      // 移動できない
      // 移動前の場所・向きに戻す
      blockX = beforeBlockX;
      blockY = beforeBlockY;
      blockOrientation = beforeBlockOrientation;
      printBlock(canvasGameScreen, blockX, blockY, blockOrientation, blockType);
  
      // この位置を当たり判定用の配列に設定する
      let p = block[blockType][blockOrientation];
      for (let n = 0; n < 4; n++) {
          for (let m = 0; m < 4; m++) {
              if (p[n][m] == 1) {
                  blockStatus[blockY + n][blockX + m] = blockType;
              }
          }
      }

      // 音を出す
      finishFalling.play();

      // ライン消しと得点計算する
      scoreCalculation()

      // 次のブロックとして設定したものが落ちてくるようにする
      blockX = 4;
      blockY = 0;
      blockType = nextBlock;
      blockOrientation = 0;
      printBlock(canvasGameScreen, blockX, blockY, blockOrientation, blockType);

      // そこに置けるかを判定
      result = check(blockX, blockY, blockOrientation, blockType);
      if (!result) {
          // 重なっているのでゲームオーバー

          // ボタンに表示する文字を変更
          startBtn.innerHTML = 'もう一度やる';

          // BGMを止める
          bgm.pause();

          // 音を出す
          gameover.play();

          // メッセージを出す
          alert('ゲームオーバー');

          // 実行中であることを止める
          isGameOver = true;
      }

      // さらに次のブロックを設定
      makeNextBlock();
  }

  // 時間を少しずつ速くする
  timer -= 1;
  if (timer < 50) {
      // すごく速くなったら元に戻す
      timer = 1000;
  }
}

function moveBlock(event) {
  // 現在の座標と向きを保存
  let beforeBlockX = blockX;
  let beforeBlockY = blockY;
  let beforeBlockOrientation = blockOrientation;

  // いまのブロックを消す
  erase(canvasGameScreen, blockX, blockY, blockOrientation, blockType);
  
  switch(event.keyCode) {
    case 39: // ［→］キーが押された
      // 右に移動
      blockX += 1;
      // 音を鳴らす
      rotation.play();
      break;
    case 37: // ［←］キーが押された
      // 左に移動
      blockX -= 1;
      // 音を鳴らす
      rotation.play();
      break;
    case 38: // ［↑］キーが押された
      // 回転する
      blockOrientation += 1;
      if (blockOrientation > 3) {
        blockOrientation = 0;
      }
      // 音を鳴らす
      rotation.play();
      break;
    case 40: // ［↓］キーが押されたときは下に移動させる
      fallBelow();
      break;
    }
  
  // 移動・回転できるかどうかを確認
  let result = check(blockX, blockY, blockOrientation, blockType);
  if (!result) {
      // 回転・移動できない
      // 元に戻す
      blockX = beforeBlockX;
      blockY = beforeBlockY;
      blockOrientation = beforeBlockOrientation;
  }

  // 新しい場所にブロックを描く
  printBlock(canvasGameScreen, blockX, blockY, blockOrientation, blockType);
}

function erase(c, bx, by, blockOrientation, shurui) {
  // 消す処理にする
  c.globalCompositeOperation = 'destination-out';
  // 描く（実際は消える）
  printBlock(c, bx, by, blockOrientation, shurui);
  // 元の描く処理に戻す
  c.globalCompositeOperation = 'source-over';
}

function printBlock(c, bx, by, muki, shurui){
  // ブロックの色と線
  c.fillStyle = blockColor[shurui];
  c.strokeStyle = '#333333';
  c.lineWidth = 3; 

  // パターンを決める
  let p = block[shurui][muki];
  
  // パターン通りに描く
  for (let n = 0; n < 4; n++) {
      for (let m = 0; m < 4; m++) {
          // 描くかどうか
          if (p[n][m] == 1) {
              // ここに描く
              c.fillRect((bx + m) * 20, (by + n) * 20, 20, 20);
              c.strokeRect((bx + m) * 20, (by + n) * 20, 20, 20);
          }
      }
  }
}



function scoreCalculation() {
  let erasedColumns = 0;

  // 全ラインをチェック
  for (let y = 0; y < 21; y++) {
      let sorottenai = false;
      for (let x = 1; x <= 10; x++) {
          if (blockStatus[y][x] == 100) {
              // ブロックがない（隙間または壁）
              sorottenai = true;
          }
      }

      if (!sorottenai) {
          // 揃ってる
          erasedColumns += 1;
  
          // 音を出す
          disappear.play();
  
          // 上から詰める
          for (let k = y; k > 0; k--) {
              for (let x = 1; x <= 10; x++) {
                  blockStatus[k][x] = blockStatus[k - 1][x];
              }
          }
      }
  }

  // ブロックを全部描き直す
  // 1.全部消す
  canvasGameScreen.clearRect(0, 0, 239, 439);

  // 2.ブロックがあるところを描く
  for (let y = 0; y < 22; y++) {
      for (let x = 0; x < 12; x++) {
          if ((blockStatus[y][x] != 100) &&(blockStatus[y][x] != 99)) {
              // ブロックを描く
              canvasGameScreen.fillStyle = blockColor[blockStatus[y] [x]];
              canvasGameScreen.strokeStyle = '#333333';
              canvasGameScreen.lineWidth = 3;
              canvasGameScreen.fillRect(x * 20, y * 20, 20, 20);
              canvasGameScreen.strokeRect(x * 20, y * 20, 20, 20);
          }
      }
  }

  // 得点を計算する
  switch (erasedColumns) {
      case 1:
          score += 10;
          break;
      case 2:
          score += 20;
          break;
      case 3:
          score += 100;
          break;
      case 4:
          score += 400;
          // 4ラインのときは効果音を鳴らす
          fourColumnsDisappear.play();
          break;
  }

  // 得点を表示する
  scoreSpan.innerHTML = score;
  if(score > highestScore) {
    // 最高得点を表示する
    highestScore = score;
  }

  highestScoreSpan.innerHTML = highestScore;
}

function moveDown() {
  if (!isGameOver) {
      // 実行中
      // 下に動かす
      fallBelow();
      // 次の時間を設定
      setTimeout(moveDown, timer);
  } 
}

function gamestart() {
  bgm.loop = true;
  bgm.currentTime = 0;
  bgm.play();
  // ボタンに表示する文字を変更
  startBtn.innerHTML = 'やり直す';

  // 画面を消す
  canvasGameScreen.clearRect(0, 0, 239, 439);

  // 得点を0にする
  score = 0;
  scoreSpan.innerHTML = score;

  // ゲーム中に設定し、タイマーを設定する
  isGameOver = false;
  timer = 1000;
  setTimeout(moveDown, timer);

  // 状態をクリア
  blockStatus = new Array(22);
  for (let i = 0; i < 22; i++) {
      blockStatus[i] = new Array(12);
      for (let j = 0; j < 12; j++) {
          blockStatus[i][j] = 100;
      }
  }

  // 壁を設定
  for (let i = 0; i < 22; i++) {
      blockStatus[i][0] = 99;
  }

  for (let i = 0; i < 22; i++) {
      blockStatus[i][11] = 99;
  }

  for (let i = 0; i < 12; i++) {
      blockStatus[21][i] = 99;
  }

  // ランダムなブロックを作る
  blockX = 4;
  blockY = 0;
  blockOrientation = 0;
  blockType = Math.floor(Math.random() * 7);

  // 次のブロックをセットする
  makeNextBlock();

  printBlock(canvasGameScreen, blockX, blockY, blockOrientation, blockType);
}

function preparation() {
  // 塗りを設定
  canvasBackGround.fillStyle = '#000';

  // 線を設定
  canvasBackGround.strokeStyle = '#444';
  canvasBackGround.lineWidth = 3;

  // 四角形を塗る
  canvasBackGround.fillRect(0, 0, 20, 20);

  // 四角形の枠線を描く
  canvasBackGround.strokeRect(0, 0, 20, 20);

  // 左壁を描く
  let x = 0;
  let y = 0;

  for (let i = 0; i < 22; i++) {
      canvasBackGround.fillRect(x, y, 20, 20);
      canvasBackGround.strokeRect(x, y, 20, 20);
      y = y + 20;
  }

  // 右壁を描く
  x = 220;
  y = 0;

  for (let i = 0; i < 22; i++) {
      canvasBackGround.fillRect(x, y, 20, 20);
      canvasBackGround.strokeRect(x, y, 20, 20);
      y = y + 20;
  }

  // 下壁を描く
  x = 0;
  y = 420;

  for (let i = 1; i < 21; i++) {
      canvasBackGround.fillRect(x, y, 20, 20);
      canvasBackGround.strokeRect(x, y, 20, 20);
      x = x + 20;
  }
}
