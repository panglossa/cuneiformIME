# cuneiformIME
A simple way to select cuneiform characters based on the strokes they are composed of.

![Cuneiform Input Method](/media/cuneiformIME.png "Cuneiform Input Method")

This is a very basic input method for Cuneiform, the idea being that you "draw" each character by clicking on the simple strokes that compose such character.

You can see it in action here: <a href="https://htmlpreview.github.io/?https://github.com/panglossa/cuneiformIME/blob/main/index.html" target="htmlpreview">https://htmlpreview.github.io/?https://github.com/panglossa/cuneiformIME/blob/main/index.html</a>

As there is no standard stroke order (like in Hanzi/Kanji, for example), I try to include as many variations as I can think of, for characters whose stroke order is not totally evident. So, for example, for a character such as 𒑟 there is no question about the stroke order (first `𒁹`, then `𒀹`); but for a character such as 𒑢, you could either draw the diagonal strokes first, then the horizontal ones (i.e., `𒀹 𒀹 𒀸 𒀸` ), or you could write the combination diagonal-horizontal, then repeat it (i.e., `𒀹 𒀸 𒀹 𒀸`). Here both stroke sequences are valid.

Also, I try to include stroke sequences for both older and newer forms of each character. That's why, for instance, you can get the character 𒀖 either with `𒌋 𒀹 𒍻` (reflecting the old form of the character) or with `𒌋 𒀸 𒀸` (reflecting the more developed form of the character). What shape is displayed depends on the font used in your computer/phone/&c.

Currently, 986 glyphs are included, as you can see in the data file (`cunIMEglyphdata.csv`), which you can easily change to make corrections or add your own characters, for example.
