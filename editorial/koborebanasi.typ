#set text(lang: "ja")
#show link: set text(fill: blue)
#import "@preview/fletcher:0.5.8" as fletcher: diagram, edge, node
= 元ネタ

グラフ同型判定問題（#link("https://ja.wikipedia.org/wiki/%E3%82%B0%E3%83%A9%E3%83%95%E5%90%8C%E5%9E%8B")[Wikipedia(日本語)]、#link("https://en.wikipedia.org/wiki/Graph_isomorphism_problem")[Wikipedia(English)]）

一般的なパズルはNP完全なことが多いらしいが、この問題がNP完全に属するかは未解決問題。ちなみに今回のパズルは同型であることが分かったうえで、その同型写像たちを最小の互換で作るような問題なので厳密には別物である。

= 総盤面数

例えば、難易度がNormalだと、右のグラフで、辺が生成されうる場所が $9 dot 8 / 2 = 36$ なので $2^36$ 以上の盤面があり、右の盤面を固定した時の左の盤面数が重複を含め多くとも $9!$ なので $2^36 dot 9!$ 以下になるところまで判明した。厳密な値を出すのは諦めた。

= 最短手数

頂点数が少なければ、1回の交換で到達できる盤面、2回の交換で到達できる盤面、3回の交換で到達できる盤面、…\
というような形で順にBFSをしていき、それぞれの盤面が目標のグラフと同じになっているかを判定すれば求められる。

頂点数が多い場合は、状態数が多くなりすぎるため、BFSをしてもメモリが足りなくなってしまため、ヒューリスティック的な方法で最短手数を求める必要がある。#link("../strategy.md")[strategy.md]を参照。

また、最短手数は頂点数以下である。例えば、Normalでの最短手数は9手以下である。

これは、初期状態の9頂点から、全ての状態への移行がなんらかの置換で表され、これらの任意の置換が9つの互換で合成できることから従う。これを証明する。

頂点に1、2、…、9とインデックスをふる。このとき、頂点の任意の置換は1から9の順列で表される。この置換を先頭から作ることを考える。

例として解の一つが3、2、1、6、7、5、4、9、8であったとき、この置換を先頭から作る。

最初の置換は1、2、3、4、5、6、7、8、9である。先頭を3にしたいので1と3を交換する。

置換は3、2、1、4、5、6、7、8、9になる。二番目と三番目はすでにそろっている。次に四番目を6にしたいので4と6を交換する。

置換は3、2、1、6、5、4、7、8、9になる。五番目を7にしたいので5と7を交換する。

置換は3、2、1、6、7、4、5、8、9になる。六番目を5にしたいので4と5を交換する。

置換は3、2、1、6、7、5、4、8、9になる。七番目はすでにそろっている。次に八番目を9にしたいので8と9を交換する。

置換は3、2、1、6、7、5、4、9、8になる。合成した互換の数は5個。

このように先頭から一つずつそろえることで、一つ揃えるたびに最大でも一つしか互換が必要ないことから、最短手数が9手以下になることがいえる。（ちなみに、最後の一回分は自動的にそろうので最短手数は8手以下も証明できる。）

さらに、行うことが確定している操作（ある頂点を置く場所が一か所に決まっている状態のこと、詳しくは#link("strategy.md")[strategy.md]を参照）を繰り返すだけで多くの場合最短手数を達成できる。（少なくとも、行うことが確定している操作がなくなるまではその操作を続けることが最短手順の一つ）

== 説明

=== 問題の簡略化
ここからは問題の番号をつけなおして、列を昇順に整列する問題になるように考える。例えば、1、2、3、4、5、6、7、8、9から3、2、1、6、7、5、4、9、8を作る場合は、次のように考えられる。

#diagram(
  spacing: (0.4em, 3em),
  node((-1, 0), [初期状態]),
  node((-1, 1), [解]),
  node((0, 0), [1], name: <start-1>),
  node((1, 0), [2], name: <start-2>),
  node((2, 0), [3], name: <start-3>),
  node((3, 0), [4], name: <start-4>),
  node((4, 0), [5], name: <start-5>),
  node((5, 0), [6], name: <start-6>),
  node((6, 0), [7], name: <start-7>),
  node((7, 0), [8], name: <start-8>),
  node((8, 0), [9], name: <start-9>),
  node((0, 1), [3（一）], defocus: 0, name: <answer-1>),
  node((1, 1), [2（二）], defocus: 0, name: <answer-2>),
  node((2, 1), [1（三）], defocus: 0, name: <answer-3>),
  node((3, 1), [6（四）], defocus: 0, name: <answer-4>),
  node((4, 1), [7（五）], defocus: 0, name: <answer-5>),
  node((5, 1), [5（六）], defocus: 0, name: <answer-6>),
  node((6, 1), [4（七）], defocus: 0, name: <answer-7>),
  node((7, 1), [9（八）], defocus: 0, name: <answer-8>),
  node((8, 1), [8（九）], defocus: 0, name: <answer-9>),
  edge(<start-1.south>, <answer-3.north>, "-|>"),
  edge(<start-2.south>, <answer-2.north>, "-|>"),
  edge(<start-3.south>, <answer-1.north>, "-|>"),
  edge(<start-4.south>, <answer-7.north>, "-|>"),
  edge(<start-5.south>, <answer-6.north>, "-|>"),
  edge(<start-6.south>, <answer-4.north>, "-|>"),
  edge(<start-7.south>, <answer-5.north>, "-|>"),
  edge(<start-8.south>, <answer-9.north>, "-|>"),
  edge(<start-9.south>, <answer-8.north>, "-|>"),

  node((-1, 0 + 2), [初期状態]),
  node((-1, 1 + 2), [解]),
  node((0, 0 + 2), [三], name: <replaced-start-1>),
  node((1, 0 + 2), [二], name: <replaced-start-2>),
  node((2, 0 + 2), [一], name: <replaced-start-3>),
  node((3, 0 + 2), [七], name: <replaced-start-4>),
  node((4, 0 + 2), [六], name: <replaced-start-5>),
  node((5, 0 + 2), [四], name: <replaced-start-6>),
  node((6, 0 + 2), [五], name: <replaced-start-7>),
  node((7, 0 + 2), [九], name: <replaced-start-8>),
  node((8, 0 + 2), [八], name: <replaced-start-9>),
  node((0, 1 + 2), [一], defocus: 0, name: <replaced-answer-1>),
  node((1, 1 + 2), [二], defocus: 0, name: <replaced-answer-2>),
  node((2, 1 + 2), [三], defocus: 0, name: <replaced-answer-3>),
  node((3, 1 + 2), [四], defocus: 0, name: <replaced-answer-4>),
  node((4, 1 + 2), [五], defocus: 0, name: <replaced-answer-5>),
  node((5, 1 + 2), [六], defocus: 0, name: <replaced-answer-6>),
  node((6, 1 + 2), [七], defocus: 0, name: <replaced-answer-7>),
  node((7, 1 + 2), [八], defocus: 0, name: <replaced-answer-8>),
  node((8, 1 + 2), [九], defocus: 0, name: <replaced-answer-9>),
  edge(<replaced-start-1.south>, <replaced-answer-3.north>, "-|>"),
  edge(<replaced-start-2.south>, <replaced-answer-2.north>, "-|>"),
  edge(<replaced-start-3.south>, <replaced-answer-1.north>, "-|>"),
  edge(<replaced-start-4.south>, <replaced-answer-7.north>, "-|>"),
  edge(<replaced-start-5.south>, <replaced-answer-6.north>, "-|>"),
  edge(<replaced-start-6.south>, <replaced-answer-4.north>, "-|>"),
  edge(<replaced-start-7.south>, <replaced-answer-5.north>, "-|>"),
  edge(<replaced-start-8.south>, <replaced-answer-9.north>, "-|>"),
  edge(<replaced-start-9.south>, <replaced-answer-8.north>, "-|>"),
)

1が三番目に来ているから、1の場所を三にすると、昇順にソートしたときに三が三番目に来るようになる。同様に繰り返すと、最終的には、三、二、一、七、六、四、五、九、八に並んだ列を昇順にソートする問題になる。

一般的には、解のi番目にいる数字がiになるようにスタートを置き換える。このようにすると、ゴールの見た目は同じになるので考えやすい。

#link("https://atcoder.jp/contests/abc436/editorial/14751")[ABC436-Eの解説]によれば、今回のパズルでは、解となるそれぞれの置換に必要な互換の回数はサイクル分解により計算でき、その答えはサイクルの数を $C$ とすると $"頂点数" - C$ となる。解によってサイクルの個数 $C$ は異なるかもしれないが、少なくとも、行うことが確定している操作をすると、必ず $C$ が一つ増加する。

=== 行うことが確定している操作をすると、必ずCが一つ増加することの証明

ある頂点を置く場所が一か所に決まっているので、その頂点につけられる数字はどの解でも同じ数字になる。ここではその数を $k$ と置く。

このとき、その行うことが確定している操作は、$k$ 番目にいない $k$ を $k$ 番目に入れ替える操作となる。

操作前は $k$ → $k$ 番目にいる要素 → … → $k$ の一つ前 → $k$ というサイクルがあり、操作で移動するどちらの頂点も同じサイクルに属している。操作後は $k$ → $k$ のサイクルと、$k$ 番目にもともといた要素 → … → $k$ の一つ前だった要素 → $k$ 番目にもともといた要素の二つに分裂する。従って $C$ が一つ増加する。

そして、どの操作においても $C$ は一つしか増加しないため、確定している操作に優劣はなく、どの操作を行っても結果は変わらない。

参考: #link("https://zenn.dev/koboshi/articles/e60e2737854c1e")[置換や互換に関する入門記事]

そしてさらに、正しくない位置にいる頂点を正しい位置に一つずつ移動していく形の最短の解が存在する。ということも証明できる。

=== 証明

$C$ が一番大きくなるような順列を一つ選ぶ。この順列に従って、正しくない位置にいる頂点を正しい位置に一つずつ移動していくと、最短の解の一つが得られる。

操作は全て $k$ 番目にいない $k$ を $k$ 番目に入れ替える操作となるので、上の説明と同様に $C$ が一つ増加する。

#quote(block: true)[
  操作前は $k$ → $k$ 番目にいる要素 → … → $k$ の一つ前 → $k$ というサイクルがあり、操作で移動するどちらの頂点も同じサイクルに属している。操作後は $k$ → $k$ のサイクルと、$k$ 番目にもともといた要素 → … → $k$ の一つ前だった要素 → $k$ 番目にもともといた要素の二つに分裂する。従って $C$ が一つ増加する。
]
