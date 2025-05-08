import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maskPassword',
})
export class MaskPasswordPipe implements PipeTransform {
  transform(password: string, visibleCount: number = 2): string {
    if (!password) return '';
    const visible = password.slice(0, visibleCount);
    const masked = '*'.repeat(Math.max(password.length - visibleCount, 0));
    return visible + masked;
  }
}
