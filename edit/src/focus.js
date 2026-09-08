/* Where the figure sits on each overlay, as fractions of the frame, so the zoom lands on it
   when the presenter says the number. Anything not listed zooms on the centre-left, where
   the overlays put their content. Coordinates are read off the drawn assets in overlays.js. */
export const FOCUS = {
  'B1/OV-1': { x: 0.58, y: 0.37, words: ['0.5', 'nought', 'debit'] },
  'B1/OV-2': { x: 0.86, y: 0.67, words: ['232', 'total', 'seventy', 'debit'] },
  'B1/OV-3': { x: 0.84, y: 0.62, words: ['75', 'seventy-five', '0.27', 'nought'] },
  'B1/OV-4': { x: 0.78, y: 0.50, words: ['effective', 'hundred'] },
  'B1/OV-5': { x: 0.73, y: 0.42, words: ['1.09', 'one point', 'double', '308'] },
  'B1/OV-6': { x: 0.50, y: 0.63, words: ['109', 'cheaper', '198'] },
  'B1/OV-7': { x: 0.30, y: 0.72, words: ['effective'] },
  'B2/OV-1': { x: 0.72, y: 0.50, words: ['8p', 'eight'] },
  'B2/OV-2': { x: 0.86, y: 0.54, words: ['9.6', 'nine point six', 'three and a half'] },
  'B2/OV-3': { x: 0.50, y: 0.45, words: ['26', 'twenty-six'] },
  'B2/OV-4': { x: 0.60, y: 0.60, words: ['166', 'two and a half'] },
  'B2/OV-5': { x: 0.60, y: 0.60, words: ['176', 'worth paying'] },
  'B2/OV-6': { x: 0.50, y: 0.50, words: ['average'] },
  'B3/OV-5': { x: 0.50, y: 0.35, words: ['42', 'forty-two', '76', 'seventy-six'] }
};
export const DEFAULT_FOCUS = { x: 0.42, y: 0.50, words: [] };
