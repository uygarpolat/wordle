const BIG_FILE = "wordlist_big.txt";
const SMALL_FILE = "wordlist_small.txt";
const TOTAL_LINES = 6;
const WORD_LENGTH = 5;

const KEYBOARD_EN = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["⏎", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
];

const KEYBOARD_TR = [
  ["E", "R", "T", "Y", "U", "I", "O", "P", "Ğ", "Ü"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ş", "İ"],
  ["⏎", "Z", "C", "V", "B", "N", "M", "Ö", "Ç", "⌫"],
];

export const CAPITAL_LETTERS_EN = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

export const CAPITAL_LETTERS_TR = [
  "A",
  "B",
  "C",
  "Ç",
  "D",
  "E",
  "F",
  "G",
  "Ğ",
  "H",
  "I",
  "İ",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "Ö",
  "P",
  "R",
  "S",
  "Ş",
  "T",
  "U",
  "Ü",
  "V",
  "Y",
  "Z",
];

const wordListFiles = import.meta.glob("../Languages/*/*.txt", {
  as: "raw",
  eager: true,
});

function data(language = "en") {
  const keyboardLayouts = {
    en: KEYBOARD_EN,
    tr: KEYBOARD_TR,
  };

  const alphabetArrays = {
    en: CAPITAL_LETTERS_EN,
    tr: CAPITAL_LETTERS_TR,
  };

  const alphabetLength = alphabetArrays[language].length;

  const big_file_path = `../Languages/${language}/${BIG_FILE}`;
  const small_file_path = `../Languages/${language}/${SMALL_FILE}`;

  const big_file_temp = wordListFiles[big_file_path];
  const small_file_temp = wordListFiles[small_file_path];

  const big_file_set = new Set(big_file_temp.split("\n"));
  const small_file_set = new Set(small_file_temp.split("\n"));

  const big_file = Array.from(big_file_set);
  const small_file = Array.from(small_file_set);

  return {
    language,
    big_file,
    small_file,
    big_file_set,
    small_file_set,
    total_lines: TOTAL_LINES,
    word_length: WORD_LENGTH,
    keyboard: keyboardLayouts[language] || KEYBOARD_EN,
    alphabetArray: alphabetArrays[language] || CAPITAL_LETTERS_EN,
    alphabetLength,
  };
}

export default data;
