import { describe, it, expect } from 'vitest';
import returnFalse from '../src/utils/returnFalse';

describe('utils', () => {
    describe('returnFalse', () => {
        it('should return false', () => {
            expect(returnFalse()).toEqual(false);
        });
    });
});
