#import "@preview/cades:0.3.1": qr-code
#let split(document) = {
  [
    #scale(document, x: 420mm, y: 594mm, origin: left + top)
    #pagebreak()
    #scale(document, x: 420mm, y: 594mm, origin: right + top)
    #pagebreak()
    #scale(document, x: 420mm, y: 594mm, origin: right + bottom)
    #pagebreak()
    #scale(document, x: 420mm, y: 594mm, origin: left + bottom)
  ]
}
#set text(size: 10mm)
//#show: split
= マッチ棒パズル
（もどき）
== ここからスマホで遊べるよ！
#qr-code("https://typst.app", width: 100%)
