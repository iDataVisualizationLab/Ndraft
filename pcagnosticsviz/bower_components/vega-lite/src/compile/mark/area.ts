import {VgValueRef} from '../../vega.schema';

import {X, Y} from '../../channel';
import {Orient} from '../../config';
import {isDimension, isMeasure, FieldDef, field} from '../../fielddef';
import {StackProperties} from '../../stack';

import {applyColorAndOpacity, applyMarkConfig} from '../common';
import {UnitModel} from '../unit';

export namespace area {
  export function markType() {
    return 'area';
  }

  export function properties(model: UnitModel) {
    // TODO Use Vega's marks properties interface
    let p: any = {};
    const config = model.config();

    // We should always have orient as we augment it in config.ts
    const orient = config.mark.orient;
    p.orient = { value: orient} ;

    const stack = model.stack();

    p.x = x(model.encoding().x, model.scaleName(X), orient, stack);
    p.y = y(model.encoding().y, model.scaleName(Y), orient, stack);

    // Have only x2 or y2
    const _x2 = x2(model.encoding().x, model.encoding().x2, model.scaleName(X), orient, stack);
    if (_x2) {
      p.x2 = _x2;
    }

    const _y2 = y2(model.encoding().y, model.encoding().y2, model.scaleName(Y), orient, stack);
    if (_y2) {
      p.y2 = _y2;
    }

    applyColorAndOpacity(p, model);
    applyMarkConfig(p, model, ['interpolate', 'tension']);
    return p;
  }

  export function x(fieldDef: FieldDef, scaleName: string, orient: Orient, stack: StackProperties): VgValueRef {
    if (stack && X === stack.fieldChannel) { // Stacked Measure
      return {
        scale: scaleName,
        field: field(fieldDef, { suffix: 'start' })
      };
    } else if (isMeasure(fieldDef)) { // Measure
      if (orient === Orient.HORIZONTAL) {
        // x
        if (fieldDef && fieldDef.field) {
          return {
            scale: scaleName,
            field: field(fieldDef)
          };
        } else {
          return {
            scale: scaleName,
            value: 0
          };
        }
      } else {
        return {
          scale: scaleName,
          field: field(fieldDef)
        };
      }
    } else if (isDimension(fieldDef)) {
      return {
        scale: scaleName,
        field: field(fieldDef, { binSuffix: 'mid' })
      };
    }
    return undefined;
  }

  export function x2(xFieldDef: FieldDef, x2FieldDef: FieldDef, scaleName: string, orient: Orient, stack: StackProperties): VgValueRef {
    // x
    if (orient === Orient.HORIZONTAL) {
      if (stack && X === stack.fieldChannel) { // Stacked Measure
        return {
          scale: scaleName,
          field: field(xFieldDef, { suffix: 'end' })
        };
      } else if (x2FieldDef) {
        if (x2FieldDef.field) {
          return {
            scale: scaleName,
            field: field(x2FieldDef)
          };
        } else if (x2FieldDef.value) {
          return {
            scale: scaleName,
            value: x2FieldDef.value
          };
        }
      }

      // TODO: make this work for log scale

      return {
        scale: scaleName,
        value: 0
      };
    }
    return undefined;
  }

  export function y(fieldDef: FieldDef, scaleName: string, orient: Orient, stack: StackProperties): VgValueRef {
    if (stack && Y === stack.fieldChannel) { // Stacked Measure
      return {
        scale: scaleName,
        field: field(fieldDef, { suffix: 'start' })
      };
    } else if (isMeasure(fieldDef)) {
      if (orient !== Orient.HORIZONTAL) {
        // y
        if (fieldDef && fieldDef.field) {
          return {
            scale: scaleName,
            field: field(fieldDef)
          };
        } else {
          return { field: { group: 'height' } };
        }
      } else {
        return {
          scale: scaleName,
          field: field(fieldDef)
        };
      }
    } else if (isDimension(fieldDef)) {
      return {
        scale: scaleName,
        field: field(fieldDef, { binSuffix: 'mid' })
      };
    }
    return undefined;
  }

  export function y2(yFieldDef: FieldDef, y2FieldDef: FieldDef, scaleName: string, orient: Orient, stack: StackProperties): VgValueRef {
    if (orient !== Orient.HORIZONTAL) {
      if (stack && Y === stack.fieldChannel) { // Stacked Measure
        return {
          scale: scaleName,
          field: field(yFieldDef, { suffix: 'end' })
        };
      } else if (y2FieldDef) {
        // y2
        if (y2FieldDef.field) {
          return {
            scale: scaleName,
            field: field(y2FieldDef)
          };
        } else if (y2FieldDef.value) {
          return {
            scale: scaleName,
            value: y2FieldDef.value
          };
        }
      }

      // TODO: make this work for log scale

      return {
        scale: scaleName,
        value: 0
      };
    }
    return undefined;
  }


  export function labels(model: UnitModel) {
    // TODO(#240): fill this method
    return undefined;
  }
}
