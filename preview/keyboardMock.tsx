// A stand-in for Steam's on-screen keyboard, so the theme can be checked in the browser.
// It uses the readable class names because the preview stub maps every name to itself.
import type { ReactNode } from "react";

const LETTERS = [
  "QWERTYUIOP".split(""),
  "ASDFGHJKL".split(""),
  "ZXCVBNM".split(""),
];

const SHIFTED: Record<string, string> = {
  Q: "!", W: "@", E: "#", R: "$", T: "%", Y: "^", U: "&", I: "*", O: "(", P: ")",
  A: "A", S: "S", D: "D", F: "F", G: "G", H: "H", J: "J", K: "K", L: "L",
  Z: "Z", X: "X", C: "C", V: "V", B: "B", N: "N", M: "M",
};

function Key({ label, extra, focused }: { label: string; extra?: string; focused?: boolean }) {
  return (
    <div className={["KeyboardKey", extra, focused && "gpfocus"].filter(Boolean).join(" ")}>
      <span className="KeyboardKeyLabel">{label}</span>
      {SHIFTED[label] && <span className="ShiftedLabel">{SHIFTED[label]}</span>}
    </div>
  );
}

function Row({ children }: { children: ReactNode }) {
  return <div className="KeyboardRow">{children}</div>;
}

export function KeyboardMock() {
  return (
    <div className="kb-mock">
      <div className="VirtualKeyboardContainer">
        <div className="VirtualKeyboardTextBuffer">
          <div className="VirtualKeyboardTextBufferText">void deck</div>
          <div className="VirtualKeyboardTextBufferCursorContainer">
            <div className="VirtualKeyboardTextBufferCursor" />
          </div>
        </div>

        <Row>
          {LETTERS[0].map((l) => (
            <Key key={l} label={l} focused={l === "F"} />
          ))}
        </Row>
        <Row>
          {LETTERS[1].map((l) => (
            <Key key={l} label={l} focused={l === "F"} />
          ))}
        </Row>
        <Row>
          <Key label="CAPS" extra="KeyboardCapsKey" />
          {LETTERS[2].map((l) => (
            <Key key={l} label={l} />
          ))}
          <Key label="BACK" extra="KeyboardBackspace" />
        </Row>
        <Row>
          <Key label="SHIFT" extra="KeyboardLeftShift" />
          <Key label="TAB" extra="KeyboardTabKey" />
          <Key label="" extra="KeyboardSpacebar" />
          <Key label="ENTER" extra="KeyboardEnter" />
          <Key label="SHIFT" extra="KeyboardRightShift" />
        </Row>

        <Row>
          <div className="KeyboardActionButtonLeft">ABC</div>
          <div className="KeyboardCategoryKeyHighlight">123</div>
          <div className="KeyboardActionButtonRight">EMOJI</div>
          <div className="KeyboardThemeButtons">THEME</div>
          <div className="KeyboardLayoutOptions">LAYOUT</div>
        </Row>

        <div className="KeyboardEmojiHeader">EMOJI</div>
        <div className="KeyboardEmojiRow">
          {["\u{1F600}", "\u{1F603}", "\u{1F604}", "\u{1F601}", "\u{1F606}", "\u{1F605}", "\u{1F923}", "\u{1F602}"].map((e) => (
            <div className="KeyboardEmojiKey" key={e}>
              {e}
            </div>
          ))}
        </div>
        <div className="KeyboardEmojiCategoryDivider" />
        <div className="KeyboardImePreeditText">にほんご</div>
        <div className="KeyboardImeAuxText">nihongo</div>
      </div>
    </div>
  );
}
