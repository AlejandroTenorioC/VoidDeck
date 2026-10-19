// A stand-in for Steam's on-screen keyboard, so the theme can be checked in the browser.
// It uses the readable class names because the preview stub maps every name to itself.
import type { ReactNode } from "react";

const LETTERS = [
  "QWERTYUIOP".split(""),
  "ASDFGHJKL".split(""),
  "ZXCVBNM".split(""),
];

const NUMBERS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

// Steam shows the shifted symbol only on the keys that have one (the numbers).
const SHIFTED: Record<string, string> = {
  "1": "!", "2": "@", "3": "#", "4": "$", "5": "%",
  "6": "^", "7": "&", "8": "*", "9": "(", "0": ")",
};

function Key({ label, extra, focused }: { label: string; extra?: string; focused?: boolean }) {
  return (
    <div className={["KeyboardKey", extra, focused && "gpfocus"].filter(Boolean).join(" ")}>
      {/* Steam renders the main symbol as a bare span, with no class of its own. */}
      <span>{label}</span>
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
          {NUMBERS.map((n) => (
            <Key key={n} label={n} />
          ))}
        </Row>
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
          <Key label="SPACE" extra="KeyboardSpacebar" />
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
