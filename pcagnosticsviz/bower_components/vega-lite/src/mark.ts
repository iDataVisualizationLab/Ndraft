export enum Mark {
  AREA = 'area' as any,
  BAR = 'bar' as any,
  LINE = 'line' as any,
  POINT = 'point' as any,
  TEXT = 'text' as any,
  TICK = 'tick' as any,
  RULE = 'rule' as any,
  CIRCLE = 'circle' as any,
  SQUARE = 'square' as any,
  ERRORBAR = 'errorBar' as any,
  BOXPLOT = 'boxplot' as any,
  HEXAGON = 'hexagon' as any,
  LEADER = 'leader' as any,
  CONTOUR  = 'contour' as any,
  SCATTER3D  = 'scatter3D' as any
}

export const AREA = Mark.AREA;
export const BAR = Mark.BAR;
export const LINE = Mark.LINE;
export const POINT = Mark.POINT;
export const TEXT = Mark.TEXT;
export const TICK = Mark.TICK;
export const RULE = Mark.RULE;
export const BOXPLOT = Mark.BOXPLOT;

export const CIRCLE = Mark.CIRCLE;
export const SQUARE = Mark.SQUARE;

export const ERRORBAR = Mark.ERRORBAR;
export const HEXAGON = Mark.HEXAGON;
export const LEADER = Mark.LEADER;
export const CONTOUR = Mark.CONTOUR;
export const SCATTER3D = Mark.SCATTER3D;

export const PRIMITIVE_MARKS = [AREA, BAR, LINE, POINT, TEXT, TICK, RULE, CIRCLE, SQUARE, BOXPLOT];
