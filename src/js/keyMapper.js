/**
 * @fileoverview Implements KeyMapper
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */

/**
 * Constant of key mapping
 * @type {string[]}
 * @ignore
 */
const KEYBOARD_MAP = [
  '', // [0]
  '', // [1]
  '', // [2]
  'CANCEL', // [3]
  '', // [4]
  '', // [5]
  'HELP', // [6]
  '', // [7]
  'BACK_SPACE', // [8]
  'TAB', // [9]
  '', // [10]
  '', // [11]
  'CLEAR', // [12]
  'ENTER', // [13]
  'ENTER_SPECIAL', // [14]
  '', // [15]
  '', // [16] SHIFT
  '', // [17] CONTROL
  '', // [18] ALT
  'PAUSE', // [19]
  'CAPS_LOCK', // [20]
  'KANA', // [21]
  'EISU', // [22]
  'JUNJA', // [23]
  'FINAL', // [24]
  'HANJA', // [25]
  '', // [26]
  'ESCAPE', // [27]
  'CONVERT', // [28]
  'NONCONVERT', // [29]
  'ACCEPT', // [30]
  'MODECHANGE', // [31]
  'SPACE', // [32]
  'PAGE_UP', // [33]
  'PAGE_DOWN', // [34]
  'END', // [35]
  'HOME', // [36]
  'LEFT', // [37]
  'UP', // [38]
  'RIGHT', // [39]
  'DOWN', // [40]
  'SELECT', // [41]
  'PRINT', // [42]
  'EXECUTE', // [43]
  'PRINTSCREEN', // [44]
  'INSERT', // [45]
  'DELETE', // [46]
  '', // [47]
  '0', // [48]
  '1', // [49]
  '2', // [50]
  '3', // [51]
  '4', // [52]
  '5', // [53]
  '6', // [54]
  '7', // [55]
  '8', // [56]
  '9', // [57]
  ':', // [58]
  ';', // [59]
  '<', // [60]
  '=', // [61]
  '>', // [62]
  '?', // [63]
  'AT', // [64]
  'A', // [65]
  'B', // [66]
  'C', // [67]
  'D', // [68]
  'E', // [69]
  'F', // [70]
  'G', // [71]
  'H', // [72]
  'I', // [73]
  'J', // [74]
  'K', // [75]
  'L', // [76]
  'M', // [77]
  'N', // [78]
  'O', // [79]
  'P', // [80]
  'Q', // [81]
  'R', // [82]
  'S', // [83]
  'T', // [84]
  'U', // [85]
  'V', // [86]
  'W', // [87]
  'X', // [88]
  'Y', // [89]
  'Z', // [90]
  '', // [91] META
  '', // [92]
  'CONTEXT_MENU', // [93]
  '', // [94]
  'SLEEP', // [95]
  'NUMPAD0', // [96]
  'NUMPAD1', // [97]
  'NUMPAD2', // [98]
  'NUMPAD3', // [99]
  'NUMPAD4', // [100]
  'NUMPAD5', // [101]
  'NUMPAD6', // [102]
  'NUMPAD7', // [103]
  'NUMPAD8', // [104]
  'NUMPAD9', // [105]
  'MULTIPLY', // [106]
  'ADD', // [107]
  'SEPARATOR', // [108]
  'SUBTRACT', // [109]
  'DECIMAL', // [110]
  'DIVIDE', // [111]
  'F1', // [112]
  'F2', // [113]
  'F3', // [114]
  'F4', // [115]
  'F5', // [116]
  'F6', // [117]
  'F7', // [118]
  'F8', // [119]
  'F9', // [120]
  'F10', // [121]
  'F11', // [122]
  'F12', // [123]
  'F13', // [124]
  'F14', // [125]
  'F15', // [126]
  'F16', // [127]
  'F17', // [128]
  'F18', // [129]
  'F19', // [130]
  'F20', // [131]
  'F21', // [132]
  'F22', // [133]
  'F23', // [134]
  'F24', // [135]
  '', // [136]
  '', // [137]
  '', // [138]
  '', // [139]
  '', // [140]
  '', // [141]
  '', // [142]
  '', // [143]
  'NUM_LOCK', // [144]
  'SCROLL_LOCK', // [145]
  'WIN_OEM_FJ_JISHO', // [146]
  'WIN_OEM_FJ_MASSHOU', // [147]
  'WIN_OEM_FJ_TOUROKU', // [148]
  'WIN_OEM_FJ_LOYA', // [149]
  'WIN_OEM_FJ_ROYA', // [150]
  '', // [151]
  '', // [152]
  '', // [153]
  '', // [154]
  '', // [155]
  '', // [156]
  '', // [157]
  '', // [158]
  '', // [159]
  '@', // [160]
  '!', // [161]
  '"', // [162]
  '#', // [163]
  '$', // [164]
  '%', // [165]
  '&', // [166]
  '_', // [167]
  '(', // [168]
  ')', // [169]
  '*', // [170]
  '+', // [171]
  '|', // [172]
  '-', // [173]
  '{', // [174]
  '}', // [175]
  '~', // [176]
  '', // [177]
  '', // [178]
  '', // [179]
  '', // [180]
  'VOLUME_MUTE', // [181]
  'VOLUME_DOWN', // [182]
  'VOLUME_UP', // [183]
  '', // [184]
  '', // [185]
  ';', // [186]
  '=', // [187]
  ',', // [188]
  '-', // [189]
  '.', // [190]
  '/', // [191]
  '`', // [192]
  '', // [193]
  '', // [194]
  '', // [195]
  '', // [196]
  '', // [197]
  '', // [198]
  '', // [199]
  '', // [200]
  '', // [201]
  '', // [202]
  '', // [203]
  '', // [204]
  '', // [205]
  '', // [206]
  '', // [207]
  '', // [208]
  '', // [209]
  '', // [210]
  '', // [211]
  '', // [212]
  '', // [213]
  '', // [214]
  '', // [215]
  '', // [216]
  '', // [217]
  '', // [218]
  '[', // [219]
  '\\', // [220]
  ']', // [221]
  '\'', // [222]
  '', // [223]
  'META', // [224]
  'ALTGR', // [225]
  '', // [226]
  'WIN_ICO_HELP', // [227]
  'WIN_ICO_00', // [228]
  '', // [229]
  'WIN_ICO_CLEAR', // [230]
  '', // [231]
  '', // [232]
  'WIN_OEM_RESET', // [233]
  'WIN_OEM_JUMP', // [234]
  'WIN_OEM_PA1', // [235]
  'WIN_OEM_PA2', // [236]
  'WIN_OEM_PA3', // [237]
  'WIN_OEM_WSCTRL', // [238]
  'WIN_OEM_CUSEL', // [239]
  'WIN_OEM_ATTN', // [240]
  'WIN_OEM_FINISH', // [241]
  'WIN_OEM_COPY', // [242]
  'WIN_OEM_AUTO', // [243]
  'WIN_OEM_ENLW', // [244]
  'WIN_OEM_BACKTAB', // [245]
  'ATTN', // [246]
  'CRSEL', // [247]
  'EXSEL', // [248]
  'EREOF', // [249]
  'PLAY', // [250]
  'ZOOM', // [251]
  '', // [252]
  'PA1', // [253]
  'WIN_OEM_CLEAR', // [254]
  '' // [255]
];

let sharedInstance;

/**
 * Class KeyMapper
 */
class KeyMapper {
  /**
   * Creates an instance of KeyMapper.
   * @param {object} [options] options
   *  @param {string} options.splitter splitter string default is +
   * @memberof KeyMapper
   */
  constructor(options) {
    this._setSplitter(options);
  }

  /**
   * Set key splitter
   * @param {object} options Option object
   * @memberof KeyMapper
   * @private
   */
  _setSplitter(options) {
    const splitter = options ? options.splitter : '+';
    this._splitter = splitter;
  }

  /**
   * Convert event to keyMap
   * @memberof KeyMapper
   * @param {event} event Event object
   * @returns {string}
   */
  convert(event) {
    const keyMap = [];

    if (event.shiftKey) {
      keyMap.push('SHIFT');
    }

    if (event.ctrlKey) {
      keyMap.push('CTRL');
    }

    if (event.metaKey) {
      keyMap.push('META');
    }

    if (event.altKey) {
      keyMap.push('ALT');
    }

    const keyChar = this._getKeyCodeChar(event.keyCode);

    if (keyChar) {
      keyMap.push(keyChar);
    }

    return keyMap.join(this._splitter);
  }

  /**
   * Get character from key code
   * @memberof KeyMapper
   * @param {number} keyCode Key code
   * @returns {string}
   * @private
   */
  _getKeyCodeChar(keyCode) {
    const keyCodeCharacter = KEYBOARD_MAP[keyCode];

    return keyCodeCharacter;
  }

  /**
   * Get sharedInstance
   * @memberof KeyMapper
   * @returns {KeyMapper}
   */
  static getSharedInstance() {
    if (!sharedInstance) {
      sharedInstance = new KeyMapper();
    }

    return sharedInstance;
  }

  /**
   * get key code for a character
   * @static
   * @param {string} char - a character to be converted
   * @returns {number} key code for the char
   * @memberof KeyMapper
   */
  static keyCode(char) {
    return KEYBOARD_MAP.indexOf(char);
  }
}

export default KeyMapper;
